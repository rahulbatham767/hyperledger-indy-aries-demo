"use client";
import { useState } from "react";
import { toast } from "react-toastify"; // Import toast from react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Select,
} from "@/components/ui/select";
import useStore from "@/app/store/useStore";
import { parseSchemas } from "@/app/utils/helper";

const Credentials = () => {
  // State management
  const [schemaName, setSchemaName] = useState("");
  const [schemaVersion, setSchemaVersion] = useState("");
  const [tag, setTag] = useState("");
  const { credentialDefination, Schemas } = useStore();

  const parsedSchema = parseSchemas(Schemas);
  console.log(parsedSchema);
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
      tag,
      schemaVersion, // Add schema version to formData
    };

    console.log("Form Data:", formData);
    credentialDefination(formData);
    setSchemaName("");
    setSchemaVersion("");
    setTag("");
  };

  // Filter to find the specific schema with the selected ID
  const selectedSchema = parsedSchema.find(
    (schema) => schema.id === schemaName
  );

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-lg bg-white p-6">
        <h3 className="text-2xl font-bold text-center mb-6">
          Create Credential Definition
        </h3>
        <Form onSubmit={handleSubmit}>
          {/* Schema ID */}
          <FormItem>
            <FormLabel className="text-lg font-medium">
              Select Schema:
            </FormLabel>
            <Select
              value={schemaName}
              onValueChange={(value) => setSchemaName(value)}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a Schema Name" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {parsedSchema.map((schema) => (
                  <SelectItem key={schema.id} value={schema.id}>
                    {schema.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
          <br />

          {/* Schema Version */}
          <FormItem>
            <FormLabel className="text-lg font-medium">
              Schema Version:
            </FormLabel>
            <Select
              value={schemaVersion}
              onValueChange={(value) => setSchemaVersion(value)}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a Schema Version" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {selectedSchema ? (
                  <div>
                    <p>Version for {selectedSchema.name}:</p>
                    <SelectContent>
                      <SelectItem
                        key={selectedSchema.id}
                        value={selectedSchema.version}
                      >
                        {selectedSchema.version}
                      </SelectItem>
                    </SelectContent>
                  </div>
                ) : (
                  <p>Select a schema to view its version.</p>
                )}
              </SelectContent>
            </Select>
          </FormItem>
          <br />

          {/* Tag */}
          <FormItem>
            <FormLabel className="text-lg font-medium">Tag:</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter tag"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </FormControl>
          </FormItem>
          <br />

          {/* Submit Button */}
          <div className="text-center">
            <Button
              onClick={handleSubmit}
              variant="ghost"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md"
              size="lg"
            >
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Credentials;
