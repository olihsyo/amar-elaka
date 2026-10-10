import { Link, useLocation } from "@tanstack/react-router";
import { Home, Compass, Bookmark, Bell, User, MapPin } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

const navItems = [
  { to: "/", icon: Home, label: "হোম" },
  { to: "/explore", icon: Compass, label: "এক্সপ্লোর" },
  { to: "/saved", icon: Bookmark, label: "সংরক্ষিত" },
  { to: "/notifications", icon: Bell, label: "বিজ্ঞপ্তি" },
  { to: "/profile", icon: User, label: "প্রোফাইল" },
];

export default function Layout({ children }) {
  const location = useLocation();
  const { user } = useAuth();
  const locality = user?.locality_name || "সিলেট সদর";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <header className="w-full max-w-[480px] sticky top-0 z-40 bg-surface/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <span className="text-primary-foreground font-bold text-sm" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>আ</span>
            </div>
            <span className="font-heading font-bold text-lg text-foreground tracking-tight">AmarElaka</span>
          </Link>
          <Link to="/locality" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <MapPin className="w-4 h-4 text-primary" />
            <span style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>{locality}</span>
          </Link>
        </div>
      </header>

      <main className="w-full max-w-[480px] flex-1 pb-20">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 z-40">
        <div className="max-w-[480px] mx-auto bg-surface/95 backdrop-blur-lg border-t border-border">
          <div className="flex items-center justify-around h-16 px-2">
            {navItems.map((item) => {
              const active = location.pathname === item.to;
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex flex-col items-center gap-1 px-3 py-1.5 transition-colors"
                >
                  <Icon
                    className={`w-5 h-5 transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}
                    strokeWidth={active ? 2.5 : 2}
                  />
                  <span
                    className={`text-[10px] transition-colors ${active ? "text-primary font-semibold" : "text-muted-foreground"}`}
                    style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}