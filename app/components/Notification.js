"use client";
import React, { useEffect } from "react";
import useWebSocketStore from "../store/useWebSocketStore";
import { toast } from "react-toastify";
import Link from "next/link";

const Notification = () => {
  const { recievedMessage, newMessageNotification, clearNotification } =
    useWebSocketStore();

  useEffect(() => {
    // Show toast if there is a new message and reset notification state
    if (newMessageNotification && recievedMessage) {
      toast.success(
        <Link href={"/message"}>
          <strong>New Message Received:</strong>
          <p>{recievedMessage}</p>
        </Link>
      );

      clearNotification(); // Clear the notification state after showing the toast
    }
  }, [newMessageNotification, recievedMessage, clearNotification]);

  return <div></div>; // Nothing to display here as we are using toast for notifications
};

export default Notification;
