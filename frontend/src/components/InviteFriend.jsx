import React, { useEffect, useState } from "react";
import invitefriend from "../assets/Aboutusimg/invitefriend.png";
import refericon from "../assets/Aboutusimg/refericon.png";
import { useTranslation } from "react-i18next";
import { auth, db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";

const InviteFriend = () => {
  const { t } = useTranslation();

  const [referralCode, setReferralCode] = useState("");

  useEffect(() => {
    const getReferralCode = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setReferralCode(docSnap.data().referralCode);
      }
    };

    getReferralCode();
  }, []);

  const handleInvite = () => {
    const message = `Hey! 😊  
Join Steer-U and get free astrology insights.  

Use my referral code: *${referralCode}*  

Sign up here 👉 http://localhost:5174/profile?referralCode=${referralCode}`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="font-poppins grid grid-cols-1 md:grid-cols-2 gap-9 md:gap-6">
      <div className="flex justify-center items-center">
        <img src={invitefriend} />
      </div>
      <div className="flex justify-center items-center flex-col gap-6 p-3 md:p-6">
        <h1 className="text-center text-black text-xl md:text-3xl font-bold">
          {t("invite.title")}
        </h1>
        <h1 className="text-center text-black text-sm md:text-xl font-semibold">
          {t("invite.subtitle")}
        </h1>
        <button
          onClick={handleInvite}
          className="bg-primary py-2 px-5 text-white font-bold rounded-2xl flex flex-row gap-2"
        >
          <img src={refericon} className="w-5 h-5" />
          <h1> {t("invite.button")}</h1>
        </button>
      </div>
    </div>
  );
};

export default InviteFriend;
