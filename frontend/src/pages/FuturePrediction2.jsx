import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import vector from "../assets/Aboutusimg/Vector.png";
import InviteFriend from "../components/InviteFriend";
import Wheel from "../assets/Aboutusimg/Wheel.png";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ComingSoon from "../components/ComingSoon";
import Login from "../components/Login";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineLocationMarker,
} from "react-icons/hi";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../config/firebase";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { StandaloneSearchBox, useJsApiLoader } from "@react-google-maps/api";
import { useRef } from "react";

const CREDIT_OPTIONS = ["Compatibility", "Birth_Rectification"];
const PREDICTION_QUESTIONS = [
  "question1",
  "question2",
  "question3",
  "question4",
  "question5",
];

const FuturePrediction2 = () => {
  const { t } = useTranslation();
  const { title } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedCredit, setSelectedCredit] = useState("Compatibility");
  const [showLogin, setShowLogin] = useState(false);
  const [screenName, setScreenName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [formData, setFormData] = useState({
    person1: { name: "", birthDate: "", birthTime: "", location: "" },
    person2: { name: "", birthDate: "", birthTime: "", location: "" },
    customizedQuestion: "",
  });
  const searchBoxRef = useRef(null);
  useEffect(() => {
    if (title) {
      setSelectedCredit(title);
    }
  }, [title]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const libraries = ["places"];

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        console.log(user);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
          const data = docSnap.data();
          setFormData((prev) => ({
            ...prev,
            person1: {
              name: data.fullName || "",
              birthDate: data.dob || "",
              birthTime: data.birthTime || "",
              location: data.birthLocation || "",
            },
          }));
        }
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, []);
  console.log(userData);
  const fetchquestions = async () => {
    const q = query(collection(db, "compatibilityQuestions"));

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

  const handleAskQuestion = async (questionData) => {
    try {
      const { name, birthDate, birthTime, location } = formData.person2;

      // ✅ Check person2 details
      if (!name || !birthDate || !birthTime || !location) {
        toast.error("Please fill all Person 2 details first");
        return;
      }
      const userRef = doc(db, "users", userData.uid);
      const questionPayload = {
        compatibilityQuestionsId: questionData.id,
        question: questionData.question,
        person1: { ...formData.person1, uid: userData.uid },
        person2: formData.person2,
        createdAt: new Date(),
        status: "pending",
      };
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
        [`questions.${questionData.id}`]: arrayUnion(questionPayload),
        credits: increment(-questionData.credits),
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

  const updateForm = (person, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [person]: { ...prev[person], [field]: value },
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!isLoggedIn) {
        toast.error("Please login first");
        setShowLogin(true);

        return;
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit. Please try again.");
    }
  };

  return (
    <div className="font-poppins mt-10">
      <div className="border border-primary m-3 md:m-6 rounded-2xl shadow-xl relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-100 py-16 md:py-20">
        {/* Decorative Blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-blob pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-300/5 rounded-full blur-3xl animate-blob animation-delay-2000 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col gap-6 px-4 md:px-6 justify-center items-center max-w-5xl mx-auto">
          <h1 className="p-3 border rounded-2xl text-xs md:text-xl animate-slide-in-left">
            <span className="animate-pulse text-white bg-primary rounded-full text-sm md:text-xl px-2 py-1  md:px-4 md:py-2">
              New
            </span>{" "}
            {t("aboutus.badge")}
          </h1>
          <h1 className="animate-slide-up text-2xl md:text-4xl lg:text-6xl font-bold text-black text-center p-3">
            {t("futurePrediction.pageTitle")}
          </h1>
          <h1 className="animate-slide-up-delay text-xs md:text-sm lg:text-sm font-semibold md:w-3/4 text-black text-center p-3">
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
                setScreenName(`future-predictionscreen/${selectedCredit}`);
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
      </div>

      {/* Section 3: Credit/Question Selection Tabs */}
      <section className="px-4 md:px-8 py-6">
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          {CREDIT_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => {
                setSelectedCredit(option);
                navigate(`/future-predictionscreen/${option}`);
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

      {/* Section 4: Prediction Form or Coming Soon */}
      <section className="px-4 md:px-16 ">
        {selectedCredit !== "Birth_Rectification" ? (
          <div className="flex flex-col gap-6">
            {/* First Person & Second Person Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* First Person */}
              <div className="bg-[#FFE3D5] rounded-2xl p-4 md:p-6 border border-primary ">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {t("futurePrediction.form.firstPerson")}
                </h3>
                <h1 className="text-xs font-semibold text-gray-900 mb-4">
                  Identify the resonance patterns of the partner traveler.
                </h1>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="font-bold text-black">Person1</label>
                    <input
                      type="text"
                      placeholder={`${t("futurePrediction.form.personName")} 1`}
                      value={formData.person1.name}
                      onChange={(e) =>
                        updateForm("person1", "name", e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-3xl border border-primary bg-white focus:border-primary focus:outline-none transition-colors"
                      disabled
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-black">Birth Date</label>
                      <div className="relative">
                        <HiOutlineCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          value={formData.person1.birthDate}
                          onChange={(e) =>
                            updateForm("person1", "birthDate", e.target.value)
                          }
                          className="w-full pl-10 pr-4 py-3 rounded-3xl border border-primary bg-white focus:border-primary focus:outline-none transition-colors"
                          disabled
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-bold text-black">Birth Time</label>
                      <div className="relative">
                        <HiOutlineClock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="time"
                          value={formData.person1.birthTime}
                          onChange={(e) =>
                            updateForm("person1", "birthTime", e.target.value)
                          }
                          className="w-full pl-10 pr-4 py-3 rounded-3xl border border-primary bg-white focus:border-primary focus:outline-none transition-colors"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="font-bold text-black">Location</label>
                    <div className="relative">
                      <HiOutlineLocationMarker className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder={t("futurePrediction.form.location")}
                        value={formData.person1.location}
                        onChange={(e) =>
                          updateForm("person1", "location", e.target.value)
                        }
                        className="w-full pl-10 pr-4 py-3 rounded-3xl border border-primary bg-white focus:border-primary focus:outline-none transition-colors"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Second Person */}
              <div className="bg-[#FFE3D5] rounded-2xl p-4 md:p-6 border border-primary">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {t("futurePrediction.form.secondPerson")}
                </h3>
                <h1 className="text-xs font-semibold text-gray-900 mb-4">
                  Identify the resonance patterns of the partner traveler.
                </h1>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="font-bold text-black">Person2</label>
                    <input
                      type="text"
                      placeholder={`${t("futurePrediction.form.personName")} 2`}
                      value={formData.person2.name}
                      onChange={(e) =>
                        updateForm("person2", "name", e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-3xl border border-primary bg-white focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-black">Birth Date</label>
                      <div className="relative">
                        <HiOutlineCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          value={formData.person2.birthDate}
                          onChange={(e) =>
                            updateForm("person2", "birthDate", e.target.value)
                          }
                          className="w-full pl-10 pr-4 py-3 rounded-3xl border border-primary bg-white focus:border-primary focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-bold text-black">Birth Time</label>
                      <div className="relative">
                        <HiOutlineClock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="time"
                          value={formData.person2.birthTime}
                          onChange={(e) =>
                            updateForm("person2", "birthTime", e.target.value)
                          }
                          className="w-full pl-10 pr-4 py-3 rounded-3xl border border-primary bg-white focus:border-primary focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="font-bold text-black">Location</label>
                    {isLoaded && (
                      <StandaloneSearchBox
                        onLoad={(ref) => (searchBoxRef.current = ref)}
                        onPlacesChanged={() => {
                          const places = searchBoxRef.current.getPlaces();
                          const place = places?.[0];

                          if (!place || !place.address_components) return;

                          const getComponent = (type) =>
                            place.address_components.find((c) =>
                              c.types.includes(type),
                            )?.long_name || "";

                          // Try multiple fallbacks for village/city
                          const villageOrCity =
                            getComponent("locality") ||
                            getComponent("sublocality") ||
                            getComponent("postal_town") ||
                            getComponent("administrative_area_level_3");

                          const taluka = getComponent(
                            "administrative_area_level_3",
                          );
                          const district = getComponent(
                            "administrative_area_level_2",
                          );
                          const state = getComponent(
                            "administrative_area_level_1",
                          );
                          const country = getComponent("country");

                          const lat = place.geometry?.location?.lat();
                          const lng = place.geometry?.location?.lng();

                          // Build clean formatted string (removes empty values)
                          const formattedLocation = [
                            villageOrCity,
                            taluka,
                            district,
                            state,
                            country,
                          ]
                            .filter(Boolean)
                            .join(", ");

                          updateForm("person2", "location", formattedLocation);
                        }}
                      >
                        <input
                          type="text"
                          value={formData.person2.location}
                          placeholder="Search village / city / district / country"
                          className="w-full pl-10 pr-4 py-3 rounded-3xl border border-primary bg-white focus:border-primary focus:outline-none transition-colors"
                          onChange={(e) =>
                            updateForm("person2", "location", e.target.value)
                          }
                        />
                      </StandaloneSearchBox>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Please Select The Question */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {t("futurePrediction.form.selectQuestion")}
              </h3>
              <div className="flex flex-col gap-2">
                {questions.map((q, index) => (
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
                      {q.credits} Credits
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Customized Question */}
            {/* <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {t("futurePrediction.form.customizedQuestionTitle")}
              </h3>
              <p className="text-sm text-primary font-semibold mb-3">
                {t("futurePrediction.form.customizedQuestionSubtitle")}
              </p>
              <textarea
                placeholder={t("futurePrediction.form.customizedPlaceholder")}
                value={formData.customizedQuestion}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    customizedQuestion: e.target.value,
                  }))
                }
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#FFF5EE] focus:border-primary focus:outline-none transition-colors resize-none"
              />
            </div> */}

            {/* Submit Button */}
            {/* <div className="flex justify-center items-center">
              <button
                type="button"
                onClick={() => handleSubmit()}
                className="w-1/2 md:w-1/4 py-4 rounded-xl bg-primary text-white font-semibold text-lg hover:opacity-90 transition-opacity "
              >
                {t("futurePrediction.form.submit")}
              </button>
            </div> */}
          </div>
        ) : (
          <ComingSoon />
        )}
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

export default FuturePrediction2;
