import { AuthContext } from "@/context/AuthContext";
import React, { useContext, useEffect } from "react";
import Navbar from "./Navbar";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Layout({ children }: { children: any }) {
  const { user, userLoading } = useContext(AuthContext);

  const router = useRouter();
  const { pathname } = router;

  const isChatPage = pathname === "/ai-tutor";
  const isLandingPage = !userLoading && !user && pathname === "/";
  const isAuthPage = pathname === "/signup" || pathname === "/signin";
  const isDemo = pathname === "/demo";

  return (
    <div
      className={`flex flex-col min-h-screen bg-gray-100 overflow-x-hidden ${
        isChatPage ? "max-h-screen" : ""
      }`}
    >
      {!isLandingPage && !isAuthPage && <InDevelopmentNotification />}
      {isLandingPage ? null : <Navbar />}
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

const InDevelopmentNotification = () => (
  <div className="p-2 bg-primary text-primary-content">
    <Link href={"/feedback"} className="flex items-center gap-2 justify-center">
      <h1 className="text-center font-bold text-lg">
        We're still in development!
      </h1>
      <h1 className="text-center text-sm underline">
        Help us make you the best study platform
      </h1>
    </Link>
  </div>
);
