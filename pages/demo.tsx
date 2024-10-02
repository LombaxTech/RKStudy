import CreateDemoQuizModal from "@/components/CreateDemoQuizModal";
import { AuthContext } from "@/context/AuthContext";
import Link from "next/link";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFile } from "react-icons/fa";

const generationLimit = 3;

export default function Demo() {
  const { user } = useContext(AuthContext);

  const [quiz, setQuiz] = useState<any>(null);
  const [generationAttempts, setGenerationAttempts] = useState<number>(0);
  const [createQuizModalIsOpen, setCreateQuizModalIsOpen] = useState(false);

  useEffect(() => {
    let quiz: any = localStorage.getItem("quiz");
    quiz = JSON.parse(quiz);

    if (quiz) setQuiz(quiz);

    let generationAttempts: any = localStorage.getItem("generationAttempts");
    generationAttempts = JSON.parse(generationAttempts);

    if (!generationAttempts) {
      localStorage.setItem("generationAttempts", JSON.stringify(0));
    } else {
      generationAttempts = JSON.parse(generationAttempts);
      setGenerationAttempts(generationAttempts);
    }
  }, []);

  let limitReached = generationAttempts >= generationLimit;

  return (
    <>
      <div className="flex-1 flex flex-col gap-4 px-8 pt-6">
        <div className="flex flex-col mb-4">
          <h1 className="text-2xl font-bold text-center">
            {generationAttempts}/{generationLimit} Quizzes Left
          </h1>
          <h1 className="text-lg font-normal text-center">
            Create an account to unlock more generations
          </h1>
        </div>

        {/* FILE UPLOAD TO  CONVERT */}
        <div className="p-8 px-16 mx-auto h-fit w-fit bg-white rounded-md shadow-md flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <img src={"/test.svg"} className="w-80 mb-6" alt="" />
            <button
              // disabled={usageThisMonth >= monthlyLimit}
              className="btn btn-primary"
              onClick={() => setCreateQuizModalIsOpen(true)}
            >
              Create Quiz
            </button>
          </div>
        </div>

        {/* QUIZ */}
        <div className="px-20 mt-4 flex flex-col gap-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">Generated Quizzes</h1>
            <h2 className="text-sm">
              (You can only view one quiz at a time in the demo. Create an
              account to view all your quizzes at once)
            </h2>
          </div>

          {quiz ? (
            <div className="p-2 px-4 border-2 shadow-sm rounded-md bg-white flex items-center justify-between">
              <h1 className="w-4/12 font-bold">{quiz.title}</h1>
              <span className="">Made by: Demo User</span>
              <div className="flex items-center gap-2">
                <Link href={`/quiz/${quiz.id}?demo=true`}>
                  <button className="btn btn-primary">Take Quiz</button>
                </Link>
              </div>
            </div>
          ) : (
            <h1 className="text-xl font-medium text-primary">
              No quizzes to show yet...
            </h1>
          )}
        </div>
      </div>
      <CreateDemoQuizModal
        createQuizModalIsOpen={createQuizModalIsOpen}
        setCreateQuizModalIsOpen={setCreateQuizModalIsOpen}
        setQuiz={setQuiz}
        setGenerationAttempts={setGenerationAttempts}
      />
    </>
  );
}