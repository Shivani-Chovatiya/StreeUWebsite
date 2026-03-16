// components/QuestionAccordion.jsx
import { useState, useRef } from "react";
import { AiOutlineDown, AiOutlineLock } from "react-icons/ai";
import Swal from "sweetalert2";

export default function QuestionAccordion({
  q,
  index,
  isLoggedIn,
  userData,
  questionCreditCost,
  selectedCredit,
  setShowLogin,
  t,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  const creditLabel =
    selectedCredit === "credit1"
      ? t("futurePrediction.credit1")
      : selectedCredit === "credit2"
        ? t("futurePrediction.credit2")
        : t("futurePrediction.credit3");

  const handleToggle = () => {
    if (!isLoggedIn) {
      setShowLogin(true);
      return;
    }

    if (!userData?.credits || userData.credits < questionCreditCost) {
      Swal.fire({
        title: "Insufficient Credits",
        text: "You don't have enough credits. Please recharge your credits.",
        icon: "warning",
        confirmButtonText: "Recharge Now",
        confirmButtonColor: "#D04500",
        showCancelButton: true,
        cancelButtonText: "Cancel",
      });
      return;
    }

    setIsOpen((prev) => !prev);
  };

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
          <span className=" px-3 py-1.5 rounded-xl bg-[#F5D6C7] text-primary border border-primary font-bold text-xs">
            {creditLabel}
          </span>

          {!isLoggedIn ? (
            <AiOutlineLock className="text-primary text-lg" />
          ) : (
            <AiOutlineDown
              className={`text-primary text-base transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
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
              <p className="text-gray-500 text-sm md:text-base leading-relaxed italic">
                {q.answer ?? "—"}
              </p>
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
