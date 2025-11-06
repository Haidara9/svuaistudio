import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, FileText, CreditCard, TrendingUp, Calendar, Shield } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "مساعد ذكي بالذكاء الاصطناعي",
      description: "مساعد شخصي مدعوم بـ GPT-4، يفهم السياق الأكاديمي ويجيب على أسئلتك بشكل شامل وسهل الفهم",
      gradient: "from-secondary to-accent"
    },
    {
      icon: FileText,
      title: "تحليل وملخصات ذكية",
      description: "ارفع ملفات PDF والمستندات واحصل على ملخصات تلقائية، نقاط رئيسية، وتحليل عميق للمحتوى",
      gradient: "from-accent to-secondary"
    },
    {
      icon: CreditCard,
      title: "توليد الأسئلة والاختبارات",
      description: "أنشئ كويزات واختبارات تفاعلية تلقائياً من مواد دراستك مع أنواع متعددة من الأسئلة",
      gradient: "from-secondary to-accent"
    },
    {
      icon: TrendingUp,
      title: "تحليل الأداء والتوصيات",
      description: "تتبع تقدمك الأكاديمي مع تحليلات ذكية وتوصيات شخصية لتحسين نقاط ضعفك",
      gradient: "from-accent to-secondary"
    },
    {
      icon: Calendar,
      title: "خطة دراسية ذكية",
      description: "احصل على خطة دراسية مخصصة تتكيف مع وقتك وسرعة تعلمك مع تذكيرات ذكية",
      gradient: "from-secondary to-accent"
    },
    {
      icon: Shield,
      title: "مكتبة رقمية متكاملة",
      description: "مستودع شامل لجميع مواد الجامعة الافتراضية مع أدوات بحث متقدمة وتصنيف ذكي",
      gradient: "from-accent to-secondary"
    }
  ];

  return (
    <section id="features" className="py-20 bg-card">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 gradient-text">أدوات الذكاء الاصطناعي المتقدمة</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            مجموعة شاملة من الأدوات الذكية التي تدمج الذكاء الاصطناعي في كل جانب من جوانب دراستك
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
