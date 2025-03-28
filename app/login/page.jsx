"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import useUserStore from "../store/userStore";
import useStore from "../store/useStore";
import useWebSocketStore from "../store/useWebSocketStore";
import { Button } from "@/components/ui/button";
import { Lock, Mail, Loader2 } from "lucide-react";
import Image from "next/image";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useUserStore();
  const { connect } = useWebSocketStore();
  const {
    fetchConnection,
    getCredentialdefination,
    getSchema,
    credentialRecords,
    fetchProofRequest,
  } = useStore();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const res = await login({ email, password });
      if (res.success) {
        toast.success("Login successful! Loading your data...");
        
        // Execute all initialization requests in parallel
        await Promise.all([
          fetchConnection(),
          getCredentialdefination(),
          getSchema(),
          credentialRecords(),
          fetchProofRequest(),
        ]);
        
        // Connect WebSocket after successful initialization
        connect();
        
        // Redirect to dashboard
        router.push("/");
      } else {
        toast.error(res?.message || "Login failed. Please try again.");
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error.message || "An error occurred.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 text-white">
          <div className="flex items-center justify-center">
            <div>            
          <Image src="/logos/aries_agent/4.png" alt="Aries Agent Logo" width={170} height={170} />
            </div>
          </div>
          <p className="text-center text-blue-100 text-md">
          Securely connect, verify, and exchange trusted information with Aries Agent.
          </p>
        </div>

        {/* Login Form */}
        <div className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-white w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Logging in...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Login
                  </div>
                )}
              </Button>
            </div>
          </form>

          {/* Additional Links */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Don't have an account? <a href="/register" className="text-blue-600 dark:text-blue-400 hover:underline">Register here</a></p>
            <p className="mt-1"><a href="/forgot-password" className="text-blue-600 dark:text-blue-400 hover:underline">Forgot password?</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;