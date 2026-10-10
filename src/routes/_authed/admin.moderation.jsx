import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, X, Flag, Store, Briefcase } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useFetch } from "@/lib/useFetch";
import LoadingState from "@/components/amarelaka/LoadingState";
import EmptyState from "@/components/amarelaka/EmptyState";
import { toast } from "sonner";

export const Route = createFileRoute("/_authed/admin/moderation")({
  head: () => ({ meta: [{ title: "মডারেশন — AmarElaka" }] }),
  component: Moderation,
});

async function logAudit(action, targetType, targetId) {
  try {
    await base44.entities.AdminAuditLog.create({ action, target_type: targetType, target_id: targetId });
  } catch (e) {
    console.error(e);
  }
}

function ActionButton({ onClick, children, variant }) {
  const cls = variant === "approve"
    ? "bg-primary/10 text-primary"
    : variant === "reject"
      ? "bg-destructive/10 text-destructive"
      : "bg-muted text-muted-foreground";
  return (
    <button onClick={onClick} className={`h-8 px-3 rounded-lg text-xs font-semibold ${cls}`}>
      {children}
    </button>
  );
}

function Moderation() {
  const { data: pendingBusinesses, loading: lb } = useFetch("Business", { status: "pending" });
  const { data: pendingJobs, loading: lj } = useFetch("Job", { status: "pending" });
  const { data: reports, loading: lr } = useFetch("Report", { status: "pending" });

  const approveBusiness = async (b) => {
    await base44.entities.Business.update(b.id, { status: "active" });
    await logAudit("business_approved", "business", b.id);
    toast.success("অনুমোদিত");
  };
  const rejectBusiness = async (b) => {
    await base44.entities.Business.update(b.id, { status: "rejected" });
    await logAudit("business_rejected", "business", b.id);
    toast.success("বাতিল হয়েছে");
  };
  const approveJob = async (j) => {
    await base44.entities.Job.update(j.id, { status: "active" });
    await logAudit("job_approved", "job", j.id);
    toast.success("অনুমোদিত");
  };
  const rejectJob = async (j) => {
    await base44.entities.Job.update(j.id, { status: "closed" });
    await logAudit("job_rejected", "job", j.id);
    toast.success("বাতিল হয়েছে");
  };
  const resolveReport = async (r) => {
    await base44.entities.Report.update(r.id, { status: "resolved" });
    await logAudit("report_resolved", "report", r.id);
    toast.success("সমাধান হয়েছে");
  };
  const dismissReport = async (r) => {
    await base44.entities.Report.update(r.id, { status: "dismissed" });
    await logAudit("report_dismissed", "report", r.id);
    toast.success("বাতিল হয়েছে");
  };

  return (
    <div className="pb-4">
      <div className="px-4 pt-4 flex items-center gap-3">
        <Link to="/admin">
          <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </div>
        </Link>
        <h1 className="font-heading font-bold text-lg text-foreground">মডারেশন কিউ</h1>
      </div>

      {/* Pending businesses */}
      <div className="px-4 mt-4">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase mb-2 flex items-center gap-1">
          <Store className="w-3 h-3" /> নতুন ব্যবসা ({lb ? "—" : pendingBusinesses.length})
        </h2>
        {lb ? <LoadingState count={2} /> : pendingBusinesses.length === 0 ? (
          <EmptyState title="সব পর্যালোচিত" message="নতুন ব্যবসা সাবমিশন নেই" compact />
        ) : (
          <div className="space-y-2">
            {pendingBusinesses.map((b) => (
              <div key={b.id} className="bg-card rounded-xl border border-border p-3">
                <p className="text-sm font-semibold text-foreground">{b.name}</p>
                <p className="text-xs text-muted-foreground">{b.category} · {b.locality_name || "—"}</p>
                <div className="flex gap-2 mt-2">
                  <ActionButton variant="approve" onClick={() => approveBusiness(b)}>অনুমোদন</ActionButton>
                  <ActionButton variant="reject" onClick={() => rejectBusiness(b)}>বাতিল</ActionButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending jobs */}
      <div className="px-4 mt-5">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase mb-2 flex items-center gap-1">
          <Briefcase className="w-3 h-3" /> নতুন চাকরি ({lj ? "—" : pendingJobs.length})
        </h2>
        {lj ? <LoadingState count={2} /> : pendingJobs.length === 0 ? (
          <EmptyState title="সব পর্যালোচিত" message="নতুন চাকরি সাবমিশন নেই" compact />
        ) : (
          <div className="space-y-2">
            {pendingJobs.map((j) => (
              <div key={j.id} className="bg-card rounded-xl border border-border p-3">
                <p className="text-sm font-semibold text-foreground">{j.title}</p>
                <p className="text-xs text-muted-foreground">{j.company || "—"} · {j.location || "—"}</p>
                <div className="flex gap-2 mt-2">
                  <ActionButton variant="approve" onClick={() => approveJob(j)}>অনুমোদন</ActionButton>
                  <ActionButton variant="reject" onClick={() => rejectJob(j)}>বাতিল</ActionButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reports */}
      <div className="px-4 mt-5">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase mb-2 flex items-center gap-1">
          <Flag className="w-3 h-3" /> রিপোর্ট ({lr ? "—" : reports.length})
        </h2>
        {lr ? <LoadingState count={2} /> : reports.length === 0 ? (
          <EmptyState title="কোনো রিপোর্ট নেই" message="নতুন রিপোর্ট অপেক্ষমাণ নেই" compact />
        ) : (
          <div className="space-y-2">
            {reports.map((r) => (
              <div key={r.id} className="bg-card rounded-xl border border-border p-3">
                <p className="text-xs text-muted-foreground">{r.item_type} · রিপোর্ট #{r.item_id?.slice(-6)}</p>
                <p className="text-sm text-foreground mt-0.5">{r.reason}</p>
                <div className="flex gap-2 mt-2">
                  <ActionButton variant="approve" onClick={() => resolveReport(r)}>সমাধান</ActionButton>
                  <ActionButton variant="reject" onClick={() => dismissReport(r)}>বাতিল</ActionButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}