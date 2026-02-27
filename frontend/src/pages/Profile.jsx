import React, { useState } from "react";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("Profile");
  return (
    <div className="font-poppins mt-10 p-3 md:p-6">
      <div className="flex flex-col gap-5 justify-center items-center">
        <h1 className="text-black text-xl md:text-2xl font-bold">
          User Profile
        </h1>
        <div>
          {" "}
          <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3  gap-2   p-1 mb-4">
            {["Profile", "My Predictions", "Booking"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-xl border font-bold border-primary  capitalize shrink-0 text-sm justify-center items-center flex ${
                  activeTab === tab
                    ? "bg-primary text-white"
                    : "text-black hover:bg-gray-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
