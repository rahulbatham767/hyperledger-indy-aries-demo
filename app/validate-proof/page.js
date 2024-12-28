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
    ProofRequests,
    singlePresentation,
  } = useStore();

  const [selectedProofIndex, setSelectedProofIndex] = useState(null); // Track selected presentation index
  const [selectedStatus, setSelectedStatus] = useState("");

  // Handler for changing selected presentation
  const handleSelectChange = (event) => {
    const selectedIndex = event.target.value;
    setSelectedProofIndex(selectedIndex);
    if (selectedIndex) fetchSinglePresentation(selectedIndex);
  };

  // Handler for changing selected status
  const handleStatusChange = (e) => {
    const status = e.target.value;
    setSelectedStatus(status);
    if (status) fetchProofRequest(status);
  };

  // Validation handler
  const handleValidate = () => {
    if (singlePresentation?.pres_ex_id) {
      verifyPresentation(singlePresentation.pres_ex_id);
      setSelectedStatus("");
      setSelectedProofIndex(null);
    } else {
      toast.error("Proof ID is not available.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-6">
      {/* Page Header */}
      <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        Validate Proof
      </h1>

      {/* Status Selection */}
      <div className="w-full max-w-md mb-6">
        <label htmlFor="status" className="block text-sm font-medium mb-2">
          Select Status:
        </label>
        <select
          id="status"
          className="w-full px-3 py-2 border bg-white border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          value={selectedStatus}
          onChange={handleStatusChange}
        >
          <option value="">Select A Validation State</option>
          <option value="request-sent">Requested Proof</option>
          <option value="presentation-received">Received Proof</option>
          <option value="abandoned">Abandoned</option>
        </select>
      </div>

      {/* Proof Selection */}
      <div className="w-full max-w-md mb-6">
        <label
          htmlFor="proofSelector"
          className="block text-sm font-medium mb-2"
        >
          {ReceieveProof
            ? "Select a Presentation to Validate:"
            : "No Proof Available to Validate"}
        </label>
        <select
          id="proofSelector"
          className="w-full px-3 py-2 border bg-white border-gray-300 rounded-md"
          value={selectedProofIndex}
          onChange={handleSelectChange}
        >
          <option value="">-- Select Presentation --</option>
          {ProofRequests?.map((proof, index) => (
            <option key={index} value={proof.pres_ex_id}>
              {proof.pres_ex_id}
            </option>
          ))}
        </select>
        {!selectedProofIndex && (
          <p className="text-sm text-gray-600 mt-2">
            Please select a presentation to view and validate.
          </p>
        )}
      </div>

      {/* Presentation Details */}
      {selectedStatus &&
        selectedProofIndex &&
        singlePresentation &&
        Object.keys(singlePresentation).length > 0 && (
          <div className="bg-white shadow-md rounded-md p-6 w-full max-w-md">
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

            {/* Attributes */}
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Attributes
              </h2>
              <ul className="list-disc pl-5 text-gray-600">
                {/* Revealed Attributes */}
                {Object.entries(
                  singlePresentation.by_format?.pres?.indy?.requested_proof
                    ?.revealed_attrs || {}
                ).map(([key, value], id) => (
                  <li key={`revealed-${id}`}>
                    <strong>
                      {
                        singlePresentation.by_format?.pres_request?.indy
                          ?.requested_attributes[key]?.name
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
                ).map(([key], id) => (
                  <li key={`unrevealed-${id}`}>
                    <strong>
                      {
                        singlePresentation.by_format?.pres_request?.indy
                          ?.requested_attributes[key]?.name
                      }
                      :
                    </strong>{" "}
                    Unrevealed
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
                {singlePresentation.by_format?.pres?.indy?.identifiers?.map(
                  (identifier, idIndex) => (
                    <li key={`identifier-${idIndex}`}>
                      <strong>Schema ID:</strong> {identifier.schema_id} <br />
                      <strong>Credential ID:</strong> {identifier.cred_def_id}
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Validate Button */}
            <button
              onClick={handleValidate}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition"
            >
              Validate
            </button>
          </div>
        )}
    </div>
  );
};

export default ValidateProofPage;
