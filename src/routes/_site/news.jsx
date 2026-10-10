import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useFetch } from "@/lib/useFetch";
import NewsCard from "@/components/amarelaka/NewsCard";
import LoadingState from "@/components/amarelaka/LoadingState";
import EmptyState from "@/components/amarelaka/EmptyState";

export const Route = createFileRoute("/_site/news")({
  head: () => ({ meta: [{ title: "খবর — AmarElaka" }] }),
  component: NewsPage,
});

const tabs = [
  { label: "সব", value: null },
  { label: "দাপ্তরিক", value: "official" },
  { label: "কমিউনিটি", value: "community" },
  { label: "বিজ্ঞাপন", value: "sponsored" },
];

function NewsPage() {
  const [tab, setTab] = useState(null);

  const query = {
    status: "published",
    ...(tab === "official" && { official: true }),
    ...(tab === "sponsored" && { sponsored: true }),
    ...(tab === "community" && { official: false, sponsored: false }),
  };

  const { data, loading } = useFetch("News", query, { limit: 50 });

  return (
    <div className="pb-4">
      <div className="px-4 pt-4">
        <h1 className="font-heading font-bold text-xl text-foreground mb-3">খবর ও নোটিশ</h1>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 pb-1">
        {tabs.map((t) => (
          <button
            key={t.label}
            onClick={() => setTab(t.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              tab === t.value
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {loading ? (
          <LoadingState count={4} />
        ) : data.length > 0 ? (
          <div className="px-4 space-y-3">
            {data.map((n) => (
              <div key={n.id} className="min-w-0">
                <NewsCard news={n} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="কোনো খবর নেই" message="এখনও কোনো খবর প্রকাশিত হয়নি" />
        )}
      </div>
    </div>
  );
}