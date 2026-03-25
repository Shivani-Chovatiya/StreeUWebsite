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
  Autocomplete,
} from "@react-google-maps/api";

import {
  GoogleAuthProvider,
  linkWithCredential,
  linkWithPopup,
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
} from "firebase/auth";
import { toast } from "react-toastify";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db, googleProvider } from "../config/firebase";
import { MapPin } from "lucide-react";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 23.0225,
  lng: 72.5714,
};

const libraries = ["places"];

/**
 * Validates Indian phone number format
 * Accepts: 10-digit number or +91 followed by 10-digit number
 * @param {string} phoneNumber - Phone number to validate
 * @returns {boolean} - True if valid Indian phone number
 */
const validateIndianPhoneNumber = (phoneNumber) => {
  // Remove all whitespace
  const cleaned = phoneNumber.replace(/\s/g, "");

  // Check if it matches: 10 digits or +91 followed by 10 digits
  const phoneRegex = /^(\+91|0)?[6-9]\d{9}$/;
  return phoneRegex.test(cleaned);
};

const Login = ({ isOpen, onClose, screenName, referralCodeData }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState("login"); // "login" | "otp"
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);

  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null); // Store confirmation result in state
  const [isLoadingOtp, setIsLoadingOtp] = useState(false); // Track OTP sending state
  const [verifierInitialized, setVerifierInitialized] = useState(false); // Track reCAPTCHA initialization
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthLocation, setBirthLocation] = useState("");
  const [gender, setGender] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const otpRefs = useRef([]);
  const recaptchaVerifierRef = useRef(null); // Store reCAPTCHA verifier reference
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState(defaultCenter);
  const [locationData, setLocationData] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    lat: 20.5937,
    lng: 78.9629,
  });
  const [autocomplete, setAutocomplete] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 }); // Default to India
  const [markerPosition, setMarkerPosition] = useState({
    lat: 20.5937,
    lng: 78.9629,
  });
  const searchBoxRef = useRef(null);

  const navigate = useNavigate();
  // console.log(referralCodeData);
  useEffect(() => {
    if (referralCodeData) {
      setReferralCode(referralCodeData);
    }
  }, [referralCodeData]);

  const resetAllStates = () => {
    setStep("login");
    setPhone("");
    setOtp(["", "", "", "", "", ""]);
    setConfirmationResult(null);
    setVerifierInitialized(false);

    // Profile fields
    setFullName("");
    setDob("");
    setBirthTime("");
    setBirthLocation("");
    setGender("");
    setLocationData(null);

    // Map reset
    setCenter(defaultCenter);

    // Checkboxes
    setAgreeTerms(false);
    setKeepSignedIn(false);
  };
  // Cleanup function - called when modal closes
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      // Reset all state when modal closes
      // resetAllStates();
      // Clean up reCAPTCHA verifier
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch (error) {
          console.warn("Error clearing reCAPTCHA:", error);
        }
        recaptchaVerifierRef.current = null;
      }
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const formatPhoneNumber = (phoneNumber, countryCode) => {
    // remove non digits
    let cleaned = phoneNumber.replace(/\D/g, "");

    // remove leading zero
    if (cleaned.startsWith("0")) {
      cleaned = cleaned.substring(1);
    }

    return `${countryCode}${cleaned}`;
  };
  /**
   *
   * Configure and initialize reCAPTCHA verifier
   * Only initializes once to prevent "reCAPTCHA already rendered" error
   */
  const setupRecaptchaVerifier = async () => {
    // Prevent re-initialization if already set up
    if (verifierInitialized && recaptchaVerifierRef.current) {
      return recaptchaVerifierRef.current;
    }

    try {
      // Clear any existing verifier
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }

      // Create new reCAPTCHA verifier instance
      const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "normal", // or "invisible" for invisible reCAPTCHA
        // size: "invisible",
        callback: (response) => {
          console.log("reCAPTCHA verified:", response);
        },
        "expired-callback": () => {
          console.log("reCAPTCHA expired");
          setVerifierInitialized(false);
        },
        defaultCountry: "IN",
      });

      // Render the verifier
      await verifier.render();

      recaptchaVerifierRef.current = verifier;
      setVerifierInitialized(true);

      return verifier;
    } catch (error) {
      console.error("Error setting up reCAPTCHA:", error);
      toast.error(
        "Failed to initialize reCAPTCHA. Please refresh and try again.",
      );
      throw error;
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    let interval;

    if (step === "otp" && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }

    return () => clearInterval(interval);
  }, [resendTimer, step]);

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
  const validatePhoneNumber = (phone, countryCode) => {
    const cleaned = phone.replace(/\D/g, "");

    switch (countryCode) {
      case "+91": // India
        return /^[6-9]\d{9}$/.test(cleaned);

      case "+1": // USA / Canada
        return /^\d{10}$/.test(cleaned);

      case "+44": // UK
        return /^\d{10,11}$/.test(cleaned);

      case "+61": // Australia
        return /^\d{9}$/.test(cleaned);

      case "+971": // UAE
        return /^\d{9}$/.test(cleaned);

      default:
        return cleaned.length >= 6;
    }
  };

  const handleGetOtp = async (e) => {
    // Prevent default form submission
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    // Validation: Check if phone number is entered
    if (!phone || phone.trim() === "") {
      toast.warning("Please enter your phone number");
      return;
    }

    // Validation: Check Indian phone number format
    // if (!validateIndianPhoneNumber(phone)) {
    //   toast.error("Please enter a valid Indian phone number (10 digits)");
    //   return;
    // }
    if (!validatePhoneNumber(phone, countryCode)) {
      toast.error("Please enter a valid phone number");
      return;
    }
    setIsLoadingOtp(true);

    try {
      // Setup reCAPTCHA verifier
      const appVerifier = await setupRecaptchaVerifier();

      // Format phone number to +91 format
      const formattedPhoneNumber = formatPhoneNumber(phone, countryCode);
      console.log("Sending OTP to:", formattedPhoneNumber);

      // Send OTP via Firebase
      const result = await signInWithPhoneNumber(
        auth,
        formattedPhoneNumber,
        appVerifier,
      );

      // Store confirmation result in state (not in window object)
      setConfirmationResult(result);

      // Move to OTP verification step
      setStep("otp");
      // Reset OTP boxes
      setOtp(["", "", "", "", "", ""]);

      // Start resend timer
      setCanResend(false);
      setResendTimer(60);
      // Show success message
      toast.success("OTP sent successfully! ✅");
      console.log("OTP sent to:", formattedPhoneNumber);
    } catch (error) {
      console.error("Error sending OTP:", error);

      // Reset reCAPTCHA verifier on error
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch (e) {
          console.warn("Error clearing reCAPTCHA:", e);
        }
        recaptchaVerifierRef.current = null;
        setVerifierInitialized(false);
      }

      // Handle specific error codes
      switch (error.code) {
        case "auth/invalid-phone-number":
          toast.error("Invalid phone number format");
          break;
        case "auth/too-many-requests":
          toast.error("Too many attempts. Please try again in a few minutes");
          break;
        case "auth/missing-phone-number":
          toast.error("Please enter a phone number");
          break;
        case "auth/user-disabled":
          toast.error("This account has been disabled");
          break;
        case "auth/operation-not-supported-in-this-environment":
          toast.error(
            "Phone authentication is not supported in your region. Please check your Firebase settings.",
          );
          break;
        default:
          toast.error(error.message || "Failed to send OTP. Please try again");
      }
    } finally {
      setIsLoadingOtp(false);
    }
  };

  const handleVerifyOtp2 = async (e) => {
    // Prevent default form submission
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    const fullOtp = otp.join("");

    // Validation: Check if all OTP digits are entered
    if (fullOtp.length !== 6) {
      toast.warning("Please enter all 6 OTP digits");
      return;
    }

    // Validation: Check if confirmation result exists
    if (!confirmationResult) {
      toast.error("Session expired. Please request OTP again");
      setStep("login");
      return;
    }

    try {
      setIsVerifyingOtp(true);
      console.log("Verifying OTP...");

      // Confirm the OTP with Firebase
      const result = await confirmationResult.confirm(fullOtp);
      const user = result.user;
      const uid = user.uid;

      console.log("OTP verified successfully! User UID:", uid);

      // Check if user profile already exists
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      const generatedReferralCode = uid.slice(0, 6).toUpperCase();
      if (userSnap.exists()) {
        const userData = userSnap.data();

        // Check if referralCode exists
        if (!userData.referralCode) {
          await updateDoc(userRef, {
            referralCode: generatedReferralCode,
          });
        }
        // User profile exists - redirect to profile page
        toast.success("Welcome back! 👋");
        setConfirmationResult(null);
        setOtp(["", "", "", "", "", ""]);
        setPhone("");
        onClose();
        navigate(`/${screenName}`);
      } else {
        // New user - proceed to profile creation
        toast.success("OTP verified! 👍 Complete your profile");
        setStep("createprofile");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);

      // Handle specific error codes
      if (error.code === "auth/invalid-verification-code") {
        toast.error("Invalid OTP. Please check and try again");
      } else if (error.code === "auth/code-expired") {
        toast.error("OTP has expired. Please request a new one");
        setStep("login");
      } else {
        toast.error("Failed to verify OTP. Please try again");
      }
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const fullOtp = otp.join("");

    if (fullOtp.length !== 6) {
      toast.warning("Please enter all 6 OTP digits");
      return;
    }

    if (!confirmationResult) {
      toast.error("Session expired. Please request OTP again");
      setStep("login");
      return;
    }

    try {
      setIsVerifyingOtp(true);

      // Confirm OTP
      const result = await confirmationResult.confirm(fullOtp);
      const phoneUser = result.user;
      const phoneNumber = phoneUser.phoneNumber;

      // Check if user profile exists
      const userRef = doc(db, "users", phoneUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        // Existing user - update last login
        await updateDoc(userRef, {
          phone: phoneNumber,
          lastLogin: serverTimestamp(),
        });

        const userData = userSnap.data();
        toast.success(`Welcome back, ${userData.fullName}! 👋`);
        setConfirmationResult(null);
        setOtp(["", "", "", "", "", ""]);
        setPhone("");
        onClose();
        navigate(`/${screenName}`);
        return;
      }

      // New user - go to profile creation
      toast.success("OTP verified! Complete your profile");
      setStep("createprofile");
    } catch (error) {
      console.error("Error verifying OTP:", error);

      if (error.code === "auth/invalid-verification-code") {
        toast.error("Invalid OTP. Please check and try again");
      } else if (error.code === "auth/code-expired") {
        toast.error("OTP has expired. Please request a new one");
        setStep("login");
      } else {
        toast.error("Failed to verify OTP. Please try again");
      }
    } finally {
      setIsVerifyingOtp(false);
    }
  };
  const handleResendOtp = async () => {
    if (!canResend) return;

    try {
      // Clear old reCAPTCHA
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
        setVerifierInitialized(false);
      }

      toast.info("Resending OTP...");

      await handleGetOtp();
    } catch (error) {
      toast.error("Failed to resend OTP");
    }
  };
  const handleProfileContinue = () => {
    if (!fullName || !dob || !birthTime || !gender) {
      toast.warning("Please fill all fields");
      return;
    }

    const user = auth.currentUser;

    const providers = user.providerData.map((p) => p.providerId);

    const isGoogleLinked = providers.includes("google.com");
    const isPhoneLinked = providers.includes("phone");

    // 🔥 FORCE LINKING CHECK
    if (!isGoogleLinked && !user.email) {
      toast.error("Please link your Google account first 🔗");
      return;
    }

    if (!isPhoneLinked && !user.phoneNumber) {
      toast.error("Please link your phone number first 📱");
      return;
    }

    // Phone validation (if user didn't login with phone)
    if (!auth.currentUser?.phoneNumber && !phone) {
      toast.warning("Please enter your phone number");
      return;
    }

    // Phone format validation
    if (phone && !validatePhoneNumber(phone, countryCode)) {
      toast.error("Please enter a valid phone number");
      return;
    }
    // onClose();
    setStep("createprofile2");
  };
  // const handleProfileSubmission = async () => {
  //   if (!fullName || !dob || !birthTime || !gender) {
  //     toast.warning("Please fill all fields");
  //     return;
  //   }
  //   if (!locationData) {
  //     toast.error("Please select a location");
  //     return;
  //   }

  //   try {
  //     setIsSavingProfile(true);

  //     const user = auth.currentUser;

  //     if (!user) {
  //       toast.error("User session expired. Please login again.");
  //       return;
  //     }
  //     const generatedReferralCode = user.uid.slice(0, 6).toUpperCase();
  //     if (referralCode) {
  //       const q = query(
  //         collection(db, "users"),
  //         where("referralCode", "==", referralCode),
  //       );

  //       const querySnapshot = await getDocs(q);

  //       if (!querySnapshot.empty) {
  //         const refUserDoc = querySnapshot.docs[0];

  //         await updateDoc(refUserDoc.ref, {
  //           credits: increment(1),
  //         });

  //         toast.success("Referral applied 🎉");
  //       }
  //     }
  //     await setDoc(doc(db, "users", user.uid), {
  //       uid: user.uid,
  //       phone: user.phoneNumber,
  //       fullName,
  //       dob,
  //       birthTime,
  //       birthLocation: locationData.address,
  //       gender,
  //       locationData,
  //       credits: 1,
  //       referralCode: generatedReferralCode,
  //       createdAt: serverTimestamp(),
  //     });

  //     toast.success("Profile created successfully 🎉");

  //     setStep("profilesubmit");
  //     setAgreeTerms(false);
  //     setKeepSignedIn(false);
  //     resetAllStates();
  //     onClose();
  //     navigate(`/${screenName}`);
  //   } catch (error) {
  //     console.error("Error saving profile:", error);
  //     toast.error("Failed to save profile");
  //   } finally {
  //     setIsSavingProfile(false);
  //   }
  // };
  const handleProfileSubmission = async () => {
    if (!fullName || !dob || !birthTime || !gender) {
      toast.warning("Please fill all required fields");
      return;
    }
    if (!locationData) {
      toast.error("Please select a location");
      return;
    }

    try {
      setIsSavingProfile(true);

      const user = auth.currentUser;

      if (!user) {
        toast.error("User session expired. Please login again.");
        return;
      }

      const generatedReferralCode = user.uid.slice(0, 6).toUpperCase();

      // Format phone number properly
      let finalPhone =
        user.phoneNumber ||
        (phone ? formatPhoneNumber(phone, countryCode) : null);
      let finalEmail = user.email || email || null;

      // Apply referral code
      if (referralCode) {
        const q = query(
          collection(db, "users"),
          where("referralCode", "==", referralCode),
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const refUserDoc = querySnapshot.docs[0];
          await updateDoc(refUserDoc.ref, {
            credits: increment(1),
          });
          toast.success("Referral applied 🎉");
        }
      }

      // Create user profile
      const userData = {
        uid: user.uid,
        phone: finalPhone,
        email: finalEmail,
        // photoURL: user.photoURL || null,
        fullName,
        dob,
        birthTime,
        birthLocation: locationData.address,
        gender,
        locationData,
        credits: 1,
        referralCode: generatedReferralCode,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      };

      // Remove null values
      Object.keys(userData).forEach(
        (key) => userData[key] === null && delete userData[key],
      );

      await setDoc(doc(db, "users", user.uid), userData);

      toast.success("Profile created successfully 🎉");

      setStep("profilesubmit");
      setAgreeTerms(false);
      setKeepSignedIn(false);
      resetAllStates();
      onClose();
      navigate(`/${screenName}`);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // When map loads
  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);
  const onAutocompleteLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };
  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  useEffect(() => {
    if (map && step === "createprofile2") {
      const timer = setTimeout(() => {
        window.google.maps.event.trigger(map, "resize");
        map.setCenter(mapCenter);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [map, step]);
  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();

      if (place.geometry) {
        const lat = Number(place.geometry.location.lat());
        const lng = Number(place.geometry.location.lng());

        // Extract address components
        let city = "";
        let state = "";
        let country = "";

        place.address_components?.forEach((component) => {
          if (component.types.includes("locality")) {
            city = component.long_name;
          }
          if (component.types.includes("administrative_area_level_1")) {
            state = component.long_name;
          }
          if (component.types.includes("country")) {
            country = component.long_name;
          }
        });

        // setEditFormData((prev) => ({
        //   ...prev,
        //   birthLocation: place.formatted_address,
        //   locationData: {
        //     ...prev.locationData,
        //     address: place.formatted_address,
        //     city: city,
        //     state: state,
        //     country: country,
        //     lat: lat,
        //     lng: lng,
        //   },
        // }));
        setSearchValue(place.formatted_address);
        setLocationData({
          address: place.formatted_address,
          city,
          state,
          country,
          lat,
          lng,
        });
        setMapCenter({ lat, lng });
        setMarkerPosition({ lat, lng });
      }
    }
  };

  const onMarkerDragEnd = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    setMarkerPosition({ lat, lng });
    setLocationData((prev) => ({
      ...prev,
      lat: lat,
      lng: lng,
    }));
    setSearchValue(locationData.address);
    // setEditFormData((prev) => ({
    //   ...prev,
    //   locationData: {
    //     ...prev.locationData,
    //     lat: lat,
    //     lng: lng,
    //   },
    // }));

    // Reverse geocode to get address
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        let city = "";
        let state = "";
        let country = "";

        results[0].address_components?.forEach((component) => {
          if (component.types.includes("locality")) {
            city = component.long_name;
          }
          if (component.types.includes("administrative_area_level_1")) {
            state = component.long_name;
          }
          if (component.types.includes("country")) {
            country = component.long_name;
          }
        });
        setSearchValue(results[0].formatted_address);
        setLocationData({
          address: results[0].formatted_address,
          city,
          state,
          country,
          lat,
          lng,
        });
      }
    });
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds,
    ).padStart(2, "0")}`;
  };

  // const handleGoogleLogin = async () => {
  //   try {
  //     const result = await signInWithPopup(auth, googleProvider);
  //     const user = result.user;
  //     const uid = user.uid;

  //     const userRef = doc(db, "users", uid);
  //     const userSnap = await getDoc(userRef);

  //     // ✅ EXISTING USER
  //     if (userSnap.exists()) {
  //       toast.success("Welcome back 👋");
  //       onClose();
  //       navigate(`/${screenName}`);
  //       return;
  //     }

  //     // 🆕 NEW USER → go to profile step
  //     setStep("createprofile");
  //     toast.success("Login successful 🎉");
  //   } catch (error) {
  //     console.error("Google Login Error:", error);
  //     toast.error("Google login failed");
  //   }
  // };.
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;

      let user = googleUser;
      console.log(googleUser);
      // 🔥 FIRESTORE CHECK
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        await updateDoc(userRef, {
          email: user.email || null,
          lastLogin: serverTimestamp(),
        });

        toast.success("Welcome back 👋");
        onClose();
        navigate(`/${screenName}`);
        return;
      }

      // 🆕 NEW USER
      setEmail(user.email || "");
      setStep("createprofile");

      toast.success("Login successful 🎉 Complete profile");
    } catch (error) {
      console.error(error);
      toast.error("Google login failed");
    }
  };

  const linkGoogle = async () => {
    const user = auth.currentUser;

    await linkWithPopup(user, googleProvider);
  };
  const [isVerifyingLink, setIsVerifyingLink] = useState(false);
  const sendOtpForLink = async () => {
    if (recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current.clear();
      recaptchaVerifierRef.current = null;
      setVerifierInitialized(false);
    }

    // Validation: Check if phone number is entered
    if (!phone || phone.trim() === "") {
      toast.warning("Please enter your phone number");
      return;
    }

    // Validation: Check Indian phone number format
    // if (!validateIndianPhoneNumber(phone)) {
    //   toast.error("Please enter a valid Indian phone number (10 digits)");
    //   return;
    // }
    if (!validatePhoneNumber(phone, countryCode)) {
      toast.error("Please enter a valid phone number");
      return;
    }
    setIsLoadingOtp(true);

    try {
      // Setup reCAPTCHA verifier
      const appVerifier = await setupRecaptchaVerifier();

      // Format phone number to +91 format
      const formattedPhoneNumber = formatPhoneNumber(phone, countryCode);
      console.log("Sending OTP to:", formattedPhoneNumber);

      // Send OTP via Firebase
      const result = await signInWithPhoneNumber(
        auth,
        formattedPhoneNumber,
        appVerifier,
      );

      // Store confirmation result in state (not in window object)
      setConfirmationResult(result);

      // Reset OTP boxes
      setOtp(["", "", "", "", "", ""]);

      // Start resend timer
      setCanResend(false);
      setResendTimer(60);
      // Show success message
      toast.success("OTP sent successfully! ✅");
      console.log("OTP sent to:", formattedPhoneNumber);
    } catch (error) {
      console.error("Error sending OTP:", error);

      // Reset reCAPTCHA verifier on error
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch (e) {
          console.warn("Error clearing reCAPTCHA:", e);
        }
        recaptchaVerifierRef.current = null;
        setVerifierInitialized(false);
      }

      // Handle specific error codes
      switch (error.code) {
        case "auth/invalid-phone-number":
          toast.error("Invalid phone number format");
          break;
        case "auth/too-many-requests":
          toast.error("Too many attempts. Please try again in a few minutes");
          break;
        case "auth/missing-phone-number":
          toast.error("Please enter a phone number");
          break;
        case "auth/user-disabled":
          toast.error("This account has been disabled");
          break;
        case "auth/operation-not-supported-in-this-environment":
          toast.error(
            "Phone authentication is not supported in your region. Please check your Firebase settings.",
          );
          break;
        default:
          toast.error(error.message || "Failed to send OTP. Please try again");
      }
    } finally {
      setIsLoadingOtp(false);
    }

    return confirmationResult;
  };

  const verifyAndLinkPhone = async (confirmationResult, code) => {
    setIsVerifyingLink(true);
    try {
      const credential = PhoneAuthProvider.credential(
        confirmationResult.verificationId,
        code,
      );

      await linkWithCredential(auth.currentUser, credential);
      toast.success("Phone linked successfully! 📱");
      setOtpSent(false);
      setOtp(["", "", "", "", "", ""]);
    } catch (error) {
      console.error("Error verifying OTP:", error);
      if (error.code === "auth/account-exists-with-different-credential") {
        toast.error(
          "This phone number is already linked with another account. Please login using that account.",
        );
      } else if (error.code === "auth/credential-already-in-use") {
        toast.error(
          "This phone number is already in use. Try logging in instead.",
        );
      } else if (error.code === "auth/invalid-verification-code") {
        toast.error("Invalid OTP. Please check and try again");
      } else if (error.code === "auth/code-expired") {
        toast.error("OTP has expired. Please request a new one");
        setStep("login");
      } else {
        toast.error("Failed to verify OTP. Please try again");
      }
    } finally {
      setIsVerifyingLink(false);
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
        className="relative w-full md:w-3/4   bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        {(step === "login" || step === "otp") && (
          <button
            onClick={() => {
              resetAllStates();
              onClose();
            }}
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
                {/* <img src={headerimg} /> */}
                <div
                  className="rounded-xl p-1"
                  style={{
                    background: "linear-gradient(135deg, #1a0a00, #3d1a00)",
                  }}
                >
                  <img
                    src={headerimg}
                    alt="logo"
                    className="w-12 h-12 md:w-24 md:h-24 transform group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
            )}
            {(step === "login" || step === "otp") && (
              <h2 className="text-xl md:text-2xl font-bold text-center text-primary mb-1">
                {t("login.welcome")}{" "}
                <span className="px-1 font-logo animate-pulse  bg-gradient-to-r from-[#8B1E00] via-[#D04500] to-[#FF8A3D] bg-clip-text text-transparent drop-shadow-[0_2px_6px_rgba(208,69,0,0.35)]">
                  Steer-U
                </span>{" "}
                👋
              </h2>
            )}

            {step === "login" ? (
              <>
                <p className="text-sm text-gray-600 text-center mb-6">
                  {t("login.subtitle")}
                </p>
                {/* <input
                  type="tel"
                  placeholder={t("login.phonePlaceholder")}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength="13"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:border-primary focus:bg-white focus:outline-none transition-colors mb-4"
                  aria-label="Phone number input"
                /> */}
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="border border-primary rounded-xl px-2 py-3"
                  >
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+61">🇦🇺 +61</option>
                    <option value="+971">🇦🇪 +971</option>
                  </select>

                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:border-primary focus:bg-white focus:outline-none transition-colors "
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Referral Code (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter referral code"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
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
                      {t("login.check1")}
                    </span>
                  </label>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-600">
                      {t("login.check2")}
                    </span>
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleGetOtp}
                  disabled={!agreeTerms || !keepSignedIn || isLoadingOtp}
                  className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingOtp ? "Sending OTP..." : t("login.getOtp")}
                </button>
                <div className="flex items-center gap-3 w-full m-2">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Or
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                </div>
                <div className="items-center justify-center flex">
                  <button
                    onClick={handleGoogleLogin}
                    className="w-10 h-10   rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-primary/30 hover:bg-primary/5 transition-colors"
                  >
                    <FcGoogle className="w-5 h-5" />
                  </button>
                </div>
                {/* reCAPTCHA container - visible when reCAPTCHA is in "normal" mode */}
                <div
                  id="recaptcha-container"
                  className="mt-4 flex justify-center"
                ></div>
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
                      aria-label={`OTP digit ${index + 1}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={!canResend}
                  className={`text-sm mb-4 ${
                    canResend
                      ? "text-primary hover:underline"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {canResend
                    ? t("login.resendOtp")
                    : `Resend OTP in ${formatTime(resendTimer)}`}
                </button>
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={isVerifyingOtp}
                  className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifyingOtp ? "Verifying OTP..." : t("login.verifyOtp")}
                </button>
                <div
                  id="recaptcha-container"
                  className="mt-4 flex justify-center"
                ></div>
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
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                    {!auth.currentUser?.providerData?.some(
                      (p) => p.providerId === "google.com",
                    ) && (
                      <button
                        onClick={linkGoogle}
                        className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-xl py-2 hover:bg-gray-100 transition"
                      >
                        <FcGoogle className="text-lg" />
                        <span className="text-sm font-medium">
                          Link Google Account
                        </span>
                      </button>
                    )}

                    {!auth.currentUser?.phoneNumber && (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <select
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            className="border border-gray-300 rounded-xl px-2 py-2"
                          >
                            <option value="+91">🇮🇳 +91</option>
                            <option value="+1">🇺🇸 +1</option>
                            <option value="+44">🇬🇧 +44</option>
                          </select>

                          <input
                            type="tel"
                            placeholder="Enter phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="text-sm w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div
                          id="recaptcha-container"
                          className="mt-4 flex justify-center"
                        ></div>
                        {/* SEND OTP */}
                        {!otpSent ? (
                          <button
                            onClick={async () => {
                              await sendOtpForLink(`${countryCode}${phone}`);
                              setOtpSent(true);
                            }}
                            disabled={isLoadingOtp}
                            className="w-full py-2 rounded-xl bg-primary text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            {isLoadingOtp ? (
                              <>
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Sending...
                              </>
                            ) : (
                              "Send OTP"
                            )}
                          </button>
                        ) : (
                          <>
                            <input
                              type="text"
                              placeholder="Enter OTP"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              className="text-sm w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            />

                            <button
                              onClick={async () => {
                                await verifyAndLinkPhone(
                                  confirmationResult,
                                  otp,
                                );
                                setOtpSent(false);
                              }}
                              disabled={isVerifyingLink}
                              className="w-full py-2 rounded-xl bg-green-600 text-white text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                              {isVerifyingLink ? (
                                <>
                                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                  Linking...
                                </>
                              ) : (
                                "Verify & Link Phone"
                              )}
                            </button>

                            <button
                              onClick={async () => {
                                await sendOtpForLink(`${countryCode}${phone}`);
                              }}
                              className="text-xs text-primary underline text-center"
                            >
                              Resend OTP
                            </button>
                          </>
                        )}{" "}
                      </div>
                    )}
                    {/* DOB + Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Date Of Birth
                        </label>
                        <input
                          type="date"
                          className="text-xs md:text-sm  w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Exact Time
                        </label>
                        <input
                          type="time"
                          className="text-xs md:text-sm  w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                          value={birthTime}
                          onChange={(e) => setBirthTime(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Location */}
                    {/* <div>
                      <label className="block text-sm font-medium mb-1">
                        Birth Location
                      </label>
                      <input
                        type="text"
                        placeholder="Search your city / country"
                        className="text-xs md:text-sm  w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        value={birthLocation}
                        onChange={(e) => setBirthLocation(e.target.value)}
                      />
                    </div> */}
                    {/* {isLoaded && (
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

                          setBirthLocation(formattedLocation);
                        }}
                      >
                        <input
                          type="text"
                          value={birthLocation}
                          placeholder="Search village / city / district / country"
                          className="text-xs md:text-sm w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                          onChange={(e) => setBirthLocation(e.target.value)}
                        />
                      </StandaloneSearchBox>
                    )} */}
                    {/* Gender */}
                    <div>
                      <label className="block text-sm font-medium mb-3">
                        Gender Identity
                      </label>

                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => setGender("female")}
                          //  className="flex justify-center items-center py-2 text-xs md:text-sm rounded-xl bg-primary text-white font-medium"
                          className={`flex justify-center items-center py-2 rounded-xl ${
                            gender === "female"
                              ? "bg-primary text-white"
                              : "border border-gray-300 text-gray-600"
                          }`}
                        >
                          <FaVenus className="" /> Female
                        </button>

                        <button
                          onClick={() => setGender("male")}
                          //  className="flex justify-center items-center py-2 text-xs md:text-sm rounded-xl bg-primary text-white font-medium"
                          className={`flex justify-center items-center py-2 rounded-xl ${
                            gender === "male"
                              ? "bg-primary text-white"
                              : "border border-gray-300 text-gray-600"
                          }`}
                          // className="flex justify-center items-center py-2 text-xs md:text-sm rounded-xl border border-gray-300 text-gray-600 font-medium hover:border-primary"
                        >
                          <FaMars className="" /> Male
                        </button>

                        <button
                          onClick={() => setGender("other")}
                          className={`flex justify-center items-center py-2 rounded-xl ${
                            gender === "other"
                              ? "bg-primary text-white"
                              : "border border-gray-300 text-gray-600"
                          }`}
                          // className="flex justify-center items-center py-2 text-xs md:text-sm rounded-xl border border-gray-300 text-gray-600 font-medium hover:border-primary"
                        >
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
                {/* <StandaloneSearchBox
                  onLoad={(ref) => (searchBoxRef.current = ref)}
                  onPlacesChanged={onPlacesChanged}
                > */}
                {/* <StandaloneSearchBox
                  onLoad={(ref) => (searchBoxRef.current = ref)}
                  onPlacesChanged={onPlacesChanged}
                >
                  <input
                    type="text"
                    placeholder="Search city"
                    className="border p-3 rounded w-full mb-3"
                  />
                </StandaloneSearchBox> */}
                <Autocomplete
                  onLoad={onAutocompleteLoad}
                  onPlaceChanged={onPlaceChanged}
                >
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search for a location..."
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      className=" w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </Autocomplete>

                {/* Google Map */}
                {/* <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={center}
                  zoom={10}
                  onLoad={onLoad}
                  onUnmount={onUnmount}
                  // onClick={(e) =>
                  //   setCenter({
                  //     lat: e.latLng.lat(),
                  //     lng: e.latLng.lng(),
                  //   })
                  // }
                  onClick={(e) => {
                    const lat = e.latLng.lat();
                    const lng = e.latLng.lng();

                    setCenter({ lat, lng });

                    const geocoder = new window.google.maps.Geocoder();

                    geocoder.geocode(
                      { location: { lat, lng } },
                      (results, status) => {
                        if (status === "OK" && results[0]) {
                          const place = results[0];

                          let city = "";
                          let state = "";
                          let country = "";

                          place.address_components.forEach((component) => {
                            if (component.types.includes("locality")) {
                              city = component.long_name;
                            }
                            if (
                              component.types.includes(
                                "administrative_area_level_1",
                              )
                            ) {
                              state = component.long_name;
                            }
                            if (component.types.includes("country")) {
                              country = component.long_name;
                            }
                          });

                          setLocationData({
                            address: place.formatted_address,
                            city,
                            state,
                            country,
                            lat,
                            lng,
                          });
                        }
                      },
                    );
                  }}
                >
                  <Marker position={center} />
                </GoogleMap> */}
                <div className="rounded-lg overflow-hidden border border-slate-200">
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={mapCenter}
                    zoom={12}
                    // onLoad={(mapInstance) => {
                    //   mapRef.current = mapInstance;
                    //   setMap(mapInstance);
                    //   // Wait for modal animation to finish
                    //   setTimeout(() => {
                    //     window.google.maps.event.trigger(mapInstance, "resize");
                    //     mapInstance.setCenter(mapCenter);
                    //   }, 300); // ✅ increase to 300ms (modal needs time to fully render)
                    // }}
                    onLoad={(mapInstance) => {
                      setMap(mapInstance);
                    }}
                    onUnmount={onUnmount}
                  >
                    <Marker
                      position={markerPosition}
                      draggable={true}
                      onDragEnd={onMarkerDragEnd}
                    />
                  </GoogleMap>
                </div>
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
            {/* {(step === "login" || step === "otp") && (
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
            )} */}
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
