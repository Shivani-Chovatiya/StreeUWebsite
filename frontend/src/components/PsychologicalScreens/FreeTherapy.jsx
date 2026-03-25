import React, { useState, useEffect } from "react";
import vector from "../../assets/Aboutusimg/Vector.png";
import { useTranslation } from "react-i18next";
import Wheel from "../../assets/Aboutusimg/Wheel.png";
import InviteFriend from "../../components/InviteFriend";
import { AiOutlineClose } from "react-icons/ai";
import { HiOutlineCalendar } from "react-icons/hi";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../../config/firebase";

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
  const [therapyTips, setTherapyTips] = useState([]);

  const fetchTips = async () => {
    try {
      const q = query(
        collection(db, "therapyTips"),
        where("status", "==", "Active"),
        orderBy("createdAt", "asc"),
      );

      const querySnapshot = await getDocs(q);

      const tips = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTherapyTips(tips);
    } catch (error) {
      console.error("Error fetching tips:", error);
    }
  };
  useEffect(() => {
    fetchTips();
  }, []);
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setModalTopic(null);
    };
    if (modalTopic) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [modalTopic]);

  return (
    // <div className="font-poppins mt-10">
    //   <div className="flex flex-col gap-6 p-3 md:p-6 justify-center items-center">
    //     <img src={vector} className="" alt="" />
    //     <h1 className="p-3 border rounded-2xl text-sm md:text-xl">
    //       <span className="text-white bg-primary rounded-full text-sm md:text-xl px-2 py-1 md:px-4 md:py-2">
    //         New
    //       </span>{" "}
    //       {t("aboutus.badge")}
    //     </h1>
    //     <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-black text-center p-3">
    //       {t("psychology.freeTipsTitle")}
    //     </h1>
    //     <h1 className="text-xs md:text-sm font-semibold md:w-3/4 text-black text-center p-3">
    //       {t("psychology.freeTipsDesc")}
    //     </h1>
    //   </div>

    //   {/* View Tips Modal */}
    //   {modalTopic ? (
    //     <div className="flex  items-center justify-center p-4">
    //       <div
    //         className=" w-full max-w-2xl    flex flex-col"
    //         onClick={(e) => e.stopPropagation()}
    //       >
    //         <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-100">
    //           <h3 className="text-lg md:text-xl font-bold text-gray-900">
    //             {modalTopic?.title}
    //           </h3>
    //         </div>
    //         {/* <div className="p-4 md:p-6  flex-1">
    //           <p className="text-black text-sm md:text-base leading-relaxed whitespace-pre-line">
    //             {t(`psychology.tipsContent.${modalTopic}`)}
    //           </p>
    //         </div> */}
    //         <div className="p-4 md:p-6 flex-1 overflow-y-auto max-h-[60vh]">
    //           <div
    //             className="text-black text-sm md:text-sm leading-relaxed"
    //             dangerouslySetInnerHTML={{ __html: modalTopic?.description }}
    //           />
    //         </div>
    //         <button
    //           onClick={() => setModalTopic(null)}
    //           className="w-full mt-10 bg-primary hover:bg-orange-700 text-white py-3 rounded-full text-lg transition"
    //         >
    //           Close
    //         </button>
    //       </div>
    //     </div>
    //   ) : (
    //     <div className="px-4 md:px-8 py-6 max-w-7xl mx-auto">
    //       <div className="flex flex-col lg:flex-row gap-8">
    //         {/* Free Therapy Tips Grid */}
    //         <div className="flex-1">
    //           <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
    //             {therapyTips.map((topic) => (
    //               <div
    //                 key={topic}
    //                 className="flex items-center justify-between gap-3 p-4 bg-[#F9F9F9] rounded-xl border border-primary shadow-sm hover:shadow-md transition-shadow"
    //               >
    //                 <span className="text-black font-medium text-sm md:text-base flex-1 min-w-0">
    //                   {topic.title}
    //                 </span>
    //                 <button
    //                   onClick={() => setModalTopic(topic)}
    //                   className="shrink-0 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity"
    //                 >
    //                   {t("psychology.viewTips")}
    //                 </button>
    //               </div>
    //             ))}
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   )}max-w-7xl
    <div className="font-poppins ">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-100 py-16 md:py-20">
        {/* Decorative Blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-blob pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-300/5 rounded-full blur-3xl animate-blob animation-delay-2000 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col gap-6 px-4 md:px-6 justify-center items-center max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-black text-center animate-slide-up">
            {t("psychology.freeTipsTitle")}
          </h1>

          <p className="text-sm md:text-sm lg:text-sm max-w-3xl text-black font-semibold text-center animate-slide-up-delay">
            {t("psychology.freeTipsDesc")}
          </p>
        </div>
      </div>

      {/* View Tips Modal */}
      {modalTopic ? (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div
            className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary/10 to-orange-50 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                  {modalTopic?.title}
                </h3>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setModalTopic(null)}
                className="w-10 h-10 bg-gray-100 hover:bg-red-100 rounded-full flex items-center justify-center transition-colors duration-300 group"
              >
                <svg
                  className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 flex-1 overflow-y-auto">
              <div
                className="prose prose-sm md:prose-base max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: modalTopic?.description }}
              />
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setModalTopic(null)}
                className="w-full group relative bg-primary hover:bg-primary/90 text-white font-bold py-3 md:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                <span className="relative flex items-center justify-center gap-2">
                  Close
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className=" p-3 md:p-6">
          {/* Tips Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {therapyTips.map((topic, index) => (
              // <div
              //   key={topic.id || index}
              //   className="group relative bg-gradient-to-br from-white to-orange-50 rounded-2xl border-2 border-primary/30 p-5 md:p-6 shadow-md hover:shadow-2xl hover:border-primary transition-all duration-300 hover:scale-105 animate-scale-in"
              //   style={{
              //     animationDelay: `${index * 0.1}s`,
              //     animationFillMode: "backwards",
              //   }}
              // >
              //   {/* Shimmer Effect */}
              //   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl"></div>

              //   {/* Content */}
              //   <div className="relative z-10 flex items-start gap-4">
              //     {/* Icon */}
              //     <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
              //       <svg
              //         className="w-6 h-6 text-primary group-hover:text-white transition-colors"
              //         fill="currentColor"
              //         viewBox="0 0 20 20"
              //       >
              //         <path
              //           fillRule="evenodd"
              //           d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              //           clipRule="evenodd"
              //         />
              //       </svg>
              //     </div>

              //     {/* Text & Button */}
              //     <div className="flex-1 min-w-0">
              //       <h3 className="text-gray-900 font-bold text-sm md:text-base mb-3 leading-snug">
              //         {topic.title}
              //       </h3>

              //       <button
              //         onClick={(e) => {
              //           e.stopPropagation();
              //           setModalTopic(topic);
              //         }}
              //         className="group/btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
              //       >
              //         {t("psychology.viewTips")}
              //         <svg
              //           className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform"
              //           fill="none"
              //           stroke="currentColor"
              //           viewBox="0 0 24 24"
              //         >
              //           <path
              //             strokeLinecap="round"
              //             strokeLinejoin="round"
              //             strokeWidth={2}
              //             d="M9 5l7 7-7 7"
              //           />
              //         </svg>
              //       </button>
              //     </div>
              //   </div>

              //   {/* Number Badge (Optional) */}
              //   <div className="absolute top-4 right-4 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm group-hover:bg-primary group-hover:text-white transition-all duration-300">
              //     {index + 1}
              //   </div>
              // </div>
              <div
                key={topic.id || index}
                onClick={() => setModalTopic(topic)}
                className="group relative bg-gradient-to-br from-white to-orange-50 rounded-2xl border-2 border-primary/30 p-5 md:p-6 shadow-md hover:shadow-2xl hover:border-primary transition-all duration-300 cursor-pointer animate-scale-in"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: "backwards", // ← ADD THIS
                }}
              >
                {/* Shimmer Effect - FIX: Add pointer-events-none */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl pointer-events-none"></div>

                {/* Content */}
                <div className="relative z-10 flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-all duration-300">
                    <svg
                      className="w-6 h-6 text-primary group-hover:text-white transition-colors"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>

                  {/* Text & Button */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-gray-900 font-bold text-sm md:text-base mb-3 leading-snug">
                      {topic.title}
                    </h3>

                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // ← ADD THIS to prevent double trigger
                        setModalTopic(topic);
                      }}
                      className="group/btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      {t("psychology.viewTips")}
                      <svg
                        className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Number Badge */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm group-hover:bg-primary group-hover:text-white transition-all duration-300 pointer-events-none">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {therapyTips.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              <div className="inline-flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">
                  No tips available at the moment
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <div
        // style={{ backgroundImage: `url(${Wheel})` }}md:min-h-screen
        className="w-full  bg-contain bg-right bg-no-repeat mt-10 justify-center items-center flex"
      >
        <InviteFriend />
      </div>
    </div>
  );
};

export default FreeTherapy;
