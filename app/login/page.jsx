"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import useUserStore from "../store/userStore";

function Page() {
  // State for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { login } = useUserStore();

  const route = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (!email || !password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }
    const data = {
      email,
      password,
    };
    // If valid, log the email and password (or handle it as needed)
    console.log("Form submitted with:", email, password);

    login(data)
      .then(() => {
        route.push("/");
      })
      .catch((err) => {
        toast.error(err.message);
      });

    setErrorMessage("");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-900 shadow-md rounded-md mt-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
        Login to OpeWallet
      </h2>

      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Access your secure decentralized identity provider.
      </p>

      {/* Error Message */}
      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white dark:bg-gray-800 dark:border-gray-700"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full px-3 py-2 border text-white rounded-md shadow-sm  focus:bg-gray-800"
          />
        </div>

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
