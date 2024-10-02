import { AuthContext } from "@/context/AuthContext";
import React, { useContext, useEffect } from "react";
import Navbar from "./Navbar";
import { useRouter } from "next/router";

export default function Layout({ children }: { children: any }) {
  const { user, userLoading } = useContext(AuthContext);

  const router = useRouter();
  const { pathname } = router;

  const isChatPage = pathname === "/ai-tutor";
  const isLandingPage = !userLoading && !user && pathname === "/";
  const isAuthPage = pathname === "/signup" || pathname === "/signin";

  return (
    <div
      className={`flex flex-col min-h-screen bg-gray-100 overflow-x-hidden ${
        isChatPage ? "max-h-screen" : ""
      }`}
    >
      {isLandingPage || isAuthPage ? null : <Navbar />}
      <div
        className={`flex-1 flex flex-col ${
          isChatPage ? "overflow-y-auto" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}
