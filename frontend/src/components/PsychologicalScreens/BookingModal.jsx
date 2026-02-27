import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineClose } from "react-icons/ai";
import { CheckCircle } from "lucide-react";
import CalendarCard from "./CalendarCard";

const BookingModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState("slot");
  const [selectedSlot, setSelectedSlot] = useState("");
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
  if (!isOpen) return null;

  return (
    // <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4  overflow-y-auto">

    //   <div
    //     className="absolute inset-0 bg-black/50 backdrop-blur-sm"
    //     onClick={() => {
    //       setStep("slot");
    //       onClose();
    //     }}
    //   />

    //   <div className="relative  bg-white  w-full max-w-2xl rounded-2xl shadow-2xl p-6 md:p-8 z-10 transition-all">
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => {
          setStep("slot");
          onClose();
        }}
      />

      {/* Scroll Container */}
      <div className="fixed inset-0 flex items-start md:items-center justify-center p-4 overflow-y-auto">
        {/* Modal Card */}
        <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 md:p-8 transition-all">
          {/* Close */}
          <button
            onClick={() => {
              setStep("slot");
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
                  <CalendarCard />
                </div>

                {/* Right - Time Sections */}
                <div className="flex-1 space-y-6">
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
                </div>
              </div>

              <button
                disabled={!selectedSlot}
                onClick={() => setStep("package")}
                className={`w-full py-3 rounded-xl font-semibold transition ${
                  selectedSlot
                    ? "bg-primary text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {t("psychology.bookingModal.confirmSlot")}
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
  );
};

export default BookingModal;
