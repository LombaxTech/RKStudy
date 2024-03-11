import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";

type Student = {
  id: string;
  name: string;
  email: string;
};

export default function SchoolHome() {
  const { user } = useContext(AuthContext);

  const [school, setSchool] = useState<any>(null);

  const [invites, setInvites] = useState<any>([]);

  const [quizzes, setQuizzes] = useState<any>([]);

  useEffect(() => {
    const init = async () => {
      try {
        let schoolDoc = await getDoc(
          doc(db, "schools", user.schoolId as string)
        );
        setSchool({ id: schoolDoc.id, ...schoolDoc.data() });

        let invitesSnapshot = await getDocs(collection(db, "invites"));

        let invites: any = [];
        invitesSnapshot.forEach((inviteDoc) => {
          if (inviteDoc.data().school.id === schoolDoc.id)
            invites.push({ id: inviteDoc.id, ...inviteDoc.data() });
        });
        setInvites(invites);

        let quizzes: any = [];
        let quizzesSnapshot = await getDocs(collection(db, "quizzes"));
        quizzesSnapshot.forEach((quizDoc) => {
          if (quizDoc.data().schoolId === schoolDoc.id)
            quizzes.push({ id: quizDoc.id, ...quizDoc.data() });
        });
        setQuizzes(quizzes);
      } catch (error) {
        console.log(error);
      }
    };

    if (user) init();
  }, [user]);

  if (user && user.type === "teacher" && school)
    return (
      <div className="flex-1 flex flex-col p-4">
        <div className="m-4">
          <h1 className="text-2xl font-bold">{school.name}</h1>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex-1 flex flex-col gap-4">
            {/* STUDENTS */}
            <div className="p-4 rounded-md bg-white shadow-md flex flex-col gap-4">
              <h1 className="text-xl font-bold">Students</h1>
              <div className="flex flex-col gap-2">
                {school.students &&
                  school.students.map((student: Student) => {
                    return (
                      <div
                        className="flex items-center gap-4 p-2 border"
                        key={student.id}
                      >
                        <span className="w-9/12">{student.email}</span>
                        <span className="w-3/12">{student.name}</span>
                      </div>
                    );
                  })}
              </div>
              {school.students.length === 0 ? (
                <h1 className="font-medium">No students have signed up yet</h1>
              ) : null}
            </div>

            {/* QUIZZES */}
            <div className="p-4 rounded-md bg-white shadow-md flex flex-col gap-4">
              <h1 className="text-xl font-bold">Generated Quizzes</h1>
              {quizzes && (
                <div className="">
                  <h1 className="">{quizzes.length} Quizzes Created</h1>
                  {/* <button className="btn" onClick={() => console.log(quizzes)}>
                    Quizzes
                  </button> */}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-4">
            {/* INVITATION CODE */}
            <div className="p-4 rounded-md bg-white shadow-md flex flex-col gap-4">
              <h1 className="text-xl font-bold">Invitation Codes</h1>

              <div className="flex flex-col gap-2">
                <h1 className="text-lg font-medium">Student</h1>
                {invites &&
                  invites.map((invite: any) => {
                    if (invite.type !== "student") return null;

                    return (
                      <h1 className="text-xl font-medium p-4 border-2 w-fit">
                        {invite.code}
                      </h1>
                    );
                  })}
                <h4 className="text-sm font-light">
                  Send this code to your students to let them join
                </h4>
              </div>
              {/* TEACHER INVITE CODE */}

              <div className="flex flex-col gap-2">
                <h1 className="text-lg font-medium">Teacher</h1>
                {invites &&
                  invites.map((invite: any) => {
                    if (invite.type !== "teacher") return null;

                    return (
                      <h1 className="text-xl font-medium p-4 border-2 w-fit">
                        {invite.code}
                      </h1>
                    );
                  })}
                <h4 className="text-sm font-light">
                  Send this code to other staff to join as admins
                </h4>
              </div>
            </div>

            {/* QUIZZES GENERATED */}
            <div className="p-4 rounded-md bg-white shadow-md flex flex-col gap-2">
              <h1 className="text-xl font-bold">Student Licenses</h1>
              <h1 className="text-2xl font-medium p-4 border-2 w-fit">
                {school.students.length} used out of {school.licenseLimit}
              </h1>
            </div>
          </div>
        </div>
      </div>
    );
}

// <h1 className="">Welcome Teacher: {user.name}</h1>
// <h1 className="">School: {school.name}</h1>

// {/* INVITATION CODE */}
// {invite && (

//   <div className="p-4 shadow-md flex flex-col gap-4">
//     <span className="">Invitation Code: {invite.code}</span>
//     <span className="text-sm text-gray-500 font-light">
//       Send this code to students for them to join your school
//     </span>
//     <span className="">
//       {school.students.length} invites used out of {school.licenseLimit}
//     </span>
//     <button className="btn" onClick={() => console.log(invite)}>
//       Log invite
//     </button>
//   </div>
// )}

// {/* STUDENTS */}
// <h1 className="font-bold">Students: </h1>
// <div className="flex flex-col">

// </div>

// <h1 className="text-orange-500">Upcoming:</h1>
// <h1 className="text-orange-500">Remove students</h1>
// <h1 className="text-orange-500">Viee quizzes</h1>
// <h1 className="text-orange-500">change invite code</h1>
