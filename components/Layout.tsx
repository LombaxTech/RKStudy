import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import { isOlderThanYesterday, isToday, isYesterday } from "@/helperFunctions";
import { showSuccessNotificationAtom } from "@/lib/atoms/atoms";
import { doc, updateDoc } from "firebase/firestore";
import { useAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import Navbar from "./Navbar";
import TodoAddedNotification from "./syllabus/TodoAddedNotification";

export default function Layout({ children }: { children: any }) {
  const { user, userLoading } = useContext(AuthContext);

  const router = useRouter();
  const { pathname } = router;

  const isChatPage = pathname === "/ai-tutor";
  const isLandingPage = !userLoading && !user && pathname === "/";
  const isAuthPage = pathname === "/signup" || pathname === "/signin";
  const isDemo = pathname === "/demo";

  const [showSuccessNotification, setShowSuccessNotification] = useAtom(
    showSuccessNotificationAtom
  );

  return (
    <>
      <div
        className={`flex flex-col min-h-screen bg-gray-100 overflow-x-hidden ${
          isChatPage ? "max-h-screen" : ""
        }`}
      >
        {!isLandingPage && !isAuthPage && (
          <>
            <InDevelopmentNotification />
            <StudyStreak />
          </>
        )}
        {isLandingPage ? null : <Navbar />}
        <div
          className={`flex-1 flex flex-col ${
            isChatPage ? "overflow-y-auto" : ""
          }`}
        >
          {children}
        </div>
      </div>
      {showSuccessNotification && <TodoAddedNotification />}
    </>
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

const StudyStreak = () => {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function updateStudyStreak() {
      let lastSeen;

      if (!user.lastSeen) {
        lastSeen = new Date();
      } else {
        if (user.lastSeen.nanoseconds) {
          lastSeen = user.lastSeen.toDate();
        } else {
          lastSeen = user.lastSeen;
        }
      }

      if (isToday(lastSeen) && !user.studyStreak) {
        await updateDoc(doc(db, "users", user.uid), {
          lastSeen: new Date(),
          studyStreak: 1,
        });
      }

      if (isYesterday(lastSeen)) {
        await updateDoc(doc(db, "users", user.uid), {
          lastSeen: new Date(),
          studyStreak: user.studyStreak + 1,
        });
      }

      if (isOlderThanYesterday(lastSeen)) {
        await updateDoc(doc(db, "users", user.uid), {
          lastSeen: new Date(),
          studyStreak: 1,
        });
      }
    }

    if (user) updateStudyStreak();
  }, [user]);

  return (
    <div className="bg-secondary text-secondary-content p-2">
      <h1 className="text-center font-bold text-lg">
        Study Streak: {user?.studyStreak} day
        {user?.studyStreak === 1 ? "" : "s"}
      </h1>
    </div>
  );
};
