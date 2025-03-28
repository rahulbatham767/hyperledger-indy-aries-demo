import axios from "axios";

// format date
export function isValidDate(value) {
  return !isNaN(Date.parse(value));
}
export function formatDate(dateString) {
  const date = new Date(dateString);

  // Check if the date is valid
  if (isNaN(date)) {
    return "Invalid date";
  }

  // Get day, month, year, hours, and minutes
  const day = String(date.getDate()).padStart(2, "0");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // Format as "24 Aug 2020, 14:30"
  return `${day} ${month} ${year}, ${hours}:${minutes}`;
}
export const parseSchemas = (schemas) => {
  return schemas.map((schema) => {
    const parsedSchema = JSON.parse(schema);
    return {
      id: parsedSchema.schema_id, // Extract schema_id
      name: parsedSchema.schema.name, // Extract schema name
      version: parsedSchema.schema.version, // Extract schema version
      attributes: parsedSchema.schema.attrNames, // Extract schema attributes
    };
  });
};

// for checking valid json ro not
export const isValidJsonArray = (str) => {
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed); // Check if it's an array
  } catch (e) {
    return false; // Invalid JSON
  }
};

// for getting value before colon
export function getValueBeforeColon(inputString) {
  return inputString.split(":")[0];
}

// for issuing credentials
export function generateCredentialPayload(issuer) {
  // Create the context object dynamically
  const context = {
    "https://www.w3.org/2018/credentials/v1": {},
  };

  // Map attribute names to their vocab URLs dynamically
  issuer.attributes.forEach((attr) => {
    context["https://www.w3.org/2018/credentials/v1"][
      attr.name
    ] = `https://example.org/vocab/${attr.name}`;
  });

  // Dynamically build credentialSubject from attributes
  const credentialSubject = issuer.attributes.reduce((subject, attr) => {
    subject[attr.name] = attr.value;
    return subject;
  }, {});

  // Create the payload
  const payload = {
    comment: "Here is Your Credential...",
    connection_id: issuer.connection_id,
    auto_remove: false,
    credential_preview: {
      "@type": "issue-credential/2.0/credential-preview",
      attributes: issuer.attributes,
    },
    filter: {
      indy: {
        cred_def_id: issuer.cred_def_id,
      },
    },
    ld_proof: {
      credential: {
        "@context": [
          "https://www.w3.org/2018/credentials/v1",
          context["https://www.w3.org/2018/credentials/v1"], // dynamic context
        ],
        credentialSubject: credentialSubject, // dynamic credentialSubject
        description: `Official transcript for {{recipient_name}}.`,
        identifier: "{{identifier}}",
        issuanceDate: "{{issuance_date}}",
        issuer: issuer.issuer_did,
        name: "Academic Transcript",
        type: ["VerifiableCredential", "Transcript"],
      },
      options: {
        proofType: "Ed25519Signature2018",
      },
    },
  };

  return payload;
}

// for proposing credentials user
export function ProposalforCredential(issuer) {
  // Create the context object dynamically
  const context = {
    "https://www.w3.org/2018/credentials/v1": {},
  };

  // Map attribute names to their vocab URLs dynamically
  issuer.attributes.forEach((attr) => {
    context["https://www.w3.org/2018/credentials/v1"][
      attr.name
    ] = `https://example.org/vocab/${attr.name}`;
  });

  // Dynamically build credentialSubject from attributes
  const credentialSubject = issuer.attributes.reduce((subject, attr) => {
    subject[attr.name] = attr.value;
    return subject;
  }, {});
  // Extract recipient name from attributes
  const recipientName =
    issuer.attributes.find((attr) => attr.name === "name")?.value || "Unknown";

  // Get today's date in ISO format
  const todayDate = new Date().toISOString();

  // Create the payload
  const payload = {
    comment: "I want These Credential...",
    connection_id: issuer.connection_id,
    auto_remove: false,
    role: "holder",
    comment: issuer.Requestor,
    credential_preview: {
      "@type": "issue-credential/2.0/credential-preview",
      attributes: issuer.attributes,
    },
    filter: {
      indy: {},
    },
    ld_proof: {
      credential: {
        "@context": [
          "https://www.w3.org/2018/credentials/v1",
          context["https://www.w3.org/2018/credentials/v1"], // dynamic context
        ],
        credentialSubject: credentialSubject, // dynamic credentialSubject
        description: `Official transcript for ${recipientName}.`, // Populate recipient name
        identifier: `ID-${Math.random().toString(36).substr(2, 9)}`, // Example identifier
        issuanceDate: todayDate, // Use today's date
        issuer: issuer.issuer_did,
        name: "Academic Transcript",
        type: ["VerifiableCredential", "Transcript"],
      },
      options: {
        proofType: "Ed25519Signature2018",
      },
    },
  };

  return payload;
}

export function mapAttributes(attributes) {
  console.log("Attributes:", attributes); // Debugging step to check the value

  if (!Array.isArray(attributes)) {
    throw new TypeError("Expected attributes to be an array");
  }

  const mappedAttributes = {};
  attributes.forEach((attr, index) => {
    const attrNumber = index + 1; // Number starts from 1
    const key = `attr${attrNumber}_referent`;
    mappedAttributes[key] = { name: attr };
  });

  return mappedAttributes;
}

export function ProofRequests(proof) {
  const data = {
    auto_remove: true,
    auto_verify: false,
    comment: "Proof request of academic credentials",
    connection_id: proof.connection_id,
    presentation_request: {
      indy: {
        name: "Proof request",
        version: "1.0",
        nonce: "1",
        requested_attributes: proof.requested_attributes,
        requested_predicates: proof.requested_predicates,
      },
    },
    trace: false,
  };
  return data;
}
export function PresentationTemplate(proof) {
  const requestedAttributes = {};
  console.log("proof in presentation template", proof);

  // Ensure proof.RequestedCred is an array before using forEach
  if (Array.isArray(proof.RequestedCred)) {
    proof.RequestedCred.forEach((item) => {
      console.log("item in presentation template", item);

      if (Array.isArray(item.presentation_referents)) {
        item.presentation_referents.forEach((referent, index) => {
          // Dynamically build the requested attributes

          const key = `attr${index + 1}_referent`;
          const isSelected = proof.selectedAttributes?.[key] || false;

          console.log(proof.selectedAttributes);

          requestedAttributes[referent] = {
            cred_id: item.cred_info.referent,
            revealed: isSelected || false, // Default to false if not selected
          };
        });
      } else {
        console.error(
          "Expected item.presentation_referents to be an array but got",
          typeof item.presentation_referents
        );
      }
    });

    console.log("proof.RequestedCred", proof);
  } else {
    console.error(
      "Expected proof.RequestedCred to be an array but got",
      typeof proof.RequestedCred
    );
  }

  const data = {
    auto_remove: true,
    auto_verify: false,
    comment: "Proof For Verification",
    indy: {
      requested_attributes: requestedAttributes,
      requested_predicates: proof.RequestedCred[0]?.requested_predicates || {}, // Handle requested predicates
      self_attested_attributes: {},
    },
    trace: false,
  };

  return data;
}

export function issueAttributes(attributes) {
  return attributes.map((item) => {
    const [key, value] = Object.entries(item)[0]; // Extract the first key-value pair
    return { name: key, value: value };
  });
}
export const getCredentialID = async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_HOLDER_ENDPOINT}/present-proof-2.0/records`
  );
  console.log("response from get credential id", response.data);
  const credential_id = response.data.results[0].pres_ex_id;
  return credential_id;
};

export const getRequestCredential = async (pres_ex_id) => {
  console.log("pres_ex_id", pres_ex_id);
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_HOLDER_ENDPOINT}/present-proof-2.0/records/${pres_ex_id}/credentials`
  );

  console.log("response from get request credential", response);

  const data = response.data;
  console.log("response from get request credential data", data);

  const cred = data.map((item) => {
    console.log("response from get request credential", item?.cred_info?.attrs);
    return item?.cred_info?.attrs;
  });
  console.log("credentialS are ", cred);

  return cred;
};
