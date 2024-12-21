import AddSubjectModal from "@/components/syllabus/AddSubjectModal";
import RemoveSubjectModal from "@/components/syllabus/RemoveSubjectModal";
import { AuthContext } from "@/context/AuthContext";
import { UserSpec } from "@/lib/types";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";

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
      {specs.length === 0 && <NoSpecsSelectedYet />}
      {specs.length > 0 && (
        <div className="flex-1 p-4 flex flex-col gap-2 md:w-1/2 md:mx-auto md:gap-14 pt-10">
          {/* TITLE AND ADD SPEC BUTTON */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">My Subjects</h1>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setAddSubjectModalIsOpen(true)}
            >
              Add a new subject
            </button>
          </div>
          {/* SUBJECTS */}
          <div className="flex flex-col gap-2">
            {specs.map((spec: UserSpec) => (
              <SpecCard
                key={spec.id}
                spec={spec}
                setSubjectToRemove={setSubjectToRemove}
                setRemoveSubjectModalIsOpen={setRemoveSubjectModalIsOpen}
              />
            ))}
          </div>
        </div>
      )}

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

const SpecCard = ({
  spec,
  setSubjectToRemove,
  setRemoveSubjectModalIsOpen,
}: {
  spec: UserSpec;
  setSubjectToRemove: any;
  setRemoveSubjectModalIsOpen: any;
}) => {
  return (
    <>
      <div className="p-4 bg-white rounded-lg shadow-md flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">{spec.title}</h2>
          {/* PERCENTAGE COMPLETED */}
          <div className="flex flex-col gap-1">
            <div className="w-48 h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${spec.percentageCompleted || 0}%` }}
              />
            </div>
            <p className="text-sm text-gray-500">
              {spec.percentageCompleted || 0}% completed
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Link href={`/syllabus/${spec.spec}/${spec.id}`}>
            <button className="btn btn-primary btn-sm">View</button>
          </Link>
          <FaTrash
            size={20}
            className="cursor-pointer hover:scale-125 transition-all duration-300"
            onClick={() => {
              setSubjectToRemove(spec);
              setRemoveSubjectModalIsOpen(true);
            }}
          />
        </div>
      </div>
    </>
  );
};

const NoSpecsSelectedYet = () => {
  const [addSubjectModalIsOpen, setAddSubjectModalIsOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold">No subjects added yet</h1>
      <img src={"/math.svg"} alt="math" className="w-[300px]" />
      <button
        className="btn btn-primary w-fit mt-10"
        onClick={() => setAddSubjectModalIsOpen(true)}
      >
        Add a subject to get started
      </button>

      <AddSubjectModal
        addSubjectModalIsOpen={addSubjectModalIsOpen}
        setAddSubjectModalIsOpen={setAddSubjectModalIsOpen}
      />
    </div>
  );
};
