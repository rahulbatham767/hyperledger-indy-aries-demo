"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useUserStore from "../store/userStore";
import LoadingScr from "./LoadingScr";
import logo from "/public/logos/aries_agent/4.png";
import Image from "next/image";
import useWebSocketStore from "../store/useWebSocketStore";
import { Button } from "@/components/ui/button";
import { LogOut, User, Menu, X } from "lucide-react";

const Navbarup = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { loading, user, isLoggedIn, role, logOut } = useUserStore();
  const { disconnect } = useWebSocketStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Define menu items for each role
  const roleBasedMenu = {
    admin: [
      { href: "/credentials", label: "Credentials" },
      { href: "/issuing", label: "Issue Credentials" },
    ],
    user: [
      { href: "/present-proof", label: "Present Proof" },
      { href: "/request-credential", label: "Request Credential" },
      { href: "/records", label: "Credentials" },
    ],
    verifier: [
      { href: "/proof-request", label: "Proof Request" },
      { href: "/validate-proof", label: "Validate Proof" },
    ],
  };

  const commonMenu = [
    { href: "/connection/active", label: "Connections" },
    { href: "/message", label: "Messages" },
  ];

  const menuItems = isLoggedIn
    ? [...commonMenu, ...(roleBasedMenu[role] || [])]
    : [];

  // Handle logout functionality
  const handleLogout = () => {
    logOut();
    disconnect();
    router.push("/login");
    setMobileMenuOpen(false);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (loading) return <LoadingScr />;

  return (
    <nav className="bg-gray-900 text-white shadow-lg fixed w-full z-50">
      {/* Full width container */}
      <div className="w-full">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              {user ? (
                <div className="flex items-center">
                  <User className="h-6 w-6 mr-2 text-blue-400" />
                  <span className="font-medium">{user.name}</span>
                </div>
              ) : (
                <Image
                  src={logo}
                  alt="logo"
                  width={112}
                  height={32}
                  className="h-8 w-auto"
                />
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    pathname === item.href
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {isLoggedIn ? (
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Link href="/login">
                    <Button variant="outline" className="text-white bg-blue-600 border-gray-600 hover:bg-gray-700">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Full width dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-800 w-full">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === item.href
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            {isLoggedIn ? (
              <div className="px-2 space-y-1">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <div className="flex items-center">
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                  </div>
                </button>
              </div>
            ) : (
              <div className="px-2 space-y-2">
                <Link
                  href="/login"
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium  bg-blue-600 text-white hover:bg-blue-700"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbarup;