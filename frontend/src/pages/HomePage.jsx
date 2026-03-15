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
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [activeCard, setActiveCard] = useState(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
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
      path: "/psychological-counselling/free-therapy",
    },
    {
      img: diamond2,
      title: t("psychology.paidTherapyTitle"),
      details: t("psychology.paidTherapyDesc"),
      path: "/psychological-counselling/paid-therapy",
    },
    {
      img: diamond3,
      title: t("psychology.freeAssessTitle"),
      details: t("psychology.freeAssessDesc"),
      path: "/psychological-counselling/free-assessments",
    },
    {
      img: diamond4,
      title: t("psychology.paidAssessTitle"),
      details: t("psychology.paidAssessDesc"),
      path: "/psychological-counselling/paid-assessments",
    },
    {
      img: diamond5,
      title: t("psychology.hypnoTitle"),
      details: t("psychology.hypnoDesc"),
      path: "/psychological-counselling/hypnotherapy",
    },
  ];
  return (
    // <div className="font-poppins mt-10">
    //   {/* bg-gradient-primary" */}{" "}
    //   <section className="w-full  flex items-center">
    //     <div className="   grid grid-cols-1 lg:grid-cols-2 gap-10 items-center justify-center ">
    //       {/* LEFT SIDE */}
    //       <div className="order-2 lg:order-1 p-6 text-center">
    //         <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-6">
    //           {t("hero.title")}
    //         </h1>

    //         <p className="text-black text-lg leading-relaxed mb-8 font-semibold">
    //           {t("hero.description")}
    //         </p>

    //         <div className="flex gap-4 flex-wrap items-center justify-center">
    //           <button
    //             onClick={() =>
    //               navigate("/psychological-counselling/free-therapy")
    //             }
    //             className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary transition"
    //           >
    //             {t("hero.btnTherapy")}
    //           </button>

    //           <button
    //             onClick={() => navigate("/future-prediction/credit1")}
    //             className="border border-primary text-primary px-6 py-3 rounded-lg font-medium hover:bg-orange-50 transition"
    //           >
    //             {t("hero.btnPredict")}
    //           </button>
    //         </div>
    //       </div>

    //       {/* RIGHT SIDE */}
    //       <div
    //         className="flex justify-center  order-1 lg:order-2 rounded-full  "
    //         // style={{
    //         //    backgroundImage: `url(${headerimg})` `url(${zodiac2})`,
    //         // }}
    //       >
    //         <img
    //           src={zodiac2}
    //           alt="Zodiac Circle"
    //           // className="w-full  rounded-full"
    //           className="w-3/4 opacity-80 animate-slowspin"
    //         />
    //       </div>
    //       {/* <div className="flex justify-center order-1 lg:order-2">
    //         <div
    //           className="bg-gradient-to-br from-[#f5ede6] to-[#d04500]
    //               p-10 rounded-full flex justify-center items-center"
    //         >
    //           <img
    //             src={zodiac}
    //             alt="Zodiac Circle"
    //             className="w-[260px] lg:w-[380px]"
    //           />
    //         </div>
    //       </div> */}
    //     </div>
    //   </section>
    //   <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-3">
    //     <div className="flex justify-center items-center">
    //       <img src={headerimg} className="w-1/2 object-cover" />
    //     </div>
    //     <div className="flex flex-col justify-center ">
    //       <h1 className="font-bold text-primary text-2xl md:text-3xl ">
    //         {t("about.title")}
    //       </h1>
    //       <br></br>
    //       <h1 className=" text-black text-xs md:text-sm font-semibold ">
    //         {t("about.description1")}
    //         <br></br>
    //         <br></br>
    //         {t("about.description2")} <br></br>
    //         <br></br>
    //         {t("about.description3")}{" "}
    //       </h1>
    //     </div>
    //   </div>
    //   <div
    //     style={{ backgroundImage: `url(${zodiacBg})` }}
    //     className="w-full min-h-screen    bg-contain bg-left bg-no-repeat mt-10"
    //   >
    //     <h1 className="text-2xl md:text-3xl font-bold text-primary text-center ">
    //       {t("futurePrediction.title")}
    //     </h1>
    //     <h1 className="text-xs md:text-sm md:w-3/4  text-black text-center p-3 font-semibold mx-auto">
    //       {t("futurePrediction.subtitle")}{" "}
    //     </h1>

    //     {/* Responsive Container */}
    //     <div className="flex flex-col md:flex-row items-stretch justify-center gap-0 md:gap-4 max-w-5xl mx-auto p-2">
    //       {/* Free Questions Card (The Highlighted One) */}
    //       {/* <div className="bg-primary text-white p-8 rounded-2xl md:rounded-3xl shadow-xl z-10 flex-1 "> */}
    //       <div
    //         onMouseEnter={() => setActiveCard("free")}
    //         onMouseLeave={() => setActiveCard(null)}
    //         className={`p-8 rounded-2xl md:rounded-3xl flex-1 mt-6 md:mt-0
    // transition-all duration-300 cursor-pointer
    // ${
    //   activeCard === "free"
    //     ? "bg-primary text-white scale-105 shadow-2xl"
    //     : "bg-white border-2 border-primary"
    // }`}
    //       >
    //         <h3 className="text-2xl font-bold mb-6">
    //           {t("futurePrediction.freeTitle")}
    //         </h3>
    //         <ul className="text-left space-y-4 text-sm md:text-base">
    //           {freeQuestions.map((q, i) => (
    //             <li key={i} className="flex items-start">
    //               <span className="mr-2">•</span>
    //               {q}
    //             </li>
    //           ))}
    //         </ul>
    //       </div>

    //       {/* Paid Packages Card */}
    //       {/* <div className="bg-white border-2 border-primary/30 p-8 rounded-2xl md:rounded-3xl flex-1 mt-6 md:mt-0 flex flex-col justify-center"> */}
    //       <div
    //         onMouseEnter={() => setActiveCard("paid")}
    //         onMouseLeave={() => setActiveCard(null)}
    //         className={`p-8 rounded-2xl md:rounded-3xl flex-1 mt-6 md:mt-0
    // transition-all duration-300 cursor-pointer
    // ${
    //   activeCard === "paid"
    //     ? "bg-primary text-white scale-105 shadow-2xl"
    //     : "bg-white border-2 border-primary"
    // }`}
    //       >
    //         <h3 className="text-2xl font-bold mb-6">
    //           {t("futurePrediction.paidTitle")}
    //         </h3>
    //         <div className="space-y-4">
    //           {paidPackages.map((pkg, i) => (
    //             <div
    //               key={i}
    //               className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0"
    //             >
    //               <div className="text-left">
    //                 <span className="font-bold text-lg">{pkg.price}</span>
    //                 {pkg.discount && (
    //                   <span className="ml-2  text-xs font-semibold">
    //                     {pkg.discount}
    //                   </span>
    //                 )}
    //               </div>
    //               <div className="text-right  text-xs md:text-sm">
    //                 {pkg.details}
    //               </div>
    //             </div>
    //           ))}
    //         </div>
    //       </div>
    //     </div>

    //     {/* CTA Button */}
    //     <div className="mt-12">
    //       <button
    //         onClick={() => navigate("/future-prediction/credit1")}
    //         className="bg-primary text-white px-8 py-3 rounded-lg font-semibold flex items-center mx-auto hover:bg-primary transition-colors"
    //       >
    //         {t("futurePrediction.cta")}
    //       </button>
    //     </div>
    //     <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10 p-3 md:p-6 ">
    //       <div className="order-2 md:order-1 flex flex-col justify-center items-center">
    //         <h1 className="text-2xl md:text-3xl font-bold text-primary  ">
    //           {t("difference.title")}
    //         </h1>
    //         <h1 className="text-xs md:text-sm  text-black  p-3 font-semibold mx-auto">
    //           {t("difference.description")}
    //           <br></br>
    //           {t("difference.description2")}
    //         </h1>
    //       </div>
    //       <div className="order-1 md:order-2 flex justify-center items-center">
    //         <img src={yimage} />
    //       </div>
    //     </div>
    //   </div>
    //   <div className="mt-10 p-3 md:p-6">
    //     <h1 className="text-2xl md:text-3xl font-bold text-primary text-center ">
    //       {t("psychology.title")}
    //     </h1>
    //     <h1 className="text-xs md:text-sm md:w-3/4  text-black text-center p-3 font-semibold mx-auto">
    //       {t("psychology.subtitle")}{" "}
    //     </h1>
    //   </div>
    //   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 p-3 md:p-6 gap-3">
    //     {psychologicalData.map((item, index) => (
    //       <div
    //         key={index}
    //         // className="bg-white shadow-xl rounded-xl
    //         //      flex flex-col items-center gap-4
    //         //      p-4 hover:shadow-2xl transition duration-300"
    //         className="bg-white shadow-xl rounded-xl
    //        flex flex-col justify-between
    //        items-center p-4
    //        hover:shadow-2xl transition duration-300"
    //       >
    //         {/* Image */}
    //         <img
    //           src={item.img}
    //           className="w-16 h-16 object-contain"
    //           alt={item.title}
    //         />
    //         {/* Text Content */}
    //         <div className="">
    //           <h1 className="text-primary text-sm md:text-lg font-bold text-center">
    //             {item.title}
    //           </h1>
    //           <p className="text-black text-xs md:text-sm font-semibold mt-1 text-center">
    //             {item.details}
    //           </p>
    //           {/* <p className="text-primary text-sm md:text-lg text-right">
    //             Read more →
    //           </p> */}
    //         </div>{" "}
    //         <button
    //           onClick={() => navigate(item.path)}
    //           className="text-primary text-sm md:text-base font-medium mt-3 text-right cursor-pointer hover:underline"
    //         >
    //           {t("psychology.readMore")}
    //         </button>
    //       </div>
    //     ))}
    //   </div>
    //   <Testimonials />
    //   {/* </div> */}
    // </div>
    <div className="font-poppins">
      {/* Hero Section with Gradient Background */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-100 min-h-screen flex items-center py-16 px-4">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-300/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT SIDE - Text Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left space-y-6 animate-slide-in-left">
            <h1 className="text-4xl lg:text-5xl font-bold text-primary leading-tight animate-slide-up">
              {t("hero.title")}
            </h1>

            <p className="text-gray-700 text-lg lg:text-xl leading-relaxed font-medium animate-slide-up-delay">
              {t("hero.description")}
            </p>

            <div className="flex gap-4 flex-wrap justify-center lg:justify-start animate-pop-up">
              <button
                onClick={() =>
                  navigate("/psychological-counselling/free-therapy")
                }
                className="group relative bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative">{t("hero.btnTherapy")}</span>
              </button>

              <button
                onClick={() => navigate("/future-prediction/credit1")}
                className="group border-2 border-primary text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary hover:text-white transform hover:scale-105 active:scale-95 transition-all duration-300"
              >
                {t("hero.btnPredict")}
              </button>
            </div>
          </div>

          {/* RIGHT SIDE - Zodiac Image */}
          <div className="order-1 lg:order-2 flex justify-center animate-slide-in-right">
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
              <img
                src={zodiac2}
                alt="Zodiac Circle"
                className="relative w-3/4 lg:w-full mx-auto opacity-90 animate-spin-slow drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center animate-scale-in">
            <img
              src={headerimg}
              className="w-3/4 md:w-1/2 object-cover rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-500"
              alt="About"
            />
          </div>

          <div className="space-y-6 animate-slide-in-right">
            <h2 className="font-bold text-primary text-3xl md:text-4xl">
              {t("about.title")}
            </h2>
            <div className="text-gray-700 text-sm md:text-base leading-relaxed space-y-4">
              <p>{t("about.description1")}</p>
              <p>{t("about.description2")}</p>
              <p>{t("about.description3")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Future Prediction Section */}
      <section
        className="relative bg-cover bg-center bg-no-repeat py-16 px-4"
        style={{ backgroundImage: `url(${zodiacBg})` }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-orange-50/90 to-white/95"></div>

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 space-y-4 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              {t("futurePrediction.title")}
            </h2>
            <p className="text-sm md:text-base text-gray-700 max-w-3xl mx-auto leading-relaxed">
              {t("futurePrediction.subtitle")}
            </p>
          </div>

          {/* Cards Container */}
          <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 mb-12">
            {/* Free Questions Card */}
            <div
              onMouseEnter={() => setActiveCard("free")}
              onMouseLeave={() => setActiveCard(null)}
              className={`p-8 rounded-3xl flex-1 transition-all duration-500 cursor-pointer animate-slide-in-left ${
                activeCard === "free"
                  ? "bg-gradient-to-br from-primary to-orange-400 text-white scale-105 shadow-2xl"
                  : "bg-white border-2 border-primary/30 hover:border-primary shadow-lg"
              }`}
            >
              <h3 className="text-2xl md:text-3xl font-bold mb-6">
                {t("futurePrediction.freeTitle")}
              </h3>
              <ul className="space-y-4 text-sm md:text-base">
                {freeQuestions.map((q, i) => (
                  <li key={i} className="flex items-start">
                    <span className="mr-3 text-xl">✦</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Paid Packages Card */}
            <div
              onMouseEnter={() => setActiveCard("paid")}
              onMouseLeave={() => setActiveCard(null)}
              className={`p-8 rounded-3xl flex-1 transition-all duration-500 cursor-pointer animate-slide-in-right ${
                activeCard === "paid"
                  ? "bg-gradient-to-br from-primary to-orange-400 text-white scale-105 shadow-2xl"
                  : "bg-white border-2 border-primary/30 hover:border-primary shadow-lg"
              }`}
            >
              <h3 className="text-2xl md:text-3xl font-bold mb-6">
                {t("futurePrediction.paidTitle")}
              </h3>
              <div className="space-y-4">
                {paidPackages.map((pkg, i) => (
                  <div
                    key={i}
                    className={`flex justify-between items-center pb-4 border-b last:border-0 ${
                      activeCard === "paid"
                        ? "border-white/20"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="text-left">
                      <span className="font-bold text-xl">{pkg.price}</span>
                      {pkg.discount && (
                        <span className="ml-2 text-sm font-semibold opacity-80">
                          {pkg.discount}
                        </span>
                      )}
                    </div>
                    <div className="text-right text-sm md:text-base">
                      {pkg.details}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center animate-pop-up">
            <button
              onClick={() => navigate("/future-prediction/credit1")}
              className="group relative bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative flex items-center gap-2">
                {t("futurePrediction.cta")}
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </button>
          </div>

          {/* Difference Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 items-center">
            <div className="order-2 md:order-1 space-y-6 animate-slide-in-left">
              <h3 className="text-3xl md:text-4xl font-bold text-primary">
                {t("difference.title")}
              </h3>
              <div className="text-gray-700 text-sm md:text-base leading-relaxed space-y-4">
                <p>{t("difference.description")}</p>
                <p>{t("difference.description2")}</p>
              </div>
            </div>
            <div className="order-1 md:order-2 flex justify-center animate-scale-in">
              <img
                src={yimage}
                alt="Difference"
                className="w-3/4 md:w-full rounded-3xl shadow-xl hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Psychology Section */}
      <section className="bg-gradient-to-br from-white via-orange-50 to-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 space-y-4 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              {t("psychology.title")}
            </h2>
            <p className="text-sm md:text-base text-gray-700 max-w-3xl mx-auto leading-relaxed">
              {t("psychology.subtitle")}
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {psychologicalData.map((item, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 flex flex-col items-center justify-between gap-4 border-2 border-transparent hover:border-primary transition-all duration-300 hover:scale-105 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Icon with Background */}
                <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-orange-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <img
                    src={item.img}
                    className="w-12 h-12 object-contain"
                    alt={item.title}
                  />
                </div>

                {/* Text Content */}
                <div className="text-center space-y-2">
                  <h3 className="text-primary text-base md:text-lg font-bold">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                    {item.details}
                  </p>
                </div>

                {/* Read More Button */}
                <button
                  onClick={() => navigate(item.path)}
                  className="text-primary font-semibold text-sm hover:underline flex items-center gap-1 group-hover:gap-2 transition-all"
                >
                  {t("psychology.readMore")}
                  <svg
                    className="w-4 h-4"
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
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />
    </div>
  );
};

export default HomePage;
