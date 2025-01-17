import Navbarup from "./components/Navbarup";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import TabCleanup from "./components/TabCleanup";
import Notification from "./components/Notification";

export const metadata = {
  title: "Hyperledger Demo",
  description: "A decentralized identity for the Digital World",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen overflow-auto bg-gray-50">
        <div className="flex-grow">
          {/* Navbar */}
          <TabCleanup />
          <header className="w-full bg-slate-500">
            <div className="flex justify-between items-center px-4 sm:px-6 md:px-8 font-semibold">
              {/* Logo Section */}

              {/* Navbar Section */}
              <Navbarup />
            </div>
          </header>

          {/* Toast Notifications */}
          <Notification />
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
          <main className="flex-grow overflow-auto poppins-regular">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
