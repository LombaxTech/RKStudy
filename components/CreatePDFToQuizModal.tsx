import { AuthContext } from "@/context/AuthContext";
import { analyticEvents, maxNumberOfQuizQuestions, monthlyLimit } from "@/data";
import { db, storage } from "@/firebase";
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
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { usePlausible } from "next-plausible";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { FaFile } from "react-icons/fa";

export default function CreatePDFToQuizModal({
  createQuizModalIsOpen,
  setCreateQuizModalIsOpen,
  setQuizzes,
}: {
  createQuizModalIsOpen: any;
  setCreateQuizModalIsOpen: any;
  setQuizzes: any;
}) {
  const plausible = usePlausible();

  const closeModal = () => setCreateQuizModalIsOpen(false);
  const openModal = () => setCreateQuizModalIsOpen(true);

  const { user } = useContext(AuthContext);

  const [quizTitle, setQuizTitle] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState<any>(1);
  const [quizAbout, setQuizAbout] = useState("");

  const [creatingQuiz, setCreatingQuiz] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [file, setFile] = useState<any>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState("");

  useEffect(() => {
    if (!file) return setFilePreviewUrl("");

    if (file) {
      setFilePreviewUrl(URL.createObjectURL(file));
    }
  }, [file]);

  const fileInputRef = useRef<any>(null);

  const createQuiz = async () => {
    if (numberOfQuestions < 1 || numberOfQuestions > maxNumberOfQuizQuestions) {
      return setError(
        `Number of questions must be between 1 and ${maxNumberOfQuizQuestions}`
      );
    }

    setError("");
    setSuccess(false);
    setCreatingQuiz(true);

    try {
      // todo: check how many quizzes student has generated this month

      console.log("creating quiz");

      if (!file) return console.log("You need to add a file");

      // TODO:  GET THE TEXT CONTENT FROM THE PDF

      let storageRef = ref(storage, `${user.uid}/${file.name}`);
      await uploadBytes(storageRef, file);

      let url = await getDownloadURL(storageRef);
      let res = await axios.post(`/api/pdf-to-text`, { fileLink: url });
      let textFileLink = res.data;

      let textData = await fetch(textFileLink);
      let textContent = await textData.text();

      // TODO: SEND THE TEXT OVER TO OPENAI AND GET A QUIZ BACK
      res = await axios.post(`/api/test`, {
        //  textContent: `Generate a quiz of 5 questions with 3 options using the following content as the revision material: ${textContent}`,
        textContent: `Generate a quiz of ${numberOfQuestions} questions using the following content as the revision material: ${textContent}`,
      });

      let quiz = res.data.quiz;
      let questions = JSON.parse(quiz).questions;

      const newQuiz = {
        title: quizTitle,
        createdBy: {
          userId: user.uid,
          name: user.name,
        },
        createdAt: new Date(),
        questions,
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

      plausible(analyticEvents.quizGen);
      if (user[`usage.${monthYear}`] === monthlyLimit) {
        plausible(analyticEvents.limitHit);
      }

      setQuizTitle("");
      setQuizAbout("");
      setSuccess(true);
      setCreatingQuiz(false);
      closeModal();
    } catch (error) {
      console.log(error);
      setError("Something went wrong");
      setCreatingQuiz(false);
      plausible(analyticEvents.genError);
    }
  };

  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
    e.target.value = "";
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
                      This can take up to a few minutes.
                    </h1>
                  </div>
                </Dialog.Panel>
              ) : (
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Create Quiz With AI
                  </Dialog.Title>

                  {/* CREATE QUIZ */}
                  <div className="flex flex-col gap-4 mt-4">
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
                      <label className="flex items-center">
                        <span className="flex-1">Number of questions</span>{" "}
                        <span className="text-xs">
                          (between 1 and {maxNumberOfQuizQuestions})
                        </span>
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        className="p-1 outline-none border"
                        value={numberOfQuestions}
                        onChange={(e) => setNumberOfQuestions(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col gap-2 mt-2">
                      {/* <button
                        className="btn"
                        onClick={() => console.log(file.name)}
                      >
                        log
                      </button> */}
                      <input
                        accept=".pdf"
                        type="file"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        style={{ display: "none" }}
                      />
                      <div className="flex items-center gap-4">
                        <button
                          disabled={file}
                          className="btn btn-sm flex-1 btn-outline"
                          onClick={() => {
                            // @ts-ignore
                            fileInputRef?.current?.click();
                          }}
                        >
                          Choose file (PDF)
                        </button>
                      </div>

                      {file && (
                        <div className="flex justify-center items-center gap-2 mt-4">
                          <div className="flex flex-col items-center">
                            <span className="">
                              <FaFile size={30} />
                            </span>
                            <span className="">{file.name}</span>
                            <div className="flex gap-2 mt-4">
                              <button
                                className="btn btn-sm"
                                onClick={() => window.open(filePreviewUrl)}
                              >
                                Preview File
                              </button>
                              <button
                                className="btn btn-sm"
                                onClick={() => setFile(null)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {error && (
                      <div className="p-2 bg-red-200 text-red-500 text-center">
                        {error}
                      </div>
                    )}

                    <button
                      className="btn btn-primary mt-4"
                      onClick={createQuiz}
                      disabled={!quizTitle || !file || !numberOfQuestions}
                    >
                      Create Quiz
                    </button>
                  </div>

                  {/* UPLOAD FILES TO GENERATE QUIZ FROM */}
                </Dialog.Panel>
              )}
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
