import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

export default function SuperAdminSchool() {
  const { user } = useContext(AuthContext);

  const router = useRouter();

  const { schoolId } = router.query;

  const [school, setSchool] = useState<any>(null);

  const [adminName, setAdminName] = useState<any>("");
  const [adminEmail, setAdminEmail] = useState<any>("");

  const [invites, setInvites] = useState<any>([]);

  useEffect(() => {
    const fetchSchoolAndInvites = async () => {
      try {
        let schoolDoc = await getDoc(doc(db, "schools", schoolId as string));
        setSchool({ id: schoolDoc.id, ...schoolDoc.data() });

        let invitesSnapshot = await getDocs(collection(db, "invites"));

        let invites: any = [];
        invitesSnapshot.forEach((inviteDoc) => {
          if (inviteDoc.data().school.id === schoolDoc.id)
            invites.push({ id: inviteDoc.id, ...inviteDoc.data() });
        });
        setInvites(invites);
      } catch (error) {
        console.log(error);
      }
    };

    if (schoolId) fetchSchoolAndInvites();
  }, [schoolId]);

  const addAdmin = async () => {
    try {
      console.log({ adminName, adminEmail });
    } catch (error) {
      console.log(error);
    }
  };

  if (schoolId && school)
    return (
      <div className="p-10 flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="flex flex-col gap-4 bg-white p-4 rounded-md shadow-md flex-1">
            <h1 className="text-xl font-bold">{school.name}</h1>
            <h1 className="text-xl font-bold">
              License: {school.students.length} used of {school.licenseLimit}
            </h1>
            <span className="text-sm font-light">id: {school.id}</span>
            <button className="btn w-fit" onClick={() => console.log(school)}>
              Log school info
            </button>
          </div>

          <div className="flex flex-col gap-4 bg-white p-4 rounded-md shadow-md flex-1">
            <h1 className="font-bold">School admins: </h1>
            {school.admins &&
              school.admins.map((admin: any, i: any) => {
                return (
                  <div
                    className="p-2 border flex items-center justify-between gap-6"
                    key={i}
                  >
                    <span className="">Name: {admin.name}</span>
                    <span className="">Email: {admin.email}</span>
                    {/* <button className="btn">Edit/remove</button> */}
                  </div>
                );
              })}
            {!school.admins || school.admins.length === 0 ? (
              <h1 className="">No admins...</h1>
            ) : null}
          </div>
        </div>

        <div className="flex gap-4">
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

          {/* STUDENTS */}
          <div className="flex flex-col gap-4 bg-white p-4 rounded-md shadow-md flex-1">
            <h1 className="font-bold">Students: </h1>

            {school.students &&
              school.students.map((student: any) => {
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

            {!school.students || school.students.length === 0 ? (
              <h1 className="">No students</h1>
            ) : null}
          </div>
        </div>
      </div>
    );
}
