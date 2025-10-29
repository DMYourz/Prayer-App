import { Church as ChurchIcon, Clock, Heart, Search, User } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { APP_TITLE } from "@/const";
import { trpc } from "@/lib/trpc";

const isDefined = <T,>(value: T | null | undefined): value is T =>
  value !== null && value !== undefined;

type UrgencyFilter = "all" | "high" | "medium" | "low";

export default function Prayers() {
  const [offset, setOffset] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyFilter>("all");
  const limit = 20;

  const { data: prayers, isLoading } = trpc.prayers.list.useQuery({
    limit,
    offset,
    status: "active",
    category: selectedCategory !== "all" ? selectedCategory : undefined,
  });

  const { data: categories } = trpc.ai.getCategories.useQuery();

  const { data: searchResults, refetch: performSearch } = trpc.ai.searchPrayers.useQuery(
    { query: searchQuery, limit: 20 },
    { enabled: false }
  );

  const handleSearch = () => {
    if (searchQuery.trim()) {
      performSearch();
    }
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSearchQuery("");
  };

  const isShowingSearchResults = Boolean(searchQuery.trim() && searchResults);
  const displayPrayers = isShowingSearchResults ? searchResults : prayers;
  const normalizedPrayers = (displayPrayers ?? [])
    .filter(isDefined)
    .filter(prayer => {
      if (urgencyFilter === "all") return true;
      return prayer.urgency === urgencyFilter;
    });
  const totalPrayers = normalizedPrayers.length;
  const formatUrgency = (urgency?: string | null) => {
    if (!urgency) return null;
    if (urgency === "high") return "Urgent";
    if (urgency === "medium") return "Needs Prayer";
    return "On Our Hearts";
  };
  const getAuthorLabel = (prayerEntry: (typeof normalizedPrayers)[number]) => {
    if (prayerEntry.isAnonymous) {
      return prayerEntry.anonymousName || "Anonymous";
    }
    if (prayerEntry.churchId) {
      const churchName = getChurchName(prayerEntry.churchId);
      if (churchName) {
        return `${churchName} member`;
      }
    }
    return "PrayerCircle member";
  };

  const { data: churches } = trpc.churches.list.useQuery();

  const getChurchName = (churchId: number | null) => {
    if (!churchId || !churches) return null;
    const church = churches.find((c) => c.id === churchId);
    return church?.name;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const urgencyCounts = (displayPrayers ?? [])
    .filter(isDefined)
    .reduce(
      (acc, prayer) => {
        if (prayer.urgency) {
          acc[prayer.urgency] = (acc[prayer.urgency] ?? 0) + 1;
        }
        return acc;
      },
      {} as Record<"low" | "medium" | "high", number>
    );

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
            <Link href="/submit-prayer">
              <Button variant="default">Submit Prayer</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main id="main-content" className="flex-1 flex flex-col">

      {/* Header */}
      <section className="py-12 border-b border-border">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-3">Prayer Requests</h1>
            <p className="text-lg text-muted-foreground">
              Join us in lifting up these needs. Click on any prayer to offer encouragement or mark that you&apos;re praying.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <Badge variant="secondary" className="px-3 py-1 font-medium">
                {totalPrayers} active request{totalPrayers === 1 ? "" : "s"}
              </Badge>
              <span>
                Every request is reviewed before publishing to keep this space safe and compassionate.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-6 border-b border-border">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* AI Search */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search prayers using AI (e.g., 'anxiety', 'healing', 'job loss')..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch} disabled={!searchQuery.trim()}>
                Search
              </Button>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Filter by category:</span>
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {searchQuery && (
                <Button variant="ghost" size="sm" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-sm text-muted-foreground">Urgency:</span>
              {["all", "high", "medium", "low"].map((option) => {
                const label = option === "all" ? "All" : option === "high" ? "Urgent" : option === "medium" ? "Needs prayer" : "On our hearts";
                const count = option === "all" ? totalPrayers : urgencyCounts[option as Exclude<typeof normalizedPrayers[number]["urgency"], null>] ?? 0;
                return (
                  <Button
                    key={option}
                    variant={urgencyFilter === option ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setUrgencyFilter(option as UrgencyFilter);
                      setOffset(0);
                    }}
                    className="capitalize"
                  >
                    {label}
                    <Badge variant={urgencyFilter === option ? "secondary" : "outline"} className="ml-2">
                      {count ?? 0}
                    </Badge>
                  </Button>
                );
              })}
            </div>
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
            ) : normalizedPrayers.length > 0 ? (
              <>
                {normalizedPrayers.map(prayer => (
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
                            {prayer.churchId && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <ChurchIcon className="h-4 w-4" />
                                <span>{getChurchName(prayer.churchId)}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <Badge variant="secondary" className="uppercase tracking-wide">
                              {prayer.status}
                            </Badge>
                            {formatUrgency(prayer.urgency) && (
                              <Badge variant="outline" className="text-xs">
                                {formatUrgency(prayer.urgency)}
                              </Badge>
                            )}
                          </div>
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
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-3">
                          <div className="flex items-center gap-1.5">
                            <User className="h-4 w-4" />
                            <span>{getAuthorLabel(prayer)}</span>
                          </div>
                          <div className="hidden sm:inline-flex h-5 items-center rounded-full border border-border px-2 text-xs uppercase tracking-wide">
                            {prayer.visibilityScope.replace("_", " ")}
                          </div>
                          <div className="flex items-center gap-1.5 ml-auto">
                            <Clock className="h-4 w-4" />
                            <span>{formatDate(prayer.createdAt)}</span>
                          </div>
                          {prayer.urgency && (
                            <Badge
                              variant={
                                prayer.urgency === "high"
                                  ? "destructive"
                                  : prayer.urgency === "medium"
                                    ? "default"
                                    : "outline"
                              }
                              className="ml-auto capitalize"
                            >
                              {prayer.urgency === "high"
                                ? "Urgent"
                                : prayer.urgency === "medium"
                                  ? "Needs prayer"
                                  : "On our hearts"}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}

                {!isShowingSearchResults && (
                  <div className="flex justify-center gap-2 pt-4">
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
                )}
              </>
            ) : (
              <Card className="border-border/50">
                <CardContent className="py-12 text-center">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No prayers yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Be the first to share a prayer request with the community.
                  </p>
                  <Link href="/submit-prayer">
                    <Button>Submit a Prayer</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
      </main>
    </div>
  );
}
