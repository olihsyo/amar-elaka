import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_site/privacy")({
  head: () => ({ meta: [{ title: "গোপনীয়তা নীতি — AmarElaka" }] }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="pb-4">
      <div className="px-4 pt-4 flex items-center gap-3">
        <Link to="/profile">
          <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </div>
        </Link>
        <h1 className="font-heading font-bold text-lg text-foreground">গোপনীয়তা নীতি</h1>
      </div>
      <div className="px-4 mt-4 text-sm text-muted-foreground leading-relaxed space-y-4">
        <p>আপনার গোপনীয়তা আমাদের কাছে গুরুত্বপূর্ণ। এই নীতি ব্যাখ্যা করে আমরা আপনার তথ্য কীভাবে সংগ্রহ, ব্যবহার ও সুরক্ষিত রাখি।</p>
        <div>
          <h3 className="font-semibold text-foreground text-sm mb-1">১. সংগৃহীত তথ্য</h3>
          <p>আমরা আপনার নাম, ইমেইল, নির্বাচিত এলাকা ও সংরক্ষিত আইটেমের তথ্য সংগ্রহ করি। পাবলিক কন্টেন্ট পড়তে অ্যাকাউন্ট প্রয়োজন নেই।</p>
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-sm mb-1">২. তথ্যের ব্যবহার</h3>
          <p>আপনার তথ্য শুধুমাত্র সেবা প্রদান ও উন্নয়নের জন্য ব্যবহৃত হয়। আমরা আপনার ব্যক্তিগত তথ্য তৃতীয় পক্ষের কাছে বিক্রি করি না।</p>
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-sm mb-1">৩. অ্যাকাউন্ট মুছে ফেলা</h3>
          <p>আপনি যেকোনো সময় আপনার অ্যাকাউন্ট ও সংশ্লিষ্ট তথ্য মুছে ফেলার অনুরোধ করতে পারেন। সাপোর্টে যোগাযোগ করুন।</p>
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-sm mb-1">৪. নোটিফিকেশন</h3>
          <p>আপনি নোটিফিকেশন প্রিফারেন্স থেকে যেকোনো সময় নোটিফিকেশন বন্ধ করতে পারেন।</p>
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-sm mb-1">৫. ডেটা নিরাপত্তা</h3>
          <p>আপনার তথ্য এনক্রিপ্টেড সার্ভারে সুরক্ষিতভাবে সংরক্ষিত হয়। শুধুমাত্র অনুমোদিত ব্যক্তিরা প্রয়োজনীয় তথ্য অ্যাক্সেস করতে পারেন।</p>
        </div>
        <p className="text-xs text-muted-foreground pt-2">সর্বশেষ আপডেট: অক্টোবর ২০২৬</p>
      </div>
    </div>
  );
}