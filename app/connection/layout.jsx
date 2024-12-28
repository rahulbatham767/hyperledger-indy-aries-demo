import React from "react";
import TabsNavigation from "../components/Connection";

const Layout = ({ children }) => {
  return (
    <div>
      <TabsNavigation />

      <div className="mt-5 mx-auto w-full">{children}</div>
    </div>
  );
};

export default Layout;
