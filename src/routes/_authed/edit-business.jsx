import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useFetchOne } from "@/lib/useFetch";
import BusinessForm from "@/components/amarelaka/BusinessForm";
import { toast } from "sonner";
import LoadingState from "@/components/amarelaka/LoadingState";

export const Route = createFileRoute("/_authed/edit-business")({
  validateSearch: (search) => ({ id: typeof search.id === "string" ? search.id : undefined }),
  head: () => ({ meta: [{ title: "ব্যবসা সম্পাদনা — AmarElaka" }] }),
  component: EditBusiness,
});

function EditBusiness() {
  const { id } = Route.useSearch();
  const navigate = useNavigate();
  const { data: business, loading } = useFetchOne("Business", id);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      await base44.entities.Business.update(id, data);
      toast.success("সংরক্ষিত হয়েছে");
      navigate({ to: "/my-listings" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pb-4">
      <div className="px-4 pt-4 flex items-center gap-3">
        <Link to="/my-listings">
          <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </div>
        </Link>
        <h1 className="font-heading font-bold text-lg text-foreground">ব্যবসা সম্পাদনা</h1>
      </div>
      <div className="px-4 mt-4">
        {loading || !business ? (
          <LoadingState count={3} />
        ) : (
          <BusinessForm initial={business} onSubmit={handleSubmit} submitting={submitting} />
        )}
      </div>
    </div>
  );
}