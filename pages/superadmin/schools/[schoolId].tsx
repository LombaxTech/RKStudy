import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

export default function SuperAdminSchool() {
  const { user } = useContext(AuthContext);

  const router = useRouter();

  const { schoolId } = router.query;

  const [school, setSchool] = useState<any>(null);

  const [adminName, setAdminName] = useState<any>("");
  const [adminEmail, setAdminEmail] = useState<any>("");

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        let schoolDoc = await getDoc(doc(db, "schools", schoolId as string));
        setSchool({ id: schoolDoc.id, ...schoolDoc.data() });
      } catch (error) {
        console.log(error);
      }
    };

    if (schoolId) fetchSchool();
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
      <div className="p-10 flex justify-center">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <h1 className="">school: {school.name}</h1>
            <span className="text-sm font-light">id: {school.id}</span>
            <button className="btn" onClick={() => console.log(school)}>
              Log school info
            </button>
          </div>

          <h1 className="font-bold">School admins: </h1>
          {school.admins &&
            school.admins.map((admin: any, i: any) => {
              return (
                <div className="p-2 border flex items-center gap-6" key={i}>
                  <span className="">Name: {admin.name}</span>
                  <span className="">Email: {admin.email}</span>
                  <button className="btn">Edit/remove</button>
                </div>
              );
            })}
          {!school.admins || school.admins.length === 0 ? (
            <h1 className="">No admins...</h1>
          ) : null}

          <div className="flex flex-col gap-2 border shadow-md mt-4">
            <h1 className="font-bold">
              Add admin{" "}
              <span className="text-orange-500">
                To be worked on...firebase admin
              </span>
            </h1>
            <input
              type="text"
              className="p-2"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              placeholder={`Enter admin name`}
            />
            <input
              type="email"
              className="p-2"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder={`Enter admin email`}
            />
            <button className="btn" onClick={addAdmin}>
              Add admin
            </button>
          </div>

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
        </div>
      </div>
    );
}
