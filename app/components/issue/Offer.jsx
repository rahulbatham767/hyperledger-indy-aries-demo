"use client";
import useStore from "@/app/store/useStore";
import { issueAttributes } from "@/app/utils/helper";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Offer = () => {
  const [relationship, setRelationship] = useState("");
  const [credentialSchema, setCredentialSchema] = useState("");
  const [credentialDefinition, setCredentialDefinition] = useState("");
  const [attributes, setAttributes] = useState("");

  // Local states for store data
  const [activeRelationships, setActiveRelationships] = useState([]);
  const [definitions, setDefinitions] = useState([]);
  const [schemaRecord, setSchemaRecord] = useState([]);
  const [schemaDetails, setSchemaDetails] = useState(null);

  const {
    Active,
    Defination,
    getSchemaDetails,
    SchemaDetails,
    issueingCredential,
    SchemaRecord,
    getCredentialdefination,
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

    let parsedAttributes, mapping;
    try {
      const parsed = JSON.parse(attributes);
      parsedAttributes = schemaDetails?.attrNames.map((key, index) => ({
        [key]: parsed[index],
      }));
      mapping = issueAttributes(parsedAttributes);

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

    const issuer_did = credentialSchema.split(":")[0];
    const formData = {
      connection_id: relationship,
      schema_id: credentialSchema,
      issuer_did: issuer_did,
      schema_issuer_did: issuer_did,
      cred_def_id: credentialDefinition,
      attributes: mapping,
    };

    issueingCredential(formData);

    setRelationship("");
    setCredentialSchema("");
    setCredentialDefinition("");
    setAttributes("");
  };

  // Fetch data and store in local states
  useEffect(() => {
    setActiveRelationships(Active || []);
    setDefinitions(Defination?.credential_definition_ids || []);
    setSchemaRecord(SchemaRecord?.schema_ids || []);
    setSchemaDetails(SchemaDetails || null);
  }, [Active, Defination, SchemaRecord, SchemaDetails]);

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-3xl bg-white p-6">
        <h3 className="text-2xl font-bold text-center mb-6">Credential</h3>
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
              {activeRelationships.map((active, i) => (
                <option key={i} value={active.connection_id}>
                  {active.their_label}:{active.their_did}
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
              onChange={(e) => {
                setCredentialSchema(e.target.value);
                getCredentialdefination(e.target.value);
                getSchemaDetails(e.target.value);
              }}
              className="w-full p-2 border border-gray-300 rounded bg-white"
            >
              <option value="">
                {schemaRecord.length > 0
                  ? "Select Credential Schema"
                  : "No Credential Schema Present"}
              </option>
              {schemaRecord.map((id, i) => (
                <option key={i} value={id}>
                  {id}
                </option>
              ))}
            </select>
          </div>

          {/* Schema Attributes */}
          {credentialSchema && schemaDetails && (
            <div className="mt-4 p-3 border border-gray-200 bg-gray-100 rounded-md w-full shadow-sm">
              <p className="text-sm text-gray-500">
                <strong>Name:</strong> {schemaDetails.name || "N/A"}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Version:</strong> {schemaDetails.version || "N/A"}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Id:</strong> {schemaDetails.id || "N/A"}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Attributes:</strong>{" "}
                {Array.isArray(schemaDetails?.attrNames) &&
                schemaDetails?.attrNames.length > 0
                  ? schemaDetails.attrNames.join(", ")
                  : "No attributes available"}
              </p>
            </div>
          )}

          {/* Credential Definition Field */}
          <div className="mb-4 mt-3">
            <label className="block text-sm font-medium mb-2">
              Credential Definition:
            </label>
            <select
              value={credentialDefinition}
              onChange={(e) => setCredentialDefinition(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded bg-white"
            >
              <option value="">Select Credential Definition</option>
              {definitions.map((cred, index) => (
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
              placeholder='["rahul","XX4170"]'
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
