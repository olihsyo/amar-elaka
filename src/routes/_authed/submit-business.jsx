import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import BusinessForm from "@/components/amarelaka/BusinessForm";
import { toast } from "sonner";

export const Route = createFileRoute("/_authed/submit-business")({
  head: () => ({ meta: [{ title: "ব্যবসা যোগ করুন — AmarElaka" }] }),
  component: SubmitBusiness,
});

function SubmitBusiness() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      await base44.entities.Business.create({ ...data, status: "pending", verified: false });
      toast.success("জমা হয়েছে — যাচাইয়ের অপেক্ষায়");
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
        <h1 className="font-heading font-bold text-lg text-foreground">ব্যবসা যোগ করুন</h1>
      </div>
      <div className="px-4 mt-4">
        <BusinessForm onSubmit={handleSubmit} submitting={submitting} />
      </div>
    </div>
  );
}