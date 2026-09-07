/**
 * محتوى SVU AI Studio الجاهز: بنك الامتحانات + مكتبة البودكاست الجاهزة.
 *
 * قواعد الوصول:
 *  - كويزات بنك الامتحانات: متاحة للمستخدم المجاني والمشترك، وتُقفل تلقائياً
 *    بعد QUIZ_AVAILABILITY_HOURS (48 ساعة) من لحظة النشر.
 *  - بودكاست المكتبة الجاهزة: متاح دائماً لكل الطلاب (مجاني ومشترك) بلا قفل.
 *  - توليد بودكاست جديد: للمشترك فقط (يُطبَّق في server/readyContentRoutes.ts).
 */

/** مدة إتاحة كويزات بنك الامتحانات بالساعات. */
export const QUIZ_AVAILABILITY_HOURS = 48;

export interface ReadyQuiz {
  slug: string;
  title: string;
  courseCode: string;
  instructor: string;
  description: string;
  /** مسار ملف الامتحان التفاعلي داخل server/content/quizzes */
  assetFile: string;
  questionCount: number;
  durationMinutes: number;
  /** لحظة النشر بصيغة ISO — تبدأ منها نافذة الـ 48 ساعة. */
  publishedAt: string;
  /** "all" = مجاني + مشترك */
  accessTier: "all";
}

export interface ReadyPodcast {
  slug: string;
  title: string;
  courseCode: string;
  description: string;
  /** رابط صوتي مباشر (CDN أو ملف مستضاف) — يُقدَّم على مشغّل درايف عند توفره. */
  audioUrl: string;
  /** معرّف الملف على Google Drive — يُستخدم كمشغّل احتياطي مضمون. */
  driveFileId: string;
  /** اسم الملف المحلي المتوقع داخل server/content/podcasts (إن رُفع لاحقاً). */
  localFile: string;
  durationLabel: string;
  publishedAt: string;
  /** "all" = مجاني + مشترك */
  accessTier: "all";
  /** المكتبة الجاهزة مفتوحة بشكل دائم — لا يوجد قفل زمني. */
  permanentlyOpen: true;
}

/**
 * يسمح بضبط لحظة النشر من متغيرات البيئة عند إعادة النشر،
 * وإلا تُستخدم اللحظة المثبتة أدناه.
 */
const envValue = (key: string): string | undefined =>
  typeof process !== "undefined" && process.env ? process.env[key] : undefined;

const envPublishedAt = (key: string, fallback: string): string => {
  const value = envValue(key);
  if (!value) return fallback;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed.toISOString();
};

export const READY_QUIZZES: ReadyQuiz[] = [
  {
    slug: "pr13-public-relations",
    title: "العلاقات العامة: مبادئ وإدارة — امتحان تفاعلي",
    courseCode: "PR13",
    instructor: "د. ندى الساعي",
    description:
      "امتحان تفاعلي مُستخرج بدقة أكاديمية وفق معايير الجامعة الافتراضية السورية: 3 أسئلة مقالية تحليلية، 5 أسئلة صح/خطأ، و36 سؤال اختيار من متعدد بمشتتات تخصصية.",
    assetFile: "pr13-public-relations.html",
    questionCount: 44,
    durationMinutes: 90,
    publishedAt: envPublishedAt("QUIZ_PR13_PUBLISHED_AT", "2026-09-07T00:00:00.000Z"),
    accessTier: "all",
  },
  {
    slug: "rp535-radio-programs",
    title: "إعداد البرامج الإذاعية — الامتحان الشامل والمعياري",
    courseCode: "RP535",
    instructor: "د. ريم عبود",
    description:
      "امتحان شامل بـ100 سؤال أكاديمي: 5 أسئلة مقالية تحليلية، 10 أسئلة صح/خطأ، و85 سؤال اختيار من متعدد بنظام المشتتات المتوازنة.",
    assetFile: "rp535-radio-programs.html",
    questionCount: 100,
    durationMinutes: 120,
    publishedAt: envPublishedAt("QUIZ_RP535_PUBLISHED_AT", "2026-09-07T00:00:00.000Z"),
    accessTier: "all",
  },
];

export const READY_PODCASTS: ReadyPodcast[] = [
  {
    slug: "pr13-public-relations-podcast",
    title: "بودكاست: العلاقات العامة — مبادئ وإدارة",
    courseCode: "PR13",
    description:
      "حلقة صوتية تشرح محاور مقرر العلاقات العامة (PR13) بأسلوب مبسّط ومركّز — متاحة لكل الطلاب بشكل دائم.",
    audioUrl: envValue("PODCAST_PR13_URL") ?? "",
    driveFileId: "16qUHOETIuT2GC-di_ckzlNITEdHXalTv",
    localFile: "pr13-public-relations-podcast.m4a",
    durationLabel: "",
    publishedAt: "2026-09-07T00:00:00.000Z",
    accessTier: "all",
    permanentlyOpen: true,
  },
  {
    slug: "rp535-radio-programs-podcast",
    title: "بودكاست: إعداد البرامج الإذاعية",
    courseCode: "RP535",
    description:
      "حلقة صوتية تشرح محاور مقرر إعداد البرامج الإذاعية (RP535) بأسلوب مبسّط ومركّز — متاحة لكل الطلاب بشكل دائم.",
    audioUrl: envValue("PODCAST_RP535_URL") ?? "",
    driveFileId: "1E_Y1obRjOakgRfMYYcMteGsIURXqSeVu",
    localFile: "rp535-radio-programs-podcast.m4a",
    durationLabel: "",
    publishedAt: "2026-09-07T00:00:00.000Z",
    accessTier: "all",
    permanentlyOpen: true,
  },
];

export interface QuizAvailability {
  isOpen: boolean;
  opensAt: string;
  closesAt: string;
  /** المللي ثانية المتبقية قبل القفل (0 إذا أُقفل). */
  msRemaining: number;
}

/** رابط مشغّل Google Drive المدمج (يعمل لأي زائر بما أن الملف مشارَك للجميع). */
export function drivePreviewUrl(driveFileId: string): string {
  return `https://drive.google.com/file/d/${driveFileId}/preview`;
}

/** يحسب نافذة الـ 48 ساعة لكويز معيّن. */
export function getQuizAvailability(quiz: ReadyQuiz, now: Date = new Date()): QuizAvailability {
  const opensAt = new Date(quiz.publishedAt);
  const closesAt = new Date(opensAt.getTime() + QUIZ_AVAILABILITY_HOURS * 60 * 60 * 1000);
  const msRemaining = Math.max(0, closesAt.getTime() - now.getTime());
  return {
    isOpen: now >= opensAt && now < closesAt,
    opensAt: opensAt.toISOString(),
    closesAt: closesAt.toISOString(),
    msRemaining,
  };
}

export function findReadyQuiz(slug: string): ReadyQuiz | undefined {
  return READY_QUIZZES.find((quiz) => quiz.slug === slug);
}

export function findReadyPodcast(slug: string): ReadyPodcast | undefined {
  return READY_PODCASTS.find((podcast) => podcast.slug === slug);
}
