import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BadgeCheck, Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useFetch } from "@/lib/useFetch";
import LoadingState from "@/components/amarelaka/LoadingState";
import EmptyState from "@/components/amarelaka/EmptyState";
import { toast } from "sonner";

export const Route = createFileRoute("/_authed/admin/businesses")({
  head: () => ({ meta: [{ title: "ব্যবসা ম্যানেজমেন্ট — AmarElaka" }] }),
  component: AdminBusinesses,
});

const statusLabels = { pending: "অপেক্ষমাণ", active: "সক্রিয়", rejected: "বাতিল" };

function AdminBusinesses() {
  const { data, loading } = useFetch("Business", {}, { limit: 100 });

  const toggleVerify = async (b) => {
    await base44.entities.Business.update(b.id, { verified: !b.verified });
    await base44.entities.AdminAuditLog.create({
      action: b.verified ? "business_unverified" : "business_verified",
      target_type: "business",
      target_id: b.id,
    }).catch(() => {});
    toast.success(b.verified ? "যাচাই বাতিল" : "যাচাইকৃত");
  };

  const remove = async (b) => {
    await base44.entities.Business.delete(b.id);
    toast.success("মুছে ফেলা হয়েছে");
  };

  return (
    <div className="pb-4">
      <div className="px-4 pt-4 flex items-center gap-3">
        <Link to="/admin">
          <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </div>
        </Link>
        <h1 className="font-heading font-bold text-lg text-foreground">ব্যবসা ম্যানেজমেন্ট</h1>
      </div>

      <div className="px-4 mt-4 space-y-2">
        {loading ? <LoadingState count={5} /> : data.length === 0 ? (
          <EmptyState title="কোনো ব্যবসা নেই" />
        ) : (
          data.map((b) => (
            <div key={b.id} className="bg-card rounded-xl border border-border p-3 flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-foreground line-clamp-1">{b.name}</p>
                  {b.verified && <BadgeCheck className="w-4 h-4 text-primary" />}
                  {b.status !== "active" && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{statusLabels[b.status] || b.status}</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{b.category} · {b.locality_name || "—"}</p>
              </div>
              <button onClick={() => toggleVerify(b)} className="h-8 px-3 rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                {b.verified ? "যাচাই বাতিল" : "যাচাই"}
              </button>
              <button onClick={() => remove(b)} className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Trash2 className="w-4 h-4 text-destructive" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}