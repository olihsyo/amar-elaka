import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Share2, Bookmark, Flag } from "lucide-react";
import { useFetchOne } from "@/lib/useFetch";
import LoadingState from "@/components/amarelaka/LoadingState";
import { toast } from "sonner";

export const Route = createFileRoute("/_site/news_/$newsId")({
  head: ({ loaderData }) => ({ meta: [{ title: loaderData?.title ?? "খবর — AmarElaka" }] }),
  component: NewsDetailPage,
});

function NewsDetailPage() {
  const { newsId } = Route.useParams();
  const { data: news, loading } = useFetchOne("News", newsId);

  if (loading) return <LoadingState count={3} />;
  if (!news) return <div className="px-4 pt-8 text-center text-muted-foreground">খবর পাওয়া যায়নি</div>;

  return (
    <div className="pb-4">
      <div className="px-4 pt-4 flex items-center justify-between">
        <Link to="/news">
          <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toast.success("সংরক্ষিত")}
            className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center"
          >
            <Bookmark className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={() => toast.success("শেয়ার করা হয়েছে")}
            className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center"
          >
            <Share2 className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>

      {news.image_url && (
        <div className="mt-4 w-full h-56 bg-muted overflow-hidden">
          <img src={news.image_url} alt={news.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="px-4 mt-4">
        <div className="flex items-center gap-2 mb-2">
          {news.sponsored && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-warning/10 text-warning font-medium">বিজ্ঞাপন</span>
          )}
          {news.official && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">দাপ্তরিক</span>
          )}
          {news.category && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">{news.category}</span>
          )}
        </div>
        <h1 className="font-heading font-bold text-lg text-foreground leading-snug">{news.title}</h1>
        <p className="text-xs text-muted-foreground mt-2">
          {news.source || "AmarElaka"} · {new Date(news.created_date).toLocaleDateString("bn-BD")}
        </p>
        {news.summary && <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{news.summary}</p>}
        <div className="text-sm text-foreground mt-4 leading-relaxed whitespace-pre-wrap">{news.content}</div>

        <button
          onClick={() => toast.success("রিপোর্ট করা হয়েছে")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground mt-6"
        >
          <Flag className="w-3.5 h-3.5" />
          <span>ভুল তথ্য রিপোর্ট করুন</span>
        </button>
      </div>
    </div>
  );
}