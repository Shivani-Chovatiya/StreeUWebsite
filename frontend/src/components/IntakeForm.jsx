import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const IntakeForm = ({ onSubmit, userData }) => {
  const [supportPersons, setSupportPersons] = useState([
    { name: "", relation: "" },
  ]);
  const medicalQuestions = [
    "Are you currently taking any prescription medication?",
    "Are you currently under the care of a physician for chronic condition?",
    "Do you have any history of seizures or significant head injuries?",
  ];

  // Initialize all questions with default false
  const initialAnswers = medicalQuestions.reduce((acc, question) => {
    acc[question] = false;
    return acc;
  }, {});
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    preferredName: "",
    dob: "",
    gender: "",
    email: "",
    therapy: "",
    reason: "",
    duration: "",
    livingWith: "",
    medicalAnswers: initialAnswers,
    confirmInformation: false,
  });
  useEffect(() => {
    if (userData) {
      const nameParts = userData.fullName ? userData.fullName.split(" ") : [];

      setFormData((prev) => ({
        ...prev,
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        preferredName: nameParts[0] || "",
        dob: userData.dob
          ? new Date(userData.dob).toISOString().split("T")[0]
          : "",
        gender:
          userData.gender?.charAt(0).toUpperCase() +
            userData.gender?.slice(1) || "",
      }));
    }
  }, [userData]);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  const handleMedicalChange = (question, value) => {
    setFormData((prev) => ({
      ...prev,
      medicalAnswers: {
        ...prev.medicalAnswers,
        [question]: value,
      },
    }));
  };
  // Add Support Person
  const addSupportPerson = () => {
    setSupportPersons([...supportPersons, { name: "", relation: "" }]);
  };

  // Remove Support Person
  const removeSupportPerson = (index) => {
    const updated = [...supportPersons];
    updated.splice(index, 1);
    setSupportPersons(updated);
  };

  const handleSubmit = () => {
    if (submitted) return;

    if (!formData.firstName.trim())
      return toast.error("First Name is required");

    if (!formData.lastName.trim()) return toast.error("Last Name is required");

    if (!formData.dob) return toast.error("Date of Birth is required");

    if (!formData.gender) return toast.error("Please select gender");

    if (!formData.email.trim()) return toast.error("Email is required");

    if (!formData.therapy) return toast.error("Please select therapy history");

    if (!formData.reason.trim())
      return toast.error("Please describe what brings you here");

    if (!formData.duration) return toast.error("Please select duration");

    if (!formData.livingWith.trim())
      return toast.error("Please enter who you live with");

    if (!formData.confirmInformation)
      return toast.error("Please confirm the information is accurate");

    const finalData = {
      "First Name": formData.firstName,
      "Last Name": formData.lastName,
      "Preferred Name": formData.preferredName,
      "Date of Birth": formData.dob,
      "Gender Identity": formData.gender,
      "Email Address": formData.email,
      "Have you attended therapy or counseling before?": formData.therapy,
      "What brings you here today?": formData.reason,
      "How long have you felt this way?": formData.duration,
      "Who do you currently live with?": formData.livingWith,
      "Supportive Persons": supportPersons,
      ...formData.medicalAnswers,
      "I confirm that the information provided above is accurate":
        formData.confirmInformation,
      submittedAt: new Date(),
    };

    onSubmit(finalData);
    setSubmitted(true);
  };
  return (
    // <div className="min-h-screen bg-gray-100 flex justify-center px-4 py-10">
    <div className="w-full max-h-[70vh] overflow-y-auto">
      <div className="w-full  bg-white rounded-2xl p-3 md:p-6">
        {/* Heading */}
        <h1 className="text-2xl md:text-3xl font-semibold">
          Let’s start with the basics
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          Your personal details are kept strictly confidential and secure.
        </p>

        {/* ================= BASIC INFO ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
          <div>
            <label className="form-label">First Name</label>
            <input
              name="firstName"
              className="input-style"
              placeholder="e.g. Sarah"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="form-label">Last Name</label>
            <input
              className="input-style"
              placeholder="e.g. Miller"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>

          <div className="md:col-span-2">
            <label className="form-label">Preferred Name (Optional)</label>
            <input
              name="preferredName"
              className="input-style"
              onChange={handleChange}
              value={formData.preferredName}
              placeholder="What should we call you?"
            />
          </div>

          <div>
            <label className="form-label">Date of Birth</label>
            <input
              type="date"
              className="input-style"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="form-label">Gender Identity</label>
            <select
              className="input-style"
              name="gender"
              onChange={handleChange}
              value={formData.gender}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="input-style"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
        </div>

        {/* ================= CLINICAL HISTORY ================= */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold">Clinical History</h2>

          <p className="mt-4 text-sm">
            Have you attended therapy or counseling before?
          </p>

          <div className="flex gap-4 mt-3">
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, therapy: "Yes" }))
              }
              className={`px-6 py-2 rounded-full border ${
                formData.therapy === "Yes"
                  ? "bg-orange-500 text-white"
                  : "border-gray-300"
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, therapy: "No" }))
              }
              className={`px-6 py-2 rounded-full border ${
                formData.therapy === "No"
                  ? "bg-orange-500 text-white"
                  : "border-gray-300"
              }`}
            >
              No
            </button>
          </div>

          <div className="mt-6">
            <label className="form-label">What brings you here today?</label>
            <textarea
              rows="4"
              className="input-style resize-none"
              placeholder="I've been feeling overwhelmed lately because..."
              value={formData.reason}
              onChange={handleChange}
              name="reason"
            />
          </div>

          <div className="mt-6">
            <label className="form-label">
              How long have you felt this way?
            </label>
            <select
              name="duration"
              className="input-style"
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Less than a month">Less than a month</option>
              <option value="1-6 months">1-6 months</option>
              <option value="More than a year">More than a year</option>
            </select>
          </div>
        </div>

        {/* ================= WHO IS IN YOUR CORNER ================= */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold">Who is in your corner?</h2>

          <div className="mt-5">
            <label className="form-label">
              Who do you currently live with?
            </label>
            <input
              name="livingWith"
              className="input-style"
              value={formData.livingWith}
              onChange={handleChange}
              placeholder="e.g. Partner, Roommates, Alone, Parents"
            />
          </div>
        </div>
        <div className="mt-10">
          <h2 className="text-xl font-semibold">
            Supportive Persons{" "}
            <span className="text-gray-400 text-sm">(Optional)</span>
          </h2>

          {supportPersons.map((person, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 items-end"
            >
              <div>
                <label className="form-label">Name</label>
                <input
                  className="input-style"
                  placeholder="Enter name"
                  value={person.name}
                  onChange={(e) => {
                    const updated = [...supportPersons];
                    updated[index].name = e.target.value;
                    setSupportPersons(updated);
                  }}
                />
              </div>

              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="form-label">Relationship</label>
                  <input
                    className="input-style"
                    placeholder="e.g. Friend"
                    value={person.relation}
                    onChange={(e) => {
                      const updated = [...supportPersons];
                      updated[index].relation = e.target.value;
                      setSupportPersons(updated);
                    }}
                  />
                </div>

                {index !== 0 && (
                  <button
                    onClick={() => removeSupportPerson(index)}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            onClick={addSupportPerson}
            className="mt-4 text-orange-600 font-medium text-sm"
          >
            + Add another person
          </button>
        </div>
        {/* ================= MEDICAL BACKGROUND ================= */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold">Medical Background</h2>

          <div className="space-y-4 mt-5">
            {[
              "Are you currently taking any prescription medication?",
              "Are you currently under the care of a physician for chronic condition?",
              "Do you have any history of seizures or significant head injuries?",
            ].map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border p-4 rounded-lg"
              >
                <p className="text-sm md:text-base">{item}</p>
                <input
                  type="checkbox"
                  className="w-5 h-5"
                  checked={formData.medicalAnswers[item]}
                  onChange={(e) => handleMedicalChange(item, e.target.checked)}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 bg-gray-50 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-6">Review Your Details</h2>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">First Name</span>
              <span className="font-medium">{formData.firstName || "-"}</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Last Name</span>
              <span className="font-medium">{formData.lastName || "-"}</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Email</span>
              <span className="font-medium">{formData.email || "-"}</span>
            </div>

            {/* Support Persons Summary */}
            <div>
              <p className="text-gray-500 mb-2">Supportive Persons</p>
              {supportPersons.length === 0 ||
              supportPersons.every((p) => !p.name && !p.relation) ? (
                <p className="text-gray-400 text-sm">None added</p>
              ) : (
                supportPersons.map((p, i) => (
                  <div
                    key={i}
                    className="flex justify-between bg-white p-3 rounded-lg mb-2"
                  >
                    <span>{p.name || "-"}</span>
                    <span className="text-gray-500">{p.relation || "-"}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <div className="flex items-start gap-2 mt-4">
          <input
            type="checkbox"
            id="confirmInformation"
            checked={formData.confirmInformation}
            onChange={(e) =>
              setFormData({
                ...formData,
                confirmInformation: e.target.checked,
              })
            }
            className="mt-1"
          />

          <label htmlFor="confirmInformation" className="text-sm text-gray-700">
            I confirm that the information provided above is accurate and true
            to the best of my knowledge.
          </label>
        </div>
        {/* ================= SUBMIT BUTTON ================= */}
        <button
          onClick={handleSubmit}
          disabled={submitted}
          className={`w-full mt-10 py-3 rounded-full text-lg transition
  ${
    submitted
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-orange-600 hover:bg-orange-700 text-white"
  }`}
        >
          {submitted
            ? "Processing payment, please wait..."
            : "Submit Intake Form →"}
        </button>
      </div>
    </div>
  );
};

export default IntakeForm;
