import { ArrowLeft,BarChart3, Lightbulb, TrendingUp } from "lucide-react";
import { Link, useLocation, useParams } from "wouter";

import { useAuth } from "@/_core/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { APP_TITLE, getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";

export default function ChurchInsights() {
  const { isAuthenticated } = useAuth();
  const params = useParams();
  const churchId = params.id ? parseInt(params.id) : undefined;
  const [, setLocation] = useLocation();

  const { data: church } = trpc.churches.getById.useQuery(
    { id: churchId! },
    { enabled: !!churchId }
  );

  const { data: insights, isLoading } = trpc.ai.getChurchInsights.useQuery(
    { churchId: churchId! },
    { enabled: !!churchId && isAuthenticated }
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="container py-4">
            <Link href="/">
              <span className="text-xl font-semibold text-foreground cursor-pointer">{APP_TITLE}</span>
            </Link>
          </div>
        </nav>
        <div className="container py-12 flex-1 flex items-center justify-center">
          <Card className="max-w-md w-full border-border/50">
            <CardContent className="py-12 text-center">
              <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-3">Sign In Required</h2>
              <p className="text-muted-foreground mb-6">
                You need to be signed in to view church insights
              </p>
              <a href={getLoginUrl()}>
                <Button>Sign In</Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!churchId) {
    setLocation("/churches");
    return null;
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
            <Link href="/churches">
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Churches
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-12 border-b border-border">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <Badge variant="secondary">AI Insights</Badge>
              <h1 className="text-4xl font-bold">{church?.name || "Church"} Insights</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              AI-powered analysis of prayer patterns from the past 30 days
            </p>
          </div>
        </div>
      </section>

      {/* Insights */}
      <section className="py-8 flex-1">
        <div className="container">
          <div className="max-w-5xl mx-auto space-y-6">
            {isLoading ? (
              <>
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="border-border/50">
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </CardHeader>
                  </Card>
                ))}
              </>
            ) : insights ? (
              <>
                {/* Summary Card */}
                <Card className="border-border/50">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      <CardTitle>Community Overview</CardTitle>
                    </div>
                    <CardDescription>
                      Based on {insights.prayerCount} prayer requests from the past 30 days
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground leading-relaxed">{insights.summary}</p>
                  </CardContent>
                </Card>

                {/* Top Themes */}
                {insights.topThemes && insights.topThemes.length > 0 && (
                  <Card className="border-border/50">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <CardTitle>Top Prayer Themes</CardTitle>
                      </div>
                      <CardDescription>
                        Most common topics in your community's prayers
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {insights.topThemes.map((theme, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-foreground">{theme.theme}</span>
                              <span className="text-sm text-muted-foreground">
                                {Math.round(theme.percentage)}%
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-primary rounded-full h-2 transition-all"
                                style={{ width: `${theme.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Trends */}
                {insights.trends && insights.trends.length > 0 && (
                  <Card className="border-border/50">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <CardTitle>Notable Trends</CardTitle>
                      </div>
                      <CardDescription>
                        Patterns observed in recent prayer requests
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {insights.trends.map((trend, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                            <span className="text-foreground">{trend}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Ministry Suggestions */}
                {insights.ministrySuggestions && insights.ministrySuggestions.length > 0 && (
                  <Card className="border-border/50">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-primary" />
                        <CardTitle>Ministry Suggestions</CardTitle>
                      </div>
                      <CardDescription>
                        Recommended focus areas based on community needs
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {insights.ministrySuggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                            <span className="text-foreground">{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card className="border-border/50">
                <CardContent className="py-12 text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Insights Available</h3>
                  <p className="text-muted-foreground">
                    There isn't enough prayer data to generate insights yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

