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

const Profile = () => {
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get("referralCode");
  const [activeTab, setActiveTab] = useState("Profile");
  const [userData, setUserData] = useState(null);
  const [predictions, setPredictions] = useState([]);
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
      if (data.questions) {
        const allQuestions = Object.values(data.questions).flat();
        setPredictions(allQuestions);
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
  return (
    <div className="font-poppins mt-10 p-3 md:p-6">
      <div className="flex flex-col gap-5 justify-center items-center">
        <h1 className="text-black text-xl md:text-2xl font-bold">
          User Profile
        </h1>

        {/* Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1 mb-4 justify-center items-center">
          {["Profile", "My Predictions", "Booking"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl border font-bold text-center justify-center items-center flex border-primary text-sm ${
                activeTab === tab
                  ? "bg-primary text-white"
                  : "text-black hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* PROFILE TAB */}
        {activeTab === "Profile" && userData && (
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

            {/* MAP */}
            {console.log(
              userData.locationData,
              isLoaded && userData.locationData,
            )}
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

            {/* LOGOUT BUTTON */}
            {/* <button
              onClick={handleLogout}
              className="w-full py-3 mt-4 rounded-xl bg-red-500 text-white font-semibold hover:opacity-90 transition"
            >
              Logout
            </button> */}
          </div>
        )}
        {activeTab === "Booking" && userData && sessionsData && (
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
                      //   {/* Overlay for cancelled/rescheduled sessions */}
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
        )}
        {activeTab === "My Predictions" && (
          <div className="w-full max-w-3xl flex flex-col gap-4">
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
              predictions.length > 0 ? (
                predictions.map((p, index) => (
                  <div
                    key={index}
                    className="bg-white border border-primary rounded-xl p-4 shadow-sm"
                  >
                    <p className="font-bold text-black mb-2">{p.question}</p>

                    {/* <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-semibold">Person 1:</span>{" "}
                      {p.person1?.name}
                    </p>

                    <p>
                      <span className="font-semibold">Person 2:</span>{" "}
                      {p.person2?.name}
                    </p>

                    <p>
                      <span className="font-semibold">Birth Date:</span>{" "}
                      {p.person2?.birthDate}
                    </p>

                    <p>
                      <span className="font-semibold">Location:</span>{" "}
                      {p.person2?.location}
                    </p>
                  </div> */}
                    <div className="bg-white border border-primary/30 rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md transition">
                      {/* Status */}
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-black text-sm md:text-base">
                          Compatibility Details
                        </h3>

                        {/* <span
                        className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          p.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {p.status || "Pending"}
                      </span> */}
                      </div>

                      {/* Persons Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Person 1 */}
                        <div className="bg-[#FFF5EE] border border-primary/20 rounded-xl p-4 space-y-2">
                          <p className="text-primary font-semibold text-sm">
                            Person 1
                          </p>

                          <div className="text-sm text-gray-700 space-y-1">
                            <p>
                              <span className="font-semibold">Name:</span>{" "}
                              {p.person1?.name || "-"}
                            </p>

                            <p>
                              <span className="font-semibold">Birth Date:</span>{" "}
                              {p.person1?.birthDate || "-"}
                            </p>

                            <p>
                              <span className="font-semibold">Birth Time:</span>{" "}
                              {p.person1?.birthTime || "-"}
                            </p>

                            <p>
                              <span className="font-semibold">Location:</span>{" "}
                              {p.person1?.location || "-"}
                            </p>
                          </div>
                        </div>

                        {/* Person 2 */}
                        <div className="bg-[#FFF5EE] border border-primary/20 rounded-xl p-4 space-y-2">
                          <p className="text-primary font-semibold text-sm">
                            Person 2
                          </p>

                          <div className="text-sm text-gray-700 space-y-1">
                            <p>
                              <span className="font-semibold">Name:</span>{" "}
                              {p.person2?.name || "-"}
                            </p>

                            <p>
                              <span className="font-semibold">Birth Date:</span>{" "}
                              {p.person2?.birthDate || "-"}
                            </p>

                            <p>
                              <span className="font-semibold">Birth Time:</span>{" "}
                              {p.person2?.birthTime || "-"}
                            </p>

                            <p>
                              <span className="font-semibold">Location:</span>{" "}
                              {p.person2?.location || "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No predictions found.</p>
              )
            ) : (
              <></>
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
  );
};

export default Profile;
