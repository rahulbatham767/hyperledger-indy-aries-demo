"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useStore from "../store/useStore";
import verifierStore from "../store/verifierStore";
import { mapAttributes, ProofRequests } from "../utils/helper";

const ProofRequestPage = () => {
  const { fetchConnection, connections, loading, error, sendProofRequest } =
    verifierStore(); // Zustand store data
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [requestedAttributes, setRequestedAttributes] = useState("");
  const [requestedPredicates, setRequestedPredicates] = useState("");

  // Fetch connections when the component mounts
  useEffect(() => {
    fetchConnection();
  }, [fetchConnection]);

  // Handle proof request submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("attributes are ", requestedAttributes);

    let mapAttribute;
    // console.log("attributes are ", mapAttribute);
    try {
      mapAttribute = mapAttributes(JSON.parse(requestedAttributes));
      console.log("mapAttributes are ", mapAttribute);
      if (!selectedConnection) {
        toast.error("Please select a connection.");
        return;
      }
    } catch (error) {
      toast.error("Invalid JSON format in requested attributes.");
      return;
    }

    const proofRequestData = {
      connection_id: selectedConnection.connection_id,
      requested_attributes: mapAttribute,
      requested_predicates: JSON.parse(requestedPredicates),
    };
    const proofTemplate = ProofRequests(proofRequestData);
    console.log("proofTemplate for ", proofTemplate);
    try {
      await sendProofRequest(proofTemplate);
      toast.success("Proof request sent successfully!");
      setRequestedAttributes("");
      setRequestedPredicates("");
    } catch (error) {
      toast.error("Failed to send proof request.");
    }
  };

  return (
    <div className="container mx-auto p-6 w-[30rem] shadow-md mt-3 rounded-lg">
      <h2 className="text-xl font-semibold">Send Proof Request</h2>

      {loading && <div>Loading connections...</div>}
      {error && <div className="text-red-500">Error: {error}</div>}

      {/* If connections exist */}
      {connections?.length > 0 ? (
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label className="block text-lg font-semibold">
              Select Connection:
            </label>
            <select
              value={selectedConnection?.connection_id || ""}
              onChange={(e) =>
                setSelectedConnection(
                  connections.find(
                    (conn) => conn.connection_id === e.target.value
                  )
                )
              }
              className="w-full p-2 border rounded bg-white"
              required
            >
              <option value="">-- Select a connection --</option>
              {connections.map((connection) => (
                <option
                  key={connection.connection_id}
                  value={connection.connection_id}
                >
                  {connection.their_label} ({connection.connection_id})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-lg font-semibold">
              Requested Attributes (JSON):
            </label>
            <textarea
              value={requestedAttributes}
              onChange={(e) => setRequestedAttributes(e.target.value)}
              placeholder='{"name","degree"}'
              className="w-full p-2 shadow-md rounded-md mt-2 border-cyan-200  focus-visible:outline-none h-32 bg-white"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-lg font-semibold">
              Requested Predicates (JSON):
            </label>
            <textarea
              value={requestedPredicates}
              onChange={(e) => setRequestedPredicates(e.target.value)}
              placeholder='{"predicate1_referent": {"name": "age", "p_type": ">=", "p_value": 18}}'
              className="w-full p-2 shadow-md mt-2 rounded-md border-cyan-200 border h-32 bg-white focus-visible:outline-none"
              required
            ></textarea>
          </div>

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
