import { Heart, Menu } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";

export default function OurStory() {
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              {APP_LOGO && <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-8" />}
              <span className="text-xl font-semibold text-foreground">{APP_TITLE}</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/prayers">
              <Button variant="ghost">Prayers</Button>
            </Link>
            <Link href="/churches">
              <Button variant="ghost">Churches</Button>
            </Link>
            <Link href="/our-story">
              <Button variant="ghost">Our Story</Button>
            </Link>
            <a href="https://www.paypal.com/donate/?business=dmyourz@gmail.com&currency_code=USD" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-white border-0 font-semibold shadow-lg">
                ❤️ Donate
              </Button>
            </a>
            <Link href="/submit-prayer">
              <Button variant="default">Submit Prayer</Button>
            </Link>
            {user?.role === "admin" && (
              <Link href="/admin">
                <Button variant="outline">Admin</Button>
              </Link>
            )}
            {!isAuthenticated && (
              <a href={getLoginUrl()}>
                <Button variant="default">Sign In</Button>
              </a>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px]">
              <div className="flex flex-col gap-4 mt-8">
                <Link href="/prayers">
                  <Button variant="ghost" className="w-full justify-start text-lg" onClick={() => setMobileMenuOpen(false)}>
                    Prayers
                  </Button>
                </Link>
                <Link href="/churches">
                  <Button variant="ghost" className="w-full justify-start text-lg" onClick={() => setMobileMenuOpen(false)}>
                    Churches
                  </Button>
                </Link>
                <Link href="/our-story">
                  <Button variant="ghost" className="w-full justify-start text-lg" onClick={() => setMobileMenuOpen(false)}>
                    Our Story
                  </Button>
                </Link>
                <a href="https://www.paypal.com/donate/?business=dmyourz@gmail.com&currency_code=USD" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full text-lg bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-white border-0 font-semibold shadow-lg" onClick={() => setMobileMenuOpen(false)}>
                    ❤️ Donate
                  </Button>
                </a>
                <Link href="/submit-prayer">
                  <Button variant="default" className="w-full text-lg" onClick={() => setMobileMenuOpen(false)}>
                    Submit Prayer
                  </Button>
                </Link>
                {user?.role === "admin" && (
                  <Link href="/admin">
                    <Button variant="outline" className="w-full text-lg" onClick={() => setMobileMenuOpen(false)}>
                      Admin
                    </Button>
                  </Link>
                )}
                {!isAuthenticated && (
                  <a href={getLoginUrl()}>
                    <Button variant="default" className="w-full text-lg">
                      Sign In
                    </Button>
                  </a>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-6 px-4">
              {APP_LOGO && (
                <div className="flex justify-center mb-6">
                  <img src={APP_LOGO} alt={APP_TITLE} className="h-24 w-24 sm:h-28 sm:w-28 drop-shadow-lg" />
                </div>
              )}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                Our <span className="text-primary">Story</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                And we'd love for you to be part of it
              </p>
            </div>
          </div>
        </section>

        {/* Story Content */}
        <section className="py-16 sm:py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto space-y-12">
              {/* Opening */}
              <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-card/50">
                <CardContent className="pt-8 pb-8">
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    PrayerCircle started with a simple question: What if no one had to pray alone?
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    We've all been there. Something weighs on your heart. You want to pray, but you also want someone to pray with you. Not just anyone. Real people who care. People who understand that prayer isn't just words. It's hope. It's faith. It's reaching out when you need someone to reach back.
                  </p>
                </CardContent>
              </Card>

              {/* The Beginning */}
              <div>
                <h2 className="text-3xl font-bold mb-6 text-primary">How It Started</h2>
                <Card className="border-border/50 bg-card/50">
                  <CardContent className="pt-6">
                    <p className="text-base text-muted-foreground leading-relaxed mb-4">
                      We saw people struggling in silence. Carrying burdens they didn't know how to share. Churches trying to stay connected to their members but missing the quiet cries for help. Pastors wanting to shepherd their flock but not always knowing where the need was greatest.
                    </p>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      So we built something simple. A place where you can share what's on your heart, knowing real people will see it and pray. Where churches can gather their community and actually know what their people are walking through. Where prayer isn't just something we do alone in the dark, but something we do together.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* What We Believe */}
              <div>
                <h2 className="text-3xl font-bold mb-6 text-primary">What We Believe</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-border/50 bg-card/50">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Heart className="h-5 w-5 text-accent" />
                        Prayer Changes Things
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Not because it's magic, but because it connects us to God and to each other. When we pray together, something shifts. Burdens lighten. Hope grows. We remember we're not alone.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-border/50 bg-card/50">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Heart className="h-5 w-5 text-accent" />
                        Community Matters
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        We weren't meant to walk through life alone. Faith grows in community. Struggles feel lighter when shared. Joy multiplies when celebrated together.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-border/50 bg-card/50">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Heart className="h-5 w-5 text-accent" />
                        Your Story Matters
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Every prayer request tells a story. Every answered prayer adds a chapter. Your story, with all its struggles and victories, matters. It's part of something bigger.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-border/50 bg-card/50">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Heart className="h-5 w-5 text-accent" />
                        Grace Is Everything
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        This isn't a place for judgment. It's a place for grace. For honesty. For showing up as you are and finding people who will pray for you anyway.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Your Chapter */}
              <Card className="border-border/50 bg-gradient-to-br from-accent/5 to-card/50">
                <CardContent className="pt-8 pb-8">
                  <h2 className="text-3xl font-bold mb-6 text-center text-primary">Your Chapter Starts Here</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6 text-center">
                    This story isn't just ours. It's yours too. Every time you share a prayer, you're adding to it. Every time you pray for someone else, you're writing a new page. Every answered prayer becomes part of the testimony.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8 text-center">
                    We're building something beautiful together. A community where no one prays alone. Where burdens are shared and hope is multiplied. Where faith isn't just believed, it's lived out loud.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/submit-prayer">
                      <Button size="lg" className="gap-2 w-full sm:w-auto">
                        <Heart className="h-5 w-5" />
                        Share Your Heart
                      </Button>
                    </Link>
                    <Link href="/prayers">
                      <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                        Pray for Others
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Closing Quote */}
              <Card className="border-border/50 bg-card/50">
                <CardContent className="pt-6 text-center">
                  <p className="text-lg sm:text-xl font-semibold mb-4">
                    "Carry each other's burdens, and in this way you will fulfill the law of Christ."
                  </p>
                  <p className="text-muted-foreground">— Galatians 6:2</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 py-8 mt-auto">
        <div className="container">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 {APP_TITLE}. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy">
                <a className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </Link>
              <Link href="/faq">
                <a className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </a>
              </Link>
              <Link href="/terms">
                <a className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </Link>
              <a href="/#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

