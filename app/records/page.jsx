"use client";
import { useEffect, useState } from "react";
import useStore from "../store/useStore";
import LoadingScr from "../components/LoadingScr";

export default function resultssPage() {
  const { credentialRecords, IssuedCredentials, loading } = useStore();
  const [getRecord, setGetRecord] = useState(true);
  // Simulate fetching data
  useEffect(() => {
    credentialRecords();
  }, []);

  useEffect(() => {
    // Check the state of IssuedCredentials
    if (IssuedCredentials) {
      if (IssuedCredentials.length > 0) {
        // Records exist, stop loading
        setGetRecord(false);
      } else {
        // No records found, stop loading
        setGetRecord(false);
      }
    } else {
      // IssuedCredentials is undefined or null, stop loading
      setGetRecord(false);
    }
  }, [IssuedCredentials]);

  if (getRecord) {
    return <LoadingScr />;
  } else {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-semibold mb-6 text-blue-600">
            CREDENTIALS
          </h1>

          {/* Flexbox layout to allow wrapping */}
          <div className="p-6 flex gap-3 flex-wrap">
            {/* Check if issuedCredentials is not found */}
            {!Array.isArray(IssuedCredentials) ? (
              // Check if issuedCredentials is not an array
              <div className="text-center text-red-600">
                <p>Error: Issued credentials data is not valid.</p>
              </div>
            ) : IssuedCredentials.length === 0 ? (
              // Check if issuedCredentials array is empty
              <div className="text-center text-gray-600">
                <p>No records found</p>
              </div>
            ) : (
              // Map through issuedCredentials if valid
              IssuedCredentials.map((results) => (
                <div
                  key={results.referent}
                  className="bg-white p-6 shadow-md mb-6 w-[30rem] rounded-lg"
                >
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    ISSUED CREDENTIAL
                  </h2>

                  {/* Grid layout for results information */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col flex-wrap">
                      <p className="font-medium text-gray-700">Referent ID:</p>
                      <p className="text-gray-600">{results.referent}</p>
                    </div>
                    <div className="flex flex-col flex-wrap w-[220px] break-words">
                      <p className="font-medium text-gray-700">Schema ID:</p>
                      <div className="w-full">
                        <p className="text-gray-600">{results.schema_id}</p>
                      </div>
                    </div>
                    <div className="flex flex-col w-[200px] break-words">
                      <p className="font-medium text-gray-700">
                        Definition ID:
                      </p>
                      <div className="w-full">
                        <p className="text-gray-600">{results.cred_def_id}</p>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">
                        Revocation Registry ID:
                      </p>
                      <p className="text-gray-600">
                        {results.rev_reg_id || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">
                        Revocation ID:
                      </p>
                      <p className="text-gray-600">
                        {results.cred_rev_id || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Attributes section */}
                  <h3 className="text-lg font-semibold mt-6 mb-3 text-gray-800">
                    Attributes
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(results.attrs).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="font-medium text-gray-700 capitalize">
                          {key}:
                        </span>
                        <span className="text-gray-600">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }
}
