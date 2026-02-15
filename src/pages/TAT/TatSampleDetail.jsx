import Header from "@/components/Header";
import { toSecureUrl } from "@/lib/utils";
import { useParams } from "react-router-dom";
import { useTatSample } from "@/hooks/tat/useTat";
import { useState } from "react";

const TatSampleDetail = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useTatSample(id);

  const [activeIndex, setActiveIndex] = useState(0);

  if (isLoading) return <p className="text-center mt-20">Loading sample...</p>;

  if (error || !data)
    return (
      <p className="text-center mt-20 text-red-500">
        Failed to load TAT sample
      </p>
    );

  const images = data?.images || [];

  if (images.length === 0) {
    return (
      <p className="text-center mt-20 text-gray-500">
        No images found for this sample.
      </p>
    );
  }

  const activeImage = images[activeIndex];

  if (!activeImage) return null;

  return (
    <>
      <Header />

      <main className="pt-24 min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 grid grid-cols-12 gap-6">
          {/* 🔹 LEFT SIDE – Image List */}
          <aside className="col-span-12 md:col-span-3 bg-background rounded-xl p-4 h-64 md:h-[80vh] overflow-y-auto shadow-sm">
            <h3 className="font-semibold mb-4 text-center">Pictures</h3>

            <div className="space-y-3">
              {images.map((img, index) => (
                <button
                  key={img.id || index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-full border rounded-lg overflow-hidden transition relative text-left
                    ${index === activeIndex
                      ? "ring-2 ring-primary"
                      : "hover:ring-1 hover:ring-primary/50"
                    }
                  `}
                >
                  <div className="absolute top-0 left-0 bg-black/60 text-white text-xs px-2 py-1 rounded-br-lg font-medium backdrop-blur-sm z-10">
                    #{index + 1}
                  </div>
                  <img
                    src={toSecureUrl(img.imageUrl)}
                    alt={`TAT ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          </aside>

          {/* 🔹 RIGHT SIDE – Image + Story */}
          <section className="col-span-12 md:col-span-9">
            <div className="bg-background rounded-xl shadow-sm overflow-hidden">
              {/* Image */}
              <img
                src={toSecureUrl(activeImage.imageUrl)}
                alt="TAT Sample"
                className="w-full h-auto max-h-64 md:max-h-[500px] object-contain mx-auto bg-gray-50"
              />

              {/* Content */}
              <div className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">
                  Picture {activeIndex + 1}
                </h2>

                {activeImage.imageContext && (
                  <div>
                    <h4 className="font-medium text-muted-foreground">
                      Context
                    </h4>
                    <p className="text-sm">{activeImage.imageContext}</p>
                  </div>
                )}

                {activeImage.expectedTheme && (
                  <div>
                    <h4 className="font-medium text-muted-foreground">
                      Expected Theme
                    </h4>
                    <p className="text-sm">{activeImage.expectedTheme}</p>
                  </div>
                )}

                {activeImage.story && (
                  <div>
                    <h4 className="font-medium text-muted-foreground">
                      Model Story
                    </h4>

                    <p className="text-sm leading-relaxed mb-4">
                      {activeImage.story}
                    </p>

                    {/* 🧠 SAMPLE NOTE */}
                    <div className="border-l-4 border-primary bg-muted/40 p-4 rounded-md text-sm text-muted-foreground">
                      <strong>Note:</strong> This story is only a reference to
                      help you understand the flow of thoughts. Do not try to
                      memorise it. In the actual TAT, your story should come
                      naturally from your own perception, personality, and way
                      of thinking.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default TatSampleDetail;
