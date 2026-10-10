import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useFetch } from "@/lib/useFetch";
import EmergencyCard from "@/components/amarelaka/EmergencyCard";
import LoadingState from "@/components/amarelaka/LoadingState";
import EmptyState from "@/components/amarelaka/EmptyState";

export const Route = createFileRoute("/_site/emergency")({
  head: () => ({ meta: [{ title: "জরুরি সেবা — AmarElaka" }] }),
  component: EmergencyPage,
});

const tabs = [
  { label: "সব", value: null },
  { label: "অ্যাম্বুলেন্স", value: "ambulance" },
  { label: "হাসপাতাল", value: "hospital" },
  { label: "পুলিশ", value: "police" },
  { label: "ফায়ার", value: "fire" },
  { label: "অন্যান্য", value: "other" },
];

function EmergencyPage() {
  const [tab, setTab] = useState(null);
  const query = { ...(tab && { category: tab }) };
  const { data, loading } = useFetch("EmergencyContact", query, { limit: 50 });

  return (
    <div className="pb-4">
      <div className="px-4 pt-4">
        <div className="rounded-2xl p-4" style={{ background: "hsl(4 74% 49%)", color: "white" }}>
          <h1 className="font-heading font-bold text-xl">জরুরি সেবা</h1>
          <p className="text-sm text-white/80 mt-1">নির্ভরযোগ্য জরুরি কন্টাক্ট নম্বর</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 mt-4 pb-1">
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
            {data.map((c) => (
              <EmergencyCard key={c.id} contact={c} />
            ))}
          </div>
        ) : (
          <EmptyState title="কোনো জরুরি কন্টাক্ট নেই" message="এই ক্যাটাগরিতে এখনও কোনো তথ্য নেই" />
        )}
      </div>

      <div className="px-4 mt-6">
        <p className="text-xs text-muted-foreground text-center">
          তথ্য যাচাই করে ব্যবহার করুন। ভুল তথ্য পেলে রিপোর্ট করুন।
        </p>
      </div>
    </div>
  );
}