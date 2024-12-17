"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useStore from "../store/useStore";

const ProofRequestPage = () => {
  const { fetchProofRequests, proofRequests, loading, error } = useStore(); // Get Zustand store data
  const [formData, setFormData] = useState({});
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Fetch proof requests when the component mounts
  useEffect(() => {
    fetchProofRequests();
  }, [fetchProofRequests]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      toast.error("Please provide all the required information.");
      return;
    }

    // Assuming that you need to submit the proof to the verifier
    // Here you will call the appropriate API endpoint to send the proof
    // For now, we will just show a success notification
    toast.success("Proof submitted successfully!");

    // Reset form after successful submission
    setFormData({});
  };

  return (
    <div className="container">
      <h2 className="text-xl font-semibold">Proof Requests</h2>

      {loading && <div>Loading proof requests...</div>}

      {error && <div className="text-red-500">Error: {error}</div>}

      {/* If proof requests exist */}
      {proofRequests?.length > 0 ? (
        <div>
          <h3>Select a Proof Request</h3>
          <ul className="space-y-4">
            {proofRequests.map((request, index) => (
              <li
                key={index}
                className="cursor-pointer"
                onClick={() => setSelectedRequest(request)}
              >
                <div className="border p-4 rounded">
                  <h4>{request.name}</h4>
                  <p>{request.verifier}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* Display the selected proof request and the form */}
          {selectedRequest && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold">
                Verify Information for {selectedRequest.name}
              </h3>
              <form onSubmit={handleSubmit}>
                {selectedRequest.attributes.map((attr, index) => (
                  <div key={index} className="mt-4">
                    <label htmlFor={attr.name} className="block">
                      {attr.name}:
                    </label>
                    <input
                      type="text"
                      id={attr.name}
                      name={attr.name}
                      value={formData[attr.name] || ""}
                      onChange={handleChange}
                      className="border p-2 rounded mt-2 w-full"
                      required
                    />
                  </div>
                ))}

                <button
                  type="submit"
                  className="mt-6 bg-blue-500 text-white py-2 px-4 rounded"
                >
                  Submit Proof
                </button>
              </form>
            </div>
          )}
        </div>
      ) : (
        <div>No proof requests available.</div>
      )}
    </div>
  );
};

export default ProofRequestPage;
