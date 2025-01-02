"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify"; // Import toast from react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import useStore from "@/app/store/useStore";

const Credentials = () => {
  // Local state for managing form inputs
  const [schemaName, setSchemaName] = useState("");
  const [schemaVersion, setSchemaVersion] = useState("");
  const [tag, setTag] = useState("");

  // Local state for fetched data
  const [schemaList, setSchemaList] = useState([]);
  const [schemaDetails, setSchemaDetails] = useState(null);

  const {
    credentialDefination,
    SchemaRecord,
    SchemaDetails,
    getSchema,
    getSchemaDetails,
    successStatus,
  } = useStore();

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
      schema_version: schemaVersion,
    };

    console.log("Form Data:", formData);
    credentialDefination(formData).then((response) => {
      console.log(response);
      if (successStatus) {
        toast.success("Credential Definition created successfully!");
        setSchemaName("");
        setSchemaVersion("");
        setTag("");
      } else {
        toast.error("Failed to create Credential Definition!");
      }
    });
  };

  // Fetch schemas from the store and store them in local state
  useEffect(() => {
    getSchema();
  }, []);

  useEffect(() => {
    if (SchemaRecord && SchemaRecord.schema_ids) {
      setSchemaList(SchemaRecord.schema_ids);
    }
  }, [SchemaRecord]);

  // Fetch schema details when a schema is selected
  const handleSchemaChange = (value) => {
    setSchemaName(value);
    getSchemaDetails(value);
  };

  useEffect(() => {
    if (SchemaDetails) {
      setSchemaDetails(SchemaDetails);
    }
  }, [SchemaDetails]);

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
              onChange={(e) => handleSchemaChange(e.target.value)}
              className="border-gray-200 border shadow-sm rounded-md bg-white w-full p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>
                {schemaList.length > 0
                  ? "Select a Schema Name"
                  : "No Available Schema"}
              </option>
              {schemaList.map((schema, id) => (
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
              className="border-gray-200 border shadow-sm bg-white rounded-md w-full p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>
                Select a Schema Version
              </option>
              {schemaDetails ? (
                <option value={schemaDetails.version}>
                  {schemaDetails.version}
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
              className="border-gray-200 border shadow-sm rounded-md w-full p-2 bg-white focus:ring-blue-500 focus:border-blue-500 h-28"
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
