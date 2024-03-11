import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  query,
  updateDoc,
} from "firebase/firestore";
import Link from "next/link";
import React, {
  useContext,
  useEffect,
  useState,
  Fragment,
  useRef,
} from "react";

import { FaFile } from "react-icons/fa";

import { Dialog, Transition } from "@headlessui/react";
import NotJoinedSchool from "./NotJoinedSchool";
import axios from "axios";
import { createWorker } from "tesseract.js";
import { getMonthAndYearAsString } from "@/helperFunctions";

const monthlyLimit = 15;

export default function StudentHome() {
  const { user } = useContext(AuthContext);

  const [quizzes, setQuizzes] = useState<any>([]);

  const [createQuizModalIsOpen, setCreateQuizModalIsOpen] = useState(false);

  const [typeOfQuizzesToShow, setTypeOfQuizzesToShow] = useState<
    "All" | "My Quizzes"
  >("All");

  const [usageThisMonth, setUsageThisMonth] = useState<number>(0);

  useEffect(() => {
    const initQuizzesAndUsage = async () => {
      let quizzesSnapshot = await getDocs(collection(db, "quizzes"));

      let quizzes: any = [];

      quizzesSnapshot.forEach((quizDoc) =>
        quizzes.push({ id: quizDoc.id, ...quizDoc.data() })
      );

      setQuizzes(quizzes);

      if (!user.usage) setUsageThisMonth(0);
      if (user.usage) {
        const monthYear = getMonthAndYearAsString();
        let usageThisMonth = user.usage[monthYear] || 0;
        setUsageThisMonth(usageThisMonth);
      }
    };

    if (user) initQuizzesAndUsage();
  }, [user]);

  const deleteQuiz = async (quiz: any) => {
    try {
      console.log(quiz);
      await deleteDoc(doc(db, "quizzes", quiz.id));
      setQuizzes(quizzes.filter((q: any) => q.id !== quiz.id));
      console.log("deleted quiz");
    } catch (error) {
      console.log(error);
    }
  };

  const logStuff = () => {
    console.log(user);
    let monthYear = getMonthAndYearAsString();
    console.log(`month year: ${monthYear}`);
    if (!user.usage) {
      console.log("user usage is no!");
    } else {
      console.log(user.usage[monthYear]);
    }
  };

  const genQuizNum = async () => {
    try {
      let monthYear = getMonthAndYearAsString();

      await updateDoc(doc(db, "users", user.uid), {
        [`usage.${monthYear}`]: increment(1),
      });

      console.log("gen quiz and incremented");
    } catch (error) {
      console.log(error);
    }
  };

  // IF NOT JOINED TO A SCHOOL
  if (user && !user.schoolId) return <NotJoinedSchool />;

  if (user)
    return (
      <>
        <div className="flex-1 flex flex-col lg:flex-row gap-4 px-8 pt-12">
          {/* USER PROFILE + FILTER */}

          <div className="flex flex-col gap-4 lg:w-3/12 w-full">
            {/* USER PROFILE */}
            <div className="p-8 bg-white rounded-md shadow flex flex-col gap-6">
              <h1 className="text-2xl font-bold text-center">
                Welcome back {user.name}
              </h1>
              {/* # OF GENERATIONS LEFT */}
              <div className="flex flex-col">
                <h1 className="text-center">
                  <span className="text-2xl font-medium">
                    {" "}
                    {usageThisMonth}{" "}
                  </span>
                  of
                  <span className="text-2xl font-medium"> {monthlyLimit} </span>
                </h1>
                <span className="text-center">
                  generations used this month.
                </span>
              </div>
              {/* <div className="flex gap-2">
                <button className="btn btn-sm" onClick={logStuff}>
                  Log
                </button>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={genQuizNum}
                >
                  gen quiz
                </button>
              </div> */}
              <button
                disabled={usageThisMonth >= monthlyLimit}
                className="btn btn-primary"
                onClick={() => setCreateQuizModalIsOpen(true)}
              >
                Create New Quiz
              </button>
              {usageThisMonth >= monthlyLimit ? (
                <div className="text-center flex flex-col gap-2">
                  <h1 className="">
                    You have used up your generations for this month
                  </h1>
                  <span className="text-sm">
                    Upgrade your plan for more generations
                  </span>
                </div>
              ) : null}
            </div>

            {/* TITLE */}
            <div className="p-8 bg-white rounded-md shadow flex flex-col gap-2">
              <h1 className="text-xl font-medium mb-4">Filter Quizzes</h1>

              {/* WHO'S QUIZZES */}
              <select
                className="p-2 pr-4 border outline"
                value={typeOfQuizzesToShow}
                // @ts-ignore
                onChange={(e) => setTypeOfQuizzesToShow(e.target.value)}
              >
                <option>All</option>
                <option>My Quizzes</option>
              </select>
            </div>
          </div>

          {/* QUIZZES */}
          <div className="flex flex-col gap-2 lg:w-9/12 w-full">
            <div className="flex flex-col gap-2">
              {quizzes &&
                quizzes.map((quiz: any, i: any) => {
                  const isMyQuiz = quiz.createdBy.userId === user.uid;

                  if (typeOfQuizzesToShow === "My Quizzes" && !isMyQuiz)
                    return null;

                  if (!isMyQuiz && !quiz.public) return null;

                  return (
                    <div
                      className="p-2 px-4 border-2 shadow-sm rounded-md bg-white flex items-center justify-between"
                      key={i}
                    >
                      <h1 className="w-4/12 font-bold">{quiz.title}</h1>
                      <span className="">Made by: {quiz.createdBy.name}</span>
                      <div className="flex items-center gap-2">
                        <Link href={`/quiz/${quiz.id}`}>
                          <button className="btn btn-primary">Take Quiz</button>
                        </Link>
                        {isMyQuiz && (
                          <button
                            className="btn"
                            onClick={() => deleteQuiz(quiz)}
                          >
                            Delete Quiz
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>

            {quizzes.length === 0 ? (
              <div className="text-lg font-medium">
                Looks like there are no quizzes to show!
              </div>
            ) : null}
          </div>

          {/* <h1 className="text-2xl font-bold">Welcome back {user.name}</h1> */}
        </div>
        <CreateQuizModal
          createQuizModalIsOpen={createQuizModalIsOpen}
          setCreateQuizModalIsOpen={setCreateQuizModalIsOpen}
          setQuizzes={setQuizzes}
        />
      </>
    );
}

function CreateQuizModal({
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

        // todo: create quiz

        const newQuiz = {
          title: quizTitle,
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
                      <label className="">About</label>

                      <textarea
                        placeholder="What is the quiz about?"
                        className="p-2 outline-none border"
                        value={quizAbout}
                        onChange={(e) => setQuizAbout(e.target.value)}
                      />
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

                    <button className="btn btn-primary" onClick={createQuiz}>
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
