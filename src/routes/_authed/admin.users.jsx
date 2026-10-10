import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Trash2, Send, Shield, User } from "lucide-react";
import { base44 } from "@/api/base44Client";
import LoadingState from "@/components/amarelaka/LoadingState";
import { toast } from "sonner";

export const Route = createFileRoute("/_authed/admin/users")({
  head: () => ({ meta: [{ title: "ব্যবহারকারী — AmarElaka" }] }),
  component: AdminUsers,
});

function AdminUsers() {
  const [users, setUsers] = useState(null);
  const [email, setEmail] = useState("");
  const [inviting, setInviting] = useState(false);

  async function load() {
    try {
      const res = await base44.entities.User.list();
      const list = Array.isArray(res) ? res : (res.items ?? []);
      setUsers(list.slice(0, 100));
    } catch (e) {
      console.error(e);
      setUsers([]);
    }
  }
  useEffect(() => { load(); }, []);

  const toggleRole = async (u) => {
    const newRole = u.role === "admin" ? "user" : "admin";
    await base44.entities.User.update(u.id, { role: newRole });
    toast.success(newRole === "admin" ? "অ্যাডমিন করা হয়েছে" : "সাধারণ ব্যবহারকারী করা হয়েছে");
    load();
  };

  const invite = async () => {
    if (!email.trim()) return;
    setInviting(true);
    try {
      await base44.users.inviteUser(email.trim(), "user");
      toast.success("ইনভাইট পাঠানো হয়েছে");
      setEmail("");
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="pb-4">
      <div className="px-4 pt-4 flex items-center gap-3">
        <Link to="/admin">
          <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </div>
        </Link>
        <h1 className="font-heading font-bold text-lg text-foreground">ব্যবহারকারী</h1>
      </div>

      <div className="px-4 mt-4">
        <div className="bg-card rounded-2xl border border-border p-4">
          <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <Send className="w-4 h-4 text-primary" /> নতুন ব্যবহারকারী ইনভাইট
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ইমেইল ঠিকানা"
              className="flex-1 h-10 rounded-xl border border-input bg-background px-3 text-sm"
            />
            <button
              onClick={invite}
              disabled={inviting || !email.trim()}
              className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50"
            >
              পাঠান
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-2">
        {users === null ? <LoadingState count={4} /> : (
          users.map((u) => (
            <div key={u.id} className="bg-card rounded-xl border border-border p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-primary">{(u.full_name || u.email || "U")[0]?.toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground line-clamp-1">{u.full_name || "—"}</p>
                <p className="text-xs text-muted-foreground truncate">{u.email}</p>
              </div>
              <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${u.role === "admin" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                {u.role === "admin" ? "অ্যাডমিন" : "ব্যবহারকারী"}
              </span>
              <button
                onClick={() => toggleRole(u)}
                className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center"
                title="রোল পরিবর্তন"
              >
                {u.role === "admin" ? <User className="w-4 h-4 text-muted-foreground" /> : <Shield className="w-4 h-4 text-primary" />}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}