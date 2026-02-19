import { useState } from "react";
import { Menu, X, MessageCircle, FileText, User, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { isAdmin } from "@/config/admin";
import { fetchAllFeedback } from "@/features/feedback/feedbackApi";
import { fetchAllPiq, deletePiqForm } from "@/features/piq/apiPiq";

const navLinks = [
  { name: "Home", type: "route", to: "/" },
  { name: "PIQ Form", type: "route", to: "/piq" },
  { name: "Roadmap", type: "route", to: "/front/roadmap" },
  { name: "News", type: "route", to: "/news" },
  { name: "Screening Test", type: "section", id: "screening" },
  { name: "Psychological Tests", type: "section", id: "psychological" },
  { name: "GTO Tasks", type: "section", id: "gto" },
  { name: "Personal Interview", type: "section", id: "interview" },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackList, setFeedbackList] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [piqOpen, setPiqOpen] = useState(false);
  const [piqList, setPiqList] = useState([]);
  const [piqLoading, setPiqLoading] = useState(false);
  const [expandedPiq, setExpandedPiq] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const isUserAdmin = isAdmin(user);

  const openAuthModal = (mode = "login") => {
    window.dispatchEvent(
      new CustomEvent("auth:unauthorized", { detail: { mode } })
    );
  };

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    const yOffset = -80;
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const handleSectionNav = (sectionId) => {
    setMobileMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => scrollToSection(sectionId), 120);
    } else {
      scrollToSection(sectionId);
    }
  };

  const handleOpenFeedback = async () => {
    setFeedbackOpen(true);
    setFeedbackLoading(true);
    try {
      const data = await fetchAllFeedback();
      setFeedbackList(data);
    } catch (err) {
      setFeedbackList([]);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleOpenPiq = async () => {
    setPiqOpen(true);
    setPiqLoading(true);
    try {
      const data = await fetchAllPiq();
      setPiqList(data);
    } catch (err) {
      setPiqList([]);
    } finally {
      setPiqLoading(false);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-card header-shadow">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* LOGO */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <img src="/logo.png" alt="Logo" className="w-6 h-6" />
              <span className="text-xl lg:text-2xl font-display font-bold text-primary">
                SSB<span className="text-accent">Mentor</span>AI
              </span>
            </button>

            {/* DESKTOP NAV */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) =>
                link.type === "route" ? (
                  <button
                    key={link.name}
                    onClick={() => navigate(link.to)}
                    className="text-sm text-primary hover:text-yellow-500"
                  >
                    {link.name}
                  </button>
                ) : (
                  <button
                    key={link.name}
                    onClick={() => handleSectionNav(link.id)}
                    className="text-sm text-primary hover:text-yellow-500"
                  >
                    {link.name}
                  </button>
                ),
              )}
            </nav>

            {/* DESKTOP AUTH */}
            <div className="hidden lg:flex items-center gap-3">
              {!isAuthenticated ? (
                <>
                  <Button variant="ghost" size="sm" onClick={() => openAuthModal("login")}>
                    Login
                  </Button>
                  <Button variant="accent" size="sm" onClick={() => openAuthModal("signup")}>
                    Sign Up
                  </Button>
                </>
              ) : (
                <>
                  {/* Admin buttons */}
                  {isUserAdmin && (
                    <>
                      <button
                        onClick={handleOpenFeedback}
                        className="text-sm text-primary hover:text-yellow-500 flex items-center gap-1"
                        title="View All Feedback"
                      >
                        <MessageCircle size={16} />
                        Feedback
                      </button>
                      <button
                        onClick={handleOpenPiq}
                        className="text-sm text-primary hover:text-yellow-500 flex items-center gap-1"
                        title="View All PIQ Forms"
                      >
                        <FileText size={16} />
                        All PIQ
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => navigate("/profile")}
                    className="flex items-center gap-2 text-sm font-medium text-primary hover:text-yellow-500 transition-colors cursor-pointer"
                    title="Edit Profile"
                  >
                    {user?.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover border border-gray-200" />
                    ) : (
                      <User size={18} className="text-gray-500" />
                    )}
                    {user?.user_metadata?.full_name || user?.email || "User"}
                  </button>

                  <Button variant="outline" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </>
              )}
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              className="lg:hidden p-2 text-primary"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* MOBILE NAV */}
          {mobileMenuOpen && (
            <div
              className="lg:hidden fixed top-16 right-0 w-[45%]
                bg-slate-50 border-l border-slate-200
                rounded-l-sm shadow-lg pb-4 z-40"
            >
              <nav className="flex flex-col gap-2 pt-4">
                {navLinks.map((link) =>
                  link.type === "route" ? (
                    <button
                      key={link.name}
                      onClick={() => {
                        navigate(link.to);
                        setMobileMenuOpen(false);
                      }}
                      className="text-sm text-center text-primary hover:text-yellow-500"
                    >
                      {link.name}
                    </button>
                  ) : (
                    <button
                      key={link.name}
                      onClick={() => handleSectionNav(link.id)}
                      className="text-sm text-center text-primary hover:text-yellow-500"
                    >
                      {link.name}
                    </button>
                  ),
                )}

                {!isAuthenticated ? (
                  <>
                    <Button
                      variant="ghost"
                      className="mt-4 w-full"
                      onClick={() => openAuthModal("login")}
                    >
                      Login
                    </Button>
                    <Button variant="accent" className="w-full" onClick={() => openAuthModal("signup")}>
                      Sign Up
                    </Button>
                  </>
                ) : (
                  <>
                    {/* Admin: mobile buttons */}
                    {isUserAdmin && (
                      <>
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            handleOpenFeedback();
                          }}
                          className="text-sm text-center text-primary hover:text-yellow-500 flex items-center justify-center gap-1"
                        >
                          <MessageCircle size={14} />
                          All Feedback
                        </button>
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            handleOpenPiq();
                          }}
                          className="text-sm text-center text-primary hover:text-yellow-500 flex items-center justify-center gap-1"
                        >
                          <FileText size={14} />
                          All PIQ
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => {
                        navigate("/profile");
                        setMobileMenuOpen(false);
                      }}
                      className="text-sm text-center text-primary hover:text-yellow-500 flex items-center justify-center gap-1 mb-2"
                    >
                      <User size={14} /> My Profile
                    </button>

                    <Button
                      variant="destructive"
                      className="mt-2 w-full hover:bg-yellow-500"
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      Logout ({user?.user_metadata?.full_name || user?.email || "User"})
                    </Button>
                  </>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* 📋 Feedback Modal (Admin) */}
      {feedbackOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setFeedbackOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col z-10 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <MessageCircle size={22} className="text-primary" />
                All Feedback ({feedbackList.length})
              </h2>
              <button onClick={() => setFeedbackOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={20} />
              </button>
            </div>
            <div className="overflow-y-auto p-6 space-y-4 flex-1">
              {feedbackLoading ? (
                <p className="text-center text-gray-500 py-8">Loading feedback...</p>
              ) : feedbackList.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No feedback yet.</p>
              ) : (
                feedbackList.map((fb) => (
                  <div key={fb.id} className="border rounded-xl p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-800">{fb.subject}</span>
                      <span className="text-xs text-gray-400">
                        {fb.createdAt ? new Date(fb.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                        }) : ""}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{fb.improvement}</p>
                    {fb.rating && (
                      <div className="flex items-center gap-0.5 mb-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span key={s} className={`text-sm ${s <= fb.rating ? "text-yellow-400" : "text-gray-300"}`}>★</span>
                        ))}
                        <span className="text-xs text-gray-400 ml-1">{fb.rating}/5</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>👤 {fb.userName || "Unknown"}</span>
                      <span>📧 {fb.userEmail || "N/A"}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 📋 PIQ Modal (Admin) */}
      {piqOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setPiqOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col z-10 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FileText size={22} className="text-primary" />
                All PIQ Forms ({piqList.length})
              </h2>
              <button onClick={() => setPiqOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={20} />
              </button>
            </div>
            <div className="overflow-y-auto p-6 space-y-3 flex-1">
              {piqLoading ? (
                <p className="text-center text-gray-500 py-8">Loading PIQ forms...</p>
              ) : piqList.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No PIQ forms submitted yet.</p>
              ) : (
                piqList.map((piq) => (
                  <div key={piq.id} className="border rounded-xl overflow-hidden">
                    {/* Summary row */}
                    <button
                      onClick={() => setExpandedPiq(expandedPiq === piq.id ? null : piq.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div>
                        <span className="font-semibold text-gray-800">
                          {piq.fullName || "Unnamed"}
                        </span>
                        <span className="text-xs text-gray-400 ml-3">
                          {piq.userEmail || piq.userName || ""}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {expandedPiq === piq.id ? "▲" : "▼"}
                      </span>
                    </button>

                    {/* Expanded details */}
                    {expandedPiq === piq.id && (
                      <div className="border-t p-4 bg-gray-50 text-sm space-y-4">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                          <p><strong>Father:</strong> {piq.fathersName || "—"}</p>
                          <p><strong>DOB:</strong> {piq.dateOfBirth || "—"}</p>
                          <p><strong>Religion:</strong> {piq.religion || "—"}</p>
                          <p><strong>Category:</strong> {piq.category || "—"}</p>
                          <p><strong>State/District:</strong> {piq.stateDistrict || "—"}</p>
                          <p><strong>Mother Tongue:</strong> {piq.motherTongue || "—"}</p>
                          <p><strong>Height:</strong> {piq.height || "—"}</p>
                          <p><strong>Weight:</strong> {piq.weight || "—"}</p>
                          <p><strong>Brothers:</strong> {piq.numberOfBrothers || "—"}</p>
                          <p><strong>Sisters:</strong> {piq.numberOfSisters || "—"}</p>
                        </div>
                        <p><strong>Present Address:</strong> {piq.presentAddress || "—"}</p>
                        <p><strong>Permanent Address:</strong> {piq.permanentAddress || "—"}</p>

                        {/* Family Details */}
                        {piq.familyDetails && piq.familyDetails.length > 0 && (
                          <div>
                            <p className="font-semibold text-gray-700 mb-1">Family Occupation / Income</p>
                            <table className="w-full border border-gray-200 text-xs text-center">
                              <thead><tr className="bg-gray-100">
                                <th className="border-r border-gray-200 p-1">Relation</th>
                                <th className="border-r border-gray-200 p-1">Education</th>
                                <th className="border-r border-gray-200 p-1">Occupation</th>
                                <th className="p-1">Income</th>
                              </tr></thead>
                              <tbody>
                                {piq.familyDetails.map((f, i) => (
                                  <tr key={i} className="border-t border-gray-200">
                                    <td className="border-r border-gray-200 p-1 font-medium">{f.relation}</td>
                                    <td className="border-r border-gray-200 p-1">{f.education || "—"}</td>
                                    <td className="border-r border-gray-200 p-1">{f.occupation || "—"}</td>
                                    <td className="p-1">{f.incomePerMonth || "—"}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {/* Education Details */}
                        {piq.educationDetails && piq.educationDetails.length > 0 && (
                          <div>
                            <p className="font-semibold text-gray-700 mb-1">Education Record</p>
                            <table className="w-full border border-gray-200 text-xs text-center">
                              <thead><tr className="bg-gray-100">
                                <th className="border-r border-gray-200 p-1">Exam</th>
                                <th className="border-r border-gray-200 p-1">Year</th>
                                <th className="border-r border-gray-200 p-1">Div/Marks</th>
                                <th className="border-r border-gray-200 p-1">Medium</th>
                                <th className="p-1">Boarder/Day</th>
                              </tr></thead>
                              <tbody>
                                {piq.educationDetails.map((e, i) => (
                                  <tr key={i} className="border-t border-gray-200">
                                    <td className="border-r border-gray-200 p-1 font-medium text-left">{e.exam}</td>
                                    <td className="border-r border-gray-200 p-1">{e.year || "—"}</td>
                                    <td className="border-r border-gray-200 p-1">{e.divisionMarks || "—"}</td>
                                    <td className="border-r border-gray-200 p-1">{e.medium || "—"}</td>
                                    <td className="p-1">{e.boarderDayScholar || "—"}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        <p><strong>Occupation:</strong> {piq.presentOccupation || "—"}</p>
                        <p><strong>Hobbies:</strong> {piq.hobbiesInterests || "—"}</p>
                        <p><strong>Extra-curricular:</strong> {piq.extraCurricular || "—"}</p>
                        <p><strong>Games & Sports:</strong> {piq.gamesAndSports || "—"}</p>

                        {/* Delete Button */}
                        <button
                          onClick={async () => {
                            if (!window.confirm(`Delete PIQ form of ${piq.fullName || "this user"}?`)) return;
                            try {
                              await deletePiqForm(piq.id);
                              setPiqList((prev) => prev.filter((p) => p.id !== piq.id));
                            } catch {
                              alert("Failed to delete.");
                            }
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100 border border-red-200 transition-all mt-2"
                        >
                          <Trash2 size={14} /> Delete PIQ
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
