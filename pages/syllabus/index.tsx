import AddSubjectModal from "@/components/syllabus/AddSubjectModal";
import RemoveSubjectModal from "@/components/syllabus/RemoveSubjectModal";
import { AuthContext } from "@/context/AuthContext";
import { UserSpec } from "@/lib/types";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

export default function Syllabus() {
  const { user } = useContext(AuthContext);

  const [addSubjectModalIsOpen, setAddSubjectModalIsOpen] = useState(false);
  const [removeSubjectModalIsOpen, setRemoveSubjectModalIsOpen] =
    useState(false);
  const [subjectToRemove, setSubjectToRemove] = useState<UserSpec | null>(null);

  const [specs, setSpecs] = useState<any[]>([]);
  const [availableSpecs, setAvailableSpecs] = useState<any[]>([]);

  // GET SPECS
  useEffect(() => {
    if (!user) return;

    let specs = user.specs || [];
    setSpecs(specs);
  }, [user]);

  if (!user) return <div>Loading...</div>;
  return (
    <>
      <div className="flex-1 p-4 flex flex-col gap-2">
        {/* TITLE AND ADD SPEC BUTTON */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">My Subjects</h1>

          {specs.length > 0 && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setAddSubjectModalIsOpen(true)}
            >
              Add a new subject
            </button>
          )}
        </div>

        {/* SYLLABUSES */}
        <div className="flex flex-col gap-2">
          {/* NO SPECS ADDED YET */}
          {specs.length === 0 && <NoSpecsSelectedYet />}

          {/* ADDED SPECS */}
          {specs &&
            specs.map((spec: UserSpec) => (
              <div
                key={spec.id}
                className="p-4 bg-white rounded-lg shadow-md flex items-center justify-between"
              >
                <h2 className="text-xl font-bold">{spec.title}</h2>

                <div className="flex items-center gap-2">
                  <Link href={`/syllabus/${spec.spec}/${spec.id}`}>
                    <button className="btn btn-primary btn-sm">View</button>
                  </Link>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setSubjectToRemove(spec);
                      setRemoveSubjectModalIsOpen(true);
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
      <AddSubjectModal
        addSubjectModalIsOpen={addSubjectModalIsOpen}
        setAddSubjectModalIsOpen={setAddSubjectModalIsOpen}
      />
      <RemoveSubjectModal
        removeSubjectModalIsOpen={removeSubjectModalIsOpen}
        setRemoveSubjectModalIsOpen={setRemoveSubjectModalIsOpen}
        subjectToRemove={subjectToRemove as UserSpec}
      />
    </>
  );
}

const NoSpecsSelectedYet = () => {
  const [addSubjectModalIsOpen, setAddSubjectModalIsOpen] = useState(false);

  return (
    <>
      <div className="p-4 bg-white rounded-lg shadow-md flex flex-col gap-2">
        <h2 className="text-xl font-bold">No subjects selected yet</h2>
        <p className="text-sm text-gray-500">
          No subjects selected yet. Please add a subject to get started.
        </p>
        <button
          className="btn btn-primary btn-sm w-fit"
          onClick={() => setAddSubjectModalIsOpen(true)}
        >
          Add a subject
        </button>
      </div>
      <AddSubjectModal
        addSubjectModalIsOpen={addSubjectModalIsOpen}
        setAddSubjectModalIsOpen={setAddSubjectModalIsOpen}
      />
    </>
  );
};
