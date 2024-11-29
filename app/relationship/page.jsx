"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input"; // Added FormProvider
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Relationship } from "../components/dialog/Relatioship";

const Page = () => {
  return (
    <div className="flex justify-end mr-3 mt-4">
      <Relationship />
    </div>
  );
};

export default Page;
