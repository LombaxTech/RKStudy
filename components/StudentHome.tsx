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
import { studyLevels, subjects } from "@/data";
import CreateQuizModal from "./CreateQuizModal";

const monthlyLimit = 15;

export default function StudentHome() {
  const { user } = useContext(AuthContext);

  const [quizzes, setQuizzes] = useState<any>([]);

  const [createQuizModalIsOpen, setCreateQuizModalIsOpen] = useState(false);

  const [typeOfQuizzesToShow, setTypeOfQuizzesToShow] = useState<
    "All" | "My Quizzes"
  >("All");

  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");

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
              <div className="flex flex-col gap-2">
                <button
                  disabled={usageThisMonth >= monthlyLimit}
                  className="btn btn-primary"
                  onClick={() => setCreateQuizModalIsOpen(true)}
                >
                  Create New Quiz
                </button>
                <Link href={`/quiz/create`} className="w-full">
                  <button className="btn btn-primary w-full">
                    Create Manual Quiz
                  </button>
                </Link>
              </div>
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
            <div className="p-8 bg-white rounded-md shadow flex flex-col gap-4">
              <h1 className="text-xl font-medium mb-4">Filter Quizzes</h1>

              {/* WHO'S QUIZZES */}
              <div className="flex flex-col gap-2">
                <label className="">By Owner</label>
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

              {/* SUBJECT */}
              <div className="flex flex-col gap-2">
                <label className="">By Subject</label>
                <select
                  className="p-2 pr-4 border outline"
                  value={selectedSubject}
                  // @ts-ignore
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  <option>All</option>
                  {subjects.map((subject) => {
                    return <option key={subject}>{subject}</option>;
                  })}
                </select>
              </div>

              {/* LEVEL */}
              <div className="flex flex-col gap-2">
                <label className="">By Academic Level</label>
                <select
                  className="p-2 pr-4 border outline"
                  value={selectedLevel}
                  // @ts-ignore
                  onChange={(e) => setSelectedLevel(e.target.value)}
                >
                  <option>All</option>
                  {studyLevels.map((level) => {
                    return <option key={level}>{level}</option>;
                  })}
                </select>
              </div>
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

                  if (selectedLevel !== "All" && quiz?.level !== selectedLevel)
                    return null;

                  if (
                    selectedSubject !== "All" &&
                    quiz?.subject !== selectedSubject
                  )
                    return null;

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
                          <>
                            <Link href={`/quiz/edit/${quiz.id}`}>
                              <button className="btn btn-secondary">
                                Edit
                              </button>
                            </Link>
                            <button
                              className="btn"
                              onClick={() => deleteQuiz(quiz)}
                            >
                              Delete Quiz
                            </button>
                          </>
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
