import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import { User } from "@/lib/types";
import { Dialog, Transition } from "@headlessui/react";
import { doc, updateDoc } from "firebase/firestore";
import { usePlausible } from "next-plausible";
import { Fragment, useContext, useState } from "react";

export default function SpecPageGuideModal() {
  const plausible = usePlausible();

  const [specPageGuideIsOpen, setSpecPageGuideIsOpen] = useState(true);

  const closeModal = () => setSpecPageGuideIsOpen(false);
  const openModal = () => setSpecPageGuideIsOpen(true);

  const { user, setUser }: { user: User; setUser: any } =
    useContext(AuthContext);

  const disableNotification = async () => {
    try {
      let previousDisabledGuides = user.disabledGuides || {};
      let updatedDisabledGuides = {
        ...previousDisabledGuides,
        specPageGuide: true,
      };

      await updateDoc(doc(db, "users", user.uid as string), {
        disabledGuides: updatedDisabledGuides,
      });

      setUser({ ...user, disabledGuides: updatedDisabledGuides });

      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Transition appear show={specPageGuideIsOpen} as={Fragment}>
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
          <div className="fixed inset-0 bg-black/50" />
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
                <div className="flex flex-col gap-8">
                  <h1 className="text-2xl">Tip: how to use the spec guide</h1>
                  <p className="text-sm text-gray-500">
                    Start by going through the syllabus and marking topics you
                    are confident with, unsure about, or not confident with by
                    clicking on the faces.
                  </p>
                  <p className="text-sm text-gray-500">
                    As you progress through your studies, update your confidence
                    ratings on each topic as you go.
                  </p>
                  <div className="flex flex-col gap-2">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={closeModal}
                    >
                      Got it
                    </button>
                    <span
                      className="text-center mt-2 text-sm text-gray-500 underline cursor-pointer"
                      onClick={disableNotification}
                    >
                      Don't show me this again
                    </span>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
