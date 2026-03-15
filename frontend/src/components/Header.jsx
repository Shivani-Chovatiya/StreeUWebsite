import React, { useState, useRef, useEffect } from "react";
import headerlogo from "../assets/headerlogo.png";
import { AiOutlineMenu, AiOutlineClose, AiOutlineDown } from "react-icons/ai";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import profile from "../assets/profile.png";
import lng from "../assets/lng.png";
import wallet from "../assets/wallet.png";
import Login from "./Login";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import Swal from "sweetalert2";

const FUTURE_PREDICTION_ITEMS = [
  {
    labelKey: "header.futurePrediction1Credit",
    path: "/future-prediction/credit1",
  },
  {
    labelKey: "header.futurePrediction2Credit",
    path: "/future-prediction/credit2",
  },
  {
    labelKey: "header.futurePrediction3Credit",
    path: "/future-prediction/credit3",
  },
  {
    labelKey: "header.futurePredictionCustomized",
    path: "/future-prediction/customizedQuestion",
  },
  {
    labelKey: "header.futurePredictionBirthTime",
    path: "/future-predictionscreen/Birth_Rectification",
  },
  {
    labelKey: "header.futurePredictionCompatibility",
    path: "/future-predictionscreen/Compatibility",
  },
];

const PSYCHOLOGICAL_COUNSELLING_ITEMS = [
  {
    labelKey: "header.psychologicalCounsellingFreeTherapy",
    path: "/psychological-counselling/free-therapy",
  },
  {
    labelKey: "header.psychologicalCounsellingPaidTherapy",
    path: "/psychological-counselling/paid-therapy",
  },
  {
    labelKey: "header.psychologicalCounsellingFreeAssessments",
    path: "/psychological-counselling/free-assessments",
  },
  {
    labelKey: "header.psychologicalCounsellingPaidAssessments",
    path: "/psychological-counselling/paid-assessments",
  },
  {
    labelKey: "header.psychologicalCounsellingHypnotherapy",
    path: "/psychological-counselling/hypnotherapy",
  },
];

const Header = () => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileProfileMenu, setShowMobileProfileMenu] = useState(false);
  const profileDropdownRef = useRef(null);
  const [screenName, setScreenName] = useState("");
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showFuturePredictionDropdown, setShowFuturePredictionDropdown] =
    useState(false);
  const [showMobileFuturePrediction, setShowMobileFuturePrediction] =
    useState(false);
  const dropdownRef = useRef(null);
  const [
    showPsychologicalCounsellingDropdown,
    setShowPsychologicalCounsellingDropdown,
  ] = useState(false);
  const [
    showMobilePsychologicalCounselling,
    setShowMobilePsychologicalCounselling,
  ] = useState(false);
  const psychologicalCounsellingDropdownRef = useRef(null);
  const location = useLocation();
  const { t } = useTranslation();
  const [showLogin, setShowLogin] = useState(false);
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
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowFuturePredictionDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        psychologicalCounsellingDropdownRef.current &&
        !psychologicalCounsellingDropdownRef.current.contains(event.target)
      ) {
        setShowPsychologicalCounsellingDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        setShowProfileDropdown(false);
        setShowMobileProfileMenu(false);

        await Swal.fire({
          title: "Logged Out!",
          text: "You have been successfully logged out.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        navigate("/");
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
  const firstLetter = userData?.fullName?.charAt(0)?.toUpperCase();

  return (
    <>
      {/* HEADER */}
      {false && (
        <header className="mb-24 font-poppins fixed top-0 left-0 w-full bg-white z-50 shadow-sm">
          <div className=" mx-auto flex justify-between  items-center px-6 py-4">
            {/* Logo */}
            <img
              src={headerlogo}
              alt="logo"
              className="w-12 h-12 md:w-16 md:h-16"
            />
            {/* Desktop Menu */}
            <ul className="hidden lg:flex gap-5 text-sm font-semibold items-center">
              <NavLink to="/">
                <li
                  className={`${location.pathname === "/" ? "underline" : ""} text-black`}
                >
                  {t("header.home")}
                </li>
              </NavLink>
              <NavLink to="/aboutus">
                <li
                  className={`${location.pathname === "/aboutus" ? "underline" : ""} text-black`}
                >
                  {t("header.about")}
                </li>
              </NavLink>

              {/* Future Prediction Dropdown */}
              <li className="relative" ref={dropdownRef}>
                <button
                  onClick={() =>
                    setShowFuturePredictionDropdown(
                      !showFuturePredictionDropdown,
                    )
                  }
                  onMouseEnter={() => setShowFuturePredictionDropdown(true)}
                  className={`flex items-center gap-1 text-black hover:opacity-80 transition-opacity ${
                    location.pathname.includes("/future-prediction")
                      ? "underline"
                      : ""
                  }`}
                >
                  {t("header.futurePrediction")}
                  <AiOutlineDown
                    className={`text-sm transition-transform ${showFuturePredictionDropdown ? "rotate-180" : ""}`}
                  />
                </button>
                {showFuturePredictionDropdown && (
                  <div
                    className="absolute top-full left-0 mt-2 py-2 min-w-[220px] rounded-lg shadow-lg bg-[#FBECE0] border border-[#f5d5c4]"
                    onMouseLeave={() => setShowFuturePredictionDropdown(false)}
                  >
                    {FUTURE_PREDICTION_ITEMS.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setShowFuturePredictionDropdown(false)}
                      >
                        <span className="block px-4 py-2.5 text-black hover:bg-[#f5d5c4]/50 transition-colors first:rounded-t-lg last:rounded-b-lg">
                          {t(item.labelKey)}
                        </span>
                        <hr className="border-t border-primary mx-2" />
                      </NavLink>
                    ))}
                  </div>
                )}
              </li>

              <li
                className="relative"
                ref={psychologicalCounsellingDropdownRef}
              >
                <button
                  onClick={() =>
                    setShowPsychologicalCounsellingDropdown(
                      !showPsychologicalCounsellingDropdown,
                    )
                  }
                  onMouseEnter={() =>
                    setShowPsychologicalCounsellingDropdown(true)
                  }
                  className={`flex items-center gap-1 text-black hover:opacity-80 transition-opacity ${
                    location.pathname.startsWith("/psychological-counselling")
                      ? "underline"
                      : ""
                  }`}
                >
                  {t("header.psychologicalCounselling")}
                  <AiOutlineDown
                    className={`text-sm transition-transform ${showPsychologicalCounsellingDropdown ? "rotate-180" : ""}`}
                  />
                </button>
                {showPsychologicalCounsellingDropdown && (
                  <div
                    className="absolute top-full left-0 mt-2 py-2 min-w-[220px] rounded-lg shadow-lg bg-[#FBECE0] border border-[#f5d5c4]"
                    onMouseLeave={() =>
                      setShowPsychologicalCounsellingDropdown(false)
                    }
                  >
                    {PSYCHOLOGICAL_COUNSELLING_ITEMS.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() =>
                          setShowPsychologicalCounsellingDropdown(false)
                        }
                      >
                        <span className="block px-4 py-2.5 text-black hover:bg-[#f5d5c4]/50 transition-colors first:rounded-t-lg last:rounded-b-lg">
                          {t(item.labelKey)}
                        </span>
                        <hr className="border-t border-primary mx-2" />
                      </NavLink>
                    ))}
                  </div>
                )}
              </li>

              <NavLink to="/contactus">
                <li
                  className={`${location.pathname === "/contactus" ? "underline" : ""} text-black`}
                >
                  {t("header.contact")}
                </li>
              </NavLink>
              <NavLink to="/pricing">
                <li
                  className={`${location.pathname === "/pricing" ? "underline" : ""} text-black`}
                >
                  {t("header.pricing")}
                </li>
              </NavLink>
              {/* <NavLink to="/profile" onClick={() => setShowSidebar(false)}> */}
              {/* <NavLink
              to={isLoggedIn ? "/profile" : "/"}
              onClick={(e) => {
                if (!isLoggedIn) {
                  e.preventDefault(); // stop navigation
                  setShowLogin(true); // open login modal
                } else {
                  setShowSidebar(false);
                }
              }}
            >
              <img
                src={profile}
                // className={"lg:hidden"}
              />
            </NavLink> */}
              <li
                className="relative"
                ref={profileDropdownRef}
                onMouseEnter={() => isLoggedIn && setShowProfileDropdown(true)}
              >
                <button
                  onClick={(e) => {
                    if (!isLoggedIn) {
                      setScreenName("profile");
                      setShowLogin(true);
                    } else {
                      setShowProfileDropdown(!showProfileDropdown);
                    }
                  }}
                  className="relative mt-1"
                >
                  {/* <img src={profile} alt="profile" /> */}
                  {isLoggedIn ? (
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm">
                      {firstLetter}
                    </div>
                  ) : (
                    <img src={profile} alt="profile" className="" />
                  )}
                </button>

                {isLoggedIn && showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-[#FBECE0] shadow-lg rounded-lg border border-gray-200 overflow-hidden">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setShowProfileDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#f5d5c4]/50 text-sm"
                    >
                      My Profile
                    </button>
                    <hr className="border-t border-primary mx-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-[#f5d5c4]/50 text-sm text-red-500"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </li>
              <NavLink
                to={isLoggedIn ? "/wallet" : "/"}
                onClick={(e) => {
                  if (!isLoggedIn) {
                    e.preventDefault(); // stop navigation
                    setScreenName("wallet");
                    setShowLogin(true); // open login modal
                  } else {
                    setShowSidebar(false);
                  }
                }}
              >
                <img
                  src={wallet}
                  // className={"lg:hidden"}
                />
              </NavLink>
              <NavLink to="/" onClick={() => setShowSidebar(false)}>
                <img
                  src={lng}
                  // className={"lg:hidden"}
                />
              </NavLink>
            </ul>

            <button
              className="lg:hidden text-2xl"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              {showSidebar ? <AiOutlineClose /> : <AiOutlineMenu />}
            </button>
          </div>
        </header>
      )}
      <header className="mb-24 font-poppins fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md z-50 shadow-md border-b border-orange-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-6 py-3 md:py-4">
          {/* Logo */}
          <NavLink to="/" className="group">
            <img
              src={headerlogo}
              alt="logo"
              className="w-12 h-12 md:w-16 md:h-16 transform group-hover:scale-110 transition-transform duration-300"
            />
          </NavLink>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex gap-6 xl:gap-8 text-sm font-semibold items-center">
            <NavLink to="/">
              <li className="group relative text-black hover:text-primary transition-colors duration-300">
                {t("header.home")}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                    location.pathname === "/"
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </li>
            </NavLink>

            <NavLink to="/aboutus">
              <li className="group relative text-black hover:text-primary transition-colors duration-300">
                {t("header.about")}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                    location.pathname === "/aboutus"
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </li>
            </NavLink>

            {/* Future Prediction Dropdown */}
            <li className="relative group" ref={dropdownRef}>
              <button
                onClick={() =>
                  setShowFuturePredictionDropdown(!showFuturePredictionDropdown)
                }
                onMouseEnter={() => setShowFuturePredictionDropdown(true)}
                className={`flex items-center gap-1 text-black hover:text-primary transition-all duration-300 ${
                  location.pathname.includes("/future-prediction")
                    ? "text-primary"
                    : ""
                }`}
              >
                {t("header.futurePrediction")}
                <AiOutlineDown
                  className={`text-sm transition-transform duration-300 ${
                    showFuturePredictionDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                  location.pathname.includes("/future-prediction")
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }`}
              ></span>

              {showFuturePredictionDropdown && (
                <div
                  className="absolute top-full left-0 mt-4 py-2 min-w-[240px] rounded-2xl shadow-2xl bg-white border-2 border-primary/20 animate-slide-down overflow-hidden"
                  onMouseLeave={() => setShowFuturePredictionDropdown(false)}
                >
                  {FUTURE_PREDICTION_ITEMS.map((item, index) => (
                    <div key={item.path}>
                      <NavLink
                        to={item.path}
                        onClick={() => setShowFuturePredictionDropdown(false)}
                        className="group block"
                      >
                        <span className="block px-5 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-primary/10 hover:to-orange-50 hover:text-primary transition-all duration-300 font-medium">
                          <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                            {t(item.labelKey)}
                          </span>
                        </span>
                      </NavLink>
                      {index !== FUTURE_PREDICTION_ITEMS.length - 1 && (
                        <hr className="border-t border-orange-100 mx-3" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </li>

            {/* Psychological Counselling Dropdown */}
            <li
              className="relative group"
              ref={psychologicalCounsellingDropdownRef}
            >
              <button
                onClick={() =>
                  setShowPsychologicalCounsellingDropdown(
                    !showPsychologicalCounsellingDropdown,
                  )
                }
                onMouseEnter={() =>
                  setShowPsychologicalCounsellingDropdown(true)
                }
                className={`flex items-center gap-1 text-black hover:text-primary transition-all duration-300 ${
                  location.pathname.startsWith("/psychological-counselling")
                    ? "text-primary"
                    : ""
                }`}
              >
                {t("header.psychologicalCounselling")}
                <AiOutlineDown
                  className={`text-sm transition-transform duration-300 ${
                    showPsychologicalCounsellingDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                  location.pathname.startsWith("/psychological-counselling")
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }`}
              ></span>

              {showPsychologicalCounsellingDropdown && (
                <div
                  className="absolute top-full left-0 mt-4 py-2 min-w-[240px] rounded-2xl shadow-2xl bg-white border-2 border-primary/20 animate-slide-down overflow-hidden"
                  onMouseLeave={() =>
                    setShowPsychologicalCounsellingDropdown(false)
                  }
                >
                  {PSYCHOLOGICAL_COUNSELLING_ITEMS.map((item, index) => (
                    <div key={item.path}>
                      <NavLink
                        to={item.path}
                        onClick={() =>
                          setShowPsychologicalCounsellingDropdown(false)
                        }
                        className="group block"
                      >
                        <span className="block px-5 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-primary/10 hover:to-orange-50 hover:text-primary transition-all duration-300 font-medium">
                          <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                            {t(item.labelKey)}
                          </span>
                        </span>
                      </NavLink>
                      {index !== PSYCHOLOGICAL_COUNSELLING_ITEMS.length - 1 && (
                        <hr className="border-t border-orange-100 mx-3" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </li>

            <NavLink to="/contactus">
              <li className="group relative text-black hover:text-primary transition-colors duration-300">
                {t("header.contact")}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                    location.pathname === "/contactus"
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </li>
            </NavLink>

            <NavLink to="/pricing">
              <li className="group relative text-black hover:text-primary transition-colors duration-300">
                {t("header.pricing")}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                    location.pathname === "/pricing"
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </li>
            </NavLink>

            {/* Profile Dropdown */}
            <li
              className="relative"
              ref={profileDropdownRef}
              onMouseEnter={() => isLoggedIn && setShowProfileDropdown(true)}
            >
              <button
                onClick={(e) => {
                  if (!isLoggedIn) {
                    setScreenName("profile");
                    setShowLogin(true);
                  } else {
                    setShowProfileDropdown(!showProfileDropdown);
                  }
                }}
                className="relative group"
              >
                {isLoggedIn ? (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-400 text-white flex items-center justify-center font-bold text-sm shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 border-2 border-white">
                    {firstLetter}
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-primary/10 transition-all duration-300 transform hover:scale-110">
                    <img src={profile} alt="profile" className="w-6 h-6" />
                  </div>
                )}
              </button>

              {isLoggedIn && showProfileDropdown && (
                <div className="absolute right-0 mt-4 w-48 bg-white shadow-2xl rounded-2xl border-2 border-primary/20 overflow-hidden animate-slide-down">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setShowProfileDropdown(false);
                    }}
                    className="w-full text-left px-5 py-3 hover:bg-gradient-to-r hover:from-primary/10 hover:to-orange-50 hover:text-primary text-sm font-medium transition-all duration-300 flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    My Profile
                  </button>
                  <hr className="border-t border-orange-100 mx-3" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-5 py-3 hover:bg-red-50 text-sm text-red-600 font-medium transition-all duration-300 flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </li>

            {/* Wallet Icon */}
            <NavLink
              to={isLoggedIn ? "/wallet" : "/"}
              onClick={(e) => {
                if (!isLoggedIn) {
                  e.preventDefault();
                  setScreenName("wallet");
                  setShowLogin(true);
                } else {
                  setShowSidebar(false);
                }
              }}
              className="group"
            >
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center hover:bg-primary/10 transition-all duration-300 transform hover:scale-110">
                <img
                  src={wallet}
                  alt="wallet"
                  className="w-6 h-6 group-hover:scale-110 transition-transform"
                />
              </div>
            </NavLink>

            {/* Language Icon */}
            <NavLink
              to="/"
              onClick={() => setShowSidebar(false)}
              className="group"
            >
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center hover:bg-primary/10 transition-all duration-300 transform hover:scale-110">
                <img
                  src={lng}
                  alt="language"
                  className="w-6 h-6 group-hover:scale-110 transition-transform"
                />
              </div>
            </NavLink>
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-2xl text-gray-700 hover:text-primary transition-colors p-2 hover:bg-orange-50 rounded-lg"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            {showSidebar ? <AiOutlineClose /> : <AiOutlineMenu />}
          </button>
        </div>
      </header>
      {/* MOBILE SIDEBAR */}
      {false && (
        // <div className="font-poppins flex flex-col items-center mt-24 w-full h-screen bg-white text-xl font-semibold lg:hidden gap-3 overflow-y-auto pb-8">
        <div className="fixed inset-0 top-20 z-40 bg-white font-poppins flex flex-col items-center text-xl font-semibold lg:hidden gap-3 overflow-y-auto pb-8">
          {/* Mobile Icons */}
          <div className="flex justify-center gap-6 py-4 border-b border-gray-200 w-full">
            {/* <NavLink to="/profile" onClick={() => setShowSidebar(false)}> */}
            {/* <NavLink
              to={isLoggedIn ? "/profile" : "/"}
              onClick={(e) => {
                if (!isLoggedIn) {
                  e.preventDefault(); // stop navigation
                  setShowLogin(true); // open login modal
                } else {
                  setShowSidebar(false);
                }
              }}
            >
              <img src={profile} alt="profile" className="w-6 h-6" />
            </NavLink> */}
            <div className="relative">
              <button
                onClick={(e) => {
                  if (!isLoggedIn) {
                    setShowLogin(true);
                    setScreenName("profile");
                  } else {
                    setShowMobileProfileMenu(!showMobileProfileMenu);
                  }
                }}
              >
                {/* <img src={profile} alt="profile" className="w-6 h-6" /> */}
                {isLoggedIn ? (
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm">
                    {firstLetter}
                  </div>
                ) : (
                  <img src={profile} alt="profile" className="w-6 h-6" />
                )}
              </button>

              {isLoggedIn && showMobileProfileMenu && (
                <div className="absolute top-8 left-0 bg-[#FBECE0] shadow-md rounded-lg w-32 border border-gray-200">
                  <NavLink
                    to="/profile"
                    onClick={() => {
                      setShowSidebar(false);
                      setShowMobileProfileMenu(false);
                    }}
                    className="block px-4 py-2 text-sm hover:bg-[#f5d5c4]/50"
                  >
                    Profile
                  </NavLink>
                  <hr className="border-t border-primary mx-2" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-[#f5d5c4]/50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
            <NavLink
              to={isLoggedIn ? "/wallet" : "/"}
              onClick={(e) => {
                if (!isLoggedIn) {
                  e.preventDefault(); // stop navigation
                  setScreenName("wallet");
                  setShowLogin(true); // open login modal
                } else {
                  setShowSidebar(false);
                }
              }}
            >
              <img src={wallet} alt="wallet" className="w-6 h-6" />
            </NavLink>
            <NavLink to="/" onClick={() => setShowSidebar(false)}>
              <img src={lng} alt="language" className="w-6 h-6" />
            </NavLink>
          </div>
          <NavLink to="/" onClick={() => setShowSidebar(false)}>
            <h1 className={location.pathname === "/" ? "underline" : ""}>
              {t("header.home")}
            </h1>
          </NavLink>
          <NavLink to="/aboutus" onClick={() => setShowSidebar(false)}>
            <h1 className={location.pathname === "/aboutus" ? "underline" : ""}>
              {t("header.about")}
            </h1>
          </NavLink>

          {/* Mobile Future Prediction Dropdown */}
          <div className="flex flex-col items-center w-full max-w-xs">
            <button
              onClick={() =>
                setShowMobileFuturePrediction(!showMobileFuturePrediction)
              }
              className="flex items-center gap-2"
            >
              {t("header.futurePrediction")}
              <AiOutlineDown
                className={`text-base transition-transform ${showMobileFuturePrediction ? "rotate-180" : ""}`}
              />
            </button>

            {showMobileFuturePrediction && (
              <div className="mt-2 w-full rounded-lg bg-[#FBECE0] border border-[#f5d5c4] overflow-hidden">
                {FUTURE_PREDICTION_ITEMS.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      setShowSidebar(false);
                      setShowMobileFuturePrediction(false);
                    }}
                  >
                    <span className="block px-4 py-3 text-base text-black hover:bg-[#f5d5c4]/50 transition-colors border-b border-[#f5d5c4]/50 last:border-b-0">
                      {t(item.labelKey)}
                    </span>
                    <hr className="border-t border-primary mx-2" />
                  </NavLink>
                ))}
              </div>
            )}
          </div>
          {/* Mobile Psychological Counselling Dropdown */}
          <div className="flex flex-col items-center w-full max-w-xs">
            <button
              onClick={() =>
                setShowMobilePsychologicalCounselling(
                  !showMobilePsychologicalCounselling,
                )
              }
              className="flex items-center gap-2"
            >
              {t("header.psychologicalCounselling")}
              <AiOutlineDown
                className={`text-base transition-transform ${showMobilePsychologicalCounselling ? "rotate-180" : ""}`}
              />
            </button>
            {showMobilePsychologicalCounselling && (
              <div className="mt-2 w-full rounded-lg bg-[#FBECE0] border border-[#f5d5c4] overflow-hidden">
                {PSYCHOLOGICAL_COUNSELLING_ITEMS.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      setShowSidebar(false);
                      setShowMobilePsychologicalCounselling(false);
                    }}
                  >
                    <span className="block px-4 py-3 text-base text-black hover:bg-[#f5d5c4]/50 transition-colors border-b border-[#f5d5c4]/50 last:border-b-0">
                      {t(item.labelKey)}
                    </span>
                    <hr className="border-t border-primary mx-2" />
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          <NavLink to="/contactus" onClick={() => setShowSidebar(false)}>
            <h1
              className={location.pathname === "/contactus" ? "underline" : ""}
            >
              {t("header.contact")}
            </h1>
          </NavLink>
          <NavLink to="/pricing" onClick={() => setShowSidebar(false)}>
            <h1 className={location.pathname === "/pricing" ? "underline" : ""}>
              {t("header.pricing")}
            </h1>
          </NavLink>
        </div>
      )}
      {/* MOBILE SIDEBAR */}
      {false && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setShowSidebar(false)}
          ></div>

          {/* Sidebar */}
          <div className="fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-xl font-poppins flex flex-col overflow-y-auto lg:hidden animate-slide-in-left">
            {/* Profile / Icons */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    if (!isLoggedIn) {
                      setShowLogin(true);
                      setScreenName("profile");
                    } else {
                      setShowMobileProfileMenu(!showMobileProfileMenu);
                    }
                  }}
                >
                  {isLoggedIn ? (
                    <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                      {firstLetter}
                    </div>
                  ) : (
                    <img src={profile} alt="profile" className="w-7 h-7" />
                  )}
                </button>
                {isLoggedIn && showMobileProfileMenu && (
                  <div className="absolute top-10 left-10 bg-[#FBECE0] shadow-md rounded-lg w-32 border border-gray-200">
                    <NavLink
                      to="/profile"
                      onClick={() => {
                        setShowSidebar(false);
                        setShowMobileProfileMenu(false);
                      }}
                      className="block px-4 py-2 text-sm hover:bg-[#f5d5c4]/50"
                    >
                      Profile
                    </NavLink>
                    <hr className="border-t border-primary mx-2" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-[#f5d5c4]/50"
                    >
                      Logout
                    </button>
                  </div>
                )}
                <NavLink
                  to={isLoggedIn ? "/wallet" : "/"}
                  onClick={(e) => {
                    if (!isLoggedIn) {
                      e.preventDefault();
                      setScreenName("wallet");
                      setShowLogin(true);
                    } else {
                      setShowSidebar(false);
                    }
                  }}
                >
                  <img src={wallet} alt="wallet" className="w-6 h-6" />
                </NavLink>

                <NavLink to="/" onClick={() => setShowSidebar(false)}>
                  <img src={lng} alt="language" className="w-6 h-6" />
                </NavLink>
              </div>

              {/* Close */}
              <button onClick={() => setShowSidebar(false)} className="text-xl">
                ✕
              </button>
            </div>

            {/* Menu */}
            <div className="flex flex-col text-base font-medium">
              <NavLink
                to="/"
                onClick={() => setShowSidebar(false)}
                className="px-6 py-3 hover:bg-[#FBECE0]"
              >
                {t("header.home")}
              </NavLink>

              <NavLink
                to="/aboutus"
                onClick={() => setShowSidebar(false)}
                className="px-6 py-3 hover:bg-[#FBECE0]"
              >
                {t("header.about")}
              </NavLink>

              {/* Future Prediction */}
              <button
                onClick={() =>
                  setShowMobileFuturePrediction(!showMobileFuturePrediction)
                }
                className="flex justify-between items-center px-6 py-3 hover:bg-[#FBECE0]"
              >
                {t("header.futurePrediction")}
                <AiOutlineDown
                  className={`transition-transform ${
                    showMobileFuturePrediction ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showMobileFuturePrediction && (
                <div className="bg-[#FBECE0]">
                  {FUTURE_PREDICTION_ITEMS.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => {
                        setShowSidebar(false);
                        setShowMobileFuturePrediction(false);
                      }}
                      className="block px-10 py-3 text-sm hover:bg-[#f5d5c4]/50"
                    >
                      {t(item.labelKey)}
                    </NavLink>
                  ))}
                </div>
              )}

              {/* Psychological */}
              <button
                onClick={() =>
                  setShowMobilePsychologicalCounselling(
                    !showMobilePsychologicalCounselling,
                  )
                }
                className="flex justify-between items-center px-6 py-3 hover:bg-[#FBECE0]"
              >
                {t("header.psychologicalCounselling")}
                <AiOutlineDown
                  className={`transition-transform ${
                    showMobilePsychologicalCounselling ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showMobilePsychologicalCounselling && (
                <div className="bg-[#FBECE0]">
                  {PSYCHOLOGICAL_COUNSELLING_ITEMS.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => {
                        setShowSidebar(false);
                        setShowMobilePsychologicalCounselling(false);
                      }}
                      className="block px-10 py-3 text-sm hover:bg-[#f5d5c4]/50"
                    >
                      {t(item.labelKey)}
                    </NavLink>
                  ))}
                </div>
              )}

              <NavLink
                to="/contactus"
                onClick={() => setShowSidebar(false)}
                className="px-6 py-3 hover:bg-[#FBECE0]"
              >
                {t("header.contact")}
              </NavLink>

              <NavLink
                to="/pricing"
                onClick={() => setShowSidebar(false)}
                className="px-6 py-3 hover:bg-[#FBECE0]"
              >
                {t("header.pricing")}
              </NavLink>
            </div>
          </div>
        </>
      )}
      {showSidebar && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden animate-fade-in"
            onClick={() => setShowSidebar(false)}
          ></div>

          {/* Sidebar */}
          <div className="fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-xl font-poppins flex flex-col overflow-y-auto lg:hidden animate-slide-in-left">
            {/* Profile / Icons */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    if (!isLoggedIn) {
                      setShowLogin(true);
                      setScreenName("profile");
                    } else {
                      setShowMobileProfileMenu(!showMobileProfileMenu);
                    }
                  }}
                  className="transition-transform duration-300 hover:scale-110"
                >
                  {isLoggedIn ? (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-orange-400 text-white flex items-center justify-center font-semibold shadow-md hover:shadow-lg transition-shadow duration-300">
                      {firstLetter}
                    </div>
                  ) : (
                    <img src={profile} alt="profile" className="w-7 h-7" />
                  )}
                </button>

                {isLoggedIn && showMobileProfileMenu && (
                  <div className="absolute top-10 left-10 bg-[#FBECE0] shadow-md rounded-lg w-32 border border-gray-200 animate-scale-in origin-top-left">
                    <NavLink
                      to="/profile"
                      onClick={() => {
                        setShowSidebar(false);
                        setShowMobileProfileMenu(false);
                      }}
                      className="block px-4 py-2 text-sm hover:bg-[#f5d5c4]/50 transition-colors duration-200"
                    >
                      Profile
                    </NavLink>
                    <hr className="border-t border-primary mx-2" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-[#f5d5c4]/50 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                )}

                <NavLink
                  to={isLoggedIn ? "/wallet" : "/"}
                  onClick={(e) => {
                    if (!isLoggedIn) {
                      e.preventDefault();
                      setScreenName("wallet");
                      setShowLogin(true);
                    } else {
                      setShowSidebar(false);
                    }
                  }}
                  className="transition-transform duration-300 hover:scale-110"
                >
                  <img src={wallet} alt="wallet" className="w-6 h-6" />
                </NavLink>

                <NavLink
                  to="/"
                  onClick={() => setShowSidebar(false)}
                  className="transition-transform duration-300 hover:scale-110"
                >
                  <img src={lng} alt="language" className="w-6 h-6" />
                </NavLink>
              </div>

              {/* Close */}
              <button
                onClick={() => setShowSidebar(false)}
                className="text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#FBECE0] hover:text-primary transition-all duration-300 hover:rotate-90"
              >
                ✕
              </button>
            </div>

            {/* Menu */}
            <div className="flex flex-col text-base font-medium">
              <NavLink
                to="/"
                onClick={() => setShowSidebar(false)}
                className="px-6 py-3 hover:bg-[#FBECE0] hover:text-primary hover:pl-8 transition-all duration-300 border-b border-gray-50 animate-slide-in-left [animation-delay:60ms]"
              >
                {t("header.home")}
              </NavLink>

              <NavLink
                to="/aboutus"
                onClick={() => setShowSidebar(false)}
                className="px-6 py-3 hover:bg-[#FBECE0] hover:text-primary hover:pl-8 transition-all duration-300 border-b border-gray-50 animate-slide-in-left [animation-delay:110ms]"
              >
                {t("header.about")}
              </NavLink>

              {/* Future Prediction */}
              <button
                onClick={() =>
                  setShowMobileFuturePrediction(!showMobileFuturePrediction)
                }
                className="flex justify-between items-center px-6 py-3 hover:bg-[#FBECE0] hover:text-primary hover:pl-8 transition-all duration-300 border-b border-gray-50 animate-slide-in-left [animation-delay:160ms]"
              >
                {t("header.futurePrediction")}
                <AiOutlineDown
                  className={`transition-transform duration-300 ${
                    showMobileFuturePrediction ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  showMobileFuturePrediction
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="bg-[#FBECE0]">
                  {FUTURE_PREDICTION_ITEMS.map((item, index) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => {
                        setShowSidebar(false);
                        setShowMobileFuturePrediction(false);
                      }}
                      className="group block px-10 py-3 text-sm hover:bg-[#f5d5c4]/50 hover:pl-12 hover:text-primary transition-all duration-200"
                      style={{ animationDelay: `${index * 40}ms` }}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-200"></span>
                        {t(item.labelKey)}
                      </span>
                    </NavLink>
                  ))}
                </div>
              </div>

              {/* Psychological */}
              <button
                onClick={() =>
                  setShowMobilePsychologicalCounselling(
                    !showMobilePsychologicalCounselling,
                  )
                }
                className="flex justify-between items-center px-6 py-3 hover:bg-[#FBECE0] hover:text-primary hover:pl-8 transition-all duration-300 border-b border-gray-50 animate-slide-in-left [animation-delay:210ms]"
              >
                {t("header.psychologicalCounselling")}
                <AiOutlineDown
                  className={`transition-transform duration-300 ${
                    showMobilePsychologicalCounselling
                      ? "rotate-180 text-primary"
                      : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  showMobilePsychologicalCounselling
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="bg-[#FBECE0]">
                  {PSYCHOLOGICAL_COUNSELLING_ITEMS.map((item, index) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => {
                        setShowSidebar(false);
                        setShowMobilePsychologicalCounselling(false);
                      }}
                      className="group block px-10 py-3 text-sm hover:bg-[#f5d5c4]/50 hover:pl-12 hover:text-primary transition-all duration-200"
                      style={{ animationDelay: `${index * 40}ms` }}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-200"></span>
                        {t(item.labelKey)}
                      </span>
                    </NavLink>
                  ))}
                </div>
              </div>

              <NavLink
                to="/contactus"
                onClick={() => setShowSidebar(false)}
                className="px-6 py-3 hover:bg-[#FBECE0] hover:text-primary hover:pl-8 transition-all duration-300 border-b border-gray-50 animate-slide-in-left [animation-delay:260ms]"
              >
                {t("header.contact")}
              </NavLink>

              <NavLink
                to="/pricing"
                onClick={() => setShowSidebar(false)}
                className="px-6 py-3 hover:bg-[#FBECE0] hover:text-primary hover:pl-8 transition-all duration-300 border-b border-gray-50 animate-slide-in-left [animation-delay:310ms]"
              >
                {t("header.pricing")}
              </NavLink>
            </div>
          </div>
        </>
      )}
      <Login
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        screenName={screenName}
      />
      {/* SPACE BELOW FIXED HEADER */}
      <div className="h-20"></div>
    </>
  );
};

export default Header;
