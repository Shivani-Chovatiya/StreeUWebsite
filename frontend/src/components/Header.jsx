import React, { useState, useRef, useEffect } from "react";
import headerlogo from "../assets/headerlogo.png";
import { AiOutlineMenu, AiOutlineClose, AiOutlineDown } from "react-icons/ai";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import profile from "../assets/profile.png";
import lng from "../assets/lng.png";
import wallet from "../assets/wallet.png";
import Login from "./Login";

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
  const isLoggedIn = localStorage.getItem("user");
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

  return (
    <>
      {/* HEADER */}
      <header className="mb-24 font-poppins fixed top-0 left-0 w-full bg-white z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between  items-center px-6 py-4">
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
                  setShowFuturePredictionDropdown(!showFuturePredictionDropdown)
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

            <li className="relative" ref={psychologicalCounsellingDropdownRef}>
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
            <NavLink
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
            </NavLink>
            <NavLink to="/wallet" onClick={() => setShowSidebar(false)}>
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

      {/* MOBILE SIDEBAR */}
      {showSidebar && (
        // <div className="font-poppins flex flex-col items-center mt-24 w-full h-screen bg-white text-xl font-semibold lg:hidden gap-3 overflow-y-auto pb-8">
        <div className="fixed inset-0 top-20 z-40 bg-white font-poppins flex flex-col items-center text-xl font-semibold lg:hidden gap-3 overflow-y-auto pb-8">
          {/* Mobile Icons */}
          <div className="flex justify-center gap-6 py-4 border-b border-gray-200 w-full">
            {/* <NavLink to="/profile" onClick={() => setShowSidebar(false)}> */}
            <NavLink
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
            </NavLink>

            <NavLink to="/wallet" onClick={() => setShowSidebar(false)}>
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
      <Login isOpen={showLogin} onClose={() => setShowLogin(false)} />
      {/* SPACE BELOW FIXED HEADER */}
      <div className="h-20"></div>
    </>
  );
};

export default Header;
