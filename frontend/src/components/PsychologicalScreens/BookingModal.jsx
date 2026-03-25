import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineClose } from "react-icons/ai";
import { CheckCircle } from "lucide-react";
import CalendarCard from "./CalendarCard";
import { toast } from "react-toastify";
import {
  addDoc,
  collection,
  doc,
  FieldValue,
  getDoc,
  runTransaction,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import axios from "axios";
import IntakeForm from "../IntakeForm";
import PaymentSuccessModal from "./PaymentSuccessModal";

const BookingModal = ({
  isOpen,
  onClose,
  therapistDetails,
  userData,
  fetchTherapists,
}) => {
  const { t } = useTranslation();
  const [step, setStep] = useState("slot");
  const [selectedSlot, setSelectedSlot] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const [showIntakeForm, setShowIntakeForm] = useState(false);
  const [intakeData, setIntakeData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(today);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState();

  const timeSlots = {
    [t("psychology.bookingModal.time.morning")]: [
      "8:00 AM",
      "9:00 AM",
      "10:00 AM",
      "11:00 AM",
    ],
    [t("psychology.bookingModal.time.afternoon")]: [
      "12:00 PM",
      "1:00 PM",
      "2:00 PM",
      "3:00 PM",
    ],
    [t("psychology.bookingModal.time.evening")]: [
      "4:00 PM",
      "5:00 PM",
      "6:00 PM",
      "7:00 PM",
    ],
  };
  const therapistSlots = therapistDetails?.slots || [];
  const filteredSlots = therapistSlots.filter(
    (slot) => slot.date === selectedDate,
  );

  const getPeriod = (time) => {
    const hour = parseInt(time.split(":")[0]);

    if (hour < 12) return "Morning";
    if (hour < 17) return "Afternoon";
    return "Evening";
  };
  const groupedSlots = filteredSlots.reduce((acc, slot) => {
    const period = getPeriod(slot.start);

    if (!acc[period]) acc[period] = [];
    acc[period].push(slot);

    return acc;
  }, {});
  const checkIntakeForm = async () => {
    const userRef = doc(db, "users", auth.currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return false;

    const data = userSnap.data();

    // example condition
    if (!data.intakeForm || Object.keys(data.intakeForm).length === 0) {
      return false;
    }

    return true;
  };
  // const handleConfirmSlot = async () => {
  //   if (!selectedSlot) return;

  //   // Check if already booked
  //   if (selectedSlot.isBooked) {
  //     toast.error("This slot is already booked");
  //     return;
  //   }

  //   try {
  //     // Update slots array in Firestore
  //     const therapistRef = doc(db, "therapists", therapistDetails.id);

  //     const updatedSlots = therapistDetails.slots.map((slot) =>
  //       slot.date === selectedSlot.date &&
  //       slot.start === selectedSlot.start &&
  //       slot.end === selectedSlot.end
  //         ? {
  //             ...slot,
  //             isBooked: true,
  //             bookedBy: {
  //               // replace with your user info
  //               uid: userData?.uid || "USER_ID",
  //               name: userData?.name || "USER_NAME",
  //               email: userData?.email || "USER_EMAIL",
  //             },
  //           }
  //         : slot,
  //     );

  //     await updateDoc(therapistRef, { slots: updatedSlots });

  //     toast.success("Slot booked successfully!");

  //     // setStep("package"); // move to next step
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Failed to book slot");
  //   }
  // };

  const lockSlotBeforePayment = async () => {
    const therapistRef = doc(db, "therapists", therapistDetails.id);

    try {
      await runTransaction(db, async (transaction) => {
        const therapistDoc = await transaction.get(therapistRef);

        if (!therapistDoc.exists()) throw new Error("Therapist not found");

        const slots = therapistDoc.data().slots || [];

        const slotIndex = slots.findIndex(
          (s) =>
            s.date === selectedSlot.date &&
            s.start === selectedSlot.start &&
            s.end === selectedSlot.end,
        );

        if (slotIndex === -1) throw new Error("Slot not found");

        const slot = slots[slotIndex];

        if (slot.isBooked) {
          throw new Error("This slot is already booked");
        }

        if (slot.lockedBy && slot.lockedBy !== auth.currentUser.uid) {
          throw new Error("Another user is booking this slot");
        }

        slots[slotIndex] = {
          ...slot,
          lockedBy: auth.currentUser.uid,
          lockTime: Date.now(),
        };

        transaction.update(therapistRef, { slots });
      });

      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  const unlockSlot = async () => {
    const therapistRef = doc(db, "therapists", therapistDetails.id);

    await runTransaction(db, async (transaction) => {
      const therapistDoc = await transaction.get(therapistRef);
      const slots = therapistDoc.data().slots || [];

      const slotIndex = slots.findIndex(
        (s) =>
          s.date === selectedSlot.date &&
          s.start === selectedSlot.start &&
          s.end === selectedSlot.end,
      );

      if (slotIndex === -1) return;

      slots[slotIndex] = {
        ...slots[slotIndex],
        lockedBy: null,
        lockTime: null,
      };

      transaction.update(therapistRef, { slots });
    });
  };
  const addSlot = async (orderid) => {
    const therapistRef = doc(db, "therapists", therapistDetails.id);

    try {
      await runTransaction(db, async (transaction) => {
        const therapistDoc = await transaction.get(therapistRef);

        if (!therapistDoc.exists()) throw "Therapist not found";

        const slots = therapistDoc.data().slots || [];

        // Find the exact slot
        const slotIndex = slots.findIndex(
          (s) =>
            s.date === selectedSlot.date &&
            s.start === selectedSlot.start &&
            s.end === selectedSlot.end,
        );

        if (slotIndex === -1) throw "Slot not found";

        if (slots[slotIndex].isBooked) {
          throw new Error("This slot is already booked");
        }

        // Update the slot
        slots[slotIndex] = {
          ...slots[slotIndex],
          isBooked: true,
          bookedBy: {
            uid: userData?.uid,
            name: userData?.fullName,
            orderid,
            createdAt: new Date(),
          },
        };

        transaction.update(therapistRef, { slots });
        await addDoc(collection(db, "notifications"), {
          userId: userData?.uid,
          therapistId: therapistDetails.id,
          slotIndex: slotIndex, // or sessionId / slotId if you have it
          credits: "N/A",
          message: "Therapy session has been booked successfully.",
          type: "booking",
          createdAt: new Date(),
          isRead: false,
        });
      });

      toast.success("Slot booked successfully!");

      fetchTherapists();
      // setStep("success");
      // Update local state to disable selected slot immediately
      setSelectedSlot((prev) => ({ ...prev, isBooked: true }));
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to book slot");
    }
  };

  const currencyMap = {
    "₹": "INR",
    $: "USD",
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };
  const startPayment = async () => {
    let currency = "₹";
    let price = therapistDetails.price;
    if (userData.locationData.country === "India") {
      currency = "₹";
      price = therapistDetails.price;
    } else {
      currency = "$";
      price = therapistDetails.usdPrice;
    }
    const paidSessionBooking = "paidSessionBooking";
    console.log(
      "User wants to buy:",
      paidSessionBooking,
      therapistDetails.price,
      currency,
    );
    const currencyCode = currencyMap[currency] || "INR";
    try {
      const res2 = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js",
      );

      if (!res2) {
        toast.error("Razorpay SDK failed to load");
        return;
      }
      console.log(
        "User wants to buy:",
        paidSessionBooking,
        therapistDetails.price,
        currency,
      );
      // const res = await axios.post(
      //   // "https://us-central1-steer-u.cloudfunctions.net/createOrder",
      //   "http://localhost:8180/steer-u/us-central1/createOrder",
      //   {
      //     amount:  therapistDetails.price,
      //     userId: auth.currentUser.uid,
      //   },
      // );

      //       razorpay_order_id
      // :
      // "order_SNpG5qvcLzxWgz"
      // razorpay_payment_id
      // :
      // "pay_SNpIvGmbqsRuqO"
      // razorpay_signature
      // :
      // "2af56f26eec41e591f446635ca0268a11a75b1ec0985747d8d65813c6218a3fa"
      // [[Pro
      const res = await axios.post(
        // "http://127.0.0.1:5001/steer-u/us-central1/createOrder",
        "https://us-central1-steer-u.cloudfunctions.net/createOrder",
        {
          amount: price,
          // amount: 1,
          userId: auth.currentUser.uid,
          paidSessionBooking,
          currency: currencyCode,
          therapistId: therapistDetails.id,
          inrprice: therapistDetails.price,
          usdprice: therapistDetails.usdPrice,
        },
      );
      console.log("Order created:", res);
      const data = res.data;

      const options = {
        key: data.key, // key coming from backend
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,

        name: "Session Booking",
        description: "Session Payment",

        handler: async function (response) {
          console.log(response);
          setStep("paymentSuccess");
          setPaymentResponse({ ...response, amount: data.amount, currency });
          addSlot(response.razorpay_order_id);
          setPaymentLoading(false);
        },
        modal: {
          ondismiss: async function () {
            setPaymentLoading(false);
            toast.error("Payment cancelled");
            await unlockSlot();
          },
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error(error);
      setPaymentLoading(false);
      toast.error("Payment failed");
    }
  };
  const handleConfirmSlot = async () => {
    if (!selectedSlot) {
      toast.error("Please select a slot");
      return;
    }

    const locked = await lockSlotBeforePayment();

    if (!locked) return;

    const intakeFilled = await checkIntakeForm();

    if (!intakeFilled) {
      setStep("intake");

      toast.info("Please complete intake form first");
      return;
    }
    if (paymentLoading) return;
    setPaymentLoading(true);
    // Show message to user
    toast.info("Please do not close this screen. Processing payment...");
    startPayment();
  };
  const handleIntakeSubmit = async (formData) => {
    const userRef = doc(db, "users", auth.currentUser.uid);

    await updateDoc(userRef, {
      intakeForm: formData,
    });

    setShowIntakeForm(false);

    toast.success("Intake form submitted");
    if (paymentLoading) return;

    setPaymentLoading(true);

    // Inform user
    toast.info("Please do not close this screen. Processing payment...");

    // continue booking
    startPayment();
  };
  if (!isOpen) return null;

  return (
    <>
      {/* {showIntakeForm && (
        <IntakeForm
          onClose={() => setShowIntakeForm(false)}
          onSubmit={handleIntakeSubmit}
        />
      )}
      {!showIntakeForm && ( */}
      <div className="fixed inset-0 z-50">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          // onClick={() => {
          //   setStep("slot");
          //   onClose();
          // }}
        />

        {/* Scroll Container */}
        <div className="fixed inset-0 flex items-start md:items-center justify-center p-4 overflow-y-auto">
          {/* Modal Card */}
          <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 md:p-8 transition-all">
            {/* Close */}
            <button
              onClick={() => {
                unlockSlot();
                setStep("slot");
                fetchTherapists();
                setPaymentLoading(false);
                onClose();
              }}
              className="absolute right-4 top-4"
            >
              <AiOutlineClose />
            </button>

            {/* STEP 1 - SLOT */}

            {step === "slot" && (
              <>
                <h2 className="text-xl font-bold text-center mb-6">
                  {t("psychology.bookingModal.selectSlot")}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Left - Date Picker */}
                  <div className="flex-1 bg-gray-50 p-4 rounded-xl border">
                    {/* <p className="font-semibold mb-3">Choose Date</p>
                <input
                  type="date"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                /> */}
                    <CalendarCard
                      selectedDate={selectedDate}
                      setSelectedDate={setSelectedDate}
                    />
                  </div>

                  {/* Right - Time Sections */}
                  {/* <div className="flex-1 space-y-6">
                  {Object.entries(timeSlots).map(([period, times]) => (
                    <div key={period}>
                      <h3 className="font-semibold text-primary mb-3">
                        {period}
                      </h3>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {times.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedSlot(time)}
                            className={`border rounded-lg py-2 text-sm font-medium transition ${
                              selectedSlot === time
                                ? "bg-primary text-white border-primary"
                                : "border-gray-300 text-gray-700 hover:bg-primary/10"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div> */}
                  <div className="flex-1 space-y-6">
                    {Object.keys(groupedSlots).length > 0 ? (
                      Object.entries(groupedSlots).map(([period, slots]) => (
                        <div key={period}>
                          <h3 className="font-semibold text-primary mb-3">
                            {period}
                          </h3>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {slots.map((slot, index) => {
                              const timeLabel = `${slot.start} - ${slot.end}`;
                              const now = new Date();

                              // create slot start datetime
                              const slotStart = new Date(
                                `${selectedDate} ${slot.start}`,
                              );

                              // disable if booked OR time reached/passed
                              const isDisabled =
                                slot.isBooked || now >= slotStart;
                              console.log(
                                isDisabled,
                                now,
                                slotStart,
                                now >= slotStart,
                              );
                              return (
                                <button
                                  key={index}
                                  disabled={isDisabled}
                                  onClick={() => setSelectedSlot(slot)}
                                  className={`border rounded-lg py-2 text-sm font-medium transition ${
                                    isDisabled
                                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                      : selectedSlot === slot
                                        ? "bg-primary text-white border-primary"
                                        : "border-gray-300 text-gray-700 hover:bg-primary/10"
                                  }`}
                                >
                                  {timeLabel}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No slots available</p>
                    )}
                  </div>
                </div>

                <button
                  disabled={!selectedSlot || paymentLoading}
                  // onClick={() => setStep("package")}
                  onClick={handleConfirmSlot}
                  className={`w-full py-3 rounded-xl font-semibold transition ${
                    !selectedSlot || paymentLoading
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-primary text-white"
                  }`}
                >
                  {paymentLoading
                    ? "Processing payment, please wait..."
                    : t("psychology.bookingModal.confirmSlot")}
                </button>
              </>
            )}
            {/* STEP 2 - PACKAGE */}
            {step === "package" && (
              <>
                <h2 className="text-xl font-bold text-center mb-6">
                  {t("psychology.bookingModal.choosePackage")}
                </h2>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="border rounded-xl p-4 bg-[#F5D6C7]">
                    <h3 className="font-semibold mb-2">
                      {t("psychology.bookingModal.sessionPack6")}
                    </h3>
                    <p className="text-sm mb-3">
                      {t("psychology.bookingModal.bestForBeginners")}
                    </p>
                    <button
                      onClick={() => setStep("success")}
                      className="bg-primary text-white px-4 py-2 rounded-lg"
                    >
                      {t("psychology.bookingModal.selectPackage")}
                    </button>
                  </div>

                  <div className="border rounded-xl p-4 bg-[#F5D6C7]">
                    <h3 className="font-semibold mb-2">
                      {t("psychology.bookingModal.sessionPack10")}
                    </h3>
                    <p className="text-sm mb-3">
                      {t("psychology.bookingModal.saveMore")}
                    </p>
                    <button
                      onClick={() => setStep("success")}
                      className="bg-primary text-white px-4 py-2 rounded-lg"
                    >
                      {t("psychology.bookingModal.selectPackage")}
                    </button>
                  </div>
                </div>
              </>
            )}
            {step === "intake" && (
              <IntakeForm onSubmit={handleIntakeSubmit} userData={userData} />
            )}
            {step === "paymentSuccess" && (
              <PaymentSuccessModal
                onClose={() => {
                  setStep("success");
                }}
                text="Your booking is being updated. Your booking will appear in your profile section shortly. "
                selectedSlot={selectedSlot}
                paymentResponse={paymentResponse}
              />
            )}
            {/* STEP 3 - SUCCESS */}
            {step === "success" && (
              <div className="text-center py-6">
                <CheckCircle className="mx-auto text-green-500 w-16 h-16 mb-4" />
                <h2 className="text-xl font-bold text-green-600 mb-2">
                  {t("psychology.bookingModal.bookingSuccessful")}
                </h2>
                <p className="text-gray-600 mb-6">
                  {t("psychology.bookingModal.therapistLink")}
                </p>

                <button
                  onClick={() => {
                    setStep("slot");
                    onClose();
                  }}
                  className="bg-primary text-white px-6 py-3 rounded-xl"
                >
                  {t("psychology.bookingModal.close")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* )} */}
    </>
  );
};

export default BookingModal;
