"use client";
import React, { useState } from "react";

const ValidateProofPage = () => {
  // Example validator data (replace with actual data fetched from API or props)
  const [validatorDetails] = useState({
    requestedAttributes: [
      { name: "name", value: "John Doe" },
      { name: "degree", value: "Bachelor's in Computer Science" },
      { name: "status", value: "Active" },
      { name: "year", value: "2023" },
    ],
    revealedAttributes: [
      { name: "name", value: "John Doe" },
      { name: "degree", value: "Bachelor's in Computer Science" },
    ],
    identifiers: [
      { id: "cred1", schema: "Schema-123", issuer: "Issuer A" },
      { id: "cred2", schema: "Schema-456", issuer: "Issuer B" },
    ],
  });

  // Validate handler
  const handleValidate = () => {
    alert("Proof validated successfully!");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Validate Proof
      </h1>

      {/* Validator Details */}
      <div className="bg-white shadow-md rounded-md p-6 w-full max-w-3xl">
        {/* Requested Attributes */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Requested Attributes
          </h2>
          <ul className="list-disc pl-5 text-gray-600">
            {validatorDetails.requestedAttributes.map((attr, index) => (
              <li key={index}>
                <strong>{attr.name}:</strong> {attr.value}
              </li>
            ))}
          </ul>
        </div>

        {/* Revealed Attributes */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Revealed Attributes
          </h2>
          <ul className="list-disc pl-5 text-gray-600">
            {validatorDetails.revealedAttributes.map((attr, index) => (
              <li key={index}>
                <strong>{attr.name}:</strong> {attr.value}
              </li>
            ))}
          </ul>
        </div>

        {/* Identifiers */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Identifiers
          </h2>
          <ul className="list-disc pl-5 text-gray-600">
            {validatorDetails.identifiers.map((identifier, index) => (
              <li key={index}>
                <strong>ID:</strong> {identifier.id} | <strong>Schema:</strong>{" "}
                {identifier.schema} | <strong>Issuer:</strong>{" "}
                {identifier.issuer}
              </li>
            ))}
          </ul>
        </div>

        {/* Validate Button */}
        <button
          onClick={handleValidate}
          className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition"
        >
          <span>Validate</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ValidateProofPage;
