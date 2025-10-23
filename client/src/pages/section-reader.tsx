import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { ThreadBar } from "@/components/ThreadBar";
import { SectionSidebar } from "@/components/SectionSidebar";
import type { Section, Page } from "@shared/schema";

export default function SectionReader() {
  const { sectionId } = useParams();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { data: section } = useQuery<Section>({
    queryKey: [`/api/sections/${sectionId}`],
  });

  const { data: pages = [] } = useQuery<Page[]>({
    queryKey: [`/api/sections/${sectionId}/pages`],
  });

  const saveProgressMutation = useMutation({
    mutationFn: async (data: { pageId: string; completed: boolean; currentPageNumber: number }) => {
      if (!user?.id) return;
      return apiRequest("POST", "/api/reading-progress", {
        userId: user.id,
        sectionId: sectionId!,
        pageId: data.pageId,
        currentPageNumber: data.currentPageNumber,
        completed: data.completed,
      });
    },
  });

  const currentPage = pages[currentPageIndex];
  const totalPages = pages.length;
  const progress = totalPages > 0 ? ((currentPageIndex + 1) / totalPages) * 100 : 0;

  useEffect(() => {
    if (currentPage && user?.id) {
      const isLastPage = currentPageIndex === totalPages - 1;
      saveProgressMutation.mutate({
        pageId: currentPage.id,
        currentPageNumber: currentPage.pageNumber,
        completed: isLastPage,
      });
    }
  }, [currentPageIndex, currentPage?.id, user?.id]);

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPageIndex < totalPages - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };


  const renderContent = (content: string) => {
    const embedRegex = /\[embed:([^\]]+)\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = embedRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }
      
      const embedUrl = match[1];
      if (embedUrl.includes("instagram.com")) {
        parts.push(
          <div key={match.index} className="my-6">
            <iframe
              src={`${embedUrl}embed/`}
              className="w-full max-w-md mx-auto rounded-md"
              style={{ minHeight: "500px" }}
              frameBorder="0"
              scrolling="no"
              allowFullScreen
            />
          </div>
        );
      } else if (embedUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        parts.push(
          <img
            key={match.index}
            src={embedUrl}
            alt="Embedded content"
            className="my-6 rounded-md max-w-full mx-auto"
          />
        );
      }
      
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return parts;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-kdrama-sakura/10 via-kdrama-cream/30 to-kdrama-lavender/10">
      {section?.chapterId && (
        <SectionSidebar
          chapterId={section.chapterId}
          currentSectionId={sectionId!}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      )}

      <div className={`transition-all duration-300 ${sidebarOpen ? "lg:ml-80" : "lg:ml-16"}`}>
        <ThreadBar progress={progress} />

        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="mb-8">
            <h1 className="font-myeongjo text-3xl md:text-4xl text-kdrama-ink">
              {section?.title || "Loading..."}
            </h1>
            {section && (
              <div className="flex flex-wrap items-center gap-3 mt-3">
                {section.mood && (
                  <Badge variant="secondary" className="font-noto">
                    {section.mood}
                  </Badge>
                )}
                {section.tags?.map((tag) => (
                  <Badge key={tag} variant="outline" className="font-noto">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

        <Card className="p-8 md:p-12 bg-white/80 backdrop-blur-sm border-0 shadow-md">
          <div className="prose prose-lg max-w-none font-noto">
            {currentPage ? (
              <div className="whitespace-pre-wrap leading-relaxed text-kdrama-ink">
                {renderContent(currentPage.content)}
              </div>
            ) : (
              <p className="text-muted-foreground">Loading content...</p>
            )}
          </div>
        </Card>

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevPage}
              disabled={currentPageIndex === 0}
              data-testid="button-prev-page"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="font-noto text-sm text-muted-foreground">
              Page {currentPageIndex + 1} of {totalPages}
            </div>

            <Button
              variant="outline"
              onClick={handleNextPage}
              disabled={currentPageIndex === totalPages - 1}
              data-testid="button-next-page"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
