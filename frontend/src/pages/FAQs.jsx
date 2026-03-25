import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { useScrollAnimation } from "../components/useScrollAnimation";
import { useTranslation } from "react-i18next";
import pluscircle from "../assets/Aboutusimg/pluscircle.png";
import minuscircle from "../assets/Aboutusimg/Icon.png";
import { useNavigate } from "react-router-dom";

const FAQs = ({ from }) => {
  const [openIndex, setOpenIndex] = useState(0);
  const { t } = useTranslation();
  const [faqs, setFaqs] = useState([]);
  const [faqRef, faqVisible] = useScrollAnimation();
  const [membershipRef, membershipVisible] = useScrollAnimation();
  const navigate = useNavigate();
  const fetchFAQs = async () => {
    try {
      const q = query(
        collection(db, "faqs"),
        where("status", "==", "Active"),
        orderBy("createdAt", "asc"),
      );

      const querySnapshot = await getDocs(q);

      const faqsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setFaqs(faqsData);
    } catch (error) {
      console.error("Error fetching tips:", error);
    }
  };
  useEffect(() => {
    fetchFAQs();
  }, []);
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const displayedFaqs = from === "aboutus" ? faqs.slice(0, 3) : faqs;
  return (
    <div
      ref={faqRef}
      className="bg-gradient-to-br from-orange-50 via-white to-orange-50 py-16 px-4 md:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <h2
          className={`text-2xl md:text-3xl text-primary font-bold text-center mb-12 transition-all duration-1000 ${
            faqVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          {t("aboutus.faqTitle")}
        </h2>

        <div className="space-y-4">
          {displayedFaqs.map((faq, index) => (
            <div
              key={index}
              className={`group border-2 rounded-2xl transition-all duration-700 hover:shadow-lg ${
                faqVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              } ${
                openIndex === index
                  ? "bg-gradient-to-r from-primary/10 to-orange-100 border-primary shadow-md"
                  : "bg-white border-orange-200 hover:border-primary/50"
              }`}
              style={{
                transitionDelay: faqVisible ? `${index * 100}ms` : "0ms",
              }}
            >
              {/* Question */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-5 md:p-6 text-left group-hover:text-primary transition-colors"
              >
                <span className="text-sm md:text-base font-bold text-black pr-4">
                  {faq.question}
                </span>

                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <img
                      src={minuscircle}
                      alt="collapse"
                      className="w-6 h-6 transition-transform duration-300 rotate-180"
                    />
                  ) : (
                    <img
                      src={pluscircle}
                      alt="expand"
                      className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
                    />
                  )}
                </div>
              </button>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-5 md:px-6 pb-5 text-sm md:text-base font-bold text-black  leading-relaxed">
                  {/* {faq.answer} */}
                  <span className="font-bold text-black">Answer:</span>
                  <div
                    className="prose prose-sm md:prose-base max-w-none text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: faq?.answer }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        {from === "aboutus" && faqs.length > 3 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => navigate("/faq")}
              className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:opacity-90 transition"
            >
              View All FAQs →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQs;
