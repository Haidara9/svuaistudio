import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, FileText, CreditCard, TrendingUp, Calendar, Shield } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "مساعد ذكي بالذكاء الاصطناعي",
      description: "مساعد شخصي يدعم العربية والإنجليزية، يجيب على أسئلتك ويساعدك في فهم المواد الدراسية بطريقة تفاعلية",
      gradient: "from-secondary to-accent"
    },
    {
      icon: FileText,
      title: "معالجة المستندات الذكية",
      description: "ارفع ملفات PDF و DOCX واحصل على ملخصات فورية، بطاقات دراسية تلقائية، وتحليل شامل للمحتوى",
      gradient: "from-accent to-secondary"
    },
    {
      icon: CreditCard,
      title: "بطاقات دراسية تفاعلية",
      description: "نظام متقدم للبطاقات الدراسية مع تقنية التكرار المتباعد لضمان حفظ أطول وفهم أعمق",
      gradient: "from-secondary to-accent"
    },
    {
      icon: TrendingUp,
      title: "تتبع التقدم الذكي",
      description: "لوحة تحكم شاملة لمراقبة تقدمك الأكاديمي، مع تحليلات متقدمة وتوصيات شخصية لتحسين الأداء",
      gradient: "from-accent to-secondary"
    },
    {
      icon: Calendar,
      title: "منظم الجلسات الدراسية",
      description: "خطط جلساتك الدراسية بذكاء مع تكامل التقويم، تذكيرات ذكية، ونظام إدارة الوقت الأمثل",
      gradient: "from-secondary to-accent"
    },
    {
      icon: Shield,
      title: "كاشف الانتحال",
      description: "تأكد من أصالة أعمالك الأكاديمية مع نظام متطور لكشف الانتحال وضمان النزاهة الأكاديمية",
      gradient: "from-accent to-secondary"
    }
  ];

  return (
    <section id="features" className="py-20 bg-card">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 gradient-text">ميزات متقدمة لتعلم أفضل</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            اكتشف مجموعة شاملة من الأدوات الذكية المصممة لتعزيز تجربتك التعليمية
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="bg-background/50 border border-border hover:border-secondary/50 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/10 group"
              data-testid={`feature-card-${index}`}
            >
              <CardHeader>
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-background" />
                </div>
                <CardTitle className="text-2xl font-bold mb-3">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
