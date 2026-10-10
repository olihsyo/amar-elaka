import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Crown, Check, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useFetch } from "@/lib/useFetch";
import { createCheckoutSession, activateSubscription } from "@/lib/stripe-fns";
import { toast } from "sonner";

export const Route = createFileRoute("/_authed/premium")({
  validateSearch: (search) => ({
    checkout: typeof search.checkout === "string" ? search.checkout : undefined,
    session_id: typeof search.session_id === "string" ? search.session_id : undefined,
  }),
  head: () => ({ meta: [{ title: "Premium — AmarElaka" }] }),
  component: PremiumPage,
});

const benefits = [
  "বিজ্ঞাপন মুক্ত অভিজ্ঞতা",
  "উন্নত ব্যবসা এনালিটিক্স",
  "একাধিক ব্যবসা শাখা",
  "ব্যবসা লিস্টিং টুলস",
  "প্রমোশনাল ম্যানেজমেন্ট",
];

const plans = [
  { plan: "premium_monthly", name: "মাসিক", note: "প্রতি মাস", price: "৳১৯৯", popular: true },
  { plan: "premium_yearly", name: "বার্ষিক", note: "প্রতি বছর — ২ মাস সাশ্রয়", price: "৳১,৯৯০", popular: false },
];

function PremiumPage() {
  const { user } = useAuth();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const router = useRouter();
  const { data: subscription, loading } = useFetch("SubscriptionRecord", { status: "active" }, { limit: 1 });
  const isPremium = subscription && subscription.length > 0;
  const activating = useRef(false);

  const startCheckout = useServerFn(createCheckoutSession);
  const activate = useServerFn(activateSubscription);

  // Return from Stripe Checkout: activate the subscription, then clean the URL.
  useEffect(() => {
    if (search.checkout === "success" && search.session_id && !activating.current) {
      activating.current = true;
      activate({ data: { session_id: search.session_id } })
        .then(() => toast.success("সাবস্ক্রিপশন সক্রিয় হয়েছে"))
        .catch((e) => toast.error(e?.message || "সাবস্ক্রিপশন সক্রিয় করা যায়নি"))
        .finally(() => navigate({ to: "/premium", replace: true }).then(() => router.invalidate()));
    } else if (search.checkout === "cancelled" && !activating.current) {
      activating.current = true;
      toast.info("পেমেন্ট বাতিল করা হয়েছে");
      navigate({ to: "/premium", replace: true });
    }
  }, [search.checkout, search.session_id, activate, navigate, router]);

  async function handleSubscribe(plan) {
    const isFramed = window.self !== window.top;
    const checkoutTab = isFramed ? window.open("", "_blank") : null;
    if (isFramed && !checkoutTab) {
      toast.error("চেকআউট খুলতে পপ-আপ অনুমতি দিন");
      return;
    }
    if (checkoutTab) checkoutTab.opener = null;
    try {
      const { url } = await startCheckout({ data: { plan } });
      if (checkoutTab) {
        checkoutTab.location.replace(url);
      } else {
        window.location.assign(url);
      }
    } catch (e) {
      checkoutTab?.close();
      toast.error(e?.message || "চেকআউট শুরু করা যায়নি");
    }
  }

  return (
    <div className="pb-4">
      <div className="px-4 pt-4 flex items-center gap-3">
        <Link to="/profile">
          <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </div>
        </Link>
      </div>

      <div className="px-4 mt-4 text-center">
        <div className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(153 77% 37%), hsl(159 59% 20%))" }}>
          <Crown className="w-10 h-10 text-white" />
        </div>
        <h1 className="font-heading font-bold text-2xl text-foreground mt-4">AmarElaka Premium</h1>
        <p className="text-sm text-muted-foreground mt-1">আরও সেবা, আরও সুবিধা</p>
      </div>

      {isPremium && (
        <div className="px-4 mt-4">
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 text-center">
            <p className="text-sm text-primary font-medium">আপনি একজন Premium ব্যবহারকারী</p>
            <p className="text-xs text-muted-foreground mt-1">সাবস্ক্রিপশন সক্রিয়</p>
          </div>
        </div>
      )}

      <div className="px-4 mt-6">
        <h2 className="font-semibold text-sm text-foreground mb-3">Premium সুবিধাসমূহ</h2>
        <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
          {benefits.map((benefit, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm text-foreground">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 mt-6">
        <h2 className="font-semibold text-sm text-foreground mb-3">প্ল্যান</h2>
        <div className="space-y-3">
          {plans.map((p) => (
            <div key={p.plan} className={`bg-card rounded-2xl p-4 ${p.popular ? "border-2 border-primary" : "border border-border"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-foreground">{p.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{p.note}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">{p.price}</p>
                  {p.popular && <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">জনপ্রিয়</span>}
                </div>
              </div>
              <button
                onClick={() => handleSubscribe(p.plan)}
                disabled={loading || isPremium}
                className={`w-full mt-4 h-11 rounded-xl font-semibold text-sm active:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-50 ${p.popular ? "bg-primary text-primary-foreground" : "border border-primary text-primary"}`}
              >
                {isPremium ? "সাবস্ক্রাইব করা আছে" : "সাবস্ক্রাইব করুন"}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 mt-6">
        <div className="bg-muted rounded-xl p-3">
          <p className="text-xs text-muted-foreground text-center">
            জরুরি সেবা, দাপ্তরিক নোটিশ ও সাধারণ ডিরেক্টরি সবার জন্য বিনামূল্যে।
            Premium শুধুমাত্র অতিরিক্ত সেবার জন্য।
          </p>
        </div>
      </div>
    </div>
  );
}