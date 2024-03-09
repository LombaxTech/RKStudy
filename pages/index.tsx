import { addDoc, collection } from "firebase/firestore";
import React, { useContext, useEffect } from "react";

import { app, auth, db } from "@/firebase";
import { AuthContext } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import SetupAccount from "@/components/SetupAccount";
import StudentHome from "@/components/StudentHome";
import Link from "next/link";

export default function App() {
  const { user, userLoading } = useContext(AuthContext);

  const router = useRouter();

  if (!userLoading && user?.setup === false) return <SetupAccount />;

  if (!userLoading && user?.type === "superadmin")
    router.push(`/superadmin/home`);
  if (!userLoading && user?.type === "teacher") router.push(`/school/home`);

  if (!userLoading && user?.type === "student") return <StudentHome />;

  if (!userLoading && !user) return <NotSignedInScreen />;

  return <div className="">{!user && <div>No user found</div>}</div>;
}

const NotSignedInScreen = () => {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">RKQuizzer</h1>
      <h3 className="text-xl font-medium">
        Generate, share and boost grades with our quiz platform
      </h3>
      <Link href={`/signin`}>
        <button className="btn btn-primary">Get Started</button>
      </Link>
    </div>
  );
};
