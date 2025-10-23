import { Music, X } from "lucide-react";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function FloatingMusicPlayer() {
  const { currentSongUrl, currentSongName, isExpanded, toggleExpanded, setExpanded } = useMusicPlayer();
  const [isHovered, setIsHovered] = useState(false);

  // Extract Spotify track ID from URL
  const getSpotifyEmbedUrl = (url: string | null) => {
    if (!url) return null;
    
    // Handle different Spotify URL formats
    const trackMatch = url.match(/track\/([a-zA-Z0-9]+)/);
    if (trackMatch) {
      return `https://open.spotify.com/embed/track/${trackMatch[1]}?utm_source=generator`;
    }
    return null;
  };

  const embedUrl = getSpotifyEmbedUrl(currentSongUrl);

  // Don't render if no song is set
  if (!currentSongUrl || !embedUrl) {
    return null;
  }

  return (
    <div
      className="fixed top-4 right-4 z-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (!isExpanded) {
          // Optionally auto-collapse after leaving hover
        }
      }}
      data-testid="floating-music-player"
    >
      {!isExpanded ? (
        // Collapsed state - just the icon
        <Button
          size="icon"
          variant="default"
          className="h-12 w-12 rounded-full shadow-lg bg-kdrama-heart hover:bg-kdrama-heart/90 border-2 border-kdrama-thread"
          onClick={() => setExpanded(true)}
          data-testid="button-expand-player"
        >
          <Music className="h-6 w-6 text-white" />
        </Button>
      ) : (
        // Expanded state - show player
        <Card className="overflow-hidden shadow-2xl bg-card border-kdrama-thread/20 w-[300px]">
          <div className="p-3 flex items-center justify-between bg-kdrama-accent/10 border-b border-kdrama-thread/20">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Music className="h-4 w-4 text-kdrama-thread flex-shrink-0" />
              <p className="text-sm font-noto font-medium text-foreground truncate" data-testid="text-song-name">
                {currentSongName || "Now Playing"}
              </p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 flex-shrink-0"
              onClick={() => setExpanded(false)}
              data-testid="button-collapse-player"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="bg-background">
            <iframe
              src={embedUrl}
              width="100%"
              height="152"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="w-full"
              data-testid="spotify-iframe"
            />
          </div>
        </Card>
      )}
    </div>
  );
}
