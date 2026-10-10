import { Link } from "@tanstack/react-router";

export default function NewsCard({ news, compact }) {
  return (
    <Link to="/news/$newsId" params={{ newsId: news.id }} className="block min-w-[260px] flex-shrink-0">
      <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm">
        {news.image_url && (
          <div className={`w-full ${compact ? "h-32" : "h-40"} bg-muted overflow-hidden`}>
            <img src={news.image_url} alt={news.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-3">
          <div className="flex items-center gap-2 mb-1">
            {news.sponsored && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-warning/10 text-warning font-medium">বিজ্ঞাপন</span>
            )}
            {news.official && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">দাপ্তরিক</span>
            )}
          </div>
          <h3 className="font-semibold text-sm text-foreground line-clamp-2 leading-snug">{news.title}</h3>
          <p className="text-xs text-muted-foreground mt-1.5">{news.source || "AmarElaka"}</p>
        </div>
      </div>
    </Link>
  );
}