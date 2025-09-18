export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "سجل وابدأ",
      description: "أنشئ حسابك مجاناً واختر تخصصك الأكاديمي",
      gradient: "from-secondary to-accent"
    },
    {
      number: 2,
      title: "ارفع مواد الدراسة",
      description: "حمل محاضراتك وكتبك ليقوم الذكاء الاصطناعي بتحليلها",
      gradient: "from-accent to-secondary"
    },
    {
      number: 3,
      title: "ادرس بذكاء",
      description: "استفد من الملخصات والبطاقات التلقائية والمساعد الذكي",
      gradient: "from-secondary to-accent"
    },
    {
      number: 4,
      title: "تابع تقدمك",
      description: "راقب إنجازاتك واحصل على توصيات لتحسين الأداء",
      gradient: "from-accent to-secondary"
    }
  ];

  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 gradient-text">كيف يعمل SVU Studio</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            رحلة تعليمية متكاملة تبدأ من اللحظة الأولى
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center group" data-testid={`step-${index + 1}`}>
              <div className={`w-20 h-20 bg-gradient-to-r ${step.gradient} rounded-full flex items-center justify-center mx-auto mb-4 text-background text-2xl font-bold group-hover:scale-110 transition-transform duration-300`}>
                {step.number}
              </div>
              <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
