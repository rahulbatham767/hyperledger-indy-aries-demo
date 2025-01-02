"use client";
import useStore from "@/app/store/useStore";
import { issueAttributes } from "@/app/utils/helper";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Offer = () => {
  const [relationship, setRelationship] = useState("");
  const [credentialSchema, setCredentialSchema] = useState("");
  const [credentialDefinition, setCredentialDefinition] = useState("");
  const [attributes, setAttributes] = useState([]);

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

  // Add a new attribute field
  const addAttribute = () => {
    setAttributes([...attributes, ""]);
  };

  // Remove an attribute field by index
  const removeAttribute = (index) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  // Update an attribute value
  const updateAttribute = (index, value) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index] = value;
    setAttributes(updatedAttributes);
  };

  const handleIssueCredential = async (e) => {
    e.preventDefault();

    if (
      !relationship ||
      !credentialSchema ||
      !credentialDefinition ||
      attributes.length === 0
    ) {
      toast.error("Please fill in all fields!", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    const mapping = schemaDetails?.attrNames.map((key, index) => ({
      [key]: attributes[index],
    }));

    const mappedAttributes = issueAttributes(mapping);

    const issuer_did = credentialSchema.split(":")[0];
    const formData = {
      connection_id: relationship,
      schema_id: credentialSchema,
      issuer_did: issuer_did,
      schema_issuer_did: issuer_did,
      cred_def_id: credentialDefinition,
      attributes: mappedAttributes,
    };

    console.log(formData);
    issueingCredential(formData)
      .then(() => {
        setRelationship("");
        setCredentialSchema("");
        setCredentialDefinition("");
        setAttributes([]);
      })
      .catch((err) => {
        toast.error("Error while issueing Credential", err?.message);
      });
  };

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
              Attributes:
            </label>
            {attributes.map((attribute, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={attribute}
                  onChange={(e) => updateAttribute(index, e.target.value)}
                  placeholder={`Attribute ${index + 1}`}
                  className="flex-1 p-2 border shadow-sm bg-white rounded"
                />
                <button
                  type="button"
                  onClick={() => removeAttribute(index)}
                  className="ml-2 p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-md border shadow-md"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addAttribute}
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
            >
              Add Attribute
            </button>
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
