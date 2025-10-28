import {
  ArrowRight,
  Church,
  Compass,
  Heart,
  Menu,
  MessageCircleHeart,
  Quote,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";

import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";

const contactInitialState = {
  name: "",
  email: "",
  message: "",
};

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState(contactInitialState);
  const [contactError, setContactError] = useState<string | null>(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const isAuthConfigured =
    Boolean(import.meta.env.VITE_OAUTH_PORTAL_URL?.trim()) &&
    Boolean(import.meta.env.VITE_APP_ID?.trim());

  const canSubmitContact = useMemo(() => {
    return Boolean(contactForm.email.trim()) && Boolean(contactForm.message.trim());
  }, [contactForm.email, contactForm.message]);

  const handleContactChange = (field: keyof typeof contactForm, value: string) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
    if (contactError) {
      setContactError(null);
    }
    if (contactSubmitted) {
      setContactSubmitted(false);
    }
  };

  const handleContactSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmitContact) {
      setContactError("Please share your email and a short message so we know how to help.");
      return;
    }

    const subject = encodeURIComponent(
      `PrayerCircle message from ${contactForm.name.trim() || "Website Visitor"}`
    );
    const bodyLines = [
      contactForm.message.trim(),
      "",
      "––",
      `From: ${contactForm.name.trim() || "Anonymous visitor"}`,
      `Email: ${contactForm.email.trim()}`,
    ];
    const body = encodeURIComponent(bodyLines.join("\n"));

    window.location.href = `mailto:wpmcircle@gmail.com?subject=${subject}&body=${body}`;
    setContactSubmitted(true);
    setContactForm(contactInitialState);
  };

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
              isAuthConfigured ? (
                <a href={getLoginUrl()}>
                  <Button variant="default">Sign In</Button>
                </a>
              ) : (
                <Button variant="default" disabled title="Sign-in is disabled in this preview build. Configure OAuth env vars to enable it.">
                  Sign In (Preview)
                </Button>
              )
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
                  isAuthConfigured ? (
                    <a href={getLoginUrl()}>
                      <Button variant="default" className="w-full text-lg">
                        Sign In
                      </Button>
                    </a>
                  ) : (
                    <Button
                      variant="default"
                      className="w-full text-lg"
                      disabled
                      title="Sign-in is disabled in this preview build. Configure OAuth env vars to enable it."
                    >
                      Sign In (Preview)
                    </Button>
                  )
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      <main id="main-content" className="flex-1">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" aria-hidden="true" />
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 px-4">
            {APP_LOGO && (
              <div className="flex justify-center">
                <img
                  src={APP_LOGO}
                  alt={APP_TITLE}
                  className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 drop-shadow-lg"
                />
              </div>
            )}
            <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              PrayerCircle is in private preview — help shape the launch
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              Every prayer deserves a circle of <span className="text-primary">support</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Share what&apos;s on your heart, rally your church, and see communities lift one another up in real time.
              PrayerCircle blends thoughtful technology with trusted pastoral oversight so no one prays alone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link href="/submit-prayer">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  <Heart className="h-5 w-5" aria-hidden="true" />
                  Submit a Prayer
                </Button>
              </Link>
              <Link href="/prayers">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto gap-2">
                  Explore Active Prayers
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-3">
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <MessageCircleHeart className="h-6 w-6 text-primary" aria-hidden="true" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">Verified intercessors</p>
                  <p className="text-xs text-muted-foreground">Receive encouragement within hours</p>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <ShieldCheck className="h-6 w-6 text-primary" aria-hidden="true" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">Human moderation</p>
                  <p className="text-xs text-muted-foreground">Every request reviewed for safety</p>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <Compass className="h-6 w-6 text-primary" aria-hidden="true" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">Local impact</p>
                  <p className="text-xs text-muted-foreground">Surface needs around your church</p>
                </div>
              </div>
            </div>
            {!isAuthConfigured && (
              <div className="rounded-md border border-dashed border-primary/50 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
                Sign-in is disabled in this preview build. Set `VITE_OAUTH_PORTAL_URL` and `VITE_APP_ID` (plus backend secrets) to enable OAuth.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {/* Testimonials */}
      <section className="py-16 sm:py-20 bg-card/20 border-y border-border/40">
        <div className="container">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">Stories of Hope</p>
              <h2 className="text-3xl sm:text-4xl font-bold">Why churches and leaders lean on PrayerCircle</h2>
              <p className="text-base sm:text-lg text-muted-foreground">
                From pastors juggling many needs to volunteers leading prayer teams, leaders are using PrayerCircle to stay close to their people.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-border/50 bg-background/80 shadow-sm">
                <CardContent className="pt-8 space-y-6">
                  <Quote className="h-8 w-8 text-primary" aria-hidden="true" />
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    “Sunday mornings don&apos;t tell the whole story. PrayerCircle surfaces what our families are really carrying.
                    In minutes I can see the themes in our congregation and follow up with personal care.”
                  </p>
                  <div>
                    <p className="font-semibold text-foreground">Pastor Grace Walker</p>
                    <p className="text-sm text-muted-foreground">Radiant Hope Church – Orlando, FL</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-background/80 shadow-sm">
                <CardContent className="pt-8 space-y-6">
                  <Quote className="h-8 w-8 text-primary" aria-hidden="true" />
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    “We run a volunteer-led care team. PrayerCircle gathers requests, routes sensitive ones to elders, and lets
                    us celebrate answered prayers together. It has become our weekly rhythm.”
                  </p>
                  <div>
                    <p className="font-semibold text-foreground">Marcus Allen</p>
                    <p className="text-sm text-muted-foreground">Care Team Lead – Mercy Bridge Fellowship</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 sm:py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Heart</h2>
              <p className="text-xl text-primary font-semibold mb-6">
                A Place Where No One Prays Alone
              </p>
            </div>

            <div className="space-y-8">
              <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-card/50">
                <CardContent className="pt-6">
                  <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                    We've all been there. Late at night, carrying something heavy, wishing someone would pray with us. We built PrayerCircle because we believe no one should face their struggles alone. This is a place where you can share what's on your heart and find real people ready to lift you up in prayer. No judgment. Just genuine care.
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-border/50 bg-card/50">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                      <Heart className="h-6 w-6 text-accent" />
                    </div>
                    <CardTitle className="text-xl">You're Not Alone</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Life can feel overwhelming sometimes. When it does, you don't have to face it alone. Share your heart here and watch as people from around the world gather to pray for you. Your burden becomes lighter when it's shared.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/50">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Church className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Helping Pastors Shepherd</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Pastors, we see you carrying the weight of your congregation. This platform helps you stay connected to what your people are really going through, so you can shepherd them better. Simple tools to support your church family.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/50">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-accent" />
                    </div>
                    <CardTitle className="text-xl">Real People, Real Faith</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      This isn't about algorithms or metrics. When you share a prayer request, real people read it, feel it, and pray for you. When you pray for someone else, you're speaking hope into their life. That's the beauty of true community.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/50">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <ShieldCheck className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Your Story is Safe Here</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Some prayers are whispered in secret. Some burdens are too tender to share with your name attached. We honor that. Share anonymously if you need to. Your story is safe here, however you choose to tell it.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-border/50 bg-gradient-to-br from-accent/5 to-card/50">
                <CardContent className="pt-6 text-center">
                  <p className="text-lg sm:text-xl font-semibold mb-4">
                    "For where two or three gather in my name, there am I with them."
                  </p>
                  <p className="text-muted-foreground">— Matthew 18:20</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-card/30">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <Card className="border-border/50 bg-card/50">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <MessageCircleHeart className="h-6 w-6 text-accent" aria-hidden="true" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Share what matters</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Post a prayer with your name or anonymously, attach it to your church, and choose who can view it.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <CardTitle className="text-lg sm:text-xl">We keep it safe</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Every post runs through AI-assisted moderation plus human review before it reaches the community.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <Church className="h-6 w-6 text-accent" aria-hidden="true" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Equip your leaders</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Pastors and care teams receive dashboards, categories, and insights to respond quickly.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Celebrate answers</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Mark updates and answers, send encouragement, and keep testimonies in one hopeful place.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20">
        <div className="container">
          <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-background">
            <CardContent className="py-12 sm:py-16 text-center space-y-6 px-4">
              <h2 className="text-3xl sm:text-4xl font-bold">Join Our Prayer Network</h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                Whether you're seeking prayer or want to pray for others, you're welcome here. 
                Churches can also apply to join our verified network.
              </p>
              <Link href="/submit-church">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-secondary hover:bg-secondary/90">
                  Register Your Church
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-16 sm:py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Get in Touch</h2>
              <p className="text-base sm:text-lg text-muted-foreground">
                Have questions or need support? We're here to help you connect with our prayer community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <CardTitle className="text-xl">Contact Information</CardTitle>
                  <CardDescription>
                    Reach out to us through any of these channels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-sm text-muted-foreground">wpmcircle@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold">Support Hours</p>
                      <p className="text-sm text-muted-foreground">Monday - Friday: 9am - 6pm EST</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Message Form */}
              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <CardTitle className="text-xl">Send us a Message</CardTitle>
                  <CardDescription>
                    We'll get back to you within 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={handleContactSubmit} noValidate>
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={contactForm.name}
                        onChange={event => handleContactChange("name", event.target.value)}
                        className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={contactForm.email}
                        onChange={event => handleContactChange("email", event.target.value)}
                        className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="you@email.com"
                        required
                        aria-describedby="contact-email-help"
                      />
                      <p id="contact-email-help" className="text-xs text-muted-foreground">
                        We&apos;ll reply directly from wpmcircle@gmail.com.
                      </p>
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Message <span className="text-destructive">*</span>
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        value={contactForm.message}
                        onChange={event => handleContactChange("message", event.target.value)}
                        className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="How can we help you?"
                        required
                      />
                    </div>
                    {contactError && (
                      <p className="text-sm text-destructive">{contactError}</p>
                    )}
                    {contactSubmitted && !contactError && (
                      <p className="text-sm text-primary">
                        Thanks! Your email app should have launched with a draft message—just hit send.
                      </p>
                    )}
                    <Button type="submit" className="w-full" disabled={!canSubmitContact}>
                      {canSubmitContact ? "Send Message" : "Share your email + message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Support Our Mission Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <Card className="border-border/50 bg-card/50 shadow-lg">
              <CardContent className="pt-8 pb-8">
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-r from-accent to-primary flex items-center justify-center">
                      <Heart className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold">Support Our Mission</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    PrayerCircle runs on generosity. When you give, you're helping people find hope and churches stay connected to their communities.
                  </p>
                  <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                    <CardContent className="pt-6 pb-6">
                      <p className="text-base text-muted-foreground mb-4">
                        <span className="font-semibold text-primary text-lg">Here's something special:</span> Half of every donation goes directly to ministries doing kingdom work. Your gift doesn't just keep this platform running. It multiplies into the hands of people serving others.
                      </p>
                      <p className="text-sm text-muted-foreground italic">
                        We believe in supporting the whole body of Christ, not just our corner of it.
                      </p>
                    </CardContent>
                  </Card>
                  <a href="https://www.paypal.com/donate/?business=dmyourz@gmail.com&currency_code=USD" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-white shadow-lg">
                      <Heart className="h-5 w-5 mr-2" />
                      Give Today
                    </Button>
                  </a>
                  <p className="text-xs text-muted-foreground">
                    All donations are processed securely through PayPal
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-border bg-card/30">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>&copy; 2025 {APP_TITLE}. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/faq" className="hover:text-primary transition-colors">
                FAQ
              </Link>
              <a href="mailto:wpmcircle@gmail.com" className="hover:text-primary transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
