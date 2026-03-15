import React from "react";
import InviteFriend from "../InviteFriend";
import vector from "../../assets/Aboutusimg/Vector.png";
import Wheel from "../../assets/Aboutusimg/Wheel.png";
import { useTranslation } from "react-i18next";

const HypnoTherapy = () => {
  const { t } = useTranslation();
  const darkTags = [
    "Hypnotherapy",
    "Individual Counseling",
    "Couple / Relationship Counseling",
    "Children / Adolescent",
    "Dementia",
    "Clinical Issues",
    "Rehabilitation",
    "Emotional Trauma",
  ];
  return (
    <div className="font-poppins mt-10 px-4 md:px-8 lg:px-16  mx-auto">
      <div className="flex flex-col gap-6 p-3 md:p-6 justify-center items-center">
        <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-black text-center p-3 animate-slide-up">
          Hypnotherapy
        </h1>
        <h1 className="text-xs md:text-sm font-semibold md:w-3/4 text-black text-center p-3 animate-slide-up-delay">
          Integrating future predictions with psychological counselling. Get
          personalized insights and guidance tailored for you. Save your
          valuable time & money
        </h1>
      </div>
      <div className="bg-[#FFEFDF] p-4 md:p-6 rounded-2xl">
        <h1 className="text-black text-xs md:text-sm font-semibold">
          Hypnotherapy is a therapeutic technique that uses hypnosis to help
          individuals make positive changes to their thoughts, feelings, and
          behaviors.
          <br></br>
          <br></br>A hypnotherapist uses verbal cues, mental imagery, and guided
          relaxation techniques to help you enter a state of focused
          concentration, often called a trance.
          <br></br>
          <br></br>
          In this state, your mind is more receptive to suggestions. The goal is
          to help align your conscious intentions with your subconscious
          beliefs.
          <br></br>
          <br></br>
          Hypnotherapy aims to access the subconscious mind to help change or
          reframe beliefs that are causing problems or hindering progress.
          <br></br>
          <br></br>
          Hypnotherapy can be used for a variety of psychological and physical
          conditions (anxiety, depression, fear, emotional trauma, addiction &
          weight loss).
        </h1>
      </div>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3">
        <div className="col-span-1 bg-gray-400 text-black justify-center items-center flex md:h-full h-96">
          Photo of dr. ruchi goyal
        </div>
        <div className="col-span-2 bg-white rounded-lg p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xl font-bold text-primary mb-2">
            Mrs. Ruchi Goyal
          </p>
          <p className="text-xl  font-bold text-black mb-3">
            ₹2000 <span className="line-through">₹2800</span>/session
          </p>
          <p className="text-sm text-black mb-1 leading-snug">
            <span className="font-bold text-black">
              {t("psychology.qualificationLabel")}:
            </span>{" "}
            <span className="">
              M.A. (Clinic al Psychology), PGDRP (Rehabilitation Psychology),
              Advanced Diploma (Singapore)
            </span>
          </p>
          <p className="text-sm text-black mb-1 leading-snug">
            <span className="font-bold text-black">
              {t("psychology.experienceLabel")}:
            </span>{" "}
            <span className="">
              10+ Years, RCI Registered, Singapore Affiliation
            </span>
          </p>
          <p className="text-sm text-black mb-4 leading-snug">
            <span className="font-bold text-black">
              {t("psychology.languageLabel")}:
            </span>{" "}
            <span className="">English, Hindi</span>
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {Array.isArray(darkTags) &&
              darkTags.map((i) => (
                <span
                  key={`d-${i}`}
                  className="px-2 py-1 text-xs rounded-lg  text-primary border border-primary font-bold"
                >
                  {i}
                </span>
              ))}
          </div>
          <div className="flex gap-3 ">
            <button
              onClick={() => setOpen(true)}
              className=" py-2 px-6 w-1/2 md:w-1/4 rounded-lg bg-primary text-white font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              {t("psychology.viewDetails")}
            </button>
          </div>
        </div>
      </div>
      <div
        // style={{ backgroundImage: `url(${Wheel})` }}md:min-h-screen
        className="w-full  bg-contain bg-right bg-no-repeat mt-10 justify-center items-center flex"
      >
        <InviteFriend />
      </div>
    </div>
  );
};

export default HypnoTherapy;
