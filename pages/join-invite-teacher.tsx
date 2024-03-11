import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import React, { useContext, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function JoinInviteTeacher() {
  const router = useRouter();

  const { user } = useContext(AuthContext);

  const [error, setError] = useState<any>("");

  const [isOpen, setIsOpen] = useState(false);

  const [inviteCode, setInviteCode] = useState<any>("");
  const [invite, setInvite] = useState<any>(null);

  const joinSchool = async () => {
    setError("");

    try {
      // const q = query()

      let invitesSnapshot = await getDocs(collection(db, "invites"));

      let invite: any = null;

      invitesSnapshot.forEach((inviteDoc) => {
        if (inviteDoc.data().code === inviteCode)
          invite = { id: inviteDoc.id, ...inviteDoc.data() };
      });

      console.log(invite);

      if (!invite || !(invite.type === "teacher")) {
        console.log("invite does not exist");
        return setError("Invalid invitation code");
      }

      if (invite) {
        console.log("exists!!");

        // todo: check that the schools license is not overused

        // UPDATE SCHOOL
        await updateDoc(doc(db, "schools", invite.school.id), {
          admins: arrayUnion({
            id: user.uid,
            email: user.email,
            name: user.name,
          }),
        });

        // UPDATE USER
        await updateDoc(doc(db, "users", user.uid), {
          schoolId: invite.school.id,
          type: "teacher",
        });

        router.push("/");

        console.log("Joined school!");
      }
    } catch (error) {
      console.log(error);
      setError("Something went wrong. Please try again");
    }
  };

  return (
    <>
      <div className="p-10 flex flex-col items-center gap-4">
        <div className="flex flex-col gap-4 w-5/12">
          <h1 className="text-2xl font-bold">Join a school as a teacher</h1>
          <input
            type="text"
            className="p-2 border"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="Enter invitation code"
          />
          <button
            className="btn btn-primary"
            onClick={joinSchool}
            disabled={!inviteCode}
          >
            Join School
          </button>
          {error && (
            <div className="p-2 bg-red-200 text-red-700 text-center">
              {error}
            </div>
          )}

          <Link href={"/"} className="underline text-lg">
            Are you a student?
          </Link>
        </div>
        {/* <h1
          className="underline cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          Continue without joining a school?
        </h1> */}
      </div>
    </>
  );
}
