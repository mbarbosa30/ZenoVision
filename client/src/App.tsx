import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Admin from "@/pages/admin";
import About from "@/pages/about";
import Memo from "@/pages/memo";
import Proposal from "@/pages/proposal";
import ProposalMarco from "@/pages/proposal-marco";
import ProposalCeloSelf from "@/pages/proposal-celo-self";
import Dashboard from "@/pages/dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/memo" component={Memo} />
      <Route path="/proposal" component={Proposal} />
      <Route path="/proposal/marco" component={ProposalMarco} />
      <Route path="/proposal/celo-self" component={ProposalCeloSelf} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="labyrhythm-theme">
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <Router />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
