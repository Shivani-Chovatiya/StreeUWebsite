import React from "react";
import { useTranslation } from "react-i18next";
import vector from "../assets/Aboutusimg/Vector.png";
import Wheel from "../assets/Aboutusimg/Wheel.png";
import InviteFriend from "../components/InviteFriend";

const Pricing = () => {
  const { t } = useTranslation();

  const paidPackages = [
    {
      price: t("homepagepaidPackagesprice1"),
      discount: "",
      details: t("homepagepaidPackagesdetails1"),
    },
    {
      price: t("homepagepaidPackagesprice2"),
      discount: "",
      details: t("homepagepaidPackagesdetails2"),
    },
    {
      price: t("homepagepaidPackagesprice3"),
      discount: "",
      details: t("homepagepaidPackagesdetails3"),
    },
    {
      price: t("homepagepaidPackagesprice4"),
      discount: "",
      details: t("homepagepaidPackagesdetails4"),
    },
  ];
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
          Pricing
        </h1>
        <h1 className="text-xs md:text-sm font-semibold md:w-3/4 text-black text-center p-3">
          Integrating future predictions with psychological counselling. Get
          personalized insights and guidance tailored for you. Save your
          valuable time & money
        </h1>
      </div>
      <div className="flex justify-center items-center">
        <h1 className="text-black font-bold text-xl">
          Future prediction packages
        </h1>
      </div>
      <div className="p-2 md:p-6">
        <div className="mt-10 bg-[#FFE6CE] p-2 gap-3 rounded-xl m-3  items-center flex flex-row justify-between">
          <h1 className="text-primary text-sm md:text-xl text-center">
            Ask Anything in just 1 Credit 1 credit = ₹100only
          </h1>
          <button className="bg-primary px-6 py-3 rounded-xl text-white font-bold">
            Select
          </button>
        </div>
      </div>
      <div className="p-2 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 m-4 ">
          {paidPackages.map((item, i) => (
            <div
              key={String(i + 1)}
              className="bg-[#FFE6CE] p-3 rounded-2xl justify-center flex items-center flex-col gap-3"
            >
              <div className="flex justify-center items-center flex-col">
                <h1 className="text-primary font-bold text-xl">{item.price}</h1>
                <h1 className="text-gray-400 text-sm ">(Tax included)</h1>
              </div>
              <ul className="list-disc flex justify-center items-start flex-col">
                <li className="text-black font-bold text-sm">
                  {item.details.split(" • ")[0]}
                </li>
                <li className="text-black font-bold text-sm">
                  {item.details.split(" • ")[1]}
                </li>
                <li className="text-black font-bold text-sm">
                  {item.details.split(" • ")[2]}
                </li>
              </ul>
              <button className="px-6 py-2 text-white font-bold bg-primary rounded-2xl">
                Select Package
              </button>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{ backgroundImage: `url(${Wheel})` }}
        className="w-full md:min-h-screen bg-contain bg-right bg-no-repeat mt-10 justify-center items-center flex"
      >
        <InviteFriend />
      </div>
    </div>
  );
};

export default Pricing;
