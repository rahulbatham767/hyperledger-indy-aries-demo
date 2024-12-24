"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify"; // Import toast from react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import useStore from "@/app/store/useStore";
import { parseSchemas } from "@/app/utils/helper";

const Credentials = () => {
  // State management
  const [schemaName, setSchemaName] = useState("");
  const [schemaVersion, setSchemaVersion] = useState("");
  const [tag, setTag] = useState("");
  const {
    credentialDefination,
    SchemaRecord,
    SchemaDetails,
    getSchema,
    getSchemaDetails,
  } = useStore();
  console.log("Schema Record", SchemaRecord.schema_ids);
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Validate form fields
    if (!schemaName || !schemaVersion || !tag) {
      toast.error("Please fill in all fields.", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    const formData = {
      schema_id: schemaName,
      tag: tag,
      schema_version: schemaVersion, // Add schema version to formData
    };

    console.log("Form Data:", formData);
    credentialDefination(formData);
    setSchemaName("");
    setSchemaVersion("");
    setTag("");
  };

  useEffect(() => {
    getSchema();
  }, []);
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-lg bg-white p-6">
        <h3 className="text-2xl font-bold text-center mb-6">
          Create Credential Definition
        </h3>
        <form onSubmit={handleSubmit}>
          {/* Schema ID */}
          <div className="mb-4">
            <label className="text-lg font-medium block mb-2">
              Select Schema:
            </label>
            <select
              value={schemaName}
              onChange={(e) => {
                setSchemaName(e.target.value);
                getSchemaDetails(e.target.value);
              }}
              className="border-gray-300 rounded-md bg-white w-full p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {console.log(SchemaRecord.schema_ids)}
              <option value="" disabled>
                {SchemaRecord
                  ? "   Select a Schema Name"
                  : "No Available Schema"}
              </option>
              {SchemaRecord &&
                SchemaRecord.schema_ids.map((schema, id) => (
                  <option key={id} value={schema}>
                    {schema}
                  </option>
                ))}
            </select>
          </div>

          {/* Schema Version */}
          <div className="mb-4">
            <label className="text-lg font-medium block mb-2">
              Schema Version:
            </label>
            <select
              value={schemaVersion}
              onChange={(e) => setSchemaVersion(e.target.value)}
              className="border-gray-300 bg-white rounded-md w-full p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>
                Select a Schema Version
              </option>
              {SchemaDetails ? (
                <option value={SchemaDetails.version}>
                  {SchemaDetails.version}
                </option>
              ) : (
                <option value="no-schema-version" disabled>
                  No Schema Version Available
                </option>
              )}
            </select>
          </div>

          {/* Tag */}
          <div className="mb-4">
            <label className="text-lg font-medium block mb-2">Tag:</label>
            <input
              type="text"
              placeholder="Enter tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="border-gray-300 rounded-md w-full p-2 bg-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Credentials;
