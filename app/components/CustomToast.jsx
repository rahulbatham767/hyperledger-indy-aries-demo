"use client";
import React, { useEffect } from "react";
import { toast as notifi } from "react-toastify";

const CustomToast = () => {
  const { toast } = useToastStore(); // Access the toast state

  useEffect(() => {
    if (toast.isVisible) {
      // Dynamically handle the toast type
      notifi[toast.type]?.(toast.message, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }, [toast]); // Trigger whenever `toast` state changes

  return null; // No additional rendering is needed
};

export default CustomToast;
