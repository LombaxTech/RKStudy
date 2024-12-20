import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import { availableSpecs } from "@/lib/specData/specs";
import { User, UserSpec } from "@/lib/types";
import { updateDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { Dialog, Transition } from "@headlessui/react";
import { usePlausible } from "next-plausible";
import { Fragment, useContext, useState } from "react";

export default function RemoveSpecModal({
  removeSpecModalIsOpen,
  setRemoveSpecModalIsOpen,
  spec,
}: {
  removeSpecModalIsOpen: any;
  setRemoveSpecModalIsOpen: any;
  spec: UserSpec;
}) {
  const plausible = usePlausible();

  const closeModal = () => setRemoveSpecModalIsOpen(false);
  const openModal = () => setRemoveSpecModalIsOpen(true);

  const { user, setUser }: { user: User; setUser: any } =
    useContext(AuthContext);

  const removeSpec = async () => {
    try {
      let prevSpecs = user.specs || [];
      let updatedSpecs = prevSpecs.filter((spec) => spec.id !== spec.id);

      await updateDoc(doc(db, "users", user.uid as string), {
        specs: updatedSpecs,
      });

      setUser({ ...user, specs: updatedSpecs });

      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Transition appear show={removeSpecModalIsOpen} as={Fragment}>
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
                  <h1 className="text-2xl font-medium">
                    Are you sure you want to remove this syllabus?
                  </h1>
                  <p className="text-sm text-gray-500">
                    This action will remove all of your progress for this
                    syllabus.
                  </p>
                  <div className="flex items-center gap-2">
                    <button className="btn btn-primary" onClick={removeSpec}>
                      Yes
                    </button>
                    <button className="btn btn-secondary" onClick={closeModal}>
                      No
                    </button>
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