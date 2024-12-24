"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useUserStore from "../store/userStore";
import LoadingScr from "./LoadingScr";

const Navbarup = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { loading, isLoggedIn = false, role = "", logOut } = useUserStore();

  // Define menu items for each role
  const roleBasedMenu = {
    admin: [
      { href: "/credentials", label: "Credentials" },
      { href: "/records", label: "Credential-Records" },
      { href: "/issuing", label: "Issue-Credentials" },
    ],
    user: [
      { href: "/send-proposal", label: "Send Proposal" },
      { href: "/present-proof", label: "Present Proof" },
      { href: "/records", label: "Credential" },
    ],
    verifier: [
      { href: "/proof-request", label: "Proof Request" },
      { href: "/validate-proof", label: "Validate Proof" },
    ],
  };

  const commonMenu = [{ href: "/connection", label: "Connection" }];
  const menuItems = isLoggedIn
    ? [...commonMenu, ...(roleBasedMenu[role] || [])]
    : [];

  // Handle logout functionality
  const handleLogout = () => {
    logOut();
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("isLoggedIn");
    router.push("/login");
  };

  // Utility function for dynamic link styling
  const getNavLinkClass = (isActive) =>
    `cursor-pointer px-3 py-2 rounded-md text-sm font-medium ${
      isActive ? "bg-blue-600 text-white" : "hover:bg-gray-700 hover:text-white"
    }`;

  if (loading) return <LoadingScr />;

  return (
    <nav className="flex items-center justify-between p-3 text-white">
      {/* Left Navigation */}
      <div className="flex gap-4 items-center">
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
      <div className="flex gap-4">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="cursor-pointer px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600"
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
