import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import { formatDate } from "@/helperFunctions";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

type QuizQuestion = {
  correctAnswer: string;
  options: string[];
  questionText: string;
};

export default function EditQuiz() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const { quizId } = router.query;

  const [questionToDelete, setQuestionToDelete] = useState<any>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addQuestionModalOpen, setAddQuestionModalOpen] = useState(false);
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
      <>
        <div className="p-10 flex justify-center flex-1">
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
                      onClick={() => {
                        setQuestionToDelete(question);
                        setDeleteModalOpen(true);
                      }}
                    >
                      Delete
                    </button>
                    {/* <button
                      className="btn"
                      onClick={() => console.log("dleete")}
                    >
                      Edit
                    </button> */}
                  </div>
                  {/* <span className="font-medium cursor-pointer">
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
                </div> */}
                </div>
              );
            })}
            <button
              className="btn btn-primary"
              onClick={() => setAddQuestionModalOpen(true)}
            >
              Add Question
            </button>
          </div>
        </div>
        <DeleteConfirmationModal
          deleteModalOpen={deleteModalOpen}
          setDeleteModalOpen={setDeleteModalOpen}
          quiz={quiz}
          setQuiz={setQuiz}
          questionToDelete={questionToDelete}
          setQuestionToDelete={setQuestionToDelete}
        />
        <AddQuestionModal
          addQuestionModalOpen={addQuestionModalOpen}
          setAddQuestionModalOpen={setAddQuestionModalOpen}
          quiz={quiz}
          setQuiz={setQuiz}
        />
      </>
    );
}

function DeleteConfirmationModal({
  deleteModalOpen,
  setDeleteModalOpen,
  quiz,
  setQuiz,
  questionToDelete,
  setQuestionToDelete,
}: {
  deleteModalOpen: any;
  setDeleteModalOpen: any;
  quiz: any;
  setQuiz: any;
  questionToDelete: any;
  setQuestionToDelete: any;
}) {
  const closeModal = () => setDeleteModalOpen(false);
  const openModal = () => setDeleteModalOpen(true);

  const deleteQuestion = async () => {
    try {
      console.log(quiz.questions);
      console.log(questionToDelete);

      await updateDoc(doc(db, "quizzes", quiz.id), {
        questions: quiz.questions.filter(
          (q: any) => q.questionText !== questionToDelete.questionText
        ),
      });

      console.log("deleted question");

      setQuiz({
        ...quiz,
        questions: quiz.questions.filter(
          (q: any) => q.questionText !== questionToDelete.questionText
        ),
      });

      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Transition appear show={deleteModalOpen} as={Fragment}>
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
                    Are you sure you want to delete question?
                  </Dialog.Title>

                  <div className="flex gap-4 mt-4">
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={deleteQuestion}
                    >
                      Yes
                    </button>

                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={closeModal}
                    >
                      No
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

function AddQuestionModal({
  addQuestionModalOpen,
  setAddQuestionModalOpen,
  quiz,
  setQuiz,
}: {
  addQuestionModalOpen: any;
  setAddQuestionModalOpen: any;
  quiz: any;
  setQuiz: any;
}) {
  const closeModal = () => setAddQuestionModalOpen(false);
  const openModal = () => setAddQuestionModalOpen(true);

  const [questionText, setQuestionText] = useState("");
  const [questionOptions, setQuestionOptions] = useState<any>([]);
  const [questionCorrectAnswer, setQuestionCorrectAnswer] = useState("");
  const [questionOptionInput, setQuestionOptionInput] = useState("");
  const [isCorrectOption, setIsCorrectOption] = useState(false);

  const addOption = () => {
    setQuestionOptions((options: any) => [...options, questionOptionInput]);
    if (isCorrectOption) setQuestionCorrectAnswer(questionOptionInput);
    setQuestionOptionInput("");
    setIsCorrectOption(false);
  };

  const addQuestion = async () => {
    try {
      const newQuestion = {
        questionText,
        correctAnswer: questionCorrectAnswer,
        options: questionOptions,
      };

      await updateDoc(doc(db, "quizzes", quiz.id), {
        questions: arrayUnion(newQuestion),
      });

      console.log("add question");

      setQuiz({
        ...quiz,
        questions: [...quiz.questions, newQuestion],
      });

      setQuestionOptions([]);
      setQuestionCorrectAnswer("");
      setQuestionText("");

      // todo: show success alert

      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Transition appear show={addQuestionModalOpen} as={Fragment}>
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
                    Add New Question
                  </Dialog.Title>

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
                          <div
                            className="flex items-center gap-2 w-full"
                            key={i}
                          >
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
