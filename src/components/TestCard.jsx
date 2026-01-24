import { Link } from "react-router-dom";
import { Trash2, Pencil } from "lucide-react";

const TestCard = ({
  title,
  description,
  image,
  icon: Icon,
  href = "/",
  variant = "default",

  // ✅ Admin props
  showDelete = false,
  onDelete,

  showEdit = false,
  onEdit,
  blurImage = false,

  // ✅ Size control
  size = "normal", // "small" | "normal"
}) => {
  const isNavy = variant === "navy";

  // ✅ Dynamic styles based on size
  const imageHeight = size === "small" ? "h-32" : "h-48";
  const padding = size === "small" ? "p-4" : "p-6";
  const titleSize = size === "small" ? "text-lg" : "text-xl";
  const descSize = size === "small" ? "text-xs" : "text-sm";

  return (
    <div className="relative group">
      {/* ✏️ Edit Icon (Admin Only) */}
      {showEdit && onEdit && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onEdit();
          }}
          className="absolute top-2 left-2 z-20 bg-blue-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition"
        >
          <Pencil size={16} />
        </button>
      )}

      {/* 🗑️ Delete Icon (Admin Only) */}
      {showDelete && onDelete && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-2 right-2 z-20 bg-red-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition"
        >
          <Trash2 size={16} />
        </button>
      )}

      <Link
        to={href}
        className={`block rounded-xl overflow-hidden card-hover cursor-pointer transition-all duration-200 ${
          isNavy
            ? "bg-primary text-primary-foreground"
            : "bg-card border border-sky-border hover:shadow-lg"
        }`}
      >
        {/* ✅ Image */}
        <div className="relative overflow-hidden sky-overlay">
          <img
            src={image}
            alt={title}
            className={`w-full ${imageHeight} object-cover ${blurImage ? "blur-sm" : ""}`}
          />

          {/* ✅ Optional Icon */}
          {Icon && (
            <div
              className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center ${
                isNavy ? "bg-accent" : "bg-accent/90"
              }`}
            >
              <Icon size={18} className="text-primary" />
            </div>
          )}
        </div>

        {/* ✅ Content */}
        <div className={padding}>
          <h3
            className={`${titleSize} font-display font-semibold mb-1 ${
              isNavy ? "text-primary-foreground" : "text-primary"
            }`}
          >
            {title}
          </h3>

          <p
            className={`${descSize} leading-relaxed ${
              isNavy ? "text-primary-foreground/80" : "text-muted-foreground"
            }`}
          >
            {description}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default TestCard;
