import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireUser } from "@/lib/auth-middleware";

const PUBLISHED_HOST = "https://amar-elaka-link.base44.app";

// Stripe price IDs created for AmarElaka Premium (BDT ৳199/month, ৳1990/year)
const PLAN_PRICES = {
  premium_monthly: "price_1UOqQLB0uGoZ8Zfs8MTW53rE",
  premium_yearly: "price_1UOqQMB0uGoZ8ZfsQ47ioPca",
};

// Server-only helpers, loaded dynamically so they never enter the client bundle.
async function getSecret(name) {
  const { secrets } = await import("base44:runtime");
  return secrets.get(name);
}

async function stripeCall(path, params, idemKey) {
  const key = await getSecret("STRIPE_SECRET_KEY");
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Stripe-Version": "2025-10-29.clover",
      ...(idemKey ? { "Idempotency-Key": idemKey } : {}),
    },
    body: new URLSearchParams(params).toString(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || "Stripe API call failed");
  return data;
}

export const createCheckoutSession = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(z.object({ plan: z.enum(["premium_monthly", "premium_yearly"]) }))
  .handler(async ({ data, context }) => {
    const appId = (await getSecret("BASE44_APP_ID")) || "amar-elaka-link";
    const session = await stripeCall(
      "checkout/sessions",
      {
        mode: "subscription",
        "line_items[0][price]": PLAN_PRICES[data.plan],
        "line_items[0][quantity]": "1",
        success_url: `${PUBLISHED_HOST}/premium?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${PUBLISHED_HOST}/premium?checkout=cancelled`,
        client_reference_id: context.user.id,
        "metadata[base44_app_id]": appId,
        "metadata[user_id]": context.user.id,
        "metadata[plan]": data.plan,
        "subscription_data[metadata][base44_app_id]": appId,
      },
      `checkout-${context.user.id}-${data.plan}`,
    );
    return { url: session.url, id: session.id };
  });

export const activateSubscription = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(z.object({ session_id: z.string().min(1) }))
  .handler(async ({ data, context }) => {
    const key = await getSecret("STRIPE_SECRET_KEY");
    const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(data.session_id)}`, {
      headers: { Authorization: `Bearer ${key}`, "Stripe-Version": "2025-10-29.clover" },
    });
    const session = await res.json();
    if (!res.ok) throw new Error(session?.error?.message || "Stripe API call failed");

    const plan = session?.metadata?.plan;
    const userId = session?.metadata?.user_id;
    if (!session || session.payment_status !== "paid" || session.mode !== "subscription") {
      throw new Error("Payment is not completed yet");
    }
    if (userId !== context.user.id) {
      throw new Error("This checkout session belongs to another user");
    }
    if (!PLAN_PRICES[plan]) throw new Error("Unknown plan");

    // Idempotency: skip if this user already has an active record for the plan
    const existing = await context.getBase44().entities.SubscriptionRecord.filter(
      { status: "active", plan },
      { limit: 1 },
    );
    if (existing.items && existing.items.length > 0) return { alreadyActive: true };

    const start = new Date();
    const end = new Date(start);
    if (plan === "premium_yearly") end.setFullYear(end.getFullYear() + 1);
    else end.setMonth(end.getMonth() + 1);

    await context.getBase44().entities.SubscriptionRecord.create({
      plan,
      status: "active",
      start_date: start.toISOString().slice(0, 10),
      end_date: end.toISOString().slice(0, 10),
      amount: plan === "premium_yearly" ? 1990 : 199,
    });
    return { activated: true };
  });