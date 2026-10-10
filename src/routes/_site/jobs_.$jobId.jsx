import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Phone, Clock, Flag, BadgeCheck, Briefcase } from "lucide-react";
import { useFetchOne } from "@/lib/useFetch";
import LoadingState from "@/components/amarelaka/LoadingState";
import { toast } from "sonner";

export const Route = createFileRoute("/_site/jobs_/$jobId")({
  head: ({ loaderData }) => ({ meta: [{ title: loaderData?.title ?? "চাকরি — AmarElaka" }] }),
  component: JobDetailPage,
});

const typeLabels = {
  full_time: "ফুল টাইম",
  part_time: "পার্ট টাইম",
  tutoring: "টিউশন",
  training: "প্রশিক্ষণ",
  business: "ব্যবসা",
};

function JobDetailPage() {
  const { jobId } = Route.useParams();
  const { data: job, loading } = useFetchOne("Job", jobId);

  if (loading) return <LoadingState count={3} />;
  if (!job) return <div className="px-4 pt-8 text-center text-muted-foreground">চাকরির বিজ্ঞপ্তি পাওয়া যায়নি</div>;

  return (
    <div className="pb-4">
      <div className="px-4 pt-4 flex items-center justify-between">
        <Link to="/jobs">
          <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </div>
        </Link>
        <button
          onClick={() => toast.success("রিপোর্ট করা হয়েছে")}
          className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center"
        >
          <Flag className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <div className="px-4 mt-4">
        <span className="text-[10px] px-2 py-1 rounded-full bg-secondary text-secondary-foreground font-medium">
          {typeLabels[job.type] || job.type}
        </span>
        <h1 className="font-heading font-bold text-lg text-foreground mt-2 leading-snug">{job.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{job.company || "অজানা"}</p>

        <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted-foreground">
          {job.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {job.location}
            </span>
          )}
          {job.salary && (
            <span className="flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5" />
              {job.salary}
            </span>
          )}
          {job.expires_at && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              শেষ: {new Date(job.expires_at).toLocaleDateString("bn-BD")}
            </span>
          )}
        </div>

        <div className="mt-5">
          <h3 className="font-semibold text-sm text-foreground mb-2">বিস্তারিত</h3>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{job.description}</p>
        </div>

        {job.contact && (
          <div className="mt-5">
            <h3 className="font-semibold text-sm text-foreground mb-2">যোগাযোগ</h3>
            <a
              href={job.contact.startsWith("0") || job.contact.startsWith("+") ? `tel:${job.contact}` : `mailto:${job.contact}`}
              className="flex items-center gap-2 text-sm text-primary font-medium"
            >
              <Phone className="w-4 h-4" />
              {job.contact}
            </a>
          </div>
        )}

        {job.contact && (
          <a
            href={job.contact.startsWith("0") || job.contact.startsWith("+") ? `tel:${job.contact}` : `mailto:${job.contact}`}
            className="block w-full mt-6 h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center active:scale-[0.98] transition-transform"
          >
            যোগাযোগ করুন
          </a>
        )}
      </div>
    </div>
  );
}