"use client";
import React, { useState, useMemo } from "react";
import useStore from "../store/useStore";
import { PresentationTemplate } from "../utils/helper";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, Send, Loader2 } from "lucide-react";

const ProofRequestPage = () => {
  const [selectedProofRequest, setSelectedProofRequest] = useState("");
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [credId, setCredId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const {
    fetchProofRequest,
    ProofRequests,
    RequestedCreds,
    fetchRequestedCred,
    sendPresentation,
    loading
  } = useStore();

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    fetchProofRequest(e.target.value);
  };

  const handleProofRequestChange = (e) => {
    setSelectedProofRequest(e.target.value);
    fetchRequestedCred(e.target.value);
  };

  const handleCredIdChange = (e) => {
    setCredId(e.target.value);
  };

  const findProof = useMemo(() => {
    const proof = ProofRequests?.find(
      (item) => item.pres_ex_id === selectedProofRequest
    );
    
    if (proof) {
      const requestedAttributes =
        proof.by_format?.pres_request?.indy?.requested_attributes;
      if (requestedAttributes) {
        return Object.values(requestedAttributes).map((attr) => attr.name);
      }
    }
    return null;
  }, [ProofRequests, selectedProofRequest]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const proofRequestData = {
      RequestedCred: RequestedCreds,
      selectedAttributes,
    };

    const presentation = PresentationTemplate(proofRequestData);
    sendPresentation(presentation, selectedProofRequest).then(() => {
      setSelectedProofRequest("");
      setSelectedAttributes({});
      setSelectedStatus("");
      setCredId("");
    });
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="w-[30rem] bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <h1 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Send className="h-6 w-6" />
            Proof Request
          </h1>
          <p className="text-center text-blue-100 mt-1 text-sm">
            Select and respond to proof requests
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Status Selection */}
          <div className="space-y-2">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Select Status
            </label>
            <div className="relative">
              <select
                id="status"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={selectedStatus}
                onChange={handleStatusChange}
              >
                <option value="">Select proof status</option>
                <option value="request-received">Proof Request</option>
                <option value="abandoned">Abandoned</option>
              </select>
              <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Proof Request Dropdown */}
          {selectedStatus && (
            <div className="space-y-2">
              <label htmlFor="proofRequest" className="block text-sm font-medium text-gray-700">
                Select Proof Request
              </label>
              <div className="relative">
                <select
                  id="proofRequest"
                  value={selectedProofRequest}
                  onChange={handleProofRequestChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                  disabled={!ProofRequests?.length}
                >
                  <option value="">
                    {ProofRequests?.length ? "Select proof request" : "No requests available"}
                  </option>
                  {ProofRequests?.map((proofRequest) => (
                    <option key={proofRequest.pres_ex_id} value={proofRequest.pres_ex_id}>
                      {proofRequest.by_format?.pres_request?.indy?.name || "Unnamed Request"}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          )}

          {/* Requested Attributes Checkboxes */}
          {selectedProofRequest && findProof?.length > 0 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Requested Attributes
              </label>
              <div className="space-y-2">
                {findProof.map((item, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <input
                      type="checkbox"
                      id={`attr${index}_referent`}
                      checked={selectedAttributes[`attr${index}_referent`] || false}
                      onChange={(e) => {
                        setSelectedAttributes(prev => ({
                          ...prev,
                          [`attr${index}_referent`]: e.target.checked
                        }));
                      }}
                      className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor={`attr${index}_referent`} className="ml-3 block text-sm text-gray-700 capitalize">
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Credential ID Input */}
          {selectedProofRequest && (
            <div className="space-y-2">
              <label htmlFor="credId" className="block text-sm font-medium text-gray-700">
                Referent ID
              </label>
              <input
                type="text"
                id="credId"
                value={credId}
                onChange={handleCredIdChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
                placeholder="Enter credential reference ID"
              />
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all"
              disabled={loading || !findProof?.length}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sending...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  Send Proof Response
                </div>
              )}
            </Button>
          </div>

          {selectedStatus === "abandoned" && findProof?.length > 0 && (
            <div className="text-center text-sm text-red-500">
              Requested attributes are not present
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProofRequestPage;