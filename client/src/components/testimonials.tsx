import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star, User } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "أحمد محمود",
      role: "طالب إعلام - السنة الثالثة",
      content: "SVU Studio غيّر طريقة دراستي بالكامل. المساعد الذكي يجيب على أسئلتي بالعربية بشكل مثالي، والبطاقات التلقائية وفرت علي ساعات من العمل.",
      gradient: "from-secondary to-accent"
    },
    {
      name: "فاطمة العلي",
      role: "طالبة اتصالات - السنة الثانية",
      content: "تطبيق رائع! أعجبني كيف يلخص المحاضرات الطويلة في نقاط مهمة، وكاشف الانتحال ساعدني في التأكد من أصالة أعمالي البحثية.",
      gradient: "from-accent to-secondary"
    },
    {
      name: "خالد حسن",
      role: "طالب إعلام - السنة الرابعة",
      content: "منصة متقدمة حقاً. تتبع التقدم والتحليلات ساعدتني في فهم نقاط قوتي وضعفي. أنصح كل طالب في SVU بتجربتها.",
      gradient: "from-secondary to-accent"
    }
  ];

  const renderStars = () => (
    <div className="flex text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-current" />
      ))}
    </div>
  );

  return (
    <section id="testimonials" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 gradient-text">ماذا يقول طلابنا</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            تجارب حقيقية من طلاب الجامعة الافتراضية السورية
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="bg-card border border-border hover:shadow-lg hover:shadow-secondary/10 transition-all duration-300"
              data-testid={`testimonial-${index}`}
            >
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${testimonial.gradient} rounded-full flex items-center justify-center ml-4`}>
                    <User className="w-6 h-6 text-background" />
                  </div>
                  <div>
                    <h4 className="font-bold" data-testid={`text-name-${index}`}>{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground" data-testid={`text-role-${index}`}>
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4" data-testid={`text-content-${index}`}>
                  "{testimonial.content}"
                </p>
                {renderStars()}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
