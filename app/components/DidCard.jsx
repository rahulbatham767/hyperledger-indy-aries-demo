"use client";
import { animate, motion } from "framer-motion";
import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function DIdCard() {
  return (
    <Card>
      <CardSkeletonContainer>
        <Skeleton />
      </CardSkeletonContainer>
      <CardTitle>Endpoint DID:sdsadsakld2</CardTitle>
      <CardDescription></CardDescription>
    </Card>
  );
}

const Skeleton = () => {
  const scale = [1, 1.1, 1];
  const transform = ["translateY(0px)", "translateY(-4px)", "translateY(0px)"];
  const sequence = [
    [
      ".circle-1",
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
    [
      ".circle-2",
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
    [
      ".circle-3",
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
    [
      ".circle-4",
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
    [
      ".circle-5",
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
  ];

  useEffect(() => {
    animate(sequence, {
      // @ts-ignore
      repeat: Infinity,
      repeatDelay: 1,
    });
  }, []);
  return (
    <div className="p-8 overflow-hidden h-full relative flex items-center justify-center">
      <div className="flex flex-row flex-shrink-0 justify-center items-center gap-2">
        <Container className="h-8 w-8 circle-1">
          <Hyperledger className="h-4 w-4 " />
        </Container>
        <Container className="h-12 w-12 circle-2">
          <Linux className="h-6 w-6 dark:text-white" />
        </Container>
        <Container className="circle-3">
          <Indy className="h-8 w-8 dark:text-white" />
        </Container>

        <Container className="h-8 w-8 circle-5">
          <Aries className="h-4 w-4 " />
        </Container>
        <Container className="h-12 w-12 circle-4">
          <OpenWallet className="h-6 w-6 " />
        </Container>
      </div>
      <div className="h-40 w-px absolute top-20 m-auto z-40 bg-gradient-to-b from-transparent via-cyan-500 to-transparent animate-move">
        <div className="w-10 h-32 top-1/2 -translate-y-1/2 absolute -left-10">
          <Sparkles />
        </div>
      </div>
    </div>
  );
};
const Sparkles = () => {
  const randomMove = () => Math.random() * 2 - 1;
  const randomOpacity = () => Math.random();
  const random = () => Math.random();
  return (
    <div className="absolute inset-0">
      {[...Array(12)].map((_, i) => (
        <motion.span
          key={`star-${i}`}
          animate={{
            top: `calc(${random() * 100}% + ${randomMove()}px)`,
            left: `calc(${random() * 100}% + ${randomMove()}px)`,
            opacity: randomOpacity(),
            scale: [1, 1.2, 0],
          }}
          transition={{
            duration: random() * 2 + 4,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            top: `${random() * 100}%`,
            left: `${random() * 100}%`,
            width: `2px`,
            height: `2px`,
            borderRadius: "50%",
            zIndex: 1,
          }}
          className="inline-block bg-black dark:bg-white"
        ></motion.span>
      ))}
    </div>
  );
};

export const Card = ({ className, children }) => {
  return (
    <div
      className={cn(
        "max-w-sm w-full h-[25rem] mx-auto p-8 rounded-xl border border-[rgba(255,255,255,0.10)] dark:bg-[rgba(40,40,40,0.70)] bg-gray-100 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] group",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className }) => {
  return (
    <h3
      className={cn(
        "text-lg font-semibold text-gray-800 dark:text-white py-2",
        className
      )}
    >
      {children}
    </h3>
  );
};

export const CardDescription = ({ children, className }) => {
  return (
    <p
      className={cn(
        "text-sm font-normal text-neutral-600 dark:text-neutral-400 max-w-sm",
        className
      )}
    >
      {children}
    </p>
  );
};

export const CardSkeletonContainer = ({
  className,
  children,
  showGradient = true,
}) => {
  return (
    <div
      className={cn(
        "h-[10rem] rounded-xl z-40",
        className,
        showGradient &&
          "bg-neutral-300 dark:bg-[rgba(40,40,40,0.70)] [mask-image:radial-gradient(50%_50%_at_50%_50%,white_0%,transparent_100%)]"
      )}
    >
      {children}
    </div>
  );
};

const Container = ({ className, children }) => {
  return (
    <div
      className={cn(
        `h-16 w-16 rounded-full flex items-center justify-center bg-[rgba(248,248,248,0.01)]
    shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)]
    `,
        className
      )}
    >
      {children}
    </div>
  );
};

export const Hyperledger = ({ className }) => {
  return (
    <div>
      <Image
        src={
          "https://p1.hiclipart.com/preview/181/745/266/hyperledger-line-blockchain-distributed-ledger-linux-foundation-opensource-software-ethereum-computer-software-ibm-png-clipart-thumbnail.jpg"
        }
        width={"25"}
        height={"25"}
        alt="hyperledger"
      />
    </div>
  );
};

export const Indy = ({ className }) => {
  return (
    <div>
      <Image
        src={"/indy-logo.png"}
        width={"25"}
        height={"25"}
        alt="indy-logo"
      />
    </div>
  );
};
export const Linux = ({ className }) => {
  return (
    <div>
      <Image src={"/linux.png"} width={"25"} height={"25"} alt="linux" />
    </div>
  );
};
export const Aries = ({ className }) => {
  return (
    <div>
      <Image
        src={"https://idramp.com/wp-content/uploads/2020/06/HypLogo_Color.png"}
        width={"25"}
        height={"25"}
        alt="Aries"
      />
    </div>
  );
};

export const OpenWallet = ({ className }) => {
  return (
    <div>
      <Image src={"/wallet.png"} width={"25"} height={"25"} alt="open wallet" />
    </div>
  );
};
