import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ProfilePage = lazy(() => import("@/pages/Profile/ProfilePage"));
const PPDTPractice = lazy(() => import("./pages/PPDTPractice"));
const PPDTSteps = lazy(() => import("@/pages/ppdt/PPDTSteps"));
const SamplePPDT = lazy(() => import("@/pages/ppdt/SamplePPDT"));
const PPDTTest = lazy(() => import("@/pages/ppdt/PPDTTest"));
const AddPPDTImage = lazy(() => import("@/pages/ppdt/admin/AddPPDTImage"));
const EditPPDTImage = lazy(() => import("@/pages/ppdt/admin/EditPPDTImage"));
const AdminPPDTImages = lazy(
  () => import("@/pages/ppdt/admin/AdminPPDTImages"),
);
const PPDTImageSelect = lazy(
  () => import("@/pages/ppdt/admin/test/PPDTImageSelect"),
);
const GDComingSoon = lazy(() => import("@/pages/ppdt/GDComingSoon"));
const SSBInterviewRoadmap = lazy(() => import("@/pages/SSBInterviewRoadmap"));
const LecturettePage = lazy(() => import("@/pages/Lecturette/LecturettePage"));
const LecturetteDetailPage = lazy(
  () => import("@/pages/Lecturette/LecturetteDetailPage"),


);

const LecturetteTest = lazy(() => import("@/pages/Lecturette/LecturetteTest"));
const AboutLecturette = lazy(() => import("@/pages/Lecturette/AboutLecturette"));
const SampleLecturette = lazy(() => import("@/pages/Lecturette/SampleLecturette"))
const GPEPage = lazy(() => import("@/pages/GPE/GPEPage"));
const AboutGPE = lazy(() => import("@/pages/GPE/AboutGPE"));
const SampleGPEPage = lazy(() => import("@/pages/GPE/SampleGPEPage"));
const GpeTestPage = lazy(() => import("@/pages/GPE/GpeTestPage"));
const SampleGPEDetail = lazy(() => import("@/pages/GPE/SampleGPEDetail"));
const AddGpeModel = lazy(() => import("@/pages/GPE/AddGpeModel"));
const EditGpePage = lazy(() => import("@/pages/GPE/EditGpePage.jsx"));
const WatPracticeList = lazy(() => import("@/pages/Wat/WatPracticeList"));


// ✅ Configure QueryClient with optimized defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Retry failed requests once
      staleTime: 5 * 60 * 1000, // Data fresh for 5 minutes
      cacheTime: 10 * 60 * 1000, // Cache for 10 minutes
      refetchOnWindowFocus: false, // Don't refetch on window focus
    },
  },
});
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
const SrtAbout = lazy(() => import("@/pages/srt/SrtAbout"));
const SrtSampleDetail = lazy(() => import("@/pages/srt/SrtSampleDetail"));
const SrtPracticeDetail = lazy(() => import("@/pages/srt/SrtPracticeDetail"));
const SrtSample = lazy(() => import("@/pages/srt/SrtSample"));
const SrtPracticeList = lazy(() => import("@/pages/srt/SrtPracticeList"));
const EditSrtPage = lazy(() => import("@/pages/srt/EditSrtPage"));
const AddSrtPage = lazy(() => import("@/pages/srt/AddSrtPage"));
const AddWatPage = lazy(() => import("@/pages/Wat/AddWatPage"));
const EditWatPage = lazy(() => import("@/pages/Wat/EditWatPage"));
const SdtPage = lazy(() => import("@/pages/SDT/SdtPage"));
const SdtAbout = lazy(() => import("@/pages/SDT/SdtAbout"));
const SdtSample = lazy(() => import("@/pages/SDT/SdtSample"));
const News = lazy(() => import("@/pages/news/News"));
const TATPage = lazy(() => import("@/pages/TAT/TATPage"));
const TATAbout = lazy(() => import("@/pages/TAT/TATAbout"));
const OirPage = lazy(() => import("@/pages/OIR/OirPage"));
const OirAbout = lazy(() => import("@/pages/OIR/OirAbout"));
const OirPracticeList = lazy(() => import("@/pages/OIR/OirPracticeList"));
const OirTestPage = lazy(() => import("@/pages/OIR/OirTestPage"));
const OirEditPage = lazy(() => import("@/pages/OIR/OirEditPage"));
const OirCreatePage = lazy(() => import("@/pages/OIR/OirCreatePage"));
const TatSample = lazy(() => import("@/pages/TAT/TatSample"));
const TatSampleDetail = lazy(() => import("@/pages/TAT/TatSampleDetail"));
const TatTestList = lazy(() => import("@/pages/TAT/TatTestList"));
const TatTestAttempt = lazy(() => import("@/pages/TAT/TatTestAttempt"));
const TatAdd = lazy(() => import("@/pages/TAT/TatAdd"));
const TatEdit = lazy(() => import("@/pages/TAT/TatEdit"));
const GpeTestAttempt = lazy(() => import("@/pages/GPE/GpeTestAttempt"));
const AuthCallback = lazy(() => import("@/lib/AuthCallback"));
const SDTAIComingSoon = lazy(() => import("@/pages/SDT/SDTAIComingSoon"));
const PIAIInterviewer = lazy(() => import("@/pages/PI/PIAIInterviewer"));
const VerifySuccess = lazy(() => import("@/pages/auth/VerifySuccess"));
const ResetPassword = lazy(() => import("@/pages/auth/ResetPassword"));
const PiqForm = lazy(() => import("@/pages/PIQ/PiqForm"));

// ✅ Import AuthProvider
import { AuthProvider } from "@/lib/AuthContext";

import ErrorBoundary from "@/components/ErrorBoundary";
import FeedbackWidget from "@/components/FeedbackWidget";

// ✅ Import Auth Component
import Auth from "@/pages/auth/Auth";
import { useEffect, useState } from "react";

const App = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  useEffect(() => {
    const handleAuthUnauthorized = (event) => {
      setAuthMode(event.detail?.mode || "login");
      setShowAuth(true);
    };
    window.addEventListener("auth:unauthorized", handleAuthUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleAuthUnauthorized);
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<LoadingSpinner />}>
              {/* ✅ Wrap with AuthProvider */}
              <AuthProvider>
                {showAuth && (
                  <Auth initialMode={authMode} onClose={() => setShowAuth(false)} />
                )}
                <Routes>
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/verify-success" element={<VerifySuccess />} />
                  <Route path="/auth/update-password" element={<ResetPassword />} />

                  <Route path="/" element={<Index />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/practice/ppdt" element={<PPDTPractice />} />
                  <Route path="/practice/ppdt/steps" element={<PPDTSteps />} />
                  <Route path="/practice/ppdt/sample" element={<SamplePPDT />} />
                  <Route
                    path="/practice/ppdt/PPDTImageSelect"
                    element={<PPDTImageSelect />}
                  />
                  <Route
                    path="/practice/ppdt/test/:imageId"
                    element={<PPDTTest />}
                  />
                  <Route
                    path="/practice/ppdt/gd-soon"
                    element={<GDComingSoon />}
                  />

                  <Route
                    path="/admin/ppdt/add-image"
                    element={<AddPPDTImage />}
                  />
                  <Route
                    path="/admin/ppdt/images"
                    element={<AdminPPDTImages />}
                  />
                  <Route
                    path="/admin/ppdt/edit/:id"
                    element={<EditPPDTImage />}
                  />
                  <Route
                    path="/front/roadmap"
                    element={<SSBInterviewRoadmap />}
                  />
                  <Route path="/sample" element={<SampleLecturette />} />
                  <Route
                    path="sample/lecturette/:id"
                    element={<LecturetteDetailPage />}
                  />
                  <Route path="/lecturette/about" element={<AboutLecturette />} />
                  <Route path="/lecturette/test" element={<LecturetteTest />} />
                  <Route path="/lecturettes" element={<LecturettePage />} />
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
                  <Route
                    path="/wat/practice/:id"
                    element={<WatPracticeDetail />}
                  />
                  <Route path="/srt" element={<SrtPage />} />
                  <Route path="/srt/about" element={<SrtAbout />} />
                  <Route path="/srt/sample" element={<SrtSample />} />
                  <Route path="/srt/sample/:id" element={<SrtSampleDetail />} />

                  {/* Practice SRT */}
                  <Route path="/srt/practice" element={<SrtPracticeList />} />
                  <Route
                    path="/srt/practice/:id"
                    element={<SrtPracticeDetail />}
                  />
                  <Route path="/admin/srt/edit/:id" element={<EditSrtPage />} />
                  <Route path="/admin/srt/add" element={<AddSrtPage />} />
                  <Route path="/admin/wat/add" element={<AddWatPage />} />
                  <Route path="/admin/wat/edit/:id" element={<EditWatPage />} />
                  <Route path="/sdt" element={<SdtPage />} />
                  <Route path="/sdt/about" element={<SdtAbout />} />
                  <Route path="/sdt/sample" element={<SdtSample />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/tat" element={<TATPage />} />
                  <Route path="/tat/about" element={<TATAbout />} />
                  <Route path="/oir" element={<OirPage />} />
                  <Route path="/oir/about" element={<OirAbout />} />
                  <Route path="/oir/practice" element={<OirPracticeList />} />
                  <Route path="/oir/practice/:id" element={<OirTestPage />} />
                  <Route path="/oir/admin/edit/:id" element={<OirEditPage />} />
                  <Route path="/oir/admin" element={<OirCreatePage />} />
                  <Route path="/tat/sample" element={<TatSample />} />
                  <Route path="/tat/sample/:id" element={<TatSampleDetail />} />
                  <Route path="*" element={<NotFound />} />
                  <Route path="/tat/test" element={<TatTestList />} />
                  <Route path="/tat/test/:id" element={<TatTestAttempt />} />
                  <Route path="/tat/admin" element={<TatAdd />} />
                  <Route path="/admin/tat/edit/:id" element={<TatEdit />} />
                  <Route path="/gpe/test/:id" element={<GpeTestAttempt />} />
                  <Route path="/sdt/AI-soon" element={<SDTAIComingSoon />} />
                  <Route
                    path="/piq"
                    element={<PiqForm />}
                  />
                  <Route
                    path="/pi/ai-interviewer"
                    element={<PIAIInterviewer />}
                  />
                </Routes>
                <FeedbackWidget />
              </AuthProvider>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};
export default App;
