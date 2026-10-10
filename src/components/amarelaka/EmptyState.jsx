import { SearchX } from "lucide-react";

export default function EmptyState({ title = "কিছু পাওয়া যায়নি", message = "এখনও এখানে কোনো তথ্য নেই" }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <SearchX className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-sm text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1">{message}</p>
    </div>
  );
}