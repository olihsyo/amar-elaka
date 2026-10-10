import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Phone, Clock, Flag, BadgeCheck, Share2 } from "lucide-react";
import { useFetchOne } from "@/lib/useFetch";
import LoadingState from "@/components/amarelaka/LoadingState";
import { toast } from "sonner";

export const Route = createFileRoute("/_site/business/$businessId")({
  head: ({ loaderData }) => ({ meta: [{ title: loaderData?.name ?? "ব্যবসা — AmarElaka" }] }),
  component: BusinessDetailPage,
});

function BusinessDetailPage() {
  const { businessId } = Route.useParams();
  const { data: business, loading } = useFetchOne("Business", businessId);

  if (loading) return <LoadingState count={3} />;
  if (!business) return <div className="px-4 pt-8 text-center text-muted-foreground">ব্যবসা পাওয়া যায়নি</div>;

  return (
    <div className="pb-4">
      <div className="px-4 pt-4 flex items-center justify-between">
        <Link to="/explore">
          <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </div>
        </Link>
        <button
          onClick={() => toast.success("শেয়ার করা হয়েছে")}
          className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center"
        >
          <Share2 className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {business.photo_url && (
        <div className="mt-4 w-full h-48 bg-muted overflow-hidden">
          <img src={business.photo_url} alt={business.name} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="px-4 mt-4">
        <div className="flex items-center gap-2 mb-1">
          {business.sponsored && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-warning/10 text-warning font-medium">বিজ্ঞাপন</span>
          )}
          {business.verified ? (
            <span className="flex items-center gap-1 text-xs text-primary font-medium">
              <BadgeCheck className="w-4 h-4" />
              যাচাইকৃত
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">অযাচাইকৃত</span>
          )}
        </div>
        <h1 className="font-heading font-bold text-lg text-foreground leading-snug">{business.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">{business.category}</p>

        {business.description && (
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{business.description}</p>
        )}

        {business.services && (
          <div className="mt-4">
            <h3 className="font-semibold text-sm text-foreground mb-1">সেবাসমূহ</h3>
            <p className="text-sm text-muted-foreground">{business.services}</p>
          </div>
        )}

        <div className="mt-5 space-y-3">
          {business.address && (
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">{business.address}</span>
            </div>
          )}
          {business.hours && (
            <div className="flex items-start gap-2 text-sm">
              <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">{business.hours}</span>
            </div>
          )}
        </div>

        {business.phone && (
          <a
            href={`tel:${business.phone}`}
            className="flex items-center justify-center gap-2 w-full mt-6 h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-sm active:scale-[0.98] transition-transform"
          >
            <Phone className="w-4 h-4" />
            {business.phone}
          </a>
        )}

        <button
          onClick={() => toast.success("রিপোর্ট করা হয়েছে")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground mt-4 mx-auto flex justify-center"
        >
          <Flag className="w-3.5 h-3.5" />
          <span>ভুল তথ্য রিপোর্ট করুন</span>
        </button>
      </div>
    </div>
  );
}