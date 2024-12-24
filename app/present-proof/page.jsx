"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import useStore from "../store/useStore";
import { PresentationTemplate } from "../utils/helper";

const ProofRequestPage = () => {
  // State for managing user selections
  const [selectedProofRequest, setSelectedProofRequest] = useState("");
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [credId, setCredId] = useState("");
  const [revealed, setRevealed] = useState(null);

  const {
    fetchProofRequest,
    proofRequest,
    RequestedCred,
    fetchRequestedCred,
    sendPresentation,
  } = useStore();

  useEffect(() => {
    fetchProofRequest();
  }, []);

  console.log(proofRequest);
  console.log("selectedAttributes is ", selectedProofRequest);
  console.log("RequestedCred is ", RequestedCred);
  console.log("Selected Attribute is ", selectedAttributes);
  // Define available proof requests

  // Define requested attributes

  // Handle proof request selection change
  const handleProofRequestChange = (e) => {
    setSelectedProofRequest(e.target.value);
    fetchRequestedCred(e.target.value);
  };

  // Handle checkbox change for requested attributes

  const findProof = useMemo(() => {
    const proof = proofRequest.find(
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
  }, [proofRequest, selectedProofRequest]);

  console.log("find proof is ", findProof);

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
      RequestedCred,
      selectedAttributes,
    };

    console.log("Proof Request Data:", proofRequestData);
    const presentation = PresentationTemplate(proofRequestData);
    console.log("presentation is ", presentation);
    sendPresentation(presentation, selectedProofRequest);
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
            <p>No proof request found</p>
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

          <small className="text-gray-600 font-medium">
            ✔ Check the Requested Attributes that you want to Reveal
          </small>
          {/* Send Proof Button */}
          <div className="mt-6 text-center">
            <button
              type="submit"
              className={`px-6 py-2 ${
                proofRequest > 0
                  ? "bg-blue-600 hover:bg-blue-500"
                  : "bg-slate-500 hover:bg-slate-400"
              } text-white rounded-md shadow-md`}
              disabled={!proofRequest || proofRequest.length === 0}
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
