// import { Calendar, Clock, Video } from "lucide-react";
// import { useState } from "react";
// import { useTranslation } from "react-i18next";
// import CalendarCard from "./PsychologicalScreens/CalendarCard";
// import { AiOutlineClose } from "react-icons/ai";

// export default function SessionCard({
//   key,
//   session,
//   handleCancelBooking,
//   cancellingId,
//   setCancellingId,
//   isCancelling,
//   setIsReScheduling,
//   isReScheduling,
//   handleRescheduleRequest,disabled
// }) {
//   console.log(session);
//   const { t } = useTranslation();
//   const today = new Date().toISOString().split("T")[0];
//   const [selectedDate, setSelectedDate] = useState(today);
//   const [selectedSlot, setSelectedSlot] = useState("");

//   const formatTime = (time) => {
//     const [hour, minute] = time.split(":");
//     const date = new Date();
//     date.setHours(hour);
//     date.setMinutes(minute);

//     return date.toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };

//   const therapistName = session?.therapistName || "Therapist";
//   const date = session?.date;
//   // const time = `${session?.start} - ${session?.end}`;
//   const time = `${formatTime(session?.start)} - ${formatTime(session?.end)}`;
//   const status = session?.status;

//   const now = new Date();

//   // Check if session is today
//   const isTodaySession = date === today;
//   const startTime = new Date(`${session.date} ${session.start}`);
//   const endTime = new Date(`${session.date} ${session.end}`);

//   const canJoin = now >= startTime && now <= endTime;

//   const therapistSlots = session?.therapist?.slots || [];
//   const filteredSlots = therapistSlots.filter(
//     (slot) => slot.date === selectedDate,
//   );
//   const getPeriod = (time) => {
//     const hour = parseInt(time.split(":")[0]);

//     if (hour < 12) return "Morning";
//     if (hour < 17) return "Afternoon";
//     return "Evening";
//   };
//   const groupedSlots = filteredSlots.reduce((acc, slot) => {
//     const period = getPeriod(slot.start);

//     if (!acc[period]) acc[period] = [];
//     acc[period].push(slot);

//     return acc;
//   }, {});

//   return (
//     <div className="bg-gray-100 rounded-xl p-5 w-full" key={key}>
//       {/* Top Section */}
//       <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
//         <div className="flex items-center gap-4">
//           {/* Profile */}
//           <div className="w-12 h-12 rounded-full bg-[#F3D0BE] flex items-center justify-center">
//             {/* <div className="w-6 h-6 bg-primary rounded-full"></div> */}
//             <img
//               src={session?.therapist?.imageUrl}
//               alt={therapistName}
//               className="w-3/4 h-3/4   p-2"
//             />
//           </div>

//           <h2 className="text-xl font-semibold">{therapistName}</h2>
//         </div>

//         <span className="bg-[#F3D0BE] text-primary text-xs font-semibold px-4 py-1 rounded-full">
//           {status}
//         </span>
//       </div>

//       {/* Date & Time */}
//       <div className="flex flex-col md:flex-row gap-4 mb-6">
//         {/* Date */}
//         <div className="flex-1">
//           <p className="font-semibold mb-2">Date</p>
//           <div className="flex items-center gap-3 border rounded-lg p-3 bg-white">
//             <Calendar size={20} className="text-primary" />
//             <span className="text-xs">{date}</span>
//           </div>
//         </div>

//         {/* Time */}
//         <div className="flex-1">
//           <p className="font-semibold mb-2">Time</p>
//           <div className="flex items-center gap-3 border rounded-lg p-3 bg-white">
//             <Clock size={20} className="text-primary" />
//             <span className="text-xs">{time}</span>
//           </div>
//         </div>
//       </div>

//       {/* Buttons */}

//       <div className="flex flex-col  gap-4">
//         <a
//           href={canJoin ? session?.meetingLink : "#"}
//           target="_blank"
//           className={`flex-1 font-semibold py-2 rounded-md flex items-center justify-center gap-2
//             ${
//               canJoin
//                 ? "bg-primary text-white hover:opacity-90"
//                 : "bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none"
//             }`}
//         >
//           <Video size={18} />
//           Join Session
//         </a>
//         {/* ── Cancel Button (only for Scheduled sessions) ── */}
//         {session.status === "Scheduled" &&
//           !session.isRescheduleRequest &&
//           session.canCancel && (
//             <button
//               onClick={() => handleCancelBooking(session)}
//               disabled={isCancelling || session.isCancelRequest}
//               className={`w-full py-2 rounded-xl text-sm font-semibold border transition ${
//                 isCancelling
//                   ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
//                   : "bg-white text-red-500 border-red-400 hover:bg-red-50"
//               }`}
//             >
//               {isCancelling
//                 ? "Processing..."
//                 : session.isCancelRequest
//                   ? "Cancellation Requested"
//                   : "Cancel Booking"}
//             </button>
//           )}

//         {session.status === "Scheduled" && !session.canCancel && (
//           <div className="w-full py-2 rounded-xl text-sm font-semibold text-center bg-yellow-50 text-yellow-600 border border-yellow-300">
//             Cancel allowed only within 24 hours of booking
//           </div>
//         )}
//         {/* ── Status badges for Ongoing / Completed ── */}
//         {session.status === "Ongoing" && (
//           <div className="w-full py-2 rounded-xl text-sm font-semibold text-center bg-green-50 text-green-600 border border-green-300">
//             🟢 Session is Ongoing
//           </div>
//         )}
//         {session.status === "Completed" && (
//           <div className="w-full py-2 rounded-xl text-sm font-semibold text-center bg-gray-50 text-gray-500 border border-gray-300">
//             ✅ Session Completed
//           </div>
//         )}
//         {session.status === "Scheduled" &&
//           session.canCancel &&
//           !session.isCancelRequest &&
//           !session.isRescheduleRequest && (
//             <button
//               onClick={() => setIsReScheduling(true)}
//               className="flex-1 bg-gray-200 text-gray-500 font-semibold py-2 rounded-md"
//             >
//               Reschedule
//             </button>
//           )}
//         {session.isRescheduleRequest && (
//           <p className="text-sm text-orange-600 mt-1">
//             Reschedule request sent. Waiting for admin approval.
//           </p>
//         )}
//       </div>
//       {isReScheduling && (
//         <div className="fixed inset-0 z-50 ">
//           <div className="fixed inset-0 bg-black/40  flex items-start md:items-center justify-center p-4 overflow-y-auto">
//             {/* Modal Card */}
//             <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 md:p-8 transition-all">
//               {/* Close */}
//               <button
//                 onClick={() => {
//                   setIsReScheduling(false);
//                 }}
//                 className="absolute right-4 top-4"
//               >
//                 <AiOutlineClose />
//               </button>
//               <>
//                 <h2 className="text-xl font-bold text-center mb-6">
//                   {t("psychology.bookingModal.selectSlot")}
//                 </h2>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                   {/* Left - Date Picker */}
//                   <div className="flex-1 bg-gray-50 p-4 rounded-xl border">
//                     <CalendarCard
//                       selectedDate={selectedDate}
//                       setSelectedDate={setSelectedDate}
//                     />
//                   </div>

//                   <div className="flex-1 space-y-6">
//                     {Object.keys(groupedSlots).length > 0 ? (
//                       Object.entries(groupedSlots).map(([period, slots]) => (
//                         <div key={period}>
//                           <h3 className="font-semibold text-primary mb-3">
//                             {period}
//                           </h3>

//                           <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//                             {slots.map((slot, index) => {
//                               const timeLabel = `${slot.start} - ${slot.end}`;
//                               const now = new Date();

//                               // create slot start datetime
//                               const slotStart = new Date(
//                                 `${selectedDate} ${slot.start}`,
//                               );

//                               // disable if booked OR time reached/passed
//                               const isDisabled =
//                                 slot.isBooked || now >= slotStart;
//                               console.log(
//                                 isDisabled,
//                                 now,
//                                 slotStart,
//                                 now >= slotStart,
//                               );
//                               return (
//                                 <button
//                                   key={index}
//                                   disabled={isDisabled}
//                                   onClick={() => setSelectedSlot(slot)}
//                                   className={`border rounded-lg py-2 text-sm font-medium transition ${
//                                     isDisabled
//                                       ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//                                       : selectedSlot === slot
//                                         ? "bg-primary text-white border-primary"
//                                         : "border-gray-300 text-gray-700 hover:bg-primary/10"
//                                   }`}
//                                 >
//                                   {timeLabel}
//                                 </button>
//                               );
//                             })}
//                           </div>
//                         </div>
//                       ))
//                     ) : (
//                       <p className="text-gray-500">No slots available</p>
//                     )}
//                   </div>
//                 </div>

//                 <button
//                   disabled={!selectedSlot}
//                   // onClick={() => setStep("package")}
//                   onClick={() => handleRescheduleRequest(session, selectedSlot)}
//                   className={`w-full py-3 rounded-xl font-semibold transition ${
//                     !selectedSlot
//                       ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                       : "bg-primary text-white"
//                   }`}
//                 >
//                   {t("psychology.bookingModal.confirmSlot")}
//                 </button>
//               </>
//             </div>
//           </div>{" "}
//         </div>
//       )}
//     </div>
//   );
// }
import { Calendar, Clock, Video, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import CalendarCard from "./PsychologicalScreens/CalendarCard";
import { AiOutlineClose } from "react-icons/ai";

export default function SessionCard({
  key,
  session,
  handleCancelBooking,
  cancellingId,
  setCancellingId,
  isCancelling,
  setIsReScheduling,
  isReScheduling,
  handleRescheduleRequest,
  disabled = false,
  formattedDate,
}) {
  console.log(session);
  const { t } = useTranslation();
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedSlot, setSelectedSlot] = useState("");

  const formatTime = (time) => {
    const [hour, minute] = time.split(":");
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute);

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const therapistName = session?.therapistName || "Therapist";
  const date = session?.date;
  const time = `${formatTime(session?.start)} - ${formatTime(session?.end)}`;
  const status = session?.status;

  const now = new Date();

  // Check if session is today
  const isTodaySession = date === today;
  const startTime = new Date(`${session.date} ${session.start}`);
  const endTime = new Date(`${session.date} ${session.end}`);

  const canJoin = now >= startTime && now <= endTime;

  const therapistSlots = session?.therapist?.slots || [];
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

  // Check if session is cancelled or rescheduled
  const isCancelled = status === "Cancelled";
  const isRescheduled = status === "Rescheduled";
  const isInactive = isCancelled || isRescheduled || disabled;
  const statusStyles = {
    Cancelled: "bg-red-100 text-red-700 border-red-200",
    Rescheduled: "bg-purple-100 text-purple-700 border-purple-200",
    Default: "bg-gray-100",
  };
  return (
    <div className="relative h-full">
      {/* // <div className="relative h-full flex flex-col"> */}
      {/* Overlay for Cancelled/Rescheduled sessions */}
      {isInactive && (
        <div className="absolute inset-0 bg-black/20 rounded-xl z-10 flex items-center justify-center">
          <div className="bg-white px-6 py-4 rounded-lg shadow-xl text-center">
            <span
              className={`text-lg font-bold ${
                isCancelled ? "text-red-600" : "text-purple-600"
              }`}
            >
              {isCancelled ? "❌ Cancelled" : "🔄 Rescheduled"}
            </span>
            {isRescheduled && session.movedToSlot && (
              <div className="mt-2 text-sm text-gray-700">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <ArrowRight className="w-4 h-4 text-blue-500" />
                  <span className="font-semibold">Moved to:</span>
                </div>
                <div className="text-xs text-gray-600">
                  <div>{session.movedToSlot.date}</div>
                  <div>
                    {formatTime(session.movedToSlot.start)} -{" "}
                    {formatTime(session.movedToSlot.end)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* <div
        className={`bg-gray-100 rounded-xl p-5 w-full flex flex-col justify-between ${
          isInactive ? "opacity-50" : ""
        }`}
        key={key}
      > */}
      <div
        className={`bg-gray-100 rounded-xl p-5 w-full h-full flex flex-col ${
          isInactive ? "opacity-50" : ""
        }`}
        key={key}
      >
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
          <div className="flex items-center gap-4">
            {/* Profile */}
            <div className="w-12 h-12 rounded-full bg-[#F3D0BE] flex items-center justify-center">
              {session?.therapist?.imageUrl ? (
                <img
                  src={session?.therapist?.imageUrl}
                  alt={therapistName}
                  className="w-3/4 h-3/4 p-2"
                />
              ) : (
                <h1 className="text-primary ">
                  {session?.therapist?.name?.charAt(0)?.toUpperCase()}
                </h1>
              )}
            </div>

            <div>
              {" "}
              <h2 className="text-xl font-semibold">{therapistName}</h2>
              <span className="text-xs">{formattedDate}</span>
            </div>
          </div>

          <span
            className={`text-xs font-semibold px-4 py-1 rounded-full ${
              status === "Completed"
                ? "bg-green-100 text-green-700"
                : status === "Scheduled"
                  ? "bg-blue-100 text-blue-700"
                  : status === "Ongoing"
                    ? "bg-yellow-100 text-yellow-700"
                    : status === "Cancelled"
                      ? "bg-red-100 text-red-700"
                      : status === "Rescheduled"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-[#F3D0BE] text-primary"
            }`}
          >
            {status}
          </span>
        </div>

        {/* Date & Time */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Date */}
          <div className="flex-1">
            <p className="font-semibold mb-2">Date</p>
            <div className="flex items-center gap-3 border rounded-lg p-3 bg-white">
              <Calendar size={20} className="text-primary" />
              <span className="text-xs">{date}</span>
            </div>
          </div>

          {/* Time */}
          <div className="flex-1">
            <p className="font-semibold mb-2">Time</p>
            <div className="flex items-center gap-3 border rounded-lg p-3 bg-white">
              <Clock size={20} className="text-primary" />
              <span className="text-xs">{time}</span>
            </div>
          </div>
        </div>

        {/* Buttons - Hide for inactive sessions */}
        {!isInactive && (
          <div className="flex flex-col gap-4">
            <a
              href={canJoin ? session?.meetingLink : "#"}
              target="_blank"
              className={`flex-1 font-semibold py-2 rounded-md flex items-center justify-center gap-2 
            ${
              canJoin
                ? "bg-primary text-white hover:opacity-90"
                : "bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none"
            }`}
            >
              <Video size={18} />
              Join Session
            </a>

            {/* ── Cancel Button (only for Scheduled sessions) ── */}
            {session.status === "Scheduled" &&
              !session.isRescheduleRequest &&
              session.canCancel && (
                <button
                  onClick={() => handleCancelBooking(session)}
                  disabled={isCancelling || session.isCancelRequest}
                  className={`w-full py-2 rounded-xl text-sm font-semibold border transition ${
                    isCancelling
                      ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                      : "bg-white text-red-500 border-red-400 hover:bg-red-50"
                  }`}
                >
                  {isCancelling
                    ? "Processing..."
                    : session.isCancelRequest
                      ? "Cancellation Requested"
                      : "Cancel Booking"}
                </button>
              )}

            {session.status === "Scheduled" && !session.canCancel && (
              <div className="w-full py-2 rounded-xl text-sm font-semibold text-center bg-yellow-50 text-yellow-600 border border-yellow-300">
                Cancel allowed only within 24 hours of booking
              </div>
            )}

            {/* ── Status badges for Ongoing / Completed ── */}
            {session.status === "Ongoing" && (
              <div className="w-full py-2 rounded-xl text-sm font-semibold text-center bg-green-50 text-green-600 border border-green-300">
                🟢 Session is Ongoing
              </div>
            )}

            {session.status === "Completed" && (
              <div className="w-full py-2 rounded-xl text-sm font-semibold text-center bg-gray-50 text-gray-500 border border-gray-300">
                ✅ Session Completed
              </div>
            )}

            {/* Reschedule Button */}
            {session.status === "Scheduled" &&
              session.canCancel &&
              !session.isCancelRequest &&
              !session.isRescheduleRequest && (
                <button
                  onClick={() => setIsReScheduling(true)}
                  className="flex-1 bg-gray-200 text-gray-500 font-semibold py-2 rounded-md"
                >
                  Reschedule
                </button>
              )}

            {session.isRescheduleRequest && (
              <p className="text-sm text-orange-600 mt-1">
                Reschedule request sent. Waiting for admin approval.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      {isReScheduling && (
        <div className="fixed inset-0 z-50 ">
          <div className="fixed inset-0 bg-black/40 flex items-start md:items-center justify-center p-4 overflow-y-auto">
            {/* Modal Card */}
            <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 md:p-8 transition-all">
              {/* Close */}
              <button
                onClick={() => {
                  setIsReScheduling(false);
                }}
                className="absolute right-4 top-4"
              >
                <AiOutlineClose />
              </button>
              <>
                <h2 className="text-xl font-bold text-center mb-6">
                  {t("psychology.bookingModal.selectSlot")}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Left - Date Picker */}
                  <div className="flex-1 bg-gray-50 p-4 rounded-xl border">
                    <CalendarCard
                      selectedDate={selectedDate}
                      setSelectedDate={setSelectedDate}
                    />
                  </div>

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
                  disabled={!selectedSlot}
                  onClick={() => handleRescheduleRequest(session, selectedSlot)}
                  className={`w-full py-3 rounded-xl font-semibold transition ${
                    !selectedSlot
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-primary text-white"
                  }`}
                >
                  {t("psychology.bookingModal.confirmSlot")}
                </button>
              </>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
