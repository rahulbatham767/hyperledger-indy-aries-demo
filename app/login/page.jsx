"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import useUserStore from "../store/userStore";
import useStore from "../store/useStore";

const InputField = ({ id, type, placeholder, value, onChange }) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {placeholder}
    </label>
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white dark:bg-gray-800 dark:border-gray-700"
    />
  </div>
);

function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useUserStore();
  const {
    fetchConnection,
    getCredentialdefination,
    getSchema,
    credentialRecords,
  } = useStore();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      await login({ email, password }).then(() => {
        router.push("/"); // Redirect after successful login
        fetchConnection();

        getCredentialdefination();
        getSchema();
        credentialRecords();
      });
    } catch (err) {
      toast.error(err.message);
    }

    setErrorMessage(""); // Clear error message on form submission
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-900 shadow-md rounded-md mt-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
        Login to OpenWallet
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Access your secure decentralized identity provider.
      </p>

      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Page;
