import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import { formatDate } from "@/helperFunctions";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
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
  const { quizId, demo } = router.query;

  const [quiz, setQuiz] = useState<any>(null);

  const [quizState, setQuizState] = useState<any>([]);

  const [submittedQuiz, setSubmittedQuiz] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (demo) {
        let quiz: any = localStorage.getItem("quiz");
        quiz = JSON.parse(quiz);

        if (quiz) {
          setQuiz(quiz);
          setQuizState(
            quiz.questions.map((question: any) => ({
              questionText: question.questionText,
              correctAnswer: question.correctAnswer,
              selectedAnswer: null,
            }))
          );
        }
      } else {
        let quizDoc = await getDoc(doc(db, "quizzes", quizId as string));
        setQuiz({ id: quizDoc.id, ...quizDoc.data() });

        setQuizState(
          quizDoc.data()?.questions.map((question: any) => ({
            questionText: question.questionText,
            correctAnswer: question.correctAnswer,
            selectedAnswer: null,
          }))
        );
      }
    };

    if (quizId && router.isReady) fetchQuiz();
  }, [quizId, router.isReady]);

  const logStuff = () => {
    console.log(quizState);
    console.log(quiz);
  };

  const checkAnswers = () => {
    setSubmittedQuiz(true);
  };

  const resetQuiz = () => {
    setSubmittedQuiz(false);

    if (quiz) {
      setQuizState(
        quiz.questions.map((question: any) => ({
          questionText: question.questionText,
          correctAnswer: question.correctAnswer,
          selectedAnswer: null,
        }))
      );
    }
  };

  if (!quiz) return <h1 className="">Loading quiz...</h1>;

  if ((user || demo) && quizId && quiz && router.isReady) {
    return (
      <div className="p-10 flex justify-center">
        <div className="flex flex-col gap-4">
          <Link href={demo ? "/demo" : "/"} className="underline">
            Go Back
          </Link>
          {/* QUIZ INFO */}
          <div className="flex flex-col gap-2 bg-white p-4 rounded-md shadow-md">
            <h1 className="text-xl font-bold">{quiz.title}</h1>

            <div className="flex items-center gap-4">
              {demo ? (
                <p className="">
                  Created on: {formatDate(new Date(quiz.createdAt))}
                </p>
              ) : (
                <p className="">
                  Created on: {formatDate(quiz.createdAt.toDate())}
                </p>
              )}
              {!demo && <p className="">Created by: {quiz.createdBy.name}</p>}
            </div>
          </div>
          {/* QUESTIONS */}
          <h1 className="font-bold text-lg">Questions</h1>
          {quiz.questions.map((question: QuizQuestion, i: any) => {
            const currentQuestionState = quizState.find(
              (q: any) => q.questionText === question.questionText
            );

            const { selectedAnswer } = currentQuestionState;

            return (
              <div className="" key={i}>
                <span className="font-medium">
                  {i + 1}. {question.questionText}
                </span>

                <div className="flex flex-col gap-2 my-4">
                  {question.options.map((option, i: any) => {
                    const isOptionSelected = selectedAnswer === option;
                    const isSelectedOptionWrong =
                      selectedAnswer !== question.correctAnswer;

                    return (
                      <div className="flex items-center gap-4" key={i}>
                        <input
                          disabled={submittedQuiz}
                          type="radio"
                          checked={isOptionSelected}
                          name={question.questionText}
                          value={option}
                          className={`radio ${
                            submittedQuiz &&
                            isSelectedOptionWrong &&
                            isOptionSelected
                              ? "radio-error"
                              : ""
                          }`}
                          onChange={(e) =>
                            setQuizState(
                              quizState.map((q: any) => {
                                if (q.questionText === question.questionText) {
                                  return {
                                    ...q,
                                    selectedAnswer: e.target.value,
                                  };
                                } else return q;
                              })
                            )
                          }
                        />
                        <span className="">{option}</span>
                        {submittedQuiz && question.correctAnswer === option && (
                          <span className={`text-sm text-green-500 font-bold`}>
                            Correct
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
                {submittedQuiz && !selectedAnswer && (
                  <h1 className="text-red-500">No answer submitted</h1>
                )}
              </div>
            );
          })}

          {/* RESULTS */}
          {submittedQuiz && (
            <div className="flex flex-col gap-2">
              <h1 className="">
                Score:{" "}
                {
                  quizState.filter(
                    (q: any) => q.correctAnswer === q.selectedAnswer
                  ).length
                }
                /{quiz.questions.length}
              </h1>
            </div>
          )}
          <button className="btn btn-primary" onClick={checkAnswers}>
            Check Answers
          </button>
          <button className="btn btn-outline" onClick={resetQuiz}>
            Reset Quiz
          </button>
          <Link href={demo ? "/demo" : "/"} className="underline">
            Go Back
          </Link>
        </div>
      </div>
    );
  }
}
