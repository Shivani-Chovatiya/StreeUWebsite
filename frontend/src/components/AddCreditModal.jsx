// import React, { useEffect, useState } from "react";

// import { doc, getDoc } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { db } from "../config/firebase";
// import { toast } from "react-toastify";

// const AddCreditModal = ({ onClose, onPay, paymentLoading }) => {
//   const [credits, setCredits] = useState("");
//   const [pricePerCredit, setPricePerCredit] = useState(0);
//   const [currency, setCurrency] = useState("₹");
//   const [total, setTotal] = useState(0);
//   const [loading, setLoading] = useState(true);

//   const auth = getAuth();

//   useEffect(() => {
//     const fetchPricing = async () => {
//       try {
//         const pricingRef = doc(db, "systemConfig", "creditPricing");
//         const pricingSnap = await getDoc(pricingRef);

//         const userRef = doc(db, "users", auth.currentUser.uid);
//         const userSnap = await getDoc(userRef);

//         if (pricingSnap.exists() && userSnap.exists()) {
//           const pricing = pricingSnap.data();
//           const user = userSnap.data();
//           console.log("User Data:", user);
//           if (user.locationData.country === "India") {
//             setPricePerCredit(pricing.indiaPrice);
//             setCurrency("₹");
//           } else {
//             setPricePerCredit(pricing.internationalPrice);
//             setCurrency("$");
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching pricing:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPricing();
//   }, []);

//   useEffect(() => {
//     if (credits && pricePerCredit) {
//       setTotal(Number(credits) * pricePerCredit);
//     } else {
//       setTotal(0);
//     }
//   }, [credits, pricePerCredit]);

//   const handlePay = () => {
//     if (!credits || credits <= 0) {
//       toast.error("Enter valid credit amount");
//       return;
//     }

//     onPay({
//       credits: Number(credits),
//       totalAmount: total,
//       currency: currency,
//     });
//   };

//   if (loading) return null;
//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-3 md:p-12">
//       <div className="bg-white  rounded-3xl p-10 shadow-2xl relative">
//         {/* Title */}
//         <h2 className="text-xl md:text-3xl font-bold text-center mb-10">
//           Add Credit
//         </h2>

//         {/* Label */}
//         <p className="text-sm md:text-xl font-medium mb-4">
//           Add No. of credits you want to add
//         </p>

//         {/* Input Box */}
//         <div className="bg-[#FFE5CC] rounded-2xl p-3 mb-10">
//           <input
//             type="number"
//             value={credits}
//             onChange={(e) => setCredits(e.target.value)}
//             onWheel={(e) => e.target.blur()}
//             placeholder="Enter credits (e.g. 10)"
//             className="w-full bg-transparent text-xs md:text-sm outline-none"
//           />
//         </div>
//         <div className="mb-8 text-lg font-medium text-center">
//           1 Credit = {currency}
//           {pricePerCredit}
//           <br />
//           Total = {currency}
//           {total.toFixed(3)}
//         </div>
//         {/* Pay Button */}
//         <div className="flex justify-center">
//           <button
//             disabled={paymentLoading}
//             onClick={handlePay}
//             className={`${paymentLoading ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-primary hover:bg-orange-700 text-white"}  text-xl font-semibold px-8 py-3 rounded-xl transition`}
//           >
//             {paymentLoading ? "Processing payment, please wait..." : "Pay Now"}
//           </button>
//         </div>

//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-5 right-6 text-gray-400 hover:text-black text-xl"
//         >
//           ✕
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AddCreditModal;
import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../config/firebase";
import { toast } from "react-toastify";

const AddCreditModal = ({ onClose, onPay, paymentLoading }) => {
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

  useEffect(() => {
    if (credits && pricePerCredit) {
      setTotal(Number(credits) * pricePerCredit);
    } else {
      setTotal(0);
    }
  }, [credits, pricePerCredit]);

  const handlePay = () => {
    if (!credits || credits <= 0) {
      toast.error("Enter valid credit amount");
      return;
    }

    onPay({
      credits: Number(credits),
      totalAmount: total,
      currency: currency,
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="relative w-full max-w-md bg-gradient-to-br from-white via-orange-50/30 to-white rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Decorative Blobs */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-300/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={(e) => {
            console.log("Close button clicked!");
            onClose();
          }}
          type="button"
          className="absolute top-4 right-4 z-50 w-10 h-10 bg-gray-100 hover:bg-red-100 rounded-full flex items-center justify-center transition-colors duration-300 group "
        >
          <svg
            className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors pointer-events-none"
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
        {/* Content */}
        <div className="relative z-10 p-8 md:p-10">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-orange-400 rounded-2xl flex items-center justify-center shadow-lg animate-bounce-gentle">
              {currency === "₹" ? (
                <h1 className="text-xl md:text-4xl text-white font-bold">₹</h1>
              ) : (
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
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-6">
            Add Credits
          </h2>

          {/* Label */}
          <p className="text-sm md:text-base text-gray-600 font-medium mb-4 text-center">
            Enter the number of credits you want to purchase
          </p>

          {/* Input Box */}
          <div className="bg-gradient-to-r from-orange-100 to-orange-50 border-2 border-primary/30 rounded-2xl p-4 mb-6 focus-within:border-primary transition-colors">
            <input
              type="number"
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
              onWheel={(e) => e.target.blur()}
              placeholder="Enter credits (e.g. 10)"
              className="w-full bg-transparent text-base md:text-lg font-semibold text-gray-900 placeholder-gray-400 outline-none"
            />
          </div>

          {/* Pricing Info */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-5 mb-6 space-y-2">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Price per credit:</span>
              <span className="font-bold text-primary text-lg">
                {currency}
                {pricePerCredit}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
              <span className="text-base font-semibold text-gray-900">
                Total Amount:
              </span>
              <span className="text-2xl font-bold text-primary">
                {currency}
                {total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Pay Button */}
          <button
            disabled={paymentLoading || !credits || credits <= 0}
            onClick={handlePay}
            className="group relative w-full bg-gradient-to-r from-primary to-orange-400 hover:from-primary/90 hover:to-orange-400/90 disabled:from-gray-300 disabled:to-gray-300 text-white text-lg font-bold py-4 rounded-xl shadow-lg hover:shadow-2xl disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 disabled:transform-none transition-all duration-300 overflow-hidden"
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

            <span className="relative flex items-center justify-center gap-2">
              {paymentLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Pay Now
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCreditModal;
