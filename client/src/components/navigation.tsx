import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

export default function Navigation() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-secondary to-accent flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-background" />
            </div>
            <div className="text-xl font-bold gradient-text">Svu Ai Studio</div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 space-x-reverse">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-features">
              الميزات
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-how-it-works">
              كيف يعمل
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-pricing">
              الأسعار
            </a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-testimonials">
              آراء الطلاب
            </a>
          </div>
          
          <div className="flex items-center space-x-4 space-x-reverse">
            <Button 
              variant="ghost" 
              onClick={() => window.location.href = "/api/login"}
              data-testid="button-login"
            >
              تسجيل الدخول
            </Button>
            <Button 
              className="bg-gradient-to-r from-secondary to-accent text-background hover:opacity-90"
              onClick={() => window.location.href = "/api/login"}
              data-testid="button-start-free"
            >
              البدء مجاناً
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
