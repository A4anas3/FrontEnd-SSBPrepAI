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
const AddPPDTImage = lazy(() => import("@/pages/ppdt/admin/AddPPDTImage"));
const AdminPPDTImages = lazy(
  () => import("@/pages/ppdt/admin/AdminPPDTImages"),
);
const PPDTImageSelect = lazy(
  () => import("@/pages/ppdt/admin/test/PPDTImageSelect"),
);
const GDComingSoon = lazy(() => import("@/pages/ppdt/GDComingSoon"));
const SSBInterviewRoadmap = lazy(() => import("@/pages/SSBInterviewRoadmap"));
const LecturettePage = lazy(() => import("@/pages/LecturettePage"));
const LecturetteDetailPage = lazy(
  () => import("@/pages/Lecturette/LecturetteDetailPage"),
);
const GPEPage = lazy(() => import("@/pages/GPE/GPEPage"));
const AboutGPE = lazy(() => import("@/pages/GPE/AboutGPE"));
const SampleGPEPage = lazy(() => import("@/pages/GPE/SampleGPEPage"));
const GpeTestPage = lazy(() => import("@/pages/GPE/GpeTestPage"));
const SampleGPEDetail = lazy(() => import("@/pages/GPE/SampleGPEDetail"));
const AddGpeModel = lazy(() => import("@/pages/GPE/AddGpeModel"));
import EditGpePage from "@/pages/GPE/EditGpePage.jsx";
const WatPracticeList = lazy(() => import("@/pages/Wat/WatPracticeList"));

const queryClient = new QueryClient();
const PIPage = lazy(() => import("@/pages/PI/PIPage"));
const AboutPI = lazy(() => import("@/pages/PI/AboutPI"));
const RapidFirePage = lazy(() => import("@/pages/PI/RapidFirePage"));
const AddRapidFirePage = lazy(() => import("@/pages/PI/AddRapidFirePage"));
const EditRapidFirePage = lazy(() => import("@/pages/PI/EditRapidFirePage"));
const WatPage = lazy(() => import("@/pages/Wat/WatPage"));
const WatAbout = lazy(() => import("@/pages/Wat/WatAbout"));
const WatSample = lazy(() => import("@/pages/Wat/WatSample"));
const WatSampleDetail = lazy(() => import("@/pages/Wat/WatSampleDetail"));
const WatPracticeDetail = lazy(() => import("@/pages/Wat/WatPracticeDetail"));
const SrtPage = lazy(() => import("@/pages/srt/srtCards"));
const SrtAbout = lazy(() => import("@/pages/SRT/SrtAbout"));
const SrtSampleDetail = lazy(() => import("@/pages/SRT/SrtSampleDetail"));
const SrtPracticeDetail = lazy(() => import("@/pages/SRT/SrtPracticeDetail"));
const SrtSample = lazy(() => import("@/pages/SRT/SrtSample"));
const SrtPracticeList = lazy(() => import("@/pages/SRT/SrtPracticeList"));
const EditSrtPage = lazy(() => import("@/pages/SRT/EditSrtPage"));
const AddSrtPage = lazy(() => import("@/pages/SRT/AddSrtPage"));
const AddWatPage = lazy(() => import("@/pages/Wat/AddWatPage"));
const EditWatPage = lazy(() => import("@/pages/Wat/EditWatPage"));
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
            <Route
              path="/practice/ppdt/PPDTImageSelect"
              element={<PPDTImageSelect />}
            />
            <Route path="/practice/ppdt/test/:imageId" element={<PPDTTest />} />
            <Route path="/practice/ppdt/gd-soon" element={<GDComingSoon />} />

            <Route path="/admin/ppdt/add-image" element={<AddPPDTImage />} />
            <Route path="/admin/ppdt/images" element={<AdminPPDTImages />} />
            <Route path="/front/roadmap" element={<SSBInterviewRoadmap />} />
            <Route path="/lecturettes" element={<LecturettePage />} />
            <Route path="/lecturette/:id" element={<LecturetteDetailPage />} />
            <Route path="/gpe" element={<GPEPage />} />
            <Route path="/gpe/about" element={<AboutGPE />} />
            <Route path="/gpe/sample" element={<SampleGPEPage />} />
            <Route path="/gpe/test" element={<GpeTestPage />} />
            <Route path="/gpe/sample/:id" element={<SampleGPEDetail />} />
            <Route path="/admin/gpe/add" element={<AddGpeModel />} />
            <Route path="/admin/gpe/edit/:id" element={<EditGpePage />} />
            <Route path="/pi" element={<PIPage />} />

            <Route path="/pi/about" element={<AboutPI />} />
            <Route path="/pi/rapid-fire" element={<RapidFirePage />} />
            <Route
              path="/admin/rapid-fire/add"
              element={<AddRapidFirePage />}
            />
            <Route
              path="/admin/rapid-fire/edit/:id"
              element={<EditRapidFirePage />}
            />
            <Route path="/wat" element={<WatPage />} />
            <Route path="/wat/about" element={<WatAbout />} />
            <Route path="/wat/sample" element={<WatSample />} />
            <Route path="/wat/sample/:id" element={<WatSampleDetail />} />
            <Route path="/wat/practice" element={<WatPracticeList />} />
            <Route path="/wat/practice/:id" element={<WatPracticeDetail />} />
            <Route path="/srt" element={<SrtPage />} />
            <Route path="/srt/about" element={<SrtAbout />} />
            <Route path="/srt/sample" element={<SrtSample />} />
            <Route path="/srt/sample/:id" element={<SrtSampleDetail />} />

            {/* Practice SRT */}
            <Route path="/srt/practice" element={<SrtPracticeList />} />
            <Route path="/srt/practice/:id" element={<SrtPracticeDetail />} />
            <Route path="/admin/srt/edit/:id" element={<EditSrtPage />} />
            <Route path="/admin/srt/add" element={<AddSrtPage />} />
            <Route path="/admin/wat/add" element={<AddWatPage />} />
            <Route path="/admin/wat/edit/:id" element={<EditWatPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
export default App;
