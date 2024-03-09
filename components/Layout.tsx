import { AuthContext } from "@/context/AuthContext";
import React, { useContext } from "react";
import Navbar from "./Navbar";

export default function Layout({ children }: { children: any }) {
  const { user, userLoading } = useContext(AuthContext);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 overflow-x-hidden">
      {user && <Navbar />}
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
