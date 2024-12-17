"use client";
import React, { useEffect, useMemo, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import useStore from "@/app/store/useStore";
import {
  getValueBeforeColon,
  isValidJsonArray,
  parseSchemas,
} from "@/app/utils/helper";
import { toast } from "react-toastify";

const Offer = () => {
  // State management
  const [relationship, setRelationship] = useState("");
  const [credentialSchema, setCredentialSchema] = useState("");
  const [credentialDefinition, setCredentialDefinition] = useState("");
  const [attributes, setAttributes] = useState("");

  const {
    Active,
    Defination,
    getSchemaDetails,
    getDefinationLedger,
    issueCredential,
    credDefination,
    SchemaRecord,
  } = useStore();

  // Handle form submission
  const handleIssueCredential = async (e) => {
    e.preventDefault(); // Prevent default form behavior
    console.log(attributes);
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
    console.log("attributes in offer " + attributes);
    // Form Data
    const issuer_did = getValueBeforeColon(credentialSchema);
    const formData = {
      connection_id: relationship,
      schema_id: credentialSchema,
      issuer_did: issuer_did,
      schema_issuer_did: issuer_did,
      cred_def_id: credentialDefinition,
      attributes: JSON.parse(attributes || "{}"), // Parse JSON string
    };

    console.log("Sending Data:", formData);

    // Simulate API call
    issueCredential(formData);
    setCredentialDefinition("");
    setRelationship("");
    setCredentialSchema("");
    setAttributes("");
  };

  useEffect(() => {
    getDefinationLedger(credentialSchema);
  }, [credentialSchema]);

  console.log(SchemaRecord.schema_ids);
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-3xl bg-white p-6">
        <h3 className="text-2xl font-bold text-center mb-6">
          Send Credential Offer
        </h3>
        <Form onSubmit={handleIssueCredential}>
          {/* Relationship Field */}
          <FormItem>
            <FormLabel>Relationship:</FormLabel>
            <Select
              value={relationship}
              onValueChange={(value) => setRelationship(value)}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select Relationship" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Active.map((active, i) => (
                  <SelectItem key={i} value={active.connection_id}>
                    {active.alias}:{active.their_did}
                  </SelectItem>
                ))}{" "}
              </SelectContent>
            </Select>
          </FormItem>

          {/* Credential Schema Field */}
          <FormItem className="mt-4">
            <FormLabel>Credential Schema:</FormLabel>
            <Select
              value={credentialSchema}
              onValueChange={(value) => {
                getDefinationLedger(value);
                setCredentialSchema(value);
              }}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select Credential Schema" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {SchemaRecord.schema_ids.map((schema, i) => (
                  <SelectItem key={i} value={schema}>
                    {schema}
                  </SelectItem>
                ))}{" "}
              </SelectContent>
            </Select>
          </FormItem>

          {/* Credential Definition Field */}
          <FormItem className="mt-4">
            <FormLabel>Credential Definition:</FormLabel>
            <Select
              value={credentialDefinition}
              onValueChange={(value) => {
                setCredentialDefinition(value);
              }}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select Credential Definition" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Defination.map(({ credential_definition_ids }, index) =>
                  credential_definition_ids.map((item, i) => (
                    <SelectItem key={index + i} value={item}>
                      {item}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </FormItem>

          {/* Attributes Field */}
          <FormItem className="mt-4">
            <FormLabel>Attributes (JSON Format):</FormLabel>
            <FormControl>
              <Textarea
                placeholder='[{"key1": "value1", "key2": "value2"}]'
                value={attributes}
                onChange={(e) => setAttributes(e.target.value)}
                className="resize-none h-32"
              />
            </FormControl>
          </FormItem>

          {/* Submit Button */}
          <div className="mt-6 text-center">
            <Button
              onClick={handleIssueCredential}
              variant="primary"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Issue Credential
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Offer;
