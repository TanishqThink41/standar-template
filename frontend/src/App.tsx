
import { Toaster } from "@/components/powerpoint/ui/toaster";
import { Toaster as Sonner } from "@/components/powerpoint/ui/sonner";
import { TooltipProvider } from "@/components/powerpoint/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PowerPoint from "./pages/PowerPoint";
import NotFound from "./pages/NotFound";
import DashboardCanvas from "./pages/DashboardCanvas";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/powerpoint" element={<PowerPoint />} />
          <Route path="/dashboard" element={<DashboardCanvas />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
