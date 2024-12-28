"use client";
import ActiveCard from "@/app/components/ActiveCard";
import useStore from "@/app/store/useStore";
import React, { useEffect } from "react";

const page = () => {
  const { Active } = useStore();

  const pending = false;

  return (
    <div className="flex flex-wrap">
      {Active &&
        Active.length > 0 &&
        Active.map((act, index) => {
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
