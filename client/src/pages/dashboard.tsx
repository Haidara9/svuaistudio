import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { BookOpen, FileText, Brain, Calendar, TrendingUp, Clock } from "lucide-react";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

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
              <Link href="/documents">
                <Button variant="ghost" data-testid="link-documents">المستندات</Button>
              </Link>
              <Link href="/flashcards">
                <Button variant="ghost" data-testid="link-flashcards">البطاقات</Button>
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
            <span className="gradient-text">لوحة التحكم</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            تابع تقدمك الأكاديمي وإنجازاتك التعليمية
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg hover:shadow-secondary/10 transition-all duration-300" data-testid="card-total-documents">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المستندات</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary" data-testid="text-documents-count">0</div>
              <p className="text-xs text-muted-foreground">
                لم يتم رفع مستندات بعد
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg hover:shadow-accent/10 transition-all duration-300" data-testid="card-total-flashcards">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">البطاقات الدراسية</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent" data-testid="text-flashcards-count">0</div>
              <p className="text-xs text-muted-foreground">
                لم يتم إنشاء بطاقات بعد
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg hover:shadow-secondary/10 transition-all duration-300" data-testid="card-study-sessions">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الجلسات الدراسية</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary" data-testid="text-sessions-count">0</div>
              <p className="text-xs text-muted-foreground">
                لم يتم جدولة جلسات بعد
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg hover:shadow-accent/10 transition-all duration-300" data-testid="card-study-time">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">وقت الدراسة</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent" data-testid="text-study-time">0 ساعة</div>
              <p className="text-xs text-muted-foreground">
                هذا الأسبوع
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 space-x-reverse">
                <TrendingUp className="w-5 h-5" />
                <span>النشاط الأخير</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8 text-muted-foreground" data-testid="text-no-activity">
                  <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>لا توجد أنشطة حديثة</p>
                  <p className="text-sm">ابدأ برفع أول مستند لك</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>إجراءات سريعة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/documents">
                <Button className="w-full justify-start" variant="outline" data-testid="button-upload-document">
                  <FileText className="w-4 h-4 ml-2" />
                  رفع مستند جديد
                </Button>
              </Link>
              
              <Link href="/flashcards">
                <Button className="w-full justify-start" variant="outline" data-testid="button-review-flashcards">
                  <Brain className="w-4 h-4 ml-2" />
                  مراجعة البطاقات
                </Button>
              </Link>
              
              <Button className="w-full justify-start" variant="outline" data-testid="button-schedule-session">
                <Calendar className="w-4 h-4 ml-2" />
                جدولة جلسة دراسة
              </Button>
              
              <Button 
                className="w-full justify-start bg-gradient-to-r from-secondary to-accent text-background hover:opacity-90" 
                data-testid="button-ai-chat"
              >
                <Brain className="w-4 h-4 ml-2" />
                بدء محادثة مع المساعد الذكي
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Motivational Section */}
        <div className="mt-12 text-center bg-gradient-to-r from-secondary/10 to-accent/10 rounded-xl p-8">
          <h2 className="text-2xl font-bold gradient-text mb-2">استمر في التقدم!</h2>
          <p className="text-lg text-muted-foreground mb-4">كل خطوة تقربك من هدفك الأكاديمي</p>
          <p className="text-secondary font-semibold">التأثير يبدأ من هنا</p>
        </div>
      </div>
    </div>
  );
}
