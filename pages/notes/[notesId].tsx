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

export default function ViewNotes() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const { notesId } = router.query;

  const [notes, setNotes] = useState<any>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      let notesDoc = await getDoc(doc(db, "notes", notesId as string));
      setNotes({ id: notesDoc.id, ...notesDoc.data() });
    };

    if (notesId) fetchNotes();
  }, [notesId]);

  if (!notes) return <h1 className="">Loading notes...</h1>;

  if (user && notesId && notes)
    return (
      <div className="p-10 flex justify-center">
        {/* <button className="btn" onClick={logStuff}>
          Log stuff
        </button> */}
        <div className="flex flex-col gap-4">
          {/* QUIZ INFO */}
          <div className="flex flex-col gap-2 bg-white p-4 rounded-md shadow-md">
            <h1 className="text-xl font-bold">{notes.title}</h1>
            <div className="flex items-center gap-4">
              <p className="">
                Created on: {formatDate(notes.createdAt.toDate())}
              </p>
              <p className="">Created by: {notes.createdBy.name}</p>
              {/* <p className="">Is public? {quiz.public ? "yes" : "no"}</p> */}
            </div>
          </div>
          {/* QUESTIONS */}
          <div className="">{notes.notes}</div>
        </div>
      </div>
    );
}
