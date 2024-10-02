import { usePlausible } from "next-plausible";

export default function Analytics() {
  const plausible = usePlausible();

  let demoGen = "demo-quiz-gen"; // 3
  let quizGen = "quiz-gen"; // 4
  let demoLimitHit = "demo-limit-hit";
  let limitHit = "limit-hit"; // 1
  let signup = "";

  const fireEvent = async () => {
    let event = limitHit;

    plausible(event);
    console.log(event);
  };

  return (
    <div className="p-4 flex flex-col gap-2">
      <button className="btn btn-primary" onClick={fireEvent}>
        Fire gen quiz event
      </button>
    </div>
  );
}
