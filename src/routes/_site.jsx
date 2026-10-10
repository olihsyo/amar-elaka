import { createFileRoute, Outlet } from "@tanstack/react-router";
import Layout from "@/components/Layout";

export const Route = createFileRoute("/_site")({
  component: SiteLayout,
});

function SiteLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}