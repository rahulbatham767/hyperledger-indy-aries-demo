"use client";
import { useState } from "react";
import { getValueBeforeColon, ProposalforCredential } from "../utils/helper";
import useStore from "../store/useStore";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Send, Loader2 } from "lucide-react";

export default function CredentialRequest() {
  const [attributes, setAttributes] = useState([{ name: "", value: "" }]);
  const [selectedConnectionId, setSelectedConnectionId] = useState("");
  const [selectedProofRequest, setSelectedProofRequest] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const {
    Active,
    credentialProposal,
    Credential_state,
    fetchCredRequest,
    fetchRequestedCredential,
    SingleCredential,
    loading,
  } = useStore();

  const handleAddAttribute = () => {
    setAttributes([...attributes, { name: "", value: "" }]);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    fetchCredRequest(e.target.value);
  };

  const handleRemoveAttribute = (index) => {
    const updatedAttributes = attributes.filter((_, i) => i !== index);
    setAttributes(updatedAttributes);
  };

  const handleAttributeChange = (index, field, value) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index][field] = value;
    setAttributes(updatedAttributes);
  };

  const isFormValid = () => {
    return (
      attributes.every(
        (attr) => attr.name.trim() !== "" && attr.value.trim() !== ""
      ) && selectedConnectionId
    );
  };

  const handleCredRequestChange = (e) => {
    setSelectedProofRequest(e.target.value);
    fetchRequestedCredential(e.target.value);
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      const requestor = getValueBeforeColon(selectedConnectionId);
      const formData = {
        attributes,
        connection_id: selectedConnectionId.split(":")[1].trim(),
        Requestor: requestor,
        issuer_did: Active?.my_did,
      };
      credentialProposal(formData);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Request Credentials */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Send className="h-6 w-6 text-blue-600" />
            Request Credentials
          </h1>

          {/* Relationship Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Relationship:
            </label>
            <select
              value={selectedConnectionId}
              onChange={(e) => setSelectedConnectionId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Relationship</option>
              {Active.map((active, i) => (
                <option
                  key={i}
                  value={active.their_label + ":" + active.connection_id}
                >
                  {active.their_label} ({active.their_did})
                </option>
              ))}
            </select>
          </div>

          <h2 className="text-xl font-semibold mb-4">Credential Attributes</h2>

          {attributes.map((attr, index) => (
            <div key={index} className="flex gap-4 items-center mb-4">
              <input
                type="text"
                placeholder="Attribute name"
                value={attr.name}
                onChange={(e) =>
                  handleAttributeChange(index, "name", e.target.value)
                }
                className="flex-1 p-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Attribute value"
                value={attr.value}
                onChange={(e) =>
                  handleAttributeChange(index, "value", e.target.value)
                }
                className="flex-1 p-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Button
                onClick={() => handleRemoveAttribute(index)}
                variant="outline"
                size="icon"
                className="h-10 w-10"
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <div className="flex gap-4 mb-6">
            <Button
              onClick={handleAddAttribute}
              variant="outline"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Attribute
            </Button>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!isFormValid() || loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Sending...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Send Request
              </div>
            )}
          </Button>
        </div>

        {/* Right Column - Credential Request Status */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Credential Request Status
          </h1>

          <div className="mb-6">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Filter by Status:
            </label>
            <select
              id="status"
              className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedStatus}
              onChange={handleStatusChange}
            >
              <option value="">Select Credential Status</option>
              <option value="proposal-sent">Credential Request</option>
              <option value="abandoned">Abandoned</option>
            </select>
          </div>

          {selectedStatus && (
            <div className="mb-6">
              <label
                htmlFor="proofRequest"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select Credential Request:
              </label>
              <select
                id="proofRequest"
                value={selectedProofRequest}
                onChange={handleCredRequestChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!Credential_state?.length}
              >
                <option value="">
                  {Credential_state?.length
                    ? "Select request"
                    : "No requests available"}
                </option>
                {Credential_state?.map(({ cred_ex_record }, id) => (
                  <option key={id} value={cred_ex_record.pres_ex_id}>
                    {cred_ex_record.cred_ex_id}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedStatus && selectedProofRequest && SingleCredential && (
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="text-lg font-semibold mb-3">Request Details</h3>

              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Exchange ID:</span>{" "}
                  {SingleCredential?.cred_ex_record?.cred_ex_id}
                </p>
                <p>
                  <span className="font-medium">Status:</span> Pending
                </p>

                <div className="mt-4">
                  <h4 className="font-medium mb-2">Requested Attributes:</h4>
                  <ul className="space-y-1">
                    {SingleCredential?.cred_ex_record?.cred_proposal?.credential_preview.attributes.map(
                      (attr, index) => (
                        <li key={index} className="flex gap-2">
                          <span className="font-medium capitalize">
                            {attr.name}:
                          </span>
                          <span>{attr.value}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
