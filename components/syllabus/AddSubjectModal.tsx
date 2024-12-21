import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import { availableSpecs } from "@/lib/specData/specs";
import { User } from "@/lib/types";
import { updateDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { Dialog, Transition } from "@headlessui/react";
import { usePlausible } from "next-plausible";
import { Fragment, useContext, useState } from "react";

export default function AddSubjectModal({
  addSubjectModalIsOpen,
  setAddSubjectModalIsOpen,
}: {
  addSubjectModalIsOpen: any;
  setAddSubjectModalIsOpen: any;
}) {
  const plausible = usePlausible();

  const closeModal = () => setAddSubjectModalIsOpen(false);
  const openModal = () => setAddSubjectModalIsOpen(true);

  const { user, setUser }: { user: User; setUser: any } =
    useContext(AuthContext);

  const [selectedSpec, setSelectedSpec] = useState<string>("");

  const addSpec = async () => {
    if (!selectedSpec) return;

    const spec = availableSpecs.find((spec) => spec.id === selectedSpec);
    if (!spec) return;

    try {
      let userPreviousSpecs = user.specs || [];
      let userUpdatedSpecs = [
        ...userPreviousSpecs,
        {
          ...spec,
          studyPointConfidenceRatings: {},
          percentageCompleted: 0,
        },
      ];

      await updateDoc(doc(db, "users", user.uid as string), {
        specs: userUpdatedSpecs,
      });

      setUser({ ...user, specs: userUpdatedSpecs });
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Transition appear show={addSubjectModalIsOpen} as={Fragment}>
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
                  <h1 className="text-2xl font-bold">
                    Add a subject that you're studying
                  </h1>
                  {/* AVAILABLE SYLLABUSES */}
                  <div className="flex flex-col gap-4">
                    <select
                      className="p-2 outline-none border border-gray-300 rounded-md"
                      value={selectedSpec}
                      onChange={(e) => setSelectedSpec(e.target.value)}
                    >
                      <option value="">Select a subject</option>
                      {availableSpecs.map((spec) => {
                        if (
                          user.specs?.some(
                            (userSpec) => userSpec.id === spec.id
                          )
                        ) {
                          return null;
                        }
                        return (
                          <option key={spec.id} value={spec.id}>
                            {spec.title}
                          </option>
                        );
                      })}
                    </select>
                    <button
                      className="btn btn-primary"
                      disabled={!selectedSpec}
                      onClick={addSpec}
                    >
                      Add to your list
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
