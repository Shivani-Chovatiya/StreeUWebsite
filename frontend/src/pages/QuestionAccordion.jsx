// components/QuestionAccordion.jsx
import { useState, useRef } from "react";
import { AiOutlineDown, AiOutlineLock, AiOutlineUnlock } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function QuestionAccordion({
  q,
  index,
  isLoggedIn,
  userData,
  questionCreditCost,
  selectedCredit,
  setShowLogin,
  handleAskQuestion,
  loadingQuestionId,
  t,
  type,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);
  const navigate = useNavigate();
  const creditLabel =
    type === "compatibility"
      ? `${q.credits} Credits`
      : selectedCredit === "credit1"
        ? t("futurePrediction.credit1")
        : selectedCredit === "credit2"
          ? t("futurePrediction.credit2")
          : t("futurePrediction.credit3");

  // const [answer, setAnswer] = useState(q.answer || null);
  const [loading, setLoading] = useState(false);

  const getTime = (ts) => (ts?.seconds ? ts.seconds * 1000 : 0);
  const allAttempts =
    type === "compatibility"
      ? Object.entries(userData?.compatibility || {})
          .filter(([key]) => key.startsWith(q.id))
          .map(([_, value]) => value)
      : Object.entries(userData?.futurePrediction || {})
          .filter(([key]) => key.startsWith(q.id))
          .map(([_, value]) => value);

  const latestAttempt =
    allAttempts.find((a) => a.status === "pending") || // 👈 priority
    allAttempts.sort((a, b) => getTime(b.createdAt) - getTime(a.createdAt))[0];

  const status = latestAttempt?.status;
  const answer = latestAttempt?.answer;

  const isAnyAnswerGenerating =
    type === "compatibility"
      ? Object.values(userData?.compatibility || {}).some(
          (item) => item?.status === "pending",
        )
      : Object.values(userData?.futurePrediction || {}).some(
          (item) => item?.status === "pending",
        );
  const handleToggle = async () => {
    if (!isLoggedIn) {
      setShowLogin(true);
      return;
    }
    if (status === "success" && type !== "compatibility") {
      setIsOpen((prev) => !prev);
      return;
    }

    if (isAnyAnswerGenerating) {
      Swal.fire(
        "Please wait ⏳",
        "Your previous answer is still generating.",
        "info",
      );
      return;
    }

    if (loadingQuestionId === q.id) return;
    setIsOpen(true);
    setLoading(true);
    const result = await handleAskQuestion(q);
    setLoading(false);
    if (!result) return;
    if (type === "compatibility") {
      const { answer } = result;
      await Swal.fire({
        title: "Your Answer is Ready ✨",
        html: `
      <div style="text-align:left; max-height:250px; overflow-y:auto; font-size:14px; line-height:1.6;">
        ${answer || "No answer available"}
      </div>
      <p style="margin-top:10px; font-weight:600;">
        👉 View full details in Profile → My Predictions
      </p>
    `,
        icon: "success",
        confirmButtonText: "Go Now",
        showCancelButton: true,
        cancelButtonText: "Stay Here",
        confirmButtonColor: "#D04500",
        width: "600px",
      }).then((res) => {
        if (res.isConfirmed) {
          navigate("/profile");
        }
      });

      return;
    }
    // setAnswer(result.answer);
    setIsOpen(true);
  };
  const isAnswered = status === "success";
  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        isOpen
          ? "border-primary shadow-md bg-white"
          : "border-primary/40 shadow-sm bg-white hover:shadow-md hover:border-primary"
      }`}
    >
      {/* Question Row */}
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between gap-4 p-4 md:p-5 text-left group"
      >
        {/* index badge + question */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span
            className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 ${
              isOpen
                ? "bg-primary text-white"
                : "bg-[#F5D6C7] text-primary group-hover:bg-primary group-hover:text-white"
            }`}
          >
            {index + 1}
          </span>
          <p className="text-black text-sm md:text-base font-bold leading-snug">
            {q.question}
          </p>
        </div>

        {/* right side: credit pill + arrow */}
        <div className="flex items-center gap-2 shrink-0">
          {isAnswered && type !== "compatibility" ? (
            <AiOutlineUnlock className="text-green-600 text-lg" />
          ) : (
            <span className=" px-3 py-1.5 rounded-xl bg-[#F5D6C7] text-primary border border-primary font-bold text-xs">
              {creditLabel}
            </span>
          )}

          {!isLoggedIn ? (
            <AiOutlineLock className="text-primary text-lg" />
          ) : (
            type !== "compatibility" && (
              <AiOutlineDown
                className={`text-primary text-base transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            )
          )}
        </div>
      </button>

      {/* Answer Panel — smooth accordion */}
      <div
        ref={contentRef}
        style={{
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : "0px",
        }}
        className="transition-[max-height] duration-500 ease-in-out overflow-hidden"
      >
        <div className="px-5 pb-5 pt-1 border-t border-primary/10">
          {/* dummy answer with shimmer placeholder style */}
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
              <span className="text-primary text-xs font-bold">A</span>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wide">
                Answer
              </p>
              {/* Replace "—" with real answer once API is integrated */}
              {/* <p className="text-gray-500 text-sm md:text-base leading-relaxed italic">
                {loading ? "Generating answer..." : answer || "—"}
              </p> */}
              <div className="text-gray-500 text-sm md:text-base leading-relaxed italic">
                {loadingQuestionId === q.id || status === "pending" ? (
                  <div className="w-full">
                    <p className="text-primary font-semibold text-sm mb-2">
                      Generating your answer... please wait (2-3 min)
                    </p>

                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div className="h-full bg-primary animate-pulse w-full"></div>
                    </div>
                  </div>
                ) : status === "failed" || status === "error" ? (
                  <span className="text-red-500 not-italic">
                    ⚠️ No answer generated. Try again.
                  </span>
                ) : status === "success" ? (
                  type !== "compatibility" ? (
                    answer
                  ) : (
                    "-"
                  )
                ) : (
                  "Click to generate answer"
                )}
              </div>
            </div>
          </div>

          {/* mobile credit pill */}
          {/* <div className="mt-4 flex justify-end sm:hidden">
            <span className="px-3 py-1.5 rounded-xl bg-[#F5D6C7] text-primary border border-primary font-bold text-xs">
              {creditLabel}
            </span>
          </div> */}
        </div>
      </div>
    </div>
  );
}
