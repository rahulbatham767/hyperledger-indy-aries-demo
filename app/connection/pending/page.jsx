"use client";

import useStore from "@/app/store/useStore";
import React, { useEffect, useState } from "react";
// Assuming Loading component exists
import LoadingScr from "@/app/components/LoadingScr";
import ActiveCard from "@/app/components/ActiveCard";

const page = () => {
  const { fetchConnection, Pending, loading } = useStore();
  const [PendingLoading, setPendingLoading] = useState(true);
  useEffect(() => {
    fetchConnection();
  }, []);

  useEffect(() => {
    if (Pending) {
      if (Pending.length > 0) {
        // Records exist, stop loading
        setPendingLoading(false);
      } else {
        // No records found, stop loading
        setPendingLoading(false);
      }
    } else {
      // IssuedCredentials is undefined or null, stop loading
      setPendingLoading(false);
    }
  }, [Pending]);

  return PendingLoading ? (
    <LoadingScr />
  ) : (
    <div className="flex flex-wrap">
      {Pending.map((act, index) => (
        <div key={index}>
          <ActiveCard act={act} pending={loading} />
        </div>
      ))}
    </div>
  );
};

export default page;
