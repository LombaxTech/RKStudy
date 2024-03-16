import React, { useState, Fragment, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { studyLevels, subjects } from "@/data";
import { AuthContext } from "@/context/AuthContext";
import {
  addDoc,
  collection,
  doc,
  increment,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import { getMonthAndYearAsString } from "@/helperFunctions";
import Link from "next/link";

type QuizQuestion = {
  correctAnswer: string;
  options: string[];
  questionText: string;
};

export default function CreateManualQuiz() {
  const { user } = useContext(AuthContext);

  const [quizTitle, setQuizTitle] = useState("");
  const [quizAbout, setQuizAbout] = useState("");
  const [isQuizPrivate, setIsQuizPrivate] = useState<"Yes" | "No">("No");

  const [subject, setSubject] = useState<any>(subjects[0]);
  const [level, setLevel] = useState<any>(studyLevels[0]);

  const [questions, setQuestions] = useState<any>([]);

  const [creatingQuiz, setCreatingQuiz] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [questionBeingEditted, setQuestionBeingEditted] = useState<any>(null);

  let [createQuestionModalIsOpen, setCreateQuestionModalIsOpen] =
    useState(false);

  const createQuiz = async () => {
    setError("");
    setSuccess(false);
    setCreatingQuiz(true);

    try {
      console.log("creating quiz");

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
        questions,
        public: isQuizPrivate === "Yes" ? false : true,
      };

      let newQuizDoc = await addDoc(collection(db, "quizzes"), newQuiz);

      // setQuizzes((oldQuizzes: any) => [
      //   ...oldQuizzes,
      //   { id: newQuizDoc.id, ...newQuiz },
      // ]);

      // INCREMENT USAGE
      const monthYear = getMonthAndYearAsString();
      await updateDoc(doc(db, "users", user.uid), {
        [`usage.${monthYear}`]: increment(1),
      });

      setQuizTitle("");
      setQuizAbout("");
      setCreatingQuiz(false);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 5 * 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const logStuff = () => {
    // console.log(questions);
    // // console.log(`correctAnswer: ${isCorrectOption}`);
    // console.log(questionCorrectAnswer);
  };

  return (
    <>
      <div className="p-10 flex justify-center flex-1">
        <div className="flex flex-col gap-4">
          {/* QUESTIONS */}
          <h1 className="text-2xl font-bold">Create Custom Quiz</h1>

          <div className="flex mt-4 gap-4 items-end">
            {/* <div className="grid grid-cols-3 gap-2"> */}
            <div className="flex flex-col gap-2">
              <label className="">Title</label>
              <input
                type="text"
                placeholder="Enter quiz title"
                className="p-2 outline-none border"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
              />
            </div>
            {/* <div className="flex flex-col gap-2">
              <label className="">About (optional)</label>

              <textarea
                placeholder="What is the quiz about?"
                className="p-2 outline-none border"
                value={quizAbout}
                onChange={(e) => setQuizAbout(e.target.value)}
              />
            </div> */}

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
              <label className="">Select Academic Level (optional)</label>
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

            <div className="flex flex-col gap-2">
              <label className="w-full">Make quiz private? </label>
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
          </div>

          <h1 className="text-lg font-medium">Questions</h1>
          {questions.map((question: QuizQuestion, i: any) => {
            return (
              <div className="" key={i}>
                <div className="flex">
                  <div className="collapse bg-base-200">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-medium">
                      <span className="font-medium cursor-pointer">
                        {i + 1}. {question.questionText}
                      </span>
                    </div>
                    <div className="collapse-content">
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
                  </div>
                  <button
                    className="btn"
                    onClick={() =>
                      setQuestions(
                        questions.filter((q: number, j: number) => i !== j)
                      )
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}

          <button
            className="btn btn-secondary"
            onClick={() => setCreateQuestionModalIsOpen(true)}
          >
            Add Question
          </button>
          <button
            className="btn btn-primary"
            onClick={createQuiz}
            disabled={!quizTitle || questions.length === 0}
          >
            Create Quiz
          </button>
        </div>
      </div>
      <CreateQuestionModal
        createQuestionModalIsOpen={createQuestionModalIsOpen}
        setCreateQuestionModalIsOpen={setCreateQuestionModalIsOpen}
        questions={questions}
        setQuestions={setQuestions}
      />

      {success && (
        <div className="fixed bottom-0 z-[10] w-full">
          <CreatedQuizAlert />
        </div>
      )}
    </>
  );
}

function CreateQuestionModal({
  createQuestionModalIsOpen,
  setCreateQuestionModalIsOpen,
  questions,
  setQuestions,
}: {
  createQuestionModalIsOpen: any;
  setCreateQuestionModalIsOpen: any;
  questions: any;
  setQuestions: any;
}) {
  const closeModal = () => setCreateQuestionModalIsOpen(false);
  const openModal = () => setCreateQuestionModalIsOpen(true);

  const [questionText, setQuestionText] = useState("");
  const [questionOptions, setQuestionOptions] = useState<any>([]);
  const [questionCorrectAnswer, setQuestionCorrectAnswer] = useState("");
  const [questionOptionInput, setQuestionOptionInput] = useState("");
  const [isCorrectOption, setIsCorrectOption] = useState(false);

  const addQuestion = () => {
    const newQuestion = {
      questionText,
      correctAnswer: questionCorrectAnswer,
      options: questionOptions,
    };

    setQuestions((oldQuestions: any) => [...oldQuestions, newQuestion]);

    setQuestionOptions([]);
    setQuestionCorrectAnswer("");
    setQuestionText("");
    closeModal();
  };

  const addOption = () => {
    setQuestionOptions((options: any) => [...options, questionOptionInput]);
    if (isCorrectOption) setQuestionCorrectAnswer(questionOptionInput);
    setQuestionOptionInput("");
    setIsCorrectOption(false);
  };

  return (
    <>
      <Transition appear show={createQuestionModalIsOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Create Question
                  </Dialog.Title>

                  {/* ADD QUESTION */}
                  <div className="flex flex-col gap-4 mt-4">
                    <input
                      placeholder="Enter question"
                      type="text"
                      className="p-2 outline-none border"
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                    />
                    <div className="flex flex-col gap-1">
                      {questionOptions.map((option: any, i: any) => {
                        return (
                          <div className="flex items-center gap-2 w-full">
                            <span className="w-4/12">{option}</span>
                            <label className="text-xs">
                              Is correct answer?
                            </label>
                            <input
                              type="checkbox"
                              className="checkbox"
                              checked={option === questionCorrectAnswer}
                              onChange={(e) => setQuestionCorrectAnswer(option)}
                            />
                            <div className="flex-1 flex justify-end">
                              <button
                                className="btn btn-sm"
                                onClick={() =>
                                  setQuestionOptions(
                                    questionOptions.filter(
                                      (o: any, j: any) => i !== j
                                    )
                                  )
                                }
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2 bg-white mb-4">
                      <input
                        type="text"
                        value={questionOptionInput}
                        onChange={(e) => setQuestionOptionInput(e.target.value)}
                        className="bg-transparent outline-none border p-2 flex-1"
                        placeholder="Enter option"
                      />
                      <button
                        className="btn btn-sm"
                        onClick={addOption}
                        disabled={!questionOptionInput}
                      >
                        Add option
                      </button>
                    </div>

                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={addQuestion}
                      disabled={
                        !questionText ||
                        questionOptions.length === 0 ||
                        !questionCorrectAnswer
                      }
                    >
                      Add question
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

const CreatedQuizAlert = ({}) => {
  return (
    <div className={`p-4 bg-green-200`}>
      <h1 className="text-lg font-medium text-center text-green-700">
        Quiz created successfully!{" "}
        <Link href={`/`} className="underline">
          View quizzes
        </Link>
      </h1>
    </div>
  );
};
