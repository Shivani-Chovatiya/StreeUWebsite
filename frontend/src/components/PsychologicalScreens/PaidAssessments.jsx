import React from "react";
import InviteFriend from "../InviteFriend";
import vector from "../../assets/Aboutusimg/Vector.png";
import Wheel from "../../assets/Aboutusimg/Wheel.png";
import { useTranslation } from "react-i18next";
import Lock from "../../assets/Lock.png";
import ComingSoon from "../ComingSoon";
import { useEffect } from "react";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { useState } from "react";
import Login from "../Login";
import { toast } from "react-toastify";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import PaymentSuccessModal from "./PaymentSuccessModal";

const tests = [
  { title: "Learning Pattern", credit: "8 Credit" },
  { title: "Memory", credit: "15 Credit" },
  { title: "Developmental delays", credit: "12 Credit" },
  { title: "Relationship issues / compatibility", credit: "20 Credit" },
  { title: "I.Q", credit: "25 Credit" },
  { title: "OCD", credit: "25 Credit" },
  { title: "ADHD", credit: "25 Credit" },
  { title: "ADHD screening", credit: "10 Credit" },
  { title: "Autism", credit: "25 Credit" },
  { title: "Mental Retardation", credit: "35 Credit" },
  { title: "Depression, Anxiety & Stress", credit: "15 Credit" },
  { title: "Anxiety only", credit: "8 Credit" },
  { title: "Depression only", credit: "8 Credit" },
  { title: "Stress only", credit: "8 Credit" },
  { title: "EQ Test / ET", credit: "15 Credit" },
  { title: "Learning Disability", credit: "20 Credit" },
  { title: "Behavioral screening", credit: "10 Credit" },
  { title: "Personality Test", credit: "20 Credit" },
];
const PaidAssessments = () => {
  const { t } = useTranslation();
  const [assessments, setAssessments] = useState();
  const [userDetails, setUserDetails] = useState();
  const [showLogin, setShowLogin] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(null);
  const [paymentResponse, setPaymentResponse] = useState();
  const [paymentModalDisplay, setPaymentModalDisplay] = useState(false);

  const fetchAssessments = async () => {
    try {
      const q = query(
        collection(db, "paid_assessments"),
        where("status", "==", "Active"),
      );

      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAssessments(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const [purchased, setPurchased] = useState([]);

  const fetchUserPurchases = async (userData) => {
    const user = userData ? userData : auth.currentUser;
    if (!user) return;

    const docSnap = await getDoc(doc(db, "users", user.uid));

    if (docSnap.exists()) {
      setPurchased(docSnap.data().purchasedAssessments || []);
      const userData = docSnap.data();
      setUserDetails(userData);
    }
  };
  console.log(purchased);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserPurchases(user);
      } else {
        setPurchased([]);
      }
    });

    return () => unsubscribe();
  }, []);
  const currencyMap = {
    "₹": "INR",
    $: "USD",
  };
  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };
  const handlePayment = async (item, user) => {
    setPaymentLoading(item.id);
    console.log(item, user);
    let currency = "₹";
    let price = item.price;
    if (user.locationData.country === "India") {
      currency = "₹";
      price = item.price;
    } else {
      currency = "$";
      price = item.usdPrice;
    }
    const currencyCode = currencyMap[currency] || "INR";
    try {
      const res2 = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js",
      );

      if (!res2) {
        toast.error("Razorpay SDK failed to load");
        return;
      }

      const res = await axios.post(
        // "http://127.0.0.1:5001/steer-u/us-central1/createOrder",
        "https://us-central1-steer-u.cloudfunctions.net/createOrder",
        {
          amount: price,
          // amount: 1,
          userId: auth.currentUser.uid,
          paidAssessments: "PaidAssessments",
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

        name: "Paid Assessment",
        description: "Assessment Payment",

        handler: async function (response) {
          console.log(response);
          setPaymentResponse({
            ...response,
            amount: data.amount,
            currency,
            name: "Paid Assessment",
          });
          setPaymentModalDisplay(true);
          const userRef = doc(db, "users", auth.currentUser.uid);

          await updateDoc(userRef, {
            purchasedAssessments: arrayUnion(item.id),
          });

          toast.success(`Payment Successful. Data Selected.`);
          await addDoc(collection(db, "notifications"), {
            userId: user?.uid,
            therapistId: "N/A",
            credits: "N/A",
            message: "Assessment purchased successfully.",
            type: "assessmentspurchased",
            createdAt: new Date(),
            isRead: false,
          });
          setPurchased((prev) => [...prev, item.id]);
          fetchUserPurchases();
          setPaymentLoading(null);
        },
        modal: {
          ondismiss: function () {
            toast.error("Payment cancelled");
            setPaymentLoading(null);
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
      setPaymentLoading(null);
    }
  };
  const handleSubmit = async (item) => {
    const user = auth.currentUser;

    if (!user) {
      toast.error("Please login first");
      setShowLogin(true);

      return;
    }

    handlePayment(item, userDetails);
  };
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const isIndia = timeZone === "Asia/Kolkata" || timeZone === "Asia/Calcutta";

  return (
    <div className="font-poppins mt-10 px-4 md:px-8 lg:px-16  mx-auto">
      {/* max-w-7xl */}
      <div className="flex flex-col gap-6 p-3 md:p-6 justify-center items-center">
        <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-black text-center p-3 animate-slide-up">
          Paid Assessment
        </h1>
        <h1 className="text-sm md:text-sm lg:text-sm max-w-3xl text-black font-semibold text-center animate-slide-up-delay">
          Integrating future predictions with psychological counselling. Get
          personalized insights and guidance tailored for you. Save your
          valuable time & money
        </h1>
      </div>
      {/* <div className="flex flex-col gap-6 justify-center items-center">
        <h1 className="font-bold text-black text-xl">
          Choose any 8-10 symptoms
        </h1>
        <div
          className={`grid grid-cols-1 ${
            assessments && assessments.length === 1
              ? "md:grid-cols-1"
              : "md:grid-cols-2"
          } gap-5 justify-center items-center`}
        >
          {assessments ? (
            assessments.length > 0 ? (
              assessments.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    if (
                      !purchased.includes(item.id) &&
                      paymentLoading !== item.id
                    ) {
                      handleSubmit(item);
                    }
                  }}
                  className={`flex items-center justify-between border border-primary rounded-xl px-5 py-4 bg-[#F9F9F9] hover:shadow-md transition cursor-pointer ${
                    paymentLoading === item.id
                      ? "opacity-60 pointer-events-none"
                      : ""
                  }`}
                >
                  <div>
                    <h3 className="font-semibold text-sm">{item.sentence}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {paymentLoading === item.id
                        ? "Opening payment..."
                        : userDetails
                          ? userDetails.locationData.country === "India"
                            ? `₹${item.price}`
                            : `$${item.usdPrice}`
                          : isIndia
                            ? `₹${item.price}`
                            : ` $${item.usdPrice}`}
                    </p>
                  </div>

                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FFEBCC]">
                  
                    {purchased.includes(item.id) ? (
                      <span className="text-green-600 text-lg font-bold">
                        ✔
                      </span>
                    ) : (
                      <img src={Lock} className="object-contain w-4 h-4" />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center col-span-2">
                No assessments available
              </div>
            )
          ) : (
            <div className="text-center col-span-2">Loading assessments...</div>
          )}
        </div>
      </div> */}
      <div className="flex flex-col gap-8 justify-center items-center mx-auto">
        {/* Header with Counter max-w-5xl */}
        <div className="w-full bg-gradient-to-r from-primary/10 via-orange-50 to-primary/10 rounded-2xl p-6 shadow-md animate-fade-in-down">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="font-bold text-black text-xl md:text-2xl mb-2">
                Choose Any 8-10 Assessments
              </h1>
              <p className="text-sm text-gray-600">
                Select assessments to unlock personalized insights
              </p>
            </div>

            {/* Purchase Counter (Optional) */}
            <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-xl shadow-sm">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {purchased.length}
                </div>
                <div className="text-xs text-gray-500">Purchased</div>
              </div>
            </div>
          </div>
        </div>

        {/* Assessments Grid */}
        <div
          className={`grid grid-cols-1 ${
            assessments && assessments.length === 1
              ? "md:grid-cols-1"
              : "md:grid-cols-2"
          } gap-5 w-full`}
        >
          {assessments ? (
            assessments.length > 0 ? (
              assessments.map((item, index) => {
                const isPurchased = purchased.includes(item.id);
                const isLoading = paymentLoading === item.id;

                return (
                  <div
                    key={index}
                    onClick={() => {
                      if (!isPurchased && !isLoading) {
                        handleSubmit(item);
                      }
                    }}
                    className={`group relative flex items-center justify-between border-2 rounded-2xl px-5 py-5 transition-all duration-300 animate-scale-in ${
                      isPurchased
                        ? "bg-green-50 border-green-300 cursor-default"
                        : isLoading
                          ? "bg-gray-100 border-gray-300 opacity-60 cursor-wait"
                          : "bg-white border-primary/30 hover:border-primary hover:shadow-xl hover:scale-105 cursor-pointer"
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Shimmer Effect on Hover (for unpurchased items) */}
                    {!isPurchased && !isLoading && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl"></div>
                    )}

                    {/* Content */}
                    <div className="relative z-10 flex-1">
                      <div className="flex items-start gap-3">
                        {/* Icon/Number Badge */}
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            isPurchased
                              ? "bg-green-500 text-white"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          {isPurchased ? "✓" : index + 1}
                        </div>

                        {/* Text Content */}
                        <div className="flex-1">
                          <h3
                            className={`font-semibold text-sm md:text-base leading-relaxed ${
                              isPurchased ? "text-green-800" : "text-gray-800"
                            }`}
                          >
                            {item.sentence}
                          </h3>

                          {/* Price */}
                          <div className="flex items-center gap-2 mt-2">
                            <p
                              className={`text-lg font-bold ${
                                isPurchased ? "text-green-600" : "text-primary"
                              }`}
                            >
                              {isLoading
                                ? "Processing..."
                                : userDetails
                                  ? userDetails.locationData.country === "India"
                                    ? `₹${item.price}`
                                    : `$${item.usdPrice}`
                                  : isIndia
                                    ? `₹${item.price}`
                                    : `$${item.usdPrice}`}
                            </p>

                            {isPurchased && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                                Purchased
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Lock/Check Icon */}
                    <div
                      className={`relative z-10 flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ${
                        isPurchased
                          ? "bg-green-500 scale-110"
                          : isLoading
                            ? "bg-gray-300 animate-pulse"
                            : "bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110"
                      }`}
                    >
                      {isPurchased ? (
                        <svg
                          className="w-6 h-6 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : isLoading ? (
                        <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <img
                          src={Lock}
                          className="object-contain w-5 h-5"
                          alt="Lock"
                        />
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-12 animate-fade-in">
                <div className="inline-flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-medium">
                    No assessments available
                  </p>
                </div>
              </div>
            )
          ) : (
            <div className="col-span-full text-center py-12 animate-pulse">
              <div className="inline-flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium">
                  Loading assessments...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div
        // style={{ backgroundImage: `url(${Wheel})` }}md:min-h-screen
        className="w-full  bg-contain bg-right bg-no-repeat mt-10 justify-center items-center flex"
      >
        <InviteFriend />
      </div>
      <Login
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        screenName={"psychological-counselling/paid-assessments"}
      />
      {paymentModalDisplay && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-3 md:p-12">
          <PaymentSuccessModal
            onClose={() => {
              setPaymentModalDisplay(false);
              setPaymentLoading(null);
              setPaymentResponse();
            }}
            text="Your paid assessment has been successfully purchased. It will be available in your account shortly."
            paymentResponse={paymentResponse}
          />
        </div>
      )}
    </div>
    // <ComingSoon />
  );
};

export default PaidAssessments;
