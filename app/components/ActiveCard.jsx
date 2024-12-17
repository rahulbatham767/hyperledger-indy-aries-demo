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
    invitation_msg_id,
    connection_id,
  } = act;
  const { DeleteConnection, fetchConnection } = useStore();

  return (
    <div className="flex flex-col max-w-sm w-72 p-4 m-4 bg-white border border-gray-300 rounded-lg shadow relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm font-semibold text-gray-700">Received:</p>
          <p className="text-xs text-gray-500">{formatDate(created_at)}</p>
        </div>
        <span
          onClick={() => {
            DeleteConnection(connection_id);
            fetchConnection();
          }}
          className="cursor-pointer text-gray-500 hover:text-red-500 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </span>
      </div>

      {/* From Section */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-600 mb-1">
          {pending ? "State:" : "My DID:"}
        </h3>
        {pending ? (
          <p className="text-xs text-gray-500 break-all">Invited</p>
        ) : (
          <p className="text-xs text-gray-500 break-all">{my_did}</p>
        )}
      </div>

      {pending ? (
        <div>
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Alias:</h3>
            <p className="text-xs text-gray-500 break-all">{alias}</p>

            <p className="text-xs text-gray-500 break-all">{my_did}</p>
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Their DID:</h3>
          <p className="text-xs text-gray-500 break-all">{their_did}</p>
        </div>
      )}

      {/* To Section */}

      {/* Last Updated */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-600 mb-1">
          Connection ID:
        </h3>
        <p className="text-xs text-gray-500 break-all">{connection_id}</p>
      </div>
      <div className="mt-auto">
        <h3 className="text-sm font-medium text-gray-600">Last Updated:</h3>
        <p className="text-xs text-gray-500">{formatDate(updated_at)}</p>
      </div>
    </div>
  );
};

export default ActiveCard;
