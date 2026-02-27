import React from "react";

const Wallet = () => {
  return (
    <div className="font-poppins mt-10">
      <div className="flex justify-center items-center">
        <div className="md:w-1/2 w-3/4 bg-[#EBEBEB] rounded-2xl p-3 flex flex-col justify-center items-center gap-3">
          <h1 className=" text-black font-semibold text-xl">Your Balance</h1>
          <h1 className=" text-primary font-bold text-xl">120 Credits</h1>
          <button className="flex-1 py-2 px-6 rounded-lg bg-primary text-white font-semibold text-sm hover:opacity-90 transition-opacity">
            Add Credits
          </button>
        </div>
      </div>
      <div className="p-3 md:p-9">
        <h1 className="text-black text-xl font-semibold">Package History</h1>
        <div></div>
      </div>
    </div>
  );
};

export default Wallet;
