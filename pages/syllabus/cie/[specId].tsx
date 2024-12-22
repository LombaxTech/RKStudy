import { AuthContext } from "@/context/AuthContext";
import { availableSpecs } from "@/lib/specData/specs";
import {
  ConfidenceRating,
  Point,
  Syllabus,
  Topic,
  User,
  UserSpec,
} from "@/lib/types";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import {
  FaArrowLeftLong,
  FaFaceFrown,
  FaFaceMeh,
  FaFaceSmile,
} from "react-icons/fa6";

import SpecPageGuideModal from "@/components/syllabus/SpecPageGuideModal";
import { db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { FaPlusCircle } from "react-icons/fa";
import AddTodoModal from "@/components/syllabus/AddTodoModal";

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

  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);
  const [pointToAddToTodo, setPointToAddToTodo] = useState<Point | null>(null);
  const [addTodoModalIsOpen, setAddTodoModalIsOpen] = useState<boolean>(false);

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

      let currentSpec = userOldSpecs?.find((spec) => spec.id === syllabus.id);

      if (!currentSpec) {
        // IF USER CURRENT SPEC DOES NOT EXIST, CREATE A NEW ONE
        currentSpec = {
          id: syllabus.id,
          title: syllabus.title,
          spec: syllabus.spec,
          studyPointConfidenceRatings: {
            [point.number]: rating,
          },
          percentageCompleted: 0,
        };

        userNewSpecs = [...userOldSpecs, currentSpec];
      } else {
        // IF USER CURRENT SPEC EXISTS, UPDATE IT
        currentSpec = {
          ...currentSpec,
          studyPointConfidenceRatings: {
            ...currentSpec.studyPointConfidenceRatings,
            [point.number]: rating,
          },
        };

        userNewSpecs = userOldSpecs.map((spec) => {
          if (spec.id === syllabus.id) return currentSpec;
          return spec;
        });
      }

      // CALCULATE PERCENTAGE COMPLETED
      // FIGURE OUT TOTAL NUMBER OF POINTS
      let totalPoints = 0;
      syllabus.topics.forEach((topic) => {
        topic.subtopics.forEach((subtopic) => {
          totalPoints += subtopic.points.length;
        });
      });

      // FIGURE OUT NUMBER OF POINTS THAT HAVE A CONFIDENCE RATING OF HIGHEST
      let numberOfPointsWithHighestConfidence = 0;
      Object.values(currentSpec!.studyPointConfidenceRatings).forEach(
        (rating) => {
          if (rating === "high") numberOfPointsWithHighestConfidence++;
        }
      );

      let percentageCompleted =
        (numberOfPointsWithHighestConfidence / totalPoints) * 100;
      percentageCompleted = Math.round(percentageCompleted);

      userNewSpecs = userNewSpecs.map((spec: UserSpec) => {
        if (spec.id === syllabus.id)
          return { ...spec, percentageCompleted: percentageCompleted };
        return spec;
      });

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
    <>
      <div className="flex-1 p-4 flex flex-col gap-2">
        {/* GO BACK */}
        <Link href="/syllabus" className="w-fit">
          <span className="underline cursor-pointer">
            <FaArrowLeftLong />
          </span>
        </Link>

        {/* HEADER */}
        <div className="flex flex-col items-start justify-start gap-2 md:flex-row md:items-center md:justify-between">
          {/* TITLE AND PERCENTAGE COMPLETED */}
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold">{syllabus.title}</h1>
            <div className="flex flex-col gap-1">
              <div className="w-48 h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{
                    width: `${userCurrentSpec?.percentageCompleted || 0}%`,
                  }}
                />
              </div>
              <p className="text-sm text-gray-500">
                {userCurrentSpec?.percentageCompleted || 0}% completed
              </p>
            </div>
          </div>
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
          <div className="flex items-center self-end md:self-center gap-2">
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
                  point.title
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
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
                                onMouseEnter={() =>
                                  setHoveredPoint(point.number)
                                }
                                onMouseLeave={() => setHoveredPoint(null)}
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
                                <div
                                  className="flex items-center gap-2"
                                  onClick={() => {
                                    setPointToAddToTodo(point);
                                    setAddTodoModalIsOpen(true);
                                  }}
                                >
                                  <FaPlusCircle className="cursor-pointer hover:scale-125 transition-all duration-300" />
                                  {hoveredPoint === point.number && (
                                    <span className="text-sm font-medium underline cursor-pointer">
                                      Add to my todo list
                                    </span>
                                  )}
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
          })}
        </div>
      </div>
      {user.disabledGuides?.specPageGuide ? null : <SpecPageGuideModal />}
      {addTodoModalIsOpen && pointToAddToTodo && (
        <AddTodoModal
          addTodoModalIsOpen={addTodoModalIsOpen}
          setAddTodoModalIsOpen={setAddTodoModalIsOpen}
          point={pointToAddToTodo}
        />
      )}
    </>
  );
}
