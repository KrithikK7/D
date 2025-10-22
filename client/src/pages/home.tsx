import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book, Heart, LogIn, LogOut, Play } from "lucide-react";
import { Knot } from "@/components/Knot";
import { useAuth } from "@/contexts/AuthContext";
import type { Chapter, ReadingProgress } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const { data: chapters = [] } = useQuery<Chapter[]>({
    queryKey: ["/api/chapters"],
  });

  const { data: lastRead } = useQuery<ReadingProgress | null>({
    queryKey: [`/api/reading-progress/last?userId=${user?.id || ''}`],
    enabled: !!user,
  });

  const handleLogin = () => {
    setLocation("/login");
  };

  const handleAdmin = () => {
    setLocation("/admin");
  };

  const handleResume = () => {
    if (lastRead?.sectionId) {
      setLocation(`/read/${lastRead.sectionId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-kdrama-cream/40 via-kdrama-sakura/20 to-kdrama-lavender/20">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-kdrama-thread via-kdrama-sakura to-kdrama-lavender" />
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-end mb-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="font-noto text-sm text-muted-foreground">
                {user?.username}
              </span>
              {user?.role === "admin" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAdmin}
                  data-testid="button-admin"
                >
                  Admin
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogin}
              data-testid="button-login-header"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Button>
          )}
        </div>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Knot size="lg" tone="primary" />
            <h1 className="font-myeongjo text-5xl md:text-7xl font-bold text-kdrama-ink dark:text-foreground">
              紅線日記
            </h1>
            <Knot size="lg" tone="gold" />
          </div>
          
          <p className="font-noto text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Red String of Fate Journal
          </p>

          {lastRead && (
            <Button
              size="lg"
              onClick={handleResume}
              className="font-noto rounded-2xl"
              data-testid="button-resume"
            >
              <Play className="w-5 h-5 mr-2" />
              Resume Reading
            </Button>
          )}
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-myeongjo text-3xl font-bold text-kdrama-ink dark:text-foreground">
              Chapters
            </h2>
            <Badge variant="secondary" className="font-noto">
              {chapters.length} {chapters.length === 1 ? "Chapter" : "Chapters"}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chapters.map((chapter) => (
              <Card
                key={chapter.id}
                className="cursor-pointer bg-white/80 dark:bg-card/80 backdrop-blur-sm rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-180 hover:-translate-y-1 overflow-hidden"
                onClick={() => setLocation(`/chapter/${chapter.id}`)}
                data-testid={`card-chapter-${chapter.id}`}
              >
                {chapter.coverImage ? (
                  <div className="h-48 w-full overflow-hidden">
                    <img
                      src={chapter.coverImage}
                      alt={chapter.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 w-full bg-gradient-to-br from-kdrama-sakura/30 via-kdrama-lavender/30 to-kdrama-sky/30 flex items-center justify-center">
                    <Book className="w-16 h-16 text-kdrama-thread/30" />
                  </div>
                )}
                
                <CardHeader>
                  <CardTitle className="font-myeongjo text-2xl text-kdrama-ink dark:text-foreground">
                    {chapter.title}
                  </CardTitle>
                  {chapter.description && (
                    <CardDescription className="font-noto">
                      {chapter.description}
                    </CardDescription>
                  )}
                </CardHeader>
              </Card>
            ))}
          </div>

          {chapters.length === 0 && (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 mx-auto mb-4 text-kdrama-thread/30" />
              <p className="font-noto text-lg text-muted-foreground">
                No chapters yet. The journey awaits...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
