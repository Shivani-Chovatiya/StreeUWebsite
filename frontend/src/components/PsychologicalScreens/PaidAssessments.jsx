import React from "react";
import InviteFriend from "../InviteFriend";
import vector from "../../assets/Aboutusimg/Vector.png";
import Wheel from "../../assets/Aboutusimg/Wheel.png";
import { useTranslation } from "react-i18next";
import Lock from "../../assets/Lock.png";

const tests = [
  { title: "Learning Pattern", credit: "8 Credit" },
  { title: "Memory", credit: "15 Credit" },
  { title: "Developmental delays", credit: "12 Credit" },
  { title: "Relationship issues / compatibility", credit: "20 Credit" },
  { title: "I.Q", credit: "25 Credit" },
  { title: "OCD", credit: "25 Credit" },
  { title: "ADHD", credit: "25 Credit" },
  { title: "ADHD screening", credit: "10 Credit" },
  { title: "Autism", credit: "25 Credit" },
  { title: "Mental Retardation", credit: "35 Credit" },
  { title: "Depression, Anxiety & Stress", credit: "15 Credit" },
  { title: "Anxiety only", credit: "8 Credit" },
  { title: "Depression only", credit: "8 Credit" },
  { title: "Stress only", credit: "8 Credit" },
  { title: "EQ Test / ET", credit: "15 Credit" },
  { title: "Learning Disability", credit: "20 Credit" },
  { title: "Behavioral screening", credit: "10 Credit" },
  { title: "Personality Test", credit: "20 Credit" },
];
const PaidAssessments = () => {
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
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-5">
          {tests.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between border border-primary rounded-xl px-5 py-4 bg-[#F9F9F9] hover:shadow-md transition"
            >
              <div>
                <h3 className="font-semibold text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{item.credit}</p>
              </div>

              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FFEBCC]">
                <img src={Lock} className="object-contain w-4 h-4" />
              </div>
            </div>
          ))}
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

export default PaidAssessments;
