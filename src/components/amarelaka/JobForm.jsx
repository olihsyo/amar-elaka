import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const JOB_TYPES = [
  { value: "full_time", label: "ফুল টাইম" },
  { value: "part_time", label: "পার্ট টাইম" },
  { value: "tutoring", label: "টিউশন" },
  { value: "training", label: "প্রশিক্ষণ" },
  { value: "business", label: "ব্যবসা" },
];

export default function JobForm({ initial, onSubmit, submitting }) {
  const [form, setForm] = useState({
    title: "", company: "", type: "full_time", locality_name: "সিলেট সদর",
    description: "", salary: "", contact: "", expires_at: "",
    ...initial,
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
      <div>
        <Label>পদের নাম *</Label>
        <Input required value={form.title} onChange={set("title")} placeholder="যেমন: সেলস এক্সিকিউটিভ" />
      </div>
      <div>
        <Label>প্রতিষ্ঠানের নাম</Label>
        <Input value={form.company} onChange={set("company")} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>ধরন</Label>
          <select value={form.type} onChange={set("type")} className="flex h-10 w-full rounded-xl border border-input bg-card px-3 text-sm">
            {JOB_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <Label>এলাকা</Label>
          <Input value={form.locality_name} onChange={set("locality_name")} />
        </div>
      </div>
      <div>
        <Label>বিবরণ *</Label>
        <Textarea required rows={4} value={form.description} onChange={set("description")} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>বেতন</Label>
          <Input value={form.salary} onChange={set("salary")} placeholder="২০,০০০ ৳" />
        </div>
        <div>
          <Label>যোগাযোগ</Label>
          <Input value={form.contact} onChange={set("contact")} />
        </div>
      </div>
      <div>
        <Label>শেষ তারিখ</Label>
        <Input type="date" value={form.expires_at} onChange={set("expires_at")} />
      </div>
      <button type="submit" disabled={submitting} className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-50">
        {submitting ? "জমা হচ্ছে..." : "জমা দিন"}
      </button>
      <p className="text-xs text-muted-foreground text-center">জমা দেওয়ার পর অ্যাডমিন যাচাই করবেন।</p>
    </form>
  );
}