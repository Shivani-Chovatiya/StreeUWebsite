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
        <img src={vector} className="" alt="" />
        <h1 className="p-3 border rounded-2xl text-sm md:text-xl">
          <span className="text-white bg-primary rounded-full text-sm md:text-xl px-2 py-1 md:px-4 md:py-2">
            New
          </span>{" "}
          {t("aboutus.badge")}
        </h1>
        <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-black text-center p-3">
          {t("psychology.paidTherapyTitle")}
        </h1>
        <h1 className="text-xs md:text-sm font-semibold md:w-3/4 text-black text-center p-3">
          {t("psychology.paidTherapyDesc")}
        </h1>
        <p className="text-primary font-semibold text-center">
          {t("psychology.allSessionsOnline")}
        </p>
      </div>

      {/* 8 Session Containers */}
      <div className="flex justify-center items-center px-4 md:px-8 py-6 max-w-6xl mx-auto">
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
                    {/* <button className="flex-1 py-2.5 rounded-lg bg-gray-800 text-white font-semibold text-sm hover:bg-gray-700 transition-colors">
                    {t("psychology.book")}
                  </button> */}
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
      </div>
      <BookingModal
        isOpen={open}
        onClose={() => setOpen(false)}
        therapistDetails={therapistDetails}
        userData={userData}
        fetchTherapists={fetchTherapists}
      />
      <div
        style={{ backgroundImage: `url(${Wheel})` }}
        className="w-full md:min-h-screen bg-contain bg-right bg-no-repeat mt-10 justify-center items-center flex"
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
