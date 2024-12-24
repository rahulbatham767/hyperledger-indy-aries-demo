"use client";
import useStore from "@/app/store/useStore";
import { parseSchemas } from "@/app/utils/helper";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Offer = () => {
  const [relationship, setRelationship] = useState("");
  const [credentialSchema, setCredentialSchema] = useState("");
  const [credentialDefinition, setCredentialDefinition] = useState("");
  const [attributes, setAttributes] = useState("");

  const {
    Active, // List of active relationships
    Defination, // List of credential definitions
    getCredentialdefination,
    getDefinationLedger,
    issueingCredential,
    SchemaRecord,
  } = useStore();

  const handleIssueCredential = async (e) => {
    e.preventDefault();

    if (
      !relationship ||
      !credentialSchema ||
      !credentialDefinition ||
      !attributes
    ) {
      toast.error("Please fill in all fields!", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    let parsedAttributes;
    try {
      parsedAttributes = JSON.parse(attributes);
      if (!Array.isArray(parsedAttributes)) throw new Error();
    } catch {
      toast.error(
        "Invalid JSON array format for attributes. Please try again.",
        {
          position: "top-right",
          autoClose: 5000,
        }
      );
      return;
    }

    const issuer_did = credentialSchema.split(":")[0]; // Extract issuer DID
    const formData = {
      connection_id: relationship,
      schema_id: credentialSchema,
      issuer_did: issuer_did,
      schema_issuer_did: issuer_did,
      cred_def_id: credentialDefinition,
      attributes: parsedAttributes,
    };

    console.log("Sending Data:", formData);
    issueingCredential(formData);

    // Reset form
    setRelationship("");
    setCredentialSchema("");
    setCredentialDefinition("");
    setAttributes("");
  };

  useEffect(() => {
    if (credentialSchema) {
      getDefinationLedger(credentialSchema);
    }
  }, [credentialSchema, getDefinationLedger]);
  useEffect(() => {
    getCredentialdefination();
  }, []);

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-3xl bg-white p-6">
        <h3 className="text-2xl font-bold text-center mb-6">
          Send Credential Offer
        </h3>
        <form onSubmit={handleIssueCredential}>
          {/* Relationship Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Relationship:
            </label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="w-full p-2 border border-gray-300 bg-white rounded"
            >
              <option value="">Select Relationship</option>
              {Active.map((active, i) => (
                <option key={i} value={active.connection_id}>
                  {active.alias}:{active.their_did}
                </option>
              ))}
            </select>
          </div>

          {/* Credential Schema Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Credential Schema:
            </label>
            <select
              value={credentialSchema}
              onChange={(e) => setCredentialSchema(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded bg-white"
            >
              <option value="">
                {SchemaRecord
                  ? "Select Credential Schema"
                  : "No Credential Schema Present"}
              </option>

              {SchemaRecord &&
                SchemaRecord.schema_ids.map((id, i) => (
                  <option key={i} value={id}>
                    {id}
                  </option>
                ))}
            </select>
          </div>

          {/* Credential Definition Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Credential Definition:
            </label>
            <select
              value={credentialDefinition}
              onChange={(e) => setCredentialDefinition(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded bg-white"
            >
              <option value="">Select Credential Definition</option>
              {Defination &&
                Defination.credential_definition_ids.length > 0 &&
                Defination.credential_definition_ids.map((cred, index) => (
                  <option key={index} value={cred}>
                    {cred}
                  </option>
                ))}
            </select>
          </div>

          {/* Attributes Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Attributes (JSON Format):
            </label>
            <textarea
              placeholder='[{"key": "value"}, {"key2": "value2"}]'
              value={attributes}
              onChange={(e) => setAttributes(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded resize-none h-32 bg-white"
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Issue Credential
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Offer;
