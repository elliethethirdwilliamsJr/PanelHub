import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import AnimeInfo from "@/pages/AnimeInfo";
import Watch from "@/pages/Watch";

const queryClient = new QueryClient();

function Router() {
  // Log current path for debugging
  if (typeof window !== 'undefined') {
    console.log('[Router] Current path:', window.location.pathname);
    console.log('[Router] Base URL:', import.meta.env.BASE_URL);
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/anime/:id" component={AnimeInfo} />
      <Route path="/watch/:id" component={Watch} />
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
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
