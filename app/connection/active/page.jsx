"use client";
import ActiveCard from "@/app/components/ActiveCard";
import LoadingScr from "@/app/components/LoadingScr";
import useStore from "@/app/store/useStore";
import React, { useEffect, useState } from "react";

const page = () => {
  const { Active } = useStore();
  const [activeLoading, setActiveLoading] = useState(true);
  console.log("In Active State " + Active);
  const pending = false;

  useEffect(() => {
    if (Active) {
      if (Active.length > 0) {
        // Records exist, stop loading
        setActiveLoading(false);
      } else {
        // No records found, stop loading
        setActiveLoading(false);
      }
    } else {
      // IssuedCredentials is undefined or null, stop loading
      setActiveLoading(false);
    }
  }, [Active]);

  return (
    <div>
      {activeLoading ? (
        <LoadingScr />
      ) : (
        <div className="flex flex-wrap">
          {/* Comment out this <LoadingScr /> if you only want it to display when loading */}
          {Active.map((act, index) => {
            return (
              <div key={index}>
                <ActiveCard act={act} pending={pending} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default page;
