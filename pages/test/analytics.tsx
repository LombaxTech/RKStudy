import { usePlausible } from "next-plausible";

export default function Analytics() {
  const plausible = usePlausible();

  const fireEvent = async () => {
    plausible("gen-quiz-test");
    console.log("fired event");
  };

  return (
    <div className="p-4 flex flex-col gap-2">
      <button className="btn btn-primary" onClick={fireEvent}>
        Fire gen quiz event
      </button>
    </div>
  );
}
