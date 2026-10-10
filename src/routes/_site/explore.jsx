import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, BadgeCheck } from "lucide-react";
import { useFetch } from "@/lib/useFetch";
import BusinessCard from "@/components/amarelaka/BusinessCard";
import LoadingState from "@/components/amarelaka/LoadingState";
import EmptyState from "@/components/amarelaka/EmptyState";

export const Route = createFileRoute("/_site/explore")({
  head: () => ({ meta: [{ title: "এক্সপ্লোর — AmarElaka" }] }),
  component: ExplorePage,
});

const categoryFilters = [
  { label: "সব", value: null },
  { label: "হাসপাতাল", value: "হাসপাতাল ও ক্লিনিক" },
  { label: "ফার্মেসি", value: "ফার্মেসি" },
  { label: "স্কুল-কলেজ", value: "স্কুল ও কলেজ" },
  { label: "সরকারি অফিস", value: "সরকারি অফিস" },
  { label: "ব্যবসা", value: "ব্যবসা" },
  { label: "মেরামত", value: "মেরামত ও সেবা" },
  { label: "পরিবহন", value: "পরিবহন" },
  { label: "কমিউনিটি", value: "কমিউনিটি" },
];

function ExplorePage() {
  const [search, setSearch] = useState("");
  const [committedSearch, setCommittedSearch] = useState("");
  const [category, setCategory] = useState(null);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const query = {
    ...(committedSearch && { name: { $regex: committedSearch, $options: "i" } }),
    ...(category && { category }),
    ...(verifiedOnly && { verified: true }),
  };

  const { data, loading } = useFetch("Business", query, { limit: 50 });

  const handleSearch = (e) => {
    e.preventDefault();
    setCommittedSearch(search);
  };

  return (
    <div className="pb-4">
      <div className="px-4 pt-4">
        <h1 className="font-heading font-bold text-xl text-foreground mb-3">এক্সপ্লোর</h1>
        <form onSubmit={handleSearch}>
          <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 h-12">
            <Search className="w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ব্যবসা খুঁজুন..."
              className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </form>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 mt-3 pb-1">
        {categoryFilters.map((cat) => (
          <button
            key={cat.label}
            onClick={() => setCategory(cat.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              category === cat.value
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="px-4 mt-3">
        <button
          onClick={() => setVerifiedOnly(!verifiedOnly)}
          className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
            verifiedOnly ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <BadgeCheck className="w-4 h-4" />
          <span>শুধু যাচাইকৃত</span>
          <div className={`w-9 h-5 rounded-full transition-colors ml-1 ${verifiedOnly ? "bg-primary" : "bg-muted"}`}>
            <div className={`w-4 h-4 rounded-full bg-white mt-0.5 transition-transform ${verifiedOnly ? "translate-x-4" : "translate-x-0.5"}`} />
          </div>
        </button>
      </div>

      <div className="mt-4">
        {loading ? (
          <LoadingState count={4} />
        ) : data.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 px-4">
            {data.map((b) => (
              <BusinessCard key={b.id} business={b} />
            ))}
          </div>
        ) : (
          <EmptyState title="কোনো ব্যবসা পাওয়া যায়নি" message="অন্য ক্যাটাগরি বা সার্চ চেষ্টা করুন" />
        )}
      </div>
    </div>
  );
}