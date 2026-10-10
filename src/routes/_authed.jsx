import { createFileRoute, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { AuthGateError, requireSignedIn } from "@/components/auth/AuthGate";
import { useAuth } from "@/lib/AuthContext";
import Layout from "@/components/Layout";

export const Route = createFileRoute("/_authed")({
  ssr: false,
  beforeLoad: requireSignedIn,
  errorComponent: AuthGateError,
  component: AuthedLayout,
});

function AuthedLayout() {
  const { user, isLoadingAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // First-time onboarding: new users pick their locality before entering the app.
  useEffect(() => {
    if (!isLoadingAuth && user && !user.locality_name && location.pathname !== "/onboarding") {
      navigate({ to: "/onboarding", replace: true });
    }
  }, [isLoadingAuth, user, location.pathname, navigate]);

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}