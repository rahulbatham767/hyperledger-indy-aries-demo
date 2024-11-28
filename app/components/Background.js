import React from "react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

export function Background() {
  return (
    <BackgroundBeamsWithCollision>
      <h2 className="text-2xl relative z-20  md:text-4xl lg:text-5xl font-bold text-center text-black dark:text-white font-sans tracking-tight">
        <span className="block">HYPERLEDGER INDY</span>
        <br />
        <div className="relative [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
          <div className="bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
            <span>ENABLING DECENTRALIZED</span>
          </div>
          <div className="bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
            <span>DIGITAL IDENTITIES</span>
          </div>
        </div>
      </h2>
    </BackgroundBeamsWithCollision>
  );
}
