import { ArrowLeft,Mail } from "lucide-react";
import { useEffect,useState } from "react";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";

import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { APP_TITLE } from "@/const";
import { trpc } from "@/lib/trpc";

export default function EmailSettings() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  const { data: preferences, isLoading } = trpc.emailPreferences.get.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);
  const [newPrayers, setNewPrayers] = useState(true);
  const [prayerUpdates, setPrayerUpdates] = useState(true);
  const [answeredPrayers, setAnsweredPrayers] = useState(true);

  useEffect(() => {
    if (preferences) {
      setWeeklyDigest(preferences.weeklyDigest === 1);
      setDailyDigest(preferences.dailyDigest === 1);
      setNewPrayers(preferences.newPrayers === 1);
      setPrayerUpdates(preferences.prayerUpdates === 1);
      setAnsweredPrayers(preferences.answeredPrayers === 1);
    }
  }, [preferences]);

  const updateMutation = trpc.emailPreferences.update.useMutation({
    onSuccess: () => {
      toast.success("Email preferences updated successfully");
      utils.emailPreferences.get.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSave = () => {
    updateMutation.mutate({
      weeklyDigest,
      dailyDigest,
      newPrayers,
      prayerUpdates,
      answeredPrayers,
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              Please sign in to manage your email preferences
            </p>
            <Link href="/">
              <Button>Go Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/">
            <span className="text-xl font-semibold text-foreground cursor-pointer">{APP_TITLE}</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/prayers">
              <Button variant="ghost">Prayers</Button>
            </Link>
            <Link href="/churches">
              <Button variant="ghost">Churches</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-8 border-b border-border">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <div className="flex items-center gap-3">
              <Mail className="h-10 w-10 text-primary" />
              <div>
                <h1 className="text-4xl font-bold">Email Preferences</h1>
                <p className="text-lg text-muted-foreground">
                  Manage your prayer notification settings
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Settings */}
      <section className="py-8 flex-1">
        <div className="container">
          <div className="max-w-2xl mx-auto space-y-6">
            {isLoading ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Loading preferences...</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Prayer Digests</CardTitle>
                    <CardDescription>
                      Receive regular summaries of prayer requests from your churches
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="weekly">Weekly Digest</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive a weekly summary every Sunday
                        </p>
                      </div>
                      <Switch
                        id="weekly"
                        checked={weeklyDigest}
                        onCheckedChange={setWeeklyDigest}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="daily">Daily Digest</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive a daily summary every morning
                        </p>
                      </div>
                      <Switch
                        id="daily"
                        checked={dailyDigest}
                        onCheckedChange={setDailyDigest}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Prayer Notifications</CardTitle>
                    <CardDescription>
                      Get notified about specific prayer activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="new">New Prayer Requests</Label>
                        <p className="text-sm text-muted-foreground">
                          When someone submits a new prayer in your church
                        </p>
                      </div>
                      <Switch
                        id="new"
                        checked={newPrayers}
                        onCheckedChange={setNewPrayers}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="updates">Prayer Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          When someone responds to a prayer you're following
                        </p>
                      </div>
                      <Switch
                        id="updates"
                        checked={prayerUpdates}
                        onCheckedChange={setPrayerUpdates}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="answered">Answered Prayers</Label>
                        <p className="text-sm text-muted-foreground">
                          When a prayer is marked as answered
                        </p>
                      </div>
                      <Switch
                        id="answered"
                        checked={answeredPrayers}
                        onCheckedChange={setAnsweredPrayers}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button
                    onClick={handleSave}
                    disabled={updateMutation.isPending}
                  >
                    Save Preferences
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

