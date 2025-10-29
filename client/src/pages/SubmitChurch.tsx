import { ArrowLeft, Church as ChurchIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";

import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { APP_TITLE, getLoginUrl,IS_DEMO_MODE } from "@/const";
import { trpc } from "@/lib/trpc";

export default function SubmitChurch() {
  const { isAuthenticated } = useAuth();
  const canSubmit = isAuthenticated || IS_DEMO_MODE;
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    contactEmail: "",
    contactPhone: "",
    website: "",
  });

  const submitChurch = trpc.churches.submit.useMutation({
    onSuccess: () => {
      toast.success("Your church has been submitted for review");
      setLocation("/churches");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit church");
    },
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Church name is required");
      return;
    }

    submitChurch.mutate({
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      address: formData.address.trim() || undefined,
      city: formData.city.trim() || undefined,
      state: formData.state.trim() || undefined,
      country: formData.country.trim() || undefined,
      zipCode: formData.zipCode.trim() || undefined,
      contactEmail: formData.contactEmail.trim() || undefined,
      contactPhone: formData.contactPhone.trim() || undefined,
      website: formData.website.trim() || undefined,
    });
  };

  if (!canSubmit) {
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
              <ChurchIcon className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-3">Sign In Required</h2>
              <p className="text-muted-foreground mb-6">
                You need to be signed in to register a church
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

      {/* Form Section */}
      <section className="py-12 flex-1">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 text-center">
              <ChurchIcon className="h-12 w-12 text-primary mx-auto mb-4" />
              <h1 className="text-4xl font-bold mb-3">Register Your Church</h1>
              <p className="text-lg text-muted-foreground">
                Submit your church for review to join our prayer network. All submissions are reviewed by our team.
              </p>
              {IS_DEMO_MODE && (
                <p className="mt-4 text-sm text-primary">
                  Preview mode: you don&apos;t need an account to try this flow. We&apos;ll route your submission to the demo review queue.
                </p>
              )}
            </div>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Church Information</CardTitle>
                <CardDescription>
                  Fields marked with * are required. Your submission will be reviewed within 1-2 business days.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-foreground">Basic Information</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Church Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        placeholder="First Baptist Church"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        maxLength={255}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Tell us about your church..."
                        value={formData.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        rows={4}
                        className="resize-none"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-4 pt-4 border-t border-border">
                    <h3 className="text-sm font-semibold text-foreground">Location</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        placeholder="123 Main Street"
                        value={formData.address}
                        onChange={(e) => handleChange("address", e.target.value)}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          placeholder="Springfield"
                          value={formData.city}
                          onChange={(e) => handleChange("city", e.target.value)}
                          maxLength={100}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">State/Province</Label>
                        <Input
                          id="state"
                          placeholder="Illinois"
                          value={formData.state}
                          onChange={(e) => handleChange("state", e.target.value)}
                          maxLength={50}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          placeholder="United States"
                          value={formData.country}
                          onChange={(e) => handleChange("country", e.target.value)}
                          maxLength={100}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                        <Input
                          id="zipCode"
                          placeholder="62701"
                          value={formData.zipCode}
                          onChange={(e) => handleChange("zipCode", e.target.value)}
                          maxLength={20}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-4 pt-4 border-t border-border">
                    <h3 className="text-sm font-semibold text-foreground">Contact Information</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Email</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        placeholder="contact@church.org"
                        value={formData.contactEmail}
                        onChange={(e) => handleChange("contactEmail", e.target.value)}
                        maxLength={320}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Phone</Label>
                      <Input
                        id="contactPhone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={formData.contactPhone}
                        onChange={(e) => handleChange("contactPhone", e.target.value)}
                        maxLength={50}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        placeholder="https://www.church.org"
                        value={formData.website}
                        onChange={(e) => handleChange("website", e.target.value)}
                        maxLength={500}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={submitChurch.isPending}
                      className="flex-1"
                    >
                      {submitChurch.isPending ? "Submitting..." : "Submit for Review"}
                    </Button>
                    <Link href="/churches">
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
