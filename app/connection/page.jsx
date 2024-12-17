"use client";
import ActiveCard from "@/app/components/ActiveCard";
import useStore from "@/app/store/useStore";
import React, { useEffect } from "react";
 
const page = () => {
  const { fetchConnection, Active } = useStore();
  console.log("In Active State " + Active);
  const pending = false;
  useEffect(() => {
    fetchConnection();
  }, []);
  return (
    <div className="flex flex-wrap">
      
      {Active.map((act, index) => {
        return (
          <div key={index}>
            <ActiveCard act={act} pending={pending} />
          </div>
        );
      })}
    </div>
  );
};

export default page;
