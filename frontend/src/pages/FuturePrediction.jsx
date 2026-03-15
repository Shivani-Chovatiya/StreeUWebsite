import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import vector from "../assets/Aboutusimg/Vector.png";
import InviteFriend from "../components/InviteFriend";
import Wheel from "../assets/Aboutusimg/Wheel.png";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ComingSoon from "../components/ComingSoon";
import Login from "../components/Login";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
const CREDIT_OPTIONS = ["credit1", "credit2", "credit3", "customizedQuestion"];
import Swal from "sweetalert2";

const FuturePrediction = () => {
  const { t } = useTranslation();
  const { title } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [selectedCredit, setSelectedCredit] = useState("credit1");
  const [showLogin, setShowLogin] = useState(false);
  const [screenName, setScreenName] = useState("");
  useEffect(() => {
    if (title) {
      setSelectedCredit(title);
    }
  }, [title]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        console.log(user);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, []);
  console.log(userData);
  // const questions = t(`futurePrediction.questions.${selectedCredit}`, {
  //   returnObjects: true,
  // });

  const fetchquestions = async () => {
    const q = query(
      collection(db, "predictionQuestions"),
      where("credits", "==", Number(selectedCredit.split("credit")[1])),
    );

    const querySnapshot = await getDocs(q);

    const questionsList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setQuestions(questionsList);
  };

  useEffect(() => {
    fetchquestions();
  }, [selectedCredit]);
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#D04500",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Logout",
    });

    if (result.isConfirmed) {
      try {
        await signOut(auth);

        await Swal.fire({
          title: "Logged Out!",
          text: "You have been successfully logged out.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        navigate(location.pathname);
      } catch (error) {
        console.error("Logout error:", error);

        Swal.fire({
          title: "Error!",
          text: "Something went wrong while logging out.",
          icon: "error",
        });
      }
    }
  };

  const questionCreditCost =
    selectedCredit === "credit1" ? 1 : selectedCredit === "credit2" ? 2 : 3;

  // const handleAskQuestion = async (questionData) => {
  //   await updateDoc(doc(db, "users", userData.uid), {
  //     credits: increment(-questionCreditCost),
  //   });
  // };
  const handleAskQuestion = async (questionData) => {
    try {
      const userRef = doc(db, "users", userData.uid);

      // 🔹 Get latest user data from Firestore
      const userSnap = await getDoc(userRef);
      const latestCredits = userSnap.data().credits;

      // ❌ Prevent negative credits
      // if (latestCredits < questionCreditCost) {
      //   alert("Not enough credits");
      //   return;
      // }

      // 🔹 1️⃣ Deduct credits
      await updateDoc(userRef, {
        credits: increment(-questionCreditCost),
      });
      setUserData((prev) => ({
        ...prev,
        credits: prev.credits - questionCreditCost,
      }));
      // 🔹 2️⃣ Store question in Firestore
      // await addDoc(collection(db, "questions"), {
      //   userId: userData.uid,
      //   question: questionData.question,
      //   creditUsed: questionCreditCost,
      //   status: "pending",
      //   createdAt: serverTimestamp(),
      // });

      // alert("Question submitted successfully ✅");
    } catch (error) {
      console.error("Error asking question:", error);
    }
  };
  return (
    <div className="font-poppins mt-10">
      <div className="flex flex-col gap-6 p-3 md:p-6 justify-center items-center bg-[#F5D6C7] m-3 md:m-6 rounded-2xl">
        {/* <img src={vector} className="" /> */}
        <h1 className="p-3 border rounded-2xl text-xs md:text-xl animate-slide-in-left">
          <span className="animate-pulse text-white bg-primary rounded-full text-sm md:text-xl px-2 py-1  md:px-4 md:py-2">
            New
          </span>{" "}
          {t("aboutus.badge")}
        </h1>
        <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-black text-center p-3 animate-slide-up">
          {t("futurePrediction.pageTitle")}
        </h1>
        <h1 className="text-xs md:text-sm lg:text-sm font-semibold md:w-3/4 text-black text-center p-3 animate-slide-up-delay">
          {t("futurePrediction.subtitle")}
        </h1>
        {isLoggedIn ? (
          <button
            onClick={() => handleLogout()}
            className="bg-primary text-white px-8 py-3 rounded-lg font-semibold flex items-center mx-auto hover:opacity-90 transition-opacity"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => {
              setScreenName(`future-prediction/${selectedCredit}`);
              setShowLogin(true);
            }}
            className="bg-primary text-white px-8 py-3 rounded-lg font-semibold flex items-center mx-auto hover:opacity-90 transition-opacity"
          >
            {t("futurePrediction.login")}
          </button>
        )}
        <Login
          isOpen={showLogin}
          onClose={() => setShowLogin(false)}
          screenName={screenName}
        />
      </div>

      {/* Section 3: Credit/Question Selection Tabs */}
      <section className="px-4 md:px-8 py-6">
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          {CREDIT_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => {
                setSelectedCredit(option);
                navigate(`/future-prediction/${option}`);
              }}
              className={`min-w-[140px] md:min-w-[180px] px-6 py-3 rounded-xl font-semibold text-sm md:text-base transition-all ${
                selectedCredit === option
                  ? "bg-primary text-white border-2 border-primary"
                  : "bg-white text-primary border-2 border-primary hover:bg-primary/5"
              }`}
            >
              {t(`futurePrediction.${option}`)}
            </button>
          ))}
        </div>
      </section>

      {/* Section 4: Prediction Questions List */}
      <section className="px-4 md:px-8 pb-16 max-w-3xl mx-auto">
        <div className="flex flex-col gap-4">
          {Array.isArray(questions) &&
          selectedCredit !== "customizedQuestion" ? (
            questions.map((q, index) => (
              <div
                key={String(index + 1)}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 md:p-5 bg-white rounded-2xl shadow-sm border border-primary hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  if (!isLoggedIn) {
                    setShowLogin(true);
                    return;
                  }

                  if (
                    !userData?.credits ||
                    userData.credits < questionCreditCost
                  ) {
                    Swal.fire({
                      title: "Insufficient Credits",
                      text: "You don’t have enough credits. Please recharge your credits.",
                      icon: "warning",
                      confirmButtonText: "Recharge Now",
                      confirmButtonColor: "#D04500",
                      showCancelButton: true,
                      cancelButtonText: "Cancel",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        // setShowRechargeModal(true); // your AddCredit modal
                      }
                    });

                    return;
                  }
                  // handleAskQuestion(q);
                }}
              >
                <p className="text-black text-sm md:text-base flex-1 font-bold">
                  {q.question}
                </p>
                <button className="shrink-0 w-full sm:w-auto px-6 py-3 rounded-xl bg-[#F5D6C7] text-primary border border-primary font-bold text-sm hover:opacity-90 transition-opacity">
                  {selectedCredit === "credit1"
                    ? t("futurePrediction.credit1")
                    : selectedCredit === "credit2"
                      ? t("futurePrediction.credit2")
                      : t("futurePrediction.credit3")}
                </button>
              </div>
            ))
          ) : (
            <ComingSoon />
          )}
        </div>
      </section>
      <div
        // style={{ backgroundImage: `url(${Wheel})` }}md:min-h-screen
        className="w-full   bg-contain bg-right bg-no-repeat mt-10 justify-center items-center flex"
      >
        <InviteFriend />
      </div>
    </div>
  );
};

export default FuturePrediction;
