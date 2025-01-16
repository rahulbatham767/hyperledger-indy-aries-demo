"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useUserStore from "../store/userStore";
import LoadingScr from "./LoadingScr";
import logo from "../OpenWallet_Foundation_Logo_Color.png";
import Image from "next/image";
import useWebSocketStore from "../store/useWebSocketStore";
const Navbarup = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { loading, user, isLoggedIn, role, logOut } = useUserStore();
  const { disconnect } = useWebSocketStore();
  // Define menu items for each role
  const roleBasedMenu = {
    admin: [
      { href: "/credentials", label: "Credentials" },
      // { href: "/records", label: "Credential-Records" },
      { href: "/issuing", label: "Issue-Credentials" },
    ],
    user: [
      // { href: "/send-proposal", label: "Send Proposal" },
      { href: "/present-proof", label: "Present Proof" },
      { href: "/request-credential", label: "Request Credential" },
      { href: "/records", label: "Credential" },
    ],
    verifier: [
      { href: "/proof-request", label: "Proof Request" },
      { href: "/validate-proof", label: "Validate Proof" },
    ],
  };

  const commonMenu = [
    { href: "/connection", label: "Connection" },
    { href: "/message", label: "Message" },
  ];
  const menuItems = isLoggedIn
    ? [...commonMenu, ...(roleBasedMenu[role] || [])]
    : [];

  // Handle logout functionality
  const handleLogout = () => {
    logOut();
    disconnect();
    router.push("/login");
  };

  // Utility function for dynamic link styling
  const getNavLinkClass = (isActive) =>
    `cursor-pointer px-2 py-2 rounded-md text-center text-sm font-medium ${
      isActive ? "bg-blue-500 text-white" : "hover:bg-gray-700 hover:text-white"
    }`;

  if (loading) return <LoadingScr />;

  return (
    <nav className="flex items-center justify-between p-2 text-white w-full">
      {/* Left Navigation */}

      <div className="w-50 flex uppercase">
        {" "}
        <Link href="/">
          {user ? (
            user.name
          ) : (
            <Image
              src={logo}
              alt="logo"
              width={112}
              height={32}
              className="hidden lg:visible md:block"
            />
          )}
        </Link>
      </div>
      <div className="flex gap-4 ml-auto items-center">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={getNavLinkClass(pathname === item.href)}
            aria-current={pathname === item.href ? "page" : undefined}
            aria-label={item.label}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Right Navigation */}
      <div className="flex">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="cursor-pointer px-3 py-2 rounded-md text-sm ml-2 font-medium hover:bg-red-600"
            aria-label="Logout"
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              href="/login"
              className="cursor-pointer px-3 py-2 rounded-md text-sm font-medium hover:bg-green-600"
              aria-label="Login"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="cursor-pointer px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600"
              aria-label="Register"
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
