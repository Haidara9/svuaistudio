import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ClipboardList, Clock, Lock, Loader, ArrowRight, Unlock } from "lucide-react";

interface ExamBankQuiz {
  slug: string;
  title: string;
  courseCode: string;
  instructor: string;
  description: string;
  questionCount: number;
  durationMinutes: number;
  publishedAt: string;
  isOpen: boolean;
  opensAt: string;
  closesAt: string;
  msRemaining: number;
}

function formatRemaining(ms: number): string {
  if (ms <= 0) return "انتهت المدة";
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours} ساعة و ${minutes} دقيقة`;
}

export default function ExamBank() {
  const [quizzes, setQuizzes] = useState<ExamBankQuiz[]>([]);
  const [availabilityHours, setAvailabilityHours] = useState(48);
  const [loading, setLoading] = useState(true);
  const [activeQuiz, setActiveQuiz] = useState<ExamBankQuiz | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch("/api/exam-bank/quizzes");
        if (!response.ok) throw new Error("Failed to fetch quizzes");
        const data = await response.json();
        setQuizzes(data.quizzes ?? []);
        setAvailabilityHours(data.availabilityHours ?? 48);
      } catch (error) {
        toast({
          title: "خطأ",
          description: "فشل تحميل بنك الامتحانات",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [toast]);

  // عرض الامتحان كما هو تماماً داخل إطار مستقل للحفاظ على تصميمه الأصلي
  if (activeQuiz) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-black">
        <div className="flex items-center justify-between border-b border-white/10 bg-black/90 px-4 py-3">
          <div className="text-sm text-white/80">
            {activeQuiz.courseCode} — {activeQuiz.title}
          </div>
          <Button variant="secondary" size="sm" onClick={() => setActiveQuiz(null)}>
            <ArrowRight className="ml-2 h-4 w-4" />
            رجوع إلى بنك الامتحانات
          </Button>
        </div>
        <iframe
          title={activeQuiz.title}
          src={`/api/exam-bank/quizzes/${activeQuiz.slug}/play`}
          className="flex-1 w-full border-0 bg-black"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="flex items-center gap-3 text-3xl font-bold">
          <ClipboardList className="h-8 w-8" />
          بنك الامتحانات
        </h1>
        <p className="mt-2 text-muted-foreground">
          امتحانات تفاعلية متاحة لجميع الطلاب (المجاني والمشترك) لمدة {availabilityHours} ساعة من لحظة
          النشر، ثم تُقفل تلقائياً.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader className="h-8 w-8 animate-spin" />
        </div>
      ) : quizzes.length === 0 ? (
        <p className="text-center text-muted-foreground">لا توجد امتحانات منشورة حالياً</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {quizzes.map((quiz) => (
            <Card key={quiz.slug} className={quiz.isOpen ? "" : "opacity-70"}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-lg leading-relaxed">{quiz.title}</CardTitle>
                  <span
                    className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs ${
                      quiz.isOpen
                        ? "bg-emerald-500/15 text-emerald-500"
                        : "bg-red-500/15 text-red-500"
                    }`}
                  >
                    {quiz.isOpen ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                    {quiz.isOpen ? "متاح الآن" : "مُقفل"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {quiz.courseCode} — {quiz.instructor}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed text-muted-foreground">{quiz.description}</p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span>{quiz.questionCount} سؤال</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {quiz.durationMinutes} دقيقة
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {quiz.isOpen
                    ? `يُقفل بعد ${formatRemaining(quiz.msRemaining)}`
                    : `أُقفل بتاريخ ${new Date(quiz.closesAt).toLocaleString("ar")}`}
                </p>
                <Button
                  className="w-full"
                  disabled={!quiz.isOpen}
                  onClick={() => setActiveQuiz(quiz)}
                >
                  {quiz.isOpen ? "بدء الامتحان" : "انتهت مدة الإتاحة"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
