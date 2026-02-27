import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineClose } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import {
  FaApple,
  FaFacebook,
  FaMars,
  FaTransgender,
  FaVenus,
} from "react-icons/fa";
import Wheel from "../assets/Aboutusimg/Wheel.png";
import loginimg from "../assets/Login/loginimg.png";
import headerimg from "../assets/headerlogo.png";
import { useNavigate } from "react-router-dom";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  StandaloneSearchBox,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 23.0225,
  lng: 72.5714,
};

const libraries = ["places"];

const Login = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState("login"); // "login" | "otp"
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const otpRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setStep("login");
      setPhone("");
      setOtp(["", "", "", "", "", ""]);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleGetOtp = () => {
    if (phone.trim()) setStep("otp");
  };

  const handleVerifyOtp = () => {
    const fullOtp = otp.join("");
    if (fullOtp.length === 6) {
      // onClose();
      setStep("createprofile");
    }
  };
  const handleProfileContinue = () => {
    // onClose();
    setStep("createprofile2");
  };
  const handleProfileSubmission = () => {
    onClose();
    setStep("profilesubmit");
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBLkKCZNi8wNISxgrAtV5cvte6NxZVs5Og",
    libraries,
  });

  const [map, setMap] = useState(null);
  const [center, setCenter] = useState(defaultCenter);
  const searchBoxRef = useRef(null);

  // When map loads
  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // When user selects place
  const onPlacesChanged = () => {
    const places = searchBoxRef.current.getPlaces();
    const location = places[0].geometry.location;

    const lat = location.lat();
    const lng = location.lng();

    setCenter({ lat, lng });

    if (map) {
      map.panTo({ lat, lng });
      map.setZoom(12);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      //  className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        // onClick={onClose}
      />

      {/* Modal */}
      <div
        // className="relative w-full  max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row"
        className="relative w-full md:w-3/4  max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        {(step === "login" || step === "otp") && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <AiOutlineClose className="w-5 h-5 text-gray-600" />
          </button>
        )}

        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-3"> */}
        <div className="flex flex-col md:flex-row w-full">
          {/* Left: Form */}
          <div className="order-2 md:order-1 flex-1 p-6 md:p-8 flex flex-col justify-center min-w-0">
            {/* Logo / Crown - using text as placeholder if no crown asset */}
            {(step === "login" || step === "otp") && (
              <div className="flex justify-center mb-4">
                <img src={headerimg} />
              </div>
            )}
            {(step === "login" || step === "otp") && (
              <h2 className="text-xl md:text-2xl font-bold text-center text-primary mb-1">
                {t("login.welcome")}
              </h2>
            )}

            {step === "login" ? (
              <>
                <p className="text-sm text-gray-600 text-center mb-6">
                  {t("login.subtitle")}
                </p>
                <input
                  type="tel"
                  placeholder={t("login.phonePlaceholder")}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:border-primary focus:bg-white focus:outline-none transition-colors mb-4"
                />
                <div className="flex items-center justify-between mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={keepSignedIn}
                      onChange={(e) => setKeepSignedIn(e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-600">
                      {t("login.check1")}
                    </span>
                  </label>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={keepSignedIn}
                      onChange={(e) => setKeepSignedIn(e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-600">
                      {t("login.check2")}
                    </span>
                  </label>
                </div>
                <button
                  onClick={handleGetOtp}
                  className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  {t("login.getOtp")}
                </button>
              </>
            ) : step === "otp" ? (
              <>
                <p className="text-sm text-gray-600 text-center mb-6">
                  {t("login.enterOtp")}
                </p>
                <div className="flex gap-2 justify-center mb-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-11 h-12 md:w-12 md:h-14 text-center text-lg font-semibold rounded-xl border-2 border-gray-200 bg-gray-50 focus:border-primary focus:bg-white focus:outline-none transition-colors"
                    />
                  ))}
                </div>
                <button className="text-sm text-primary hover:underline mb-4">
                  {t("login.resendOtp")}
                </button>
                <button
                  onClick={handleVerifyOtp}
                  className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  {t("login.verifyOtp")}
                </button>
              </>
            ) : step === "createprofile" ? (
              <>
                <p className="md:mt-0 mt-3 text-lg md:text-2xl font-bold text-black text-center mb-8">
                  Create Your Steer-U Profile
                </p>

                {/* Card */}
                <div className="    ">
                  {/* Progress Section */}
                  {/* <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-sm md:text-base text-black">
                        MOMENT OF ARRIVAL
                      </h3>
                      <span className="text-xs md:text-sm bg-orange-100 text-primary px-3 py-1 rounded-full">
                        In Progress
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full w-[70%]"></div>
                    </div>

                    <p className="text-xs text-gray-500 mt-2">
                      Refreshing balance for account #ASTRO-992834
                    </p>
                  </div> */}

                  {/* Form */}
                  <div className="space-y-5">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your name"
                        className="text-xs md:text-sm w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    {/* DOB + Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Date Of Birth
                        </label>
                        <input
                          type="date"
                          className="text-xs md:text-sm  w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Exact Time
                        </label>
                        <input
                          type="time"
                          className="text-xs md:text-sm  w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Birth Location
                      </label>
                      <input
                        type="text"
                        placeholder="Search your city / country"
                        className="text-xs md:text-sm  w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-sm font-medium mb-3">
                        Gender Identity
                      </label>

                      <div className="grid grid-cols-3 gap-3">
                        <button className="flex justify-center items-center py-2 text-xs md:text-sm rounded-xl bg-primary text-white font-medium">
                          <FaVenus className="" /> Female
                        </button>

                        <button className="flex justify-center items-center py-2 text-xs md:text-sm rounded-xl border border-gray-300 text-gray-600 font-medium hover:border-primary">
                          <FaMars className="" /> Male
                        </button>

                        <button className="flex justify-center items-center py-2 text-xs md:text-sm rounded-xl border border-gray-300 text-gray-600 font-medium hover:border-primary">
                          <FaTransgender className="" /> Other
                        </button>
                      </div>
                    </div>

                    {/* Continue Button */}
                    <button
                      onClick={handleProfileContinue}
                      className="w-full py-4 mt-4 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition-opacity"
                    >
                      Continue →
                    </button>
                  </div>
                </div>
              </>
            ) : isLoaded ? (
              <div>
                {/* Search Box */}
                <StandaloneSearchBox
                  onLoad={(ref) => (searchBoxRef.current = ref)}
                  onPlacesChanged={onPlacesChanged}
                >
                  <input
                    type="text"
                    placeholder="Search city"
                    className="border p-3 rounded w-full mb-3"
                  />
                </StandaloneSearchBox>

                {/* Google Map */}
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={center}
                  zoom={10}
                  onLoad={onLoad}
                  onUnmount={onUnmount}
                  onClick={(e) =>
                    setCenter({
                      lat: e.latLng.lat(),
                      lng: e.latLng.lng(),
                    })
                  }
                >
                  <Marker position={center} />
                </GoogleMap>
                <button
                  onClick={handleProfileSubmission}
                  className="w-full py-4 mt-4 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  Continue →
                </button>
              </div>
            ) : (
              <div>Loading...</div>
            )}

            {/* Social login */}
            {(step === "login" || step === "otp") && (
              <div className="flex justify-center gap-4 mt-6">
                <button className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-primary/30 hover:bg-primary/5 transition-colors">
                  <FcGoogle className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-primary/30 hover:bg-primary/5 transition-colors">
                  <FaApple className="w-5 h-5 text-gray-700" />
                </button>
                <button className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-primary/30 hover:bg-primary/5 transition-colors">
                  <FaFacebook className="w-5 h-5 text-[#1877F2]" />
                </button>
              </div>
            )}
          </div>

          {/* Right: Illustration - hidden on small screens */}
          <div className="order-1 hidden md:order-2 flex-1 md:flex items-center justify-center p-6 min-w-[200px] mt-5">
            <img
              src={loginimg}
              alt=""
              className="max-w-full max-h-[400px] object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
