// // import React, { useEffect, useState } from "react";
// // import invitefriend from "../assets/Aboutusimg/invitefriend.png";
// // import refericon from "../assets/Aboutusimg/refericon.png";
// // import { useTranslation } from "react-i18next";
// // import { auth, db } from "../config/firebase";
// // import { doc, getDoc } from "firebase/firestore";

// // const InviteFriend = () => {
// //   const { t } = useTranslation();

// //   const [referralCode, setReferralCode] = useState("");

// //   useEffect(() => {
// //     const getReferralCode = async () => {
// //       const user = auth.currentUser;
// //       if (!user) return;

// //       const docRef = doc(db, "users", user.uid);
// //       const docSnap = await getDoc(docRef);

// //       if (docSnap.exists()) {
// //         setReferralCode(docSnap.data().referralCode);
// //       }
// //     };

// //     getReferralCode();
// //   }, []);

// //   const handleInvite = () => {
// //     const message = `Hey! 😊
// // Join Steer-U and get free astrology insights.

// // Use my referral code: *${referralCode}*

// // Sign up here 👉 http://localhost:5174/profile?referralCode=${referralCode}`;

// //     const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

// //     window.open(whatsappUrl, "_blank");
// //   };

// //   return (
// //     // <div className="font-poppins grid grid-cols-1 md:grid-cols-2 gap-9 md:gap-6">
// //     //   <div className="flex justify-center items-center">
// //     //     <img src={invitefriend} />
// //     //   </div>
// //     //   <div className="flex justify-center items-center flex-col gap-6 p-3 md:p-6">
// //     //     <h1 className="text-center text-black text-xl md:text-3xl font-bold">
// //     //       {t("invite.title")}
// //     //     </h1>
// //     //     <h1 className="text-center text-black text-sm md:text-xl font-semibold">
// //     //       {t("invite.subtitle")}
// //     //     </h1>
// //     //     <button
// //     //       onClick={handleInvite}
// //     //       className="bg-primary py-2 px-5 text-white font-bold rounded-2xl flex flex-row gap-2"
// //     //     >
// //     //       <img src={refericon} className="w-5 h-5" />
// //     //       <h1> {t("invite.button")}</h1>
// //     //     </button>
// //     //   </div>
// //     // </div>
// //     <>
// //       <div className="font-poppins grid grid-cols-1 md:grid-cols-2 gap-9 md:gap-6 relative">
// //         {/* Floating Background Elements */}
// //         <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
// //           <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-primary/40 rounded-full animate-float-slow"></div>
// //           <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-orange-300/40 rounded-full animate-float-medium"></div>
// //           <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-primary/40 rounded-full animate-float-fast"></div>
// //           <div className="absolute top-1/2 left-1/3 w-3 h-3 bg-orange-200/40 rounded-full animate-float-medium delay-500"></div>
// //         </div>

// //         {/* Image Section */}
// //         <div className="flex justify-center items-center">
// //           <div className="relative group">
// //             {/* Animated glow effect */}
// //             <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-orange-300/30 to-primary/30 rounded-3xl blur-lg opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>

// //             {/* Image with hover effect */}
// //             <img
// //               src={invitefriend}
// //               alt="Invite Friend"
// //               className="relative transform transition-all duration-500 hover:scale-105 hover:rotate-2"
// //             />
// //           </div>
// //         </div>

// //         {/* Content Section */}
// //         <div className="flex justify-center items-center flex-col gap-6 p-3 md:p-6 relative z-10">
// //           {/* Animated Title */}
// //           <h1 className="text-center text-black text-xl md:text-3xl font-bold animate-fade-in-down">
// //             {t("invite.title")}
// //           </h1>

// //           {/* Animated Subtitle */}
// //           <h1 className="text-center text-black text-sm md:text-xl font-semibold animate-fade-in-up">
// //             {t("invite.subtitle")}
// //           </h1>

// //           {/* Animated Button */}
// //           <button
// //             onClick={handleInvite}
// //             className="relative bg-primary py-3 px-6 text-white font-bold rounded-2xl flex flex-row gap-2 items-center overflow-hidden group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 shadow-lg"
// //           >
// //             {/* Shimmer effect */}
// //             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

// //             {/* Icon with rotation on hover */}
// //             <img
// //               src={refericon}
// //               alt="Refer Icon"
// //               className="w-5 h-5 relative z-10 transform transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
// //             />

// //             {/* Button text */}
// //             <h1 className="relative z-10">{t("invite.button")}</h1>

// //             {/* Hover glow */}
// //             <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
// //           </button>
// //         </div>
// //       </div>

// //       {/* CSS Animations */}
// //       <style jsx>{`
// //         @keyframes fade-in-down {
// //           0% {
// //             opacity: 0;
// //             transform: translateY(-20px);
// //           }
// //           100% {
// //             opacity: 1;
// //             transform: translateY(0);
// //           }
// //         }

// //         @keyframes fade-in-up {
// //           0% {
// //             opacity: 0;
// //             transform: translateY(20px);
// //           }
// //           100% {
// //             opacity: 1;
// //             transform: translateY(0);
// //           }
// //         }

// //         @keyframes float-slow {
// //           0%,
// //           100% {
// //             transform: translateY(0px);
// //           }
// //           50% {
// //             transform: translateY(-20px);
// //           }
// //         }

// //         @keyframes float-medium {
// //           0%,
// //           100% {
// //             transform: translateY(0px) translateX(0px);
// //           }
// //           50% {
// //             transform: translateY(-15px) translateX(10px);
// //           }
// //         }

// //         @keyframes float-fast {
// //           0%,
// //           100% {
// //             transform: translateY(0px);
// //           }
// //           50% {
// //             transform: translateY(-25px);
// //           }
// //         }

// //         .animate-fade-in-down {
// //           animation: fade-in-down 0.8s ease-out;
// //         }

// //         .animate-fade-in-up {
// //           animation: fade-in-up 0.8s ease-out 0.2s backwards;
// //         }

// //         .animate-float-slow {
// //           animation: float-slow 6s ease-in-out infinite;
// //         }

// //         .animate-float-medium {
// //           animation: float-medium 5s ease-in-out infinite;
// //         }

// //         .animate-float-fast {
// //           animation: float-fast 4s ease-in-out infinite;
// //         }

// //         .delay-500 {
// //           animation-delay: 0.5s;
// //         }
// //       `}</style>
// //     </>
// //   );
// // };

// // export default InviteFriend;
// import React, { useEffect, useState } from "react";
// import invitefriend from "../assets/Aboutusimg/invitefriend.png";
// import refericon from "../assets/Aboutusimg/refericon.png";
// import { useTranslation } from "react-i18next";
// import { auth, db } from "../config/firebase";
// import { doc, getDoc } from "firebase/firestore";

// const InviteFriend = () => {
//   const { t } = useTranslation();
//   const [referralCode, setReferralCode] = useState("");

//   useEffect(() => {
//     const getReferralCode = async () => {
//       const user = auth.currentUser;
//       if (!user) return;

//       const docRef = doc(db, "users", user.uid);
//       const docSnap = await getDoc(docRef);

//       if (docSnap.exists()) {
//         setReferralCode(docSnap.data().referralCode);
//       }
//     };

//     getReferralCode();
//   }, []);

//   const handleInvite = () => {
//     const message = `Hey! 😊
// Join Steer-U and get free astrology insights.

// Use my referral code: *${referralCode}*

// Sign up here 👉 http://localhost:5174/profile?referralCode=${referralCode}`;

//     const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
//     window.open(whatsappUrl, "_blank");
//   };

//   return (
//     <div className="font-poppins grid grid-cols-1 md:grid-cols-2 gap-9 md:gap-6 relative">
//       {/* Floating Background Elements */}
//       <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
//         <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-primary/40 rounded-full animate-float-slow"></div>
//         <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-orange-300/40 rounded-full animate-float-medium"></div>
//         <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-primary/40 rounded-full animate-float-fast"></div>
//         <div className="absolute top-1/2 left-1/3 w-3 h-3 bg-orange-200/40 rounded-full animate-float-medium"></div>
//       </div>

//       {/* Image Section */}
//       <div className="flex justify-center items-center">
//         <div className="relative group">
//           {/* Animated glow effect */}
//           <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-orange-300/30 to-primary/30 rounded-3xl blur-lg opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>

//           {/* Image with hover effect */}
//           <img
//             src={invitefriend}
//             alt="Invite Friend"
//             className="relative transform transition-all duration-500 hover:scale-105 hover:rotate-2"
//           />
//         </div>
//       </div>

//       {/* Content Section */}
//       <div className="flex justify-center items-center flex-col gap-6 p-3 md:p-6 relative z-10">
//         {/* Animated Title */}
//         <h1 className="text-center text-black text-xl md:text-3xl font-bold animate-fade-in-down">
//           {t("invite.title")}
//         </h1>

//         {/* Animated Subtitle */}
//         <h1 className="text-center text-black text-sm md:text-xl font-semibold animate-fade-in-up">
//           {t("invite.subtitle")}
//         </h1>

//         {/* Animated Button */}
//         <button
//           onClick={handleInvite}
//           className="relative bg-primary py-3 px-6 text-white font-bold rounded-2xl flex flex-row gap-2 items-center overflow-hidden group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 shadow-lg"
//         >
//           {/* Shimmer effect */}
//           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

//           {/* Icon with rotation on hover */}
//           <img
//             src={refericon}
//             alt="Refer Icon"
//             className="w-5 h-5 relative z-10 transform transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
//           />

//           {/* Button text */}
//           <h1 className="relative z-10">{t("invite.button")}</h1>

//           {/* Hover glow */}
//           <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default InviteFriend;
import React, { useEffect, useState } from "react";
import invitefriend from "../assets/Aboutusimg/invitefriend.png";
import refericon from "../assets/Aboutusimg/refericon.png";
import { useTranslation } from "react-i18next";
import { auth, db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import Login from "./Login";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { onAuthStateChanged } from "firebase/auth";

const InviteFriend = () => {
  const { t } = useTranslation();
  const [referralCode, setReferralCode] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();

  const getReferralCode = async (userData) => {
    const user = userData ? userData : auth.currentUser;
    if (!user) {
      return;
    }

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setReferralCode(docSnap.data().referralCode);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        getReferralCode(user);
      } else {
        getReferralCode();
      }
    });

    return () => unsubscribe();
  }, []);

  const handleInvite = () => {
    if (!referralCode || referralCode === "") {
      toast.error("Please login first");
      setShowLogin(true);
      return;
    }
    const message = `Hey! 😊  
Join Steer-U and get free astrology insights.  

Use my referral code: *${referralCode}*  

Sign up here 👉 http://localhost:5174/profile?referralCode=${referralCode}`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="w-full  mx-auto px-4 py-12">
      {/*max-w-7xl Main Card with Gradient Background */}
      <div className="relative bg-gradient-to-br from-orange-50 via-white to-orange-50 rounded-3xl shadow-xl overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-300/5 rounded-full blur-3xl"></div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12">
          {/* Image Section */}
          <div className="flex justify-center items-center ">
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-orange-400/20 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Image */}
              <img
                src={invitefriend}
                alt="Invite Friend"
                className="relative w-full max-w-sm transform transition-transform duration-700 hover:scale-105 animate-float-gentle"
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="flex flex-col justify-center items-start space-y-6 ">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold animate-slide-down">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              Refer & Earn
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight animate-slide-up">
              {t("invite.title")}
            </h1>

            {/* Subtitle */}
            <p className="text-base md:text-lg text-gray-600 leading-relaxed animate-slide-up-delay">
              {t("invite.subtitle")}
            </p>

            {/* Referral Code Display */}
            {referralCode && (
              <div className="w-full bg-white border-2 border-primary/20 rounded-xl p-4 animate-fade-in">
                <p className="text-xs text-gray-500 mb-1">Your Referral Code</p>
                <p className="text-xl font-bold text-primary tracking-wider">
                  {referralCode}
                </p>
              </div>
            )}

            {/* CTA Button */}
            <button
              onClick={handleInvite}
              className="group relative w-full md:w-auto bg-primary hover:bg-primary/90 text-white font-bold text-lg px-2 py-2 md:px-8 md:py-4 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

              {/* Button Content */}
              <span className="relative flex items-center justify-center gap-3">
                <img
                  src={refericon}
                  alt="Refer"
                  className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300"
                />
                {t("invite.button")}
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
            </button>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 text-sm text-gray-500 animate-fade-in-delay">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Instant Rewards</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Easy Sharing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Login
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        screenName={location.pathname}
      />
    </div>
  );
};

export default InviteFriend;
