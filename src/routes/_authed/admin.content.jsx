import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Newspaper, Megaphone, Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useFetch } from "@/lib/useFetch";
import LoadingState from "@/components/amarelaka/LoadingState";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authed/admin/content")({
  head: () => ({ meta: [{ title: "কনটেন্ট ম্যানেজমেন্ট — AmarElaka" }] }),
  component: AdminContent,
});

function AdminContent() {
  const [kind, setKind] = useState("news");
  const [form, setForm] = useState({ title: "", summary: "", content: "", source: "", image_url: "", category: "স্থানীয়" });
  const [saving, setSaving] = useState(false);
  const { data, loading } = useFetch(kind === "news" ? "News" : "Notice", {}, { limit: 30 });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const publish = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("শিরোনাম ও কনটেন্ট প্রয়োজন");
      return;
    }
    setSaving(true);
    try {
      if (kind === "news") {
        await base44.entities.News.create({ ...form, status: "published", locality_name: "সিলেট সদর" });
      } else {
        await base44.entities.Notice.create({
          title: form.title, content: form.content, source: form.source || "অ্যাডমিন",
          type: "official", status: "published", locality_name: "সিলেট সদর",
        });
      }
      toast.success("প্রকাশিত হয়েছে");
      setForm({ title: "", summary: "", content: "", source: "", image_url: "", category: "স্থানীয়" });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    await base44.entities[kind === "news" ? "News" : "Notice"].delete(id);
    toast.success("মুছে ফেলা হয়েছে");
  };

  return (
    <div className="pb-4">
      <div className="px-4 pt-4 flex items-center gap-3">
        <Link to="/admin">
          <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </div>
        </Link>
        <h1 className="font-heading font-bold text-lg text-foreground">কনটেন্ট ম্যানেজমেন্ট</h1>
      </div>

      <div className="px-4 mt-4 flex gap-2">
        <button
          onClick={() => setKind("news")}
          className={`px-4 py-2 rounded-full text-sm font-medium ${kind === "news" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border"}`}
        >
          খবর
        </button>
        <button
          onClick={() => setKind("notice")}
          className={`px-4 py-2 rounded-full text-sm font-medium ${kind === "notice" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border"}`}
        >
          নোটিশ
        </button>
      </div>

      <div className="px-4 mt-4 bg-card rounded-2xl border border-border p-4 space-y-3">
        <div>
          <Label>শিরোনাম *</Label>
          <Input value={form.title} onChange={set("title")} />
        </div>
        {kind === "news" && (
          <div>
            <Label>সারসংক্ষেপ</Label>
            <Input value={form.summary} onChange={set("summary")} />
          </div>
        )}
        <div>
          <Label>কনটেন্ট *</Label>
          <Textarea rows={4} value={form.content} onChange={set("content")} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>সূত্র</Label>
            <Input value={form.source} onChange={set("source")} />
          </div>
          {kind === "news" && (
            <div>
              <Label>ছবির লিংক</Label>
              <Input value={form.image_url} onChange={set("image_url")} placeholder="https://..." />
            </div>
          )}
        </div>
        <button
          onClick={publish}
          disabled={saving}
          className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {kind === "news" ? <Newspaper className="w-4 h-4" /> : <Megaphone className="w-4 h-4" />}
          {saving ? "প্রকাশ হচ্ছে..." : "প্রকাশ করুন"}
        </button>
      </div>

      <div className="px-4 mt-5">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase mb-2">সাম্প্রতিক ({kind === "news" ? "খবর" : "নোটিশ"})</h2>
        <div className="space-y-2">
          {loading ? <LoadingState count={3} /> : data.map((item) => (
            <div key={item.id} className="bg-card rounded-xl border border-border p-3 flex items-center gap-2">
              <p className="text-sm text-foreground flex-1 line-clamp-1">{item.title}</p>
              <button onClick={() => remove(item.id)} className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Trash2 className="w-4 h-4 text-destructive" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}