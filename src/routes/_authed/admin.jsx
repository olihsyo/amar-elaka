import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export const Route = createFileRoute("/_authed/admin")({
  head: () => ({ meta: [{ title: "অ্যাডমিন — AmarElaka" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const { user } = useAuth();

  if (user?.role !== "admin") {
    return (
      <div className="px-4 pt-16 text-center">
        <ShieldAlert className="w-12 h-12 text-muted-foreground mx-auto" />
        <h2 className="font-semibold text-sm text-foreground mt-3">অ্যাক্সেস অগ্রাহ্য</h2>
        <p className="text-xs text-muted-foreground mt-1">এই পৃষ্ঠা শুধু অ্যাডমিনদের জন্য।</p>
      </div>
    );
  }

  return <Outlet />;
}