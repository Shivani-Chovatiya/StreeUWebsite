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
    <div className="font-poppins mt-10">
      <div className="flex justify-center items-center">
        <div className="md:w-1/2 w-3/4 bg-[#EBEBEB] rounded-2xl p-3 flex flex-col justify-center items-center gap-3">
          <h1 className=" text-black font-semibold text-xl">Your Balance</h1>
          <h1 className=" text-primary font-bold text-xl">
            {userData?.credits || 0} Credits
          </h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary text-white px-6 py-2 rounded-md"
          >
            Add Credit
          </button>
        </div>
      </div>
      {/* <div className="p-3 md:p-9">
        <h1 className="text-black text-xl font-semibold">Package History</h1>
        <div></div>
      </div> */}
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
