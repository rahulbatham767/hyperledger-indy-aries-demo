"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useUserStore from "../store/userStore";
import LoadingScr from "./LoadingScr";

const Navbarup = () => {
  const pathname = usePathname();
  const { loading, isLoggedIn, role, logOut } = useUserStore();
  // Define menu items
  const adminMenu = [
    { href: "/credentials", label: "Credentials" },
    { href: "/records", label: "Credential-Records" },
    { href: "/issuing", label: "Issue-Credentials" },
  ];

  const userMenu = [
    { href: "/send-proposal", label: "Send Proposal" },
    { href: "/present-proof", label: "Present Proof" },
    { href: "/records", label: "Credential" },
  ];

  const verifierMenu = [
    { href: "/proof-request", label: "Proof Request" },
    { href: "/validate-proof", label: "Validate Proof" },
  ];

  const commonMenu = [{ href: "/connection", label: "Connection" }];

  // Combine role-specific menu items
  let menuItems = isLoggedIn ? [...commonMenu] : [];
  if (isLoggedIn && role === "admin") menuItems.push(...adminMenu);
  else if (isLoggedIn && role === "user") menuItems.push(...userMenu);
  else if (isLoggedIn && role === "verifier") menuItems.push(...verifierMenu);

  // Auth menu items

  const handleLogout = () => {
    logOut();
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("isLoggedIn");

    router.push("/login");
  };

  return (
    <nav className="flex items-center justify-between p-3 text-white">
      {/* Left Navigation */}
      {loading ? (
        <LoadingScr />
      ) : (
        <div className="flex gap-4">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <span
                className={`cursor-pointer px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === item.href
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-700 hover:text-white"
                }`}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* Right Navigation */}
      <div className="flex gap-4">
        {/* Check if the user is logged in */}
        {isLoggedIn ? (
          // Logout button
          <button
            onClick={handleLogout}
            className="cursor-pointer px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600"
          >
            Logout
          </button>
        ) : (
          <>
            {/* Login button */}
            <Link
              href={"/login"}
              className="cursor-pointer px-3 py-2 rounded-md text-sm font-medium hover:bg-green-600"
            >
              Login
            </Link>

            {/* Register button */}
            <Link
              href={"/register"}
              className="cursor-pointer px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbarup;
