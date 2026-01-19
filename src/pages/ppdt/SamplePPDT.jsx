import Header from "@/components/Header";
import { useSamplePPDT } from "@/hooks/useSamplePPDT";

/* =========================
   LOADING COMPONENT
   ========================= */
const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-32">
      <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600 font-medium">Loading sample PPDT...</p>
    </div>
  );
};

/* =========================
   REUSABLE SECTION COMPONENT
   ========================= */
const Section = ({ title, children, highlight, success }) => {
  let bg = "";
  if (highlight) bg = "bg-yellow-50";
  if (success) bg = "bg-green-50";

  return (
    <div className={`mb-4 p-4 rounded-xl ${bg}`}>
      <h3 className="font-semibold mb-1">{title}</h3>
      <div className="text-gray-700 whitespace-pre-line">{children}</div>
    </div>
  );
};

const SamplePPDT = () => {
  const { data, isLoading, isError } = useSamplePPDT();

  /* ================= LOADING ================= */
  if (isLoading) {
    return (
      <section className="pt-24">
        <Header />
        <LoadingSpinner />
      </section>
    );
  }

  /* ================= ERROR ================= */
  if (isError || !data || data.length === 0) {
    return (
      <section className="pt-24">
        <Header />
        <div className="text-center py-32 text-red-500 font-medium">
          Failed to load sample PPDT
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 pt-24 bg-background">
      <Header />

      <div className="container mx-auto px-4 max-w-4xl">
        {/* ================= PAGE TITLE ================= */}
        <h1 className="text-3xl font-bold text-navy mb-4">
          Sample Stories for PPDT
        </h1>

        {/* ================= TIPS ================= */}
        <div className="bg-blue-50 p-4 rounded-xl mb-10">
          <h3 className="font-semibold mb-2">Tips to write a PPDT story</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>Observe number of characters, age, gender, and mood</li>
            <li>Identify the problem or situation shown in the picture</li>
            <li>Follow a clear Past → Present → Future sequence</li>
            <li>Show leadership, initiative, and responsibility</li>
            <li>End the story with a positive and realistic outcome</li>
          </ul>
        </div>

        {/* ================= ALL SAMPLES ================= */}
        {data.map((ppdt, index) => (
          <div key={ppdt.id} className="mb-16">
            <h2 className="text-2xl font-semibold mb-4">
              Sample PPDT {index + 1}
            </h2>

            {/* IMAGE */}
            <div className="flex justify-center mb-6">
              <img
                src={ppdt.imageUrl}
                alt={`Sample PPDT ${index + 1}`}
                className="w-full max-w-md rounded-2xl"
              />
            </div>

            <Section title="Image Context">{ppdt.imageContext}</Section>

            <Section title="Guide" highlight>
              {ppdt.guide}
            </Section>

            <Section title="Action Taken">{ppdt.action}</Section>

            <Section title="Observations">
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Number of characters:</strong> 2
                </li>
                <li>
                  <strong>Age:</strong> 20–25 years
                </li>
                <li>
                  <strong>Gender:</strong> Male
                </li>
                <li>
                  <strong>Mood:</strong> Serious, focused, responsible
                </li>
              </ul>
            </Section>

            <Section title="Sample Story" success>
              {ppdt.sampleStory}
            </Section>

            <hr className="my-10 border-gray-300" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default SamplePPDT;
