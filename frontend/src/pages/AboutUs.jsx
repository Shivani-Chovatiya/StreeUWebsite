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
import { useScrollAnimation } from "../components/useScrollAnimation";

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
  const [heroRef, heroVisible] = useScrollAnimation();
  const [aboutRef, aboutVisible] = useScrollAnimation();
  const [descRef, descVisible] = useScrollAnimation();
  const [blessingRef, blessingVisible] = useScrollAnimation();
  const [welcomeRef, welcomeVisible] = useScrollAnimation();
  const [faqRef, faqVisible] = useScrollAnimation();
  const [membershipRef, membershipVisible] = useScrollAnimation();
  const [statsRef, statsVisible] = useScrollAnimation();
  return (
    // <div className="font-poppins mt-10">
    //   <div className="flex flex-col gap-6 p-3 md:p-6 justify-center items-center">
    //     <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-black text-center p-3 animate-slide-up">
    //       {t("aboutus.title")}
    //     </h1>
    //     <h1 className="text-xs md:text-sm lg:text-sm font-semibold md:w-3/4 text-black text-center p-3 animate-slide-up-delay">
    //       {t("aboutus.subtitle")}
    //     </h1>
    //   </div>
    //   <div className="grid grid-cols-1 md:grid-cols-2">
    //     <div className="flex justify-center items-center p-3 md:p-6">
    //       <img src={aboutus} />
    //     </div>
    //     {/*
    //     <div className="flex flex-row">
    //       <h1 className="text-6xl">|</h1> */}
    //     <div className="flex flex-col gap-3 justify-center ">
    //       <h1 className="text-sm md:text-xl lg:text-xl font-bold text-primary text-left p-3">
    //         {t("aboutus.title")}
    //       </h1>
    //       <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-black text-left p-3">
    //         {t("aboutus.sectionTitle")}{" "}
    //       </h1>
    //     </div>
    //     {/* </div> */}
    //   </div>
    //   <div className=" justify-center items-center flex">
    //     <h1 className="text-black text-sm md:text-sm p-3 md:p-6 md:w-3/4 text-center">
    //       {t("aboutus.description")}
    //     </h1>
    //   </div>

    //   <div
    //     className="relative bg-cover bg-center bg-no-repeat
    //          flex items-center justify-center
    //          mt-10 h-[450px]"
    //     style={{
    //       backgroundImage: `url(${bgWheel})`,
    //     }}
    //   >
    //     {/* Dark Overlay */}
    //     <div className="absolute inset-0 bg-black/50"></div>

    //     {/* Glass Card */}
    //     <div
    //       className="relative bg-white/10 backdrop-blur-md
    //               rounded-3xl p-6 md:p-10
    //               w-[90%] md:w-1/2 text-center shadow-2xl"
    //     >
    //       <h1 className="font-bold text-[#FFDABD] text-xl md:text-3xl">
    //         {t("aboutus.blessingTitle")}{" "}
    //       </h1>

    //       <p className="font-medium text-white text-xs md:text-sm mt-4 leading-relaxed">
    //         {t("aboutus.blessingDescription")}{" "}
    //       </p>
    //     </div>
    //   </div>
    //   <div className="grid grid-cols-1 md:grid-cols-2 mt-10">
    //     <div className="flex justify-center items-center p-3 md:p-6">
    //       <img src={sideimg} />
    //     </div>
    //     {/*
    //     <div className="flex flex-row">
    //       <h1 className="text-6xl">|</h1> */}
    //     <div className="flex flex-col gap-3 justify-center ">
    //       <h1 className="text-sm md:text-xl lg:text-xl font-bold text-primary text-left p-3">
    //         {t("aboutus.welcomeTitle")}
    //       </h1>
    //       <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-black text-left p-3">
    //         {t("aboutus.welcomeHeading")}
    //       </h1>
    //       <h1 className="text-xs md:text-sm font-semibold text-black text-left p-3">
    //         {t("aboutus.welcomeDescription")}
    //         <br></br>
    //         <br></br>
    //         {t("aboutus.welcomeDescription2")} <br></br> <br></br>
    //         {t("aboutus.welcomeDescription3")} <br></br>
    //         <br></br>
    //         <span className="font-bold text-sm">{t("aboutus.founder")}</span>
    //       </h1>
    //     </div>
    //     {/* </div> */}
    //   </div>
    //   <div className="mt-10 justify-center items-center flex flex-col gap-6 p-3 md:p-6">
    //     <h1 className="text-xl md:text-2xl text-primary font-bold">
    //       {t("aboutus.faqTitle")}
    //     </h1>
    //     {/* <section className="bg-[#FFF5EF] py-12 px-4">
    //       <div className="max-w-4xl mx-auto">

    //         <h2 className="text-center text-[#D55A2A] text-2xl md:text-3xl font-bold mb-8">
    //           Frequently Asked Questions
    //         </h2> */}

    //     {/* FAQ Cards */}
    //     <div className="space-y-4">
    //       {faqs.map((faq, index) => (
    //         <div
    //           key={index}
    //           className={`border border-[#E8A07A] rounded-xl ${openIndex === index ? "bg-[#f7c8a2]" : ""} overflow-hidden transition-all duration-300`}
    //         >
    //           {/* Question */}
    //           <button
    //             onClick={() => toggleFAQ(index)}
    //             className="w-full flex justify-between items-center p-4 md:p-5 text-left"
    //           >
    //             <span className="text-sm md:text-base font-semibold text-gray-800">
    //               {faq.question}
    //             </span>

    //             {/* Your Custom Icon */}
    //             {openIndex === index ? (
    //               <img
    //                 src={minuscircle}
    //                 alt="toggle icon"
    //                 className={`w-5 h-5 transition-transform duration-300 ${
    //                   openIndex === index ? "rotate-180" : ""
    //                 }`}
    //               />
    //             ) : (
    //               <img
    //                 src={pluscircle}
    //                 alt="toggle icon"
    //                 className={`w-5 h-5 transition-transform duration-300 ${
    //                   openIndex === index ? "rotate-180" : ""
    //                 }`}
    //               />
    //             )}
    //           </button>

    //           {/* Answer */}
    //           <div
    //             className={`px-4 md:px-5 pb-4 text-sm md:text-base text-black font-semibold transition-all duration-300 ${
    //               openIndex === index
    //                 ? "max-h-40 opacity-100"
    //                 : "max-h-0 opacity-0 overflow-hidden"
    //             }`}
    //           >
    //             {faq.answer}
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //     {/* </div>
    //     </section> */}
    //   </div>
    //   <div
    //     className="relative bg-cover bg-center bg-no-repeat
    //          flex items-center justify-center
    //          mt-10 h-[450px]"
    //     style={{
    //       backgroundImage: `url(${bgWheel})`,
    //     }}
    //   >
    //     {/* Dark Overlay */}
    //     <div className="absolute inset-0 bg-[#FFDBCA]/30"></div>

    //     {/* Glass Card */}
    //     <div className="relative   p-6 md:p-10     flex justify-center items-center flex-col gap-5">
    //       <h1 className="  text-2xl md:text-4xl lg:text-5xl font-bold text-black text-center p-3">
    //         {t("aboutus.membershipTitle")}
    //       </h1>

    //       <p className="md:w-1/2 font-medium text-black text-xs md:text-sm mt-4 text-center">
    //         {t("aboutus.membershipDescription")}{" "}
    //       </p>
    //       <button className="bg-[#C8191C] py-2 px-5 text-white font-bold">
    //         {t("aboutus.membershipButton")}
    //       </button>
    //     </div>
    //   </div>

    //   <div className="mt-10  grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-3 md:p-6 gap-3 ">
    //     {data.map((item, index) => (
    //       <div className="flex flex-col gap-5" key={String(index + 1)}>
    //         <h1 className="text-primary font-bold text-sm md:text-xl text-center">
    //           {item.title}
    //         </h1>
    //         <h1 className="text-black font-bold text-xl md:text-5xl text-center">
    //           {item.value}
    //         </h1>
    //       </div>
    //     ))}
    //   </div>
    // <div className="font-poppins">
    //   {/* Hero Section with Gradient */}
    //   <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-100 py-16 md:py-20">
    //     {/* Decorative Blobs */}
    //     <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-blob"></div>
    //     <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-300/5 rounded-full blur-3xl animate-blob animation-delay-2000"></div>

    //     <div className="relative z-10 flex flex-col gap-6 px-4 md:px-6 justify-center items-center">
    //       <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-black text-center animate-slide-up">
    //         {t("aboutus.title")}
    //       </h1>
    //       <p className="text-sm md:text-base lg:text-lg max-w-3xl text-black font-semibold text-center leading-relaxed animate-slide-up-delay">
    //         {t("aboutus.subtitle")}
    //       </p>
    //     </div>
    //   </div>

    //   {/* About Section with Image */}
    //   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-8 lg:px-16 py-12 max-w-7xl mx-auto">
    //     <div className="flex justify-center items-center animate-slide-in-left">
    //       <img src={aboutus} alt="About Us" className="rounded-3xl shadow-xl" />
    //     </div>

    //     <div className="flex flex-col gap-6 justify-center animate-slide-in-right">
    //       <h2 className="text-base md:text-xl font-bold text-primary">
    //         {t("aboutus.title")}
    //       </h2>
    //       <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-black leading-tight">
    //         {t("aboutus.sectionTitle")}
    //       </h1>
    //     </div>
    //   </div>

    //   {/* Description Section */}
    //   <div className="flex justify-center items-center px-4 md:px-8 py-8 animate-fade-in">
    //     <p className="text-black font-semibold text-sm md:text-base max-w-4xl text-center leading-relaxed">
    //       {t("aboutus.description")}
    //     </p>
    //   </div>

    //   {/* Blessing Section with Glass Effect */}
    //   <div
    //     className="relative bg-cover bg-center bg-no-repeat flex items-center justify-center mt-16 min-h-[450px] py-12 px-4"
    //     style={{ backgroundImage: `url(${bgWheel})` }}
    //   >
    //     {/* Dark Overlay */}
    //     <div className="absolute inset-0 bg-black/50"></div>

    //     {/* Glass Card */}
    //     <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 w-full max-w-3xl text-center shadow-2xl border border-white/20 animate-scale-in">
    //       <h2 className="font-bold text-orange-200 text-2xl md:text-4xl mb-6">
    //         {t("aboutus.blessingTitle")}
    //       </h2>
    //       <p className="font-medium text-white text-sm md:text-base leading-relaxed">
    //         {t("aboutus.blessingDescription")}
    //       </p>
    //     </div>
    //   </div>

    //   {/* Welcome Section */}
    //   <div className="relative overflow-hidden bg-gradient-to-br from-white via-orange-50 to-white py-16">
    //     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
    //       <div className="flex justify-center items-center order-2 md:order-1 animate-slide-in-left">
    //         <img
    //           src={sideimg}
    //           alt="Welcome"
    //           className="rounded-3xl shadow-xl"
    //         />
    //       </div>

    //       <div className="flex flex-col gap-4 justify-center order-1 md:order-2 animate-slide-in-right">
    //         <h3 className="text-base md:text-xl font-bold text-primary">
    //           {t("aboutus.welcomeTitle")}
    //         </h3>
    //         <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-black leading-tight">
    //           {t("aboutus.welcomeHeading")}
    //         </h2>
    //         <div className="text-sm md:text-base text-black font-semibold leading-relaxed space-y-4">
    //           <p>{t("aboutus.welcomeDescription")}</p>
    //           <p>{t("aboutus.welcomeDescription2")}</p>
    //           <p>{t("aboutus.welcomeDescription3")}</p>
    //           <p className="font-bold text-primary">{t("aboutus.founder")}</p>
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   {/* FAQ Section */}
    //   <div className="bg-gradient-to-br from-orange-50 via-white to-orange-50 py-16 px-4 md:px-8">
    //     <div className="max-w-4xl mx-auto">
    //       <h2 className="text-2xl md:text-3xl text-primary font-bold text-center mb-12 animate-slide-up">
    //         {t("aboutus.faqTitle")}
    //       </h2>

    //       <div className="space-y-4">
    //         {faqs.map((faq, index) => (
    //           <div
    //             key={index}
    //             className={`group border-2 rounded-2xl transition-all duration-300 hover:shadow-lg animate-fade-in ${
    //               openIndex === index
    //                 ? "bg-gradient-to-r from-primary/10 to-orange-100 border-primary shadow-md"
    //                 : "bg-white border-orange-200 hover:border-primary/50"
    //             }`}
    //             style={{ animationDelay: `${index * 0.1}s` }}
    //           >
    //             {/* Question */}
    //             <button
    //               onClick={() => toggleFAQ(index)}
    //               className="w-full flex justify-between items-center p-5 md:p-6 text-left group-hover:text-primary transition-colors"
    //             >
    //               <span className="text-sm md:text-base font-semibold text-gray-800 pr-4">
    //                 {faq.question}
    //               </span>

    //               <div className="flex-shrink-0">
    //                 {openIndex === index ? (
    //                   <img
    //                     src={minuscircle}
    //                     alt="collapse"
    //                     className="w-6 h-6 transition-transform duration-300 rotate-180"
    //                   />
    //                 ) : (
    //                   <img
    //                     src={pluscircle}
    //                     alt="expand"
    //                     className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
    //                   />
    //                 )}
    //               </div>
    //             </button>

    //             {/* Answer */}
    //             <div
    //               className={`overflow-hidden transition-all duration-300 ${
    //                 openIndex === index
    //                   ? "max-h-96 opacity-100"
    //                   : "max-h-0 opacity-0"
    //               }`}
    //             >
    //               <div className="px-5 md:px-6 pb-5 text-sm md:text-base text-black font-semibold leading-relaxed">
    //                 {faq.answer}
    //               </div>
    //             </div>
    //           </div>
    //         ))}
    //       </div>
    //     </div>
    //   </div>

    //   {/* Membership Section */}
    //   <div
    //     className="relative bg-cover bg-center bg-no-repeat flex items-center justify-center min-h-[450px] py-16 px-4"
    //     style={{ backgroundImage: `url(${bgWheel})` }}
    //   >
    //     {/* Colored Overlay */}
    //     <div className="absolute inset-0 bg-gradient-to-br from-orange-200/40 to-orange-100/30"></div>

    //     {/* Content */}
    //     <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6 animate-scale-in">
    //       <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-black">
    //         {t("aboutus.membershipTitle")}
    //       </h2>
    //       <p className="text-sm md:text-base text-gray-800 leading-relaxed max-w-2xl mx-auto">
    //         {t("aboutus.membershipDescription")}
    //       </p>
    //       <button className="group relative bg-primary hover:bg-primary/90 text-white font-bold text-lg px-10 py-4 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden">
    //         {/* Shimmer Effect */}
    //         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
    //         <span className="relative">{t("aboutus.membershipButton")}</span>
    //       </button>
    //     </div>
    //   </div>

    //   {/* Stats Section */}
    //   <div className="bg-gradient-to-br from-white via-orange-50 to-white py-16 px-4 md:px-8">
    //     <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
    //       {data.map((item, index) => (
    //         <div
    //           key={String(index + 1)}
    //           className="group flex flex-col gap-4 items-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl border-2 border-orange-100 hover:border-primary transition-all duration-300 hover:scale-105 animate-pop-up"
    //           style={{ animationDelay: `${index * 0.1}s` }}
    //         >
    //           <h3 className="text-primary font-bold text-sm md:text-lg text-center group-hover:scale-110 transition-transform">
    //             {item.title}
    //           </h3>
    //           <p className="text-black font-bold text-3xl md:text-5xl text-center">
    //             {item.value}
    //           </p>
    //         </div>
    //       ))}
    //     </div>
    //   </div>

    //   <Testimonials />
    //   <div
    //     // style={{ backgroundImage: `url(${Wheel})` }}md:min-h-screen
    //     className="w-full  bg-contain bg-right bg-no-repeat mt-10 justify-center items-center flex"
    //   >
    //     <InviteFriend />
    //   </div>
    // </div>
    <div className="font-poppins">
      {/* Hero Section with Gradient */}
      <div
        ref={heroRef}
        className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-100 py-16 md:py-20"
      >
        {/* Decorative Blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-blob pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-300/5 rounded-full blur-3xl animate-blob animation-delay-2000 pointer-events-none"></div>

        <div
          className={`relative z-10 flex flex-col gap-6 px-4 md:px-6 justify-center items-center transition-all duration-1000 ${
            heroVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-black text-center">
            {t("aboutus.title")}
          </h1>
          <p className="text-sm md:text-base lg:text-lg max-w-3xl text-black font-semibold text-center leading-relaxed">
            {t("aboutus.subtitle")}
          </p>
        </div>
      </div>

      {/* About Section with Image */}
      <div
        ref={aboutRef}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-8 lg:px-16 py-12 max-w-7xl mx-auto"
      >
        <div
          className={`flex justify-center items-center transition-all duration-1000 ${
            aboutVisible
              ? "opacity-100 -translate-x-0"
              : "opacity-0 -translate-x-10"
          }`}
        >
          <img src={aboutus} alt="About Us" className="rounded-3xl shadow-xl" />
        </div>

        <div
          className={`flex flex-col gap-6 justify-center transition-all duration-1000 delay-200 ${
            aboutVisible
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-10"
          }`}
        >
          <h2 className="text-base md:text-xl font-bold text-primary">
            {t("aboutus.title")}
          </h2>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-black leading-tight">
            {t("aboutus.sectionTitle")}
          </h1>
        </div>
      </div>

      {/* Description Section */}
      <div
        ref={descRef}
        className={`flex justify-center items-center px-4 md:px-8 py-8 transition-all duration-1000 ${
          descVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <p className="text-black font-semibold text-sm md:text-base max-w-4xl text-center leading-relaxed">
          {t("aboutus.description")}
        </p>
      </div>

      {/* Blessing Section with Glass Effect */}
      <div
        ref={blessingRef}
        className="relative bg-cover bg-center bg-no-repeat flex items-center justify-center mt-16 min-h-[450px] py-12 px-4"
        style={{ backgroundImage: `url(${bgWheel})` }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Glass Card */}
        <div
          className={`relative bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 w-full max-w-3xl text-center shadow-2xl border border-white/20 transition-all duration-1000 ${
            blessingVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
        >
          <h2 className="font-bold text-orange-200 text-2xl md:text-4xl mb-6">
            {t("aboutus.blessingTitle")}
          </h2>
          <p className="font-medium text-white text-sm md:text-base leading-relaxed">
            {t("aboutus.blessingDescription")}
          </p>
        </div>
      </div>

      {/* Welcome Section */}
      <div
        ref={welcomeRef}
        className="relative overflow-hidden bg-gradient-to-br from-white via-orange-50 to-white py-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          <div
            className={`flex justify-center items-center order-2 md:order-1 transition-all duration-1000 ${
              welcomeVisible
                ? "opacity-100 -translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            <img
              src={sideimg}
              alt="Welcome"
              className="rounded-3xl shadow-xl hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div
            className={`flex flex-col gap-4 justify-center order-1 md:order-2 transition-all duration-1000 delay-200 ${
              welcomeVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            <h3 className="text-base md:text-xl font-bold text-primary">
              {t("aboutus.welcomeTitle")}
            </h3>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-black leading-tight">
              {t("aboutus.welcomeHeading")}
            </h2>
            <div className="text-sm md:text-base text-black font-semibold leading-relaxed space-y-4">
              <p>{t("aboutus.welcomeDescription")}</p>
              <p>{t("aboutus.welcomeDescription2")}</p>
              <p>{t("aboutus.welcomeDescription3")}</p>
              <p className="font-bold text-primary">{t("aboutus.founder")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div
        ref={faqRef}
        className="bg-gradient-to-br from-orange-50 via-white to-orange-50 py-16 px-4 md:px-8"
      >
        <div className="max-w-4xl mx-auto">
          <h2
            className={`text-2xl md:text-3xl text-primary font-bold text-center mb-12 transition-all duration-1000 ${
              faqVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {t("aboutus.faqTitle")}
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`group border-2 rounded-2xl transition-all duration-700 hover:shadow-lg ${
                  faqVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                } ${
                  openIndex === index
                    ? "bg-gradient-to-r from-primary/10 to-orange-100 border-primary shadow-md"
                    : "bg-white border-orange-200 hover:border-primary/50"
                }`}
                style={{
                  transitionDelay: faqVisible ? `${index * 100}ms` : "0ms",
                }}
              >
                {/* Question */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center p-5 md:p-6 text-left group-hover:text-primary transition-colors"
                >
                  <span className="text-sm md:text-base font-semibold text-gray-800 pr-4">
                    {faq.question}
                  </span>

                  <div className="flex-shrink-0">
                    {openIndex === index ? (
                      <img
                        src={minuscircle}
                        alt="collapse"
                        className="w-6 h-6 transition-transform duration-300 rotate-180"
                      />
                    ) : (
                      <img
                        src={pluscircle}
                        alt="expand"
                        className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
                      />
                    )}
                  </div>
                </button>

                {/* Answer */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-5 md:px-6 pb-5 text-sm md:text-base text-black font-semibold leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Membership Section */}
      <div
        ref={membershipRef}
        className="relative bg-cover bg-center bg-no-repeat flex items-center justify-center min-h-[450px] py-16 px-4"
        style={{ backgroundImage: `url(${bgWheel})` }}
      >
        {/* Colored Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-200/40 to-orange-100/30"></div>

        {/* Content */}
        <div
          className={`relative z-10 max-w-3xl mx-auto text-center space-y-6 transition-all duration-1000 ${
            membershipVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-black">
            {t("aboutus.membershipTitle")}
          </h2>
          <p className="text-sm md:text-base text-gray-800 leading-relaxed max-w-2xl mx-auto">
            {t("aboutus.membershipDescription")}
          </p>
          <button className="group relative bg-primary hover:bg-primary/90 text-white font-bold text-lg px-10 py-4 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden">
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
            <span className="relative">{t("aboutus.membershipButton")}</span>
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div
        ref={statsRef}
        className="bg-gradient-to-br from-white via-orange-50 to-white py-16 px-4 md:px-8"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {data.map((item, index) => (
            <div
              key={String(index + 1)}
              className={`group flex flex-col gap-4 items-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl border-2 border-orange-100 hover:border-primary transition-all duration-700 hover:scale-105 ${
                statsVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{
                transitionDelay: statsVisible ? `${index * 100}ms` : "0ms",
              }}
            >
              <h3 className="text-primary font-bold text-sm md:text-lg text-center group-hover:scale-110 transition-transform">
                {item.title}
              </h3>
              <p className="text-black font-bold text-3xl md:text-5xl text-center">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Testimonials />

      <div className="w-full bg-contain bg-right bg-no-repeat mt-10 justify-center items-center flex">
        <InviteFriend />
      </div>
    </div>
  );
};

export default AboutUs;
