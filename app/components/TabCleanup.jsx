"use client";
import { useEffect } from "react";
import useUserStore from "../store/userStore";

const TabCleanup = () => {
  const { logOut } = useUserStore((state) => state);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const TAB_ID = `tab_${Math.random()}`;
      sessionStorage.setItem(TAB_ID, "active");

      const handleUnload = () => {
        sessionStorage.removeItem(TAB_ID);

        // If no active tabs are left, log out the user
        if (Object.keys(sessionStorage).length === 0) {
          localStorage.removeItem("issuer-storage");
          logOut();
        }
      };

      window.addEventListener("unload", handleUnload);

      // Cleanup the event listener when the component unmounts
      return () => {
        window.removeEventListener("unload", handleUnload);
      };
    }
  }, [logOut]);

  return null; // This component does not render anything
};

export default TabCleanup;
