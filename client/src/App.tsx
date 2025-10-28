import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";

import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";

import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

const Toaster = lazy(() =>
  import("./components/ui/sonner").then(module => ({ default: module.Toaster }))
);
const Prayers = lazy(() => import("./pages/Prayers"));
const PrayerDetail = lazy(() => import("./pages/PrayerDetail"));
const SubmitPrayer = lazy(() => import("./pages/SubmitPrayer"));
const Churches = lazy(() => import("./pages/Churches"));
const SubmitChurch = lazy(() => import("./pages/SubmitChurch"));
const ChurchInsights = lazy(() => import("./pages/ChurchInsights"));
const ChurchPrayers = lazy(() => import("./pages/ChurchPrayers"));
const ChurchMembers = lazy(() => import("./pages/ChurchMembers"));
const PrayerGroups = lazy(() => import("./pages/PrayerGroups"));
const EmailSettings = lazy(() => import("./pages/EmailSettings"));
const Admin = lazy(() => import("./pages/Admin"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const FAQ = lazy(() => import("./pages/FAQ"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const OurStory = lazy(() => import("./pages/OurStory"));

function Router() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center"
          role="status"
          aria-live="polite"
        >
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">Preparing PrayerCircle…</p>
        </div>
      }
    >
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/prayers"} component={Prayers} />
        <Route path="/prayers/:id" component={PrayerDetail} />
        <Route path={"/submit-prayer"} component={SubmitPrayer} />
        <Route path={"/churches"} component={Churches} />
        <Route path={"/submit-church"} component={SubmitChurch} />
        <Route path="/churches/:id/insights" component={ChurchInsights} />
        <Route path="/churches/:id/prayers" component={ChurchPrayers} />
        <Route path="/churches/:id/members" component={ChurchMembers} />
        <Route path="/churches/:id/groups" component={PrayerGroups} />
        <Route path="/settings/email" component={EmailSettings} />
        <Route path={"/admin"} component={Admin} />
        <Route path={"/privacy"} component={PrivacyPolicy} />
        <Route path={"/faq"} component={FAQ} />
        <Route path={"/terms"} component={TermsOfService} />
        <Route path={"/our-story"} component={OurStory} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <ThemeProvider
        defaultTheme="dark"
      >
        <TooltipProvider>
          <Suspense fallback={null}>
            <Toaster />
          </Suspense>
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
