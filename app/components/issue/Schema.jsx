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
  const [attributes, setAttributes] = useState("");
  const { createSchema } = useStore();
  // Function to validate if a string is a valid JSON array

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    let parsedAttributes = [];

    if (attributes.trim() && isValidJsonArray(attributes)) {
      parsedAttributes = JSON.parse(attributes); // Parse attributes JSON string into an array
    } else {
      toast.error(
        "Invalid JSON array format for attributes. Please try again.",
        {
          position: "top-right",
          autoClose: 5000,
        }
      );
      return;
    }

    const formData = {
      schema_name: schemaName,
      schema_version: schemaVersion,
      attributes: parsedAttributes,
    };

    console.log("Form Data:", formData);

    // Simulate API call
    createSchema(formData);

    // if (response.ok) {
    //   toast.success("📋 Schema Created Successfully!", {
    //     position: "top-right",
    //     autoClose: 5000,
    //   });
    // } else {
    //   toast.error("❌ Failed to create schema. Please try again.", {
    //     position: "top-right",
    //     autoClose: 5000,
    //   });
    // }
    setSchemaName("");
    setSchemaVersion("");
    setAttributes("");
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
            <FormLabel className="text-lg font-medium">
              Attributes (JSON Array):
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder={`Example: ["name", "degree", "status"]`}
                value={attributes}
                onChange={(e) => setAttributes(e.target.value)}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 resize-none h-28"
              />
            </FormControl>
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
