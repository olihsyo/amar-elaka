import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useTheme } from "next-themes";
import { MapPin, Globe, Moon, Bell, Crown, Shield, FileText, Lock, LogOut, LifeBuoy, ChevronRight, Store } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";

export const Route = createFileRoute("/_authed/profile")({
  head: () => ({ meta: [{ title: "প্রোফাইল — AmarElaka" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/" });
  };

  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const settingsItems = [
    { icon: MapPin, label: "এলাকা", value: user?.locality_name || "সিলেট সদর", to: "/locality" },
    { icon: Store, label: "আমার লিস্টিং", to: "/my-listings" },
    { icon: Globe, label: "ভাষা", value: "বাংলা", action: () => toast.info("শীঘ্রই আসছে") },
    { icon: Moon, label: "থিম", value: isDark ? "ডার্ক" : "লাইট", action: () => setTheme(isDark ? "light" : "dark") },
    { icon: Bell, label: "বিজ্ঞপ্তি সেটিংস", action: () => toast.info("শীঘ্রই আসছে") },
  ];

  const aboutItems = [
    { icon: FileText, label: "শর্তাবলী", to: "/terms" },
    { icon: Lock, label: "গোপনীয়তা নীতি", to: "/privacy" },
    { icon: LifeBuoy, label: "সাপোর্ট", action: () => toast.info("শীঘ্রই আসছে") },
  ];

  return (
    <div className="pb-4">
      <div className="px-4 pt-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-foreground">
              {user?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
            </span>
          </div>
          <div>
            <h1 className="font-heading font-bold text-lg text-foreground">{user?.full_name || "ব্যবহারকারী"}</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-6">
        <Link to="/premium" className="block">
          <div className="rounded-2xl p-4 flex items-center justify-between" style={{ background: "linear-gradient(135deg, hsl(153 77% 37%), hsl(159 59% 20%))" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Premium</h3>
                <p className="text-xs text-white/80">বিজ্ঞাপন মুক্ত অভিজ্ঞতা</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white" />
          </div>
        </Link>
      </div>

      {user?.role === "admin" && (
        <div className="px-4 mt-3">
          <Link to="/admin" className="block">
            <div className="bg-card rounded-2xl border border-border p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground text-sm">অ্যাডমিন প্যানেল</h3>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Link>
        </div>
      )}

      <div className="px-4 mt-6">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase mb-2">সেটিংস</h2>
        <div className="bg-card rounded-2xl border border-border divide-y divide-border">
          {settingsItems.map((item, i) => {
            const Icon = item.icon;
            const content = (
              <div className="w-full flex items-center gap-3 p-4 text-left">
                <Icon className="w-5 h-5 text-muted-foreground" />
                <span className="flex-1 text-sm text-foreground">{item.label}</span>
                {item.value && <span className="text-sm text-muted-foreground">{item.value}</span>}
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            );
            return item.to ? (
              <Link key={i} to={item.to}>{content}</Link>
            ) : (
              <button key={i} onClick={item.action} className="w-full">{content}</button>
            );
          })}
        </div>
      </div>

      <div className="px-4 mt-4">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase mb-2">সম্পর্কে</h2>
        <div className="bg-card rounded-2xl border border-border divide-y divide-border">
          {aboutItems.map((item, i) => {
            const Icon = item.icon;
            const content = (
              <div className="w-full flex items-center gap-3 p-4 text-left">
                <Icon className="w-5 h-5 text-muted-foreground" />
                <span className="flex-1 text-sm text-foreground">{item.label}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            );
            return item.to ? (
              <Link key={i} to={item.to}>{content}</Link>
            ) : (
              <button key={i} onClick={item.action} className="w-full">{content}</button>
            );
          })}
        </div>
      </div>

      <div className="px-4 mt-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 h-12 rounded-xl border border-destructive/20 text-destructive font-medium text-sm"
        >
          <LogOut className="w-4 h-4" />
          সাইন আউট
        </button>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-4">AmarElaka v1.0.0</p>
    </div>
  );
}