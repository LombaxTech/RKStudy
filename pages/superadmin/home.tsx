import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";

type School = any;

export default function SuperAdminHome() {
  const { user } = useContext(AuthContext);

  const [schools, setSchools] = useState<School[]>([]);

  const [schoolName, setSchoolName] = useState("");
  const [licenseLimit, setLicenseLimit] = useState<any>(0);
  const [admins, setAdmins] = useState<any>([]);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        let schoolsSnapshot = await getDocs(collection(db, "schools"));
        let schools: any = [];
        schoolsSnapshot.forEach((schoolDoc) =>
          schools.push({ id: schoolDoc.id, ...schoolDoc.data() })
        );
        setSchools(schools);
      } catch (error) {
        console.log(error);
      }
    };

    if (user) fetchSchools();
  }, [user]);

  const createSchool = async () => {
    try {
      let newSchool = {
        name: schoolName,
        licenseLimit,
        admins,
        students: [],
        createdAt: new Date(),
      };

      let newSchoolDoc = await addDoc(collection(db, "schools"), newSchool);

      console.log("created new school");

      setSchools([...schools, { id: newSchoolDoc.id, ...newSchool }]);
    } catch (error) {
      console.log(error);
    }
  };

  const logStuff = () => {
    console.log(schools);
  };

  if (user && user.type === "superadmin")
    return (
      <div className="flex-1 flex justify-center p-10">
        <div className="flex flex-col gap-4">
          <h1 className="">Welcome Super Admin</h1>

          <button className="btn" onClick={logStuff}>
            Log stuff
          </button>

          {/* CREATE SCHOOL */}
          <div className="p-6 rounded-md shadow-md flex flex-col gap-4">
            <h1 className="">Create school</h1>
            <input
              type="text"
              className="p-2 outline-none border"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder={`Enter schools name`}
            />

            <input
              type="number"
              className="p-2 outline-none border"
              value={licenseLimit}
              onChange={(e) => setLicenseLimit(e.target.value)}
              placeholder={`Enter license limit`}
            />

            <span className="">Add admins</span>

            <button className="btn" onClick={createSchool}>
              Create school
            </button>
          </div>

          {/* VIEW SCHOOLS */}
          <h1 className="font-bold">Schools</h1>
          {schools &&
            schools.map((school: School) => {
              return (
                <Link href={`/superadmin/schools/${school.id}`} key={school.id}>
                  <div className="p-2 border">
                    <h1 className="">{school.name}</h1>
                  </div>
                </Link>
              );
            })}

          {schools.length === 0 ? (
            <h1 className="">No schools to show...</h1>
          ) : null}
          {/* VIEW STUDENTS */}
        </div>
      </div>
    );
}
