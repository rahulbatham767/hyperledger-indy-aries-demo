"use client";
import React, { useEffect, useState } from "react";
import useStore from "../store/useStore";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { CheckCircle, ChevronDown, Loader2 } from "lucide-react";

const ValidateProofPage = () => {
  const {
    fetchProofRequest,
    ReceieveProof,
    verifyPresentation,
    fetchSinglePresentation,
    ProofRequests,
    singlePresentation,
    loading,
  } = useStore();

  const [selectedProofIndex, setSelectedProofIndex] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isExpanded, setIsExpanded] = useState({
    requestedAttributes: true,
    attributes: true,
    identifiers: true,
  });

  const handleSelectChange = (event) => {
    const selectedIndex = event.target.value;
    setSelectedProofIndex(selectedIndex);
    if (selectedIndex) fetchSinglePresentation(selectedIndex);
  };

  const handleStatusChange = (e) => {
    const status = e.target.value;
    setSelectedStatus(status);
    if (status) fetchProofRequest(status);
  };

  const handleValidate = async () => {
    if (singlePresentation?.pres_ex_id) {
      try {
        await verifyPresentation(singlePresentation.pres_ex_id);
        toast.success("Proof validated successfully!");
        setSelectedStatus("");
        setSelectedProofIndex(null);
      } catch (error) {
        toast.error("Failed to validate proof");
      }
    } else {
      toast.error("Proof ID is not available.");
    }
  };

  const toggleSection = (section) => {
    setIsExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <CheckCircle className="h-8 w-8 text-blue-600" />
            Validate Proof
          </h1>
          <p className="text-gray-600">
            Verify and validate received proofs from connections
          </p>
        </div>

        {/* Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Status Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Filter by Status
            </label>
            <div className="relative">
              <select
                id="status"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={selectedStatus}
                onChange={handleStatusChange}
              >
                <option value="">Select a validation state</option>
                <option value="request-sent">Requested Proof</option>
                <option value="presentation-received">Received Proof</option>
                <option value="abandoned">Abandoned</option>
              </select>
              <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Proof Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md">
            <label
              htmlFor="proofSelector"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {ReceieveProof ? "Select Presentation" : "No Proofs Available"}
            </label>
            <div className="relative">
              <select
                id="proofSelector"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={selectedProofIndex}
                onChange={handleSelectChange}
                disabled={!ReceieveProof}
              >
                <option value="">-- Select Presentation --</option>
                {ProofRequests?.map((proof, index) => (
                  <option key={index} value={proof.pres_ex_id}>
                    {proof.pres_ex_id.slice(0, 8)}...
                    {proof.pres_ex_id.slice(-4)}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
            {!selectedProofIndex && (
              <p className="text-sm text-gray-500 mt-2">
                {ReceieveProof
                  ? "Select a presentation to view details"
                  : "Fetch proofs by selecting a status first"}
              </p>
            )}
          </div>
        </div>

        {/* Presentation Details */}
        {selectedStatus && selectedProofIndex && singlePresentation && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 transition-all duration-300">
            {/* Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Presentation Details
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                ID: {singlePresentation.pres_ex_id}
              </p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Requested Attributes */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection("requestedAttributes")}
                  className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <h3 className="font-medium text-gray-800">
                    Requested Attributes
                  </h3>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-500 transition-transform ${
                      isExpanded.requestedAttributes ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isExpanded.requestedAttributes && (
                  <div className="p-4 bg-white">
                    <ul className="space-y-2">
                      {Object.entries(
                        singlePresentation.by_format?.pres_request?.indy
                          ?.requested_attributes || {}
                      ).map(([key, attr], attrIndex) => (
                        <li
                          key={`${key}-${attrIndex}`}
                          className="p-3 bg-gray-50 rounded-md"
                        >
                          <span className="font-medium capitalize text-gray-700">
                            {attr.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Attributes */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection("attributes")}
                  className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <h3 className="font-medium text-gray-800">Attributes</h3>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-500 transition-transform ${
                      isExpanded.attributes ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isExpanded.attributes && (
                  <div className="p-4 bg-white space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">
                        Revealed Attributes
                      </h4>
                      <ul className="space-y-2">
                        {Object.entries(
                          singlePresentation.by_format?.pres?.indy
                            ?.requested_proof?.revealed_attrs || {}
                        ).map(([key, value], id) => (
                          <li
                            key={`revealed-${id}`}
                            className="p-3 bg-blue-50 rounded-md"
                          >
                            <div className="flex justify-between">
                              <span className="font-medium capitalize">
                                {
                                  singlePresentation.by_format?.pres_request
                                    ?.indy?.requested_attributes[key]?.name
                                }
                              </span>
                              <span className="text-blue-600">{value.raw}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">
                        Unrevealed Attributes
                      </h4>
                      <ul className="space-y-2">
                        {Object.entries(
                          singlePresentation.by_format?.pres?.indy
                            ?.requested_proof?.unrevealed_attrs || {}
                        ).map(([key], id) => (
                          <li
                            key={`unrevealed-${id}`}
                            className="p-3 bg-gray-50 rounded-md"
                          >
                            <span className="font-medium capitalize">
                              {
                                singlePresentation.by_format?.pres_request?.indy
                                  ?.requested_attributes[key]?.name
                              }
                            </span>
                            <span className="ml-2 text-gray-500">
                              (Not revealed)
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Identifiers */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection("identifiers")}
                  className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <h3 className="font-medium text-gray-800">Identifiers</h3>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-500 transition-transform ${
                      isExpanded.identifiers ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isExpanded.identifiers && (
                  <div className="p-4 bg-white">
                    <ul className="space-y-3">
                      {singlePresentation.by_format?.pres?.indy?.identifiers?.map(
                        (identifier, idIndex) => (
                          <li
                            key={`identifier-${idIndex}`}
                            className="p-3 bg-gray-50 rounded-md"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center">
                                <span className="font-medium text-gray-700 mr-2">
                                  Schema ID:
                                </span>
                                <span className="text-gray-600 truncate">
                                  {identifier.schema_id}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <span className="font-medium text-gray-700 mr-2">
                                  Credential ID:
                                </span>
                                <span className="text-gray-600 truncate">
                                  {identifier.cred_def_id}
                                </span>
                              </div>
                            </div>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Validate Button */}
              <div className="pt-4">
                <Button
                  onClick={handleValidate}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md transition-all"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Validating...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Validate Proof
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ValidateProofPage;
