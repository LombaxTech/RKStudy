import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore";
import Link from "next/link";
import React, { useContext, useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { generateInviteCode } from "@/helperFunctions";

type School = any;

export default function SuperAdminHome() {
  const { user } = useContext(AuthContext);

  const [schools, setSchools] = useState<School[]>([]);
  const [createSchoolModalIsOpen, setCreateSchoolModalIsOpen] = useState(false);

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

  const logStuff = () => {
    console.log(schools);
  };

  if (user && user.type === "superadmin")
    return (
      <>
        <div className="flex-1 flex flex-col lg:flex-row gap-4 px-8 pt-12">
          {/* TITLE + FILTER */}

          <div className="flex flex-col gap-4 lg:w-3/12 w-full">
            {/* TITLE */}
            <div className="p-8 bg-white rounded-md shadow flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">Welcome back {user.name}</h1>
                <h1 className="text-xl font-medium text-center">SuperAdmin</h1>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => setCreateSchoolModalIsOpen(true)}
              >
                Create New School
              </button>
            </div>

            {/* TITLE */}
            <div className="p-8 bg-white rounded-md shadow flex flex-col gap-2">
              {/* <h1 className="text-xl font-medium mb-4">Filter Quizzes</h1> */}

              {/* WHO'S QUIZZES */}
              {/* <select
              className="p-2 pr-4 border outline"
              value={typeOfQuizzesToShow}
              // @ts-ignore
              onChange={(e) => setTypeOfQuizzesToShow(e.target.value)}
            >
              <option>All</option>
              <option>My Quizzes</option>
            </select> */}

              {/* SUBJECT OF QUIZZES */}
            </div>
          </div>

          {/* SCHOOLS */}
          <div className="flex flex-col gap-2 lg:w-9/12 w-full">
            {schools &&
              schools.map((school: any) => {
                return (
                  <div
                    key={school.id}
                    className="p-2 border flex items-center justify-between bg-white shadow-md"
                  >
                    <h1 className="">{school.name}</h1>
                    <div className="flex gap-2">
                      <Link href={`/superadmin/schools/${school.id}`}>
                        <button className="btn btn-primary btn-sm">View</button>
                      </Link>
                    </div>
                  </div>
                );
              })}

            {schools.length === 0 ? (
              <h1 className="">No schools to show...</h1>
            ) : null}
          </div>

          {/* <h1 className="text-2xl font-bold">Welcome back {user.name}</h1> */}
        </div>
        <CreateSchoolModal
          createSchoolModalIsOpen={createSchoolModalIsOpen}
          setCreateSchoolModalIsOpen={setCreateSchoolModalIsOpen}
          setSchools={setSchools}
        />
      </>
    );

  // return (

  //   <div className="flex-1 flex flex-col gap-4 p-10">
  //     <button className="btn" onClick={logStuff}>
  //       Log stuff
  //     </button>

  //     {/* CREATE SCHOOL */}
  //     <div className="p-6 rounded-md shadow-md flex flex-col gap-4">
  //     </div>

  //     {/* VIEW SCHOOLS */}
  //     <h1 className="font-bold">Schools</h1>
  //     {schools &&
  //       schools.map((school: School) => {
  //         return (
  //           <Link href={`/superadmin/schools/${school.id}`} key={school.id}>
  //             <div className="p-2 border">
  //               <h1 className="">{school.name}</h1>
  //             </div>
  //           </Link>
  //         );
  //       })}

  //     {schools.length === 0 ? (
  //       <h1 className="">No schools to show...</h1>
  //     ) : null}
  //     {/* VIEW STUDENTS */}
  //   </div>
  // );
}

function CreateSchoolModal({
  createSchoolModalIsOpen,
  setCreateSchoolModalIsOpen,
  setSchools,
}: {
  createSchoolModalIsOpen: any;
  setCreateSchoolModalIsOpen: any;
  setSchools: any;
}) {
  const closeModal = () => setCreateSchoolModalIsOpen(false);
  const openModal = () => setCreateSchoolModalIsOpen(true);

  const { user } = useContext(AuthContext);

  const [schoolName, setSchoolName] = useState("");
  const [licenseLimit, setLicenseLimit] = useState<any>(100);
  const [admins, setAdmins] = useState<any>([]);

  const createSchool = async () => {
    try {
      // create school
      let newSchool = {
        name: schoolName,
        licenseLimit,
        admins,
        students: [],
        createdAt: new Date(),
      };

      let newSchoolDoc = await addDoc(collection(db, "schools"), newSchool);

      setSchools((oldSchools: any) => [
        ...oldSchools,
        { id: newSchoolDoc.id, ...newSchool },
      ]);

      // create teacher invite code
      const teacherInvite = {
        school: {
          id: newSchoolDoc.id,
          name: schoolName,
        },
        type: "teacher",
        active: true,
        code: generateInviteCode(schoolName),
      };

      await addDoc(collection(db, "invites"), teacherInvite);

      // create student invite code

      const studentInvite = {
        school: {
          id: newSchoolDoc.id,
          name: schoolName,
        },
        type: "student",
        active: true,
        code: generateInviteCode(schoolName),
      };

      await addDoc(collection(db, "invites"), studentInvite);

      console.log("made school and invites");
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  const [creatingSchool, setCreatingSchool] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  return (
    <Transition appear show={createSchoolModalIsOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => {
          // if (!creatingQuiz)
          closeModal();
        }}
      >
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
              {creatingSchool ? (
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex flex-col items-center gap-2">
                    <span className="loading loading-spinner loading-lg"></span>
                    <h1 className="">Creating School. Please wait a moment</h1>
                  </div>
                </Dialog.Panel>
              ) : (
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Create School
                  </Dialog.Title>

                  {/* CREATE QUIZ */}
                  <div className="flex flex-col gap-4 mt-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-light">School Name</label>
                      <input
                        type="text"
                        className="p-2 outline-none border"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        placeholder={`Enter schools name`}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-light">
                        License Limit
                      </label>
                      <input
                        type="number"
                        className="p-2 outline-none border"
                        value={licenseLimit}
                        onChange={(e) => setLicenseLimit(e.target.value)}
                        placeholder={`Enter license limit`}
                      />
                    </div>

                    <button className="btn  btn-primary" onClick={createSchool}>
                      Create School
                    </button>
                  </div>
                </Dialog.Panel>
              )}
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
