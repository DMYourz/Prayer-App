import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

import { Button } from "@/components/ui/button";
import { APP_TITLE } from "@/const";

export default function TermsOfService() {
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
            <h1>Terms of Service for PrayerCircle</h1>
            <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>

            <h2>Welcome to PrayerCircle</h2>
            <p>
              Thank you for choosing PrayerCircle. These Terms of Service ("Terms") govern your use of our platform. By using PrayerCircle, you agree to these Terms. If you don't agree, please don't use our service.
            </p>
            <p>
              We've written these Terms to be as clear and straightforward as possible. If you have questions, reach out to us at <a href="mailto:wpmcircle@gmail.com">wpmcircle@gmail.com</a>.
            </p>

            <h2>1. About PrayerCircle</h2>
            <p>
              PrayerCircle is a faith-based platform that connects people through prayer. We provide a space where individuals can share prayer requests, respond with encouragement, and connect with church communities. Our mission is to help people pray for each other, not to collect data or make money from your information.
            </p>

            <h2>2. Who Can Use PrayerCircle</h2>
            <h3>Age Requirements</h3>
            <p>
              You must be at least 13 years old to use PrayerCircle. If you're between 13 and 18, you should have your parent or guardian's permission.
            </p>

            <h3>Account Responsibility</h3>
            <p>
              You're responsible for keeping your account secure. Don't share your password, and let us know immediately if you think someone accessed your account without permission.
            </p>

            <h3>Accurate Information</h3>
            <p>
              When you register a church or provide information, please be truthful. Fake churches or misleading information hurt the community and may result in account suspension.
            </p>

            <h2>3. How to Use PrayerCircle</h2>
            <h3>What You Can Do</h3>
            <ul>
              <li>Submit prayer requests (with your name or anonymously)</li>
              <li>Respond to prayers with encouragement and support</li>
              <li>Join church communities</li>
              <li>Search for and browse prayers</li>
              <li>Connect with other believers</li>
            </ul>

            <h3>What You Can't Do</h3>
            <p>
              <strong>Be Respectful:</strong> Don't post content that's hateful, threatening, harassing, or discriminatory. This is a space for prayer and support.
            </p>
            <p>
              <strong>No Spam:</strong> Don't use PrayerCircle to advertise products, services, or promote commercial interests.
            </p>
            <p>
              <strong>Stay Appropriate:</strong> Keep content appropriate for a faith-based community. No explicit, offensive, or inappropriate material.
            </p>
            <p>
              <strong>Respect Privacy:</strong> Don't share other people's personal information without their permission.
            </p>
            <p>
              <strong>No Impersonation:</strong> Don't pretend to be someone else or create fake accounts.
            </p>

            <h2>4. Your Content</h2>
            <h3>What You Own</h3>
            <p>
              You own the prayers and content you post. By submitting content to PrayerCircle, you give us permission to display, store, and share it according to your visibility settings.
            </p>

            <h3>What We Can Do</h3>
            <p>
              We may remove content that violates these Terms or our community guidelines. We use AI to help identify spam and inappropriate content, but real people make the final decisions.
            </p>

            <h2>5. Church Registration</h2>
            <h3>Verification Process</h3>
            <p>
              Churches must apply and be verified before joining PrayerCircle. We review each application to ensure legitimacy and protect our community.
            </p>

            <h3>Church Administrator Responsibilities</h3>
            <p>If you're a church administrator, you agree to:</p>
            <ul>
              <li>Provide accurate information about your church</li>
              <li>Use member information only for pastoral care and ministry purposes</li>
              <li>Respect the privacy of church members and prayer requests</li>
              <li>Follow these Terms and our Privacy Policy</li>
            </ul>

            <h2>6. AI Features</h2>
            <p>We use artificial intelligence to enhance your experience:</p>
            <ul>
              <li><strong>Content Moderation:</strong> AI helps identify spam and inappropriate content</li>
              <li><strong>Categorization:</strong> AI suggests prayer categories for better organization</li>
              <li><strong>Smart Search:</strong> AI enables natural language search</li>
              <li><strong>Church Insights:</strong> AI generates privacy-preserving summaries for church leaders</li>
            </ul>
            <p>
              By using PrayerCircle, you consent to this AI processing. We don't use your prayers to train commercial AI products.
            </p>

            <h2>7. Privacy and Data</h2>
            <p>
              Your privacy is important to us. Please read our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link> to understand how we collect, use, and protect your information.
            </p>

            <h2>8. Disclaimers</h2>
            <h3>No Professional Advice</h3>
            <p>
              PrayerCircle is a community support platform, not a substitute for professional counseling, medical advice, or pastoral care. If you're in crisis, please contact a qualified professional or emergency services.
            </p>

            <h3>No Guarantees</h3>
            <p>
              We provide PrayerCircle "as is" without warranties. We don't guarantee that the service will always be available or error-free.
            </p>

            <h2>9. Termination</h2>
            <h3>Your Right to Leave</h3>
            <p>
              You can stop using PrayerCircle anytime. Contact us at <a href="mailto:wpmcircle@gmail.com">wpmcircle@gmail.com</a> to delete your account.
            </p>

            <h3>Our Right to Suspend or Terminate</h3>
            <p>
              We may suspend or terminate your account if you violate these Terms, engage in abusive behavior, or repeatedly post inappropriate content.
            </p>

            <h2>10. Emergency Situations</h2>
            <p><strong>If you're in crisis or having thoughts of self-harm, please contact:</strong></p>
            <ul>
              <li>National Suicide Prevention Lifeline: 988 or 1-800-273-8255</li>
              <li>Crisis Text Line: Text HOME to 741741</li>
              <li>Emergency Services: 911</li>
            </ul>
            <p>
              PrayerCircle is not equipped to handle emergency situations. Please seek immediate professional help if you're in crisis.
            </p>

            <h2>Questions?</h2>
            <p>
              We're here to help. If you have questions about these Terms, reach out:
            </p>
            <p>
              <strong>Email:</strong> <a href="mailto:wpmcircle@gmail.com">wpmcircle@gmail.com</a><br />
              <strong>Support Hours:</strong> Monday - Friday, 9am - 5pm EST
            </p>

            <hr className="my-8 border-border" />

            <p className="text-center text-sm">
              <strong>By using PrayerCircle, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</strong>
            </p>
            <p className="text-center text-sm">
              Thank you for being part of our prayer community. We're honored to serve you.
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

