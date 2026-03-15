import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import vector from "../../assets/Aboutusimg/Vector.png";
import Wheel from "../../assets/Aboutusimg/Wheel.png";
import InviteFriend from "../InviteFriend";
import BookingModal from "./BookingModal";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import Login from "../Login";

const SESSION_TAG_VARIANTS = [
  { dark: [0, 1], orange: [0, 1, 2] },
  { dark: [2, 3], orange: [0, 2, 3] },
  { dark: [4, 5], orange: [1, 3, 4] },
  { dark: [6, 7], orange: [0, 2, 4] },
  { dark: [0, 3], orange: [1, 2, 3] },
  { dark: [5, 8], orange: [0, 3, 4] },
  { dark: [1, 6], orange: [1, 2, 4] },
  { dark: [2, 7], orange: [0, 1, 4] },
];

const PaidTherapy = () => {
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
    <div className="font-poppins mt-10">
      <div className="flex flex-col gap-6 p-3 md:p-6 justify-center items-center">
        <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-black text-center p-3 animate-slide-up">
          {t("psychology.paidTherapyTitle")}
        </h1>
        <h1 className="text-sm md:text-sm lg:text-sm max-w-3xl text-black font-semibold text-center animate-slide-up-delay">
          {t("psychology.paidTherapyDesc")}
        </h1>
        <p className="text-sm md:text-sm lg:text-sm max-w-3xl text-primary font-semibold text-center animate-slide-up-delay">
          {t("psychology.allSessionsOnline")}
        </p>
      </div>

      {/* 8 Session Containers */}
      {/* <div className="flex justify-center items-center px-4 md:px-8 py-6 max-w-6xl mx-auto">
        <div
          className={`grid grid-cols-1 ${therapistsData && therapistsData.length === 1 ? "md:grid-cols-1 w-1/2 " : "md:grid-cols-2"} gap-4 md:gap-6`}
        >
          {therapistsData &&
            therapistsData.map((item, index) => {
              return (
                <div
                  key={String(index + 1)}
                  className="bg-white rounded-lg border border-primary p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <p className="text-xl font-bold text-gray-900 mb-2">
                    {index + 1}. {item.name}
                  </p>
                  <p className="text-xl  font-bold text-primary mb-3">
                    {userData
                      ? userData.locationData.country === "India"
                        ? `₹${item.price}`
                        : `$${item.usdPrice}`
                      : isIndia
                        ? `₹${item.price}`
                        : ` $${item.usdPrice}`}
                    <span className="text-xl  font-bold text-primary mb-3">
                      {t("psychology.perSession")}
                    </span>
                  </p>
                  <p className="text-sm text-black mb-1 leading-snug">
                    <span className="font-bold text-black">
                      {t("psychology.qualificationLabel")}:
                    </span>{" "}
                    <span className="">{item.qualifications}</span>
                  </p>
                  <p className="text-sm text-black mb-1 leading-snug">
                    <span className="font-bold text-black">
                      {t("psychology.experienceLabel")}:
                    </span>{" "}
                    <span className="">{item?.experience}</span>
                  </p>
                  <p className="text-sm text-black mb-1 leading-snug">
                    <span className="font-bold">Service Type: </span>
                    {item.serviceType}
                  </p>
                  <p className="text-sm text-black mb-4 leading-snug">
                    <span className="font-bold text-black">
                      {t("psychology.languageLabel")}:
                    </span>{" "}
                    <span className="">{item.languages?.join(", ")}</span>
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.specializations?.map((spec, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs rounded-lg text-primary border border-primary font-bold"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3 ">
                    <button
                      onClick={() => {
                        if (!isLoggedIn) {
                          setShowLogin(true);
                        } else {
                          setTherapistDetails(item);
                          setOpen(true);
                        }
                      }}
                      className="flex-1 py-2.5 rounded-lg bg-primary text-white font-semibold text-sm hover:opacity-90 transition-opacity"
                    >
                      {t("psychology.viewDetails")}
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div> */}
      <div className="flex justify-center items-center px-4 md:px-8 py-6 max-w-7xl mx-auto">
        <div
          className={`grid grid-cols-1 ${
            therapistsData && therapistsData.length === 1
              ? "md:grid-cols-1 max-w-2xl"
              : "md:grid-cols-2"
          } gap-4 md:gap-6 w-full`}
        >
          {therapistsData && therapistsData.length > 0 ? (
            therapistsData.map((item, index) => {
              return (
                <div
                  key={String(index + 1)}
                  className="group bg-gradient-to-br from-white to-orange-50 rounded-2xl border-2 border-primary/30 p-5 md:p-6 shadow-md hover:shadow-2xl hover:border-primary transition-all duration-300 hover:scale-105 animate-scale-in"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  {/* Header with Avatar & Name */}
                  <div className="flex items-center gap-4 mb-4">
                    {/* Avatar/Number Circle */}
                    <div className="w-14 h-14  rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        index + 1
                      )}
                    </div>

                    {/* Name & Title */}
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-yellow-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-xs text-gray-600 font-medium">
                          Expert Therapist
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price Badge */}
                  <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-xl px-4 py-2 mb-4">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-xl font-bold text-primary leading-none">
                        {userData
                          ? userData.locationData.country === "India"
                            ? `₹${item.price}`
                            : `$${item.usdPrice}`
                          : isIndia
                            ? `₹${item.price}`
                            : `$${item.usdPrice}`}
                      </p>
                      <p className="text-xs text-primary/70">
                        {t("psychology.perSession")}
                      </p>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="space-y-3 mb-4">
                    {/* Qualification */}
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-primary"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-semibold">
                          {t("psychology.qualificationLabel")}
                        </p>
                        <p className="text-sm text-gray-800">
                          {item.qualifications}
                        </p>
                      </div>
                    </div>

                    {/* Experience */}
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-primary"
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
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-semibold">
                          {t("psychology.experienceLabel")}
                        </p>
                        <p className="text-sm text-gray-800">
                          {item?.experience}
                        </p>
                      </div>
                    </div>

                    {/* Service Type */}
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-primary"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-semibold">
                          Service Type
                        </p>
                        <p className="text-sm text-gray-800">
                          {item.serviceType}
                        </p>
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-primary"
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
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-semibold">
                          {t("psychology.languageLabel")}
                        </p>
                        <p className="text-sm text-gray-800">
                          {item.languages?.join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Specializations Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.specializations?.map((spec, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/30 font-semibold hover:bg-primary hover:text-white transition-colors duration-300"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* View Details Button */}
                  <button
                    onClick={() => {
                      if (!isLoggedIn) {
                        setShowLogin(true);
                      } else {
                        setTherapistDetails(item);
                        setOpen(true);
                      }
                    }}
                    className="w-full group relative bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                    <span className="relative flex items-center justify-center gap-2">
                      {t("psychology.viewDetails")}
                      <svg
                        className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">
                  No therapists available
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <BookingModal
        isOpen={open}
        onClose={() => setOpen(false)}
        therapistDetails={therapistDetails}
        userData={userData}
        fetchTherapists={fetchTherapists}
      />
      <div
        // style={{ backgroundImage: `url(${Wheel})` }} md:min-h-screen
        className="w-full bg-contain bg-right bg-no-repeat mt-10 justify-center items-center flex"
      >
        <InviteFriend />
      </div>
      <Login
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        screenName={"psychological-counselling/paid-therapy"}
      />
    </div>
  );
};

export default PaidTherapy;
