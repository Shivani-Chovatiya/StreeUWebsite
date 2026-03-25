import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { db } from "../config/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import Login from "../components/Login";
import SessionCard from "../components/SessionCard";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import axios from "axios";
import CalendarCard from "../components/PsychologicalScreens/CalendarCard";
import { useTranslation } from "react-i18next";

const containerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "12px",
};

// Expandable Answer Component
const ExpandableAnswer = ({ answer }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 300; // Show first 300 characters

  if (!answer || answer.length <= maxLength) {
    return (
      <div className="p-4">
        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
          {answer || "No answer available"}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="relative">
        <p
          className={`text-gray-700 text-sm leading-relaxed whitespace-pre-line ${
            !isExpanded ? "line-clamp-6" : ""
          }`}
        >
          {answer}
        </p>

        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
        )}
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-3 flex items-center gap-2 text-primary font-semibold text-sm hover:text-orange-600 transition-colors group"
      >
        <span>{isExpanded ? "Show Less" : "Read More"}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    </div>
  );
};

const Profile = () => {
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get("referralCode");
  const [activeTab, setActiveTab] = useState("Profile");
  const [userData, setUserData] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [compatibilityPredictions, setCompatibilityPredictions] = useState([]);
  const [cancellingId, setCancellingId] = useState(null);
  const navigate = useNavigate();

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });
  const [showLogin, setShowLogin] = useState(false);
  const fetchUser = async (user) => {
    // const user = auth.currentUser;

    if (!user) {
      setShowLogin(true);
      return;
    }

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setUserData(docSnap.data());
      if (data.compatibility) {
        const compatibilityArray = Object.entries(data.compatibility)
          .filter(([key, prediction]) => prediction.status === "success")
          .map(([key, prediction]) => prediction);

        setCompatibilityPredictions(compatibilityArray);
      }
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUser(user);
      } else {
        fetchUser();
      }
    });

    return () => unsubscribe();
  }, []);

  const [sessionsData, setSessionsData] = useState();
  const [predictionTab, setPredictionTab] = useState("compatibility");
  const getUserSessions = async (userUid) => {
    const snapshot = await getDocs(collection(db, "therapists"));

    const sessions = [];

    snapshot.forEach((docSnap) => {
      const therapist = docSnap.data();

      if (!therapist.slots) return;

      therapist.slots.forEach((slot) => {
        const wasBookedByUser = slot.bookedBy?.uid === userUid;
        const hasCancelHistory = slot.cancelHistory?.some(
          (cancel) => cancel.bookedBy?.uid === userUid,
        );

        const hasRescheduleHistory = slot.rescheduleHistory?.some(
          (reschedule) => reschedule.bookedBy?.uid === userUid,
        );

        if (wasBookedByUser || hasCancelHistory || hasRescheduleHistory) {
          const now = new Date();
          const startTime = new Date(`${slot.date} ${slot.start}`);
          const endTime = new Date(`${slot.date} ${slot.end}`);
          let status = "Scheduled";

          // Check if currently booked by user
          if (wasBookedByUser) {
            if (now >= startTime && now <= endTime) {
              status = "Ongoing";
            } else if (now > endTime) {
              status = "Completed";
            }
          }

          // Check if cancelled
          if (hasCancelHistory && !wasBookedByUser) {
            status = "Cancelled";
          }

          // Check if rescheduled
          if (hasRescheduleHistory && !wasBookedByUser) {
            status = "Rescheduled";

            // Get the reschedule details
            const rescheduleInfo = slot.rescheduleHistory?.find(
              (r) => r.bookedBy?.uid === userUid && r.status === "rescheduled",
            );

            if (rescheduleInfo) {
              // Store where it was moved to
              slot.movedToSlot = rescheduleInfo.movedToSlot;
            }
          }

          let bookingTime = null;

          if (slot?.bookedBy?.createdAt?.toDate) {
            bookingTime = slot.bookedBy.createdAt.toDate(); // Firestore timestamp
          } else if (slot?.bookedBy?.createdAt) {
            bookingTime = new Date(slot.bookedBy.createdAt);
          }

          let canCancel = false;

          if (bookingTime) {
            const now = new Date();

            // condition 1 → within 24 hours from booking
            const diffBookingNow = (now - bookingTime) / (1000 * 60 * 60);

            // session start datetime
            const sessionDateTime = new Date(`${slot.date} ${slot.start}`);

            // condition 2 → session start at least 24h after booking
            const diffBookingSession =
              (sessionDateTime - bookingTime) / (1000 * 60 * 60);

            if (diffBookingNow <= 24 && diffBookingSession >= 24) {
              canCancel = true;
            }
          }
          console.log(canCancel);
          sessions.push({
            therapistId: docSnap.id,
            therapistName: therapist.name,
            ...slot,
            status,
            therapist,
            canCancel,
          });
        }
      });
    });

    console.log("User Sessions:", sessions);
    setSessionsData(sessions);
  };
  useEffect(() => {
    if (userData) {
      getUserSessions(userData.uid);
    }
  }, [userData]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };
  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";

    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // const handleCancelBooking = async (session) => {
  //   const confirmCancel = window.confirm(
  //     `Are you sure you want to cancel your session with ${session.therapistName} on ${session.date} at ${formatTime(session.start)}?`,
  //   );
  //   if (!confirmCancel) return;

  //   // Use a unique key to track which card is loading
  //   const sessionKey = `${session.therapistId}-${session.date}-${session.start}`;
  //   setCancellingId(sessionKey);

  //   try {
  //     const therapistRef = doc(db, "therapists", session.therapistId);
  //     const therapistSnap = await getDoc(therapistRef);

  //     if (!therapistSnap.exists()) {
  //       alert("Therapist not found.");
  //       return;
  //     }

  //     const therapistData = therapistSnap.data();
  //     const updatedSlots = therapistData.slots.map((slot) => {
  //       if (
  //         slot.date === session.date &&
  //         slot.start === session.start &&
  //         slot.bookedBy?.uid === userData.uid
  //       ) {
  //         // Remove bookedBy and mark slot as available again
  //         const { bookedBy, ...rest } = slot;
  //         return { ...rest, isBooked: false };
  //       }
  //       return slot;
  //     });

  //     await updateDoc(therapistRef, { slots: updatedSlots });

  //     // Remove cancelled session from local state immediately
  //     setSessionsData((prev) =>
  //       prev.filter(
  //         (s) =>
  //           !(
  //             s.date === session.date &&
  //             s.start === session.start &&
  //             s.therapistId === session.therapistId
  //           ),
  //       ),
  //     );

  //     alert("Booking cancelled successfully.");
  //   } catch (error) {
  //     console.error("Cancel booking error:", error);
  //     alert("Failed to cancel booking. Please try again.");
  //   } finally {
  //     setCancellingId(null);
  //   }
  // };
  const [isCancelling, setIsCancelling] = useState(false);
  const [isReScheduling, setIsReScheduling] = useState(false);
  const handleCancelBooking = async (session) => {
    const result = await Swal.fire({
      title: "Request Cancellation?",
      text: "Your cancellation request will be sent to admin for approval.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, send request",
    });

    if (!result.isConfirmed) return;

    try {
      setIsCancelling(true);

      const therapistRef = doc(db, "therapists", session.therapistId);
      const snap = await getDoc(therapistRef);

      const therapistData = snap.data();
      const slots = therapistData.slots || [];

      const slotIndex = slots.findIndex(
        (s) =>
          s.date === session.date &&
          s.start === session.start &&
          s.end === session.end &&
          s.bookedBy?.uid === userData.uid,
      );

      if (slotIndex === -1) {
        toast.error("Slot not found");
        setIsCancelling(false);
        return;
      }

      slots[slotIndex] = {
        ...slots[slotIndex],
        isCancelRequest: true,
        cancelRequestedAt: new Date(),
      };

      await updateDoc(therapistRef, { slots });
      const emailTo =
        userData?.phone === "+918160468895"
          ? "chovatiyashivani@gmail.com"
          : "steeryourhappiness.dev@gmail.com";
      const res = await axios.post(
        // "http://127.0.0.1:5001/steer-u/us-central1/sendmail",
        "https://us-central1-steer-u.cloudfunctions.net/sendmail",
        {
          to: emailTo,
          subject: "New Session Cancellation Request",
          html: `
      <h2>Cancellation Request</h2>

      <p><b>User:</b> ${userData?.fullName}</p>
      <p><b>Phone:</b> ${userData?.phone}</p>

      <p><b>Therapist:</b> ${session.therapistName}</p>

      <p><b>Date:</b> ${session.date}</p>
      <p><b>Time:</b> ${formatTime(session.start)} - ${formatTime(session.end)}</p>

      <p style="color:red;"><b>Status:</b> Waiting for admin approval</p>

      <hr/>

      <p>Please review this cancellation request in the admin panel.</p>
    `,
        },
      );
      console.log(res);
      const data = res.data;
      console.log(data);

      await addDoc(collection(db, "notifications"), {
        userId: userData?.uid,
        therapistId: session.therapistId,
        slotIndex: slotIndex,
        credits: "N/A",
        message: `Cancellation request sent for session on ${session.date} (${session.start} - ${session.end}).`,
        type: "cancel_request",
        createdAt: new Date(),
        isRead: false,
      });
      if (userData) {
        getUserSessions(userData.uid);
      }
      toast.success("Cancellation request sent to admin");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send request");
    } finally {
      setIsCancelling(false);
    }
  };
  const handleRescheduleRequest = async (session, newSlot) => {
    const result = await Swal.fire({
      title: "Request Reschedule?",
      text: "Your reschedule request will be sent to admin.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, request reschedule",
    });

    if (!result.isConfirmed) return;

    try {
      const therapistRef = doc(db, "therapists", session.therapistId);
      const snap = await getDoc(therapistRef);

      const therapistData = snap.data();
      const slots = therapistData.slots || [];

      // old booked slot
      const oldSlotIndex = slots.findIndex(
        (s) =>
          s.date === session.date &&
          s.start === session.start &&
          s.end === session.end &&
          s.bookedBy?.uid === userData.uid,
      );

      // new selected slot
      const newSlotIndex = slots.findIndex(
        (s) =>
          s.date === newSlot.date &&
          s.start === newSlot.start &&
          s.end === newSlot.end,
      );

      if (oldSlotIndex === -1 || newSlotIndex === -1) {
        toast.error("Slot not found");
        return;
      }

      // mark reschedule request on old slot
      slots[oldSlotIndex] = {
        ...slots[oldSlotIndex],
        isRescheduleRequest: true,
        rescheduleRequestedAt: new Date(),
        requestedNewSlot: newSlot,
      };

      // lock new slot temporarily
      slots[newSlotIndex] = {
        ...slots[newSlotIndex],
        lockedBy: userData.uid,
        lockTime: Date.now(),
        isLockedForReschedule: true,
      };

      await updateDoc(therapistRef, { slots });
      const emailTo =
        userData?.phone === "+918160468895"
          ? "chovatiyashivani@gmail.com"
          : "steeryourhappiness.dev@gmail.com";
      // EMAIL
      await axios.post(
        // "http://127.0.0.1:5001/steer-u/us-central1/sendmail",
        "https://us-central1-steer-u.cloudfunctions.net/sendmail",
        {
          to: emailTo,
          subject: "Session Reschedule Request",
          html: `
        <h2>Reschedule Request</h2>

        <p><b>User:</b> ${userData?.fullName}</p>
        <p><b>Phone:</b> ${userData?.phone}</p>

        <p><b>Therapist:</b> ${session.therapistName}</p>

        <h3>Current Slot</h3>
        <p>${session.date}</p>
        <p>${formatTime(session.start)} - ${formatTime(session.end)}</p>

        <h3>Requested Slot</h3>
        <p>${newSlot.date}</p>
        <p>${formatTime(newSlot.start)} - ${formatTime(newSlot.end)}</p>

        <p style="color:orange;"><b>Status:</b> Waiting for admin approval</p>
        `,
        },
      );

      // NOTIFICATION
      await addDoc(collection(db, "notifications"), {
        userId: userData?.uid,
        therapistId: session.therapistId,
        message: `Reschedule request for ${session.date} (${formatTime(session.start)}-${formatTime(session.end)}) to ${newSlot.date} (${formatTime(newSlot.start)}-${formatTime(newSlot.end)})`,
        type: "reschedule_request",
        createdAt: new Date(),
        isRead: false,
      });
      setIsReScheduling(false);
      if (userData) {
        getUserSessions(userData.uid);
      }
      toast.success("Reschedule request sent to admin");
    } catch (error) {
      console.error(error);
      toast.error("Reschedule request failed");
    } finally {
      setIsReScheduling(false);
    }
  };

  const successPredictions = userData?.futurePrediction
    ? Object.entries(userData.futurePrediction).filter(
        ([, prediction]) => prediction.status === "success",
      )
    : [];
  return (
    // <div className="font-poppins mt-10 p-3 md:p-6">
    //   <div className="flex flex-col gap-5 justify-center items-center">
    //     <h1 className="text-black text-xl md:text-2xl font-bold">
    //       User Profile
    //     </h1>

    //     <div className="grid grid-cols-3 gap-2 p-1 mb-4 justify-center items-center">
    //       {["Profile", "My Predictions", "Booking"].map((tab) => (
    //         <button
    //           key={tab}
    //           onClick={() => setActiveTab(tab)}
    //           className={`px-5 py-2 rounded-xl border font-bold text-center justify-center items-center flex border-primary text-sm ${
    //             activeTab === tab
    //               ? "bg-primary text-white"
    //               : "text-black hover:bg-gray-100"
    //           }`}
    //         >
    //           {tab}
    //         </button>
    //       ))}
    //     </div>
    <div className="bg-gradient-to-br from-orange-50 via-white to-orange-50 min-h-screen  py-16 md:py-20">
      <div className="font-poppins px-3 md:px-6 max-w-7xl mx-auto ">
        {/* // <div className="font-poppins mt-6 md:mt-10 px-4 md:px-8 lg:px-12 xl:px-16"> */}
        <div className="flex flex-col gap-5 justify-center items-center">
          {/* Title */}
          <h1 className="text-black text-2xl md:text-3xl font-bold animate-fade-in">
            User Profile
          </h1>

          {/* Tabs */}
          <div className="flex gap-2 p-1 mb-4 bg-gray-100 rounded-2xl shadow-inner">
            {["Profile", "My Predictions", "Booking"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 md:px-6 py-2.5 rounded-xl font-semibold text-xs md:text-sm transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-primary text-white shadow-lg scale-105"
                    : "text-gray-600 hover:text-primary hover:bg-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          {/* PROFILE TAB */}
          {/* {activeTab === "Profile" && userData && (
          <div className="w-full max-w-2xl bg-white shadow-md rounded-xl p-6 space-y-4">
            <div>
              <p className="text-gray-500 text-sm">Full Name</p>
              <p className="font-semibold">{userData.fullName}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Gender</p>
              <p className="font-semibold">
                {userData.gender.charAt(0).toUpperCase() +
                  userData.gender.slice(1)}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Phone Number</p>
              <p className="font-semibold">{auth.currentUser?.phoneNumber}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Birth Date & Time</p>
              <p className="font-semibold">
                {formatDate(userData.dob)} {formatTime(userData.birthTime)}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Birth Location</p>
              <p className="font-semibold">{userData.birthLocation}</p>
            </div>

       
            {isLoaded && userData.locationData && (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={{
                  lat: Number(userData.locationData.lat),
                  lng: Number(userData.locationData.lng),
                }}
                zoom={12}
                onLoad={(mapInstance) => {
                  setTimeout(() => {
                    window.google.maps.event.trigger(mapInstance, "resize");
                    mapInstance.setCenter({
                      lat: Number(userData.locationData.lat),
                      lng: Number(userData.locationData.lng),
                    });
                  }, 500);
                }}
                options={{
                  draggable: false,
                  zoomControl: false,
                  scrollwheel: false,
                  disableDoubleClickZoom: true,
                  gestureHandling: "none",
                  keyboardShortcuts: false,
                }}
              >
                <Marker
                  position={{
                    lat: Number(userData.locationData.lat),
                    lng: Number(userData.locationData.lng),
                  }}
                />
              </GoogleMap>
            )}

           
          </div>
        )} */}

          {activeTab === "Profile" && userData && (
            <div className="w-full ">
              <div className="bg-gradient-to-br from-orange-50 via-white to-orange-50 shadow-xl rounded-2xl overflow-hidden">
                {/* Header Card */}
                <div className="bg-gradient-to-r from-primary to-orange-400 p-6 md:p-8 text-white relative overflow-hidden">
                  {/* Animated Background Shapes */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-blob"></div>
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>

                  <div className="flex items-center gap-4 relative z-10">
                    {/* Avatar */}
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl md:text-4xl font-bold border-4 border-white/30 shadow-lg animate-scale-in hover:scale-110 transition-transform duration-300 cursor-pointer">
                      <span className="animate-fade-in">
                        {userData.fullName.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    {/* Name & Phone */}
                    <div className="space-y-1">
                      <h2 className="text-2xl md:text-3xl font-bold animate-slide-in-right">
                        {userData.fullName}
                      </h2>
                      <p className="text-white/90 text-sm md:text-base flex items-center gap-2 animate-slide-in-right animation-delay-200">
                        <svg
                          className="w-4 h-4 animate-bounce-gentle"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        {auth.currentUser?.phoneNumber}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="p-6 md:p-8 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Gender */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-300 group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Gender</p>
                          <p className="font-semibold text-gray-900">
                            {userData.gender.charAt(0).toUpperCase() +
                              userData.gender.slice(1)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Birth Date & Time */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-300 group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                          <svg
                            className="w-5 h-5"
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
                          <p className="text-gray-500 text-xs">
                            Birth Date & Time
                          </p>
                          <p className="font-semibold text-gray-900">
                            {formatDate(userData.dob)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatTime(userData.birthTime)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Birth Location - Full Width */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-300 group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">
                            Birth Location
                          </p>
                          <p className="font-semibold text-gray-900">
                            {userData.birthLocation}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-300 group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l9 6 9-6M21 8v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8m18 0a2 2 0 00-2-2H5a2 2 0 00-2 2"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Email</p>
                          <p className="font-semibold text-gray-900">
                            {userData.email ? userData.email : "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* MAP */}
                  {isLoaded && userData.locationData && (
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md">
                      <div className="bg-gradient-to-r from-primary/10 to-orange-100 p-3 border-b border-gray-200">
                        <p className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-primary"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Location on Map
                        </p>
                      </div>
                      <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={{
                          lat: Number(userData.locationData.lat),
                          lng: Number(userData.locationData.lng),
                        }}
                        zoom={12}
                        onLoad={(mapInstance) => {
                          setTimeout(() => {
                            window.google.maps.event.trigger(
                              mapInstance,
                              "resize",
                            );
                            mapInstance.setCenter({
                              lat: Number(userData.locationData.lat),
                              lng: Number(userData.locationData.lng),
                            });
                          }, 500);
                        }}
                        options={{
                          draggable: false,
                          zoomControl: false,
                          scrollwheel: false,
                          disableDoubleClickZoom: true,
                          gestureHandling: "none",
                          keyboardShortcuts: false,
                        }}
                      >
                        <Marker
                          position={{
                            lat: Number(userData.locationData.lat),
                            lng: Number(userData.locationData.lng),
                          }}
                        />
                      </GoogleMap>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* {activeTab === "Booking" && userData && sessionsData && (
          <div className="flex justify-center items-center">
            <div
              className={`grid grid-cols-1 ${sessionsData.length === 1 ? "md:grid-cols-1" : "md:grid-cols-2"} h-full items-center justify-center gap-2`}
            >
              {sessionsData ? (
                sessionsData.length > 0 ? (
                  sessionsData.map((session) => {
                    const sessionKey = `${session.therapistId}-${session.date}-${session.start}`;
                    // const isCancelling = cancellingId === sessionKey;
                    const isInactive =
                      session.status === "Cancelled" ||
                      session.status === "Rescheduled";

                    return (
                      // <div key={sessionKey} className="relative">
                      //   {/* Overlay for cancelled/rescheduled sessions 
                      //   {isInactive && (
                      //     <div className="absolute inset-0 bg-gray-900/50 rounded-lg z-10 flex items-center justify-center">
                      //       <div className="bg-white px-4 py-2 rounded-lg shadow-lg">
                      //         <span
                      //           className={`text-sm font-bold ${
                      //             session.status === "Cancelled"
                      //               ? "text-red-600"
                      //               : "text-purple-600"
                      //           }`}
                      //         >
                      //           {session.status}
                      //         </span>
                      //         {session.status === "Rescheduled" &&
                      //           session.movedToSlot && (
                      //             <div className="text-xs text-gray-600 mt-1">
                      //               Moved to {session.movedToSlot.date}
                      //             </div>
                      //           )}
                      //       </div>
                      //     </div>
                      //   )}

                      <SessionCard
                        session={session}
                        handleCancelBooking={handleCancelBooking}
                        cancellingId={cancellingId}
                        setCancellingId={setCancellingId}
                        isCancelling={isCancelling}
                        setIsCancelling={setIsCancelling}
                        isReScheduling={isReScheduling}
                        setIsReScheduling={setIsReScheduling}
                        handleRescheduleRequest={handleRescheduleRequest}
                        disabled={isInactive}
                      />
                      // </div>
                    );
                  })
                ) : (
                  <p>No sessions found.</p>
                )
              ) : (
                <p>Loading sessions...</p>
              )}
            </div>
          </div>
        )} */}
          {activeTab === "Booking" && userData && sessionsData && (
            <div className=" flex justify-center items-center w-full">
              <div
                className={`grid grid-cols-1 ${
                  sessionsData.filter(
                    (s) =>
                      s.status !== "Cancelled" && s.status !== "Rescheduled",
                  ).length === 1
                    ? "md:grid-cols-1 max-w-2xl"
                    : "md:grid-cols-2"
                } gap-4 md:gap-6 w-full max-w-6xl`}
              >
                {sessionsData ? (
                  sessionsData.length > 0 ? (
                    sessionsData.map((session, index) => {
                      const sessionKey = `${session.therapistId}-${session.date}-${session.start}`;
                      let formattedDate = "N/A";

                      try {
                        if (session?.bookedBy?.createdAt?.toDate) {
                          formattedDate = session?.bookedBy?.createdAt
                            .toDate()
                            .toLocaleString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true, // 👈 this gives AM/PM
                            });
                        } else if (session?.bookedBy?.createdAt) {
                          formattedDate = new Date(
                            session?.bookedBy?.createdAt,
                          ).toLocaleString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true, // 👈 AM/PM
                          });
                        }
                      } catch (error) {
                        console.error("Date formatting error:", error);
                      }

                      return (
                        <div
                          key={sessionKey}
                          className="h-full animate-scale-in"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <SessionCard
                            session={session}
                            handleCancelBooking={handleCancelBooking}
                            cancellingId={cancellingId}
                            setCancellingId={setCancellingId}
                            isCancelling={isCancelling}
                            setIsCancelling={setIsCancelling}
                            isReScheduling={isReScheduling}
                            setIsReScheduling={setIsReScheduling}
                            handleRescheduleRequest={handleRescheduleRequest}
                            disabled={false}
                            formattedDate={formattedDate}
                          />
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
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <p className="text-gray-500 font-medium">
                          No active bookings found
                        </p>
                        <p className="text-sm text-gray-400">
                          Your cancelled and rescheduled sessions can be found
                          in session history
                        </p>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="col-span-full text-center py-12 animate-pulse">
                    <div className="inline-flex flex-col items-center gap-3">
                      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-gray-500 font-medium">
                        Loading sessions...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab === "My Predictions" && (
            <div className="w-full  flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-3 justify-center">
                {[
                  { key: "compatibility", label: "Compatibility Info" },
                  { key: "future", label: "Future Prediction Info" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setPredictionTab(tab.key)}
                    className={`px-5 py-2 rounded-xl border border-primary font-semibold text-sm transition ${
                      predictionTab === tab.key
                        ? "bg-primary text-white"
                        : "bg-white text-primary hover:bg-primary/10"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {predictionTab === "compatibility" ? (
                // predictions.length > 0 ? (
                //   predictions.map((p, index) => (
                //     <div
                //       key={index}
                //       className="bg-white border border-primary rounded-xl p-4 shadow-sm"
                //     >
                //       <p className="font-bold text-black mb-2">{p.question}</p>

                //       {/* <div className="text-sm text-gray-600 space-y-1">
                //     <p>
                //       <span className="font-semibold">Person 1:</span>{" "}
                //       {p.person1?.name}
                //     </p>

                //     <p>
                //       <span className="font-semibold">Person 2:</span>{" "}
                //       {p.person2?.name}
                //     </p>

                //     <p>
                //       <span className="font-semibold">Birth Date:</span>{" "}
                //       {p.person2?.birthDate}
                //     </p>

                //     <p>
                //       <span className="font-semibold">Location:</span>{" "}
                //       {p.person2?.location}
                //     </p>
                //   </div> */}
                //       <div className="bg-white border border-primary/30 rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md transition">
                //         {/* Status */}
                //         <div className="flex justify-between items-center mb-4">
                //           <h3 className="font-bold text-black text-sm md:text-base">
                //             Compatibility Details
                //           </h3>

                //           {/* <span
                //         className={`text-xs px-3 py-1 rounded-full font-semibold ${
                //           p.status === "completed"
                //             ? "bg-green-100 text-green-700"
                //             : "bg-yellow-100 text-yellow-700"
                //         }`}
                //       >
                //         {p.status || "Pending"}
                //       </span> */}
                //         </div>

                //         {/* Persons Grid */}
                //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                //           {/* Person 1 */}
                //           <div className="bg-[#FFF5EE] border border-primary/20 rounded-xl p-4 space-y-2">
                //             <p className="text-primary font-semibold text-sm">
                //               Person 1
                //             </p>

                //             <div className="text-sm text-gray-700 space-y-1">
                //               <p>
                //                 <span className="font-semibold">Name:</span>{" "}
                //                 {p.person1?.name || "-"}
                //               </p>

                //               <p>
                //                 <span className="font-semibold">
                //                   Birth Date:
                //                 </span>{" "}
                //                 {p.person1?.birthDate || "-"}
                //               </p>

                //               <p>
                //                 <span className="font-semibold">
                //                   Birth Time:
                //                 </span>{" "}
                //                 {p.person1?.birthTime || "-"}
                //               </p>

                //               <p>
                //                 <span className="font-semibold">Location:</span>{" "}
                //                 {p.person1?.location || "-"}
                //               </p>
                //             </div>
                //           </div>

                //           {/* Person 2 */}
                //           <div className="bg-[#FFF5EE] border border-primary/20 rounded-xl p-4 space-y-2">
                //             <p className="text-primary font-semibold text-sm">
                //               Person 2
                //             </p>

                //             <div className="text-sm text-gray-700 space-y-1">
                //               <p>
                //                 <span className="font-semibold">Name:</span>{" "}
                //                 {p.person2?.name || "-"}
                //               </p>

                //               <p>
                //                 <span className="font-semibold">
                //                   Birth Date:
                //                 </span>{" "}
                //                 {p.person2?.birthDate || "-"}
                //               </p>

                //               <p>
                //                 <span className="font-semibold">
                //                   Birth Time:
                //                 </span>{" "}
                //                 {p.person2?.birthTime || "-"}
                //               </p>

                //               <p>
                //                 <span className="font-semibold">Location:</span>{" "}
                //                 {p.person2?.location || "-"}
                //               </p>
                //             </div>
                //           </div>
                //         </div>
                //       </div>
                //     </div>
                //   ))

                compatibilityPredictions.length > 0 ? (
                  <div className="space-y-4">
                    {compatibilityPredictions
                      .sort((a, b) => {
                        // Sort by date, newest first
                        const dateA = a.createdAt?.toDate
                          ? a.createdAt.toDate()
                          : new Date(a.createdAt);
                        const dateB = b.createdAt?.toDate
                          ? b.createdAt.toDate()
                          : new Date(b.createdAt);
                        return dateB - dateA;
                      })
                      .map((prediction, index) => {
                        // Format date
                        let formattedDate = "N/A";

                        try {
                          if (prediction.createdAt?.toDate) {
                            formattedDate = prediction.createdAt
                              .toDate()
                              .toLocaleString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true, // 👈 this gives AM/PM
                              });
                          } else if (prediction.createdAt) {
                            formattedDate = new Date(
                              prediction.createdAt,
                            ).toLocaleString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true, // 👈 AM/PM
                            });
                          }
                        } catch (error) {
                          console.error("Date formatting error:", error);
                        }

                        return (
                          <div
                            key={index}
                            className="bg-white border-2 border-primary/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] animate-scale-in"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-primary to-orange-400 p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-2 flex-1 min-w-0">
                                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg
                                      className="w-4 h-4 text-white"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-white text-sm md:text-base line-clamp-2">
                                      {prediction.question}
                                    </h3>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Info Bar */}
                            <div className="bg-orange-50 px-4 py-2 flex flex-wrap items-center gap-3 text-xs border-b border-primary/10">
                              <div className="flex items-center gap-1.5">
                                <svg
                                  className="w-3.5 h-3.5 text-primary"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="text-gray-700 font-medium">
                                  {formattedDate}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <svg
                                  className="w-3.5 h-3.5 text-primary"
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
                                <span className="text-gray-700 font-medium">
                                  {prediction.creditsUsed || 1} Credit
                                </span>
                              </div>

                              <div className="bg-primary/10 px-2 py-0.5 rounded-full">
                                <span className="text-primary font-semibold">
                                  {prediction.category}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 ml-auto">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-green-600 font-semibold">
                                  Success
                                </span>
                              </div>
                            </div>

                            {/* Persons Grid */}
                            <div className="p-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                {/* Person 1 */}
                                <div className="bg-gradient-to-br from-orange-50 to-white border border-primary/20 rounded-xl p-5 space-y-3 hover:shadow-md transition-shadow">
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                                      <svg
                                        className="w-5 h-5 text-primary"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </div>
                                    <p className="text-primary font-bold text-base">
                                      Person 1
                                    </p>
                                  </div>

                                  <div className="space-y-2 text-sm">
                                    {[
                                      {
                                        label: "Name",
                                        value: prediction.person1?.name,
                                      },
                                      {
                                        label: "Birth Date",
                                        value: prediction.person1?.birthDate,
                                      },
                                      {
                                        label: "Birth Time",
                                        value: prediction.person1?.birthTime,
                                      },
                                      {
                                        label: "Location",
                                        value: prediction.person1?.location,
                                      },
                                    ].map((item, i) => (
                                      <div
                                        key={i}
                                        className="flex justify-between items-start"
                                      >
                                        <span className="text-gray-600 font-medium">
                                          {item.label}:
                                        </span>
                                        <span className="text-gray-900 font-semibold text-right flex-1 ml-2">
                                          {item.value || "-"}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Person 2 */}
                                <div className="bg-gradient-to-br from-orange-50 to-white border border-primary/20 rounded-xl p-5 space-y-3 hover:shadow-md transition-shadow">
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                                      <svg
                                        className="w-5 h-5 text-primary"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </div>
                                    <p className="text-primary font-bold text-base">
                                      Person 2
                                    </p>
                                  </div>

                                  <div className="space-y-2 text-sm">
                                    {[
                                      {
                                        label: "Name",
                                        value: prediction.person2?.name,
                                      },
                                      {
                                        label: "Birth Date",
                                        value: prediction.person2?.birthDate,
                                      },
                                      {
                                        label: "Birth Time",
                                        value: prediction.person2?.birthTime,
                                      },
                                      {
                                        label: "Location",
                                        value: prediction.person2?.location,
                                      },
                                    ].map((item, i) => (
                                      <div
                                        key={i}
                                        className="flex justify-between items-start"
                                      >
                                        <span className="text-gray-600 font-medium">
                                          {item.label}:
                                        </span>
                                        <span className="text-gray-900 font-semibold text-right flex-1 ml-2">
                                          {item.value || "-"}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Answer if available */}
                              {prediction.answer && (
                                <div className="border-t border-gray-200 pt-4">
                                  <ExpandableAnswer
                                    answer={prediction.answer}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-center py-12 animate-fade-in">
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
                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium">
                        No compatibility predictions found
                      </p>
                      <p className="text-sm text-gray-400">
                        Your compatibility predictions will appear here
                      </p>
                      <button
                        onClick={() =>
                          navigate("/future-predictionscreen/Compatibility")
                        }
                        className="mt-4 bg-primary text-white px-6 py-2 rounded-xl font-semibold hover:bg-primary/90 transform hover:scale-105 transition-all duration-300"
                      >
                        Get Compatibility Check
                      </button>
                    </div>
                  </div>
                )
              ) : (
                <>
                  {successPredictions.length > 0 ? (
                    <div
                      className={`grid grid-cols-1 ${successPredictions.length === 1 ? "md:grid-cols-1" : "md:grid-cols-2"} gap-6`}
                    >
                      {successPredictions
                        .sort(([, a], [, b]) => {
                          const dateA = a.createdAt?.toDate
                            ? a.createdAt.toDate()
                            : new Date(a.createdAt);
                          const dateB = b.createdAt?.toDate
                            ? b.createdAt.toDate()
                            : new Date(b.createdAt);
                          return dateB - dateA;
                        })
                        .map(([key, prediction], index) => {
                          let formattedDate = "N/A";

                          try {
                            if (prediction.createdAt?.toDate) {
                              formattedDate = prediction.createdAt
                                .toDate()
                                .toLocaleString("en-GB", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true, // 👈 this gives AM/PM
                                });
                            } else if (prediction.createdAt) {
                              formattedDate = new Date(
                                prediction.createdAt,
                              ).toLocaleString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true, // 👈 AM/PM
                              });
                            }
                          } catch (error) {
                            console.error("Date formatting error:", error);
                          }
                          return (
                            <div
                              key={key}
                              className="bg-white border-2 border-primary/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 animate-scale-in"
                              style={{ animationDelay: `${index * 100}ms` }}
                            >
                              {" "}
                              <div className="bg-gradient-to-r from-primary to-orange-400 p-4">
                                {" "}
                                <div className="flex items-start justify-between gap-3">
                                  {" "}
                                  <div className="flex items-start gap-2 flex-1 min-w-0">
                                    {" "}
                                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                                      {" "}
                                      <svg
                                        className="w-4 h-4 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        {" "}
                                        <path
                                          fillRule="evenodd"
                                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                                          clipRule="evenodd"
                                        />{" "}
                                      </svg>{" "}
                                    </div>{" "}
                                    <div className="flex-1 min-w-0">
                                      {" "}
                                      <h3 className="font-bold text-white text-sm md:text-base line-clamp-2">
                                        {" "}
                                        {prediction.question}{" "}
                                      </h3>{" "}
                                    </div>{" "}
                                  </div>{" "}
                                </div>{" "}
                              </div>{" "}
                              {/* Compact Info Bar */}{" "}
                              <div className="bg-orange-50 px-4 py-2 flex flex-wrap items-center gap-3 text-xs border-b border-primary/10">
                                {" "}
                                <div className="flex items-center gap-1.5">
                                  {" "}
                                  <svg
                                    className="w-3.5 h-3.5 text-primary"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    {" "}
                                    <path
                                      fillRule="evenodd"
                                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                      clipRule="evenodd"
                                    />{" "}
                                  </svg>{" "}
                                  <span className="text-gray-700 font-medium">
                                    {" "}
                                    {formattedDate}{" "}
                                  </span>{" "}
                                </div>{" "}
                                <div className="flex items-center gap-1.5">
                                  {" "}
                                  <svg
                                    className="w-3.5 h-3.5 text-primary"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    {" "}
                                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />{" "}
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                                      clipRule="evenodd"
                                    />{" "}
                                  </svg>{" "}
                                  <span className="text-gray-700 font-medium">
                                    {" "}
                                    {prediction.creditsUsed || 1} Credit{" "}
                                  </span>{" "}
                                </div>{" "}
                                <div className="bg-primary/10 px-2 py-0.5 rounded-full">
                                  {" "}
                                  <span className="text-primary font-semibold">
                                    {" "}
                                    {prediction.category}{" "}
                                  </span>{" "}
                                </div>{" "}
                                <div className="flex items-center gap-1.5 ml-auto">
                                  {" "}
                                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>{" "}
                                  <span className="text-green-600 font-semibold">
                                    {" "}
                                    Success{" "}
                                  </span>{" "}
                                </div>{" "}
                              </div>{" "}
                              {/* Collapsible Answer */}{" "}
                              <ExpandableAnswer
                                answer={prediction.answer}
                              />{" "}
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <div className="justify-center flex items-center flex-col ">
                      {" "}
                      <div className="text-center py-12 animate-fade-in">
                        {" "}
                        <div className="inline-flex flex-col items-center gap-3">
                          {" "}
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            {" "}
                            <svg
                              className="w-8 h-8 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              {" "}
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                              />{" "}
                            </svg>{" "}
                          </div>{" "}
                          <p className="text-gray-500 font-medium">
                            {" "}
                            No successful predictions yet{" "}
                          </p>{" "}
                          <p className="text-sm text-gray-400">
                            {" "}
                            Your future predictions will appear here{" "}
                          </p>{" "}
                          <button
                            onClick={() =>
                              navigate("/future-prediction/credit1")
                            }
                            className="mt-4 bg-primary text-white px-6 py-2 rounded-xl font-semibold hover:bg-primary/90 transform hover:scale-105 transition-all duration-300"
                          >
                            {" "}
                            Get Your First Prediction{" "}
                          </button>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>
                  )}

                  {/* Failed count (same as yours) */}
                  {userData?.futurePrediction &&
                    Object.values(userData.futurePrediction).filter(
                      (p) => p.status === "failed",
                    ).length > 0 && (
                      <div className="text-center py-3">
                        {" "}
                        <p className="text-xs text-gray-400">
                          {" "}
                          {
                            Object.values(userData.futurePrediction).filter(
                              (p) => p.status === "failed",
                            ).length
                          }{" "}
                          failed prediction{" "}
                          {Object.values(userData.futurePrediction).filter(
                            (p) => p.status === "failed",
                          ).length > 1
                            ? "s"
                            : ""}{" "}
                          not shown{" "}
                        </p>{" "}
                      </div>
                    )}
                </>
              )}
            </div>
          )}
        </div>
        <Login
          isOpen={showLogin}
          onClose={() => {
            setShowLogin(false);
            navigate("/");
          }}
          screenName={"/profile"}
          referralCodeData={referralCode}
        />
      </div>
    </div>
  );
};

export default Profile;
