import { AuthContext } from "@/context/AuthContext";
import { historyQuiz } from "@/data";
import { db } from "@/firebase";
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import Link from "next/link";
import React, { useContext, useEffect, useState, Fragment } from "react";

import { FaFile } from "react-icons/fa";

import { Dialog, Transition } from "@headlessui/react";
import NotJoinedSchool from "./NotJoinedSchool";
import axios from "axios";
import { createWorker } from "tesseract.js";

export default function StudentHome() {
  const { user } = useContext(AuthContext);

  const [quizzes, setQuizzes] = useState<any>([]);

  const [createQuizModalIsOpen, setCreateQuizModalIsOpen] = useState(false);

  const [typeOfQuizzesToShow, setTypeOfQuizzesToShow] = useState<
    "All" | "My Quizzes"
  >("All");

  useEffect(() => {
    const initQuizzes = async () => {
      let quizzesSnapshot = await getDocs(collection(db, "quizzes"));

      let quizzes: any = [];

      quizzesSnapshot.forEach((quizDoc) =>
        quizzes.push({ id: quizDoc.id, ...quizDoc.data() })
      );

      setQuizzes(quizzes);
    };

    if (user) initQuizzes();
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

  // IF NOT JOINED TO A SCHOOL
  if (user && !user.schoolId) return <NotJoinedSchool />;

  if (user)
    return (
      <>
        <div className="flex-1 flex gap-4 px-8 pt-12">
          {/* TITLE + FILTER */}

          <div className="flex flex-col gap-4 w-3/12">
            {/* TITLE */}
            <div className="p-8 bg-white rounded-md shadow flex flex-col gap-8">
              <h1 className="text-2xl font-bold">Welcome back {user.name}</h1>
              <button
                className="btn btn-primary"
                onClick={() => setCreateQuizModalIsOpen(true)}
              >
                Create New Quiz
              </button>
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

              {/* SUBJECT OF QUIZZES */}

              {/* <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold">
                {typeOfQuizzesToShow === "All" && "All Quizzes"}
                {typeOfQuizzesToShow === "My Quizzes" && "My Quizzes"}
              </h1>

            </div>
            <button
              className="btn"
              onClick={() => setCreateQuizModalIsOpen(true)}
            >
              Create Quiz
            </button>
          </div> */}
            </div>
          </div>

          {/* QUIZZES */}
          <div className="flex flex-col gap-2 w-9/12">
            {/* <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Quizzes</h1>
              <button className="btn btn-secondary btn-sm">
                Generate Quiz
              </button>
            </div> */}
            <div className="flex flex-col gap-2">
              {quizzes &&
                quizzes.map((quiz: any, i: any) => {
                  const isMyQuiz = quiz.createdBy.userId === user.uid;

                  if (typeOfQuizzesToShow === "My Quizzes" && !isMyQuiz)
                    return null;

                  if (!isMyQuiz && !quiz.public) return null;

                  return (
                    <div className="p-2 border-2 shadow-sm rounded-md bg-white">
                      <h1 className="">{quiz.title}</h1>
                      <span className="">Made by: {quiz.createdBy.name}</span>
                      <div className="flex items-center gap-2">
                        <Link href={`/quiz/${quiz.id}`}>
                          <button className="btn">Take Quiz</button>
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

  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  const createQuiz = async () => {
    setError("");
    setSuccess(false);
    setCreatingQuiz(true);

    try {
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
        res = await axios.post(`http://localhost:3000/api/test`, {
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
                  <div className="flex flex-col gap-2 mt-4">
                    <input
                      type="text"
                      placeholder="Enter quiz title"
                      className="p-1 outline-none border"
                      value={quizTitle}
                      onChange={(e) => setQuizTitle(e.target.value)}
                    />
                    <textarea
                      placeholder="What is the quiz about?"
                      className="p-2 outline-none border"
                      value={quizAbout}
                      onChange={(e) => setQuizAbout(e.target.value)}
                    />

                    <div className="flex items-center gap-3">
                      <label className="w-8/12">Make quiz private? </label>
                      <select
                        className="select w-full max-w-xs border"
                        value={isQuizPrivate}
                        // @ts-ignore
                        onChange={(e) => setIsQuizPrivate(e.target.value)}
                      >
                        <option>Yes</option>
                        <option>No</option>
                      </select>
                    </div>

                    {/* UPLOAD FILES TO GENERATE QUIZ FROM */}
                    <div className="flex flex-col gap-2 my-4">
                      <label className="">
                        Upload files to generate quiz from
                      </label>
                      <input type="file" onChange={handleFileChange} />

                      {file && (
                        <div className="flex flex-col justify-center items-center mt-4">
                          <span className="">
                            <FaFile size={30} />
                          </span>
                          <span className="">{file.name}</span>
                          <button className="btn" onClick={() => setFile(null)}>
                            Remove
                          </button>
                        </div>
                      )}
                    </div>

                    <button
                      className="btn btn-sm btn-primary"
                      onClick={createQuiz}
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
