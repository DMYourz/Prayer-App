import { ArrowLeft, HelpCircle } from "lucide-react";
import { Link } from "wouter";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_TITLE } from "@/const";

export default function FAQ() {
  const faqSections = [
    {
      title: "Getting Started",
      questions: [
        {
          q: "What is PrayerCircle?",
          a: "PrayerCircle is a platform that connects people who need prayer with people who want to pray. Think of it as a safe space where you can share what's on your heart and know that real people will lift you up in prayer."
        },
        {
          q: "Do I need an account to use PrayerCircle?",
          a: "You can browse prayers and see churches without an account, but you'll need to sign up to submit prayers, respond to requests, or join a church community. You can also submit prayers anonymously even without signing in."
        },
        {
          q: "Is PrayerCircle really free?",
          a: "Yes, completely free. We built this to serve the faith community, not to make money from it. There are no hidden fees, premium tiers, or paid features."
        }
      ]
    },
    {
      title: "Privacy & Safety",
      questions: [
        {
          q: "Is my information safe?",
          a: "Absolutely. We use industry-standard security measures to protect your information. All data is encrypted, and we never sell your information to anyone."
        },
        {
          q: "What does 'anonymous' really mean?",
          a: "When you post a prayer anonymously, your name is completely hidden from other users. You can add a display name like 'A Friend' or stay completely anonymous. We keep internal records for safety purposes only."
        },
        {
          q: "Who can see my prayers?",
          a: "You decide! Choose from: Entire Community (everyone), My Church Only (verified members), or My Church + Nearby Churches (local area). You can change this anytime."
        }
      ]
    },
    {
      title: "Using PrayerCircle",
      questions: [
        {
          q: "How do I submit a prayer request?",
          a: "Click 'Submit a Prayer' in the navigation. Fill in your prayer title and details, choose your visibility preference, and decide whether to post with your name or anonymously."
        },
        {
          q: "Can I update my prayer later?",
          a: "Yes, you can edit your prayer requests or mark them as 'answered' when God responds. You can also add updates to let people know how things are going."
        },
        {
          q: "How does the search work?",
          a: "Our smart search understands natural language. Type things like 'struggling with anxiety' and find prayers about worry, fear, stress, and related topics."
        }
      ]
    },
    {
      title: "Churches",
      questions: [
        {
          q: "How can my church join PrayerCircle?",
          a: "Click 'Register Your Church' and fill out the application. Our team reviews each application to verify legitimacy (usually within 24-48 hours)."
        },
        {
          q: "Why do churches need to be approved?",
          a: "We verify churches to protect the community and ensure PrayerCircle remains a trusted space. This helps prevent spam and fake organizations."
        },
        {
          q: "What can church administrators do?",
          a: "Church admins can view prayers associated with their church, see AI-generated insights about community prayer patterns, manage church members, and create prayer groups for ministries."
        }
      ]
    },
    {
      title: "AI Features",
      questions: [
        {
          q: "How is AI used on PrayerCircle?",
          a: "We use AI for: Content Safety (identifying spam), Categories (organizing prayers), Smart Search (natural language), and Church Insights (general summaries for leaders)."
        },
        {
          q: "Does AI read my prayers?",
          a: "AI processes prayers to categorize them and ensure safety, but it's not 'reading' in the human sense. Think of it like a helpful assistant that sorts mail."
        },
        {
          q: "Do you use my prayers to train AI?",
          a: "No. We don't use your prayers to train commercial AI products or share them with AI companies. The AI is here to serve you."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/">
            <span className="text-xl font-semibold text-foreground cursor-pointer">{APP_TITLE}</span>
          </Link>
          <Link href="/">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </nav>

      {/* Header */}
      <section className="py-12 border-b border-border">
        <div className="container text-center">
          <HelpCircle className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about PrayerCircle. Can't find what you're looking for? 
            Reach out to us at <a href="mailto:wpmcircle@gmail.com" className="text-primary hover:underline">wpmcircle@gmail.com</a>
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          <div className="space-y-8">
            {faqSections.map((section, idx) => (
              <Card key={idx} className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-2xl">{section.title}</CardTitle>
                  <CardDescription>Common questions about {section.title.toLowerCase()}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {section.questions.map((item, qIdx) => (
                    <div key={qIdx} className="space-y-2">
                      <h3 className="font-semibold text-lg text-foreground">{item.q}</h3>
                      <p className="text-muted-foreground leading-relaxed">{item.a}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Section */}
          <Card className="mt-12 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Still Have Questions?</CardTitle>
              <CardDescription>We're here to help!</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Don't hesitate to reach out. We typically respond within 24-48 hours.
              </p>
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Email:</strong>{" "}
                  <a href="mailto:wpmcircle@gmail.com" className="text-primary hover:underline">
                    wpmcircle@gmail.com
                  </a>
                </p>
                <p className="text-sm">
                  <strong>Support Hours:</strong> Monday - Friday, 9am - 5pm EST
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-card/20">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} PrayerCircle. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

