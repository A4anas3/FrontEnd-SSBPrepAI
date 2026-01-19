import { Link } from "react-router-dom";

const TestCard = ({
  title,
  description,
  image,
  icon: Icon,
  href = "/",
  variant = "default",
}) => {
  const isNavy = variant === "navy";

  return (
    <Link
      to={href}
      className={`block rounded-xl overflow-hidden card-hover cursor-pointer ${
        isNavy
          ? "bg-primary text-primary-foreground"
          : "bg-card border border-sky-border"
      }`}
    >
      {/* Image */}
      <div className="relative overflow-hidden sky-overlay">
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        {Icon && (
          <div
            className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center ${
              isNavy ? "bg-accent" : "bg-accent/90"
            }`}
          >
            <Icon size={20} className="text-primary" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3
          className={`text-xl font-display font-semibold mb-2 ${
            isNavy ? "text-primary-foreground" : "text-primary"
          }`}
        >
          {title}
        </h3>
        <p
          className={`text-sm leading-relaxed ${
            isNavy ? "text-primary-foreground/80" : "text-muted-foreground"
          }`}
        >
          {description}
        </p>
      </div>
    </Link>
  );
};

export default TestCard;
