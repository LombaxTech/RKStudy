import Link from "next/link";

export default function Syllabus() {
  return (
    <div className="flex-1 p-4 flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Syllabuses</h1>

      {/* SYLLABUSES */}
      <div className="flex flex-col gap-2">
        <div className="p-4 bg-white rounded-lg shadow-md flex items-center justify-between">
          <h2 className="text-xl font-bold">CIE Biology AS Level 2024</h2>

          <Link href="/syllabus/cie-biology-as-2024">
            <button className="btn btn-primary btn-sm">View</button>
          </Link>
        </div>

        {/* {syllabuses.map((syllabus) => (
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold">{syllabus.name}</h2>
          </div>
        ))} */}
      </div>
    </div>
  );
}
