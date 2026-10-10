import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export default function SectionHeader({ title, to }) {
  return (
    <div className="flex items-center justify-between px-4 mb-3">
      <h2 className="font-heading font-bold text-base text-foreground">{title}</h2>
      {to && (
        <Link to={to} className="flex items-center gap-0.5 text-sm text-primary font-medium">
          <span>সব দেখুন</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}