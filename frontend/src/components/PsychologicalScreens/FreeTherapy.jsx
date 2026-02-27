import React, { useState, useEffect } from "react";
import vector from "../../assets/Aboutusimg/Vector.png";
import { useTranslation } from "react-i18next";
import Wheel from "../../assets/Aboutusimg/Wheel.png";
import InviteFriend from "../../components/InviteFriend";
import { AiOutlineClose } from "react-icons/ai";
import { HiOutlineCalendar } from "react-icons/hi";

const THERAPY_TOPICS = [
  "anxiety",
  "depression",
  "learningDelays",
  "addiction",
  "emotionalAbuseTrauma",
  "dementia",
  "behavioralChallenges",
  "developmentalDelays",
  "relationshipIssues",
  "fearsPhobias",
  "autism",
  "impairments",
  "adhd",
  "ocd",
  "intellectualIssues",
  "personalityDisorders",
  "parenting",
  "ptsd",
  "selfEsteem",
  "sld",
  "socialAnxiety",
];

const FreeTherapy = () => {
  const { t } = useTranslation();
  const [modalTopic, setModalTopic] = useState(null);
  const therapistTags = t("psychology.therapistTags", { returnObjects: true });

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setModalTopic(null);
    };
    if (modalTopic) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [modalTopic]);

  return (
    <div className="font-poppins mt-10">
      <div className="flex flex-col gap-6 p-3 md:p-6 justify-center items-center">
        <img src={vector} className="" alt="" />
        <h1 className="p-3 border rounded-2xl text-sm md:text-xl">
          <span className="text-white bg-primary rounded-full text-sm md:text-xl px-2 py-1 md:px-4 md:py-2">
            New
          </span>{" "}
          {t("aboutus.badge")}
        </h1>
        <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-black text-center p-3">
          {t("psychology.freeTipsTitle")}
        </h1>
        <h1 className="text-xs md:text-sm font-semibold md:w-3/4 text-black text-center p-3">
          {t("psychology.freeTipsDesc")}
        </h1>
      </div>

      {/* View Tips Modal */}
      {modalTopic ? (
        <div className="flex  items-center justify-center p-4">
          <div
            className=" w-full max-w-2xl    flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-100">
              <h3 className="text-lg md:text-xl font-bold text-gray-900">
                {t(`psychology.topics.${modalTopic}`)}
              </h3>
            </div>
            <div className="p-4 md:p-6  flex-1">
              <p className="text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-line">
                {t(`psychology.tipsContent.${modalTopic}`)}
              </p>
            </div>
            <button
              onClick={() => setModalTopic(null)}
              className="w-full mt-10 bg-primary hover:bg-orange-700 text-white py-3 rounded-full text-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <div className="px-4 md:px-8 py-6 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Free Therapy Tips Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-3 md:gap-4">
                {THERAPY_TOPICS.map((topic) => (
                  <div
                    key={topic}
                    className="flex items-center justify-between gap-3 p-4 bg-[#F9F9F9] rounded-xl border border-primary shadow-sm hover:shadow-md transition-shadow"
                  >
                    <span className="text-black font-medium text-sm md:text-base flex-1 min-w-0">
                      {t(`psychology.topics.${topic}`)}
                    </span>
                    <button
                      onClick={() => setModalTopic(topic)}
                      className="shrink-0 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      {t("psychology.viewTips")}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        style={{ backgroundImage: `url(${Wheel})` }}
        className="w-full md:min-h-screen bg-contain bg-right bg-no-repeat mt-10 justify-center items-center flex"
      >
        <InviteFriend />
      </div>
    </div>
  );
};

export default FreeTherapy;
