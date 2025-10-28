import { Church as ChurchIcon, Globe,Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { APP_TITLE } from "@/const";
import { trpc } from "@/lib/trpc";

export default function Churches() {
  const { isAuthenticated } = useAuth();
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const { data: churches, isLoading } = trpc.churches.list.useQuery({
    status: "approved",
    limit,
    offset,
  });

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
            <Link href="/submit-church">
              <Button variant="default">Register Church</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-12 border-b border-border">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-3">Church Directory</h1>
            <p className="text-lg text-muted-foreground">
              Connect with verified churches in our prayer network. Each church has been reviewed and approved to join our community.
            </p>
          </div>
        </div>
      </section>

      {/* Church List */}
      <section className="py-8 flex-1">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="border-border/50">
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : churches && churches.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  {churches.map((church) => (
                    <Card key={church.id} className="border-border/50 hover:border-primary/50 transition-colors">
                      <CardHeader>
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <ChurchIcon className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <CardTitle className="text-xl">{church.name}</CardTitle>
                            {church.description && (
                              <CardDescription className="line-clamp-2">
                                {church.description}
                              </CardDescription>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {/* Location */}
                        {(church.city || church.state || church.country) && (
                          <div className="flex items-start gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                            <span className="text-muted-foreground">
                              {[church.city, church.state, church.country]
                                .filter(Boolean)
                                .join(", ")}
                            </span>
                          </div>
                        )}

                        {/* Contact Info */}
                        <div className="space-y-2">
                          {church.contactEmail && (
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                              <a
                                href={`mailto:${church.contactEmail}`}
                                className="text-primary hover:underline truncate"
                              >
                                {church.contactEmail}
                              </a>
                            </div>
                          )}
                          {church.contactPhone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                              <a
                                href={`tel:${church.contactPhone}`}
                                className="text-primary hover:underline"
                              >
                                {church.contactPhone}
                              </a>
                            </div>
                          )}
                          {church.website && (
                            <div className="flex items-center gap-2 text-sm">
                              <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                              <a
                                href={church.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline truncate"
                              >
                                Visit Website
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-3 border-t border-border space-y-2">
                          <Link href={`/churches/${church.id}/prayers`}>
                            <Button variant="outline" size="sm" className="w-full">
                              Prayer Wall
                            </Button>
                          </Link>
                          {isAuthenticated && (
                            <>
                              <Link href={`/churches/${church.id}/groups`}>
                                <Button variant="outline" size="sm" className="w-full">
                                  Prayer Groups
                                </Button>
                              </Link>
                              <Link href={`/churches/${church.id}/insights`}>
                                <Button variant="secondary" size="sm" className="w-full">
                                  AI Insights
                                </Button>
                              </Link>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

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
                    disabled={!churches || churches.length < limit}
                  >
                    Next
                  </Button>
                </div>
              </>
            ) : (
              <Card className="border-border/50">
                <CardContent className="py-12 text-center">
                  <ChurchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No churches yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Be the first to register your church with our prayer network.
                  </p>
                  <Link href="/submit-church">
                    <Button>Register Your Church</Button>
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
