import { Phone } from "lucide-react";

const categoryConfig = {
  ambulance: { label: "অ্যাম্বুলেন্স", color: "bg-destructive/10 text-destructive", icon: "🚑" },
  hospital: { label: "হাসপাতাল", color: "bg-primary/10 text-primary", icon: "🏥" },
  police: { label: "পুলিশ", color: "bg-blue-50 text-blue-600", icon: "🚓" },
  fire: { label: "ফায়ার সার্ভিস", color: "bg-warning/10 text-warning", icon: "🚒" },
  other: { label: "অন্যান্য", color: "bg-muted text-muted-foreground", icon: "📞" },
};

export default function EmergencyCard({ contact }) {
  const config = categoryConfig[contact.category] || categoryConfig.other;

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${config.color}`}>
            {config.icon}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm text-foreground line-clamp-1">{contact.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{config.label}</p>
            {contact.address && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{contact.address}</p>
            )}
            {contact.verified && (
              <span className="inline-block text-[10px] text-primary font-medium mt-1">যাচাইকৃত</span>
            )}
          </div>
        </div>
        <a
          href={`tel:${contact.phone}`}
          className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform"
        >
          <Phone className="w-5 h-5 text-primary-foreground" fill="currentColor" />
        </a>
      </div>
    </div>
  );
}