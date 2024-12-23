"use client";

import React, { useEffect, useState } from "react";
import useStore from "../store/useStore";

const ProofRequestPage = () => {
  // State for managing user selections
  const [selectedProofRequest, setSelectedProofRequest] = useState("");
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [credId, setCredId] = useState("");
  const [revealed, setRevealed] = useState(null);

  const { fetchProofRequest, proofRequest, RequestedCred, fetchRequestedCred } =
    useStore();

  useEffect(() => {
    fetchProofRequest();
  }, []);

  console.log(proofRequest);
  console.log("selectedAttributes is ", selectedProofRequest);
  console.log("RequestedCred is ", RequestedCred);
  // Define available proof requests

  // Define requested attributes

  // Handle proof request selection change
  const handleProofRequestChange = (e) => {
    setSelectedProofRequest(e.target.value);
    fetchRequestedCred(e.target.value);
  };

  // Handle checkbox change for requested attributes
  const handleAttributeChange = (e) => {
    const { id, checked } = e.target;
    setSelectedAttributes((prevAttributes) => ({
      ...prevAttributes,
      [id]: checked,
    }));
  };

  // Handle credId input change
  const handleCredIdChange = (e) => {
    setCredId(e.target.value);
  };

  // Handle radio button change for revealed option
  const handleRevealedChange = (e) => {
    setRevealed(e.target.value === "true");
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const proofRequestData = {
      selectedProofRequest,
      selectedAttributes,
      credId,
      revealed,
    };

    console.log("Proof Request Data:", proofRequestData);
    // You can now send this data to your server or handle it further.
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-6">PROOF REQUEST</h1>

        <form onSubmit={handleSubmit}>
          {/* Proof Request Dropdown */}
          <div className="mb-4">
            <label htmlFor="proofRequest" className="block text-sm font-medium">
              Select Proof Request:
            </label>
            <select
              id="proofRequest"
              value={selectedProofRequest}
              onChange={handleProofRequestChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
              required
            >
              <option value="">
                {" "}
                {proofRequest.length > 0
                  ? "Select Proof Request"
                  : "No Proof Request Available"}
              </option>
              {proofRequest &&
                proofRequest.length > 0 &&
                proofRequest.map((proofRequest, id) => (
                  <option key={id} value={proofRequest.pres_ex_id}>
                    {proofRequest.pres_ex_id}
                  </option>
                ))}
            </select>
          </div>

          {/* Requested Attributes Checkboxes */}
          {proofRequest && proofRequest.length > 0 ? (
            <div className="mb-4">
              <label className="block text-sm font-medium">
                Requested Attributes:
              </label>
              <div className="mt-2">
                {Object.entries(
                  proofRequest[0]?.by_format?.pres_request?.indy
                    ?.requested_attributes || {}
                ).map(([key, value]) => (
                  <div key={key} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={key}
                      checked={selectedAttributes[key] || false}
                      onChange={(e) => {
                        const { id, checked } = e.target;
                        setSelectedAttributes((prevAttributes) => ({
                          ...prevAttributes,
                          [id]: checked,
                        }));
                      }}
                      className="mr-2 bg-white"
                    />
                    <label htmlFor={key}>{value.name}</label>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            ""
          )}
          {/* Credential ID Input */}
          {proofRequest && proofRequest.length > 0 && (
            <div className="mb-4">
              <label htmlFor="credId" className="block text-sm font-medium">
                Credential ID:
              </label>
              <input
                type="text"
                id="credId"
                value={credId}
                onChange={handleCredIdChange}
                className="w-full px-3 py-2 mt-1 border bg-white border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          )}

          {/* Revealed Radio Button */}
          {proofRequest && proofRequest.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium">Revealed:</label>
              <div className="mt-2 flex items-center">
                <input
                  type="radio"
                  id="revealedTrue"
                  name="revealed"
                  value="true"
                  checked={revealed === true}
                  onChange={handleRevealedChange}
                  className="mr-2"
                />
                <label htmlFor="revealedTrue" className="mr-4">
                  True
                </label>
                <input
                  type="radio"
                  id="revealedFalse"
                  name="revealed"
                  value="false"
                  checked={revealed === false}
                  onChange={handleRevealedChange}
                  className="mr-2"
                />
                <label htmlFor="revealedFalse">False</label>
              </div>
            </div>
          )}
          {/* Send Proof Button */}
          <div className="mt-6 text-center">
            <button
              type="submit"
              className={`px-6 py-2 ${
                proofRequest > 0
                  ? "bg-blue-600 hover:bg-blue-500"
                  : "bg-slate-500 hover:bg-slate-400"
              } text-white rounded-md shadow-md`}
              disabled={proofRequest.length > 0 ? false : true}
            >
              Send Proof
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProofRequestPage;
