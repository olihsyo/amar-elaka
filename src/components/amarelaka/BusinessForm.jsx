import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const BUSINESS_CATEGORIES = [
  "ফার্মেসি", "ব্যবসা", "হাসপাতাল ও ক্লিনিক", "মেরামত ও সেবা",
  "পরিবহন", "কমিউনিটি", "খাবার ও রেস্তোরাঁ", "শিক্ষা",
];

export default function BusinessForm({ initial, onSubmit, submitting }) {
  const [form, setForm] = useState({
    name: "", category: "ফার্মেসি", locality_name: "সিলেট সদর",
    description: "", address: "", phone: "", hours: "", services: "", photo_url: "",
    ...initial,
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
      <div>
        <Label>ব্যবসার নাম *</Label>
        <Input required value={form.name} onChange={set("name")} placeholder="যেমন: ওসমানী ফার্মেসি" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>ক্যাটাগরি *</Label>
          <select value={form.category} onChange={set("category")} className="flex h-10 w-full rounded-xl border border-input bg-card px-3 text-sm">
            {BUSINESS_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <Label>এলাকা</Label>
          <Input value={form.locality_name} onChange={set("locality_name")} />
        </div>
      </div>
      <div>
        <Label>বিবরণ</Label>
        <Textarea rows={3} value={form.description} onChange={set("description")} placeholder="ব্যবসার সংক্ষিপ্ত পরিচিতি" />
      </div>
      <div>
        <Label>ঠিকানা</Label>
        <Input value={form.address} onChange={set("address")} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>ফোন</Label>
          <Input value={form.phone} onChange={set("phone")} />
        </div>
        <div>
          <Label>খোলার সময়</Label>
          <Input value={form.hours} onChange={set("hours")} placeholder="সকাল ৯টা - রাত ৮টা" />
        </div>
      </div>
      <div>
        <Label>সেবাসমূহ</Label>
        <Input value={form.services} onChange={set("services")} placeholder="কমা দিয়ে আলাদা করুন" />
      </div>
      <div>
        <Label>ছবির লিংক (ঐচ্ছিক)</Label>
        <Input value={form.photo_url} onChange={set("photo_url")} placeholder="https://..." />
      </div>
      <Button type="submit" disabled={submitting} className="w-full h-11 rounded-xl">
        {submitting ? "জমা হচ্ছে..." : "জমা দিন"}
      </Button>
      <p className="text-xs text-muted-foreground text-center">জমা দেওয়ার পর অ্যাডমিন যাচাই করবেন।</p>
    </form>
  );
}