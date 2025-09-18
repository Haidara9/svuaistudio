import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { BookOpen, FileText, Upload, Trash2, FileCheck, Loader2 } from "lucide-react";

interface Document {
  id: string;
  title: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  isProcessed: boolean;
  summary?: string;
  createdAt: string;
}

export default function Documents() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");

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

  // Fetch documents
  const { data: documents = [], isLoading: documentsLoading } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
    retry: false,
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiRequest("POST", "/api/documents/upload", formData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "تم الرفع بنجاح",
        description: "سيتم معالجة المستند وإنشاء البطاقات الدراسية قريباً",
      });
      setSelectedFile(null);
      setTitle("");
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "فشل في رفع الملف",
        description: "حدث خطأ أثناء رفع الملف. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/documents/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف المستند بنجاح",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "فشل في الحذف",
        description: "حدث خطأ أثناء حذف المستند",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!title) {
        setTitle(file.name.split('.')[0]);
      }
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("title", title || selectedFile.name);

    uploadMutation.mutate(formData);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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
              <Link href="/dashboard">
                <Button variant="ghost" data-testid="link-dashboard">لوحة التحكم</Button>
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
            <span className="gradient-text">إدارة المستندات</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            ارفع ملفاتك الدراسية واحصل على ملخصات ذكية وبطاقات دراسية تلقائية
          </p>
        </div>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 space-x-reverse">
              <Upload className="w-5 h-5" />
              <span>رفع مستند جديد</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileSelect}
                data-testid="input-file"
              />
              <p className="text-sm text-muted-foreground mt-2">
                الملفات المدعومة: PDF, DOCX, DOC, TXT (حد أقصى 10 ميجابايت)
              </p>
            </div>
            
            {selectedFile && (
              <div>
                <Input
                  placeholder="عنوان المستند"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  data-testid="input-title"
                />
              </div>
            )}
            
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploadMutation.isPending}
              className="bg-gradient-to-r from-secondary to-accent"
              data-testid="button-upload"
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  جاري الرفع...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 ml-2" />
                  رفع المستند
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Documents List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 space-x-reverse">
              <FileText className="w-5 h-5" />
              <span>مستنداتي</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {documentsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground" data-testid="text-no-documents">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>لا توجد مستندات مرفوعة بعد</p>
                <p className="text-sm">ابدأ برفع أول مستند لك</p>
              </div>
            ) : (
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-md transition-shadow"
                    data-testid={`document-${doc.id}`}
                  >
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="w-12 h-12 bg-gradient-to-r from-secondary to-accent rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-background" />
                      </div>
                      <div>
                        <h3 className="font-semibold" data-testid={`text-document-title-${doc.id}`}>
                          {doc.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(doc.fileSize)} • {new Date(doc.createdAt).toLocaleDateString('ar-SA')}
                        </p>
                        {doc.isProcessed && (
                          <div className="flex items-center space-x-1 space-x-reverse text-green-500">
                            <FileCheck className="w-4 h-4" />
                            <span className="text-sm">تم المعالجة</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 space-x-reverse">
                      {doc.isProcessed && (
                        <Link href="/flashcards">
                          <Button size="sm" variant="outline" data-testid={`button-view-flashcards-${doc.id}`}>
                            عرض البطاقات
                          </Button>
                        </Link>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteMutation.mutate(doc.id)}
                        disabled={deleteMutation.isPending}
                        data-testid={`button-delete-${doc.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
