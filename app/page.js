import Image from "next/image";
import { DIdCard } from "./components/DidCard";

export default function Home() {
  return (
    <div className="flex flex-col">
      <div className="mx-auto">
        <h3 className="text-5xl font-bold">Welcome Alice </h3>
      </div>
      <div className="mt-6">
        <DIdCard />
      </div>
    </div>
  );
}
