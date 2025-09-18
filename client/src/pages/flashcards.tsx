import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { BookOpen, Brain, RotateCcw, Check, X, Loader2 } from "lucide-react";

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  difficulty: string;
  reviewCount: number;
  correctCount: number;
  nextReview: string;
}

export default function Flashcards() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "غير مصرح",
        description: "تم تسجيل خروجك. جاري تسجيل الدخول مرة أخرى...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Fetch all flashcards
  const { data: allFlashcards = [], isLoading: allCardsLoading } = useQuery<Flashcard[]>({
    queryKey: ["/api/flashcards"],
    retry: false,
  });

  // Fetch due flashcards
  const { data: dueFlashcards = [], isLoading: dueCardsLoading } = useQuery<Flashcard[]>({
    queryKey: ["/api/flashcards/due"],
    retry: false,
  });

  // Review mutation
  const reviewMutation = useMutation({
    mutationFn: async ({ id, correct }: { id: string; correct: boolean }) => {
      await apiRequest("PUT", `/api/flashcards/${id}/review`, { correct });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/flashcards"] });
      queryClient.invalidateQueries({ queryKey: ["/api/flashcards/due"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "غير مصرح",
          description: "تم تسجيل خروجك. جاري تسجيل الدخول مرة أخرى...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "فشل في تسجيل المراجعة",
        description: "حدث خطأ أثناء تسجيل المراجعة",
        variant: "destructive",
      });
    },
  });

  const flashcards = reviewMode ? dueFlashcards : allFlashcards;
  const currentCard = flashcards[currentCardIndex];

  const handleAnswer = (correct: boolean) => {
    if (currentCard) {
      reviewMutation.mutate({ id: currentCard.id, correct });
      
      if (currentCardIndex < flashcards.length - 1) {
        setCurrentCardIndex(prev => prev + 1);
      } else {
        setCurrentCardIndex(0);
        if (reviewMode) {
          toast({
            title: "تهانينا!",
            description: "لقد أنهيت مراجعة جميع البطاقات المستحقة",
          });
        }
      }
      setShowAnswer(false);
    }
  };

  const nextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      setCurrentCardIndex(0);
    }
    setShowAnswer(false);
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
    } else {
      setCurrentCardIndex(flashcards.length - 1);
    }
    setShowAnswer(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-500';
      case 'medium': return 'bg-yellow-500/20 text-yellow-500';
      case 'hard': return 'bg-red-500/20 text-red-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'سهل';
      case 'medium': return 'متوسط';
      case 'hard': return 'صعب';
      default: return 'غير محدد';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/">
              <div className="flex items-center space-x-4 space-x-reverse cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-secondary to-accent flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-background" />
                </div>
                <div className="text-xl font-bold gradient-text">SVU Studio</div>
              </div>
            </Link>
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link href="/dashboard">
                <Button variant="ghost" data-testid="link-dashboard">لوحة التحكم</Button>
              </Link>
              <Link href="/documents">
                <Button variant="ghost" data-testid="link-documents">المستندات</Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => window.location.href = "/api/logout"}
                data-testid="button-logout"
              >
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">البطاقات الدراسية</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            راجع بطاقاتك الدراسية وطور مهاراتك بنظام التكرار الذكي
          </p>
        </div>

        {/* Stats and Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">إجمالي البطاقات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary" data-testid="text-total-cards">
                {allFlashcards.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">بطاقات للمراجعة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent" data-testid="text-due-cards">
                {dueFlashcards.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">وضع المراجعة</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => {
                  setReviewMode(!reviewMode);
                  setCurrentCardIndex(0);
                  setShowAnswer(false);
                }}
                variant={reviewMode ? "default" : "outline"}
                className="w-full"
                data-testid="button-toggle-review-mode"
              >
                {reviewMode ? "مراجعة البطاقات المستحقة" : "مراجعة جميع البطاقات"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Flashcard Display */}
        {(allCardsLoading || dueCardsLoading) ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : flashcards.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground" data-testid="text-no-flashcards">
                <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">
                  {reviewMode ? "لا توجد بطاقات مستحقة للمراجعة" : "لا توجد بطاقات دراسية بعد"}
                </p>
                <p className="text-sm">
                  {reviewMode ? "عد لاحقاً لمراجعة البطاقات الجديدة" : "ارفع مستنداتك لإنشاء بطاقات دراسية تلقائياً"}
                </p>
                {!reviewMode && (
                  <Link href="/documents">
                    <Button className="mt-4" data-testid="button-upload-documents">
                      رفع مستند
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-2xl mx-auto">
            {/* Card Counter */}
            <div className="text-center mb-4">
              <span className="text-muted-foreground" data-testid="text-card-counter">
                البطاقة {currentCardIndex + 1} من {flashcards.length}
              </span>
            </div>

            {/* Main Flashcard */}
            <Card className="mb-6 min-h-[400px]">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <Badge className={getDifficultyColor(currentCard?.difficulty || '')} data-testid="badge-difficulty">
                    {getDifficultyText(currentCard?.difficulty || '')}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    مراجعات: {currentCard?.reviewCount || 0} | صحيح: {currentCard?.correctCount || 0}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col justify-center min-h-[300px]">
                <div className="text-center">
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">السؤال:</h3>
                    <p className="text-lg" data-testid="text-question">
                      {currentCard?.question}
                    </p>
                  </div>

                  {showAnswer && (
                    <div className="border-t pt-8">
                      <h3 className="text-xl font-semibold mb-4 text-secondary">الإجابة:</h3>
                      <p className="text-lg" data-testid="text-answer">
                        {currentCard?.answer}
                      </p>
                    </div>
                  )}

                  {!showAnswer ? (
                    <Button
                      onClick={() => setShowAnswer(true)}
                      className="bg-gradient-to-r from-secondary to-accent"
                      data-testid="button-show-answer"
                    >
                      إظهار الإجابة
                    </Button>
                  ) : (
                    <div className="flex justify-center space-x-4 space-x-reverse mt-8">
                      <Button
                        onClick={() => handleAnswer(false)}
                        variant="destructive"
                        disabled={reviewMutation.isPending}
                        data-testid="button-incorrect"
                      >
                        <X className="w-4 h-4 ml-2" />
                        خطأ
                      </Button>
                      <Button
                        onClick={() => handleAnswer(true)}
                        className="bg-green-600 hover:bg-green-700"
                        disabled={reviewMutation.isPending}
                        data-testid="button-correct"
                      >
                        <Check className="w-4 h-4 ml-2" />
                        صحيح
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Navigation Controls */}
            <div className="flex justify-between items-center">
              <Button
                onClick={prevCard}
                variant="outline"
                data-testid="button-previous-card"
              >
                <RotateCcw className="w-4 h-4 ml-2" />
                السابق
              </Button>

              <Button
                onClick={() => {
                  setCurrentCardIndex(0);
                  setShowAnswer(false);
                }}
                variant="outline"
                data-testid="button-reset-cards"
              >
                إعادة تعيين
              </Button>

              <Button
                onClick={nextCard}
                variant="outline"
                data-testid="button-next-card"
              >
                التالي
                <RotateCcw className="w-4 h-4 mr-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
