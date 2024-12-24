"use client";
import React, { useEffect, Suspense } from "react";
import useStore from "../store/useStore";
import LoadingScr from "../components/LoadingScr";

// Lazy load the components
const Schema = React.lazy(() => import("../components/issue/Schema"));
const Offer = React.lazy(() => import("../components/issue/Offer"));
const Credentials = React.lazy(() => import("../components/issue/Credential"));

const Page = () => {
  const { getCredentialdefination, loading, createSchema } = useStore();

  // Fetch credential definition on component mount
  useEffect(() => {
    getCredentialdefination();
  }, [getCredentialdefination]);

  // Create schema only once on mount
  useEffect(() => {
    if (createSchema) {
      createSchema();
    }
  }, [createSchema]);

  return (
    <div className="w-full flex p-6">
      <div className="flex w-full flex-wrap justify-center gap-6">
        {/* Schema Section */}
        <div className="rounded-lg w-[22rem] shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
          <Suspense fallback={<LoadingScr />}>
            <Schema />
          </Suspense>
        </div>

        {/* Credentials Section */}
        <div className="rounded-lg w-[22rem] shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
          <Suspense fallback={<LoadingScr />}>
            <Credentials />
          </Suspense>
        </div>

        {/* Offer Section */}
        <div className="rounded-lg w-[22rem] shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
          <Suspense fallback={<LoadingScr />}>
            <Offer />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Page;
