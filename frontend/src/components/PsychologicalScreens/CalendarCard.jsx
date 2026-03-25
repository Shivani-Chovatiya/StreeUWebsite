import React from "react";
import { useTranslation } from "react-i18next";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const CalendarCard = ({ selectedDate, setSelectedDate }) => {
  const { t } = useTranslation();
  const handleDateSelect = (date) => {
    if (!date) return;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;

    console.log("Selected date:", formattedDate);
    setSelectedDate(formattedDate);
  };

  return (
    // <div className="bg-white p-6 rounded-xl shadow">
    //   <h2 className="font-semibold mb-4">Calendar</h2>

    //   <div className="flex justify-center p-6">
    //     <DayPicker
    //       mode="single"
    //       numberOfMonths={2}
    //       pagedNavigation
    //       classNames={{
    //         months: "flex flex-col gap-6 sm:flex-col md:flex-col lg:flex-row",
    //       }}
    //     />
    //   </div>
    // </div>
    <div className="bg-white p-4 md:p-6 rounded-xl shadow overflow-hidden">
      <h2 className="font-semibold mb-4">{t("psychology.calendar")}</h2>

      <div className="flex justify-center overflow-x-auto">
        <DayPicker
          mode="single"
          numberOfMonths={1}
          pagedNavigation
          className="max-w-full"
          selected={selectedDate ? new Date(selectedDate) : undefined}
          onSelect={handleDateSelect}
          disabled={{ before: new Date() }}
          classNames={{
            months:
              "flex flex-col gap-4 sm:flex-col md:flex-col lg:flex-row md:gap-6",
          }}
        />
      </div>
    </div>
  );
};

export default CalendarCard;
