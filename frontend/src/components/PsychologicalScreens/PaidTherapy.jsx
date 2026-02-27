import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import vector from "../../assets/Aboutusimg/Vector.png";
import Wheel from "../../assets/Aboutusimg/Wheel.png";
import InviteFriend from "../InviteFriend";
import BookingModal from "./BookingModal";

const SESSION_TAG_VARIANTS = [
  { dark: [0, 1], orange: [0, 1, 2] },
  { dark: [2, 3], orange: [0, 2, 3] },
  { dark: [4, 5], orange: [1, 3, 4] },
  { dark: [6, 7], orange: [0, 2, 4] },
  { dark: [0, 3], orange: [1, 2, 3] },
  { dark: [5, 8], orange: [0, 3, 4] },
  { dark: [1, 6], orange: [1, 2, 4] },
  { dark: [2, 7], orange: [0, 1, 4] },
];

const PaidTherapy = () => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const darkTags = t("psychology.sessionTags.dark", { returnObjects: true });
  const orangeTags = t("psychology.sessionTags.orange", {
    returnObjects: true,
  });

  return (
    <div className="font-poppins mt-10">
      <div className="flex flex-col gap-6 p-3 md:p-6 justify-center items-center">
        <img src={vector} className="" alt="" />
        <h1 className="p-3 border rounded-2xl text-sm md:text-xl">
          <span className="text-white bg-primary rounded-full text-sm md:text-xl px-2 py-1 md:px-4 md:py-2">
            New
          </span>{" "}
          {t("aboutus.badge")}
        </h1>
        <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-black text-center p-3">
          {t("psychology.paidTherapyTitle")}
        </h1>
        <h1 className="text-xs md:text-sm font-semibold md:w-3/4 text-black text-center p-3">
          {t("psychology.paidTherapyDesc")}
        </h1>
        <p className="text-primary font-semibold text-center">
          {t("psychology.allSessionsOnline")}
        </p>
      </div>

      {/* 8 Session Containers */}
      <div className="px-4 md:px-8 py-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
            const variant = SESSION_TAG_VARIANTS[num - 1];
            const useShortLang = num % 3 === 0;
            return (
              <div
                key={num}
                className="bg-white rounded-lg border border-primary p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="text-xl font-bold text-gray-900 mb-2">
                  {num}. {t("psychology.paidTherapyTherapistName")}
                </p>
                <p className="text-xl  font-bold text-primary mb-3">
                  {t("psychology.sessionPrice")}{" "}
                  <span className="text-xl  font-bold text-primary mb-3">
                    {t("psychology.perSession")}
                  </span>
                </p>
                <p className="text-sm text-black mb-1 leading-snug">
                  <span className="font-bold text-black">
                    {t("psychology.qualificationLabel")}:
                  </span>{" "}
                  <span className="">{t("psychology.qualification")}</span>
                </p>
                <p className="text-sm text-black mb-1 leading-snug">
                  <span className="font-bold text-black">
                    {t("psychology.experienceLabel")}:
                  </span>{" "}
                  <span className="">{t("psychology.experience")}</span>
                </p>
                <p className="text-sm text-black mb-4 leading-snug">
                  <span className="font-bold text-black">
                    {t("psychology.languageLabel")}:
                  </span>{" "}
                  <span className="">
                    {useShortLang
                      ? t("psychology.languageShort")
                      : t("psychology.language")}
                  </span>
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {Array.isArray(darkTags) &&
                    variant.dark.map((i) => (
                      <span
                        key={`d-${i}`}
                        className="px-2 py-1 text-xs rounded-lg  text-primary border border-primary font-bold"
                      >
                        {darkTags[i]}
                      </span>
                    ))}
                  {Array.isArray(orangeTags) &&
                    variant.orange.map((i) => (
                      <span
                        key={`o-${i}`}
                        className="px-2 py-1 text-xs rounded-lg  text-primary border border-primary font-bold"
                      >
                        {orangeTags[i]}
                      </span>
                    ))}
                </div>
                <div className="flex gap-3 ">
                  <button className="flex-1 py-2.5 rounded-lg bg-gray-800 text-white font-semibold text-sm hover:bg-gray-700 transition-colors">
                    {t("psychology.book")}
                  </button>
                  <button
                    onClick={() => setOpen(true)}
                    className="flex-1 py-2.5 rounded-lg bg-primary text-white font-semibold text-sm hover:opacity-90 transition-opacity"
                  >
                    {t("psychology.viewDetails")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <BookingModal isOpen={open} onClose={() => setOpen(false)} />
      <div
        style={{ backgroundImage: `url(${Wheel})` }}
        className="w-full md:min-h-screen bg-contain bg-right bg-no-repeat mt-10 justify-center items-center flex"
      >
        <InviteFriend />
      </div>
    </div>
  );
};

export default PaidTherapy;
