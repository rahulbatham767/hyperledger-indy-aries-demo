"use client";
import useStore from "@/app/store/useStore";
import { isValidJsonArray } from "@/app/utils/helper";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { toast } from "react-toastify"; // Import toast from react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

const Schema = () => {
  // State for form inputs
  const [schemaName, setSchemaName] = useState("");
  const [schemaVersion, setSchemaVersion] = useState("");
  const [attributes, setAttributes] = useState([""]); // Array for attributes

  const { createSchema, successStatus, getSchema } = useStore();

  // Handle adding a new attribute input
  const handleAddAttribute = () => {
    setAttributes([...attributes, ""]);
  };

  // Handle removing an attribute input
  const handleRemoveAttribute = (index) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  // Handle updating the value of an attribute input
  const handleAttributeChange = (index, value) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index] = value;
    setAttributes(updatedAttributes);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!schemaName.trim() || !schemaVersion.trim()) {
      toast.error("Schema Name and Version are required fields.");
      return;
    }

    const trimmedAttributes = attributes
      .map((attr) => attr.trim())
      .filter(Boolean);
    if (trimmedAttributes.length === 0) {
      toast.error("Please add at least one valid attribute.");
      return;
    }

    const formData = {
      schema_name: schemaName.trim(),
      schema_version: parseFloat(schemaVersion).toFixed(1),
      attributes: trimmedAttributes,
    };

    console.log("Form Data:", formData);

    createSchema(formData).then(() => {
      getSchema();
      if (successStatus) {
        toast.success("Schema created successfully!", {
          position: "top-right",
          autoClose: 5000,
        });
        setSchemaName("");
        setSchemaVersion("");
        setAttributes([""]);
      }
    });
  };

  return (
    <div className="flex justify-center">
      <div className="w-full bg-white p-6">
        <h3 className="text-2xl font-bold text-center mb-6">Create Schema</h3>
        <Form>
          {/* Schema Name */}
          <FormItem>
            <FormLabel className="text-lg font-medium">
              Name of Schema:
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter schema name"
                value={schemaName}
                onChange={(e) => setSchemaName(e.target.value)}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </FormControl>
          </FormItem>
          <br />

          {/* Schema Version */}
          <FormItem>
            <FormLabel className="text-lg font-medium">
              Schema Version:
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter schema version"
                value={schemaVersion}
                onChange={(e) => setSchemaVersion(e.target.value)}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </FormControl>
          </FormItem>
          <br />

          {/* Attributes */}
          <FormItem>
            <FormLabel className="text-lg font-medium">Attributes:</FormLabel>
            {attributes.map((attribute, index) => (
              <div key={index} className="flex items-center mb-2">
                <FormControl>
                  <Input
                    placeholder={`Attribute ${index + 1}`}
                    value={attribute}
                    onChange={(e) =>
                      handleAttributeChange(index, e.target.value)
                    }
                    className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 flex-grow mr-2"
                  />
                </FormControl>
                <Button
                  variant="ghost"
                  className="bg-green-500 hover:bg-green-600 text-white rounded-lg mr-2"
                  onClick={handleAddAttribute}
                >
                  +
                </Button>
                {attributes.length > 1 && (
                  <Button
                    variant="ghost"
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg"
                    onClick={() => handleRemoveAttribute(index)}
                  >
                    —
                  </Button>
                )}
              </div>
            ))}
          </FormItem>
          <br />

          {/* Submit Button */}
          <div className="text-center">
            <Button
              variant="ghost"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md"
              size="lg"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Schema;
