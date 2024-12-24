"use client";
import React, { useEffect, useState } from "react";
import useStore from "../store/useStore";
import { toast } from "react-toastify";

const ValidateProofPage = () => {
  const {
    fetchProofRequest,
    ReceieveProof,
    verifyPresentation,
    fetchSinglePresentation,
    singlePresentation,
  } = useStore();
  const [selectedProofIndex, setSelectedProofIndex] = useState(null); // Track selected presentation index

  // Handler for changing selected presentation
  const handleSelectChange = (event) => {
    const selectedIndex = event.target.value;
    console.log("Selected proof ID:", selectedIndex);
    setSelectedProofIndex(selectedIndex);

    // Fetch the selected presentation using the selected proof ID
    fetchSinglePresentation(selectedIndex); // Pass the selected index directly (no need to stringify)
  };

  // Fetch proof data when component mounts
  useEffect(() => {
    fetchProofRequest();
    console.log("Received proof data:", ReceieveProof); // For debugging
  }, [fetchProofRequest]);

  // Validation handler
  const handleValidate = () => {
    if (singlePresentation?.pres_ex_id) {
      verifyPresentation(singlePresentation.pres_ex_id);
    } else {
      toast.error("Proof ID is not available.");
    }
  };

  console.log(singlePresentation);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Validate Proof
      </h1>

      <div>
        {/* Select Input Field */}
        <label htmlFor="proofSelector" className="block mb-2 text-gray-700">
          Select a Presentation to Validate:
        </label>
        <select
          id="proofSelector"
          className="border bg-white border-gray-300 rounded px-3 py-2 mb-4 w-full"
          value={selectedProofIndex}
          onChange={handleSelectChange}
        >
          <option value="">-- Select Presentation --</option>
          {ReceieveProof?.map((proof, index) => (
            <option key={index} value={proof.pres_ex_id}>
              {proof.pres_ex_id}
            </option>
          ))}
        </select>

        {/* Message if no selection */}
        {selectedProofIndex === null && (
          <p className="text-gray-600">
            Please select a presentation to view and validate.
          </p>
        )}
      </div>

      {/* Validator Details */}
      {singlePresentation && (
        <div className="bg-white shadow-md rounded-md p-6 w-full max-w-3xl">
          {/* Requested Attributes */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Requested Attributes
            </h2>
            <ul className="list-disc pl-5 text-gray-600">
              {Object.entries(
                singlePresentation.by_format?.pres_request?.indy
                  ?.requested_attributes || {}
              ).map(([key, attr], attrIndex) => (
                <li key={`${key}-${attrIndex}`}>
                  <strong className="capitalize">{attr.name}</strong>
                </li>
              ))}
            </ul>
          </div>

          {/* Revealed Attributes */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Attributes
            </h2>
            <ul className="list-disc pl-5 text-gray-600">
              {singlePresentation && (
                <>
                  {/* Revealed Attributes */}
                  {Object.entries(
                    singlePresentation.by_format?.pres?.indy?.requested_proof
                      ?.revealed_attrs || {}
                  ).map(([key, value], id) => (
                    <li key={`revealed-${id}`}>
                      <strong className="capitalize">
                        {
                          singlePresentation.by_format?.pres_request?.indy
                            ?.requested_attributes[key].name
                        }
                        :
                      </strong>{" "}
                      {value.raw}
                    </li>
                  ))}

                  {/* Unrevealed Attributes */}
                  {Object.entries(
                    singlePresentation.by_format?.pres?.indy?.requested_proof
                      ?.unrevealed_attrs || {}
                  ).map(([key, value], id) => (
                    <li key={`unrevealed-${id}`}>
                      <strong className="capitalize">
                        {
                          singlePresentation.by_format?.pres_request?.indy
                            ?.requested_attributes[key].name
                        }
                        :
                      </strong>
                      Unrevealed
                    </li>
                  ))}
                </>
              )}
            </ul>
          </div>

          {/* Identifiers */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Identifiers
            </h2>
            <ul className="list-disc pl-5 text-gray-600">
              {singlePresentation.by_format?.pres?.indy?.identifiers?.map(
                (identifier, idIndex) => (
                  <li key={`identifier-${idIndex}`}>
                    <strong>Schema ID:</strong> {identifier.schema_id}{" "}
                    <strong>Credential ID:</strong> {identifier.cred_def_id}
                  </li>
                )
              )}
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
      )}
    </div>
  );
};

export default ValidateProofPage;
