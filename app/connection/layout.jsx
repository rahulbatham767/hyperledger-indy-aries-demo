"use client";
import React from "react";
import TabsNavigation from "../components/Connection";
 
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Tabs */}
        <div className="bg-white shadow-sm w-full">
          <TabsNavigation />
        </div>

        {/* Main Content Area */}
        <main className="py-8">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;