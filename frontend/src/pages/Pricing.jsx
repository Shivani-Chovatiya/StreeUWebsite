import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import vector from "../assets/Aboutusimg/Vector.png";
import Wheel from "../assets/Aboutusimg/Wheel.png";
import InviteFriend from "../components/InviteFriend";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const Pricing = () => {
  const { t } = useTranslation();
  const [credits, setCredits] = useState("");
  const [pricePerCredit, setPricePerCredit] = useState(0);
  const [currency, setCurrency] = useState("₹");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const pricingRef = doc(db, "systemConfig", "creditPricing");
        const pricingSnap = await getDoc(pricingRef);

        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (pricingSnap.exists() && userSnap.exists()) {
          const pricing = pricingSnap.data();
          const user = userSnap.data();

          if (user.locationData.country === "India") {
            setPricePerCredit(pricing.indiaPrice);
            setCurrency("₹");
          } else {
            setPricePerCredit(pricing.internationalPrice);
            setCurrency("$");
          }
        }
      } catch (error) {
        console.error("Error fetching pricing:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPricing();
  }, []);

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
  return (
    // <div className="font-poppins mt-10">
    //   <div className="flex flex-col gap-6 p-3 md:p-6 justify-center items-center">
    //     <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-black text-center p-3 animate-slide-up">
    //       Pricing
    //     </h1>
    //     <h1 className="text-xs md:text-sm font-semibold md:w-3/4 text-black text-center p-3 animate-slide-up-delay">
    //       Integrating future predictions with psychological counselling. Get
    //       personalized insights and guidance tailored for you. Save your
    //       valuable time & money
    //     </h1>
    //   </div>
    //   <div className="flex justify-center items-center">
    //     <h1 className="text-black font-bold text-xl">
    //       Future prediction packages
    //     </h1>
    //   </div>
    //   <div className="p-2 md:p-6">
    //     <div className="mt-10 bg-[#FFE6CE] p-2 gap-3 rounded-xl m-3  items-center flex flex-row justify-between">
    //       <h1 className="text-primary text-sm md:text-xl text-center">
    //         Ask Anything in just 1 Credit 1 credit = ₹100only
    //       </h1>
    //       {/* <button className="bg-primary px-6 py-3 rounded-xl text-white font-bold">
    //         Select
    //       </button> */}
    //     </div>
    //   </div>
    //   <div className="p-2 md:p-6">
    //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 m-4 ">
    //       {paidPackages.map((item, i) => (
    //         <div
    //           key={String(i + 1)}
    //           className="bg-[#FFE6CE] p-3 rounded-2xl justify-center flex items-center flex-col gap-3"
    //         >
    //           <div className="flex justify-center items-center flex-col">
    //             <h1 className="text-primary font-bold text-xl">{item.price}</h1>
    //             <h1 className="text-gray-400 text-sm ">(Tax included)</h1>
    //           </div>
    //           <ul className="list-disc flex justify-center items-start flex-col">
    //             <li className="text-black font-bold text-sm">
    //               {item.details.split(" • ")[0]}
    //             </li>
    //             <li className="text-black font-bold text-sm">
    //               {item.details.split(" • ")[1]}
    //             </li>
    //             <li className="text-black font-bold text-sm">
    //               {item.details.split(" • ")[2]}
    //             </li>
    //           </ul>
    //           {/* <button className="px-6 py-2 text-white font-bold bg-primary rounded-2xl">
    //             Select Package
    //           </button> */}
    //         </div>
    //       ))}
    //     </div>
    //   </div>
    //   <div
    //     // style={{ backgroundImage: `url(${Wheel})` }}md:min-h-screen
    //     className="w-full  bg-contain bg-right bg-no-repeat mt-10 justify-center items-center flex"
    //   >
    //     <InviteFriend />
    //   </div>
    // </div>
    <div className="font-poppins">
      {/* Hero Section with Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-100 py-16 md:py-20">
        {/* Decorative Blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-blob pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-300/5 rounded-full blur-3xl animate-blob animation-delay-2000 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col gap-6 px-4 md:px-6 justify-center items-center max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black text-center animate-slide-up">
            Pricing
          </h1>
          <p className="text-sm md:text-sm lg:text-sm max-w-3xl text-black font-semibold text-center animate-slide-up-delay">
            Integrating future predictions with psychological counselling. Get
            personalized insights and guidance tailored for you. Save your
            valuable time & money
          </p>
        </div>
      </div>

      {/* Future Prediction Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Section Title */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-black font-bold text-2xl md:text-3xl">
            Future Prediction Packages
          </h2>
        </div>

        {/* Credit Banner */}
        <div className="mb-12 animate-scale-in">
          <div className="relative overflow-hidden bg-gradient-to-r from-orange-100 via-orange-50 to-orange-100 border-2 border-primary/30 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-orange-400 rounded-2xl flex items-center justify-center shadow-lg">
                  {currency === "₹" ? (
                    // Indian Rupee Icon
                    // <svg
                    //   className="w-8 h-8 text-white"
                    //   fill="currentColor"
                    //   viewBox="0 0 24 24"
                    // >
                    //   <path d="M13.66 7C13.1 5.82 11.9 5 10.5 5H6v2h4.5c.55 0 1.05.22 1.41.59.36.36.59.86.59 1.41 0 1.1-.9 2-2 2H6v2h4.5c.28 0 .5.22.5.5s-.22.5-.5.5H6V16c0 .55.45 1 1 1h3.5c1.93 0 3.5-1.57 3.5-3.5 0-.92-.37-1.75-.96-2.36.59-.61.96-1.44.96-2.36 0-.55-.45-1-1-1h-2.84c.46-.58 1.18-1 2-.1H17V7h-3.34zM6 3h12v2H6V3zm0 16h12v2H6v-2z" />
                    // </svg>
                    <h1 className="text-xl md:text-4xl text-white font-bold">
                      ₹
                    </h1>
                  ) : (
                    // Dollar Icon
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-primary font-bold text-lg md:text-xl">
                    Ask Anything in just 1 Credit
                  </p>
                  <p className="text-gray-600 text-sm md:text-base">
                    1 credit = {currency}
                    {pricePerCredit} only
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-primary animate-bounce-gentle"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-gray-600 font-semibold">
                  Best Value
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Package Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {paidPackages.map((item, i) => (
            <div
              key={String(i + 1)}
              className="group relative bg-gradient-to-br from-white to-orange-50 border-2 border-primary/30 rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-2xl hover:border-primary transition-all duration-300 hover:scale-105 animate-scale-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Popular Badge (for first item) */}
              {i === 0 && (
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-primary to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce-gentle">
                  Popular
                </div>
              )}

              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-3xl pointer-events-none"></div>

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center gap-6">
                {/* Price Section */}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-orange-400 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-10 h-10 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="text-primary font-bold text-2xl md:text-3xl mb-1">
                    {item.price}
                  </h3>
                  <p className="text-gray-500 text-sm">(Tax included)</p>
                </div>

                {/* Features List */}
                <ul className="space-y-3 w-full">
                  {item.details.split(" • ").map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-gray-700"
                    >
                      <svg
                        className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm md:text-base font-medium">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Select Button */}
                {/* <button className="w-full bg-gradient-to-r from-primary to-orange-400 hover:from-primary/90 hover:to-orange-400/90 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300">
                  Select Package
                </button> */}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Friend Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-100 py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <InviteFriend />
        </div>
      </div>
    </div>
  );
};

export default Pricing;
