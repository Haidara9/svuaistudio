import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExamBankList } from "@/pages/exam-bank";
import { useToast } from "@/hooks/use-toast";
import { Brain, FileText, BookOpen, TrendingUp, Zap } from "lucide-react";

export default function EnhancedDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Quiz Generation State
  const [quizText, setQuizText] = useState("");
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);

  // Study Plan State
  const [topics, setTopics] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("2");
  const [examDate, setExamDate] = useState("");
  const [studyPlan, setStudyPlan] = useState<any>(null);

  // Summarization State
  const [textToSummarize, setTextToSummarize] = useState("");
  const [summary, setSummary] = useState<any>(null);

  // Generate Quiz
  const handleGenerateQuiz = async () => {
    if (!quizText.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال نص لتوليد الأسئلة",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/ai/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: quizText,
          numberOfQuestions: 5,
          language: "ar",
        }),
      });

      if (!response.ok) throw new Error("Failed to generate quiz");

      const data = await response.json();
      setQuizQuestions(data.questions);
      toast({
        title: "نجح",
        description: "تم توليد الأسئلة بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل توليد الأسئلة",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create Study Plan
  const handleCreateStudyPlan = async () => {
    if (!topics.trim() || !examDate) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/ai/study-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topics: topics.split(",").map(t => t.trim()),
          availableHoursPerDay: parseFloat(hoursPerDay),
          examDate,
          language: "ar",
        }),
      });

      if (!response.ok) throw new Error("Failed to create study plan");

      const data = await response.json();
      setStudyPlan(data);
      toast({
        title: "نجح",
        description: "تم إنشاء خطة الدراسة بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل إنشاء خطة الدراسة",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Summarize Text
  const handleSummarizeText = async () => {
    if (!textToSummarize.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال نص لتلخيصه",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/ai/summarize-advanced", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textToSummarize,
          language: "ar",
        }),
      });

      if (!response.ok) throw new Error("Failed to summarize text");

      const data = await response.json();
      setSummary(data);
      toast({
        title: "نجح",
        description: "تم تلخيص النص بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل تلخيص النص",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Svu Ai Studio - لوحة التحكم
          </h1>
          <p className="text-muted-foreground text-lg">
            أدوات الذكاء الاصطناعي المتقدمة لتعزيز رحلتك الدراسية
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-secondary/10 to-accent/10 border-secondary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                الأسئلة المولدة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quizQuestions.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                أسئلة تفاعلية
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/10 to-accent/10 border-secondary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                خطط الدراسة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studyPlan ? 1 : 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                خطة نشطة
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/10 to-accent/10 border-secondary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                النصوص المحللة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary ? 1 : 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                ملخصات ذكية
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/10 to-accent/10 border-secondary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                الإنتاجية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <p className="text-xs text-muted-foreground mt-1">
                معدل الإنجاز
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">نظرة عامة</span>
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">توليد الأسئلة</span>
            </TabsTrigger>
            <TabsTrigger value="exam-bank" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">بنك الامتحانات</span>
            </TabsTrigger>
            <TabsTrigger value="study-plan" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">خطة الدراسة</span>
            </TabsTrigger>
            <TabsTrigger value="summarize" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">التلخيص</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>مرحباً بك في Svu Ai Studio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  استخدم أدوات الذكاء الاصطناعي المتقدمة لتحسين تجربتك الدراسية. يمكنك:
                </p>
                <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                  <li>توليد أسئلة اختبار من مواد الدراسة</li>
                  <li>إنشاء خطط دراسية مخصصة</li>
                  <li>تلخيص النصوص واستخراج النقاط الرئيسية</li>
                  <li>الحصول على توصيات شخصية لتحسين الأداء</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quiz Generation Tab */}
          <TabsContent value="quiz" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>توليد أسئلة الاختبار</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    أدخل النص أو المادة الدراسية
                  </label>
                  <Textarea
                    placeholder="الصق النص الذي تريد توليد أسئلة منه..."
                    value={quizText}
                    onChange={(e) => setQuizText(e.target.value)}
                    className="min-h-[200px]"
                  />
                </div>
                <Button
                  onClick={handleGenerateQuiz}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-secondary to-accent"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {loading ? "جاري التوليد..." : "توليد الأسئلة"}
                </Button>

                {quizQuestions.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h3 className="font-semibold">الأسئلة المولدة:</h3>
                    {quizQuestions.map((q, idx) => (
                      <Card key={idx} className="bg-card/50">
                        <CardContent className="pt-6">
                          <p className="font-medium mb-2">
                            {idx + 1}. {q.question}
                          </p>
                          {q.options && (
                            <div className="space-y-2 mb-3">
                              {q.options.map((opt: string, optIdx: number) => (
                                <div key={optIdx} className="text-sm text-muted-foreground">
                                  {String.fromCharCode(97 + optIdx)}) {opt}
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="text-sm">
                            <span className="font-medium">الإجابة الصحيحة:</span> {q.correctAnswer}
                          </div>
                          <div className="text-sm text-muted-foreground mt-2">
                            <span className="font-medium">الشرح:</span> {q.explanation}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Study Plan Tab */}
          <TabsContent value="exam-bank" className="space-y-4">
            <ExamBankList />
          </TabsContent>

          <TabsContent value="study-plan" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>إنشاء خطة دراسية مخصصة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    المواضيع (افصل بينها بفواصل)
                  </label>
                  <Input
                    placeholder="مثال: الرياضيات، الفيزياء، الكيمياء"
                    value={topics}
                    onChange={(e) => setTopics(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      الساعات المتاحة يومياً
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="24"
                      value={hoursPerDay}
                      onChange={(e) => setHoursPerDay(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      تاريخ الامتحان
                    </label>
                    <Input
                      type="date"
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  onClick={handleCreateStudyPlan}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-secondary to-accent"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {loading ? "جاري الإنشاء..." : "إنشاء الخطة"}
                </Button>

                {studyPlan && (
                  <Card className="bg-card/50 mt-6">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-4">{studyPlan.title}</h3>
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium">المدة:</span> {studyPlan.duration} يوم
                        </div>
                        <div>
                          <span className="font-medium">الساعات المتوقعة:</span> {studyPlan.estimatedHours} ساعة
                        </div>
                        <div>
                          <span className="font-medium">المواضيع:</span>
                          <ul className="list-disc list-inside mt-2">
                            {studyPlan.topics?.map((topic: string, idx: number) => (
                              <li key={idx} className="text-muted-foreground">{topic}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Summarization Tab */}
          <TabsContent value="summarize" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>تلخيص النصوص واستخراج النقاط الرئيسية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    أدخل النص المراد تلخيصه
                  </label>
                  <Textarea
                    placeholder="الصق النص الذي تريد تلخيصه..."
                    value={textToSummarize}
                    onChange={(e) => setTextToSummarize(e.target.value)}
                    className="min-h-[200px]"
                  />
                </div>
                <Button
                  onClick={handleSummarizeText}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-secondary to-accent"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {loading ? "جاري التلخيص..." : "تلخيص النص"}
                </Button>

                {summary && (
                  <div className="mt-6 space-y-4">
                    <Card className="bg-card/50">
                      <CardHeader>
                        <CardTitle className="text-lg">الملخص</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{summary.summary}</p>
                      </CardContent>
                    </Card>

                    {summary.keyPoints && summary.keyPoints.length > 0 && (
                      <Card className="bg-card/50">
                        <CardHeader>
                          <CardTitle className="text-lg">النقاط الرئيسية</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {summary.keyPoints.map((point: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-secondary font-bold mt-1">•</span>
                                <span className="text-muted-foreground">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {summary.mainIdeas && summary.mainIdeas.length > 0 && (
                      <Card className="bg-card/50">
                        <CardHeader>
                          <CardTitle className="text-lg">الأفكار الرئيسية</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {summary.mainIdeas.map((idea: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-accent font-bold mt-1">★</span>
                                <span className="text-muted-foreground">{idea}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

