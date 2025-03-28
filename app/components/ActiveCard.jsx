"use client";

import React from "react";
import { formatDate } from "../utils/helper";
import useStore from "../store/useStore";

const ActiveCard = ({ act, pending }) => {
  const {
    created_at,
    alias,
    their_did,
    updated_at,
    my_did,
    their_label,
    connection_id,
  } = act;
  const { DeleteConnection, fetchConnection } = useStore();

  return (
    <div className="w-80 h-96 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col">
      {/* Header with delete button */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {pending ? "Pending Connection" : "Active Connection"}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Received: {formatDate(created_at)}
          </p>
        </div>
        <button
          onClick={() => {
            DeleteConnection(connection_id).then(() => fetchConnection());
          }}
          className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 rounded-full hover:bg-red-50"
          aria-label="Delete connection"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 space-y-4 overflow-y-auto">
        {/* Connection Details */}
        <div className="space-y-3">
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="text-xs font-medium text-gray-500 mb-1">
              {pending ? "State" : "My DID"}
            </h4>
            <p className="text-sm font-mono text-gray-800 break-all">
              {pending ? "Invited" : my_did}
            </p>
          </div>

          {pending ? (
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-xs font-medium text-gray-500 mb-1">Alias</h4>
              <p className="text-sm text-gray-800 break-all">
                {alias || "Not specified"}
              </p>
            </div>
          ) : (
            <>
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="text-xs font-medium text-gray-500 mb-1">
                  Their Label
                </h4>
                <p className="text-sm text-gray-800 break-all">
                  {their_label || "Not specified"}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="text-xs font-medium text-gray-500 mb-1">
                  Their DID
                </h4>
                <p className="text-sm font-mono text-gray-800 break-all">
                  {their_did}
                </p>
              </div>
            </>
          )}

          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="text-xs font-medium text-gray-500 mb-1">
              Connection ID
            </h4>
            <p className="text-xs font-mono text-gray-800 break-all">
              {connection_id}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Last updated: {formatDate(updated_at)}
        </p>
      </div>
    </div>
  );
};

export default ActiveCard;