import { BookOpen } from "lucide-react";

export default function Footer() {
  return (
    <>
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-secondary/10 to-accent/10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold mb-6 gradient-text">جاهز لتحويل تجربتك الدراسية؟</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            انضم لآلاف الطلاب الذين اختاروا SVU Studio كشريك دراسي ذكي
          </p>
          <p className="text-2xl text-secondary font-semibold mb-8" data-testid="text-impact-starts">
            التأثير يبدأ من هنا
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              className="bg-gradient-to-r from-secondary to-accent text-background px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl hover:shadow-secondary/30 transition-all duration-300 flex items-center"
              onClick={() => window.location.href = "/api/login"}
              data-testid="button-start-now"
            >
              <i className="fas fa-rocket ml-2"></i>
              ابدأ التجربة المجانية الآن
            </button>
            <button 
              className="border-2 border-secondary/50 text-secondary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-secondary/10 transition-all duration-300 flex items-center"
              data-testid="button-contact"
            >
              <i className="fas fa-phone ml-2"></i>
              تواصل معنا
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-4 space-x-reverse mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-secondary to-accent flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-background" />
                </div>
                <div className="text-2xl font-bold gradient-text">SVU Studio</div>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6 max-w-md">
                شريكك الدراسي الافتراضي المبتكر - مصمم خصيصاً لطلاب الجامعة الافتراضية السورية لتجربة تعليمية متقدمة وممتعة.
              </p>
              <div className="flex space-x-4 space-x-reverse">
                <a 
                  href="#" 
                  className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center text-secondary hover:bg-secondary hover:text-background transition-colors duration-300"
                  data-testid="link-facebook"
                >
                  <i className="fab fa-facebook"></i>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center text-secondary hover:bg-secondary hover:text-background transition-colors duration-300"
                  data-testid="link-twitter"
                >
                  <i className="fab fa-twitter"></i>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center text-secondary hover:bg-secondary hover:text-background transition-colors duration-300"
                  data-testid="link-linkedin"
                >
                  <i className="fab fa-linkedin"></i>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center text-secondary hover:bg-secondary hover:text-background transition-colors duration-300"
                  data-testid="link-telegram"
                >
                  <i className="fab fa-telegram"></i>
                </a>
              </div>
            </div>

            {/* Platform Links */}
            <div>
              <h4 className="font-bold mb-4 text-lg">المنصة</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#features" className="hover:text-secondary transition-colors" data-testid="link-footer-features">الميزات</a></li>
                <li><a href="#pricing" className="hover:text-secondary transition-colors" data-testid="link-footer-pricing">الأسعار</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors" data-testid="link-footer-security">الأمان</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors" data-testid="link-footer-api">API</a></li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="font-bold mb-4 text-lg">الدعم</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-secondary transition-colors" data-testid="link-footer-help">مركز المساعدة</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors" data-testid="link-footer-contact-support">تواصل معنا</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors" data-testid="link-footer-privacy">سياسة الخصوصية</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors" data-testid="link-footer-terms">شروط الاستخدام</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-muted-foreground">
              © 2024 SVU Studio. جميع الحقوق محفوظة. مصمم بحب لطلاب الجامعة الافتراضية السورية.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
