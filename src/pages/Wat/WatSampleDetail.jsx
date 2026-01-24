import Header from "@/components/Header.jsx";
import SectionTitle from "@/components/SectionTitle.jsx";
import { useParams } from "react-router-dom";
import { useWatTestDetail } from "@/hooks/wat/useWat";
const WatSampleDetail = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useWatTestDetail(id);

  if (isLoading) return <p className="text-center mt-20">Loading...</p>;
  if (error)
    return <p className="text-center mt-20 text-red-500">Error loading test</p>;

  return (
    <section className="py-16 pt-24 bg-background">
      <Header />

      <div className="container mx-auto px-4 max-w-5xl">
        <SectionTitle
          title={data.testName}
          subtitle="Below are the words included in this WAT test."
          centered
        />

        {/* ✅ Table */}
        <div className="overflow-x-auto rounded-xl border border-sky-border shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-sky-500/20 text-primary">
                <th className="px-4 py-3 text-left text-sm font-semibold border-b border-sky-border">
                  No.
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold border-b border-sky-border">
                  Word
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold border-b border-sky-border">
                  Sample Sentence
                </th>
              </tr>
            </thead>

            <tbody>
              {data.words.map((word, index) => (
                <tr
                  key={word.wordNo}
                  className="odd:bg-sky-50/40 even:bg-white hover:bg-sky-100/40 transition"
                >
                  <td className="px-4 py-2 text-sm font-medium text-primary border-b border-sky-border">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2 text-sm font-semibold text-primary border-b border-sky-border">
                    {word.word}
                  </td>
                  <td className="px-4 py-2 text-sm text-muted-foreground border-b border-sky-border">
                    {word.sentence || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ✅ Info Note */}
        <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-700 text-sm">
          💡 Tip: Try to think positively and write short, meaningful sentences
          for each word during the actual test.
        </div>
      </div>
    </section>
  );
};
export default WatSampleDetail;
