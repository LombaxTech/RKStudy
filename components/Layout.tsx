import { AuthContext } from "@/context/AuthContext";
import React, { useContext, useEffect } from "react";
import Navbar from "./Navbar";
import { useRouter } from "next/router";

export default function Layout({ children }: { children: any }) {
  const { user, userLoading } = useContext(AuthContext);

  const router = useRouter();
  const { pathname } = router;

  const isChatPage = pathname === "/ai-tutor";

  return (
    <div
      className={`flex flex-col min-h-screen bg-gray-100 overflow-x-hidden ${
        isChatPage ? "max-h-screen" : ""
      }`}
    >
      {user && <Navbar />}
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
