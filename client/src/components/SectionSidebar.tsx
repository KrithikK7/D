import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Home, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Section } from "@shared/schema";

interface SectionSidebarProps {
  chapterId: string;
  currentSectionId: string;
  isOpen: boolean;
  onToggle: () => void;
}

export function SectionSidebar({ chapterId, currentSectionId, isOpen, onToggle }: SectionSidebarProps) {
  const [, setLocation] = useLocation();

  const { data: sections = [] } = useQuery<Section[]>({
    queryKey: [`/api/chapters/${chapterId}/sections`],
    enabled: !!chapterId,
  });

  const handleSectionClick = (sectionId: string) => {
    setLocation(`/read/${sectionId}`);
  };

  const handleBackHome = () => {
    setLocation("/");
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full bg-white dark:bg-card shadow-xl z-50 transition-all duration-300",
          "flex flex-col",
          isOpen ? "w-80" : "w-16"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          {isOpen && (
            <h3 className="font-myeongjo text-lg font-semibold text-kdrama-ink dark:text-foreground">
              Sections
            </h3>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="ml-auto"
            data-testid="button-toggle-sidebar"
          >
            {isOpen ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Back to Home Button */}
        <div className="p-4 border-b">
          <Button
            variant="outline"
            onClick={handleBackHome}
            className={cn(
              "w-full justify-start gap-2 font-noto",
              !isOpen && "justify-center px-2"
            )}
            data-testid="button-back-home"
          >
            <Home className="w-4 h-4" />
            {isOpen && "Back to Home"}
          </Button>
        </div>

        {/* Sections List */}
        <ScrollArea className="flex-1 p-4">
          {isOpen ? (
            <div className="space-y-2">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionClick(section.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-colors",
                    "hover:bg-kdrama-sakura/20 dark:hover:bg-accent",
                    currentSectionId === section.id
                      ? "bg-kdrama-sakura/30 dark:bg-accent text-kdrama-ink dark:text-accent-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  data-testid={`button-section-${index + 1}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-kdrama-sakura/50 dark:bg-accent flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-noto text-sm truncate">{section.title}</p>
                      {section.mood && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {section.mood}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionClick(section.id)}
                  className={cn(
                    "w-full p-2 rounded-lg transition-colors",
                    "hover:bg-kdrama-sakura/20 dark:hover:bg-accent flex items-center justify-center",
                    currentSectionId === section.id
                      ? "bg-kdrama-sakura/30 dark:bg-accent text-kdrama-ink dark:text-accent-foreground font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  title={section.title}
                  data-testid={`button-section-collapsed-${index + 1}`}
                >
                  <span className="w-6 h-6 rounded-full bg-kdrama-sakura/50 dark:bg-accent flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </>
  );
}
