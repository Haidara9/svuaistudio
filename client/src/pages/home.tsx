import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { BookOpen, Brain, Calendar, FileText, TrendingUp, Users } from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-secondary to-accent flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-background" />
              </div>
              <div className="text-xl font-bold gradient-text">SVU Studio</div>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <span className="text-sm text-muted-foreground">
                مرحباً، {user?.firstName || "طالب"}
              </span>
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
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">مرحباً بك في SVU Studio</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            شريكك الدراسي الذكي لتجربة تعليمية متقدمة وممتعة
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Link href="/documents">
            <Card className="hover:shadow-lg hover:shadow-secondary/10 transition-all duration-300 cursor-pointer group" data-testid="card-documents">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-12 h-12 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <FileText className="w-6 h-6 text-background" />
                  </div>
                  <span>إدارة المستندات</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  ارفع وإدارة ملفاتك الدراسية واحصل على ملخصات ذكية
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/flashcards">
            <Card className="hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 cursor-pointer group" data-testid="card-flashcards">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-12 h-12 bg-gradient-to-r from-accent to-secondary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Brain className="w-6 h-6 text-background" />
                  </div>
                  <span>البطاقات الدراسية</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  راجع بطاقاتك الدراسية وطور مهاراتك بنظام التكرار الذكي
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/exam-bank">
            <Card className="hover:shadow-lg hover:shadow-secondary/10 transition-all duration-300 cursor-pointer group" data-testid="card-exam-bank">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-12 h-12 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <FileText className="w-6 h-6 text-background" />
                  </div>
                  <span>بنك الامتحانات</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  امتحانات تفاعلية متاحة للجميع لمدة 48 ساعة من نشرها
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/library">
            <Card className="hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 cursor-pointer group" data-testid="card-library">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-12 h-12 bg-gradient-to-r from-accent to-secondary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <FileText className="w-6 h-6 text-background" />
                  </div>
                  <span>المكتبة الجاهزة</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  مستندات وبودكاست صوتي مفتوح بشكل دائم لكل الطلاب
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard">
            <Card className="hover:shadow-lg hover:shadow-secondary/10 transition-all duration-300 cursor-pointer group" data-testid="card-dashboard">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-12 h-12 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-6 h-6 text-background" />
                  </div>
                  <span>لوحة التحكم</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  تابع تقدمك الأكاديمي واحصل على إحصائيات مفصلة
                </p>
              </CardContent>
            </Card>
          </Link>

          <Card className="hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 group" data-testid="card-ai-assistant">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 space-x-reverse">
                <div className="w-12 h-12 bg-gradient-to-r from-accent to-secondary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-6 h-6 text-background" />
                </div>
                <span>المساعد الذكي</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                اسأل مساعدك الذكي أي سؤال أكاديمي
              </p>
              <Button className="w-full bg-gradient-to-r from-accent to-secondary" data-testid="button-open-ai">
                ابدأ المحادثة
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg hover:shadow-secondary/10 transition-all duration-300 group" data-testid="card-study-sessions">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 space-x-reverse">
                <div className="w-12 h-12 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-6 h-6 text-background" />
                </div>
                <span>الجلسات الدراسية</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                نظم جلساتك الدراسية وحدد أهدافك
              </p>
              <Button variant="outline" className="w-full" data-testid="button-schedule-session">
                جدولة جلسة
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 group" data-testid="card-community">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 space-x-reverse">
                <div className="w-12 h-12 bg-gradient-to-r from-accent to-secondary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-background" />
                </div>
                <span>مجتمع الطلاب</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                تواصل مع زملائك وشارك المعرفة
              </p>
              <Button variant="outline" className="w-full" data-testid="button-join-community">
                انضم للمجتمع
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Motivational Quote */}
        <div className="text-center bg-gradient-to-r from-secondary/10 to-accent/10 rounded-xl p-8">
          <h2 className="text-2xl font-bold gradient-text mb-2">التأثير يبدأ من هنا</h2>
          <p className="text-lg text-muted-foreground">من صناعة الخبر… إلى صناعة المستقبل</p>
        </div>
      </div>
    </div>
  );
}
