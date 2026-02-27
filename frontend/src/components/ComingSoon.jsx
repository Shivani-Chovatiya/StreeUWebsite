import React from "react";

const ComingSoon = () => {
  return (
    <div className="min-h-screen flex items-center justify-center  px-6 font-poppins">
      <div className="bg-gradient-to-br from-[#F5D6C7] via-white to-[#FBEAE2] bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-8 md:p-14 max-w-2xl w-full text-center border border-primary/20">
        {/* Badge */}
        <span className="inline-block px-4 py-1 mb-6 text-sm font-semibold text-primary bg-primary/10 rounded-full">
          🚀 Launching Soon
        </span>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-bold text-primary mb-6">
          Coming Soon
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 text-sm md:text-lg mb-8">
          We’re working on something amazing for you. Stay tuned and get ready
          for an exciting experience!
        </p>

        {/* Button
        <button className="px-8 py-3 bg-primary text-white rounded-xl font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300">
          Notify Me
        </button> */}
      </div>
    </div>
  );
};

export default ComingSoon;
