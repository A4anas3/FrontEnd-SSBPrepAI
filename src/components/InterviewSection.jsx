import { MessageSquare, ChevronRight } from "lucide-react";
import piImage from "@/assets/card-pi.jpg";
import { Link } from "react-router-dom";
const InterviewSection = () => {
  return (
    <section id="interview" className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/pi"
            className="block bg-primary rounded-2xl overflow-hidden card-hover cursor-pointer"
          >
            {/* Image */}
            <div className="relative">
              <img
                src={piImage}
                alt="Personal Interview"
                className="w-full h-56 lg:h-72 object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-linear-to-t from-primary via-primary/50 to-transparent" />

              {/* Icon Badge */}
              <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                <MessageSquare size={24} className="text-primary" />
              </div>
            </div>

            {/* Content */}
            <div className="p-8 lg:p-10 text-center">
              <h3 className="text-2xl lg:text-3xl font-display font-bold text-primary-foreground mb-4">
                Personal Interview (Q&A)
              </h3>
              <p className="text-primary-foreground/80 leading-relaxed max-w-xl mx-auto mb-6">
                Face-to-face interaction with the Interviewing Officer. Prepare
                for questions about your life, achievements, current affairs,
                and aspirations to serve the nation.
              </p>
              <div className="inline-flex items-center gap-2 text-accent font-medium">
                Start Practicing
                <ChevronRight size={18} />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default InterviewSection;
