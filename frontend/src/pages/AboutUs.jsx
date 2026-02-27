import React, { useState } from "react";
import vector from "../assets/Aboutusimg/Vector.png";
import aboutus from "../assets/Aboutusimg/aboutus.png";
import bgWheel from "../assets/Aboutusimg/bgWheel.png";
import sideimg from "../assets/Aboutusimg/3.png";
import pluscircle from "../assets/Aboutusimg/pluscircle.png";
import minuscircle from "../assets/Aboutusimg/Icon.png";
import Testimonials from "../components/Testimonials";
import InviteFriend from "../components/InviteFriend";
import Wheel from "../assets/Aboutusimg/Wheel.png";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";

const AboutUs = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const { t } = useTranslation();
  const faqs = t("faq", { returnObjects: true });
  const data = [
    { title: t("stats.partner"), value: "189+" },
    { title: t("stats.teams"), value: "322+" },
    { title: t("stats.happyClient"), value: "98K+" },
    { title: t("stats.serviced"), value: "112K+" },
  ];
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return (
    <div className="font-poppins mt-10">
      <div className="flex flex-col gap-6 p-3 md:p-6 justify-center items-center">
        <img src={vector} className="" />
        <h1 className="p-3 border rounded-2xl text-sm md:text-xl">
          <span className="text-white bg-primary rounded-full text-sm md:text-xl px-2 py-1  md:px-4 md:py-2">
            New
          </span>{" "}
          {t("aboutus.badge")}
        </h1>
        <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-black text-center p-3">
          {t("aboutus.title")}
        </h1>
        <h1 className="text-xs md:text-sm lg:text-sm font-semibold md:w-3/4 text-black text-center p-3">
          {t("aboutus.subtitle")}
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="flex justify-center items-center p-3 md:p-6">
          <img src={aboutus} />
        </div>
        {/* 
        <div className="flex flex-row">
          <h1 className="text-6xl">|</h1> */}
        <div className="flex flex-col gap-3 justify-center ">
          <h1 className="text-sm md:text-xl lg:text-xl font-bold text-primary text-left p-3">
            {t("aboutus.title")}
          </h1>
          <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-black text-left p-3">
            {t("aboutus.sectionTitle")}{" "}
          </h1>
        </div>
        {/* </div> */}
      </div>
      <div className=" justify-center items-center flex">
        <h1 className="text-black text-sm md:text-sm p-3 md:p-6 md:w-3/4 text-center">
          {t("aboutus.description")}
        </h1>
      </div>

      <div
        className="relative bg-cover bg-center bg-no-repeat 
             flex items-center justify-center 
             mt-10 h-[450px]"
        style={{
          backgroundImage: `url(${bgWheel})`,
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Glass Card */}
        <div
          className="relative bg-white/10 backdrop-blur-md 
                  rounded-3xl p-6 md:p-10 
                  w-[90%] md:w-1/2 text-center shadow-2xl"
        >
          <h1 className="font-bold text-[#FFDABD] text-xl md:text-3xl">
            {t("aboutus.blessingTitle")}{" "}
          </h1>

          <p className="font-medium text-white text-xs md:text-sm mt-4 leading-relaxed">
            {t("aboutus.blessingDescription")}{" "}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-10">
        <div className="flex justify-center items-center p-3 md:p-6">
          <img src={sideimg} />
        </div>
        {/* 
        <div className="flex flex-row">
          <h1 className="text-6xl">|</h1> */}
        <div className="flex flex-col gap-3 justify-center ">
          <h1 className="text-sm md:text-xl lg:text-xl font-bold text-primary text-left p-3">
            {t("aboutus.welcomeTitle")}
          </h1>
          <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-black text-left p-3">
            {t("aboutus.welcomeHeading")}
          </h1>
          <h1 className="text-xs md:text-sm font-semibold text-black text-left p-3">
            {t("aboutus.welcomeDescription")}
            <br></br>
            <br></br>
            {t("aboutus.welcomeDescription2")} <br></br> <br></br>
            {t("aboutus.welcomeDescription3")} <br></br>
            <br></br>
            <span className="font-bold text-sm">{t("aboutus.founder")}</span>
          </h1>
        </div>
        {/* </div> */}
      </div>
      <div className="mt-10 justify-center items-center flex flex-col gap-6 p-3 md:p-6">
        <h1 className="text-xl md:text-2xl text-primary font-bold">
          {t("aboutus.faqTitle")}
        </h1>
        {/* <section className="bg-[#FFF5EF] py-12 px-4">
          <div className="max-w-4xl mx-auto">
           
            <h2 className="text-center text-[#D55A2A] text-2xl md:text-3xl font-bold mb-8">
              Frequently Asked Questions
            </h2> */}

        {/* FAQ Cards */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`border border-[#E8A07A] rounded-xl ${openIndex === index ? "bg-[#f7c8a2]" : ""} overflow-hidden transition-all duration-300`}
            >
              {/* Question */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-4 md:p-5 text-left"
              >
                <span className="text-sm md:text-base font-semibold text-gray-800">
                  {faq.question}
                </span>

                {/* Your Custom Icon */}
                {openIndex === index ? (
                  <img
                    src={minuscircle}
                    alt="toggle icon"
                    className={`w-5 h-5 transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                ) : (
                  <img
                    src={pluscircle}
                    alt="toggle icon"
                    className={`w-5 h-5 transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {/* Answer */}
              <div
                className={`px-4 md:px-5 pb-4 text-sm md:text-base text-gray-700 transition-all duration-300 ${
                  openIndex === index
                    ? "max-h-40 opacity-100"
                    : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
        {/* </div>
        </section> */}
      </div>
      <div
        className="relative bg-cover bg-center bg-no-repeat 
             flex items-center justify-center 
             mt-10 h-[450px]"
        style={{
          backgroundImage: `url(${bgWheel})`,
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-[#FFDBCA]/30"></div>

        {/* Glass Card */}
        <div className="relative   p-6 md:p-10     flex justify-center items-center flex-col gap-5">
          <h1 className="  text-2xl md:text-4xl lg:text-5xl font-bold text-black text-center p-3">
            {t("aboutus.membershipTitle")}
          </h1>

          <p className="md:w-1/2 font-medium text-black text-xs md:text-sm mt-4 text-center">
            {t("aboutus.membershipDescription")}{" "}
          </p>
          <button className="bg-[#C8191C] py-2 px-5 text-white font-bold">
            {t("aboutus.membershipButton")}
          </button>
        </div>
      </div>

      <div className="mt-10  grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-3 md:p-6 gap-3 ">
        {data.map((item, index) => (
          <div className="flex flex-col gap-5" key={String(index + 1)}>
            <h1 className="text-primary font-bold text-sm md:text-xl text-center">
              {item.title}
            </h1>
            <h1 className="text-black font-bold text-xl md:text-5xl text-center">
              {item.value}
            </h1>
          </div>
        ))}
      </div>

      <Testimonials />
      <div
        style={{ backgroundImage: `url(${Wheel})` }}
        className="w-full md:min-h-screen   bg-contain bg-right bg-no-repeat mt-10 justify-center items-center flex"
      >
        <InviteFriend />
      </div>
    </div>
  );
};

export default AboutUs;
