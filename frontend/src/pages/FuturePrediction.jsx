import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import vector from "../assets/Aboutusimg/Vector.png";
import InviteFriend from "../components/InviteFriend";
import Wheel from "../assets/Aboutusimg/Wheel.png";
import { useNavigate, useParams } from "react-router-dom";
import ComingSoon from "../components/ComingSoon";
import Login from "../components/Login";
const CREDIT_OPTIONS = ["credit1", "credit2", "credit3", "customizedQuestion"];

const FuturePrediction = () => {
  const { t } = useTranslation();
  const { title } = useParams();
  const navigate = useNavigate();
  const [selectedCredit, setSelectedCredit] = useState("credit1");
  const [showLogin, setShowLogin] = useState(false);
  useEffect(() => {
    if (title) {
      setSelectedCredit(title);
    }
  }, [title]);
  const questions = t(`futurePrediction.questions.${selectedCredit}`, {
    returnObjects: true,
  });

  return (
    <div className="font-poppins mt-10">
      <div className="flex flex-col gap-6 p-3 md:p-6 justify-center items-center bg-[#F5D6C7] m-3 md:m-6 rounded-2xl">
        <img src={vector} className="" />
        <h1 className="p-3 border rounded-2xl text-xs md:text-xl">
          <span className="text-white bg-primary rounded-full text-sm md:text-xl px-2 py-1  md:px-4 md:py-2">
            New
          </span>{" "}
          {t("aboutus.badge")}
        </h1>
        <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-black text-center p-3">
          {t("futurePrediction.pageTitle")}
        </h1>
        <h1 className="text-xs md:text-sm lg:text-sm font-semibold md:w-3/4 text-black text-center p-3">
          {t("futurePrediction.subtitle")}
        </h1>
        <button
          onClick={() => setShowLogin(true)}
          className="bg-primary text-white px-8 py-3 rounded-lg font-semibold flex items-center mx-auto hover:opacity-90 transition-opacity"
        >
          {t("futurePrediction.login")}
        </button>
        <Login isOpen={showLogin} onClose={() => setShowLogin(false)} />
      </div>

      {/* Section 3: Credit/Question Selection Tabs */}
      <section className="px-4 md:px-8 py-6">
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          {CREDIT_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => {
                setSelectedCredit(option);
                navigate(`/future-prediction/${option}`);
              }}
              className={`min-w-[140px] md:min-w-[180px] px-6 py-3 rounded-xl font-semibold text-sm md:text-base transition-all ${
                selectedCredit === option
                  ? "bg-primary text-white border-2 border-primary"
                  : "bg-white text-primary border-2 border-primary hover:bg-primary/5"
              }`}
            >
              {t(`futurePrediction.${option}`)}
            </button>
          ))}
        </div>
      </section>

      {/* Section 4: Prediction Questions List */}
      <section className="px-4 md:px-8 pb-16 max-w-3xl mx-auto">
        <div className="flex flex-col gap-4">
          {Array.isArray(questions) &&
          selectedCredit !== "customizedQuestion" ? (
            questions.map((question, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 md:p-5 bg-white rounded-2xl shadow-sm border border-primary hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setShowLogin(true)}
              >
                <p className="text-black text-sm md:text-base flex-1 font-bold">
                  {question}
                </p>
                <button className="shrink-0 w-full sm:w-auto px-6 py-3 rounded-xl bg-[#F5D6C7] text-primary border border-primary font-bold text-sm hover:opacity-90 transition-opacity">
                  {selectedCredit === "credit1"
                    ? t("futurePrediction.credit1")
                    : selectedCredit === "credit2"
                      ? t("futurePrediction.credit2")
                      : t("futurePrediction.credit3")}
                </button>
              </div>
            ))
          ) : (
            <ComingSoon />
          )}
        </div>
      </section>
      <div
        style={{ backgroundImage: `url(${Wheel})` }}
        className="w-full md:min-h-screen   bg-contain bg-right bg-no-repeat mt-10 justify-center items-center flex"
      >
        <InviteFriend />
      </div>
    </div>
  );
};

export default FuturePrediction;
