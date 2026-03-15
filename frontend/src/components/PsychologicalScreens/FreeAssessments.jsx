// import React, { useEffect, useState } from "react";
// import InviteFriend from "../InviteFriend";
// import vector from "../../assets/Aboutusimg/Vector.png";
// import Wheel from "../../assets/Aboutusimg/Wheel.png";
// import { useTranslation } from "react-i18next";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import {
//   doc,
//   setDoc,
//   updateDoc,
//   arrayUnion,
//   getDoc,
//   getDocs,
//   collection,
// } from "firebase/firestore";
// import { db } from "../../config/firebase";
// import { toast } from "react-toastify";
// import Login from "../Login";

// const symptoms = [
//   "Excessive sleeping or lack of sleep",
//   "Disturbed eating pattern",
//   "Social isolation",
//   "Difficulty communicating with others",
//   "Difficulty in everyday activities (eating, drawing, bathing, etc.)",
//   "Reading/writing issues",
//   "Short-tempered or too aggressive",
//   "Rigid behaviour patterns",
//   "Repetitive & restricted behaviour",
//   "Learning difficulty",
//   "Delay in developmental milestones",
//   "Hopelessness/helplessness",
//   "Seeks attention",
//   "Seizures/fits",
//   "Excessive mood variations",
//   "Hypo sensitive / Hypersensitive",
//   "Suicidal thoughts or behaviour",
//   "Hallucinations / Delusions",
//   "Self-harm",
//   "Sensitivity to light or noise",
//   "Disorganized thinking",
//   "Obsession (recurring unwanted thoughts/images/urges)",
//   "Addiction (persistent substance or activity use)",
//   "Disrespects or disobeys parents",
//   "Parenting issues",
//   "Disagreement with partner or parents",
//   "Any fears or phobias",
//   "Self-doubt / Focus more on self-image",
//   "Frequent crying spells",
//   "Lack of concentration",
//   "Fight/arguments between parents or couple",
// ];

// const FreeAssessments = () => {
//   const { t } = useTranslation();
//   const [showLogin, setShowLogin] = useState(false);
//   const [symptoms, setSymptoms] = useState([]);
//   const [selectedSymptoms, setSelectedSymptoms] = useState([]);

//   useEffect(() => {
//     const auth = getAuth();

//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         try {
//           const userDoc = await getDoc(doc(db, "users", user.uid));

//           if (userDoc.exists()) {
//             const data = userDoc.data();

//             if (data.selectedSymptoms) {
//               setSelectedSymptoms(data.selectedSymptoms);
//             }
//           }
//         } catch (error) {
//           console.error("Error loading user symptoms:", error);
//         }
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   const fetchSymptoms = async () => {
//     try {
//       const snapshot = await getDocs(collection(db, "assessments"));

//       const data = snapshot.docs
//         .map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }))
//         .filter((item) => item.status === "Active"); // only active

//       setSymptoms(data);
//     } catch (error) {
//       console.error("Error fetching symptoms:", error);
//     }
//   };

//   useEffect(() => {
//     fetchSymptoms();
//   }, []);

//   const handleCheckboxChange = (id) => {
//     if (selectedSymptoms.includes(id)) {
//       setSelectedSymptoms(selectedSymptoms.filter((item) => item !== id));
//     } else {
//       if (selectedSymptoms.length >= 10) {
//         toast.warn("You can select maximum 10 symptoms");
//         return;
//       }
//       setSelectedSymptoms([...selectedSymptoms, id]);
//     }
//   };
//   const handleSubmit = async () => {
//     // if (selectedSymptoms.length < 8) {
//     //   toast.error("Please select at least 8 symptoms");
//     //   return;
//     // }

//     try {
//       const auth = getAuth();
//       const user = auth.currentUser;

//       if (!user) {
//         toast.error("Please login first");
//         setShowLogin(true);

//         return;
//       }

//       await setDoc(
//         doc(db, "users", user.uid),
//         {
//           selectedSymptoms: selectedSymptoms,
//           updatedAt: new Date(),
//         },
//         { merge: true },
//       );

//       toast.success("Symptoms saved successfully!");
//       // setSelectedSymptoms([]);
//       fetchSymptoms();
//     } catch (error) {
//       console.error("Error saving symptoms:", error);
//     }
//   };
//   return (
//     <div className="font-poppins mt-10 p-6 md:p-16">
//       <div className="flex flex-col gap-6 p-3 md:p-6 justify-center items-center">
//         <img src={vector} className="" alt="" />
//         <h1 className="p-3 border rounded-2xl text-sm md:text-xl">
//           <span className="text-white bg-primary rounded-full text-sm md:text-xl px-2 py-1 md:px-4 md:py-2">
//             New
//           </span>{" "}
//           {t("aboutus.badge")}
//         </h1>
//         <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-black text-center p-3">
//           Free Assessment
//         </h1>
//         <h1 className="text-xs md:text-sm font-semibold md:w-3/4 text-black text-center p-3">
//           Integrating future predictions with psychological counselling. Get
//           personalized insights and guidance tailored for you. Save your
//           valuable time & money
//         </h1>
//       </div>
//       <div className="flex flex-col gap-6 justify-center items-center">
//         <h1 className="font-bold text-black text-xl">
//           Choose any 8-10 symptoms
//         </h1>
//         <div className="bg-[#FFEFDF] w-full rounded-2xl p-6   shadow-md">
//           <div className="space-y-3 ">
//             {symptoms.map((item, index) => (
//               <label
//                 key={index}
//                 className="flex items-center gap-3 text-sm cursor-pointer"
//               >
//                 <input
//                   type="checkbox"
//                   className="w-4 h-4 accent-orange-500"
//                   checked={selectedSymptoms.includes(item.id)}
//                   onChange={() => handleCheckboxChange(item.id)}
//                 />
//                 {item.sentence}
//               </label>
//             ))}
//           </div>
//         </div>
//         <div className="flex justify-center items-center">
//           <button
//             onClick={handleSubmit}
//             className="bg-primary text-white px-6 py-3 rounded-xl"
//           >
//             Submit
//           </button>
//         </div>
//       </div>
//       <div
//         // style={{ backgroundImage: `url(${Wheel})` }}md:min-h-screen
//         className="w-full bg-contain bg-right bg-no-repeat mt-10 justify-center items-center flex"
//       >
//         <InviteFriend />
//       </div>

//       <Login
//         isOpen={showLogin}
//         onClose={() => setShowLogin(false)}
//         screenName={"psychological-counselling/free-assessments"}
//       />
//     </div>
//   );
// };

// export default FreeAssessments;
import React, { useEffect, useState } from "react";
import InviteFriend from "../InviteFriend";
import vector from "../../assets/Aboutusimg/Vector.png";
import Wheel from "../../assets/Aboutusimg/Wheel.png";
import { useTranslation } from "react-i18next";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  getDoc,
  getDocs,
  collection,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { toast } from "react-toastify";
import Login from "../Login";
import { CheckCircle2, Circle } from "lucide-react";

const FreeAssessments = () => {
  const { t } = useTranslation();
  const [showLogin, setShowLogin] = useState(false);
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));

          if (userDoc.exists()) {
            const data = userDoc.data();

            if (data.selectedSymptoms) {
              setSelectedSymptoms(data.selectedSymptoms);
            }
          }
        } catch (error) {
          console.error("Error loading user symptoms:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchSymptoms = async () => {
    try {
      const snapshot = await getDocs(collection(db, "assessments"));

      const data = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((item) => item.status === "Active");

      setSymptoms(data);
    } catch (error) {
      console.error("Error fetching symptoms:", error);
    }
  };

  useEffect(() => {
    fetchSymptoms();
  }, []);

  const handleCheckboxChange = (id) => {
    if (selectedSymptoms.includes(id)) {
      setSelectedSymptoms(selectedSymptoms.filter((item) => item !== id));
    } else {
      if (selectedSymptoms.length >= 10) {
        toast.warn("You can select maximum 10 symptoms");
        return;
      }
      setSelectedSymptoms([...selectedSymptoms, id]);
    }
  };

  const handleSubmit = async () => {
    // if (selectedSymptoms.length < 8) {
    //   toast.error("Please select at least 8 symptoms");
    //   return;
    // }

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        toast.error("Please login first");
        setShowLogin(true);
        return;
      }

      await setDoc(
        doc(db, "users", user.uid),
        {
          selectedSymptoms: selectedSymptoms,
          updatedAt: new Date(),
        },
        { merge: true },
      );

      toast.success("Symptoms saved successfully!");
      fetchSymptoms();
    } catch (error) {
      console.error("Error saving symptoms:", error);
    }
  };

  // Split symptoms into two columns
  const midpoint = Math.ceil(symptoms.length / 2);
  const leftColumnSymptoms = symptoms.slice(0, midpoint);
  const rightColumnSymptoms = symptoms.slice(midpoint);

  return (
    <div className="font-poppins mt-10 px-4 md:px-8 lg:px-16  mx-auto">
      {/* Header Section max-w-7xl*/}
      <div className="flex flex-col gap-6 p-3 md:p-6 justify-center items-center animate-fade-in-down">
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-black text-center animate-slide-up">
          Free Assessment
        </h1>

        <p className="text-sm md:text-sm lg:text-sm max-w-3xl text-black font-semibold text-center animate-slide-up-delay">
          Integrating future predictions with psychological counselling. Get
          personalized insights and guidance tailored for you. Save your
          valuable time & money
        </p>
      </div>

      {/* Symptoms Selection Section */}
      <div className="flex flex-col gap-8 justify-center items-center mt-12 animate-fade-in">
        {/* Counter & Instructions max-w-5xl*/}
        <div className="w-full  bg-gradient-to-r from-primary/10 via-orange-50 to-primary/10 rounded-2xl p-6 shadow-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="font-bold text-black text-xl md:text-2xl mb-2">
                Choose 8-10 Symptoms
              </h2>
              <p className="text-sm text-gray-600">
                Select the symptoms that best describe your concerns
              </p>
            </div>

            {/* Selection Counter */}
            <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-xl shadow-sm">
              <div className="text-center">
                <div
                  className={`text-3xl font-bold ${
                    selectedSymptoms.length >= 8 &&
                    selectedSymptoms.length <= 10
                      ? "text-green-600"
                      : selectedSymptoms.length > 10
                        ? "text-red-600"
                        : "text-primary"
                  }`}
                >
                  {selectedSymptoms.length}
                </div>
                <div className="text-xs text-gray-500">Selected</div>
              </div>
              <div className="text-2xl text-gray-300">/</div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-400">
                  {symptoms.length || 0}
                </div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Symptoms Grid max-w-5xl */}
        <div className="w-full bg-gradient-to-br from-orange-50 via-white to-orange-50 rounded-2xl p-6 md:p-8 shadow-xl ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Left Column */}
            <div className="space-y-3">
              {leftColumnSymptoms.map((item, index) => (
                <label
                  key={item.id}
                  className={`group flex items-start gap-3 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer hover:shadow-md animate-slide-in-left ${
                    selectedSymptoms.includes(item.id)
                      ? "bg-primary/10 border-primary shadow-md"
                      : "bg-white border-gray-200 hover:border-primary/30"
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {selectedSymptoms.includes(item.id) ? (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                    )}
                  </div>

                  <input
                    type="checkbox"
                    className="hidden"
                    checked={selectedSymptoms.includes(item.id)}
                    onChange={() => handleCheckboxChange(item.id)}
                  />

                  <span
                    className={`text-sm leading-relaxed transition-colors ${
                      selectedSymptoms.includes(item.id)
                        ? "text-black font-medium"
                        : "text-gray-700 group-hover:text-black"
                    }`}
                  >
                    {item.sentence}
                  </span>
                </label>
              ))}
            </div>

            {/* Right Column */}
            <div className="space-y-3">
              {rightColumnSymptoms.map((item, index) => (
                <label
                  key={item.id}
                  className={`group flex items-start gap-3 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer hover:shadow-md animate-slide-in-right ${
                    selectedSymptoms.includes(item.id)
                      ? "bg-primary/10 border-primary shadow-md"
                      : "bg-white border-gray-200 hover:border-primary/30"
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {selectedSymptoms.includes(item.id) ? (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                    )}
                  </div>

                  <input
                    type="checkbox"
                    className="hidden"
                    checked={selectedSymptoms.includes(item.id)}
                    onChange={() => handleCheckboxChange(item.id)}
                  />

                  <span
                    className={`text-sm leading-relaxed transition-colors ${
                      selectedSymptoms.includes(item.id)
                        ? "text-black font-medium"
                        : "text-gray-700 group-hover:text-black"
                    }`}
                  >
                    {item.sentence}
                  </span>
                </label>
              ))}
            </div>
          </div>
          {/* Submit Button */}
          <div className="flex justify-center items-center mt-5">
            <button
              onClick={handleSubmit}
              disabled={selectedSymptoms.length === 0}
              className="group relative bg-primary hover:bg-primary/90 text-white font-bold text-lg px-12 py-4 rounded-xl shadow-lg hover:shadow-2xl disabled:bg-gray-300 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden animate-pop-up"
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

              <span className="relative flex items-center gap-2">
                Submit Assessment
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>

        {/* Helper Text */}
      </div>

      {/* Invite Friend Section */}
      <div className="w-full bg-contain bg-right bg-no-repeat mt-16 justify-center items-center flex">
        <InviteFriend />
      </div>

      <Login
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        screenName={"psychological-counselling/free-assessments"}
      />
    </div>
  );
};

export default FreeAssessments;
