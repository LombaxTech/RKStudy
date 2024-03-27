import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import { formatDate } from "@/helperFunctions";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

type QuizQuestion = {
  correctAnswer: string;
  options: string[];
  questionText: string;
};

export default function EditNotes() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const { notesId } = router.query;

  const [notes, setNotes] = useState<any>(null);
  const [notesText, setNotesText] = useState<any>("");

  const [changesExist, setChangesExist] = useState(false);

  const [changesSaved, setChangesSaved] = useState(false);

  useEffect(() => {
    if (!notes) return;

    if (notes.notes !== notesText) {
      setChangesExist(true);
    } else {
      setChangesExist(false);
    }
  }, [notes, notesText]);

  useEffect(() => {
    const fetchNotes = async () => {
      let notesDoc = await getDoc(doc(db, "notes", notesId as string));
      setNotes({ id: notesDoc.id, ...notesDoc.data() });

      setNotesText(notesDoc.data()?.notes);
    };

    if (notesId) fetchNotes();
  }, [notesId]);

  const saveChanges = async () => {
    try {
      await updateDoc(doc(db, "notes", notesId as string), {
        notes: notesText,
      });

      console.log("savec changes...");
      setNotes({ ...notes, notes: notesText });

      setChangesSaved(true);
      setTimeout(() => setChangesSaved(false), 5000);
    } catch (error) {
      console.log(error);
    }
  };

  if (!notes) return <h1 className="">Loading notes...</h1>;

  if (user && notesId && notes)
    return (
      <div className="p-10 flex justify-center">
        {/* <button className="btn" onClick={logStuff}>
          Log stuff
        </button> */}
        <div className="flex flex-col gap-4 w-full">
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
          <div className={`w-full`}>
            <textarea
              className="p-2 bg-transparent text-area w-full min-h-[600px]"
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
            ></textarea>
          </div>
          {/* <p onBlur={(e) => setNotesText(e.target.value)} contentEditable>
            {notesText}
          </p> */}
          <button
            className="btn btn-primary"
            disabled={!changesExist}
            onClick={saveChanges}
          >
            Save changes
          </button>
        </div>
      </div>
    );
}
