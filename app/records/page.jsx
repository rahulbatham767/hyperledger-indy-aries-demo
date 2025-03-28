"use client";
import { useEffect, useState } from "react";
import useStore from "../store/useStore";
import LoadingScr from "../components/LoadingScr";
import { Copy, Check, FileText } from "lucide-react";
import { formatDate } from "../utils/helper";

export default function ResultsPage() {
  const { credentialRecords, IssuedCredentials, loading } = useStore();
  const [getRecord, setGetRecord] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    credentialRecords();
  }, []);

  useEffect(() => {
    if (IssuedCredentials) {
      setGetRecord(false);
    }
  }, [IssuedCredentials]);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (getRecord || loading) {
    return <LoadingScr />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FileText className="h-8 w-8 text-blue-600" />
            Issued Credentials
          </h1>

          <div className="text-sm text-gray-500">
            {IssuedCredentials?.length || 0} records found
          </div>
        </div>

        {!Array.isArray(IssuedCredentials) ? (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-center">
            Error: Issued credentials data is not valid
          </div>
        ) : IssuedCredentials.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="mx-auto w-24 h-24 text-gray-300 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-700">No credentials found</h3>
            <p className="mt-2 text-gray-500">There are no issued credentials to display</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {IssuedCredentials.map((results) => (
              <div
                key={results.referent}
                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
                  <h2 className="text-lg font-semibold flex items-center justify-between">
                    <span>Credential Record</span>
                    <button
                      onClick={() => copyToClipboard(results.referent, results.referent)}
                      className="text-white hover:text-blue-200 transition-colors"
                      title="Copy Referent ID"
                    >
                      {copiedId === results.referent ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </h2>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                        Referent ID
                      </h3>
                      <p className="text-sm font-mono text-gray-700 break-all">
                        {results.referent}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                          Schema ID
                        </h3>
                        <p className="text-sm font-mono text-gray-700 break-all">
                          {results.schema_id}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                          Definition ID
                        </h3>
                        <p className="text-sm font-mono text-gray-700 break-all">
                          {results.cred_def_id}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                          Revocation Registry
                        </h3>
                        <p className="text-sm text-gray-700">
                          {results.rev_reg_id || "N/A"}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                          Revocation ID
                        </h3>
                        <p className="text-sm text-gray-700">
                          {results.cred_rev_id || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                      Attributes
                    </h3>
                    <div className="space-y-2">
                      {Object.entries(results.attrs).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-start">
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {key}:
                          </span>
                          <span className="text-sm text-gray-600 text-right max-w-[150px] break-words">
                            {key==="ISSUED_ON" ? formatDate(value) : value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}