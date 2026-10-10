import { Megaphone, GraduationCap, Users } from "lucide-react";

const typeConfig = {
  official: { label: "দাপ্তরিক", icon: Megaphone, color: "text-primary" },
  education: { label: "শিক্ষা", icon: GraduationCap, color: "text-blue-600" },
  community: { label: "কমিউনিটি", icon: Users, color: "text-warning" },
};

export default function NoticeCard({ notice }) {
  const config = typeConfig[notice.type] || typeConfig.official;
  const Icon = config.icon;

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm p-4">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 ${config.color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-medium text-muted-foreground">{config.label}</span>
          </div>
          <h3 className="font-semibold text-sm text-foreground line-clamp-2 leading-snug">{notice.title}</h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notice.content}</p>
          {notice.source && (
            <p className="text-[11px] text-muted-foreground mt-1.5">— {notice.source}</p>
          )}
        </div>
      </div>
    </div>
  );
}