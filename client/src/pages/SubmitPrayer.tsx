import { ArrowLeft, Heart, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { APP_TITLE } from "@/const";
import { trpc } from "@/lib/trpc";

type VisibilityScope = "community" | "church_only" | "nearby_churches";

export default function SubmitPrayer() {
  const [, setLocation] = useLocation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [anonymousName, setAnonymousName] = useState("");
  const [churchId, setChurchId] = useState<string>("");
  const [visibilityScope, setVisibilityScope] = useState<VisibilityScope>("community");

  const { data: churches } = trpc.churches.list.useQuery();

  const handleVisibilityScopeChange = (value: string) => {
    setVisibilityScope(value as VisibilityScope);
  };

  const createPrayer = trpc.prayers.create.useMutation({
    onSuccess: () => {
      toast.success("Your prayer has been submitted");
      setLocation("/prayers");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit prayer");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    createPrayer.mutate({
      title: title.trim(),
      content: content.trim(),
      isAnonymous,
      anonymousName: isAnonymous ? anonymousName.trim() || undefined : undefined,
      churchId: churchId && churchId !== "none" ? parseInt(churchId) : undefined,
      visibilityScope,
    });
  };

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
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Prayers
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main id="main-content" className="flex-1">
      {/* Form Section */}
      <section className="py-12">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="mb-10 text-center space-y-4">
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
              <h1 className="text-4xl font-bold mb-3">Submit a Prayer Request</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Share what&apos;s on your heart. Every request is reviewed by a real person before it is published so our community remains safe and compassionate.
              </p>
              <div className="mx-auto flex max-w-xl flex-col items-center gap-3 text-sm text-muted-foreground">
                <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/40 px-3 py-1">
                  <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                  We never post email addresses, phone numbers, or private contact details.
                </div>
                <p>
                  Prefer to stay unnamed? Submit anonymously and choose a display name like "A Grateful Mom" or leave it blank.
                </p>
              </div>
            </div>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Prayer Details</CardTitle>
                <CardDescription>
                  All fields marked with * are required
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Prayer Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title"
                      placeholder="A brief title for your prayer request"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={255}
                      aria-describedby="title-help"
                      required
                    />
                    <p id="title-help" className="text-xs text-muted-foreground">
                      Examples: "Healing for my child" or "Job interview this Friday"
                    </p>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <Label htmlFor="content">
                      Prayer Request <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="content"
                      placeholder="Share your prayer request in detail..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={8}
                      className="resize-none"
                      aria-describedby="content-help"
                      required
                    />
                    <p id="content-help" className="text-xs text-muted-foreground">
                      Share as much or as little as you're comfortable with. Avoid last names or contact details—our team can follow up privately if needed.
                    </p>
                  </div>

                  {/* Church Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="church">Church (Optional)</Label>
                    <Select value={churchId} onValueChange={setChurchId}>
                      <SelectTrigger id="church">
                        <SelectValue placeholder="Select a church (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {churches?.map((church) => (
                          <SelectItem key={church.id} value={church.id.toString()}>
                            {church.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Associate this prayer with a specific church community
                    </p>
                  </div>

                  {/* Visibility Scope */}
                  <div className="space-y-2">
                    <Label htmlFor="visibility">Who Can See This Prayer?</Label>
                    <Select value={visibilityScope} onValueChange={handleVisibilityScopeChange}>
                      <SelectTrigger id="visibility">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="community">
                          <div className="flex flex-col items-start">
                            <span className="font-medium">Entire PrayerCircle Community</span>
                            <span className="text-xs text-muted-foreground">Everyone on the platform can see and pray</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="church_only">
                          <div className="flex flex-col items-start">
                            <span className="font-medium">My Church Only</span>
                            <span className="text-xs text-muted-foreground">Only verified members of your church</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="nearby_churches">
                          <div className="flex flex-col items-start">
                            <span className="font-medium">My Church + Nearby Churches</span>
                            <span className="text-xs text-muted-foreground">Churches in your area can see and support</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Control who can see and pray for your request
                    </p>
                  </div>

                  {/* Anonymous Option */}
                  <div className="space-y-4 pt-4 border-t border-border">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="anonymous"
                        checked={isAnonymous}
                        onCheckedChange={(checked) => setIsAnonymous(checked === true)}
                      />
                      <Label
                        htmlFor="anonymous"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        Submit anonymously
                      </Label>
                    </div>

                    {isAnonymous && (
                      <div className="space-y-2 pl-6">
                        <Label htmlFor="anonymousName">Display Name (Optional)</Label>
                        <Input
                          id="anonymousName"
                          placeholder="e.g., 'A Friend' or leave blank for 'Anonymous'"
                          value={anonymousName}
                          onChange={(e) => setAnonymousName(e.target.value)}
                          maxLength={100}
                        />
                        <p className="text-xs text-muted-foreground">
                          Choose how you'd like to be identified
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={createPrayer.isPending}
                      className="flex-1"
                    >
                      {createPrayer.isPending ? "Submitting..." : "Submit Prayer"}
                    </Button>
                    <Link href="/prayers">
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="mt-10 space-y-6 text-left">
              <Card className="border-border/50 bg-card/40">
                <CardHeader className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
                    <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                    What happens next
                  </div>
                  <CardTitle className="text-xl">After you press submit</CardTitle>
                  <CardDescription>
                    We steward every request with care. Here&apos;s the quick overview of our moderation flow.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      1
                    </span>
                    <p>
                      <strong className="text-foreground">Initial review:</strong> our team scans for safety concerns, removes personal contact details, and adds helpful categories.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      2
                    </span>
                    <p>
                      <strong className="text-foreground">Matching:</strong> your request appears on the public wall (or your selected audience) and is shared with leaders at the associated church.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      3
                    </span>
                    <p>
                      <strong className="text-foreground">Follow-up:</strong> you&apos;ll receive an optional email confirmation if you&apos;re signed in. You can update the request or mark it as answered anytime.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-accent/10">
                <CardContent className="flex flex-col gap-4 py-6">
                  <div className="flex items-center gap-3 text-primary">
                    <Sparkles className="h-5 w-5" aria-hidden="true" />
                    <span className="text-sm font-semibold uppercase tracking-wide">Need a pastor to reach out?</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Add a note in your request (for example, "Can a pastor contact me?") and we&apos;ll flag it for the church review queue. A verified leader will follow up privately.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      </main>
    </div>
  );
}
