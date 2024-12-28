"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import useStore from "../store/useStore";
import { PresentationTemplate } from "../utils/helper";

const ProofRequestPage = () => {
  // State for managing user selections
  const [selectedProofRequest, setSelectedProofRequest] = useState("");
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [credId, setCredId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const {
    fetchProofRequest,
    ProofRequests,
    RequestedCred,
    fetchRequestedCred,
    sendPresentation,
  } = useStore();

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    fetchProofRequest(e.target.value);
  };

  // Handle proof request selection change
  const handleProofRequestChange = (e) => {
    setSelectedProofRequest(e.target.value);
    fetchRequestedCred(e.target.value);
  };

  // Handle checkbox change for requested attributes

  const findProof = useMemo(() => {
    const proof = ProofRequests?.find(
      (item) => item.pres_ex_id === selectedProofRequest
    );
    if (proof) {
      const requestedAttributes =
        proof.by_format?.pres_request?.indy?.requested_attributes;
      if (requestedAttributes) {
        console.log(requestedAttributes);
        return Object.values(requestedAttributes).map((attr) => {
          console.log("attr is", attr.name);
          return attr.name; // Explicitly return the attribute name here
        });
      }
    }
    return null;
  }, [ProofRequests, selectedProofRequest]);

  // Handle credId input change
  const handleCredIdChange = (e) => {
    setCredId(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const proofRequestData = {
      RequestedCred,
      selectedAttributes,
    };

    const presentation = PresentationTemplate(proofRequestData);
    console.log("presentation is ", presentation, selectedProofRequest);

    sendPresentation(presentation, selectedProofRequest).then(() => {
      {
        setSelectedProofRequest("");
        setSelectedAttributes({});
        setSelectedStatus("");
        setCredId("");
      }
    });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-6">PROOF REQUEST</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            {/* Status Selection */}
            <label htmlFor="status" className="block text-sm font-medium">
              Select Status:
            </label>
            <select
              id="status"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
              value={selectedStatus}
              onChange={handleStatusChange}
            >
              <option value="">Select Proof Status</option>
              <option value="request-received">Proof Request</option>
              <option value="abandoned">abandoned</option>
            </select>
          </div>

          {/* Proof Request Dropdown */}
          {selectedStatus && (
            <div className="mb-4">
              <label
                htmlFor="proofRequest"
                className="block text-sm font-medium"
              >
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
                  {ProofRequests?.length > 0
                    ? "Select Proof Request"
                    : "No Proof Request Available"}
                </option>
                {ProofRequests &&
                  ProofRequests.length > 0 &&
                  ProofRequests.map((proofRequest, id) => (
                    <option key={id} value={proofRequest.pres_ex_id}>
                      {proofRequest.pres_ex_id}
                    </option>
                  ))}
              </select>
            </div>
          )}
          {/* Requested Attributes Checkboxes */}
          {ProofRequests &&
          selectedStatus &&
          selectedProofRequest &&
          ProofRequests.length > 0 ? (
            <div className="mb-4">
              <label className="block text-sm font-medium">
                Requested Attributes:
              </label>
              <div className="mt-2">
                {findProof && findProof.length > 0 ? (
                  findProof.map((item, index) => (
                    <div key={index + 1} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={`attr${index + 1}_referent`} // Use a unique id for each checkbox
                        checked={
                          selectedAttributes[`attr${index + 1}_referent`] ||
                          false
                        } // Use the same unique id for state
                        onChange={(e) => {
                          const { id, checked } = e.target;
                          setSelectedAttributes((prevAttributes) => ({
                            ...prevAttributes,
                            [id]: checked, // Update state using the unique id
                          }));
                        }}
                        className="mr-2 bg-white"
                      />
                      <label htmlFor={`attr-${index}`}>{item}</label>{" "}
                      {/* Assuming `item` is an object with a `name` property */}
                    </div>
                  ))
                ) : (
                  <p>No attributes available</p>
                )}
              </div>
            </div>
          ) : (
            <p></p>
          )}

          {/* Credential ID Input */}
          {ProofRequests &&
            ProofRequests.length > 0 &&
            selectedProofRequest && (
              <div className="mb-4">
                <label htmlFor="credId" className="block text-sm font-medium">
                  Referent ID:
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

          <small className="text-gray-600 font-medium">
            {selectedStatus && ProofRequests && selectedProofRequest
              ? " ✔ Check the Requested Attributes that you want to Reveal"
              : ""}
          </small>
          {/* Send Proof Button */}
          <div className="mt-6 text-center">
            {selectedStatus === "abandoned" &&
            findProof &&
            findProof.length > 0 ? (
              <p>Requested Attriutes are not present</p>
            ) : (
              <button
                type="submit"
                className={`px-6 py-2 ${
                  findProof && findProof.length > 0
                    ? "bg-blue-600 hover:bg-blue-500"
                    : "bg-slate-500 hover:bg-slate-400"
                } text-white rounded-md shadow-md`}
                disabled={!findProof || findProof.length > 0 === 0}
              >
                Send Proof
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProofRequestPage;
