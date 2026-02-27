import React, { useState } from "react";
import zodiac from "../assets/zodiacfinal.png";
import zodiac2 from "../assets/zodiac.png";
import headerimg from "../assets/header.png";
import dwh from "../assets/dwh.svg";
import zodiacBg from "../assets/zodiacBg.png";
import yimage from "../assets/yimage.svg";
import diamond1 from "../assets/diamondimg/11.png";
import diamond2 from "../assets/diamondimg/22.png";
import diamond3 from "../assets/diamondimg/33.png";
import diamond4 from "../assets/diamondimg/4.png";
import diamond5 from "../assets/diamondimg/5.png";
import Testimonials from "../components/Testimonials";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const [activeCard, setActiveCard] = useState(null);
  const { t } = useTranslation();
  const freeQuestions = [
    t("homepagefreeQuestions1"),
    t("homepagefreeQuestions2"),
    t("homepagefreeQuestions3"),
    t("homepagefreeQuestions4"),
    t("homepagefreeQuestions5"),
  ];

  const paidPackages = [
    {
      price: t("homepagepaidPackagesprice1"),
      discount: "",
      details: t("homepagepaidPackagesdetails1"),
    },
    {
      price: t("homepagepaidPackagesprice2"),
      discount: "",
      details: t("homepagepaidPackagesdetails2"),
    },
    {
      price: t("homepagepaidPackagesprice3"),
      discount: "",
      details: t("homepagepaidPackagesdetails3"),
    },
    {
      price: t("homepagepaidPackagesprice4"),
      discount: "",
      details: t("homepagepaidPackagesdetails4"),
    },
  ];
  const psychologicalData = [
    {
      img: diamond1,
      title: t("psychology.freeTipsTitle"),
      details: t("psychology.freeTipsDesc"),
    },
    {
      img: diamond2,
      title: t("psychology.paidTherapyTitle"),
      details: t("psychology.paidTherapyDesc"),
    },
    {
      img: diamond3,
      title: t("psychology.freeAssessTitle"),
      details: t("psychology.freeAssessDesc"),
    },
    {
      img: diamond4,
      title: t("psychology.paidAssessTitle"),
      details: t("psychology.paidAssessDesc"),
    },
    {
      img: diamond5,
      title: t("psychology.hypnoTitle"),
      details: t("psychology.hypnoDesc"),
    },
  ];
  return (
    <div className="font-poppins mt-10">
      {/* bg-gradient-primary" */}{" "}
      <section className="w-full  flex items-center">
        <div className="   grid grid-cols-1 lg:grid-cols-2 gap-10 items-center justify-center ">
          {/* LEFT SIDE */}
          <div className="order-2 lg:order-1 p-6 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-6">
              {t("hero.title")}
            </h1>

            <p className="text-black text-lg leading-relaxed mb-8 font-semibold">
              {t("hero.description")}
            </p>

            <div className="flex gap-4 flex-wrap items-center justify-center">
              <button className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary transition">
                {t("hero.btnTherapy")}
              </button>

              <button className="border border-primary text-primary px-6 py-3 rounded-lg font-medium hover:bg-orange-50 transition">
                {t("hero.btnPredict")}
              </button>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div
            className="flex justify-center  order-1 lg:order-2 rounded-full  "
            // style={{
            //    backgroundImage: `url(${headerimg})` `url(${zodiac2})`,
            // }}
          >
            <img
              src={zodiac2}
              alt="Zodiac Circle"
              // className="w-full  rounded-full"
              className="w-3/4 opacity-80 animate-slowspin"
            />
          </div>
          {/* <div className="flex justify-center order-1 lg:order-2">
            <div
              className="bg-gradient-to-br from-[#f5ede6] to-[#d04500]
                  p-10 rounded-full flex justify-center items-center"
            >
              <img
                src={zodiac}
                alt="Zodiac Circle"
                className="w-[260px] lg:w-[380px]"
              />
            </div>
          </div> */}
        </div>
      </section>
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex justify-center items-center">
          <img src={headerimg} className="w-1/2 object-cover" />
        </div>
        <div className="flex flex-col justify-center ">
          <h1 className="font-bold text-primary text-2xl md:text-3xl ">
            {t("about.title")}
          </h1>
          <br></br>
          <h1 className=" text-black text-xs md:text-sm font-semibold ">
            {t("about.description1")}
            <br></br>
            <br></br>
            {t("about.description2")} <br></br>
            <br></br>
            {t("about.description3")}{" "}
          </h1>
        </div>
      </div>
      <div
        style={{ backgroundImage: `url(${zodiacBg})` }}
        className="w-full min-h-screen    bg-contain bg-left bg-no-repeat mt-10"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-primary text-center ">
          {t("futurePrediction.title")}
        </h1>
        <h1 className="text-xs md:text-sm md:w-3/4  text-black text-center p-3 font-semibold mx-auto">
          {t("futurePrediction.subtitle")}{" "}
        </h1>

        {/* Responsive Container */}
        <div className="flex flex-col md:flex-row items-stretch justify-center gap-0 md:gap-4 max-w-5xl mx-auto p-2">
          {/* Free Questions Card (The Highlighted One) */}
          {/* <div className="bg-primary text-white p-8 rounded-2xl md:rounded-3xl shadow-xl z-10 flex-1 "> */}
          <div
            onMouseEnter={() => setActiveCard("free")}
            onMouseLeave={() => setActiveCard(null)}
            className={`p-8 rounded-2xl md:rounded-3xl flex-1 mt-6 md:mt-0 
    transition-all duration-300 cursor-pointer
    ${
      activeCard === "free"
        ? "bg-primary text-white scale-105 shadow-2xl"
        : "bg-white border-2 border-primary"
    }`}
          >
            <h3 className="text-2xl font-bold mb-6">
              {t("futurePrediction.freeTitle")}
            </h3>
            <ul className="text-left space-y-4 text-sm md:text-base">
              {freeQuestions.map((q, i) => (
                <li key={i} className="flex items-start">
                  <span className="mr-2">•</span>
                  {q}
                </li>
              ))}
            </ul>
          </div>

          {/* Paid Packages Card */}
          {/* <div className="bg-white border-2 border-primary/30 p-8 rounded-2xl md:rounded-3xl flex-1 mt-6 md:mt-0 flex flex-col justify-center"> */}
          <div
            onMouseEnter={() => setActiveCard("paid")}
            onMouseLeave={() => setActiveCard(null)}
            className={`p-8 rounded-2xl md:rounded-3xl flex-1 mt-6 md:mt-0 
    transition-all duration-300 cursor-pointer
    ${
      activeCard === "paid"
        ? "bg-primary text-white scale-105 shadow-2xl"
        : "bg-white border-2 border-primary"
    }`}
          >
            <h3 className="text-2xl font-bold mb-6">
              {t("futurePrediction.paidTitle")}
            </h3>
            <div className="space-y-4">
              {paidPackages.map((pkg, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0"
                >
                  <div className="text-left">
                    <span className="font-bold text-lg">{pkg.price}</span>
                    {pkg.discount && (
                      <span className="ml-2  text-xs font-semibold">
                        {pkg.discount}
                      </span>
                    )}
                  </div>
                  <div className="text-right  text-xs md:text-sm">
                    {pkg.details}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-12">
          <button className="bg-primary text-white px-8 py-3 rounded-lg font-semibold flex items-center mx-auto hover:bg-primary transition-colors">
            {t("futurePrediction.cta")}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10 p-3 md:p-6 ">
          <div className="order-2 md:order-1 flex flex-col justify-center items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-primary  ">
              {t("difference.title")}
            </h1>
            <h1 className="text-xs md:text-sm  text-black  p-3 font-semibold mx-auto">
              {t("difference.description")}
              <br></br>
              {t("difference.description2")}
            </h1>
          </div>
          <div className="order-1 md:order-2 flex justify-center items-center">
            <img src={yimage} />
          </div>
        </div>
      </div>
      <div className="mt-10 p-3 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-primary text-center ">
          {t("psychology.title")}
        </h1>
        <h1 className="text-xs md:text-sm md:w-3/4  text-black text-center p-3 font-semibold mx-auto">
          {t("psychology.subtitle")}{" "}
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 p-3 md:p-6 gap-3">
        {psychologicalData.map((item, index) => (
          <div
            key={index}
            // className="bg-white shadow-xl rounded-xl
            //      flex flex-col items-center gap-4
            //      p-4 hover:shadow-2xl transition duration-300"
            className="bg-white shadow-xl rounded-xl 
           flex flex-col justify-between 
           items-center p-4 
           hover:shadow-2xl transition duration-300"
          >
            {/* Image */}
            <img
              src={item.img}
              className="w-16 h-16 object-contain"
              alt={item.title}
            />
            {/* Text Content */}
            <div className="">
              <h1 className="text-primary text-sm md:text-lg font-bold text-center">
                {item.title}
              </h1>
              <p className="text-black text-xs md:text-sm font-semibold mt-1 text-center">
                {item.details}
              </p>
              {/* <p className="text-primary text-sm md:text-lg text-right">
                Read more →
              </p> */}
            </div>{" "}
            <p className="text-primary text-sm md:text-base font-medium mt-3 text-right cursor-pointer hover:underline">
              {t("psychology.readMore")}
            </p>
          </div>
        ))}
      </div>
      {/* <div className="flex justify-center items-center mt-10">
        <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-black text-center p-3">
          OUR HAPPY CLIENT SAY ABOUT STEER-U
        </h1>
      </div>
      <div className="flex justify-center items-center mt-10 flex-col">
        <h1 className="text-sm md:text-xl lg:text-2xl font-bold text-primary text-center p-3">
          What Our Clients Say About Us
        </h1> */}
      <Testimonials />
      {/* </div> */}
    </div>
  );
};

export default HomePage;
