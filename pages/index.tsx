import { useContext } from "react";

import NotSignedInScreen from "@/components/NotSignedInScreen";
import SetupAccount from "@/components/SetupAccount";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/router";

export default function App() {
  const { user, userLoading } = useContext(AuthContext);

  const router = useRouter();

  // if (!userLoading && user?.setup === false) return <SetupAccount />;
  if (!userLoading && !user) return <NotSignedInScreen />;
  if (!userLoading && user) router.push("/syllabus");

  // ROUTES CURRENTLY OUT OF USE
  if (!userLoading && user?.type === "superadmin")
    router.push(`/superadmin/home`);
  if (!userLoading && user?.type === "teacher") router.push(`/school/home`);

  // if (!userLoading && user?.type === "student") return <StudentHome />;

  return <NotSignedInScreen />;
}
