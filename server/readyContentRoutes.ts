import type { Express, Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { isAuthenticated } from "./replitAuth";
import { storage } from "./storage";
import { advancedAiService } from "./services/advancedAiService";
import {
  READY_QUIZZES,
  READY_PODCASTS,
  QUIZ_AVAILABILITY_HOURS,
  findReadyQuiz,
  findReadyPodcast,
  getQuizAvailability,
  drivePreviewUrl,
} from "@shared/readyContent";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// في التطوير الملفات بجانب هذا الملف؛ وبعد البناء تُنسخ إلى dist/content/quizzes.
// نجرّب المسارين ونعتمد أوّل مسار موجود.
const QUIZ_ASSETS_DIR = [
  path.join(__dirname, "content", "quizzes"),
  path.join(process.cwd(), "server", "content", "quizzes"),
  path.join(process.cwd(), "dist", "content", "quizzes"),
].find((candidate) => fs.existsSync(candidate)) ?? path.join(__dirname, "content", "quizzes");

const PODCAST_ASSETS_DIR = [
  path.join(__dirname, "content", "podcasts"),
  path.join(process.cwd(), "server", "content", "podcasts"),
  path.join(process.cwd(), "dist", "content", "podcasts"),
].find((candidate) => fs.existsSync(candidate)) ?? path.join(__dirname, "content", "podcasts");

/** هل رُفع الملف الصوتي إلى الخادم؟ */
function localPodcastPath(localFile: string): string | null {
  const filePath = path.join(PODCAST_ASSETS_DIR, localFile);
  return fs.existsSync(filePath) ? filePath : null;
}

/**
 * حارس الاشتراك: يُستخدم فقط للميزات المدفوعة (توليد بودكاست جديد).
 * محتوى بنك الامتحانات والمكتبة الجاهزة لا يمر من هنا.
 */
async function requireSubscription(req: any, res: Response, next: NextFunction) {
  try {
    const user = await storage.getUser(req.user.claims.sub);
    const status = user?.subscriptionStatus ?? "free";
    if (status === "free" || !status) {
      return res.status(403).json({
        message: "توليد البودكاست متاح للمشتركين فقط",
        code: "SUBSCRIPTION_REQUIRED",
      });
    }
    next();
  } catch (error) {
    console.error("Error verifying subscription:", error);
    res.status(500).json({ message: "Failed to verify subscription" });
  }
}

export function registerReadyContentRoutes(app: Express) {
  // ==========================================================
  // بنك الامتحانات — متاح للمجاني والمشترك، ويُقفل بعد 48 ساعة
  // ==========================================================
  app.get("/api/exam-bank/quizzes", isAuthenticated, async (_req: Request, res: Response) => {
    const now = new Date();
    res.json({
      availabilityHours: QUIZ_AVAILABILITY_HOURS,
      quizzes: READY_QUIZZES.map((quiz) => {
        const availability = getQuizAvailability(quiz, now);
        return {
          slug: quiz.slug,
          title: quiz.title,
          courseCode: quiz.courseCode,
          instructor: quiz.instructor,
          description: quiz.description,
          questionCount: quiz.questionCount,
          durationMinutes: quiz.durationMinutes,
          accessTier: quiz.accessTier,
          publishedAt: quiz.publishedAt,
          ...availability,
        };
      }),
    });
  });

  // يقدّم ملف الامتحان التفاعلي كما هو تماماً (التصميم والشعارات والأسئلة بلا أي تعديل)
  app.get("/api/exam-bank/quizzes/:slug/play", isAuthenticated, async (req: Request, res: Response) => {
    const quiz = findReadyQuiz(req.params.slug);
    if (!quiz) {
      return res.status(404).json({ message: "الامتحان غير موجود" });
    }

    const availability = getQuizAvailability(quiz);
    if (!availability.isOpen) {
      return res.status(403).json({
        message: `أُغلق هذا الامتحان بعد انتهاء مدة الإتاحة (${QUIZ_AVAILABILITY_HOURS} ساعة من النشر)`,
        code: "QUIZ_CLOSED",
        ...availability,
      });
    }

    const filePath = path.join(QUIZ_ASSETS_DIR, quiz.assetFile);
    if (!fs.existsSync(filePath)) {
      console.error("Quiz asset missing:", filePath);
      return res.status(500).json({ message: "ملف الامتحان غير متوفر" });
    }

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    fs.createReadStream(filePath).pipe(res);
  });

  // ==========================================================
  // المكتبة الجاهزة — بودكاست مفتوح دائماً لكل الطلاب
  // ==========================================================
  app.get("/api/library/podcasts", isAuthenticated, async (_req: Request, res: Response) => {
    res.json({
      podcasts: READY_PODCASTS.map((podcast) => {
        // الأفضلية: ملف مستضاف على الخادم، ثم رابط مباشر، ثم مشغّل درايف.
        const hostedUrl = localPodcastPath(podcast.localFile)
          ? `/api/library/podcasts/${podcast.slug}/audio`
          : podcast.audioUrl || "";
        return {
          slug: podcast.slug,
          title: podcast.title,
          courseCode: podcast.courseCode,
          description: podcast.description,
          durationLabel: podcast.durationLabel,
          publishedAt: podcast.publishedAt,
          accessTier: podcast.accessTier,
          audioUrl: hostedUrl,
          embedUrl: hostedUrl ? "" : drivePreviewUrl(podcast.driveFileId),
          isOpen: true,
        };
      }),
    });
  });

  // يقدّم الملف الصوتي المستضاف محلياً (إن وُجد) مع دعم الاستماع الجزئي (Range)
  app.get("/api/library/podcasts/:slug/audio", isAuthenticated, async (req: Request, res: Response) => {
    const podcast = findReadyPodcast(req.params.slug);
    if (!podcast) {
      return res.status(404).json({ message: "الحلقة غير موجودة" });
    }
    const filePath = localPodcastPath(podcast.localFile);
    if (!filePath) {
      return res.status(404).json({ message: "لا يوجد ملف صوتي مستضاف لهذه الحلقة" });
    }
    res.type("audio/mp4");
    res.sendFile(filePath);
  });

  // ==========================================================
  // توليد بودكاست جديد — للمشترك فقط
  // ==========================================================
  app.post(
    "/api/ai/generate-podcast",
    isAuthenticated,
    requireSubscription,
    async (req: any, res: Response) => {
      try {
        const { text, language = "ar" } = req.body;
        if (!text || typeof text !== "string") {
          return res.status(400).json({ message: "النص مطلوب لتوليد البودكاست" });
        }
        const script = await advancedAiService.summarizeWithKeyPoints(text, language);
        res.json({ script });
      } catch (error) {
        console.error("Error generating podcast:", error);
        res.status(500).json({ message: "Failed to generate podcast" });
      }
    },
  );
}
