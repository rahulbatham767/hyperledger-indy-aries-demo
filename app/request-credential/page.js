"use client";
import { useState } from "react";
import { getValueBeforeColon, ProposalforCredential } from "../utils/helper";
import useStore from "../store/useStore";

export default function CredentialRequest() {
  const [attributes, setAttributes] = useState([{ name: "", value: "" }]);
  // const [ownerships, setOwnerships] = useState([{ type: "", proof: "" }]);

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
  } = useStore();

  const handleAddAttribute = () => {
    setAttributes([...attributes, { name: "", value: "" }]);
  };
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    fetchCredRequest(e.target.value);
    console.log(Credential_state);
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
    return attributes.every(
      (attr) => attr.name.trim() !== "" && attr.value.trim() !== ""
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
      console.log("Requesting credentials for:", attributes);
      credentialProposal(formData);
    } else {
      alert("Please fill in all fields before submitting.");
    }
  };

  return (
    <div className="flex flex-wrap">
      <div className="p-8 mx-auto">
        <h1 className="text-2xl font-bold mb-4">Request Credentials</h1>

        {/* Relationship Field */}
        <div className="mb-4">
          <label className="block text-xl font-medium mb-2">
            Relationship:
          </label>
          <select
            value={selectedConnectionId}
            onChange={(e) => setSelectedConnectionId(e.target.value)}
            className="w-full p-2 border border-gray-300 bg-white rounded"
          >
            <option value="">Select Relationship</option>
            {Active.map((active, i) => (
              <option
                key={i}
                value={active.their_label + ":" + active.connection_id}
              >
                {active.their_label}:{active.their_did}
              </option>
            ))}
          </select>
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          Requesting Credential
        </h2>
        {attributes.map((attr, index) => (
          <div key={index} className="flex gap-4 items-center mb-4">
            <input
              type="text"
              placeholder="Enter attribute name"
              value={attr.name}
              onChange={(e) =>
                handleAttributeChange(index, "name", e.target.value)
              }
              className="input bg-white shadow w-full"
            />
            <input
              type="text"
              placeholder="Enter attribute value"
              value={attr.value}
              onChange={(e) =>
                handleAttributeChange(index, "value", e.target.value)
              }
              className="input bg-white shadow w-full"
            />
            <button
              onClick={() => handleRemoveAttribute(index)}
              className="btn btn-error"
            >
              -
            </button>
          </div>
        ))}

        <button onClick={handleAddAttribute} className="btn btn-primary mb-4">
          + Add Attribute
        </button>

        <button
          onClick={handleSubmit}
          className={`btn w-full text-lg ${
            isFormValid() ? "btn-success" : "bg-gray-300 cursor-not-allowed"
          }`}
          disabled={!isFormValid()}
          style={{ color: "black" }}
        >
          Send Request
        </button>
      </div>
      <div className="p-8 mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">
          Credential Request
        </h1>

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
              <option value="">Select Credential Status</option>
              <option value="proposal-sent">Credential Request</option>
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
                Select Credential Request:
              </label>
              <select
                id="proofRequest"
                value={selectedProofRequest}
                onChange={handleCredRequestChange}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                required
              >
                <option value="">
                  {Credential_state?.length > 0
                    ? "Select Credential Request"
                    : "No Credential Request Available"}
                </option>
                {Credential_state &&
                  Credential_state.length > 0 &&
                  Credential_state.map(({ cred_ex_record }, id) => (
                    <option key={id} value={cred_ex_record.pres_ex_id}>
                      {cred_ex_record.cred_ex_id}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Pending request */}

          {selectedStatus !== "" &&
            selectedProofRequest !== "" &&
            SingleCredential && (
              <div className="mt-4 p-4 border border-gray-300 rounded-md bg-gray-50">
                <h3 className="text-lg font-semibold">
                  Pending Request Details
                </h3>

                <div
                  key={SingleCredential?.cred_ex_record?.pres_ex_id}
                  className="mt-2"
                >
                  <p>
                    <strong>Credential Exchange ID:</strong>{" "}
                    {SingleCredential?.cred_ex_record?.cred_ex_id}
                  </p>
                  <p>
                    <strong>Presentation Exchange ID:</strong>{" "}
                    {SingleCredential?.cred_ex_record?.pres_ex_id}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {/* {SingleCredential.cred_ex_record.state} */}
                    Pending
                  </p>
                  <div className="mt-4">
                    <h4 className="text-md font-semibold">
                      🗒️ Requested Attributes:
                    </h4>
                    {SingleCredential?.cred_ex_record?.cred_proposal?.credential_preview.attributes.map(
                      (attr, index) => (
                        <p key={index} className="text-gray-700">
                          <strong>{attr.name}:</strong> {attr.value}
                        </p>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
        </form>
      </div>
    </div>
  );
}
