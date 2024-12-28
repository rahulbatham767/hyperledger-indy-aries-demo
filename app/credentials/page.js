"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import useStore from "../store/useStore";
import { parseSchemas } from "../utils/helper";
import LoadingScr from "../components/LoadingScr";

export default function Page() {
  const [selectedSchema, setSelectedSchema] = useState("");
  const [selectedDefinition, setSelectedDefinition] = useState("");
  const [DefinationDetail, setDefinationDetail] = useState([]); // Separate state for definition details);
  const [schemaLoading, setSchemaLoading] = useState(true); // Track schema loading

  // Retrieve schemas and definitions from the store
  const {
    Schemas,
    getDefinationLedger,
    Defination,
    credDefination,
    loading,
    getSchema,
    SchemaDetails,
    getSchemaDetails,
    getCredentialdefination,
    SchemaRecord,
  } = useStore();

  // State for schema and definition details

  const handleSchemaChange = useCallback((e) => {
    setSelectedSchema(e.target.value);
    getSchemaDetails(e.target.value);
  }, []);
  const handleDefinitionChange = useCallback((e) => {
    e.preventDefault();
    setSelectedDefinition(e.target.value);
    getDefinationLedger(e.target.value);
  }, []);

  useEffect(() => {
    if (
      credDefination &&
      Array.isArray(credDefination) &&
      credDefination.length > 0
    ) {
      setDefinationDetail(credDefination);
    } else {
      console.log("Invalid or empty credDefination data");
    }
  }, [credDefination]);

  useEffect(() => {
    console.log("DefinationDetail state updated:", DefinationDetail);
  }, [DefinationDetail]);

  // Schema Records
  useEffect(() => {
    if (SchemaRecord) {
      if (Object.keys(SchemaRecord).length > 0) {
        // Records exist, stop loading
        setSchemaLoading(false);
      } else {
        // No records found, stop loading
        setSchemaLoading(false);
      }
    } else {
      // IssuedCredentials is undefined or null, stop loading
      setSchemaLoading(false);
    }
  }, [SchemaRecord]);

  useEffect(() => {
    getSchema();
    getCredentialdefination();
  }, []);
  console.log("SchemaRecord is ", SchemaRecord);
  console.log("SchemaRecord is ", SchemaDetails);

  if (loading || schemaLoading) {
    return <LoadingScr />;
  } else
    return (
      <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen rounded-lg">
        <h1 className="text-2xl font-bold text-gray-700 mb-8">
          Credential Schema and Credential Definition
        </h1>
        <form className="grid lg:grid-cols-2 md:grid-cols-2  gap-6 w-full p-6">
          {/* Credential Schema Section */}
          <div className="flex flex-col items-start">
            {/* Schema Heading */}
            <h2 className="text-lg font-semibold text-gray-600 mb-3">
              Credential Schema
            </h2>

            {/* Schema Selection Dropdown */}
            <select
              value={selectedSchema}
              onChange={handleSchemaChange}
              className="w-full bg-inherit p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="" disabled>
                {SchemaRecord?.schema_ids?.length > 0
                  ? "Select a Schema"
                  : "No Schema Available"}
              </option>
              {SchemaRecord?.schema_ids?.length > 0 &&
                SchemaRecord.schema_ids.map((id, i) => (
                  <option key={i} value={id}>
                    {id}
                  </option>
                ))}
            </select>

            {/* Schema Details */}
            {selectedSchema && SchemaDetails && (
              <div className="mt-4 p-3 border border-gray-200 bg-gray-100 rounded-md w-full shadow-sm">
                <p className="text-sm text-gray-500">
                  <strong>Name:</strong> {SchemaDetails.name || "N/A"}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Version:</strong> {SchemaDetails.version || "N/A"}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Id:</strong> {SchemaDetails.id || "N/A"}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Attributes:</strong>{" "}
                  {Array.isArray(SchemaDetails?.attrNames) &&
                  SchemaDetails?.attrNames.length > 0
                    ? SchemaDetails.attrNames.join(", ")
                    : "No attributes available"}
                </p>
              </div>
            )}
          </div>

          {/* Credential Definition Section */}
          <div className="flex flex-col items-start">
            <h2 className="text-lg font-semibold text-gray-600 mb-3">
              Credential Definition
            </h2>
            <select
              value={selectedDefinition}
              onChange={handleDefinitionChange}
              className="w-full bg-inherit p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="" disabled>
                {Defination
                  ? "Select a Definition"
                  : "No Credential Defination Available"}{" "}
              </option>
              {Defination &&
                Defination?.credential_definition_ids?.map((def, key) => (
                  <option key={`${key}`} value={def}>
                    {def}
                  </option>
                ))}
            </select>
            {selectedDefinition &&
              credDefination &&
              typeof credDefination === "object" && (
                <div className="mt-4 p-3 border border-gray-200 bg-gray-100 rounded-md shadow-sm w-full">
                  {/* Access the properties of the 'DefinationDetail' object */}
                  {credDefination?.credential_definition && (
                    <div>
                      <p className="text-sm text-gray-500">
                        <strong>ID:</strong>{" "}
                        {credDefination?.credential_definition?.id || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">
                        <strong>Schema ID:</strong>{" "}
                        {credDefination?.credential_definition?.schemaId ||
                          "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">
                        <strong>Type:</strong>{" "}
                        {credDefination?.credential_definition?.type || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">
                        <strong>Tag:</strong>{" "}
                        {credDefination?.credential_definition?.tag || "N/A"}
                      </p>
                      <div className="flex flex-wrap flex-col overflow-auto">
                        <div className="text-sm text-gray-500">
                          <strong>Value:</strong>
                          {credDefination?.credential_definition?.value ? (
                            <pre className="text-wrap text-gray-700">
                              {JSON.stringify(
                                credDefination?.credential_definition?.value,
                                null,
                                2
                              )}
                            </pre>
                          ) : (
                            <span className="text-gray-500">
                              <p>Select a Credential Schema Defination First</p>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
          </div>
        </form>
      </div>
    );
}
