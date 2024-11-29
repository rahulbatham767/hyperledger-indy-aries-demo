import React from "react";
import Schema from "../components/issue/Schema";
import Offer from "../components/issue/Offer";
import Credentials from "../components/issue/Credential";

const page = () => {
  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-center gap-7">
        <div className="rounded-md border p-2">
          <Schema />
        </div>
        <div className="rounded-md border w-[20rem] p-2">
          <Offer />
        </div>

        <div className="rounded-md border w-[20rem] p-2">
          <Credentials />
        </div>
      </div>
    </div>
  );
};

export default page;
