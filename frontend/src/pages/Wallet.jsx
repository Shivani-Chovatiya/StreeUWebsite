import React, { useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  increment,
  updateDoc,
} from "firebase/firestore";
import AddCreditModal from "../components/AddCreditModal";
import Login from "../components/Login";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import PaymentSuccessModal from "../components/PsychologicalScreens/PaymentSuccessModal";

const Wallet = () => {
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentModalDisplay, setPaymentModalDisplay] = useState(false);
  const [addedCreditsDisplay, setAddedCreditsDisplay] = useState(false);

  const fetchUser = async (userData) => {
    const user = userData ? userData : auth.currentUser;
    if (!user) {
      setShowLogin(true);
      return;
    }
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUserData(docSnap.data());
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUser(user);
      } else {
        fetchUser();
      }
    });

    return () => unsubscribe();
  }, []);
  console.log(userData);
  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };
  const currencyMap = {
    "₹": "INR",
    $: "USD",
  };
  const handlePayment = async ({ credits, totalAmount, currency }) => {
    console.log("User wants to buy:", credits, totalAmount, currency);
    setPaymentLoading(true);
    const currencyCode = currencyMap[currency] || "INR";
    try {
      const res2 = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js",
      );

      if (!res2) {
        toast.error("Razorpay SDK failed to load");
        return;
      }

      // const res = await axios.post(
      //   // "https://us-central1-steer-u.cloudfunctions.net/createOrder",
      //   "http://localhost:8180/steer-u/us-central1/createOrder",
      //   {
      //     amount: totalAmount,
      //     userId: auth.currentUser.uid,
      //   },
      // );

      //       razorpay_order_id
      // :
      // "order_SNpG5qvcLzxWgz"
      // razorpay_payment_id
      // :
      // "pay_SNpIvGmbqsRuqO"
      // razorpay_signature
      // :
      // "2af56f26eec41e591f446635ca0268a11a75b1ec0985747d8d65813c6218a3fa"
      // [[Pro
      const res = await axios.post(
        // "http://127.0.0.1:5001/steer-u/us-central1/createOrder",
        "https://us-central1-steer-u.cloudfunctions.net/createOrder",
        {
          amount: totalAmount,
          // amount: 1,
          userId: auth.currentUser.uid,
          credits,
          currency: currencyCode,
        },
      );
      console.log("Order created:", res);
      const data = res.data;

      const options = {
        key: data.key, // key coming from backend
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,

        name: "Therapy Booking",
        description: "Session Payment",

        handler: async function (response) {
          console.log(response);
          setPaymentResponse({
            ...response,
            amount: data.amount,
            currency,
            credits,
          });
          setPaymentModalDisplay(true);
          const userRef = doc(db, "users", auth.currentUser.uid);

          await updateDoc(userRef, {
            credits: increment(credits),
          });

          // toast.success(`Payment Successful. ${credits} credits added`);
          fetchUser();
          setShowModal(false);
          setPaymentLoading(false);
          await addDoc(collection(db, "notifications"), {
            userId: userData?.uid,
            therapistId: "N/A",
            credits: credits,
            message: "Credits purchased successfully.",
            type: "creditspurchased",
            createdAt: new Date(),
            isRead: false,
          });
        },
        modal: {
          ondismiss: function () {
            toast.error("Payment cancelled");
            setPaymentLoading(false);
          },
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error(error);
      toast.error("Payment failed");
      setPaymentLoading(false);
    }
  };

  return (
    // <div className="font-poppins mt-10">
    //   <div className="flex justify-center items-center">
    //     <div className="md:w-1/2 w-3/4 bg-[#EBEBEB] rounded-2xl p-3 flex flex-col justify-center items-center gap-3">
    //       <h1 className=" text-black font-semibold text-xl">Your Balance</h1>
    //       <h1 className=" text-primary font-bold text-xl">
    //         {userData?.credits || 0} Credits
    //       </h1>
    //       <button
    //         onClick={() => setShowModal(true)}
    //         className="bg-primary text-white px-6 py-2 rounded-md"
    //       >
    //         Add Credit
    //       </button>
    //     </div>
    //   </div>

    //   {showModal && (
    //     <AddCreditModal
    //       onClose={() => setShowModal(false)}
    //       onPay={handlePayment}
    //       setPaymentLoading={setPaymentLoading}
    //       paymentLoading={paymentLoading}
    //     />
    //   )}
    <div className="font-poppins min-h-screen flex justify-center items-center bg-gradient-to-br from-orange-50 via-white to-orange-100 py-10 px-4">
      <div className="w-full max-w-2xl">
        {/* Balance Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary to-orange-400 rounded-3xl shadow-2xl p-10 md:p-16 animate-scale-in">
          {/* Animated Background Blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-blob pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-blob animation-delay-2000 pointer-events-none"></div>

          {/* Content */}
          <div className="relative z-10 text-center space-y-6">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full border-4 border-white/30 shadow-xl animate-bounce-gentle">
              {userData.locationData &&
              userData.locationData.country === "India" ? (
                <h1 className="text-xl md:text-4xl text-white font-bold">₹</h1>
              ) : (
                <svg
                  className="w-12 h-12 text-white"
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

            {/* Balance Info */}
            <div className="space-y-3">
              <h1 className="text-white/90 font-semibold text-xl md:text-2xl animate-slide-in-left">
                Your Balance
              </h1>
              <h2 className="text-white font-bold text-5xl md:text-6xl animate-scale-in">
                {userData?.credits || 0}
                <span className="text-3xl md:text-4xl ml-3">Credits</span>
              </h2>
            </div>

            {/* Add Credit Button */}
            <button
              onClick={() => setShowModal(true)}
              className="group relative bg-white text-primary font-bold text-xl px-10 py-5 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden animate-pop-up"
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>

              <span className="relative flex items-center gap-2">
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Credits
              </span>
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <AddCreditModal
          onClose={() => setShowModal(false)}
          onPay={handlePayment}
          setPaymentLoading={setPaymentLoading}
          paymentLoading={paymentLoading}
        />
      )}
      {paymentModalDisplay && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-3 md:p-12">
          <PaymentSuccessModal
            onClose={() => {
              setPaymentModalDisplay(false);
              setPaymentLoading(false);
              setPaymentResponse();
              setAddedCreditsDisplay(true);
            }}
            text="Your wallet is being updated. Your astrology credits will appear in your account shortly."
            paymentResponse={paymentResponse}
          />
        </div>
      )}
      {addedCreditsDisplay && (
        // <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-3 md:p-12">
        //  <div className="bg-white  rounded-3xl p-10 shadow-2xl relative">
        //   </div>
        // </div>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          {/* Modal container */}
          <div className="relative bg-white rounded-[38px]   p-6 sm:p-8 flex flex-col items-center">
            {/* Close button */}
            <button
              onClick={() => {
                fetchUser();
                setAddedCreditsDisplay(false);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              &times;
            </button>

            {/* Check icon */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500 rounded-full flex items-center justify-center mb-4 sm:mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 sm:h-10 sm:w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            {/* Text */}
            <h2 className="text-green-500 text-xl sm:text-2xl font-semibold mb-2 text-center">
              Successfully Credited
            </h2>
            <p className="text-gray-500 text-center text-sm sm:text-base">
              Your credits are successfully added to your wallet.
            </p>
          </div>
        </div>
      )}
      <Login
        isOpen={showLogin}
        onClose={() => {
          setShowLogin(false);
          navigate("/");
        }}
        screenName={"/wallet"}
      />
    </div>
  );
};

export default Wallet;
