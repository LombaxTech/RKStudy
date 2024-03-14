import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import { formatDate } from "@/helperFunctions";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

type QuizQuestion = {
  correctAnswer: string;
  options: string[];
  questionText: string;
};

export default function ViewQuiz() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const { quizId } = router.query;

  const [quiz, setQuiz] = useState<any>(null);

  const [submittedQuiz, setSubmittedQuiz] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      let quizDoc = await getDoc(doc(db, "quizzes", quizId as string));
      setQuiz({ id: quizDoc.id, ...quizDoc.data() });
    };

    if (quizId) fetchQuiz();
  }, [quizId]);

  if (!quiz) return <h1 className="">Loading quiz...</h1>;

  if (user && quizId && quiz)
    return (
      <div className="p-10 flex justify-center">
        {/* <button className="btn" onClick={logStuff}>
          Log stuff
        </button> */}
        <div className="flex flex-col gap-4">
          {/* QUIZ INFO */}
          <div className="flex flex-col gap-2 bg-white p-4 rounded-md shadow-md">
            <h1 className="text-xl font-bold">{quiz.title}</h1>
            <p className="">{quiz.about}</p>
            <div className="flex items-center gap-4">
              <p className="">
                Created on: {formatDate(quiz.createdAt.toDate())}
              </p>
              <p className="">Created by: {quiz.createdBy.name}</p>
              {/* <p className="">Is public? {quiz.public ? "yes" : "no"}</p> */}
            </div>
          </div>
          {/* QUESTIONS */}
          <h1 className="font-bold text-lg">Questions</h1>
          {quiz.questions.map((question: QuizQuestion, i: any) => {
            return (
              <div className="" key={i}>
                <span className="font-medium">
                  {i + 1}. {question.questionText}
                </span>

                <div className="flex flex-col gap-2 my-4">
                  {question.options.map((option, i: any) => {
                    return (
                      <div className="flex items-center gap-4" key={i}>
                        <span className="">{option}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
}
