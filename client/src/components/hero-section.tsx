import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="pt-32 pb-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl animate-float"></div>
        <div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" 
          style={{ animationDelay: '-2s' }}
        ></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main CTA */}
          <div className="mb-8 animate-slide-up">
            <Button 
              className="bg-gradient-to-r from-secondary to-accent text-background px-8 py-4 text-xl font-bold shadow-2xl animate-glow hover:scale-105 transition-transform duration-300"
              onClick={() => window.location.href = "/api/login"}
              data-testid="button-main-cta"
            >
              ابدأ اليوم وغيّر الغد
            </Button>
          </div>

          {/* Main Tagline */}
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <span className="gradient-text">تعلم بذكاء</span><br />
            <span className="text-foreground">مع شريكك الدراسي الافتراضي</span>
          </h1>

          {/* Subtitle Taglines */}
          <div className="mb-8 space-y-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-2xl text-secondary font-semibold" data-testid="text-tagline-impact">
              التأثير يبدأ من هنا
            </p>
            <p className="text-lg text-muted-foreground" data-testid="text-tagline-future">
              من صناعة الخبر… إلى صناعة المستقبل
            </p>
          </div>

          {/* Description */}
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.3s' }}>
            منصة ذكية مصممة خصيصاً لطلاب الجامعة الافتراضية السورية، تدمج الذكاء الاصطناعي مع أحدث تقنيات التعلم التفاعلي
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Button 
              className="bg-gradient-to-r from-secondary to-accent text-background px-8 py-4 text-lg font-semibold hover:shadow-xl hover:shadow-secondary/30 transition-all duration-300 flex items-center"
              onClick={() => window.location.href = "/api/login"}
              data-testid="button-start-trial"
            >
              <i className="fas fa-rocket ml-2"></i>
              ابدأ التجربة المجانية
            </Button>
            <Button 
              variant="outline"
              className="border-2 border-secondary/50 text-secondary px-8 py-4 text-lg font-semibold hover:bg-secondary/10 transition-all duration-300 flex items-center"
              data-testid="button-watch-demo"
            >
              <i className="fas fa-play-circle ml-2"></i>
              شاهد العرض التوضيحي
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
