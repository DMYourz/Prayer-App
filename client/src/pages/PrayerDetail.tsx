import { ArrowLeft, Church as ChurchIcon, Clock, Heart, Send,User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Link, useParams } from "wouter";

import { useAuth } from "@/_core/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { APP_TITLE, getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";

export default function PrayerDetail() {
  const { id } = useParams();
  const prayerId = parseInt(id || "0");
  const { isAuthenticated } = useAuth();
  const [responseContent, setResponseContent] = useState("");

  const { data: prayer, isLoading } = trpc.prayers.getById.useQuery({ id: prayerId });
  const { data: responses } = trpc.prayerResponses.list.useQuery({ prayerId });
  const { data: church } = trpc.churches.getById.useQuery(
    { id: prayer?.churchId || 0 },
    { enabled: !!prayer?.churchId }
  );

  const utils = trpc.useUtils();
  const createResponse = trpc.prayerResponses.create.useMutation({
    onSuccess: () => {
      toast.success("Your response has been shared");
      setResponseContent("");
      utils.prayerResponses.list.invalidate({ prayerId });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit response");
    },
  });

  const handleSubmitResponse = () => {
    if (!responseContent.trim()) {
      toast.error("Please enter a response");
      return;
    }
    createResponse.mutate({
      prayerId,
      content: responseContent,
      isAnswer: false,
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="container py-4">
            <Skeleton className="h-6 w-32" />
          </div>
        </nav>
        <div className="container py-8">
          <Skeleton className="h-96 w-full max-w-4xl mx-auto" />
        </div>
      </div>
    );
  }

  if (!prayer) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="container py-4">
            <Link href="/">
              <span className="text-xl font-semibold text-foreground cursor-pointer">{APP_TITLE}</span>
            </Link>
          </div>
        </nav>
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Prayer not found</h1>
          <Link href="/prayers">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Prayers
            </Button>
          </Link>
        </div>
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
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Prayers
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Prayer Detail */}
      <section className="py-8 flex-1">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Main Prayer Card */}
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <CardTitle className="text-3xl">{prayer.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {prayer.isAnonymous ? (
                        <div className="flex items-center gap-1.5">
                          <User className="h-4 w-4" />
                          <span>{prayer.anonymousName || "Anonymous"}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <Heart className="h-4 w-4" />
                          <span>Community Member</span>
                        </div>
                      )}
                      {church && (
                        <div className="flex items-center gap-1.5">
                          <ChurchIcon className="h-4 w-4" />
                          <span>{church.name}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        <span>{formatDate(prayer.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={prayer.status === "answered" ? "default" : "secondary"}>
                    {prayer.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed whitespace-pre-wrap">{prayer.content}</p>
              </CardContent>
            </Card>

            {/* Responses Section */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Prayer Support & Updates</CardTitle>
                <CardDescription>
                  {responses && responses.length > 0
                    ? `${responses.length} ${responses.length === 1 ? "response" : "responses"}`
                    : "Be the first to offer support"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Response List */}
                {responses && responses.length > 0 && (
                  <div className="space-y-4">
                    {responses.map((response) => (
                      <div
                        key={response.id}
                        className="border-l-2 border-primary/30 pl-4 py-2 space-y-2"
                      >
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-3.5 w-3.5" />
                          <span>Community Member</span>
                          <span>•</span>
                          <span>{formatDate(response.createdAt)}</span>
                          {response.isAnswer === 1 && (
                            <Badge variant="default" className="ml-2">
                              Answer
                            </Badge>
                          )}
                        </div>
                        <p className="text-foreground whitespace-pre-wrap">{response.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Response Form */}
                {isAuthenticated ? (
                  <div className="space-y-3 pt-4 border-t border-border">
                    <label className="text-sm font-medium">Share your support or update</label>
                    <Textarea
                      placeholder="Let them know you're praying for them..."
                      value={responseContent}
                      onChange={(e) => setResponseContent(e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                    <Button
                      onClick={handleSubmitResponse}
                      disabled={createResponse.isPending || !responseContent.trim()}
                      className="gap-2"
                    >
                      <Send className="h-4 w-4" />
                      {createResponse.isPending ? "Sending..." : "Send Support"}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6 border-t border-border">
                    <p className="text-muted-foreground mb-4">Sign in to offer your support</p>
                    <a href={getLoginUrl()}>
                      <Button variant="outline">Sign In</Button>
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
