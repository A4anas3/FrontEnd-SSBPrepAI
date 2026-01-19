import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PPDTPractice = lazy(() => import("./pages/PPDTPractice"));
const PPDTSteps = lazy(() => import("@/pages/ppdt/PPDTSteps"));
const SamplePPDT = lazy(() => import("@/pages/ppdt/SamplePPDT"));
const PPDTTest = lazy(() => import("@/pages/ppdt/PPDTTest"));

const queryClient = new QueryClient();
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/practice/ppdt" element={<PPDTPractice />} />
            <Route path="/practice/ppdt/steps" element={<PPDTSteps />} />
            <Route path="/practice/ppdt/sample" element={<SamplePPDT />} />
            <Route path="/practice/ppdt/test" element={<PPDTTest />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
export default App;
