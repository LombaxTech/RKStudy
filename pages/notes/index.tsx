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
import axios from "axios";
import { createWorker } from "tesseract.js";
import { getMonthAndYearAsString } from "@/helperFunctions";
import { studyLevels, subjects } from "@/data";
import GenerateNotesModal from "@/components/GenerateNotesModal";

const monthlyLimit = 15;

export default function NotesHome() {
  const { user } = useContext(AuthContext);

  const [notes, setNotes] = useState<any>([]);
  const [createNotesModalIsOpen, setCreateNotesModalIsOpen] = useState(false);

  const [typeOfQuizzesToShow, setTypeOfQuizzesToShow] = useState<
    "All" | "My Quizzes"
  >("All");

  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");

  const [usageThisMonth, setUsageThisMonth] = useState<number>(0);

  useEffect(() => {
    const intiNotesAndUsage = async () => {
      let notesSnapshot = await getDocs(collection(db, "notes"));

      let notes: any = [];

      notesSnapshot.forEach((notesDoc) => {
        if (user.isLoneStudent) {
          if (notesDoc.data().createdBy.userId === user.uid)
            notes.push({ id: notesDoc.id, ...notesDoc.data() });
        }

        if (user.schoolId) {
          if (notesDoc.data().schoolId === user.schoolId)
            notes.push({ id: notesDoc.id, ...notesDoc.data() });
        }
      });

      setNotes(notes);

      if (!user.usage) setUsageThisMonth(0);
      if (user.usage) {
        const monthYear = getMonthAndYearAsString();
        let usageThisMonth = user.usage[monthYear] || 0;
        setUsageThisMonth(usageThisMonth);
      }
    };

    if (user) intiNotesAndUsage();
  }, [user]);

  const deleteNote = async (note: any) => {
    try {
      await deleteDoc(doc(db, "notes", note.id));
      setNotes(notes.filter((n: any) => n.id !== note.id));
      console.log("deleted quiz");
    } catch (error) {
      console.log(error);
    }
  };

  // IF NOT JOINED TO A SCHOOL
  //   if (user && !user.schoolId && !user.isLoneStudent) return <NotJoinedSchool />;

  if (user) {
    const joinedSchool = !user.isLoneStudent;

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
                  onClick={() => setCreateNotesModalIsOpen(true)}
                >
                  Create Notes with AI
                </button>
                {/* <Link href={`/quiz/create`} className="w-full">
                  <button className="btn btn-primary w-full">
                    Create Manual Quiz
                  </button>
                </Link> */}
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
              <h1 className="text-xl font-medium mb-4">Filter Notes</h1>

              {/* WHO'S QUIZZES */}

              {joinedSchool && (
                <div className="flex flex-col gap-2">
                  <label className="">By Owner</label>
                  <select
                    className="p-2 pr-4 border outline"
                    value={typeOfQuizzesToShow}
                    // @ts-ignore
                    onChange={(e) => setTypeOfQuizzesToShow(e.target.value)}
                  >
                    <option>All</option>
                    <option>My Notes</option>
                  </select>
                </div>
              )}

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
              {notes &&
                notes.map((note: any, i: any) => {
                  const isMyNote = note.createdBy.userId === user.uid;

                  // if (typeOfQuizzesToShow === "My Quizzes" && !isMyNote)
                  //   return null;

                  // if (!isMyQuiz && !quiz.public) return null;

                  // if (selectedLevel !== "All" && quiz?.level !== selectedLevel)
                  //   return null;

                  // if (
                  //   selectedSubject !== "All" &&
                  //   quiz?.subject !== selectedSubject
                  // )
                  //   return null;

                  return (
                    <div
                      className="p-2 px-4 border-2 shadow-sm rounded-md bg-white flex items-center justify-between"
                      key={i}
                    >
                      <h1 className="w-4/12 font-bold">{note.title}</h1>
                      <span className="">Made by: {note.createdBy.name}</span>
                      <div className="flex items-center gap-2">
                        <Link href={`/notes/${note.id}`}>
                          <button className="btn btn-primary">View</button>
                        </Link>
                        {isMyNote && (
                          <>
                            <Link href={`/notes/edit/${note.id}`}>
                              <button className="btn btn-secondary">
                                Edit
                              </button>
                            </Link>
                            <button
                              className="btn"
                              onClick={() => deleteNote(note)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>

            {notes.length === 0 ? (
              <div className="text-lg font-medium">
                Looks like there are no notes to show!
              </div>
            ) : null}
          </div>

          {/* <h1 className="text-2xl font-bold">Welcome back {user.name}</h1> */}
        </div>
        <GenerateNotesModal
          createNotesModalIsOpen={createNotesModalIsOpen}
          setCreateNotesModalIsOpen={setCreateNotesModalIsOpen}
          setNotes={setNotes}
        />
      </>
    );
  }
}
