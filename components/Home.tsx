import { AuthContext } from "@/context/AuthContext";
import { historyQuiz } from "@/data";
import { db } from "@/firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";

export default function Home() {
  const { user } = useContext(AuthContext);

  const [quizzes, setQuizzes] = useState<any>([]);

  const [quizTitle, setQuizTitle] = useState("");
  const [quizAbout, setQuizAbout] = useState("");

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

  const createQuiz = async () => {
    try {
      console.log("creating quiz");

      // todo: create quiz

      const newQuiz = {
        title: quizTitle,
        about: quizAbout,
        createdBy: {
          userId: user.uid,
          name: user.name,
        },
        createdAt: new Date(),
        questions: historyQuiz.questions,
        public: false,
      };

      let newQuizDoc = await addDoc(collection(db, "quizzes"), newQuiz);

      setQuizzes([...quizzes, { id: newQuizDoc.id, ...newQuiz }]);

      setQuizTitle("");
      setQuizAbout("");
    } catch (error) {
      console.log(error);
    }
  };

  if (user)
    return (
      <div className="flex-1 flex flex-col items-center p-4 pt-12">
        <div className="flex flex-col gap-4">
          {/* <h1 className="text-2xl font-bold">Welcome back {user.name}</h1> */}
          <div className="flex items-center gap-10">
            {/* <h1 className="text-2xl font-bold">My Quizzes</h1> */}
            <button className="btn">Create Quiz</button>
          </div>
          {/* CREATE QUIZ */}
          <div className="p-6 rounded-md shadow-lg flex flex-col gap-2">
            <h1 className="text-lg font-medium">Create Quiz</h1>

            <input
              type="text"
              placeholder="Enter quiz title"
              className="p-1 outline-none border"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
            />
            <textarea
              placeholder="What should the quiz be about?"
              className="p-2 outline-none border"
              value={quizAbout}
              onChange={(e) => setQuizAbout(e.target.value)}
            />
            <button className="btn btn-sm btn-primary" onClick={createQuiz}>
              Create Quiz
            </button>
          </div>

          <h1 className="text-2xl font-bold">My Quizzes</h1>

          {/* QUIZZES */}
          {quizzes &&
            quizzes.map((quiz: any, i: any) => {
              return (
                <Link href={`/quiz/${quiz.id}`}>
                  <div className="p-2 border-2 shadow-sm">
                    <h1 className="">{quiz.title}</h1>
                  </div>
                </Link>
              );
            })}

          {quizzes.length === 0 ? (
            <div className="text-lg font-medium">
              Looks like there are no quizzes to show!
            </div>
          ) : null}
        </div>
      </div>
    );
}
