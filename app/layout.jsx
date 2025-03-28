import Navbarup from "./components/Navbarup";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TabCleanup from "./components/TabCleanup";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: "Hyperledger Demo",
  description: "A decentralized identity for the Digital World",
  themeColor: "#3b82f6", // blue-500
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-gray-50 to-gray-100`}>
        {/* Tab Cleanup */}
        <TabCleanup />

        {/* Main Layout Structure */}
        <div className="min-h-screen flex flex-col">
          {/* Sticky Navigation Header - Full Width */}
          <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
            {/* Remove max-w container here to let Navbarup control its own width */}
            <Navbarup />
          </header>

          {/* Main Content Area */}
          <main className="flex-grow w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full my-12">
              {children}
            </div>
          </main>

          {/* Optional Footer */}
          <footer className="w-full bg-gray-800 text-white py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
              <p>Hyperledger Aries Demo - Decentralized Identity Solution</p>
            </div>
          </footer>
        </div>

        {/* Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          toastStyle={{
            fontSize: "14px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
          }}
        />
      </body>
    </html>
  );
}