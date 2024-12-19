import AddSpecModal from "@/components/syllabus/AddSpecModal";
import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import { updateDoc } from "firebase/firestore";
import { UserSpec } from "@/lib/types";
import { doc } from "firebase/firestore";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

export default function Syllabus() {
  const { user } = useContext(AuthContext);

  const [specs, setSpecs] = useState<any[]>([]);
  const [availableSpecs, setAvailableSpecs] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    let specs = user.specs || [];
    setSpecs(specs);
  }, [user]);

  if (!user) return <div>Loading...</div>;
  return (
    <div className="flex-1 p-4 flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Syllabuses</h1>

      {/* SYLLABUSES */}
      <div className="flex flex-col gap-2">
        {/* NO SPECS ADDED YET */}
        {specs.length === 0 && <NoSpecsSelectedYet />}

        {/* ADDED SPECS */}
        {specs &&
          specs.map((spec: UserSpec) => (
            <div className="p-4 bg-white rounded-lg shadow-md flex items-center justify-between">
              <h2 className="text-xl font-bold">{spec.title}</h2>

              <Link href={`/syllabus/${spec.id}`}>
                <button className="btn btn-primary btn-sm">View</button>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
}

const NoSpecsSelectedYet = () => {
  const [addSpecModalIsOpen, setAddSpecModalIsOpen] = useState(false);

  return (
    <>
      <div className="p-4 bg-white rounded-lg shadow-md flex flex-col gap-2">
        <h2 className="text-xl font-bold">No specs selected yet</h2>
        <p className="text-sm text-gray-500">
          No specs selected yet. Please select a spec to view the syllabus.
        </p>
        <button
          className="btn btn-primary btn-sm w-fit"
          onClick={() => setAddSpecModalIsOpen(true)}
        >
          Select a spec
        </button>
      </div>
      <AddSpecModal
        addSpecModalIsOpen={addSpecModalIsOpen}
        setAddSpecModalIsOpen={setAddSpecModalIsOpen}
      />
    </>
  );
};
