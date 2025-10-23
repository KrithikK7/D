import { createContext, useContext, useState, ReactNode } from "react";

interface MusicPlayerContextType {
  currentSongUrl: string | null;
  currentSongName: string | null;
  isExpanded: boolean;
  setCurrentSong: (url: string | null, name: string | null) => void;
  toggleExpanded: () => void;
  setExpanded: (expanded: boolean) => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const [currentSongUrl, setCurrentSongUrl] = useState<string | null>(null);
  const [currentSongName, setCurrentSongName] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const setCurrentSong = (url: string | null, name: string | null) => {
    setCurrentSongUrl(url);
    setCurrentSongName(name);
  };

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  const setExpanded = (expanded: boolean) => {
    setIsExpanded(expanded);
  };

  return (
    <MusicPlayerContext.Provider
      value={{
        currentSongUrl,
        currentSongName,
        isExpanded,
        setCurrentSong,
        toggleExpanded,
        setExpanded,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error("useMusicPlayer must be used within a MusicPlayerProvider");
  }
  return context;
}
