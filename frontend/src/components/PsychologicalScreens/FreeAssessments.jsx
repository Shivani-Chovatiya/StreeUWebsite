import React from "react";
import InviteFriend from "../InviteFriend";
import vector from "../../assets/Aboutusimg/Vector.png";
import Wheel from "../../assets/Aboutusimg/Wheel.png";
import { useTranslation } from "react-i18next";
const symptoms = [
  "Excessive sleeping or lack of sleep",
  "Disturbed eating pattern",
  "Social isolation",
  "Difficulty communicating with others",
  "Difficulty in everyday activities (eating, drawing, bathing, etc.)",
  "Reading/writing issues",
  "Short-tempered or too aggressive",
  "Rigid behaviour patterns",
  "Repetitive & restricted behaviour",
  "Learning difficulty",
  "Delay in developmental milestones",
  "Hopelessness/helplessness",
  "Seeks attention",
  "Seizures/fits",
  "Excessive mood variations",
  "Hypo sensitive / Hypersensitive",
  "Suicidal thoughts or behaviour",
  "Hallucinations / Delusions",
  "Self-harm",
  "Sensitivity to light or noise",
  "Disorganized thinking",
  "Obsession (recurring unwanted thoughts/images/urges)",
  "Addiction (persistent substance or activity use)",
  "Disrespects or disobeys parents",
  "Parenting issues",
  "Disagreement with partner or parents",
  "Any fears or phobias",
  "Self-doubt / Focus more on self-image",
  "Frequent crying spells",
  "Lack of concentration",
  "Fight/arguments between parents or couple",
];

const FreeAssessments = () => {
  const { t } = useTranslation();
  return (
    <div className="font-poppins mt-10 p-6 md:p-16">
      <div className="flex flex-col gap-6 p-3 md:p-6 justify-center items-center">
        <img src={vector} className="" alt="" />
        <h1 className="p-3 border rounded-2xl text-sm md:text-xl">
          <span className="text-white bg-primary rounded-full text-sm md:text-xl px-2 py-1 md:px-4 md:py-2">
            New
          </span>{" "}
          {t("aboutus.badge")}
        </h1>
        <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-black text-center p-3">
          Free Assessment
        </h1>
        <h1 className="text-xs md:text-sm font-semibold md:w-3/4 text-black text-center p-3">
          Integrating future predictions with psychological counselling. Get
          personalized insights and guidance tailored for you. Save your
          valuable time & money
        </h1>
      </div>
      <div className="flex flex-col gap-6 justify-center items-center">
        <h1 className="font-bold text-black text-xl">
          Choose any 8-10 symptoms
        </h1>
        <div className="bg-[#FFEFDF] w-full rounded-2xl p-6   shadow-md">
          <div className="space-y-3 ">
            {symptoms.map((item, index) => (
              <label
                key={index}
                className="flex items-center gap-3 text-sm cursor-pointer"
              >
                <input type="checkbox" className="w-4 h-4 accent-orange-500" />
                {item}
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-center items-center">
          <button className="bg-primary text-white px-6 py-3 rounded-xl">
            Submit
          </button>
        </div>
      </div>
      <div
        style={{ backgroundImage: `url(${Wheel})` }}
        className="w-full md:min-h-screen bg-contain bg-right bg-no-repeat mt-10 justify-center items-center flex"
      >
        <InviteFriend />
      </div>
    </div>
  );
};

export default FreeAssessments;
