import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { AdminToolbar } from "@/components/AdminToolbar";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { ReadingContent } from "@/components/ReadingContent";
import { EmbedPlaceholder } from "@/components/EmbedPlaceholder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";

export default function Admin() {
  const [, setLocation] = useLocation();
  const { user, isAdmin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [activeTab, setActiveTab] = useState("content");

  useEffect(() => {
    if (!isAdmin) {
      setLocation("/");
    }
  }, [isAdmin, setLocation]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-kdrama-cream/20 to-kdrama-sky/10">
        <Card className="max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2 text-kdrama-thread">
              <AlertCircle className="w-5 h-5" />
              <CardTitle className="font-myeongjo">Access Denied</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="font-noto text-muted-foreground">
              You need admin privileges to access this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const mockPageViews = [
    {
      id: "1",
      startedAt: new Date("2024-03-15T14:30:00"),
      endedAt: new Date("2024-03-15T14:35:00"),
      activeMs: 240000,
      maxScrollPct: 100,
      completionMilestone: 100 as const,
      isReread: false,
    },
    {
      id: "2",
      startedAt: new Date("2024-03-16T10:15:00"),
      endedAt: new Date("2024-03-16T10:20:00"),
      activeMs: 180000,
      maxScrollPct: 75,
      completionMilestone: 75 as const,
      isReread: false,
    },
    {
      id: "3",
      startedAt: new Date("2024-03-17T16:45:00"),
      endedAt: new Date("2024-03-17T16:52:00"),
      activeMs: 300000,
      maxScrollPct: 100,
      completionMilestone: 100 as const,
      isReread: true,
    },
  ];

  const mockContent = `Seoul in the spring is a different world. The cherry blossoms paint the city in soft pinks and whites, and everywhere you look, there's a promise of new beginnings.

I didn't expect to meet you that day. The forecast said rain, but I went out anyway, drawn by the last days of the cherry blossom season. You were standing under the biggest tree in Yeouido Park, camera in hand, trying to capture the perfect shot.

When our eyes met, it felt like the world stopped for just a moment. The petals were falling around us like snow, and I remember thinking that this must be what they mean by "destiny."`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-kdrama-cream/20 to-kdrama-sky/10">
      <AdminToolbar
        isEditing={isEditing}
        isPublished={isPublished}
        onToggleEdit={() => setIsEditing(!isEditing)}
        onSave={() => console.log("Save changes")}
        onTogglePublish={() => setIsPublished(!isPublished)}
        onSetEditedDate={() => console.log("Set edited date")}
        onDelete={() => console.log("Delete page")}
        onViewAnalytics={() => setActiveTab("analytics")}
      />

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="content" className="font-noto" data-testid="tab-content">
              Content
            </TabsTrigger>
            <TabsTrigger value="media" className="font-noto" data-testid="tab-media">
              Media
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="analytics" className="font-noto" data-testid="tab-analytics">
                Analytics
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            {isEditing ? (
              <Card className="max-w-4xl mx-auto">
                <CardHeader>
                  <CardTitle className="font-myeongjo">Edit Page</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="font-noto text-sm font-medium mb-2 block">Title</label>
                    <Input
                      defaultValue="Under the Cherry Blossoms"
                      className="font-myeongjo text-lg"
                      data-testid="input-title"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-noto text-sm font-medium mb-2 block">Mood</label>
                      <Input
                        defaultValue="Romantic"
                        data-testid="input-mood"
                      />
                    </div>
                    <div>
                      <label className="font-noto text-sm font-medium mb-2 block">Tags</label>
                      <Input
                        defaultValue="spring, destiny, first-meeting"
                        placeholder="Comma-separated tags"
                        data-testid="input-tags"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-noto text-sm font-medium mb-2 block">Content</label>
                    <Textarea
                      defaultValue={mockContent}
                      className="font-noto min-h-96"
                      data-testid="textarea-content"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Badge variant="secondary" className="font-noto">
                      TipTap Editor Coming Soon
                    </Badge>
                    <Badge variant="outline" className="font-noto">
                      Slash Commands: /reel /spotify /thread /knot
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="max-w-4xl mx-auto">
                <ReadingContent
                  title="Under the Cherry Blossoms"
                  content={mockContent}
                  mood="Romantic"
                  tags={["spring", "destiny", "first-meeting"]}
                  editedAt={new Date("2024-03-15T14:30:00")}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="media" className="space-y-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-myeongjo text-3xl text-kdrama-ink dark:text-foreground mb-6">
                Media Embeds
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EmbedPlaceholder
                  type="instagram"
                  url="https://www.instagram.com/reel/example"
                  title="Behind the Scenes - Cherry Blossom Festival"
                />
                <EmbedPlaceholder
                  type="spotify"
                  url="https://open.spotify.com/track/example"
                  title="Our Song - K-Drama OST"
                />
              </div>
              <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                <p className="font-noto text-sm text-muted-foreground">
                  <strong>Paste Detection:</strong> When editing, pasting an Instagram or Spotify URL will automatically convert it to an embed.
                </p>
              </div>
            </div>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="analytics" className="space-y-6">
              <div className="max-w-6xl mx-auto">
                <AnalyticsDashboard
                  pageViews={mockPageViews}
                  totalVisitors={156}
                  avgActiveTime={220000}
                  avgCompletion={82}
                />

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="font-myeongjo">Tracking Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 font-noto text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-kdrama-thread">•</span>
                        <span>Active time counter pauses when tab is hidden, window loses focus, or user is idle for 20+ seconds</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-kdrama-thread">•</span>
                        <span>Heartbeat system sends updates every 10 seconds with active time deltas and scroll progress</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-kdrama-thread">•</span>
                        <span>Milestone detection at 25%, 50%, 75%, and 100% using IntersectionObserver</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-kdrama-thread">•</span>
                        <span>Re-read tracking links subsequent visits to the first page view</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-kdrama-thread">•</span>
                        <span>Media event capture for Instagram Reel and Spotify embed interactions</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
