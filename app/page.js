"use client";
import { useEffect } from "react";
import useUserStore from "./store/userStore";
import Image from "next/image";
import Hyperledger from "./hyperleger.png"; // Adjusted import statement
import useHolder from "./store/holderStore";
import useStore from "./store/useStore";

export default function Home() {
  const { user } = useUserStore(); // Get the action to add proof requests
  const {
    Active,
    IssuedCredentials,
    getCredentialdefination,
    getSchema,
    credentialRecords,
    fetchConnection,
    fetchProofRequest,
  } = useStore();

  useEffect(() => {
    getCredentialdefination();
    getSchema();
    credentialRecords();
    fetchConnection();
    fetchProofRequest();
  }, []);

  return (
    <div className="flex items-center justify-center my-5">
      {/* Flex container to align image and text side by side */}
      <div className="flex items-center justify-center space-x-16 w-full max-w-screen-xl px-6">
        {/* Image Section */}
        <div className="lg:w-full  hidden">
          <Image src={Hyperledger} width={300} height={300} alt="Hyperledger" />
        </div>

        {/* Text Section */}
        <div className="w-2/3 text-left space-y-6">
          {/* Main Headline */}
          <h3 className="lg:text-6xl text-3xl  font-extrabold text-gray-800">
            Welcome {user ? user.name : "User"} to Open Wallet
          </h3>

          {/* Subheadline */}
          <h3 className="text-3xl font-medium text-gray-600">
            A Beginning Towards a Decentralized World
          </h3>

          {/* Active Connection and Credentials */}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold text-gray-700">
                Active Connection:
              </span>
              <span className="text-xl text-green-600">{Active.length}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold text-gray-700">
                Credential:
              </span>
              <span className="text-xl text-blue-600">
                {IssuedCredentials.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
