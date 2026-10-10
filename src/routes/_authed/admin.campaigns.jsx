import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, X, TrendingUp } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useFetch } from "@/lib/useFetch";
import LoadingState from "@/components/amarelaka/LoadingState";
import EmptyState from "@/components/amarelaka/EmptyState";
import { toast } from "sonner";

export const Route = createFileRoute("/_authed/admin/campaigns")({
  head: () => ({ meta: [{ title: "বিজ্ঞাপন ক্যাম্পেইন — AmarElaka" }] }),
  component: AdminCampaigns,
});

const statusLabels = { pending: "অপেক্ষমাণ", approved: "অনুমোদিত", rejected: "বাতিল", expired: "শেষ" };

function AdminCampaigns() {
  const { data, loading } = useFetch("AdCampaign", {}, { limit: 100 });

  const setStatus = async (c, status) => {
    await base44.entities.AdCampaign.update(c.id, { status });
    await base44.entities.AdminAuditLog.create({
      action: `campaign_${status}`,
      target_type: "campaign",
      target_id: c.id,
    }).catch(() => {});
    toast.success("আপডেট হয়েছে");
  };

  return (
    <div className="pb-4">
      <div className="px-4 pt-4 flex items-center gap-3">
        <Link to="/admin">
          <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </div>
        </Link>
        <h1 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" /> বিজ্ঞাপন ক্যাম্পেইন
        </h1>
      </div>

      <div className="px-4 mt-4 space-y-2">
        {loading ? <LoadingState count={3} /> : data.length === 0 ? (
          <EmptyState title="কোনো ক্যাম্পেইন নেই" message="ব্যবসায়ীরা ক্যাম্পেইন জমা দিলে এখানে দেখা যাবে" compact />
        ) : (
          data.map((c) => (
            <div key={c.id} className="bg-card rounded-xl border border-border p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">{c.business_name}</p>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{statusLabels[c.status] || c.status}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">প্লেসমেন্ট: {c.placement} · বাজেট: {c.budget} ৳</p>
              {c.status === "pending" && (
                <div className="flex gap-2 mt-2">
                  <button onClick={() => setStatus(c, "approved")} className="h-8 px-3 rounded-lg bg-primary/10 text-primary text-xs font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> অনুমোদন
                  </button>
                  <button onClick={() => setStatus(c, "rejected")} className="h-8 px-3 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold flex items-center gap-1">
                    <X className="w-3 h-3" /> বাতিল
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}