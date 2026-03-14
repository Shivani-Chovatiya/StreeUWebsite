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
    <div className="font-poppins mt-10 p-6 md:p-16">
      <div className="flex flex-col gap-6 p-3 md:p-6 justify-center items-center">
        <img src={vector} className="" alt="" />
        <h1 className="p-3 border rounded-2xl text-sm md:text-xl">
          <span className="text-white bg-primary rounded-full text-sm md:text-xl px-2 py-1 md:px-4 md:py-2">
            New
          </span>{" "}
          {t("aboutus.badge")}
        </h1>
        <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-black text-center p-3">
          Paid Assessment
        </h1>
        <h1 className="text-xs md:text-sm font-semibold md:w-3/4 text-black text-center p-3">
          Integrating future predictions with psychological counselling. Get
          personalized insights and guidance tailored for you. Save your
          valuable time & money
        </h1>
      </div>
      <div className="flex flex-col gap-6 justify-center items-center">
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
                    {/* <p className="text-xs text-gray-500 mt-1">₹{item.price}</p> */}
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
                    {/* <img src={Lock} className="object-contain w-4 h-4" /> */}
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
      </div>
      <div
        style={{ backgroundImage: `url(${Wheel})` }}
        className="w-full md:min-h-screen bg-contain bg-right bg-no-repeat mt-10 justify-center items-center flex"
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
