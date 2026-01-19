// src/components/LoadingSpinner.jsx
const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="relative h-24 w-24 flex items-center justify-center">
        {/* Rotating Circle */}
        <div className="absolute inset-0 rounded-full border-4 border-navy border-t-transparent animate-spin"></div>

        {/* Logo from public */}
        <img
          src="/logo.png"
          alt="Loading"
          className="h-12 w-12 object-contain"
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;
