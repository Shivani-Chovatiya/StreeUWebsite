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
          console.log("User Data:", user);
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

  if (loading) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-3 md:p-12">
      <div className="bg-white  rounded-3xl p-10 shadow-2xl relative">
        {/* Title */}
        <h2 className="text-xl md:text-3xl font-bold text-center mb-10">
          Add Credit
        </h2>

        {/* Label */}
        <p className="text-sm md:text-xl font-medium mb-4">
          Add No. of credits you want to add
        </p>

        {/* Input Box */}
        <div className="bg-[#FFE5CC] rounded-2xl p-3 mb-10">
          <input
            type="number"
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
            onWheel={(e) => e.target.blur()}
            placeholder="Enter credits (e.g. 10)"
            className="w-full bg-transparent text-xs md:text-sm outline-none"
          />
        </div>
        <div className="mb-8 text-lg font-medium text-center">
          1 Credit = {currency}
          {pricePerCredit}
          <br />
          Total = {currency}
          {total.toFixed(3)}
        </div>
        {/* Pay Button */}
        <div className="flex justify-center">
          <button
            disabled={paymentLoading}
            onClick={handlePay}
            className={`${paymentLoading ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-primary hover:bg-orange-700 text-white"}  text-xl font-semibold px-8 py-3 rounded-xl transition`}
          >
            {paymentLoading ? "Processing payment, please wait..." : "Pay Now"}
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-6 text-gray-400 hover:text-black text-xl"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default AddCreditModal;
