import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Headphones, Loader, Unlock } from "lucide-react";

interface ReadyPodcast {
  slug: string;
  title: string;
  courseCode: string;
  description: string;
  audioUrl: string;
  durationLabel: string;
}

/**
 * المكتبة الجاهزة: حلقات بودكاست صوتية مفتوحة بشكل دائم
 * لكل الطلاب — المستخدم المجاني والمشترك على حد سواء.
 */
export default function ReadyPodcastsSection() {
  const [podcasts, setPodcasts] = useState<ReadyPodcast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const response = await fetch("/api/library/podcasts");
        if (!response.ok) throw new Error("Failed to fetch podcasts");
        const data = await response.json();
        setPodcasts(data.podcasts ?? []);
      } catch {
        setPodcasts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPodcasts();
  }, []);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Headphones className="w-5 h-5" />
          البودكاست الجاهز
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-normal text-emerald-500">
            <Unlock className="h-3 w-3" />
            مفتوح دائماً لكل الطلاب
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader className="h-6 w-6 animate-spin" />
          </div>
        ) : podcasts.length === 0 ? (
          <p className="text-center text-muted-foreground">لا توجد حلقات متاحة حالياً</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {podcasts.map((podcast) => (
              <div key={podcast.slug} className="rounded-lg border border-border p-4">
                <h3 className="font-semibold">{podcast.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {podcast.courseCode}
                  {podcast.durationLabel ? ` — ${podcast.durationLabel}` : ""}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {podcast.description}
                </p>
                {podcast.audioUrl ? (
                  <audio controls preload="none" src={podcast.audioUrl} className="mt-4 w-full">
                    متصفحك لا يدعم تشغيل الملفات الصوتية.
                  </audio>
                ) : (
                  <p className="mt-4 text-sm text-amber-500">
                    الملف الصوتي قيد الرفع — سيظهر المشغّل فور توفره.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
