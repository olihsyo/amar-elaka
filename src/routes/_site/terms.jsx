import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_site/terms")({
  head: () => ({ meta: [{ title: "শর্তাবলী — AmarElaka" }] }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="pb-4">
      <div className="px-4 pt-4 flex items-center gap-3">
        <Link to="/profile">
          <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </div>
        </Link>
        <h1 className="font-heading font-bold text-lg text-foreground">শর্তাবলী</h1>
      </div>
      <div className="px-4 mt-4 text-sm text-muted-foreground leading-relaxed space-y-4">
        <p>AmarElaka ব্যবহার করে আপনি নিম্নলিখিত শর্তাবলীতে সম্মত হচ্ছেন।</p>
        <div>
          <h3 className="font-semibold text-foreground text-sm mb-1">১. সেবার ব্যবহার</h3>
          <p>AmarElaka একটি স্থানীয় তথ্য ও সেবা প্ল্যাটফর্ম। ব্যবহারকারী হিসেবে আপনি স্থানীয় খবর, নোটিশ, ব্যবসা ও জরুরি সেবার তথ্য দেখতে ও সংরক্ষণ করতে পারবেন।</p>
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-sm mb-1">২. তথ্যের নির্ভরযোগ্যতা</h3>
          <p>আমরা তথ্য যাচাই করার চেষ্টা করি, তবে কোনো তথ্য ১০০% নির্ভুল হতে বাধ্য নয়। জরুরি পরিস্থিতিতে সরাসরি সংশ্লিষ্ট কর্তৃপক্ষের সাথে যোগাযোগ করুন।</p>
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-sm mb-1">৩. ব্যবহারকারীর দায়িত্ব</h3>
          <p>ভুল তথ্য প্রদান, মিথ্যা রিভিউ বা প্রতারণামূলক কন্টেন্ট পোস্ট করা নিষিদ্ধ। এই ধরনের কার্যকলাপে অংশ নিলে আপনার অ্যাকাউন্ট স্থগিত হতে পারে।</p>
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-sm mb-1">৪. বিজ্ঞাপন</h3>
          <p>স্পন্সরড কন্টেন্ট স্পষ্টভাবে "বিজ্ঞাপন" লেবেলে চিহ্নিত করা হবে। জরুরি সেবা ও দাপ্তরিক নোটিশে কোনো বিজ্ঞাপন থাকবে না।</p>
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-sm mb-1">৫. গোপনীয়তা</h3>
          <p>আপনার ব্যক্তিগত তথ্য আমাদের গোপনীয়তা নীতি অনুযায়ী সুরক্ষিত। বিস্তারিত জানতে গোপনীয়তা নীতি পড়ুন।</p>
        </div>
        <p className="text-xs text-muted-foreground pt-2">সর্বশেষ আপডেট: অক্টোবর ২০২৬</p>
      </div>
    </div>
  );
}