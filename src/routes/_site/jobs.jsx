import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useFetch } from "@/lib/useFetch";
import JobCard from "@/components/amarelaka/JobCard";
import LoadingState from "@/components/amarelaka/LoadingState";
import EmptyState from "@/components/amarelaka/EmptyState";

export const Route = createFileRoute("/_site/jobs")({
  head: () => ({ meta: [{ title: "চাকরি — AmarElaka" }] }),
  component: JobsPage,
});

const tabs = [
  { label: "সব", value: null },
  { label: "ফুল টাইম", value: "full_time" },
  { label: "পার্ট টাইম", value: "part_time" },
  { label: "টিউশন", value: "tutoring" },
  { label: "প্রশিক্ষণ", value: "training" },
  { label: "ব্যবসা", value: "business" },
];

function JobsPage() {
  const [tab, setTab] = useState(null);
  const query = { status: "active", ...(tab && { type: tab }) };
  const { data, loading } = useFetch("Job", query, { limit: 50 });

  return (
    <div className="pb-4">
      <div className="px-4 pt-4">
        <h1 className="font-heading font-bold text-xl text-foreground mb-3">চাকরির সুযোগ</h1>
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
            {data.map((j) => (
              <JobCard key={j.id} job={j} />
            ))}
          </div>
        ) : (
          <EmptyState title="কোনো চাকরি নেই" message="এখনও কোনো চাকরির বিজ্ঞপ্তি নেই" />
        )}
      </div>

      <div className="px-4 mt-6">
        <div className="rounded-xl bg-warning/5 border border-warning/20 p-3">
          <p className="text-xs text-warning font-medium">⚠️ সতর্কতা</p>
          <p className="text-xs text-muted-foreground mt-1">
            অগ্রিম টাকা চাওয়া এমন কোনো বিজ্ঞপ্তিতে সাবধান থাকুন। সন্দেহজনক বিজ্ঞপ্তি রিপোর্ট করুন।
          </p>
        </div>
      </div>
    </div>
  );
}