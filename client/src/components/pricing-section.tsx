import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function PricingSection() {
  const plans = [
    {
      name: "الخطة المجانية",
      price: "مجاني",
      description: "مثالي للطلاب الجدد",
      features: [
        "5 ملفات شهرياً",
        "بطاقات دراسية محدودة",
        "مساعد ذكي أساسي",
        "تتبع تقدم بسيط"
      ],
      buttonText: "ابدأ مجاناً",
      buttonVariant: "outline" as const,
      featured: false
    },
    {
      name: "الخطة المتقدمة",
      price: "$9.99",
      priceSubtext: "شهرياً / طالب",
      description: "الأكثر شعبية",
      features: [
        "ملفات غير محدودة",
        "بطاقات دراسية متقدمة",
        "مساعد ذكي متقدم",
        "تحليلات شاملة",
        "كشف الانتحال",
        "دعم أولوية"
      ],
      buttonText: "ارتق للمتقدم",
      buttonVariant: "default" as const,
      featured: true
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-card">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 gradient-text">خطط تناسب احتياجاتك</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            ابدأ مجاناً وارتق للخطة المتقدمة عند الحاجة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`${
                plan.featured 
                  ? "bg-gradient-to-br from-secondary/10 to-accent/10 border-2 neon-border relative overflow-hidden hover:shadow-xl hover:shadow-secondary/20" 
                  : "bg-background/50 border border-border hover:shadow-lg hover:shadow-secondary/10"
              } transition-all duration-300`}
              data-testid={`pricing-card-${index}`}
            >
              {plan.featured && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-secondary to-accent text-background px-3 py-1 rounded-full text-sm font-bold">
                  الأكثر شعبية
                </div>
              )}
              
              <CardHeader className="text-center mb-8">
                <CardTitle className={`text-3xl font-bold mb-2 ${plan.featured ? "gradient-text" : ""}`}>
                  {plan.name}
                </CardTitle>
                <div className={`text-5xl font-bold mb-4 ${plan.featured ? "gradient-text" : "text-secondary"}`}>
                  {plan.price}
                </div>
                {plan.priceSubtext && (
                  <p className="text-muted-foreground">{plan.priceSubtext}</p>
                )}
                <p className="text-muted-foreground">{plan.description}</p>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-secondary ml-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  className={
                    plan.featured 
                      ? "w-full bg-gradient-to-r from-secondary to-accent text-background hover:opacity-90" 
                      : "w-full border-2 border-secondary text-secondary hover:bg-secondary/10"
                  }
                  variant={plan.buttonVariant}
                  onClick={() => window.location.href = "/api/login"}
                  data-testid={`button-${plan.featured ? "premium" : "free"}-plan`}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
