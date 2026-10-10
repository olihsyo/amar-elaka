import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, MapPin } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useFetch } from "@/lib/useFetch";
import LoadingState from "@/components/amarelaka/LoadingState";

export const Route = createFileRoute("/_authed/locality")({
  head: () => ({ meta: [{ title: "এলাকা পরিবর্তন — AmarElaka" }] }),
  component: LocalityPage,
});

const FALLBACK_LOCALITIES = ["সিলেট সদর", "জৈন্তাপুর", "বিয়ানীবাজার", "ফেঞ্চুগঞ্জ", "গোলাপগঞ্জ", "ওসমানী নগর", "বালাগঞ্জ", "বিশ্বনাথ"];

function LocalityPage() {
  const navigate = useNavigate();
  const { user, refresh } = useAuth();
  const { data: localities, loading } = useFetch("Locality", {}, { limit: 50 });
  const [selected, setSelected] = useState(user?.locality_name || null);
  const [saving, setSaving] = useState(false);

  const list = localities.length > 0 ? localities.map((l) => l.name) : FALLBACK_LOCALITIES;

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await base44.auth.updateMe({ locality_name: selected });
      await refresh();
      navigate({ to: "/" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pb-4">
      <div className="px-4 pt-4 flex items-center gap-3">
        <Link to="/profile">
          <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </div>
        </Link>
        <h1 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" /> এলাকা নির্বাচন
        </h1>
      </div>

      <div className="px-4 mt-4">
        {loading ? (
          <LoadingState count={4} />
        ) : (
          <div className="space-y-2">
            {list.map((name) => (
              <button
                key={name}
                onClick={() => setSelected(name)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                  selected === name ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border"
                }`}
              >
                <span>{name}</span>
                {selected === name && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 mt-6">
        <button
          onClick={handleSave}
          disabled={!selected || saving}
          className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-50"
        >
          {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
        </button>
      </div>
    </div>
  );
}