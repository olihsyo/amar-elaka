import { Hospital, Pill, GraduationCap, Building2, Store, Wrench, Bus, Users } from "lucide-react";

const iconMap = {
  hospital: Hospital,
  pharmacy: Pill,
  school: GraduationCap,
  government: Building2,
  business: Store,
  repair: Wrench,
  transport: Bus,
  community: Users,
};

export default function CategoryTile({ category, onClick }) {
  const Icon = iconMap[category.icon] || Store;

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 min-w-[72px] flex-shrink-0 active:scale-95 transition-transform"
    >
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "hsl(146 50% 94%)" }}>
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <span className="text-[11px] text-foreground font-medium text-center line-clamp-2 leading-tight">
        {category.name_bn || category.name_en}
      </span>
    </button>
  );
}