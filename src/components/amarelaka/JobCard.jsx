import { Link } from "@tanstack/react-router";
import { Briefcase, MapPin, Clock } from "lucide-react";

const typeLabels = {
  full_time: "ফুল টাইম",
  part_time: "পার্ট টাইম",
  tutoring: "টিউশন",
  training: "প্রশিক্ষণ",
  business: "ব্যবসা",
};

export default function JobCard({ job }) {
  return (
    <Link to="/jobs/$jobId" params={{ jobId: job.id }} className="block">
      <div className="bg-card rounded-2xl border border-border shadow-sm p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-foreground line-clamp-1">{job.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{job.company || "অজানা"}</p>
          </div>
          <span className="text-[10px] px-2 py-1 rounded-full bg-secondary text-secondary-foreground font-medium flex-shrink-0">
            {typeLabels[job.type] || job.type}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
          {job.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {job.location}
            </span>
          )}
          {job.salary && (
            <span className="flex items-center gap-1">
              <Briefcase className="w-3 h-3" />
              {job.salary}
            </span>
          )}
          {job.expires_at && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(job.expires_at).toLocaleDateString("bn-BD")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}