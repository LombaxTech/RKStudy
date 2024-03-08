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

  const [invite, setInvite] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      try {
        let schoolDoc = await getDoc(
          doc(db, "schools", user.schoolId as string)
        );
        setSchool({ id: schoolDoc.id, ...schoolDoc.data() });

        let invitesSnapshot = await getDocs(collection(db, "invites"));

        let invite: any = null;
        invitesSnapshot.forEach((inviteDoc) => {
          if (inviteDoc.data().school.id === schoolDoc.id)
            invite = { id: inviteDoc.id, ...inviteDoc.data() };
        });
        if (invite) setInvite(invite);
      } catch (error) {
        console.log(error);
      }
    };

    if (user) init();
  }, [user]);

  if (user && user.type === "teacher" && school)
    return (
      <div className="flex-1 flex justify-center p-10">
        <div className="flex flex-col gap-4">
          <h1 className="">Welcome Teacher: {user.name}</h1>
          <h1 className="">School: {school.name}</h1>

          {/* INVITATION CODE */}
          {invite && (
            <div className="p-4 shadow-md flex flex-col gap-4">
              <span className="">Invitation Code: {invite.code}</span>
              <span className="text-sm text-gray-500 font-light">
                Send this code to students for them to join your school
              </span>
              <span className="">
                {school.students.length} invites used out of{" "}
                {school.licenseLimit}
              </span>
              <button className="btn" onClick={() => console.log(invite)}>
                Log invite
              </button>
            </div>
          )}

          {/* STUDENTS */}
          <h1 className="font-bold">Students: </h1>
          {school.students &&
            school.students.map((student: Student) => {
              return (
                <div
                  className="flex items-center gap-4 p-2 border"
                  key={student.id}
                >
                  <span className="">{student.email}</span>
                  <span className="">{student.name}</span>
                </div>
              );
            })}

          <h1 className="text-orange-500">Upcoming:</h1>
          <h1 className="text-orange-500">Remove students</h1>
          <h1 className="text-orange-500">Viee quizzes</h1>
          <h1 className="text-orange-500">change invite code</h1>
        </div>
      </div>
    );
}
