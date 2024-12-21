import { AuthContext } from "@/context/AuthContext";
import { monthlyLimit } from "@/data";
import { db } from "@/firebase";
import { getMonthAndYearAsString } from "@/helperFunctions";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";

export default function MyProfile() {
  const { user, setUser } = useContext(AuthContext);

  const [name, setName] = useState<any>(user?.name || user?.displayName);
  const [about, setAbout] = useState<string>(user?.about);
  const [school, setSchool] = useState<any>(null);

  const [changesExist, setChangesExist] = useState(false);

  const [changesSaved, setChangesSaved] = useState(false);
  const [error, setError] = useState(false);

  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);
  const [usageThisMonth, setUsageThisMonth] = useState<number>(0);

  useEffect(() => {
    const initSchool = async () => {
      try {
        let school: any = null;

        let schoolsSnapshot = await getDocs(collection(db, "schools"));
        schoolsSnapshot.forEach((schoolDoc) => {
          if (schoolDoc.id === user.schoolId)
            school = { id: schoolDoc.id, ...schoolDoc.data() };
        });

        setSchool(school);
      } catch (error) {
        console.log(error);
      }
    };

    if (user && user.schoolId) initSchool();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    if (user.name !== name || user.about !== about) {
      setChangesExist(true);
    } else {
      setChangesExist(false);
    }

    if (!user.usage) setUsageThisMonth(0);
    if (user.usage) {
      const monthYear = getMonthAndYearAsString();
      let usageThisMonth = user.usage[monthYear] || 0;
      setUsageThisMonth(usageThisMonth);
    }
  }, [user, name, about]);

  const saveChanges = async () => {
    setError(false);
    setChangesSaved(false);

    if (!changesExist) return;

    try {
      await updateDoc(doc(db, "users", user.uid), { name, about });
      setChangesSaved(true);
    } catch (error) {
      console.log(error);
      setError(true);
    }
  };

  if (user) {
    const joinedSchool = !user.isLoneStudent;

    return (
      <div className="p-10 flex flex-col items-center">
        <div className="flex flex-col gap-6 lg:w-4/12 w-full">
          <h1 className="font-bold text-xl">Settings</h1>
          {/* <div className="flex flex-col gap-2">
            <label>Name: </label>
            <input
              disabled={true}
              type="text"
              className="border outline-none p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="name"
            />
          </div> */}

          {/* <div className="flex flex-col gap-2">
            <label>Usage: </label>
            <h1 className="">
              <span className="text-2xl font-medium"> {usageThisMonth} </span>
              out of
              <span className="text-2xl font-medium"> {monthlyLimit} </span>
              <span className="text-center">
                AI quiz generations used this month.
              </span>
            </h1>
          </div> */}

          {/* {school ? (
            <div className="flex flex-col gap-2">
              <label>School: </label>
              <input
                disabled={true}
                type="text"
                className="border outline-none p-2"
                value={school.name}
                placeholder="name"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <h1 className="">You have not joined any schools</h1>
            </div>
          )} */}

          {/* <button
            disabled={!changesExist}
            className="btn btn-primary"
            onClick={saveChanges}
          >
            Save Changes
          </button> */}

          {error && (
            <div className="bg-red-200 p-2 text-red-800 text-center">
              Something went wrong. Please try again.
            </div>
          )}
          {changesSaved && (
            <div className="bg-green-200 p-2 text-green-800 text-center">
              Changes saved successfully.
            </div>
          )}

          {/* <h1
            className="cursor-pointer"
            onClick={() => setDeleteAccountModalOpen(true)}
          >
            Delete Account
          </h1> */}

          {/* <DeleteAccountModal
            deleteAccountModalOpen={deleteAccountModalOpen}
            setDeleteAccountModalOpen={setDeleteAccountModalOpen}
          /> */}
        </div>
      </div>
    );
  }
}

// function DeleteAccountModal({
//   deleteAccountModalOpen,
//   setDeleteAccountModalOpen,
// }: {
//   deleteAccountModalOpen: any;
//   setDeleteAccountModalOpen: any;
// }) {
//   function closeModal() {
//     setDeleteAccountModalOpen(false);
//   }

//   function openModal() {
//     setDeleteAccountModalOpen(true);
//   }

//   const { user } = useContext(AuthContext);
//   const router = useRouter();

//   const deleteAccount = async () => {
//     try {
//       await deleteDoc(doc(db, "users", user.uid));
//       await signOut(auth);
//       router.push("/");

//       console.log("deleted account...");
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <Transition appear show={deleteAccountModalOpen} as={Fragment}>
//       <Dialog as="div" className="relative z-10" onClose={closeModal}>
//         <Transition.Child
//           as={Fragment}
//           enter="ease-out duration-300"
//           enterFrom="opacity-0"
//           enterTo="opacity-100"
//           leave="ease-in duration-200"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//         >
//           <div className="fixed inset-0 bg-black/25" />
//         </Transition.Child>

//         <div className="fixed inset-0 overflow-y-auto">
//           <div className="flex min-h-full items-center justify-center p-4 text-center">
//             <Transition.Child
//               as={Fragment}
//               enter="ease-out duration-300"
//               enterFrom="opacity-0 scale-95"
//               enterTo="opacity-100 scale-100"
//               leave="ease-in duration-200"
//               leaveFrom="opacity-100 scale-100"
//               leaveTo="opacity-0 scale-95"
//             >
//               <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
//                 <Dialog.Title
//                   as="h3"
//                   className="text-lg font-medium leading-6 text-gray-900"
//                 >
//                   Account Deletion Confirmation
//                 </Dialog.Title>
//                 <div className="mt-2">
//                   <p className="text-sm text-gray-500">
//                     Are you sure you want to delete your account? This action is
//                     irreversible.
//                   </p>
//                 </div>

//                 <div className="mt-4 flex gap-2">
//                   {/* <button
//                     type="button"
//                     className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
//                     onClick={closeModal}
//                   >
//                     Got it, thanks!
//                   </button> */}
//                   <button className="btn" onClick={deleteAccount}>
//                     Delete
//                   </button>
//                   <button className="btn" onClick={closeModal}>
//                     Cancel
//                   </button>
//                 </div>
//               </Dialog.Panel>
//             </Transition.Child>
//           </div>
//         </div>
//       </Dialog>
//     </Transition>
//   );
// }
