import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Download, Trash2, Search, Upload, FileText, Loader } from "lucide-react";

interface Document {
  id: string;
  title: string;
  originalName: string;
  fileSize: number;
  fileType: string;
  createdAt: string;
}

export default function Library() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  // Fetch documents on mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/documents");
      if (!response.ok) throw new Error("Failed to fetch documents");
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل تحميل المستندات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", file.name);

    try {
      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload file");

      toast({
        title: "نجح",
        description: "تم رفع الملف بنجاح",
      });

      fetchDocuments();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل رفع الملف",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete document");

      toast({
        title: "نجح",
        description: "تم حذف المستند بنجاح",
      });

      fetchDocuments();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل حذف المستند",
        variant: "destructive",
      });
    }
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-background p-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            <BookOpen className="inline-block w-8 h-8 mr-2" />
            المكتبة الرقمية
          </h1>
          <p className="text-muted-foreground text-lg">
            مستودع شامل لجميع مواد الجامعة الافتراضية السورية
          </p>
        </div>

        {/* Upload Section */}
        <Card className="mb-8 bg-gradient-to-r from-secondary/10 to-accent/10 border-secondary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              رفع مستندات جديدة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button
                  asChild
                  disabled={uploading}
                  className="bg-gradient-to-r from-secondary to-accent cursor-pointer"
                >
                  <span>
                    {uploading ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        جاري الرفع...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        اختر ملف
                      </>
                    )}
                  </span>
                </Button>
              </label>
              <p className="text-sm text-muted-foreground">
                PDF, DOCX, DOC, TXT (الحد الأقصى 10MB)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Search Section */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="ابحث عن مستند..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-4 pr-10"
            />
          </div>
        </div>

        {/* Documents Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-secondary" />
          </div>
        ) : filteredDocuments.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                {documents.length === 0
                  ? "لم تقم برفع أي مستندات بعد"
                  : "لم يتم العثور على مستندات"}
              </p>
              {documents.length === 0 && (
                <label htmlFor="file-upload">
                  <Button asChild className="bg-gradient-to-r from-secondary to-accent cursor-pointer">
                    <span>رفع أول مستند</span>
                  </Button>
                </label>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <FileText className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate">
                          {doc.title}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatFileSize(doc.fileSize)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    تم الرفع: {new Date(doc.createdAt).toLocaleDateString("ar-SA")}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        // Download functionality would go here
                        toast({
                          title: "معلومة",
                          description: "سيتم تحميل الملف قريباً",
                        });
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      تحميل
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteDocument(doc.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats Section */}
        {documents.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-card/50">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-2">إجمالي المستندات</p>
                <p className="text-3xl font-bold">{documents.length}</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-2">إجمالي الحجم</p>
                <p className="text-3xl font-bold">
                  {formatFileSize(
                    documents.reduce((sum, doc) => sum + doc.fileSize, 0)
                  )}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-2">آخر تحديث</p>
                <p className="text-sm font-medium">
                  {documents.length > 0
                    ? new Date(documents[0].createdAt).toLocaleDateString("ar-SA")
                    : "-"}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

