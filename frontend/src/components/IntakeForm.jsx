import React, { useState } from "react";

const IntakeForm = () => {
  const [supportPersons, setSupportPersons] = useState([
    { name: "", relation: "" },
  ]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    therapy: "No",
  });

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
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-4 py-10">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 md:p-10">
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
              className="input-style"
              placeholder="e.g. Sarah"
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
            />
          </div>

          <div>
            <label className="form-label">Last Name</label>
            <input
              className="input-style"
              placeholder="e.g. Miller"
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
            />
          </div>

          <div className="md:col-span-2">
            <label className="form-label">Preferred Name (Optional)</label>
            <input
              className="input-style"
              placeholder="What should we call you?"
            />
          </div>

          <div>
            <label className="form-label">Date of Birth</label>
            <input type="date" className="input-style" />
          </div>

          <div>
            <label className="form-label">Gender Identity</label>
            <select className="input-style">
              <option>Select an option</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="input-style"
              placeholder="name@example.com"
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
            <button className="px-6 py-2 rounded-full border border-gray-300">
              Yes
            </button>
            <button className="px-6 py-2 rounded-full bg-orange-500 text-white">
              No
            </button>
          </div>

          <div className="mt-6">
            <label className="form-label">What brings you here today?</label>
            <textarea
              rows="4"
              className="input-style resize-none"
              placeholder="I've been feeling overwhelmed lately because..."
            />
          </div>

          <div className="mt-6">
            <label className="form-label">
              How long have you felt this way?
            </label>
            <select className="input-style">
              <option>Select a duration...</option>
              <option>Less than a month</option>
              <option>1-6 months</option>
              <option>More than a year</option>
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
              className="input-style"
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
                <input type="checkbox" className="w-5 h-5" />
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

        {/* ================= SUBMIT BUTTON ================= */}
        <button className="w-full mt-10 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-full text-lg transition">
          Submit Intake Form →
        </button>
      </div>
    </div>
  );
};

export default IntakeForm;
