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
    SchemaRecord,
  } = useStore();

  const parsedSchemas = parseSchemas(Schemas);

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
    // if (SchemaRecord && Object.keys(SchemaRecord).length > 0) {
    //   setSchemaLoading(false);
    // }

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
        <form className="grid grid-cols-2 gap-6 w-full p-6">
          {/* Credential Schema Section */}
          <div className="flex flex-col items-start">
            <h2 className="text-lg font-semibold text-gray-600 mb-3">
              Credential Schema
            </h2>
            {SchemaRecord?.schema_ids && SchemaRecord.schema_ids.length > 0 ? (
              <select
                value={selectedSchema}
                onChange={handleSchemaChange}
                className="w-full bg-inherit p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="" disabled>
                  Select a Schema
                </option>
                {SchemaRecord.schema_ids.map((id, i) => (
                  <option key={i} value={id}>
                    {id}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-gray-500 text-sm italic">
                No schema records available.
              </p>
            )}

            {selectedSchema && SchemaDetails && (
              <div className="mt-4 p-3 border border-gray-200 bg-gray-100 rounded-md w-full shadow-sm">
                <p className="text-sm text-gray-500">
                  <strong>Name:</strong> {SchemaDetails.name}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Version:</strong> {SchemaDetails.version}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Id:</strong> {SchemaDetails.id}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Attributes:</strong>{" "}
                  {Array.isArray(SchemaDetails?.attrNames)
                    ? SchemaDetails?.attrNames.join(", ")
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
                Select a Definition
              </option>
              {Defination?.map(({ credential_definition_ids }, key) =>
                credential_definition_ids?.map((def, index) => (
                  <option key={`${key}-${index}`} value={def}>
                    {def}
                  </option>
                ))
              )}
            </select>
            {selectedDefinition &&
            credDefination &&
            typeof credDefination === "object" ? (
              <div className="mt-4 p-3 border border-gray-200 bg-gray-100 rounded-md shadow-sm w-full">
                {/* Access the properties of the 'DefinationDetail' object */}
                {credDefination?.credential_definition ? (
                  <div>
                    <p className="text-sm text-gray-500">
                      <strong>ID:</strong>{" "}
                      {credDefination?.credential_definition?.id || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Schema ID:</strong>{" "}
                      {credDefination?.credential_definition?.schemaId || "N/A"}
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
                ) : (
                  <p>Select a Credential Schema Defination First</p>
                )}
              </div>
            ) : (
              <p>No data available</p>
            )}
          </div>
        </form>
      </div>
    );
}
