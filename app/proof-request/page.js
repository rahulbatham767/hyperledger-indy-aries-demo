"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useStore from "../store/useStore";
import { mapAttributes, ProofRequests } from "../utils/helper";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Send } from "lucide-react";

const ProofRequestPage = () => {
  const {
    loading,
    sendProofRequest,
    error: Error,
    fetchConnection,
    Active,
  } = useStore();
  const [selectedConnectionId, setSelectedConnectionId] = useState("");
  const [requestedAttributes, setRequestedAttributes] = useState([]);
  const [newAttribute, setNewAttribute] = useState("");

  useEffect(() => {
    fetchConnection();
  }, [fetchConnection]);

  const handleAddAttribute = () => {
    if (!newAttribute.trim()) {
      toast.error("Attribute cannot be empty.");
      return;
    }
    if (requestedAttributes.includes(newAttribute.trim())) {
      toast.warning("Attribute already added.");
      return;
    }
    setRequestedAttributes([...requestedAttributes, newAttribute.trim()]);
    setNewAttribute("");
  };

  const handleRemoveAttribute = (index) => {
    const updatedAttributes = requestedAttributes.filter((_, i) => i !== index);
    setRequestedAttributes(updatedAttributes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedConnectionId) {
      toast.error("Please select a connection.");
      return;
    }

    const mapAttribute = mapAttributes(requestedAttributes);
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
      requested_predicates: {},
    };

    const proofTemplate = ProofRequests(proofRequestData);

    try {
      await sendProofRequest(proofTemplate);
      toast.success("Proof request sent successfully!");
      setRequestedAttributes([]);
      setSelectedConnectionId("");
    } catch (err) {
      toast.error("Failed to send proof request.");
    }
  };

  return (
    <div className="max-w-md w-[32rem] mx-auto p-6 bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Send className="h-6 w-6 text-blue-600" />
        Send Proof Request
      </h2>

      {loading && (
        <div className="flex items-center justify-center gap-2 text-gray-500">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          Loading connections...
        </div>
      )}

      {Error && (
        <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
          Error: {Error}
        </div>
      )}

      {Active.length > 0 ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Select Connection
            </label>
            <select
              value={selectedConnectionId}
              onChange={(e) => setSelectedConnectionId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              required
            >
              <option value="">-- Select a connection --</option>
              {Active.map((connection) => (
                <option
                  key={connection.connection_id}
                  value={connection.connection_id}
                  className="py-2"
                >
                  {connection.their_label ||
                    `Connection ${connection.connection_id.slice(0, 6)}`}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Requested Attributes
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newAttribute}
                onChange={(e) => setNewAttribute(e.target.value)}
                placeholder="Enter attribute name"
                className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  (e.preventDefault(), handleAddAttribute())
                }
              />
              <Button
                type="button"
                onClick={handleAddAttribute}
                variant="outline"
                className="p-3 hover:bg-blue-50"
              >
                <Plus className="h-5 w-5 text-blue-600" />
              </Button>
            </div>

            {requestedAttributes.length > 0 && (
              <ul className="mt-3 space-y-2">
                {requestedAttributes.map((attribute, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 transition-all duration-200 hover:bg-white hover:shadow-sm"
                  >
                    <span className="font-medium text-gray-700">
                      {attribute}
                    </span>
                    <Button
                      type="button"
                      onClick={() => handleRemoveAttribute(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md transition-all duration-300 hover:shadow-lg"
            disabled={
              loading ||
              !selectedConnectionId ||
              requestedAttributes.length === 0
            }
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Sending...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Send Proof Request
              </span>
            )}
          </Button>
        </form>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <div className="mx-auto w-16 h-16 mb-4 text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <p className="text-lg">No active connections available</p>
          <p className="mt-1 text-sm">Create or accept a connection first</p>
        </div>
      )}
    </div>
  );
};

export default ProofRequestPage;
