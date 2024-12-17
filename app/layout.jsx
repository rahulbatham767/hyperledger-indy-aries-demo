import Navbarup from "./components/Navbarup";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import Image from "next/image";
import logo from "./OpenWallet_Foundation_Logo_Color.png";

export const metadata = {
  title: "Hyperledger Demo",
  description: "A decentralized identity for the Digital World",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full overflow-x-hidden">
      <body className="h-full flex flex-col">
        <div className="flex-grow">
          {/* Navbar */}
          <header className="w-full bg-slate-500">
            <div className="flex justify-between items-center px-4">
              {/* Logo Section */}
              <div className="w-[7rem]">
                <Link href="/">
                  <Image src={logo} alt="logo" sizes="full" />
                </Link>
              </div>
              {/* Navbar Section */}
              <Navbarup />
            </div>
          </header>

          {/* Toast Notifications */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            style={{ fontSize: "16px" }}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />

          {/* Main Content */}

          <main className="p-4 flex-grow overflow-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
