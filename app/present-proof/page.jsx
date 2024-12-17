"use client";
import React, { useEffect } from "react";
import useStore from "../store/useStore";

const ProofRequestPage = () => {
  const { fetchProofRequests, addProofRequest } = useStore(); // Get the action to add proof requests

  // Fetch proof requests (example function)

  //   useEffect(() => {
  //     fetchProofRequests(); // Trigger the fetch function on page load
  //   }, [addProofRequest]);

  return (
    <div>
      <h2 className="text-xl font-semibold">Proof Requests Page</h2>
      {/* Your page content */}
    </div>
  );
};

export default ProofRequestPage;
