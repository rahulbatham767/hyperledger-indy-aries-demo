import { Box } from "lucide-react";
import { Background } from "./components/Background";
import Navbarup from "./components/Navbarup";
import "./globals.css";
import logo from "./OpenWallet_Foundation_Logo_Color.png";
import Image from "next/image";
export const metadata = {
  title: "Hyperledger Demo",
  description: "A decenteralized identity for Digital World",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div>
          <div className="w-full flex items-center flex bg-slate-500 opacity-3 rounded-b-md">
            <div className="w-[7rem]">
              <Image src={logo} width={"25px"} height={"25px"} alt="logo" />
            </div>
            <Navbarup />
          </div>

          {/* <div>
            <Background />
          </div> */}
          {children}
        </div>
      </body>
    </html>
  );
}
