import React from "react";
import jsPDF from "jspdf";

const PaymentSuccessModal = ({
  onClose,
  text,
  selectedSlot,
  paymentResponse,
}) => {
  console.log(
    "Selected Slot in PaymentSuccessModal:",
    selectedSlot,
    paymentResponse,
  );
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
  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };
  //   const handleDownloadReceipt = () => {
  //     const doc = new jsPDF({
  //       orientation: "portrait",
  //       unit: "pt",
  //       format: "a4",
  //     });

  //     const margin = 40;
  //     let y = 50;

  //     // Title
  //     doc.setFontSize(24);
  //     doc.setFont("helvetica", "bold");
  //     doc.text("Transaction Receipt", 210, y, { align: "center" });

  //     y += 40;

  //     // Section: Transaction Details Box
  //     doc.setDrawColor(0, 198, 45); // green border
  //     doc.setLineWidth(1.5);
  //     doc.rect(margin, y, 520, 120, "S"); // x, y, width, height
  //     y += 20;

  //     doc.setFontSize(16);
  //     doc.setFont("helvetica", "bold");
  //     doc.text("Transaction ID:", margin + 10, y);
  //     doc.setFont("helvetica", "normal");
  //     doc.text(paymentResponse?.razorpay_payment_id || "-", margin + 150, y);
  //     y += 25;

  //     doc.setFont("helvetica", "bold");
  //     doc.text("Credits Purchased:", margin + 10, y);
  //     doc.setFont("helvetica", "normal");
  //     doc.text(selectedSlot ? "Session Booking" : "-", margin + 150, y);
  //     y += 25;

  //     doc.setFont("helvetica", "bold");
  //     doc.text("Date & Time:", margin + 10, y);
  //     doc.setFont("helvetica", "normal");
  //     doc.text(
  //       selectedSlot
  //         ? `${formatDate(selectedSlot.date)} • ${formatTime(selectedSlot.start)}-${formatTime(selectedSlot.end)}`
  //         : "-",
  //       margin + 150,
  //       y,
  //     );
  //     y += 35;

  //     // Total Amount Box
  //     doc.setFillColor(0, 198, 45); // green background
  //     doc.rect(margin, y, 520, 30, "F");
  //     doc.setFontSize(16);
  //     doc.setTextColor(255, 255, 255);
  //     doc.setFont("helvetica", "bold");
  //     doc.text(
  //       `Total Amount Paid: ${paymentResponse.currency}${paymentResponse?.amount / 100 || "-"}`,
  //       210,
  //       y + 20,
  //       { align: "center" },
  //     );
  //     y += 60;

  //     // Footer
  //     doc.setFontSize(12);
  //     doc.setTextColor(100);
  //     doc.setFont("helvetica", "normal");
  //     doc.text(
  //       "Having trouble? Contact Support or visit our Help Center.",
  //       210,
  //       y,
  //       { align: "center" },
  //     );

  //     // Save PDF
  //     doc.save("Transaction_Receipt.pdf");
  //   };
  const handleDownloadReceipt = () => {
    const doc = new jsPDF({
      orientation: "landscape", // landscape orientation
      unit: "pt",
      format: "a4",
    });

    const margin = 40;
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 60;

    // Title
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("Transaction Receipt", pageWidth / 2, y, { align: "center" });

    y += 50;

    // Transaction Details Box
    const boxWidth = pageWidth - margin * 2;
    const boxHeight = 140;

    doc.setDrawColor(0, 198, 45); // green border
    doc.setLineWidth(1.5);
    doc.roundedRect(margin, y, boxWidth, boxHeight, 10, 10, "S"); // rounded rectangle

    let detailY = y + 30;

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Transaction ID:", margin + 20, detailY);
    doc.setFont("helvetica", "normal");
    doc.text(
      paymentResponse?.razorpay_payment_id || "-",
      margin + 180,
      detailY,
    );
    detailY += 25;

    doc.setFont("helvetica", "bold");
    doc.text(
      selectedSlot
        ? "Therapy Session Booked:"
        : paymentResponse.name === "Paid Assessment"
          ? "Assessment Purchased"
          : "Credits Purchased:",
      margin + 20,
      detailY,
    );
    doc.setFont("helvetica", "normal");
    doc.text(
      selectedSlot
        ? "Session Booking"
        : paymentResponse.name === "Paid Assessment"
          ? "Assessment Purchased"
          : `${paymentResponse?.credits} Credits Purchased`,
      margin + 180,
      detailY,
    );
    detailY += 25;

    doc.setFont("helvetica", "bold");
    doc.text("Date & Time:", margin + 20, detailY);
    doc.setFont("helvetica", "normal");
    doc.text(
      selectedSlot
        ? `${formatDate(selectedSlot.date)} • ${formatTime(selectedSlot.start)}-${formatTime(selectedSlot.end)}`
        : `${formatDate(new Date())} • ${new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}`,
      margin + 180,
      detailY,
    );

    // Total Amount Box
    const totalY = y + boxHeight + 20;
    const totalHeight = 35;

    doc.setFillColor(0, 198, 45); // green background
    doc.roundedRect(margin, totalY, boxWidth, totalHeight, 8, 8, "F");

    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text(
      `Total Amount Paid: ${paymentResponse?.currency || ""}${paymentResponse?.amount / 100 || "-"}`,
      pageWidth / 2,
      totalY + 23,
      { align: "center" },
    );

    // Footer
    const footerY = totalY + totalHeight + 40;
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Having trouble? Contact Support or visit our Help Center.",
      pageWidth / 2,
      footerY,
      { align: "center" },
    );

    // Save PDF
    doc.save("Transaction_Receipt.pdf");
  };
  return (
    <div className="bg-white    rounded-2xl   max-h-[70vh] overflow-y-auto relative p-12">
      {/* Icon & Header */}
      <div className="flex flex-col items-center mb-12">
        <div className="flex justify-center items-center w-20 h-20 bg-green-100 rounded-full mb-6">
          <div className="w-10 h-10 bg-green-500 rounded-full"></div>
        </div>
        <h1 className="text-3xl font-bold text-center mb-2">
          Payment Received Successfully
        </h1>
        <p className="text-gray-500 text-center max-w-[500px]">{text}</p>
      </div>

      {/* Wallet Sync Status */}
      {/* <div className="border border-red-300 rounded-xl p-5 mb-8">
        <div className="flex justify-between items-center mb-3">
          <p className="font-semibold text-lg">Wallet Syncing</p>
          <div className="bg-green-100 px-3 py-1 rounded">
            <span className="text-green-800 font-medium text-sm">
              In Progress
            </span>
          </div>
        </div>
        <div className="relative h-5 bg-gray-300 rounded-full">
          <div className="absolute top-0 left-0 h-5 w-1/2 bg-green-500 rounded-full shadow-lg"></div>
        </div>
        <p className="text-gray-400 text-sm mt-2">
          Refreshing balance for account{" "}
          <span className="font-medium">#ASTRO-992834</span>
        </p>
      </div> */}

      {/* Receipt Section */}
      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-bold mb-4">Transaction Receipt</h2>

        <div className="flex flex-col gap-3 justify-between mb-4">
          <div>
            <p className="font-bold text-base">Transaction ID</p>
            <p className="text-gray-800">
              {paymentResponse?.razorpay_payment_id}
            </p>
          </div>
          <div>
            <p className="font-bold text-base">
              {selectedSlot
                ? "Therapy Session Booked"
                : paymentResponse.name === "Paid Assessment"
                  ? "Assessment Purchased"
                  : "Credits Purchased"}
            </p>
            <p className="text-gray-800">
              {selectedSlot
                ? "Session Booking"
                : paymentResponse.name === "Paid Assessment"
                  ? "Assessment Purchased"
                  : `${paymentResponse?.credits} Credits Purchased`}
            </p>
          </div>
          <div>
            <p className="font-bold text-base">Date & Time</p>
            <p className="text-gray-800">
              {selectedSlot
                ? `${formatDate(selectedSlot.date)} • ${formatTime(selectedSlot.start)}-${formatTime(selectedSlot.end)}`
                : `${formatDate(new Date())} • ${new Date().toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    },
                  )}`}
            </p>
          </div>
        </div>

        <div className="border-t border-dashed border-gray-300 py-4 flex justify-between items-center">
          <p className="font-bold text-base">Total Amount Paid</p>
          <p className="font-bold text-lg">
            {selectedSlot
              ? `${paymentResponse?.currency}${paymentResponse?.amount / 100}`
              : ""}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col gap-4">
        <button
          className="w-full bg-primary text-white py-4 rounded-lg font-semibold transition"
          onClick={onClose}
        >
          Continue
        </button>
        <button
          onClick={handleDownloadReceipt}
          className="w-full border border-gray-300 py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-gray-100 transition"
        >
          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
          <span className="text-gray-700 font-medium">
            Download PDF Receipt
          </span>
        </button>
      </div>

      {/* Support Footer */}
      <p className="text-center text-gray-400 text-sm mt-6">
        Having trouble? Contact Support or visit our Help Center.
      </p>
    </div>
  );
};

export default PaymentSuccessModal;
