import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Siren, ArrowRight } from "lucide-react";
import { useFetch } from "@/lib/useFetch";
import SectionHeader from "@/components/amarelaka/SectionHeader";
import NewsCard from "@/components/amarelaka/NewsCard";
import BusinessCard from "@/components/amarelaka/BusinessCard";
import JobCard from "@/components/amarelaka/JobCard";
import NoticeCard from "@/components/amarelaka/NoticeCard";
import CategoryTile from "@/components/amarelaka/CategoryTile";
import LoadingState from "@/components/amarelaka/LoadingState";

export const Route = createFileRoute("/_site/")({
  head: () => ({ meta: [{ title: "AmarElaka — হোম" }] }),
  component: HomePage,
});

const categories = [
  { name_bn: "হাসপাতাল", icon: "hospital" },
  { name_bn: "ফার্মেসি", icon: "pharmacy" },
  { name_bn: "স্কুল-কলেজ", icon: "school" },
  { name_bn: "সরকারি অফিস", icon: "government" },
  { name_bn: "ব্যবসা", icon: "business" },
  { name_bn: "মেরামত", icon: "repair" },
  { name_bn: "পরিবহন", icon: "transport" },
  { name_bn: "কমিউনিটি", icon: "community" },
];

function HomePage() {
  const { data: news, loading: newsLoading } = useFetch("News", { status: "published" }, { limit: 10 });
  const { data: notices, loading: noticesLoading } = useFetch("Notice", { status: "published" }, { limit: 5 });
  const { data: businesses, loading: bizLoading } = useFetch("Business", { verified: true }, { limit: 6 });
  const { data: jobs, loading: jobsLoading } = useFetch("Job", { status: "active" }, { limit: 4 });

  return (
    <div className="pb-4">
      <div className="px-4 pt-4">
        <Link to="/explore" className="block">
          <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 h-12">
            <Search className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">খুঁজুন...</span>
          </div>
        </Link>
      </div>

      <div className="px-4 mt-4">
        <Link to="/emergency" className="block">
          <div className="rounded-2xl p-4 flex items-center justify-between active:scale-[0.98] transition-transform" style={{ background: "linear-gradient(135deg, hsl(153 77% 37%), hsl(159 59% 20%))" }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Siren className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">জরুরি সেবা</h3>
                <p className="text-xs text-white/80">অ্যাম্বুলেন্স, হাসপাতাল, পুলিশ, ফায়ার</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-white" />
          </div>
        </Link>
      </div>

      <div className="mt-6">
        <SectionHeader title="সেবা ক্যাটাগরি" />
        <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-2">
          {categories.map((cat) => (
            <CategoryTile key={cat.icon} category={cat} />
          ))}
        </div>
      </div>

      <div className="mt-6">
        <SectionHeader title="সর্বশেষ খবর" to="/news" />
        {newsLoading ? (
          <LoadingState count={2} />
        ) : news.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-2">
            {news.map((n) => (
              <NewsCard key={n.id} news={n} compact />
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-6">
        <SectionHeader title="নোটিশ" />
        {noticesLoading ? (
          <LoadingState count={2} />
        ) : notices.length > 0 ? (
          <div className="px-4 space-y-3">
            {notices.map((n) => (
              <NoticeCard key={n.id} notice={n} />
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-6">
        <SectionHeader title="যাচাইকৃত ব্যবসা" to="/explore" />
        {bizLoading ? (
          <LoadingState count={2} />
        ) : businesses.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 px-4">
            {businesses.map((b) => (
              <BusinessCard key={b.id} business={b} />
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-6">
        <SectionHeader title="চাকরির সুযোগ" to="/jobs" />
        {jobsLoading ? (
          <LoadingState count={2} />
        ) : jobs.length > 0 ? (
          <div className="px-4 space-y-3">
            {jobs.map((j) => (
              <JobCard key={j.id} job={j} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}