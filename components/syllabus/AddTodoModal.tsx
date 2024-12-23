import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import { showSuccessNotificationAtom } from "@/lib/atoms/atoms";
import { Point, Todo, User, UserSpec } from "@/lib/types";
import { Dialog, Transition } from "@headlessui/react";
import { addDoc, collection } from "firebase/firestore";
import { useAtom } from "jotai";
import { usePlausible } from "next-plausible";
import { Fragment, useContext, useState } from "react";

export default function AddTodoModal({
  addTodoModalIsOpen,
  setAddTodoModalIsOpen,
  point,
  spec,
  setTodos,
}: {
  addTodoModalIsOpen: any;
  setAddTodoModalIsOpen: any;
  point?: Point;
  spec?: UserSpec;
  setTodos?: any;
}) {
  const plausible = usePlausible();

  const closeModal = () => setAddTodoModalIsOpen(false);
  const openModal = () => setAddTodoModalIsOpen(true);

  const { user, setUser }: { user: User; setUser: any } =
    useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState(point?.title || "");
  const [dueDate, setDueDate] = useState<Date | null>(null);

  const [showSuccessNotification, setShowSuccessNotification] = useAtom(
    showSuccessNotificationAtom
  );

  const addTask = async () => {
    setLoading(true);
    try {
      const newTodo: Todo = {
        title,
        createdBy: user.uid as string,
        createdAt: new Date(),
        completed: false,
        ...(point && { point }),
        ...(dueDate && { dueDate: new Date(dueDate) }),
        ...(spec && {
          subjectInfo: {
            id: spec.id,
            title: spec.title,
          },
        }),
      };

      let newTodoDoc = await addDoc(collection(db, "todos"), newTodo);

      setShowSuccessNotification(true);

      if (setTodos) {
        setTodos((prevTodos: Todo[]) => [
          ...prevTodos,
          { id: newTodoDoc.id, ...newTodo },
        ]);
      }

      closeModal();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={addTodoModalIsOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => {
          if (!loading) {
            closeModal();
          }
        }}
      >
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
                  <h1 className="text-2xl font-medium">New Task</h1>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      Task Title
                    </label>
                    <textarea
                      className="outline-none p-2 rounded-md border-2 border-gray-300"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  {/* DUE DATE */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="dueDate" className="text-sm font-medium">
                      Due Date
                    </label>

                    <input
                      className="outline-none p-2 rounded-md border-2 border-gray-300"
                      type="date"
                      // @ts-ignore
                      value={dueDate}
                      // @ts-ignore
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>

                  <button
                    className="btn btn-primary"
                    onClick={addTask}
                    disabled={loading || !title}
                  >
                    {loading ? "Adding..." : "Add task to my todo list"}
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
