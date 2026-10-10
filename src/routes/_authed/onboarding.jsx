import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Globe, MapPin, ArrowRight, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useFetch } from "@/lib/useFetch";
import LoadingState from "@/components/amarelaka/LoadingState";

export const Route = createFileRoute("/_authed/onboarding")({
  ssr: false,
  head: () => ({ meta: [{ title: "স্বাগতম — AmarElaka" }] }),
  component: Onboarding,
});

const FALLBACK_LOCALITIES = ["সিলেট সদর", "জৈন্তাপুর", "বিয়ানীবাজার", "ফেঞ্চুগঞ্জ", "গোলাপগঞ্জ", "ওসমানী নগর", "বালাগঞ্জ", "বিশ্বনাথ"];

function Onboarding() {
  const navigate = useNavigate();
  const { user, refresh } = useAuth();
  const { data: localities, loading } = useFetch("Locality", {}, { limit: 50 });
  const [selected, setSelected] = useState(null);
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
    <div className="min-h-screen flex flex-col justify-center px-6 py-10 max-w-[480px] mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
        <span className="text-2xl font-bold text-primary-foreground">আ</span>
      </div>
      <h1 className="font-heading font-bold text-2xl text-foreground mt-6">স্বাগতম, {user?.full_name || "বন্ধু"}!</h1>
      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
        আপনার এলাকা নির্বাচন করুন — আপনার এলাকার খবর, ব্যবসা, চাকরি ও জরুরি সেবা দেখানো হবে।
      </p>

      <div className="mt-6">
        <p className="text-xs font-semibold text-muted-foreground uppercase mb-2 flex items-center gap-1">
          <Globe className="w-3 h-3" /> ভাষা — বাংলা
        </p>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase mb-2 flex items-center gap-1">
          <MapPin className="w-3 h-3" /> আপনার এলাকা
        </p>
        {loading ? (
          <LoadingState count={3} />
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {list.map((name) => (
              <button
                key={name}
                onClick={() => setSelected(name)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                  selected === name ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border"
                }`}
              >
                <span className="truncate">{name}</span>
                {selected === name && <Check className="w-4 h-4 flex-shrink-0" />}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleSave}
        disabled={!selected || saving}
        className="mt-8 h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {saving ? "সংরক্ষণ হচ্ছে..." : <>শুরু করুন <ArrowRight className="w-4 h-4" /></>}
      </button>
    </div>
  );
}