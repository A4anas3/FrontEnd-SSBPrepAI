import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useOirTestDetail } from "@/hooks/oir/useOir";
import { deleteOir } from "@/features/oir/oirapi";
import { isAdmin } from "@/config/admin";
import { useAuth } from "@/lib/AuthContext";

import Header from "@/components/Header";
import ConfirmAlert from "@/components/ConfirmAlert";

const TEST_DURATION = 20 * 60;

const OirTestPage = () => {
  const { user } = useAuth();
  // ✅ compute admin ONCE
  const isUserAdmin = isAdmin(user);

  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useOirTestDetail(id);

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);
  const [score, setScore] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [testEnded, setTestEnded] = useState(false);

  /* 🔐 DELETE CONFIRM STATE */
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (testEnded) return;

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, testEnded]);

  /* ================= DELETE MUTATION ================= */
  const deleteMutation = useMutation({
    mutationFn: deleteOir,
    onSuccess: () => {
      queryClient.invalidateQueries(["oir"]);
      navigate("/oir/practice");
    },
  });

  if (isLoading) {
    return <p className="text-center mt-32">Loading test...</p>;
  }

  const questions = data.questions;
  const question = questions[currentQ];

  /* ================= HELPERS ================= */

  const formatTime = () => {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  const handleAnswer = (option) => {
    if (answers[question.questionId] || testEnded) return;

    setAnswers({
      ...answers,
      [question.questionId]: option,
    });
  };

  const handleSubmit = () => {
    let correct = 0;

    questions.forEach((q) => {
      if (answers[q.questionId] === q.correctOption) correct++;
    });

    setScore(correct);
    setTestEnded(true);
    setShowSubmitModal(true);
  };

  const attempted = Object.keys(answers).length;
  const total = data.totalQuestions;
  const unattempted = total - attempted;

  return (
    <>
      <Header />

      {/* ================= EXAM BAR ================= */}
      <div className="mt-25 mb-0 pb-2 mx-6 bg-white border rounded-lg px-6 py-3 flex justify-between items-center shadow-sm">
        <h2 className="font-semibold text-lg">Practice – {data.testName}</h2>

        <div className="flex items-center gap-4">
          <span className="font-bold text-red-600">⏱ {formatTime()}</span>

          {/* ✅ ADMIN CONTROLS */}
          {isUserAdmin && (
            <>
              <button
                onClick={() => navigate(`/oir/admin/edit/${id}`)}
                className="px-4 py-1 border border-blue-600 text-blue-600 rounded-md text-sm"
              >
                Edit
              </button>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-1 border border-red-600 text-red-600 rounded-md text-sm"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex min-h-screen bg-muted/30 pt-6">
        {/* ================= LEFT ================= */}
        <div className="w-[70%] p-6 border-r">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white font-bold">
                {currentQ + 1}
              </div>
              <p className="text-sm text-muted-foreground">
                Question {currentQ + 1} of {total}
              </p>
            </div>

            <h3 className="text-lg font-semibold mb-6">
              {question.questionText}
            </h3>

            {["A", "B", "C", "D"].map((opt) => {
              const value = question[`option${opt}`];
              const selected = answers[question.questionId];
              const isCorrect = question.correctOption === opt;

              let color =
                selected === opt && isCorrect
                  ? "border-green-500 bg-green-100"
                  : selected === opt && !isCorrect
                    ? "border-red-500 bg-red-100"
                    : "border-gray-300 hover:bg-gray-50";

              return (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  className={`block w-full text-left mb-3 p-4 border rounded-lg ${color}`}
                >
                  <b>{opt}.</b> {value}
                </button>
              );
            })}

            <div className="flex justify-end mt-6">
              <button
                onClick={() =>
                  setCurrentQ((q) => Math.min(q + 1, questions.length - 1))
                }
                disabled={currentQ === questions.length - 1}
                className="px-6 py-2 bg-primary text-white rounded-md disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="w-[30%] p-6">
          <h4 className="font-semibold mb-4">Questions</h4>

          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, index) => (
              <button
                key={q.questionId}
                onClick={() => setCurrentQ(index)}
                className={`w-10 h-10 rounded-md font-semibold
                  ${currentQ === index
                    ? "bg-blue-600 text-white"
                    : answers[q.questionId]
                      ? answers[q.questionId] === q.correctOption
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                      : "bg-gray-200"
                  }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className="mt-6 w-full bg-red-600 text-white py-3 rounded-lg font-semibold"
          >
            Submit Test
          </button>
        </div>
      </div>

      {/* ================= RESULT MODAL ================= */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-8 w-[90%] max-w-md shadow-lg">
            <h3 className="text-xl font-bold text-center mb-6">Test Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Total Questions</span>
                <b>{total}</b>
              </div>
              <div className="flex justify-between">
                <span>Attempted</span>
                <b>{attempted}</b>
              </div>
              <div className="flex justify-between">
                <span>Unattempted</span>
                <b>{unattempted}</b>
              </div>
              <div className="flex justify-between">
                <span>Correct</span>
                <b className="text-green-600">{score}</b>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-green-600 text-white py-2 rounded-md"
              >
                Restart
              </button>

              <button
                onClick={() => navigate("/oir/practice")}
                className="flex-1 bg-gray-700 text-white py-2 rounded-md"
              >
                Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRM ALERT ================= */}
      {isUserAdmin && (
        <ConfirmAlert
          show={showDeleteConfirm}
          title="Delete OIR Test"
          message="This will permanently delete the test and all its questions."
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={() => deleteMutation.mutate(id)}
        />
      )}
    </>
  );
};

export default OirTestPage;
