import { Mail, ExternalLink } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const footerLinks = [
  { name: "Home", type: "route", to: "/" },
  { name: "Roadmap", type: "route", to: "/front/roadmap" },

  { name: "Screening", type: "section", id: "screening" },
  { name: "Psychological Tests", type: "section", id: "psychological" },
  { name: "GTO Tasks", type: "section", id: "gto" },
  { name: "Personal Interview", type: "section", id: "interview" },
];

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (!el) return;

    const yOffset = -80; // header height
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const handleSectionClick = (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => scrollToSection(sectionId), 120);
    } else {
      scrollToSection(sectionId);
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* ================= BRAND ================= */}
          <div>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <img className="w-6 h-6" src="/logo.png" alt="Logo" />
              <span className="text-2xl font-bold">
                SSB<span className="text-accent">Mentor</span>AI
              </span>
            </button>

            <p className="mt-4 text-primary-foreground/70 text-sm leading-relaxed">
              Your comprehensive platform for SSB Interview preparation.
              Structured guidance for aspiring defence officers.
            </p>

            <div className="space-y-3 mt-4">
              <a
                href="mailto:contact@ssbprep.com"
                className="flex items-center gap-3 text-primary-foreground/70 hover:text-accent"
              >
                <Mail size={16} />
                <span className="text-sm">A4anaskhan3@gmail.com</span>
              </a>

              <a
                href="tel:+919870766580"
                className="flex items-center gap-3 text-primary-foreground/70 hover:text-accent"
              >
                <span className="text-sm">+91 9870766580</span>
              </a>
            </div>
          </div>

          {/* ================= QUICK LINKS ================= */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">Quick Links</h4>

            <nav className="flex flex-col gap-2">
              {footerLinks.map((link) =>
                link.type === "route" ? (
                  <button
                    key={link.name}
                    onClick={() => navigate(link.to)}
                    className="text-left text-primary-foreground/70 text-sm hover:text-secondary"
                  >
                    {link.name}
                  </button>
                ) : (
                  <button
                    key={link.name}
                    onClick={() => handleSectionClick(link.id)}
                    className="text-left text-primary-foreground/70 text-sm hover:text-secondary"
                  >
                    {link.name}
                  </button>
                ),
              )}
            </nav>
          </div>

          {/* ================= OTHER ================= */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">Other</h4>

            <Link
              to="/news"
              className="flex items-center gap-2 mt-2 text-primary-foreground/70 text-sm hover:text-secondary"
            >
              <ExternalLink size={16} />
              Current News
            </Link>

            <a
              href="#"
              className="flex items-center gap-2 mt-2 text-primary-foreground/70 text-sm hover:text-secondary"
            >
              <ExternalLink size={16} />
              Resources
            </a>
          </div>
        </div>

        {/* ================= FOOTER BOTTOM ================= */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/60">
            <p>
              Developed by{" "}
              <span className="text-accent font-medium">Mohd Anas</span>
            </p>
            <p>
              &copy; {new Date().getFullYear()} SSB Prep AI. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
