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

export const isValidJsonArray = (str) => {
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed); // Check if it's an array
  } catch (e) {
    return false; // Invalid JSON
  }
};

export function getValueBeforeColon(inputString) {
  return inputString.split(":")[0];
}

// Dynamically build @context from attributes
const context = {
  "https://www.w3.org/2018/credentials/v1": {},
};
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