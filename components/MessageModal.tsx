import { AuthContext } from "@/context/AuthContext";
import { contactAddress, maxNumberOfQuizQuestions } from "@/data";
import { Dialog, Transition } from "@headlessui/react";
import { usePlausible } from "next-plausible";
import { Fragment, useContext } from "react";
import { FaFile } from "react-icons/fa";

export default function MessageModal({
  messageModalIsOpen,
  setMessageModalIsOpen,
}: {
  messageModalIsOpen: any;
  setMessageModalIsOpen: any;
}) {
  const plausible = usePlausible();

  const closeModal = () => setMessageModalIsOpen(false);
  const openModal = () => setMessageModalIsOpen(true);

  const { user } = useContext(AuthContext);

  return (
    <Transition appear show={messageModalIsOpen} as={Fragment}>
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
          <div className="fixed inset-0 bg-black/75" />
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
                <div className="flex flex-col items-center gap-2">
                  <h1 className="text-2xl font-bold">
                    Get more free generations
                  </h1>

                  <p className="mt-2 text-sm">
                    Therefore, if you would like more free generations, use the
                    button below to send us an email! Set the subject as 'AI
                    Quiz Generation Request' and let us know the email address
                    you used for your account.
                  </p>
                  <p className="mb-4 text-sm">
                    Since we are still in the alpha development phase, we do not
                    have premium accounts available yet.
                  </p>
                  <a href={`mailto:${contactAddress}`}>
                    <button className="btn btn-primary">
                      Request More Generations
                    </button>
                  </a>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
