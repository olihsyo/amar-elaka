import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, Newspaper, Store, Briefcase, Megaphone } from "lucide-react";
import { useFetch } from "@/lib/useFetch";
import LoadingState from "@/components/amarelaka/LoadingState";
import EmptyState from "@/components/amarelaka/EmptyState";

export const Route = createFileRoute("/_authed/saved")({
  head: () => ({ meta: [{ title: "সংরক্ষিত — AmarElaka" }] }),
  component: SavedPage,
});

const typeIcons = {
  news: { icon: Newspaper, to: "/news/$newsId", param: "newsId" },
  business: { icon: Store, to: "/business/$businessId", param: "businessId" },
  job: { icon: Briefcase, to: "/jobs/$jobId", param: "jobId" },
  notice: { icon: Megaphone, to: "/news", param: null },
};

function SavedPage() {
  const { data, loading } = useFetch("Bookmark", {}, { limit: 50 });

  return (
    <div className="pb-4">
      <div className="px-4 pt-4">
        <h1 className="font-heading font-bold text-xl text-foreground mb-3">সংরক্ষিত</h1>
      </div>

      {loading ? (
        <LoadingState count={4} />
      ) : data.length > 0 ? (
        <div className="px-4 space-y-3">
          {data.map((b) => {
            const config = typeIcons[b.item_type] || typeIcons.news;
            const Icon = config.icon;
            return (
              <Link
                key={b.id}
                to={config.to}
                params={config.param ? { [config.param]: b.item_id } : undefined}
                className="block"
              >
                <div className="bg-card rounded-2xl border border-border shadow-sm p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-foreground line-clamp-1">{b.item_title || "সংরক্ষিত আইটেম"}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{b.item_type}</p>
                  </div>
                  <Bookmark className="w-4 h-4 text-primary fill-primary" />
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <EmptyState title="কিছু সংরক্ষিত নেই" message="খবর, ব্যবসা বা চাকরি সংরক্ষণ করুন" />
      )}
    </div>
  );
}