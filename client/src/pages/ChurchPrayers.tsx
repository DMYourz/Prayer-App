import { ArrowLeft,Clock, Heart, User } from "lucide-react";
import { useState } from "react";
import { Link, useLocation,useParams } from "wouter";

import { useAuth } from "@/_core/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { APP_TITLE } from "@/const";
import { trpc } from "@/lib/trpc";

export default function ChurchPrayers() {
  const { id } = useParams<{ id: string }>();
  const churchId = parseInt(id);
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const { data: church } = trpc.churches.getById.useQuery({ id: churchId });
  const { data: prayers, isLoading } = trpc.prayers.list.useQuery({
    churchId,
    status: "active",
    limit,
    offset,
  });

  const { data: membershipStatus } = trpc.churchMembers.myChurches.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const isMember = membershipStatus?.some(m => m.churchId === churchId && m.status === "verified");

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
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
              <Button variant="ghost">All Prayers</Button>
            </Link>
            <Link href="/churches">
              <Button variant="ghost">Churches</Button>
            </Link>
            <Link href="/submit-prayer">
              <Button variant="default">Submit Prayer</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-8 border-b border-border">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/churches")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Churches
            </Button>
            
            {church && (
              <div className="space-y-3">
                <h1 className="text-4xl font-bold">{church.name}</h1>
                <p className="text-lg text-muted-foreground">
                  Prayer requests from our community
                </p>
                {isMember && (
                  <Badge variant="secondary">Verified Member</Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Prayer List */}
      <section className="py-8 flex-1">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-4">
            {isLoading ? (
              <>
                {[...Array(5)].map((_, i) => (
                  <Card key={i} className="border-border/50">
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardHeader>
                  </Card>
                ))}
              </>
            ) : prayers && prayers.length > 0 ? (
              <>
                {prayers.map((prayer) => (
                  <Link key={prayer.id} href={`/prayers/${prayer.id}`}>
                    <Card className="border-border/50 hover:border-primary/50 transition-colors cursor-pointer group">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <CardTitle className="group-hover:text-primary transition-colors">
                              {prayer.title}
                            </CardTitle>
                            <CardDescription className="line-clamp-2">
                              {prayer.content}
                            </CardDescription>
                          </div>
                          <Badge variant="secondary" className="shrink-0">
                            {prayer.status}
                          </Badge>
                        </div>
                        
                        {/* Categories */}
                        {prayer.categories && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {prayer.categories.split(", ").map((cat, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {cat}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
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
                          <div className="flex items-center gap-1.5 ml-auto">
                            <Clock className="h-4 w-4" />
                            <span>{formatDate(prayer.createdAt)}</span>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}

                {/* Pagination */}
                <div className="flex justify-center gap-2 pt-8">
                  <Button
                    variant="outline"
                    onClick={() => setOffset(Math.max(0, offset - limit))}
                    disabled={offset === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setOffset(offset + limit)}
                    disabled={!prayers || prayers.length < limit}
                  >
                    Next
                  </Button>
                </div>
              </>
            ) : (
              <Card className="border-border/50">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    No prayer requests yet. Be the first to share a prayer request for this church.
                  </p>
                  <Link href="/submit-prayer">
                    <Button className="mt-4">Submit a Prayer</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

