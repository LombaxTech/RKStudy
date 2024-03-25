import { AuthContext } from "@/context/AuthContext";
import { studyLevels, subjects } from "@/data";
import { db } from "@/firebase";
import { getMonthAndYearAsString } from "@/helperFunctions";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import {
  addDoc,
  collection,
  doc,
  increment,
  updateDoc,
} from "firebase/firestore";
import { Fragment, useContext, useRef, useState } from "react";
import { FaFile } from "react-icons/fa";
import { createWorker } from "tesseract.js";

export default function GenerateNotesModal({
  createNotesModalIsOpen,
  setCreateNotesModalIsOpen,
  setNotes,
}: {
  createNotesModalIsOpen: any;
  setCreateNotesModalIsOpen: any;
  setNotes: any;
}) {
  const closeModal = () => setCreateNotesModalIsOpen(false);
  const openModal = () => setCreateNotesModalIsOpen(true);

  const { user } = useContext(AuthContext);

  const [notesTitle, setNotesTitle] = useState("");
  // const [quizAbout, setQuizAbout] = useState("");
  const [isNotesPrivate, setIsNotesPrivate] = useState<"Yes" | "No">("No");

  const [subject, setSubject] = useState<any>(subjects[0]);
  const [level, setLevel] = useState<any>(studyLevels[0]);

  const [creatingNotes, setCreatingNotes] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [file, setFile] = useState<any>(null);

  const fileInputRef = useRef<any>(null);

  const handleFileChange = (e: any) => {
    let file = e.target.files[0];

    setError("");
    if (file?.type === "application/pdf")
      return setError("PDFs are not yet supported.");
    if (!file?.type.startsWith("image/"))
      return setError("Please choose an image");

    setFile(e.target.files[0]);
  };

  const createNotes = async () => {
    setError("");
    setSuccess(false);
    setCreatingNotes(true);

    try {
      console.log("creating notes");

      if (!file) return console.log("You need to add a file");

      // CONVERT THE IMAGE TO BASE 64
      const reader = new FileReader();
      reader.readAsDataURL(file);

      let res: any;
      let questions: any;

      reader.onload = async () => {
        let base64img = reader.result;

        // GET THE TEXT CONTENT FROM THE IMAGE
        let textContent = "";

        const worker = await createWorker("eng");
        // @ts-ignore
        const ret = await worker.recognize(base64img);
        textContent = ret.data.text;
        await worker.terminate();

        // SEND THE TEXT OVER TO OPENAI AND GET A QUIZ BACK
        res = await axios.post(`/api/generate-notes`, {
          textContent: `Generate some study notes from the following study material: ${textContent}`,
        });

        let { notes } = res.data;

        const newNotes = {
          title: notesTitle,
          subject,
          level,
          createdBy: {
            userId: user.uid,
            name: user.name,
          },
          ...(user.schoolId && { schoolId: user.schoolId }),
          createdAt: new Date(),
          // questions: historyQuiz.questions,
          notes,
          public: isNotesPrivate === "Yes" ? false : true,
        };

        let newNotesDoc = await addDoc(collection(db, "notes"), newNotes);

        setNotes((oldNotes: any) => [
          ...oldNotes,
          { id: newNotesDoc.id, ...newNotes },
        ]);

        // INCREMENT USAGE
        const monthYear = getMonthAndYearAsString();
        await updateDoc(doc(db, "users", user.uid), {
          [`usage.${monthYear}`]: increment(1),
        });

        console.log("time to run");

        setNotesTitle("");
        setSuccess(true);
        setCreatingNotes(false);
        closeModal();
      };
    } catch (error) {
      console.log(error);
      setError("Something went wrong");
      setCreatingNotes(false);
    }
  };

  return (
    <Transition appear show={createNotesModalIsOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => {
          if (!creatingNotes) closeModal();
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
              {creatingNotes ? (
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex flex-col items-center gap-2">
                    <span className="loading loading-spinner loading-lg"></span>
                    <h1 className="">Creating Notes. Please wait a moment</h1>
                    <h1 className="text-sm">
                      This can take a few minutes depending on the amount and
                      size of files
                    </h1>
                  </div>
                </Dialog.Panel>
              ) : (
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Create Notes
                  </Dialog.Title>

                  {/* CREATE QUIZ */}
                  <div className="flex flex-col gap-6 mt-4">
                    <div className="flex flex-col gap-2">
                      <label className="">Title</label>
                      <input
                        type="text"
                        placeholder="Enter notes title"
                        className="p-1 outline-none border"
                        value={notesTitle}
                        onChange={(e) => setNotesTitle(e.target.value)}
                      />
                    </div>
                    {/* <div className="flex flex-col gap-2">
                      <label className="">About (optional)</label>

                      <textarea
                        placeholder="What is the quiz about?"
                        className="p-2 outline-none border"
                        value={quizAbout}
                        onChange={(e) => setQuizAbout(e.target.value)}
                      />
                    </div> */}

                    <div className="flex flex-col gap-2">
                      <label className="">Select Subject (optional)</label>
                      <select
                        className="p-2 w-full max-w-xs border"
                        value={subject}
                        // @ts-ignore
                        onChange={(e) => setSubject(e.target.value)}
                      >
                        {subjects.map((subject) => {
                          return <option key={subject}>{subject}</option>;
                        })}
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="">
                        Select Academic Level (optional)
                      </label>
                      <select
                        className="p-2 w-full max-w-xs border"
                        value={level}
                        // @ts-ignore
                        onChange={(e) => setLevel(e.target.value)}
                      >
                        {studyLevels.map((level) => {
                          return <option key={level}>{level}</option>;
                        })}
                      </select>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="w-8/12">Make notes private? </label>
                      <select
                        className="p-2 w-full max-w-xs border"
                        value={isNotesPrivate}
                        // @ts-ignore
                        onChange={(e) => setIsQuizPrivate(e.target.value)}
                      >
                        <option>Yes</option>
                        <option>No</option>
                      </select>
                    </div>

                    {/* UPLOAD FILES TO GENERATE QUIZ FROM */}
                    <div className="flex flex-col gap-2 mt-2">
                      {/* <label className="">
                          Upload files to generate quiz from
                        </label> */}
                      <input
                        type="file"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        style={{ display: "none" }}
                      />
                      <button
                        disabled={file}
                        className="btn btn-sm"
                        onClick={() => {
                          // @ts-ignore
                          fileInputRef?.current?.click();
                        }}
                      >
                        Choose image to generate notes from
                      </button>

                      {file && (
                        <div className="flex justify-center items-center gap-2 mt-4">
                          <div className="flex flex-col items-center">
                            <span className="">
                              <FaFile size={30} />
                            </span>
                            <span className="">{file.name}</span>
                          </div>
                          <button
                            className="btn btn-sm"
                            onClick={() => setFile(null)}
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>

                    {error && (
                      <div className="p-2 bg-red-200 text-red-500 text-center">
                        {error}
                      </div>
                    )}

                    <button
                      className="btn btn-primary"
                      onClick={createNotes}
                      disabled={!file || !notesTitle}
                    >
                      Create Notes
                    </button>
                  </div>
                </Dialog.Panel>
              )}
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
