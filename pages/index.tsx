import { addDoc, collection } from "firebase/firestore";
import React, { useContext, useEffect } from "react";

import { app, auth, db } from "@/firebase";
import { AuthContext } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import SetupAccount from "@/components/SetupAccount";
import StudentHome from "@/components/StudentHome";
import Link from "next/link";
import NotSignedInScreen from "@/components/NotSignedInScreen";

export default function App() {
  const { user, userLoading } = useContext(AuthContext);

  const router = useRouter();

  if (!userLoading && user?.setup === false) return <SetupAccount />;

  if (!userLoading && user?.type === "superadmin")
    router.push(`/superadmin/home`);
  if (!userLoading && user?.type === "teacher") router.push(`/school/home`);

  if (!userLoading && user?.type === "student") return <StudentHome />;

  if (!userLoading && !user) return <NotSignedInScreen />;

  return <NotSignedInScreen />;
}
