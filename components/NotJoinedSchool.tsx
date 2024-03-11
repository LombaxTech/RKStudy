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

export default function NotJoinedSchool() {
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

      if (!invite || !(invite.type === "student")) {
        console.log("invite does not exist");
        return setError("Invalid invitation code");
      }

      if (invite) {
        console.log("exists!!");

        // todo: check that the schools license is not overused

        // UPDATE SCHOOL
        await updateDoc(doc(db, "schools", invite.school.id), {
          students: arrayUnion({
            id: user.uid,
            email: user.email,
            name: user.name,
          }),
        });

        // UPDATE USER
        await updateDoc(doc(db, "users", user.uid), {
          schoolId: invite.school.id,
        });

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
          <h1 className="text-2xl font-bold">Join a school</h1>
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

          <Link href={"/join-invite-teacher"} className="underline text-lg">
            Joining as a teacher?
          </Link>
        </div>
        {/* <h1
          className="underline cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          Continue without joining a school?
        </h1> */}
      </div>
      <ConfirmationModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}

function ConfirmationModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: any;
  setIsOpen: any;
}) {
  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  const { user } = useContext(AuthContext);

  const [quizTitle, setQuizTitle] = useState("");
  const [quizAbout, setQuizAbout] = useState("");
  const [isQuizPrivate, setIsQuizPrivate] = useState<"Yes" | "No">("No");

  const continueWithoutJoiningSchool = async () => {
    try {
      await updateDoc(doc(db, "users", user.uid), {
        continuedWithoutSchool: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Are you sure you want to continue?
                </Dialog.Title>

                {/* CREATE QUIZ */}
                <div className="flex flex-col gap-2 mt-4">
                  <p className="">
                    Joining with a school will give you free access to all
                    features
                  </p>
                  <p className="text-sm font-light">
                    You can join a school later on too.
                  </p>

                  <button
                    className="btn btn-sm"
                    onClick={continueWithoutJoiningSchool}
                  >
                    Continue
                  </button>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
