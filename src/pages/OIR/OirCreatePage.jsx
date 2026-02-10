import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import Header from "@/components/Header";
import SectionTitle from "@/components/SectionTitle";
import { createOir } from "@/features/oir/oirapi";
import { isAdmin } from "@/config/admin";
import { getErrorMessage } from "@/lib/utils";

const emptyQuestion = {
  questionText: "",
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  correctOption: "",
};

const OirCreatePage = () => {
  const navigate = useNavigate();
  const isUserAdmin = isAdmin();

  if (!isUserAdmin) {
    return <p className="mt-20 text-center">Unauthorized</p>;
  }

  const [questions, setQuestions] = useState([emptyQuestion]);
  const [errorMsg, setErrorMsg] = useState("");

  /* ======================
     CREATE MUTATION
  ====================== */
  const mutation = useMutation({
    mutationFn: createOir,

    onSuccess: () => {
      alert("OIR Test created successfully");
      navigate("/oir/practice");
    },

    onError: (error) => {
      // Use secure error message mapping instead of exposing backend errors
      const message = getErrorMessage(error);
      setErrorMsg(message);
    },
  });

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    if (questions.length === 45) return;
    setQuestions([...questions, emptyQuestion]);
  };

  const removeQuestion = (index) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  /* ======================
     VALIDATION
  ====================== */
  const validateQuestions = () => {
    if (questions.length !== 45) {
      return "OIR test must contain exactly 45 questions";
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];

      if (!q.questionText.trim()) {
        return `Question ${i + 1}: Question text cannot be empty`;
      }

      if (
        !q.optionA.trim() ||
        !q.optionB.trim() ||
        !q.optionC.trim() ||
        !q.optionD.trim()
      ) {
        return `Question ${i + 1}: All options (A, B, C, D) are required`;
      }

      if (!q.correctOption) {
        return `Question ${i + 1}: Select the correct option`;
      }

      if (!q[`option${q.correctOption}`]?.trim()) {
        return `Question ${i + 1}: Correct option cannot be empty`;
      }
    }

    return null;
  };

  /* ======================
     SUBMIT
  ====================== */
  const handleSubmit = () => {
    const validationError = validateQuestions();

    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setErrorMsg("");
    mutation.mutate({ questions });
  };

  return (
    <>
      <Header />

      <main className="pt-24 bg-muted/30 min-h-screen">
        <div className="container mx-auto px-4 max-w-5xl">
          <SectionTitle
            title="Create New OIR Test"
            subtitle="Exactly 45 questions • No empty fields allowed"
            centered
          />

          {/* ERROR MESSAGE */}
          {errorMsg && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-700 p-4 rounded-lg text-sm">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* QUESTION COUNTER */}
          <div className="mb-4 text-sm text-muted-foreground">
            Questions added:{" "}
            <b
              className={
                questions.length === 45 ? "text-green-600" : "text-red-600"
              }
            >
              {questions.length} / 45
            </b>
          </div>

          {/* QUESTIONS */}
          {questions.map((q, index) => (
            <div key={index} className="bg-white rounded-xl shadow p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Question {index + 1}</h3>

                <button
                  onClick={() => removeQuestion(index)}
                  className="text-sm text-red-600"
                >
                  Remove
                </button>
              </div>

              <textarea
                placeholder="Question text"
                value={q.questionText}
                onChange={(e) =>
                  updateQuestion(index, "questionText", e.target.value)
                }
                className="w-full border rounded p-2 mb-3"
              />

              {["A", "B", "C", "D"].map((opt) => (
                <input
                  key={opt}
                  placeholder={`Option ${opt}`}
                  value={q[`option${opt}`]}
                  onChange={(e) =>
                    updateQuestion(index, `option${opt}`, e.target.value)
                  }
                  className="w-full border rounded p-2 mb-2"
                />
              ))}

              <select
                value={q.correctOption}
                onChange={(e) =>
                  updateQuestion(index, "correctOption", e.target.value)
                }
                className="border rounded p-2 mt-2"
              >
                <option value="">Correct Option</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>
          ))}

          {/* ACTIONS */}
          <div className="flex gap-4 justify-between">
            <button
              onClick={addQuestion}
              disabled={questions.length === 45}
              className="px-6 py-2 border rounded-md disabled:opacity-50"
            >
              + Add Question
            </button>

            <button
              onClick={handleSubmit}
              disabled={mutation.isLoading}
              className="px-8 py-2 bg-primary text-white rounded-md disabled:opacity-60"
            >
              {mutation.isLoading ? "Creating..." : "Create Test"}
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default OirCreatePage;
