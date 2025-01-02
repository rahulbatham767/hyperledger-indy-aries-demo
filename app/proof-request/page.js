"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useStore from "../store/useStore";
import verifierStore from "../store/verifierStore";
import { mapAttributes, ProofRequests } from "../utils/helper";

const ProofRequestPage = () => {
  const {
    loading,
    sendProofRequest,
    error: Error,
    fetchConnection,
    Active,
  } = useStore(); // Zustand store data
  const [selectedConnectionId, setSelectedConnectionId] = useState("");
  const [requestedAttributes, setRequestedAttributes] = useState([]);
  const [requestedPredicates, setRequestedPredicates] = useState("");
  const [newAttribute, setNewAttribute] = useState("");

  // Fetch connections when the component mounts
  useEffect(() => {
    fetchConnection();
  }, [fetchConnection]);

  // Add new attribute to the list
  const handleAddAttribute = () => {
    if (!newAttribute.trim()) {
      toast.error("Attribute cannot be empty.");
      return;
    }
    setRequestedAttributes([...requestedAttributes, newAttribute.trim()]);
    setNewAttribute("");
  };

  // Remove attribute from the list
  const handleRemoveAttribute = (index) => {
    const updatedAttributes = requestedAttributes.filter((_, i) => i !== index);
    setRequestedAttributes(updatedAttributes);
  };

  // Handle proof request submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    let mapAttribute, predicates;
    mapAttribute = mapAttributes(requestedAttributes);
    if (!selectedConnectionId) {
      toast.error("Please select a connection.");
      return;
    }

    console.log("map Attribute ", mapAttribute);
    const selectedConnection = Active.find(
      (conn) => conn.connection_id === selectedConnectionId
    );

    if (!selectedConnection) {
      toast.error("Connection not found.");
      return;
    }

    const proofRequestData = {
      connection_id: selectedConnection.connection_id,
      requested_attributes: mapAttribute,
      requested_predicates: predicates || {},
    };

    console.log("Proof Request Data:", proofRequestData);

    const proofTemplate = ProofRequests(proofRequestData);
    console.log("Proof Template:", proofTemplate);

    sendProofRequest(proofTemplate);
    setRequestedAttributes([]);
    setRequestedPredicates("");
    setSelectedConnectionId("");
  };

  return (
    <div className="container mx-auto p-6 w-[30rem] shadow-md mt-3 rounded-lg">
      <h2 className="text-xl font-semibold">Send Proof Request</h2>

      {loading && <div>Loading connections...</div>}
      {Error && <div className="text-red-500">Error: {Error}</div>}

      {/* If connections exist */}
      {Active.length > 0 ? (
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label className="block text-lg font-semibold">
              Select Connection:
            </label>
            <select
              value={selectedConnectionId}
              onChange={(e) => setSelectedConnectionId(e.target.value)}
              className="w-full p-2 border rounded bg-white"
              required
            >
              <option value="">-- Select a connection --</option>
              {Active.map((connection) => (
                <option
                  key={connection.connection_id}
                  value={connection.connection_id}
                >
                  {connection.their_label} ({connection.connection_id})
                </option>
              ))}
            </select>
          </div>

          {/* <div className="mb-4">
            <label className="block text-lg font-semibold">
              Requested Attributes (Array):
            </label>
            <textarea
              value={requestedAttributes}
              onChange={(e) => setRequestedAttributes(e.target.value)}
              placeholder='["name","degree"]'
              className="w-full p-2 shadow-md rounded-md mt-2 border-cyan-200 focus-visible:outline-none h-32 bg-white"
              required
            ></textarea>
          </div> */}

          <div className="mb-4">
            <label className="block text-lg font-semibold">
              Requested Attributes:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newAttribute}
                onChange={(e) => setNewAttribute(e.target.value)}
                placeholder="Enter an attribute"
                className="w-full p-2 border rounded bg-white"
              />
              <button
                type="button"
                onClick={handleAddAttribute}
                className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
              >
                Add
              </button>
            </div>
            <ul className="mt-2">
              {requestedAttributes.map((attribute, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="flex-1">{attribute}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAttribute(index)}
                    className="bg-red-500 mt-2 text-white py-1 px-2 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {/* <div className="mb-4">
            <label className="block text-lg font-semibold">
              Self Attributes (JSON):
            </label>
            <textarea
              value={selfattested}
              onChange={(e) => setSelfAttested(e.target.value)}
              placeholder='{"predicate1_referent": {"name": "age", "p_type": ">=", "p_value": 18}}'
              className="w-full p-2 shadow-md mt-2 rounded-md border-cyan-200 border h-32 bg-white focus-visible:outline-none"
              required
            ></textarea>
          </div> */}

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Send Proof Request
          </button>
        </form>
      ) : (
        <div>No connections available.</div>
      )}
    </div>
  );
};

export default ProofRequestPage;
