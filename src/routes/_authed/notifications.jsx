import { createFileRoute } from "@tanstack/react-router";
import { Bell, Megaphone, RefreshCw, ShieldCheck, TrendingUp, CreditCard } from "lucide-react";
import { useFetch } from "@/lib/useFetch";
import LoadingState from "@/components/amarelaka/LoadingState";
import EmptyState from "@/components/amarelaka/EmptyState";

export const Route = createFileRoute("/_authed/notifications")({
  head: () => ({ meta: [{ title: "বিজ্ঞপ্তি — AmarElaka" }] }),
  component: NotificationsPage,
});

const typeIcons = {
  notice: Megaphone,
  update: RefreshCw,
  moderation: ShieldCheck,
  campaign: TrendingUp,
  subscription: CreditCard,
};

function NotificationsPage() {
  const { data, loading } = useFetch("AppNotification", {}, { limit: 50 });

  return (
    <div className="pb-4">
      <div className="px-4 pt-4">
        <h1 className="font-heading font-bold text-xl text-foreground mb-3">বিজ্ঞপ্তি</h1>
      </div>

      {loading ? (
        <LoadingState count={4} />
      ) : data.length > 0 ? (
        <div className="px-4 space-y-2">
          {data.map((n) => {
            const Icon = typeIcons[n.type] || Bell;
            return (
              <div
                key={n.id}
                className={`rounded-2xl border p-4 flex items-start gap-3 ${
                  n.read ? "bg-card border-border" : "bg-primary/5 border-primary/20"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${n.read ? "bg-muted" : "bg-primary/10"}`}>
                  <Icon className={`w-5 h-5 ${n.read ? "text-muted-foreground" : "text-primary"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-foreground">{n.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
                </div>
                {!n.read && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState title="কোনো বিজ্ঞপ্তি নেই" message="নতুন বিজ্ঞপ্তি এলে এখানে দেখাবে" />
      )}
    </div>
  );
}