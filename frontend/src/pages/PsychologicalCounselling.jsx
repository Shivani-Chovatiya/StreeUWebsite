import React from "react";
import FreeTherapy from "../components/PsychologicalScreens/FreeTherapy";
import { useParams } from "react-router-dom";
import PaidTherapy from "../components/PsychologicalScreens/PaidTherapy";
import FreeAssessments from "../components/PsychologicalScreens/FreeAssessments";
import PaidAssessments from "../components/PsychologicalScreens/PaidAssessments";
import HypnoTherapy from "../components/PsychologicalScreens/HypnoTherapy";

const PsychologicalCounselling = () => {
  const { title } = useParams();

  return (
    <div>
      {title === "free-therapy" ? (
        <FreeTherapy />
      ) : title === "paid-therapy" ? (
        <PaidTherapy />
      ) : title === "free-assessments" ? (
        <FreeAssessments />
      ) : title === "paid-assessments" ? (
        <PaidAssessments />
      ) : title === "hypnotherapy" ? (
        <HypnoTherapy />
      ) : (
        <></>
      )}
    </div>
  );
};

export default PsychologicalCounselling;
