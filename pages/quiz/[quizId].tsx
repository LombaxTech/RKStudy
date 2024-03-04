import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

type QuizQuestion = {
  correctAnswer: string;
  options: string[];
  questionText: string;
};

export default function Quiz() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const { quizId } = router.query;

  const [quiz, setQuiz] = useState<any>(null);

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
        <div className="flex flex-col gap-4">
          {/* QUIZ INFO */}
          <h1 className="text-xl font-bold">{quiz.title}</h1>
          <p className="">{quiz.about}</p>
          <div className="flex items-center gap-4">
            <p className="">Created on: xx/xx/xxxx</p>
            <p className="">Created by: {quiz.createdBy.name}</p>
            <p className="">Is public? {quiz.public ? "yes" : "no"}</p>
          </div>
          {/* QUESTIONS */}
          <h1 className="font-bold text-lg">Questions</h1>
          {quiz.questions.map((question: QuizQuestion, i: any) => {
            return (
              <div className="">
                <span>{question.questionText}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
}
