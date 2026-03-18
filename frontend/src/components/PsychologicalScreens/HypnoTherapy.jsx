import React, { useEffect, useState } from "react";
import InviteFriend from "../InviteFriend";
import vector from "../../assets/Aboutusimg/Vector.png";
import Wheel from "../../assets/Aboutusimg/Wheel.png";
import { useTranslation } from "react-i18next";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../config/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Login from "../Login";
import BookingModal from "./BookingModal";
import { useScrollAnimation } from "../useScrollAnimation";

const HypnoTherapy = () => {
  const [heroRef, heroVisible] = useScrollAnimation();
  const [infoRef, infoVisible] = useScrollAnimation();
  const [therapistRef, therapistVisible] = useScrollAnimation();
  const { t } = useTranslation();
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);
  const [therapistDetails, setTherapistDetails] = useState(null);
  const darkTags = t("psychology.sessionTags.dark", { returnObjects: true });
  const orangeTags = t("psychology.sessionTags.orange", {
    returnObjects: true,
  });

  const [therapistsData, setTherapistsData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const rowsPerPage = 3;

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

  const fetchTherapists = async () => {
    try {
      const q = query(
        collection(db, "therapists"),
        where("status", "==", "Active"),
        where("serviceType", "==", "HypnoTherapy"),
      );

      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTherapistsData(data);
    } catch (error) {
      console.error("Error fetching therapists:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTherapists();
  }, []);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const isIndia = timeZone === "Asia/Kolkata" || timeZone === "Asia/Calcutta";

  return (
    <div className="font-poppins ">
      <div
        ref={heroRef}
        className={`relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-100 py-16 md:py-20 transition-all duration-1000 ${
          heroVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {" "}
        {/* Decorative Blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-blob pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-300/5 rounded-full blur-3xl animate-blob animation-delay-2000 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col gap-6 px-4 md:px-6 justify-center items-center max-w-5xl mx-auto">
          <h1 className=" text-2xl md:text-4xl lg:text-6xl font-bold text-black text-center p-3 animate-slide-up">
            Hypnotherapy
          </h1>
          <h1 className="text-xs md:text-sm font-semibold md:w-3/4 text-black text-center p-3 animate-slide-up-delay">
            Integrating future predictions with psychological counselling. Get
            personalized insights and guidance tailored for you. Save your
            valuable time & money
          </h1>
        </div>
      </div>
      {/* <div className="bg-[#FFEFDF] p-4 md:p-6 rounded-2xl">
        <h1 className="text-black text-xs md:text-sm font-semibold">
          Hypnotherapy is a therapeutic technique that uses hypnosis to help
          individuals make positive changes to their thoughts, feelings, and
          behaviors.
          <br></br>
          <br></br>A hypnotherapist uses verbal cues, mental imagery, and guided
          relaxation techniques to help you enter a state of focused
          concentration, often called a trance.
          <br></br>
          <br></br>
          In this state, your mind is more receptive to suggestions. The goal is
          to help align your conscious intentions with your subconscious
          beliefs.
          <br></br>
          <br></br>
          Hypnotherapy aims to access the subconscious mind to help change or
          reframe beliefs that are causing problems or hindering progress.
          <br></br>
          <br></br>
          Hypnotherapy can be used for a variety of psychological and physical
          conditions (anxiety, depression, fear, emotional trauma, addiction &
          weight loss).
        </h1>
      </div> */}
      <div
        ref={infoRef}
        className={`max-w-7xl mx-auto px-4 md:px-8 py-12 transition-all duration-1000 ${
          infoVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-100 rounded-3xl shadow-2xl border-2 border-primary/20">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-300/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 p-8 md:p-12 lg:p-16">
            {/* Header Section */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-bold text-primary uppercase tracking-wider">
                  What is Hypnotherapy?
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Understanding Hypnotherapy
              </h2>

              <div className="w-20 h-1 bg-gradient-to-r from-primary to-orange-400 rounded-full"></div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Main Description */}
              <div className="space-y-6">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-primary/10 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange-400 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path
                          fillRule="evenodd"
                          d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2 text-lg">
                        Therapeutic Technique
                      </h3>
                      <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                        Hypnotherapy is a therapeutic technique that uses
                        hypnosis to help individuals make positive changes to
                        their thoughts, feelings, and behaviors.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-primary/10 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange-400 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2 text-lg">
                        The Process
                      </h3>
                      <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                        A hypnotherapist uses verbal cues, mental imagery, and
                        guided relaxation techniques to help you enter a state
                        of focused concentration, often called a trance.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-primary/10 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange-400 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2 text-lg">
                        How It Works
                      </h3>
                      <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                        In this state, your mind is more receptive to
                        suggestions. The goal is to help align your conscious
                        intentions with your subconscious beliefs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Benefits & Uses */}
              <div className="space-y-6">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-primary/10 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange-400 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2 text-lg">
                        The Goal
                      </h3>
                      <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                        Hypnotherapy aims to access the subconscious mind to
                        help change or reframe beliefs that are causing problems
                        or hindering progress.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Conditions Treated */}
                <div className="bg-gradient-to-br from-primary/10 to-orange-100 rounded-2xl p-6 shadow-md border-2 border-primary/30">
                  <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                    <svg
                      className="w-6 h-6 text-primary"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Can Help With:
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "Anxiety",
                      "Depression",
                      "Fear",
                      "Emotional Trauma",
                      "Addiction",
                      "Weight Loss",
                    ].map((condition, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-white/60 rounded-xl px-3 py-2"
                      >
                        <svg
                          className="w-4 h-4 text-green-600 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-xs md:text-sm font-semibold text-gray-800">
                          {condition}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Card */}
                <div className="bg-gradient-to-r from-primary to-orange-400 rounded-2xl p-6 text-white shadow-xl">
                  <h3 className="font-bold text-xl mb-3">
                    Ready to Start Your Journey?
                  </h3>
                  <p className="text-white/90 text-sm mb-4">
                    Book a session with our certified hypnotherapists today.
                  </p>
                  {/* <button className="w-full bg-white text-primary font-bold py-3 rounded-xl hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 shadow-lg">
                    Book Appointment →
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="mt-10 grid grid-cols-1 md:grid-cols-3">
        <div className="col-span-1 border border-primary  text-black justify-center items-center flex ">
          {therapistsData[0] && (
            <img
              src={therapistsData[0].imageUrl}
              className="w-3/4 h-1/2 md:w-3/4 md:h-1/2"
            />
          )}
        </div>
        <div className="col-span-2 bg-white rounded-lg p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xl font-bold text-primary mb-2">
            {therapistsData[0] && therapistsData[0].name}
          </p>
          <p className="text-xl  font-bold text-black mb-3">
            {therapistsData[0] &&
              (userData
                ? userData.locationData.country === "India"
                  ? `₹${therapistsData[0].price}`
                  : `$${therapistsData[0].usdPrice}`
                : isIndia
                  ? `₹${therapistsData[0].price}`
                  : `$${therapistsData[0].usdPrice}`)}
            /session
          </p>
          <p className="text-sm text-black mb-1 leading-snug">
            <span className="font-bold text-black">
              {t("psychology.qualificationLabel")}:
            </span>{" "}
            <span className="">
              {therapistsData[0] && therapistsData[0]
                ? therapistsData[0].qualifications
                : ""}
            </span>
          </p>
          <p className="text-sm text-black mb-1 leading-snug">
            <span className="font-bold text-black">
              {t("psychology.experienceLabel")}:
            </span>{" "}
            <span className="">
              {therapistsData[0] && therapistsData[0]
                ? therapistsData[0].experience
                : ""}
            </span>
          </p>
          <p className="text-sm text-black mb-4 leading-snug">
            <span className="font-bold text-black">
              {t("psychology.languageLabel")}:
            </span>{" "}
            <span className="">English, Hindi</span>
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {Array.isArray(therapistsData) &&
              therapistsData[0] &&
              therapistsData[0].specializations.map((i) => (
                <span
                  key={`d-${i}`}
                  className="px-2 py-1 text-xs rounded-lg  text-primary border border-primary font-bold"
                >
                  {i}
                </span>
              ))}
          </div>
          <div className="flex gap-3 ">
            <button
              onClick={() => setOpen(true)}
              className=" py-2 px-6 w-1/2 md:w-1/4 rounded-lg bg-primary text-white font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              {t("psychology.viewDetails")}
            </button>
          </div>
        </div>
      </div> */}
      <div
        ref={therapistRef}
        className={`max-w-7xl mx-auto px-4 md:px-8 py-12 transition-all duration-1000 ${
          therapistVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : therapistsData[0] ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-primary/20 hover:border-primary transition-all duration-300">
            {/* LEFT - Image Section */}
            <div className="col-span-1 relative bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-8 lg:p-12">
              {/* Decorative Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>

              {/* Image Container */}
              <div className="relative z-10 w-full max-w-sm">
                {/* Decorative Border */}
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-orange-400/20 rounded-3xl blur-xl"></div>

                {/* Image */}
                <img
                  src={therapistsData[0].imageUrl}
                  alt={therapistsData[0].name}
                  className="relative w-full h-auto aspect-square object-cover rounded-2xl shadow-2xl border-4 border-white"
                />

                {/* Verified Badge */}
                <div className="absolute -bottom-3 -right-3 bg-green-500 text-white rounded-full p-3 shadow-lg">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* RIGHT - Content Section */}
            <div className="col-span-1 lg:col-span-2 p-6 md:p-8 lg:p-10 flex flex-col justify-between">
              {/* Header */}
              <div className="mb-6">
                {/* Name & Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      {therapistsData[0].name}
                    </h2>
                    {/* <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className="w-5 h-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-sm text-gray-600 ml-1">
                          4.9 (120 reviews)
                        </span>
                      </div>
                    </div> */}
                  </div>

                  {/* Expert Badge */}
                  <div className="bg-gradient-to-r from-primary to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    ⭐ Top Rated
                  </div>
                </div>

                {/* Price */}
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/10 to-orange-50 border-2 border-primary/30 rounded-2xl px-6 py-3 mb-6">
                  <svg
                    className="w-6 h-6 text-primary"
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
                  <div>
                    <p className="text-2xl md:text-3xl font-bold text-primary">
                      {userData
                        ? userData.locationData.country === "India"
                          ? `₹${therapistsData[0].price}`
                          : `$${therapistsData[0].usdPrice}`
                        : isIndia
                          ? `₹${therapistsData[0].price}`
                          : `$${therapistsData[0].usdPrice}`}
                    </p>
                    <p className="text-xs text-gray-600">per session</p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {/* Qualification */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-primary"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold mb-1">
                        {t("psychology.qualificationLabel")}
                      </p>
                      <p className="text-sm text-gray-800 font-medium">
                        {therapistsData[0].qualifications}
                      </p>
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-primary"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold mb-1">
                        {t("psychology.experienceLabel")}
                      </p>
                      <p className="text-sm text-gray-800 font-medium">
                        {therapistsData[0].experience}
                      </p>
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-primary"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold mb-1">
                        {t("psychology.languageLabel")}
                      </p>
                      <p className="text-sm text-gray-800 font-medium">
                        English, Hindi
                      </p>
                    </div>
                  </div>

                  {/* Service Type */}
                  {/* <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-primary"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold mb-1">
                        Service Type
                      </p>
                      <p className="text-sm text-gray-800 font-medium">
                        {therapistsData[0].serviceType}
                      </p>
                    </div>
                  </div> */}
                </div>

                {/* Specializations */}
                <div className="mb-6">
                  <p className="text-xs text-gray-500 font-semibold mb-3">
                    Specializations:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {therapistsData[0].specializations?.map((spec, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 text-xs rounded-full bg-primary/10 text-primary border border-primary/30 font-semibold hover:bg-primary hover:text-white transition-colors duration-300"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    setShowLogin(true);
                  } else {
                    setTherapistDetails(therapistsData[0]);
                    setOpen(true);
                  }
                }}
                className="group relative w-full bg-gradient-to-r from-primary to-orange-400 hover:from-primary/90 hover:to-orange-400/90 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
                <span className="relative flex items-center justify-center gap-2">
                  {t("psychology.viewDetails")}
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">
                No hypnotherapist available at the moment
              </p>
            </div>
          </div>
        )}
      </div>
      <div
        // style={{ backgroundImage: `url(${Wheel})` }}md:min-h-screen
        className="w-full  bg-contain bg-right bg-no-repeat mt-10 justify-center items-center flex"
      >
        <InviteFriend />
      </div>
      <BookingModal
        isOpen={open}
        onClose={() => setOpen(false)}
        therapistDetails={therapistDetails}
        userData={userData}
        fetchTherapists={fetchTherapists}
      />

      <Login
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        screenName={"psychological-counselling/hypnotherapy"}
      />
    </div>
  );
};

export default HypnoTherapy;
