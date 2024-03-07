import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";

export default function SchoolHome() {
  const { user } = useContext(AuthContext);

  const [school, setSchool] = useState<any>(null);

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        let schoolDoc = await getDoc(
          doc(db, "schools", user.schoolId as string)
        );
        setSchool({ id: schoolDoc.id, ...schoolDoc.data() });
      } catch (error) {
        console.log(error);
      }
    };

    if (user) fetchSchool();
  }, [user]);

  if (user && user.type === "teacher" && school)
    return (
      <div className="flex-1 flex justify-center p-10">
        <div className="flex flex-col gap-4">
          <h1 className="">Welcome Teacher: {user.name}</h1>
          <h1 className="">School: {school.name}</h1>

          {/* STUDENTS */}
        </div>
      </div>
    );
}
