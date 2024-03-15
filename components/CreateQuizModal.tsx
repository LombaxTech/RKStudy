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

export default function CreateQuizModal({
  createQuizModalIsOpen,
  setCreateQuizModalIsOpen,
  setQuizzes,
}: {
  createQuizModalIsOpen: any;
  setCreateQuizModalIsOpen: any;
  setQuizzes: any;
}) {
  const closeModal = () => setCreateQuizModalIsOpen(false);
  const openModal = () => setCreateQuizModalIsOpen(true);

  const { user } = useContext(AuthContext);

  const [quizTitle, setQuizTitle] = useState("");
  const [quizAbout, setQuizAbout] = useState("");
  const [isQuizPrivate, setIsQuizPrivate] = useState<"Yes" | "No">("No");

  const [subject, setSubject] = useState<any>(subjects[0]);
  const [level, setLevel] = useState<any>(studyLevels[0]);

  const [creatingQuiz, setCreatingQuiz] = useState(false);
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

  const createQuiz = async () => {
    setError("");
    setSuccess(false);
    setCreatingQuiz(true);

    try {
      // todo: check how many quizzes student has generated this month

      console.log("creating quiz");

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
        res = await axios.post(`/api/test`, {
          //  textContent: `Generate a quiz of 5 questions with 3 options using the following content as the revision material: ${textContent}`,
          textContent: `Generate a quiz of 5 questions using the following content as the revision material: ${textContent}`,
        });

        let quiz = res.data.quiz;
        console.log(quiz);
        questions = JSON.parse(quiz).questions;

        console.log("questions");
        console.log(questions);

        const newQuiz = {
          title: quizTitle,
          subject,
          level,
          about: quizAbout,
          createdBy: {
            userId: user.uid,
            name: user.name,
          },
          ...(user.schoolId && { schoolId: user.schoolId }),
          createdAt: new Date(),
          // questions: historyQuiz.questions,
          questions,
          public: isQuizPrivate === "Yes" ? false : true,
        };

        let newQuizDoc = await addDoc(collection(db, "quizzes"), newQuiz);

        setQuizzes((oldQuizzes: any) => [
          ...oldQuizzes,
          { id: newQuizDoc.id, ...newQuiz },
        ]);

        // INCREMENT USAGE
        const monthYear = getMonthAndYearAsString();
        await updateDoc(doc(db, "users", user.uid), {
          [`usage.${monthYear}`]: increment(1),
        });

        setQuizTitle("");
        setQuizAbout("");
        setSuccess(true);
        setCreatingQuiz(false);
        closeModal();
      };
    } catch (error) {
      console.log(error);
      setError("Something went wrong");
      setCreatingQuiz(false);
    }
  };

  return (
    <Transition appear show={createQuizModalIsOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => {
          if (!creatingQuiz) closeModal();
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
              {creatingQuiz ? (
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex flex-col items-center gap-2">
                    <span className="loading loading-spinner loading-lg"></span>
                    <h1 className="">Creating Quiz. Please wait a moment</h1>
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
                    Create Quiz
                  </Dialog.Title>

                  {/* CREATE QUIZ */}
                  <div className="flex flex-col gap-6 mt-4">
                    <div className="flex flex-col gap-2">
                      <label className="">Title</label>
                      <input
                        type="text"
                        placeholder="Enter quiz title"
                        className="p-1 outline-none border"
                        value={quizTitle}
                        onChange={(e) => setQuizTitle(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="">About (optional)</label>

                      <textarea
                        placeholder="What is the quiz about?"
                        className="p-2 outline-none border"
                        value={quizAbout}
                        onChange={(e) => setQuizAbout(e.target.value)}
                      />
                    </div>

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
                      <label className="w-8/12">Make quiz private? </label>
                      <select
                        className="p-2 w-full max-w-xs border"
                        value={isQuizPrivate}
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
                        Choose image to generate quiz from
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
                      onClick={createQuiz}
                      disabled={!file || !quizTitle}
                    >
                      Create Quiz
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
