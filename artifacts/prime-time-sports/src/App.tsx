import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import BettingTips from "@/pages/BettingTips";
import MailingList from "@/pages/MailingList";
import Poll2 from "@/pages/Poll2";

const queryClient = new QueryClient();

function PollRedirect() {
  const [, setLocation] = useLocation();
  useEffect(() => { setLocation("/poll/1", { replace: true }); }, []);
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/betting-tips" component={BettingTips} />
      <Route path="/mailing-list" component={MailingList} />
      <Route path="/poll/:id" component={Poll2} />
      <Route path="/poll" component={PollRedirect} />
      <Route path="/poll-2" component={PollRedirect} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
        <Analytics />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
