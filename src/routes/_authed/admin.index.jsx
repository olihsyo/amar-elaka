import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Store, Newspaper, Megaphone, Briefcase, Flag, BadgeCheck, Users, TrendingUp, FileText, ChevronRight, Clock } from "lucide-react";
import { base44 } from "@/api/base44Client";

export const Route = createFileRoute("/_authed/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [businesses, news, notices, jobs, pendingBusinesses, pendingJobs, pendingReports] = await Promise.all([
          base44.entities.Business.count({}),
          base44.entities.News.count({}),
          base44.entities.Notice.count({}),
          base44.entities.Job.count({}),
          base44.entities.Business.count({ status: "pending" }),
          base44.entities.Job.count({ status: "pending" }),
          base44.entities.Report.count({ status: "pending" }),
        ]);
        setCounts({ businesses, news, notices, jobs, pendingBusinesses, pendingJobs, pendingReports });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCounts();
  }, []);

  const metrics = [
    { label: "ব্যবসা", value: counts.businesses, icon: Store },
    { label: "খবর", value: counts.news, icon: Newspaper },
    { label: "নোটিশ", value: counts.notices, icon: Megaphone },
    { label: "চাকরি", value: counts.jobs, icon: Briefcase },
  ];

  const pendingTotal = (counts.pendingBusinesses ?? 0) + (counts.pendingJobs ?? 0);

  const modules = [
    { label: "মডারেশন কিউ", desc: "সাবমিশন ও রিপোর্ট পর্যালোচনা", icon: BadgeCheck, to: "/admin/moderation", badge: pendingTotal + (counts.pendingReports ?? 0) },
    { label: "ব্যবসা ম্যানেজমেন্ট", desc: "ভেরিফিকেশন ও ডিলিট", icon: Store, to: "/admin/businesses" },
    { label: "কনটেন্ট ম্যানেজমেন্ট", desc: "খবর ও নোটিশ তৈরি", icon: FileText, to: "/admin/content" },
    { label: "বিজ্ঞাপন ক্যাম্পেইন", desc: "অনুমোদন ও বাতিল", icon: TrendingUp, to: "/admin/campaigns" },
    { label: "ব্যবহারকারী", desc: "রোল ম্যানেজমেন্ট ও ইনভাইট", icon: Users, to: "/admin/users" },
  ];

  return (
    <div className="pb-4">
      <div className="px-4 pt-4">
        <h1 className="font-heading font-bold text-xl text-foreground">অ্যাডমিন প্যানেল</h1>
        <p className="text-sm text-muted-foreground mt-1">সিলেট সদর, সিলেট</p>
      </div>

      <div className="px-4 mt-4 grid grid-cols-2 gap-3">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-card rounded-2xl border border-border p-4">
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5 text-primary" />
                <span className="text-xs text-muted-foreground">{m.label}</span>
              </div>
              <p className="text-2xl font-bold text-foreground mt-2">{loading ? "—" : (m.value ?? 0)}</p>
            </div>
          );
        })}
      </div>

      {pendingTotal + (counts.pendingReports ?? 0) > 0 && (
        <div className="px-4 mt-3">
          <Link to="/admin/moderation" className="block">
            <div className="bg-warning/5 border border-warning/20 rounded-2xl p-4 flex items-center gap-3">
              <Flag className="w-5 h-5 text-warning" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {pendingTotal + (counts.pendingReports ?? 0)} টি আইটেম অপেক্ষমাণ
                </p>
                <p className="text-xs text-muted-foreground">মডারেশন কিউ দেখুন</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </Link>
        </div>
      )}

      <div className="px-4 mt-6">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase mb-2">মডিউল</h2>
        <div className="bg-card rounded-2xl border border-border divide-y divide-border">
          {modules.map((mod, i) => {
            const Icon = mod.icon;
            return (
              <Link key={i} to={mod.to}>
                <div className="w-full flex items-center gap-3 p-4">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-foreground block">{mod.label}</span>
                    <span className="text-xs text-muted-foreground">{mod.desc}</span>
                  </div>
                  {mod.badge > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-warning text-warning-foreground font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {mod.badge}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}