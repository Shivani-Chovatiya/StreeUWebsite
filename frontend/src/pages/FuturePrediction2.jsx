import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import vector from "../assets/Aboutusimg/Vector.png";
import InviteFriend from "../components/InviteFriend";
import Wheel from "../assets/Aboutusimg/Wheel.png";
import { useNavigate, useParams } from "react-router-dom";
import ComingSoon from "../components/ComingSoon";
import Login from "../components/Login";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineLocationMarker,
} from "react-icons/hi";

const CREDIT_OPTIONS = ["Compatibility", "Birth_Rectification"];
const PREDICTION_QUESTIONS = [
  "question1",
  "question2",
  "question3",
  "question4",
  "question5",
];

const FuturePrediction2 = () => {
  const { t } = useTranslation();
  const { title } = useParams();
  const navigate = useNavigate();
  const [selectedCredit, setSelectedCredit] = useState("Compatibility");
  const [showLogin, setShowLogin] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [formData, setFormData] = useState({
    person1: { name: "", birthDate: "", birthTime: "", location: "" },
    person2: { name: "", birthDate: "", birthTime: "", location: "" },
    customizedQuestion: "",
  });

  useEffect(() => {
    if (title) {
      setSelectedCredit(title);
    }
  }, [title]);

  const updateForm = (person, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [person]: { ...prev[person], [field]: value },
    }));
  };

  return (
    <div className="font-poppins mt-10">
      <div className="flex flex-col gap-6 p-3 md:p-6 justify-center items-center bg-[#F5D6C7] m-3 md:m-6 rounded-2xl">
        <img src={vector} className="" />
        <h1 className="p-3 border rounded-2xl text-xs md:text-xl">
          <span className="text-white bg-primary rounded-full text-sm md:text-xl px-2 py-1  md:px-4 md:py-2">
            New
          </span>{" "}
          {t("aboutus.badge")}
        </h1>
        <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-black text-center p-3">
          {t("futurePrediction.pageTitle")}
        </h1>
        <h1 className="text-xs md:text-sm lg:text-sm font-semibold md:w-3/4 text-black text-center p-3">
          {t("futurePrediction.subtitle")}
        </h1>
        <button
          onClick={() => setShowLogin(true)}
          className="bg-primary text-white px-8 py-3 rounded-lg font-semibold flex items-center mx-auto hover:opacity-90 transition-opacity"
        >
          {t("futurePrediction.login")}
        </button>
        <Login isOpen={showLogin} onClose={() => setShowLogin(false)} />
      </div>

      {/* Section 3: Credit/Question Selection Tabs */}
      <section className="px-4 md:px-8 py-6">
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          {CREDIT_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => {
                setSelectedCredit(option);
                navigate(`/future-predictionscreen/${option}`);
              }}
              className={`min-w-[140px] md:min-w-[180px] px-6 py-3 rounded-xl font-semibold text-sm md:text-base transition-all ${
                selectedCredit === option
                  ? "bg-primary text-white border-2 border-primary"
                  : "bg-white text-primary border-2 border-primary hover:bg-primary/5"
              }`}
            >
              {t(`futurePrediction.${option}`)}
            </button>
          ))}
        </div>
      </section>

      {/* Section 4: Prediction Form or Coming Soon */}
      <section className="px-4 md:px-16 ">
        {selectedCredit !== "Birth_Rectification" ? (
          <div className="flex flex-col gap-6">
            {/* First Person & Second Person Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* First Person */}
              <div className="bg-[#FFE3D5] rounded-2xl p-4 md:p-6 border border-primary ">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {t("futurePrediction.form.firstPerson")}
                </h3>
                <h1 className="text-xs font-semibold text-gray-900 mb-4">
                  Identify the resonance patterns of the partner traveler.
                </h1>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="font-bold text-black">Person1</label>
                    <input
                      type="text"
                      placeholder={`${t("futurePrediction.form.personName")} 1`}
                      value={formData.person1.name}
                      onChange={(e) =>
                        updateForm("person1", "name", e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-3xl border border-primary bg-white focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-black">Birth Date</label>
                      <div className="relative">
                        <HiOutlineCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          value={formData.person1.birthDate}
                          onChange={(e) =>
                            updateForm("person1", "birthDate", e.target.value)
                          }
                          className="w-full pl-10 pr-4 py-3 rounded-3xl border border-primary bg-white focus:border-primary focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-bold text-black">Birth Time</label>
                      <div className="relative">
                        <HiOutlineClock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="time"
                          value={formData.person1.birthTime}
                          onChange={(e) =>
                            updateForm("person1", "birthTime", e.target.value)
                          }
                          className="w-full pl-10 pr-4 py-3 rounded-3xl border border-primary bg-white focus:border-primary focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="font-bold text-black">Location</label>
                    <div className="relative">
                      <HiOutlineLocationMarker className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder={t("futurePrediction.form.location")}
                        value={formData.person1.location}
                        onChange={(e) =>
                          updateForm("person1", "location", e.target.value)
                        }
                        className="w-full pl-10 pr-4 py-3 rounded-3xl border border-primary bg-white focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Second Person */}
              <div className="bg-[#FFE3D5] rounded-2xl p-4 md:p-6 border border-primary">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {t("futurePrediction.form.secondPerson")}
                </h3>
                <h1 className="text-xs font-semibold text-gray-900 mb-4">
                  Identify the resonance patterns of the partner traveler.
                </h1>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="font-bold text-black">Person2</label>
                    <input
                      type="text"
                      placeholder={`${t("futurePrediction.form.personName")} 2`}
                      value={formData.person2.name}
                      onChange={(e) =>
                        updateForm("person2", "name", e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-3xl border border-primary bg-white focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-black">Birth Date</label>
                      <div className="relative">
                        <HiOutlineCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          value={formData.person2.birthDate}
                          onChange={(e) =>
                            updateForm("person2", "birthDate", e.target.value)
                          }
                          className="w-full pl-10 pr-4 py-3 rounded-3xl border border-primary bg-white focus:border-primary focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-bold text-black">Birth Time</label>
                      <div className="relative">
                        <HiOutlineClock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="time"
                          value={formData.person2.birthTime}
                          onChange={(e) =>
                            updateForm("person2", "birthTime", e.target.value)
                          }
                          className="w-full pl-10 pr-4 py-3 rounded-3xl border border-primary bg-white focus:border-primary focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="font-bold text-black">Location</label>
                    <div className="relative">
                      <HiOutlineLocationMarker className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder={t("futurePrediction.form.location")}
                        value={formData.person2.location}
                        onChange={(e) =>
                          updateForm("person2", "location", e.target.value)
                        }
                        className="w-full pl-10 pr-4 py-3 rounded-3xl border border-primary bg-white focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Please Select The Question */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {t("futurePrediction.form.selectQuestion")}
              </h3>
              <div className="flex flex-col gap-2">
                {PREDICTION_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() =>
                      setSelectedQuestion(selectedQuestion === q ? null : q)
                    }
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border transition-all text-left ${
                      selectedQuestion === q
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-[#FFF5EE] border-[#FFE8D9] hover:bg-[#FFE8D9]/50"
                    }`}
                  >
                    <span className="font-medium">
                      {t(`futurePrediction.form.${q}`)}
                    </span>
                    <span className="text-sm font-semibold text-primary">
                      {t("futurePrediction.credit1")}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Customized Question */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {t("futurePrediction.form.customizedQuestionTitle")}
              </h3>
              <p className="text-sm text-primary font-semibold mb-3">
                {t("futurePrediction.form.customizedQuestionSubtitle")}
              </p>
              <textarea
                placeholder={t("futurePrediction.form.customizedPlaceholder")}
                value={formData.customizedQuestion}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    customizedQuestion: e.target.value,
                  }))
                }
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#FFF5EE] focus:border-primary focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center items-center">
              <button
                type="button"
                onClick={() => setShowLogin(true)}
                className="w-1/2 md:w-1/4 py-4 rounded-xl bg-primary text-white font-semibold text-lg hover:opacity-90 transition-opacity "
              >
                {t("futurePrediction.form.submit")}
              </button>
            </div>
          </div>
        ) : (
          <ComingSoon />
        )}
      </section>
      <div
        style={{ backgroundImage: `url(${Wheel})` }}
        className="w-full md:min-h-screen   bg-contain bg-right bg-no-repeat mt-10 justify-center items-center flex"
      >
        <InviteFriend />
      </div>
    </div>
  );
};

export default FuturePrediction2;
