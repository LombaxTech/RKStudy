import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import { cieBiologyAS2024Syllabus as syllabus } from "@/lib/specData/cie-biology-as-2024";
import { Point, Topic, User } from "@/lib/types";
import { doc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { useContext, useState } from "react";
import { FaFaceFrown, FaFaceMeh, FaFaceSmile } from "react-icons/fa6";

type ConfidenceRating = "low" | "medium" | "high";

export default function CIEBiologyAS2024() {
  const { user }: { user: User } = useContext(AuthContext);

  const [collapsedTopics, setCollapsedTopics] = useState<string[]>([]);

  const toggleTopicCollapse = (topic: Topic) => {
    if (collapsedTopics.includes(topic.number)) {
      setCollapsedTopics((prev) => prev.filter((t) => t !== topic.number));
    } else {
      setCollapsedTopics((prev) => [...prev, topic.number]);
    }
  };

  const addConfidenceRating = async (
    point: Point,
    rating: ConfidenceRating
  ) => {
    try {
      let userOldSpecs = user.specs || [];
      let userNewSpecs: any = [];

      let userCurrentSpec = userOldSpecs?.find(
        (spec) => spec.id === syllabus.id
      );

      if (!userCurrentSpec) {
        // IF USER CURRENT SPEC DOES NOT EXIST
        userCurrentSpec = {
          id: syllabus.id,
          title: syllabus.title,
          studyPointConfidenceRatings: {
            [point.number]: rating,
          },
        };

        userNewSpecs = [...userOldSpecs, userCurrentSpec];
      } else {
        // IF USER CURRENT SPEC EXISTS

        let newConfidenceRatings = {
          ...userCurrentSpec.studyPointConfidenceRatings,
          [point.number]: rating,
        };

        let updatedSpec = {
          ...userCurrentSpec,
          studyPointConfidenceRatings: newConfidenceRatings,
        };

        userNewSpecs = userOldSpecs.map((spec) => {
          if (spec.id === syllabus.id) return updatedSpec;
          return spec;
        });
      }

      await updateDoc(doc(db, "users", user.uid as string), {
        specs: userNewSpecs,
      });

      console.log("updated spec!");
    } catch (error) {
      console.log(error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  let userCurrentSpec = user.specs?.find((spec) => spec.id === syllabus.id);

  return (
    <div className="flex-1 p-4 flex flex-col gap-2">
      {/* GO BACK */}
      <Link href="/test/syllabus">
        <span className="underline cursor-pointer">Go Back</span>
      </Link>

      <h1 className="text-2xl font-bold">CIE Biology AS Level 2024</h1>

      {/* SYLLABUS */}
      {/* TOPICS */}
      <div className="mt-4 flex flex-col gap-8">
        {syllabus.topics.map((topic) => {
          const isTopicCollapsed = collapsedTopics.includes(topic.number);

          return (
            <div
              key={topic.number}
              className={`p-8 bg-white rounded-md shadow-md`}
            >
              {/* TITLE AND COLLAPSE BUTTON */}
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">
                  {topic.number} - {topic.title}
                </h2>
                <span
                  className="underline cursor-pointer"
                  onClick={() => toggleTopicCollapse(topic)}
                >
                  {isTopicCollapsed ? "Expand" : "Collapse"}
                </span>
              </div>
              {/* SUBTOPICS */}
              <div
                className={`ml-4 mt-4 flex flex-col gap-6 ${
                  isTopicCollapsed ? "hidden" : ""
                }`}
              >
                {topic.subtopics.map((subtopic) => {
                  return (
                    <div className="" key={subtopic.number}>
                      <h3 className="text-lg font-medium">
                        {subtopic.number} - {subtopic.title}
                      </h3>
                      {/* POINTS */}
                      <div className="ml-8 my-6 flex flex-col gap-6">
                        {subtopic.points.map((point) => {
                          let userConfidenceRating:
                            | ConfidenceRating
                            | undefined;

                          if (userCurrentSpec) {
                            userConfidenceRating = userCurrentSpec
                              .studyPointConfidenceRatings[
                              point.number
                            ] as ConfidenceRating;
                          }

                          return (
                            <div
                              className="flex items-center gap-4"
                              key={point.number}
                            >
                              {/* CONFIDENCE RATING */}
                              <div className="flex items-center gap-1">
                                <span className="text-sm font-medium">
                                  <FaFaceFrown
                                    size={24}
                                    color={
                                      userConfidenceRating === "low"
                                        ? "red"
                                        : "lightgray"
                                    }
                                    className="cursor-pointer"
                                    onClick={() =>
                                      addConfidenceRating(point, "low")
                                    }
                                  />
                                </span>
                                <span className="text-sm font-medium">
                                  <FaFaceMeh
                                    size={24}
                                    color={
                                      userConfidenceRating === "medium"
                                        ? "orange"
                                        : "lightgray"
                                    }
                                    className="cursor-pointer"
                                    onClick={() =>
                                      addConfidenceRating(point, "medium")
                                    }
                                  />
                                </span>
                                <span className="text-sm font-medium">
                                  <FaFaceSmile
                                    size={24}
                                    color={
                                      userConfidenceRating === "high"
                                        ? "green"
                                        : "lightgray"
                                    }
                                    className="cursor-pointer"
                                    onClick={() =>
                                      addConfidenceRating(point, "high")
                                    }
                                  />
                                </span>
                              </div>

                              {/* POINT NUMBER AND TITLE */}
                              <h4 className="text-base font-normal">
                                {point.number} - {point.title}
                              </h4>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
