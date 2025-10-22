import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface PolaroidCardProps {
  title: string;
  coverUrl?: string;
  mood?: string;
  tags?: string[];
  description?: string;
  onClick?: () => void;
}

export function PolaroidCard({
  title,
  coverUrl,
  mood,
  tags = [],
  description,
  onClick,
}: PolaroidCardProps) {
  return (
    <Card
      className="bg-white dark:bg-card shadow-lg hover:shadow-xl transition-all duration-180 hover:-translate-y-1 hover:animate-sway cursor-pointer border-0 overflow-hidden rounded-2xl"
      onClick={onClick}
      data-testid={`card-polaroid-${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className="relative">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-kdrama-sakura/30 via-kdrama-lavender/30 to-kdrama-sky/30" />
        )}
        <div className="absolute top-2 left-2">
          <div className="w-3 h-3 rounded-full bg-kdrama-thread shadow-md" />
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <h3 className="font-myeongjo text-lg font-bold text-kdrama-ink dark:text-foreground line-clamp-2">
          {title}
        </h3>
      </CardHeader>
      
      <CardContent className="space-y-2">
        {mood && (
          <Badge variant="secondary" className="font-noto text-xs">
            {mood}
          </Badge>
        )}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="font-noto text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        {description && (
          <p className="font-noto text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
