import { Toaster as PowerPointToaster } from "@/components/powerpoint/ui/toaster";
import { Toaster as Sonner } from "@/components/powerpoint/ui/sonner";
import { TooltipProvider } from "@/components/powerpoint/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { queryClient } from "@/lib/queryClient";

import PowerPoint from "@/pages/PowerPoint";
import NotFound from "@/pages/NotFound";
import DashboardCanvas from "@/pages/DashboardCanvas";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import { Toaster as GeneralToaster } from "@/components/ui/toaster";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <PowerPointToaster />
        <Sonner position="top-right" />
        <GeneralToaster />
        <BrowserRouter>
          <Routes>
            <Route path="/powerpoint" element={<PowerPoint />} />
            <Route path="/dashboard" element={<DashboardCanvas />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
