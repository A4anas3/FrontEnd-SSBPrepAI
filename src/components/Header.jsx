import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { login, signup } from "@/lib/authApi";

const navLinks = [
  { name: "Home", type: "route", to: "/" },
  { name: "Roadmap", type: "route", to: "/front/roadmap" },
  { name: "News", type: "route", to: "/news" },
  { name: "Screening Test", type: "section", id: "screening" },
  { name: "Psychological Tests", type: "section", id: "psychological" },
  { name: "GTO Tasks", type: "section", id: "gto" },
  { name: "Personal Interview", type: "section", id: "interview" },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

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

  return (
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
                <Button variant="ghost" size="sm" onClick={login}>
                  Login
                </Button>

                <Button variant="accent" size="sm" onClick={signup}>
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                <span className="text-sm font-medium text-primary">
                  {user?.name || "User"}
                </span>

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
                    onClick={login}
                  >
                    Login
                  </Button>

                  <Button variant="accent" className="w-full" onClick={signup}>
                    Sign Up
                  </Button>
                </>
              ) : (
                <Button
                  variant="destructive"
                  className="mt-4 w-full hover:bg-yellow-500"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Logout ({user?.name || "User"})
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
