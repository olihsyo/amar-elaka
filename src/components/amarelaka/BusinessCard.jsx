import { Link } from "@tanstack/react-router";
import { MapPin, Phone, BadgeCheck } from "lucide-react";

export default function BusinessCard({ business }) {
  return (
    <Link to="/business/$businessId" params={{ businessId: business.id }} className="block">
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        {business.photo_url && (
          <div className="w-full h-32 bg-muted overflow-hidden">
            <img src={business.photo_url} alt={business.name} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm text-foreground line-clamp-1">{business.name}</h3>
            {business.sponsored && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-warning/10 text-warning font-medium flex-shrink-0">বিজ্ঞাপন</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{business.category}</p>
          {business.address && (
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="line-clamp-1">{business.address}</span>
            </div>
          )}
          <div className="flex items-center justify-between mt-2">
            {business.verified ? (
              <span className="flex items-center gap-1 text-xs text-primary font-medium">
                <BadgeCheck className="w-3.5 h-3.5" />
                যাচাইকৃত
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">অযাচাইকৃত</span>
            )}
            {business.phone && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Phone className="w-3 h-3" />
                কল
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}