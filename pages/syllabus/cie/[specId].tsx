import { AuthContext } from "@/context/AuthContext";
import { availableSpecs } from "@/lib/specData/specs";
import { Point, Topic, ConfidenceRating, User, Syllabus } from "@/lib/types";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import {
  FaArrowLeftLong,
  FaFaceFrown,
  FaFaceMeh,
  FaFaceSmile,
} from "react-icons/fa6";

import { db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import Link from "next/link";

export default function CieSyllabus() {
  const router = useRouter();
  const { specId } = router.query;

  const { user }: { user: User } = useContext(AuthContext);
  const [syllabus, setSyllabus] = useState<Syllabus | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [collapsedTopics, setCollapsedTopics] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedConfidenceRating, setSelectedConfidenceRating] = useState<
    ConfidenceRating | ""
  >("");

  // FETCH SYLLABUS
  useEffect(() => {
    if (!specId) return;

    setLoading(true);

    const spec = availableSpecs.find((spec) => spec.id === specId);
    if (!spec) return setLoading(false);

    setSyllabus(spec);
    setLoading(false);
  }, [specId]);

  if (!specId) return null;

  if (loading) return <div>Loading...</div>;
  if (!syllabus) return <div>No syllabus found</div>;

  if (!user) {
    return <div>Loading...</div>;
  }

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
          spec: syllabus.spec,
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

  let userCurrentSpec = user.specs?.find((spec) => spec.id === syllabus.id);
  return (
    <div className="flex-1 p-4 flex flex-col gap-2">
      {/* GO BACK */}
      <Link href="/syllabus" className="w-fit">
        <span className="underline cursor-pointer">
          <FaArrowLeftLong />
        </span>
      </Link>

      <div className="flex flex-col items-start justify-start gap-2 md:flex-row md:items-center md:justify-between">
        {/* TITLE */}
        <h1 className="text-2xl font-bold">{syllabus.title}</h1>
        {/* SEARCH */}
        <div className="flex-1 md:px-16 w-full items-center gap-2">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Search syllabus"
            className="w-full outline-none p-2 rounded-md border-2 border-gray-300"
          />
        </div>
        {/* FILTER */}
        <div className="flex items-center self-end gap-2">
          <span className="text-sm font-medium">
            Filter Topics By Confidence:
          </span>
          <select
            className="outline-none p-2 rounded-md border-2 border-gray-300"
            value={selectedConfidenceRating}
            onChange={(e) =>
              setSelectedConfidenceRating(e.target.value as ConfidenceRating)
            }
          >
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* SYLLABUS */}
      {/* TOPICS */}
      <div className="mt-4 flex flex-col gap-4">
        {syllabus.topics.map((topic) => {
          // CHECK IF TOPIC HAS ANY VISIBLE POINTS
          const topicHasVisiblePoints = topic.subtopics.some((subtopic) =>
            subtopic.points.some((point) => {
              const matchesConfidence =
                !selectedConfidenceRating ||
                userCurrentSpec?.studyPointConfidenceRatings[point.number] ===
                  selectedConfidenceRating;

              const matchesSearch =
                !searchTerm ||
                point.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                point.number.toLowerCase().includes(searchTerm.toLowerCase());

              return matchesConfidence && matchesSearch;
            })
          );

          // DON'T RENDER TOPIC IF IT HAS NO VISIBLE POINTS
          if (!topicHasVisiblePoints) return null;

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
                  // CHECK IF SUBTOPIC HAS ANY VISIBLE POINTS
                  const subtopicHasVisiblePoints = subtopic.points.some(
                    (point) => {
                      const matchesConfidence =
                        !selectedConfidenceRating ||
                        userCurrentSpec?.studyPointConfidenceRatings[
                          point.number
                        ] === selectedConfidenceRating;

                      const matchesSearch =
                        !searchTerm ||
                        point.title
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        point.number
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase());

                      return matchesConfidence && matchesSearch;
                    }
                  );

                  // DON'T RENDER SUBTOPIC IF IT HAS NO VISIBLE POINTS
                  if (!subtopicHasVisiblePoints) return null;

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

                          // GET USER CONFIDENCE RATING IF THE USER HAS THIS SPEC SAVED
                          if (userCurrentSpec) {
                            userConfidenceRating = userCurrentSpec
                              .studyPointConfidenceRatings[
                              point.number
                            ] as ConfidenceRating;
                          }

                          // IF THERE IS A SELECTED FILTER, AND THE USER CONFIDENCE RATING DOES NOT MATCH THE SELECTED FILTER, RETURN NULL
                          if (
                            selectedConfidenceRating &&
                            userConfidenceRating !== selectedConfidenceRating
                          ) {
                            return null;
                          }

                          // FILTER BY SEARCH TERM
                          if (
                            searchTerm &&
                            !(
                              point.title
                                .toLowerCase()
                                .includes(String(searchTerm).toLowerCase()) ||
                              point.number
                                .toLowerCase()
                                .includes(String(searchTerm).toLowerCase())
                            )
                          ) {
                            return null;
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
