"use client";
import ActiveCard from "@/app/components/ActiveCard";
import useStore from "@/app/store/useStore";
import React, { useEffect } from "react";
import verifierStore from "../store/verifierStore";
import Cookies from "js-cookie";

const page = () => {
  const userAccess = Cookies.get("userRole"); // Retrieve the user role from cookies
  console.log("User Role:", userAccess); // Log the user role for debugging

  const store = userAccess === "verifier" ? verifierStore() : useStore();
  const { fetchConnection, Active } = store;

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
