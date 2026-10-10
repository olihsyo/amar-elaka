import { createFileRoute, Link } from "@tanstack/react-router";
import { Store, Briefcase, Plus, Pencil, Trash2, ArrowLeft, Clock } from "lucide-react";
import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useFetch } from "@/lib/useFetch";
import { toast } from "sonner";
import EmptyState from "@/components/amarelaka/EmptyState";
import LoadingState from "@/components/amarelaka/LoadingState";

export const Route = createFileRoute("/_authed/my-listings")({
  head: () => ({ meta: [{ title: "আমার লিস্টিং — AmarElaka" }] }),
  component: MyListings,
});

const statusLabels = {
  pending: { label: "যাচাইয়ের অপেক্ষায়", cls: "bg-warning/10 text-warning" },
  active: { label: "সক্রিয়", cls: "bg-primary/10 text-primary" },
  closed: { label: "বন্ধ", cls: "bg-muted text-muted-foreground" },
  rejected: { label: "বাতিল", cls: "bg-destructive/10 text-destructive" },
};

function StatusBadge({ status }) {
  const s = statusLabels[status] || statusLabels.active;
  return <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${s.cls}`}>{s.label}</span>;
}

function MyListings() {
  const { user } = useAuth();
  const [tab, setTab] = useState("business");
  const { data: businesses, loading: lb } = useFetch("Business", user ? { created_by_id: user.id } : {});
  const { data: jobs, loading: lj } = useFetch("Job", user ? { created_by_id: user.id } : {});

  const remove = async (entity, id) => {
    await base44.entities[entity].delete(id);
    toast.success("মুছে ফেলা হয়েছে");
  };

  return (
    <div className="pb-4">
      <div className="px-4 pt-4 flex items-center gap-3">
        <Link to="/profile">
          <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </div>
        </Link>
        <h1 className="font-heading font-bold text-xl text-foreground">আমার লিস্টিং</h1>
      </div>

      <div className="px-4 mt-4 grid grid-cols-2 gap-3">
        <Link to="/submit-business">
          <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Plus className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">ব্যবসা</p>
              <p className="text-xs text-muted-foreground">যোগ করুন</p>
            </div>
          </div>
        </Link>
        <Link to="/submit-job">
          <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Plus className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">চাকরি</p>
              <p className="text-xs text-muted-foreground">পোস্ট করুন</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="px-4 mt-4 flex gap-2">
        <button
          onClick={() => setTab("business")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${tab === "business" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border"}`}
        >
          ব্যবসা ({lb ? "—" : businesses.length})
        </button>
        <button
          onClick={() => setTab("job")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${tab === "job" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border"}`}
        >
          চাকরি ({lj ? "—" : jobs.length})
        </button>
      </div>

      <div className="px-4 mt-3 space-y-3">
        {tab === "business" ? (
          lb ? <LoadingState count={3} /> : businesses.length === 0 ? (
            <EmptyState title="কোনো ব্যবসা নেই" message="নিজের ব্যবসা যোগ করুন" />
          ) : (
            businesses.map((b) => (
              <div key={b.id} className="bg-card rounded-2xl border border-border p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-sm text-foreground line-clamp-1">{b.name}</h3>
                      <StatusBadge status={b.status} />
                      {b.verified && <span className="text-[10px] text-primary font-medium">✓ যাচাইকৃত</span>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{b.category}</p>
                  </div>
                  <div className="flex gap-1">
                    <Link to="/edit-business" search={{ id: b.id }}>
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                        <Pencil className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </Link>
                    <button onClick={() => remove("Business", b.id)}>
                      <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </div>
                    </button>
                  </div>
                </div>
                {b.status === "pending" && (
                  <p className="text-xs text-warning mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> অ্যাডমিন যাচাই করছেন
                  </p>
                )}
              </div>
            ))
          )
        ) : (
          lj ? <LoadingState count={3} /> : jobs.length === 0 ? (
            <EmptyState title="কোনো চাকরি নেই" message="চাকরি পোস্ট করুন" />
          ) : (
            jobs.map((j) => (
              <div key={j.id} className="bg-card rounded-2xl border border-border p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-sm text-foreground line-clamp-1">{j.title}</h3>
                      <StatusBadge status={j.status} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{j.company || "—"} · {j.salary || "—"}</p>
                  </div>
                  <div className="flex gap-1">
                    <Link to="/edit-job" search={{ id: j.id }}>
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                        <Pencil className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </Link>
                    <button onClick={() => remove("Job", j.id)}>
                      <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </div>
                    </button>
                  </div>
                </div>
                {j.status === "pending" && (
                  <p className="text-xs text-warning mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> অ্যাডমিন যাচাই করছেন
                  </p>
                )}
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
}