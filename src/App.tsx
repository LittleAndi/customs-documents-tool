import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "@/config/authConfig";
import { AuthProvider } from "@/contexts/AuthContext";
import Navigation from "./components/Navigation";
import UploadDocuments from "./pages/UploadDocuments";
import CheckStatus from "./pages/CheckStatus";
import ResultDetails from "./pages/ResultDetails";
import NotFound from "./pages/NotFound";

const msalInstance = new PublicClientApplication(msalConfig);

const queryClient = new QueryClient();

const App = () => (
  <MsalProvider instance={msalInstance}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <div className="min-h-screen bg-background">
              <Navigation />
              <Routes>
                <Route path="/" element={<UploadDocuments />} />
                <Route path="/check-status" element={<CheckStatus />} />
                <Route path="/result/:containerId" element={<ResultDetails />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </MsalProvider>
);

export default App;
