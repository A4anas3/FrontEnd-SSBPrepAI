import Header from "@/components/Header";
import { useState } from "react";
import { usePPDTTestImages, useSubmitPPDT } from "@/hooks/usePPDTTest";

const PPDTTest = () => {
  const { data: images, isLoading } = usePPDTTestImages();
  const submitMutation = useSubmitPPDT();

  const [selectedImage, setSelectedImage] = useState(null);
  const [storyText, setStoryText] = useState("");
  const [action, setAction] = useState("");

  if (isLoading) {
    return <div className="py-32 text-center">Loading images...</div>;
  }

  return (
    <section className="pt-24 py-10">
      <Header />

      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="text-3xl font-bold mb-6">PPDT Practice Test</h1>

        {/* IMAGES */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {images.map((img) => (
            <img
              key={img.id}
              src={img.imageUrl}
              alt="PPDT"
              onClick={() => setSelectedImage(img)}
              className={`cursor-pointer rounded-lg border-4 ${
                selectedImage?.id === img.id
                  ? "border-blue-600"
                  : "border-transparent"
              }`}
            />
          ))}
        </div>

        {/* STORY */}
        <textarea
          className="w-full border p-3 rounded mb-4"
          placeholder="Write PPDT story..."
          value={storyText}
          onChange={(e) => setStoryText(e.target.value)}
        />

        {/* ACTION */}
        <textarea
          className="w-full border p-3 rounded mb-6"
          placeholder="Action taken..."
          value={action}
          onChange={(e) => setAction(e.target.value)}
        />

        {/* SUBMIT */}
        <button
          onClick={() =>
            submitMutation.mutate({
              imageId: selectedImage.id,
              storyText,
              action,
            })
          }
          disabled={submitMutation.isPending}
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          {submitMutation.isPending ? "Submitting..." : "Submit PPDT"}
        </button>

        {/* RESULT */}
        {submitMutation.data && (
          <pre className="mt-6 bg-gray-100 p-4 rounded">
            {JSON.stringify(submitMutation.data, null, 2)}
          </pre>
        )}
      </div>
    </section>
  );
};

export default PPDTTest;
