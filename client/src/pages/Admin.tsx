import { ArrowLeft,Check, Church as ChurchIcon, Globe, Mail, MapPin, Phone, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";

import { useAuth } from "@/_core/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { APP_TITLE } from "@/const";
import { trpc } from "@/lib/trpc";

export default function Admin() {
  const { user, isAuthenticated } = useAuth();
  const [reviewNotes, setReviewNotes] = useState<Record<number, string>>({});

  const { data: pendingChurches, isLoading } = trpc.churches.listPending.useQuery();

  const utils = trpc.useUtils();
  const reviewChurch = trpc.churches.review.useMutation({
    onSuccess: (_, variables) => {
      toast.success(`Church ${variables.status === "approved" ? "approved" : "rejected"}`);
      setReviewNotes((prev) => {
        const newNotes = { ...prev };
        delete newNotes[variables.id];
        return newNotes;
      });
      utils.churches.listPending.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to review church");
    },
  });

  const handleReview = (churchId: number, status: "approved" | "rejected") => {
    reviewChurch.mutate({
      id: churchId,
      status,
      reviewNotes: reviewNotes[churchId]?.trim() || undefined,
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!isAuthenticated || user?.role !== "admin") {
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
              <X className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-3">Access Denied</h2>
              <p className="text-muted-foreground mb-6">
                You need admin privileges to access this page
              </p>
              <Link href="/">
                <Button>Go Home</Button>
              </Link>
            </CardContent>
          </Card>
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
            <Link href="/">
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
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
              <Badge variant="default">Admin</Badge>
              <h1 className="text-4xl font-bold">Church Review Dashboard</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Review and approve churches waiting to join the prayer network
            </p>
          </div>
        </div>
      </section>

      {/* Pending Churches */}
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
            ) : pendingChurches && pendingChurches.length > 0 ? (
              <>
                {pendingChurches.map((church) => (
                  <Card key={church.id} className="border-border/50">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <ChurchIcon className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                              <CardTitle className="text-2xl">{church.name}</CardTitle>
                              <Badge variant="secondary">Pending</Badge>
                            </div>
                            {church.description && (
                              <CardDescription className="text-base">
                                {church.description}
                              </CardDescription>
                            )}
                            <div className="text-sm text-muted-foreground">
                              Submitted {formatDate(church.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Church Details */}
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Location */}
                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold">Location</h4>
                          <div className="space-y-2 text-sm">
                            {church.address && (
                              <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                <div>
                                  <div>{church.address}</div>
                                  <div className="text-muted-foreground">
                                    {[church.city, church.state, church.zipCode]
                                      .filter(Boolean)
                                      .join(", ")}
                                  </div>
                                  {church.country && (
                                    <div className="text-muted-foreground">{church.country}</div>
                                  )}
                                </div>
                              </div>
                            )}
                            {!church.address && (church.city || church.state || church.country) && (
                              <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                <span className="text-muted-foreground">
                                  {[church.city, church.state, church.country]
                                    .filter(Boolean)
                                    .join(", ")}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Contact */}
                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold">Contact Information</h4>
                          <div className="space-y-2 text-sm">
                            {church.contactEmail && (
                              <div className="flex items-center gap-2">
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
                              <div className="flex items-center gap-2">
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
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                                <a
                                  href={church.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline truncate"
                                >
                                  {church.website}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Review Notes */}
                      <div className="space-y-2 pt-4 border-t border-border">
                        <Label htmlFor={`notes-${church.id}`}>Review Notes (Optional)</Label>
                        <Textarea
                          id={`notes-${church.id}`}
                          placeholder="Add any notes about your decision..."
                          value={reviewNotes[church.id] || ""}
                          onChange={(e) =>
                            setReviewNotes((prev) => ({
                              ...prev,
                              [church.id]: e.target.value,
                            }))
                          }
                          rows={3}
                          className="resize-none"
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-2">
                        <Button
                          onClick={() => handleReview(church.id, "approved")}
                          disabled={reviewChurch.isPending}
                          className="flex-1 gap-2"
                        >
                          <Check className="h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleReview(church.id, "rejected")}
                          disabled={reviewChurch.isPending}
                          variant="destructive"
                          className="flex-1 gap-2"
                        >
                          <X className="h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              <Card className="border-border/50">
                <CardContent className="py-12 text-center">
                  <Check className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                  <p className="text-muted-foreground">
                    There are no pending church submissions to review at this time.
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
