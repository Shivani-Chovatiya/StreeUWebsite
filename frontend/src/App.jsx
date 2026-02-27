import React from "react";
import Header from "./components/Header";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutUs from "./pages/AboutUs";
import Services from "./pages/Services";
import ContactUs from "./pages/ContactUs";
import Hypnotherapy from "./pages/Hypnotherapy";
import Footer from "./components/Footer";
import Pricing from "./pages/Pricing";
import PsychologicalCounselling from "./pages/PsychologicalCounselling";
import FuturePrediction from "./pages/FuturePrediction";
import FuturePrediction2 from "./pages/FuturePrediction2";
import Wallet from "./pages/Wallet";
import Profile from "./pages/Profile";
import IntakeForm from "./components/IntakeForm";
import Privacy from "./pages/Privacy";

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route
          path="/psychological-counselling/:title"
          element={<PsychologicalCounselling />}
        />
        <Route
          path="/future-prediction/:title"
          element={<FuturePrediction />}
        />
        <Route
          path="/future-predictionscreen/:title"
          element={<FuturePrediction2 />}
        />
        <Route path="/intakeform" element={<IntakeForm />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
