import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

import { Button } from "@/components/ui/button";
import { APP_TITLE } from "@/const";

export default function PrivacyPolicy() {
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

      {/* Content */}
      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          <article className="prose prose-lg prose-invert max-w-none
            prose-headings:font-bold prose-headings:text-foreground
            prose-h1:text-4xl prose-h1:mb-8 prose-h1:border-b prose-h1:border-border prose-h1:pb-6
            prose-h2:text-2xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:text-primary prose-h2:border-l-4 prose-h2:border-primary prose-h2:pl-4
            prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-4 prose-h3:text-foreground
            prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6 prose-p:text-base
            prose-ul:my-6 prose-ul:space-y-2 prose-li:text-muted-foreground prose-li:my-2
            prose-strong:text-foreground prose-strong:font-semibold
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
            <h1>Privacy Policy for PrayerCircle</h1>
            <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>

            <h2>Our Commitment to You</h2>
            <p>
              At PrayerCircle, we understand that prayer is deeply personal. Your trust means everything to us, and we're committed to protecting your privacy while helping you connect with a caring community. This policy explains how we handle your information in simple, straightforward terms.
            </p>

            <h2>The Simple Version</h2>
            <p>Here's what you need to know:</p>
            <ul>
              <li><strong>Your prayers are yours.</strong> You control who sees them through visibility settings.</li>
              <li><strong>We don't sell your information.</strong> Ever. That's not what we're about.</li>
              <li><strong>Anonymous is truly anonymous.</strong> When you post anonymously, your name stays hidden.</li>
              <li><strong>We keep things safe.</strong> We use AI to help prevent spam and inappropriate content, but real people make the final calls.</li>
              <li><strong>You're in control.</strong> You can update, delete, or export your information anytime.</li>
            </ul>

            <h2>What Information We Collect</h2>
            
            <h3>When You Create an Account</h3>
            <p>
              We collect basic information like your name and email address when you sign up. If you use Google or another service to sign in, we receive your basic profile information from them.
            </p>

            <h3>When You Share a Prayer Request</h3>
            <p>
              We save your prayer title, content, and any church you associate it with. If you choose to post anonymously, we keep your identity private from other users. You decide who can see each prayer through our visibility options.
            </p>

            <h3>When You Join a Church Community</h3>
            <p>
              We keep track of which churches you're connected to so you can see prayers from your congregation and receive relevant updates.
            </p>

            <h3>Automatic Information</h3>
            <p>
              Like most websites, we collect basic information about how you use PrayerCircle (pages you visit, features you use) to help us improve the experience. We also use cookies to keep you logged in and remember your preferences.
            </p>

            <h2>How We Use Your Information</h2>

            <h3>To Connect You with Prayer Support</h3>
            <p>
              We use your information to show you relevant prayers, connect you with church communities, and notify you when people respond to your prayer requests.
            </p>

            <h3>To Keep the Community Safe</h3>
            <p>
              We use AI tools to help identify spam or inappropriate content, but real people always make the final decision about what stays or goes. This helps keep PrayerCircle a safe, respectful space for everyone.
            </p>

            <h3>To Make Things Better</h3>
            <p>
              We look at how people use PrayerCircle to understand what's working and what we can improve. This helps us build features that actually serve your needs.
            </p>

            <h3>To Help Churches Serve Better</h3>
            <p>
              For church administrators, we provide insights about prayer patterns in their community (like "many people are praying about health concerns this month"). These insights never reveal individual prayers or personal details.
            </p>

            <h2>Who Can See Your Information</h2>

            <h3>Your Prayer Visibility Choices</h3>
            <p>You control who sees each prayer request:</p>
            <ul>
              <li><strong>Entire Community:</strong> Everyone on PrayerCircle can see and pray for you</li>
              <li><strong>My Church Only:</strong> Only verified members of your church can see it</li>
              <li><strong>My Church + Nearby Churches:</strong> Churches in your area can see and support you</li>
            </ul>

            <h3>Anonymous Prayers</h3>
            <p>
              When you post anonymously, other users won't see your name. You can add a display name like "A Friend" or stay completely anonymous. We keep internal records for safety reasons, but your identity stays private to the community.
            </p>

            <h2>Your Privacy Rights</h2>
            <p>You have complete control over your information:</p>
            <ul>
              <li><strong>View Your Data:</strong> See all your prayers, church memberships, and account information anytime</li>
              <li><strong>Update Information:</strong> Change your details, email preferences, or church connections whenever you want</li>
              <li><strong>Delete Your Account:</strong> Request account deletion and we'll remove your information</li>
              <li><strong>Control Visibility:</strong> Change who can see your prayers at any time</li>
              <li><strong>Manage Emails:</strong> Choose which notifications you receive</li>
              <li><strong>Export Your Data:</strong> Get a copy of your information if you need it</li>
            </ul>
            <p>
              To exercise any of these rights, just reach out to us at <a href="mailto:wpmcircle@gmail.com">wpmcircle@gmail.com</a> or use your account settings.
            </p>

            <h2>How We Protect Your Information</h2>
            <p>We take security seriously:</p>
            <ul>
              <li>All data is encrypted when it travels between your device and our servers</li>
              <li>We use secure authentication methods</li>
              <li>Access to sensitive information is restricted to authorized personnel only</li>
              <li>We regularly review and update our security practices</li>
            </ul>
            <p>
              While we do everything we can to protect your information, no online service is 100% secure. We're committed to being transparent and responsive if any security issues arise.
            </p>

            <h2>AI and How We Use It</h2>
            <p>We use AI to enhance your experience in helpful ways:</p>
            <p>
              <strong>Content Safety:</strong> AI helps us quickly identify potential spam or inappropriate content. Think of it as a helpful assistant that flags things for human review.
            </p>
            <p>
              <strong>Prayer Categories:</strong> AI suggests categories for prayers (like Health, Family, or Spiritual Growth) to help people find relevant requests. You're not required to use these categories.
            </p>
            <p>
              <strong>Smart Search:</strong> AI helps you find prayers using natural language, so you can search for "struggling with anxiety" and find related prayers about worry, fear, and stress.
            </p>
            <p>
              <strong>Church Insights:</strong> For church leaders, AI creates general summaries like "your community is focused on health and family this month" without revealing individual prayers.
            </p>
            <p>
              We don't use your prayers to train commercial AI products. The AI is here to serve you, not the other way around.
            </p>

            <h2>Questions or Concerns?</h2>
            <p>
              We're here to help. If you have questions about privacy, want to exercise your rights, or just want to chat about how we protect your information, reach out:
            </p>
            <p>
              <strong>Email:</strong> <a href="mailto:wpmcircle@gmail.com">wpmcircle@gmail.com</a><br />
              <strong>Support Hours:</strong> Monday - Friday, 9am - 5pm EST
            </p>
            <p>We typically respond within 24-48 hours.</p>

            <h2>Bottom Line</h2>
            <p>
              We built PrayerCircle to help people pray for each other, not to collect data. Your privacy matters to us because your prayers matter to us.
            </p>
            <p>
              By using PrayerCircle, you're agreeing to this Privacy Policy. If something doesn't feel right or you have questions, please reach out. We're real people who care about this community.
            </p>
          </article>
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

