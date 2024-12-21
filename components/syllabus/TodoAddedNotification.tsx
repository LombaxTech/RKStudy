import Link from "next/link";
import { useAtom } from "jotai";
import { showSuccessNotificationAtom } from "@/lib/atoms/atoms";
import { useEffect } from "react";

export default function TodoAddedNotification() {
  const [showSuccessNotification, setShowSuccessNotification] = useAtom(
    showSuccessNotificationAtom
  );

  useEffect(() => {
    setTimeout(() => {
      setShowSuccessNotification(false);
    }, 5000);
  }, [showSuccessNotification]);

  return (
    <div className="fixed bottom-0 w-full">
      <div className="alert alert-success rounded-none flex justify-center items-center">
        <span className="text-white text-center font-medium">
          Task added to your todo list
        </span>
        <Link href="/todo">
          <span className="text-white text-center underline">
            View your todo list
          </span>
        </Link>
      </div>
    </div>
  );
}
