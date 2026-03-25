import React, { useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import AddCreditModal from "../components/AddCreditModal";
import Login from "../components/Login";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import PaymentSuccessModal from "../components/PsychologicalScreens/PaymentSuccessModal";
const tabs = ["All", "Purchases", "Refund Credits", "Usage"];

const Wallet = () => {
  const [userData, setUserData] = useState(null);
  const [usageData, setUsageData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentModalDisplay, setPaymentModalDisplay] = useState(false);
  const [addedCreditsDisplay, setAddedCreditsDisplay] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [compatibilityData, setCompatibilityData] = useState([]);

  const getPayments = async (uid) => {
    const q = query(collection(db, "payments"), where("userId", "==", uid));

    const snapshot = await getDocs(q);

    const paymentsdata = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const paymentsDetails = paymentsdata.filter(
      (item) =>
        (item.status === "success" || item.status === "cancelled") &&
        item.credits !== "Not Applicable",
    );

    setPayments(paymentsDetails);
  };

  const fetchUser = async (userData) => {
    const user = userData ? userData : auth.currentUser;
    if (!user) {
      setShowLogin(true);
      return;
    }
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userDocData = docSnap.data();

      setUserData(userDocData);
      getPayments(userDocData.uid);

      const usage = userDocData?.futurePrediction
        ? Object.entries(userDocData.futurePrediction).map(([id, item]) => ({
            id,
            ...item,
            type: "usage",
          }))
        : [];

      setUsageData(usage);
      // Compatibility Usage (NEW)
      const compatibility = userDocData?.compatibility
        ? Object.entries(userDocData.compatibility).map(([id, item]) => ({
            id,
            ...item,
            type: "compatibility",
            category: "Compatibility",
          }))
        : [];

      setCompatibilityData(compatibility);
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
  useEffect(() => {
    const successPayments = payments.filter(
      (item) => item.status === "success",
    );

    const oldPayments = payments;
    const formattedUsage = usageData
      .filter((item) => item.status === "success")
      .map((item) => ({
        id: item.id,
        status: item.status === "success" ? "used" : "failed",
        amount: 0, // usage doesn't need money
        credits: item.status === "success" ? item.creditsUsed || 0 : 0,
        question: item.question,
        answer: item.answer,
        createdAt: item.createdAt,
        type: "usage",
      }));
    const cancelledPayments = [
      ...payments.filter((item) => item.status === "cancelled"),
      ...usageData
        .filter((item) => item.status !== "success") // failed usage
        .map((item) => ({
          id: item.id,
          status: "cancelled", // treat as refund
          amount: 0,
          credits: 0,
          question: item.question,
          answer: item.answer,
          createdAt: item.createdAt,
          type: "usage",
        })),
      ...compatibilityData
        .filter((item) => item.status !== "success")
        .map((item) => ({
          id: item.id,
          status: "cancelled",
          amount: 0,
          credits: 0,
          question: item.question,
          answer: item.answer,
          createdAt: item.createdAt,
          type: "compatibility",
          category: "Compatibility",
        })),
    ];
    // Format Compatibility Usage (NEW)
    const formattedCompatibility = compatibilityData
      .filter((item) => item.status === "success")
      .map((item) => ({
        id: item.id,
        status: "used",
        amount: 0,
        credits: item.creditsUsed || 1,
        question: item.question,
        answer: item.answer,
        createdAt: item.createdAt,
        type: "compatibility",
        category: "Compatibility",
      }));
    console.log(cancelledPayments);
    if (activeTab === "Purchases") {
      setFilteredPayments(successPayments);
    } else if (activeTab === "Refund Credits") {
      setFilteredPayments(cancelledPayments);
    } else if (activeTab === "Usage") {
      setFilteredPayments([...formattedUsage, ...formattedCompatibility]);
    } else {
      // ✅ Merge ALL
      setFilteredPayments(
        [
          ...payments,
          ...formattedUsage,
          ...formattedCompatibility,
          ...cancelledPayments,
        ].sort((a, b) => {
          // Sort by date, newest first
          const dateA = a.createdAt?.toDate
            ? a.createdAt.toDate()
            : new Date(a.createdAt);
          const dateB = b.createdAt?.toDate
            ? b.createdAt.toDate()
            : new Date(b.createdAt);
          return dateB - dateA;
        }),
      );
    }
  }, [activeTab, payments, usageData]);

  console.log(payments, usageData);

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
    <div className="font-poppins min-h-screen flex flex-col gap-8 justify-center items-center bg-gradient-to-br from-orange-50 via-white to-orange-100 py-16 md:py-20 px-4">
      <div className="w-full max-w-2xl">
        {/* Balance Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary to-orange-400 rounded-3xl shadow-2xl p-3 md:p-6 animate-scale-in">
          {/* Animated Background Blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-blob pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-blob animation-delay-2000 pointer-events-none"></div>

          {/* Content */}
          <div className="relative z-10 text-center space-y-6">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-24 md:h-24 bg-white/20 backdrop-blur-sm rounded-full border-4 border-white/30 shadow-xl animate-bounce-gentle">
              {userData?.locationData &&
              userData?.locationData?.country === "India" ? (
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
                <span className="text-xl md:text-4xl ml-3">Credits</span>
              </h2>
            </div>

            {/* Add Credit Button */}
            <button
              onClick={() => setShowModal(true)}
              className="group relative bg-white text-primary font-bold text-xs md:text-xl px-4 py-2 md:px-10 md:py-5 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden animate-pop-up"
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
      {/* <div className="p-3 md:p-6">
        <h1 className="text-3xl font-semibold mb-6">Wallet History</h1>

        <div className="flex flex-wrap gap-4 justify-center mt-10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full border text-lg font-medium transition 
            ${
              activeTab === tab
                ? "bg-black text-white border-black"
                : "bg-white text-gray-400 border-gray-300"
            }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {filteredPayments.map((payment) => (
            <div key={payment.id} className="bg-gray-100 p-4 rounded-xl mb-3">
              <h3 className="font-semibold">
                {payment.status === "cancelled"
                  ? "Refund Issued"
                  : "Payment Successful"}
              </h3>

              <p className="text-sm text-gray-500">
                {payment.currency === "INR" ? "₹" : "$"}
                {payment.amount}
              </p>

              <p className="text-xs text-gray-400">
                {payment.createdAt?.toDate().toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}{" "}
                {payment.createdAt?.toDate().toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                })}
              </p>
              <div className="text-green-600 font-semibold mt-2">
                +{payment.credits} Credit
              </div>
            </div>
          ))}
        </div>
      </div> */}

      {/* Wallet History Section */}
      <div className="w-full max-w-6xl px-4 md:px-6">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Wallet History
          </h1>
          <p className="text-gray-500">
            Track all your transactions and credit movements
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          {[
            {
              label: "Total Spent",
              value: `${userData?.locationData?.country === "India" ? "₹" : "$"}${filteredPayments
                .filter(
                  (p) =>
                    p.type !== "usage" &&
                    p.type !== "compatibility" &&
                    p.status === "success",
                )
                .reduce((s, p) => s + (p.amount || 0), 0)}`,
            },
            {
              label: "Transactions",
              value: filteredPayments.filter(
                (p) => p.type !== "usage" && p.type !== "compatibility",
              ).length,
            },
            {
              label: "Credits Earned",
              value: `+${filteredPayments
                .filter(
                  (p) =>
                    p.type !== "usage" &&
                    p.type !== "compatibility" &&
                    p.status === "success",
                )
                .reduce((s, p) => s + (p.credits || 0), 0)}`,
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-gray-50 rounded-xl p-4 border border-primary"
            >
              <p className="text-xs text-gray-500 mb-1">{label}</p>
              <p className="text-xl font-semibold text-gray-900">{value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeTab === tab
                  ? "bg-gradient-to-r from-primary to-orange-400 text-white shadow-sm"
                  : "bg-white text-gray-500 border border-gray-200 hover:border-primary hover:text-primary"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {!userData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse"
              >
                <div className="h-5 bg-gray-100 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
                <div className="h-6 bg-gray-100 rounded w-1/3 mt-4"></div>
              </div>
            ))}
          </div>
        ) : filteredPayments.length > 0 ? (
          <div className="flex justify-center">
            <div
              className={`grid grid-cols-1 ${filteredPayments.length === 1 ? "md:grid-cols-1 lg:grid-cols-1 md:w-1/4 " : filteredPayments.length === 2 ? "md:grid-cols-2 lg:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"}  gap-5`}
            >
              {filteredPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="bg-white rounded-2xl p-6 border border-primary hover:shadow-md transition-all duration-200"
                >
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        payment.type === "usage" ||
                        payment.type === "compatibility"
                          ? payment.status === "used"
                            ? "bg-orange-50"
                            : "bg-red-50"
                          : payment.status === "cancelled"
                            ? "bg-green-50"
                            : "bg-blue-50"
                      }`}
                    >
                      {payment.type === "usage" ||
                      payment.type === "compatibility" ? (
                        payment.status === "used" ? (
                          /* 🔶 USED ICON */
                          <svg
                            className="w-6 h-6 text-orange-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                        ) : (
                          /* ❌ FAILED ICON */
                          <svg
                            className="w-6 h-6 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                        )
                      ) : payment.status === "cancelled" ? (
                        /* 🔄 REFUND ICON */
                        <svg
                          className="w-6 h-6 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16 15L12 19M12 19L8 15M12 19V9.5C12 7.01472 14.0147 5 16.5 5C18.9853 5 21 7.01472 21 9.5C21 11.9853 18.9853 14 16.5 14H13"
                          />
                        </svg>
                      ) : (
                        /* 💰 PAYMENT ICON */
                        <svg
                          className="w-6 h-6 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-base leading-tight">
                        {payment.type === "usage" ||
                        payment.type === "compatibility"
                          ? payment.status === "used"
                            ? "Credits Used"
                            : "Failed Attempt"
                          : payment.status === "cancelled"
                            ? "Refund Issued"
                            : "Payment Successful"}
                      </h3>

                      {/* Category Badge */}
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            payment.type === "compatibility"
                              ? "bg-purple-100 text-purple-700"
                              : payment.type === "usage"
                                ? "bg-orange-100 text-orange-700"
                                : payment.status === "cancelled"
                                  ? "bg-green-100 text-green-600"
                                  : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {payment.type === "compatibility"
                            ? "Compatibility"
                            : payment.type === "usage"
                              ? "Future Prediction"
                              : payment.status === "cancelled"
                                ? "Refunded"
                                : "Purchase"}
                        </span>
                      </div>

                      {/* Question Preview */}
                      {(payment.type === "usage" ||
                        payment.type === "compatibility") && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {payment.question}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="mb-4">
                    {payment.type === "usage" ||
                    payment.type === "compatibility" ? (
                      <>
                        <p className="text-3xl font-bold text-gray-900">
                          {payment.status === "used" ? "-" : ""}
                          {payment.status === "used" ? payment.credits : 0}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {payment.status === "used"
                            ? "Credits Used"
                            : "Failed Attempt"}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-3xl font-bold text-gray-900">
                          {payment.currency === "INR" ? "₹" : "$"}
                          {payment.amount}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Transaction amount
                        </p>
                      </>
                    )}
                  </div>

                  {/* Date & Time */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {payment.createdAt?.toDate
                        ? payment.createdAt
                            .toDate()
                            .toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                        : new Date(payment.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {payment.createdAt?.toDate
                        ? payment.createdAt
                            .toDate()
                            .toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })
                        : new Date(payment.createdAt).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            },
                          )}
                    </div>
                  </div>

                  {/* Credits Footer */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-gray-400">Credits</span>
                      <span
                        className={`flex items-center gap-0.5 font-semibold text-base px-2 py-1 rounded ${
                          payment.type === "usage" ||
                          payment.type === "compatibility"
                            ? payment.status === "used"
                              ? "bg-orange-50 text-orange-600"
                              : "bg-red-50 text-red-600"
                            : payment.status === "cancelled"
                              ? "bg-green-50 text-green-600"
                              : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {payment.type === "usage" ||
                        payment.type === "compatibility"
                          ? payment.status === "used"
                            ? `-${payment.credits}`
                            : "0"
                          : payment.status === "cancelled"
                            ? `+${payment.credits}`
                            : `+${payment.credits}`}
                      </span>
                    </div>

                    {/* Type Badge */}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        payment.type === "compatibility"
                          ? "bg-purple-100 text-purple-700"
                          : payment.type === "usage"
                            ? "bg-orange-100 text-orange-700"
                            : payment.status === "cancelled"
                              ? "bg-green-100 text-green-600"
                              : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {payment.type === "compatibility"
                        ? "Compatibility Check"
                        : payment.type === "usage"
                          ? "Future Prediction"
                          : payment.status === "cancelled"
                            ? "Refund"
                            : "Purchase"}
                    </span>
                  </div>
                </div>
              ))}
            </div>{" "}
          </div>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-5">
              <svg
                className="w-8 h-8 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Transactions Yet
            </h3>
            <p className="text-sm text-gray-400 text-center max-w-xs mb-6">
              Your transaction history will appear here once you make your first
              purchase or receive a refund.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-primary to-orange-400 text-white px-7 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              + Add Credits
            </button>
          </div>
        )}
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

//  {filteredPayments.map((payment) => (
//                 <div
//                   key={payment.id}
//                   className="bg-white rounded-2xl p-6 border border-primary hover:shadow-md transition-all duration-200"
//                 >
//                   {/* Header */}
//                   <div className="flex items-center gap-3 mb-5">
//                     <div
//                       className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
//                         payment.type === "usage"
//                           ? payment.status === "used"
//                             ? "bg-orange-50"
//                             : "bg-red-50"
//                           : payment.status === "cancelled"
//                             ? "bg-green-50"
//                             : "bg-blue-50"
//                       }`}
//                     >
//                       {payment.type === "usage" ? (
//                         payment.status === "used" ? (
//                           /* 🔶 USED / CONSUMED ICON (Bolt/Activity) */
//                           <svg
//                             className="w-6 h-6 text-orange-600"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                             strokeWidth="2"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               d="M13 10V3L4 14h7v7l9-11h-7z"
//                             />
//                           </svg>
//                         ) : (
//                           /* ❌ FAILED / ERROR ICON */
//                           <svg
//                             className="w-6 h-6 text-red-600"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                             strokeWidth="2"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
//                             />
//                           </svg>
//                         )
//                       ) : payment.status === "cancelled" ? (
//                         /* 🔄 REFUND / RETURN ICON */
//                         <svg
//                           className="w-6 h-6 text-green-600"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                           strokeWidth="2"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M16 15L12 19M12 19L8 15M12 19V9.5C12 7.01472 14.0147 5 16.5 5C18.9853 5 21 7.01472 21 9.5C21 11.9853 18.9853 14 16.5 14H13"
//                           />
//                         </svg>
//                       ) : (
//                         /* 💰 SUCCESSFUL PAYMENT ICON (Credit Card) */
//                         <svg
//                           className="w-6 h-6 text-blue-600"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                           strokeWidth="2"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
//                           />
//                         </svg>
//                       )}
//                     </div>

//                     <div>
//                       <h3 className="font-semibold text-gray-900 text-base leading-tight">
//                         <h3 className="font-semibold text-gray-900 text-base leading-tight">
//                           {payment.type === "usage"
//                             ? payment.status === "used"
//                               ? "Credits Used"
//                               : "Failed Attempt"
//                             : payment.status === "cancelled"
//                               ? "Refund Issued"
//                               : "Payment Successful"}
//                         </h3>
//                       </h3>
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                           payment.type === "usage"
//                             ? payment.status === "used"
//                               ? "bg-green-100 text-green-600"
//                               : "bg-red-100 text-red-600"
//                             : payment.status === "cancelled"
//                               ? "bg-green-100 text-green-600"
//                               : "bg-blue-100 text-blue-600"
//                         }`}
//                       >
//                         {payment.type === "usage"
//                           ? payment.status === "used"
//                             ? "Used"
//                             : "Failed"
//                           : payment.status === "cancelled"
//                             ? "Refund Issued"
//                             : "Payment Successful"}
//                       </span>
//                       {payment.type === "usage" && (
//                         <div className="mt-2">
//                           <p className="text-xs text-gray-500 line-clamp-2">
//                             {payment.question}
//                           </p>

//                           {/* <p className="text-xs mt-1 font-medium">
//                             {payment.status === "used" ? (
//                               <span className="text-orange-500">
//                                 Credits Used: {payment.credits}
//                               </span>
//                             ) : (
//                               <span className="text-red-500">
//                                 Failed • Credits Used: 0
//                               </span>
//                             )}
//                           </p> */}
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Amount */}
//                   <div className="mb-4">
//                     {payment.type === "usage" ? (
//                       <>
//                         <p className="text-3xl font-bold text-gray-900">
//                           {payment.status === "used" ? "-" : ""}
//                           {payment.status === "used" ? payment.credits : 0}
//                         </p>
//                         <p className="text-xs text-gray-400 mt-0.5">
//                           {payment.status === "used"
//                             ? "Credits Used"
//                             : "Failed Attempt"}
//                         </p>
//                       </>
//                     ) : (
//                       <>
//                         <p className="text-3xl font-bold text-gray-900">
//                           {payment.currency === "INR" ? "₹" : "$"}
//                           {payment.amount}
//                         </p>
//                         <p className="text-xs text-gray-400 mt-0.5">
//                           Transaction amount
//                         </p>
//                       </>
//                     )}
//                   </div>

//                   {/* Date & Time */}
//                   <div className="flex items-center gap-4 mb-4">
//                     <div className="flex items-center gap-1.5 text-xs text-gray-400">
//                       <svg
//                         className="w-3.5 h-3.5"
//                         fill="currentColor"
//                         viewBox="0 0 20 20"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                       {payment.createdAt?.toDate().toLocaleDateString("en-GB", {
//                         day: "numeric",
//                         month: "short",
//                         year: "numeric",
//                       })}
//                     </div>
//                     <div className="flex items-center gap-1.5 text-xs text-gray-400">
//                       <svg
//                         className="w-3.5 h-3.5"
//                         fill="currentColor"
//                         viewBox="0 0 20 20"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                       {payment.createdAt?.toDate().toLocaleTimeString("en-US", {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                         hour12: true,
//                       })}
//                     </div>
//                   </div>

//                   {/* Credits + Badge */}
//                   <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
//                     <div className="flex items-center gap-1.5">
//                       <span className="text-xs text-gray-400">Credits</span>

//                       <span
//                         className={`flex items-center gap-0.5 font-semibold text-base px-2 py-1 rounded ${
//                           payment.type === "usage"
//                             ? payment.status === "used"
//                               ? "bg-orange-50 text-orange-600"
//                               : "bg-red-50 text-red-600"
//                             : payment.status === "cancelled"
//                               ? "bg-green-50 text-green-600"
//                               : "bg-blue-50 text-blue-600"
//                         }`}
//                       >
//                         {/* SIGN */}
//                         {payment.type === "usage"
//                           ? payment.status === "used"
//                             ? "-"
//                             : "0"
//                           : payment.status === "cancelled"
//                             ? "+"
//                             : "+"}

//                         {/* VALUE */}
//                         {payment.type === "usage"
//                           ? payment.status === "used"
//                             ? payment.credits
//                             : ""
//                           : payment.credits}
//                       </span>
//                     </div>

//                     {/* BADGE */}
//                     <span
//                       className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                         payment.type === "usage"
//                           ? payment.status === "used"
//                             ? "bg-orange-100 text-orange-600"
//                             : "bg-red-100 text-red-600"
//                           : payment.status === "cancelled"
//                             ? "bg-green-100 text-green-600"
//                             : "bg-blue-100 text-blue-600"
//                       }`}
//                     >
//                       {payment.type === "usage"
//                         ? payment.status === "used"
//                           ? "Credits Used"
//                           : "Failed Attempt"
//                         : payment.status === "cancelled"
//                           ? "Refund Issued"
//                           : "Payment Successful"}
//                     </span>
//                   </div>
//                 </div>
//               ))}
