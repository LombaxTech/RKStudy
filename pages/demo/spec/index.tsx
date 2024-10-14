import React, { useState } from "react";
import { mathGCSESpec } from "@/specData";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

type Confidence = {
  [key: string]: number;
};

export default function SpecDemo() {
  const [confidence, setConfidence] = useState<Confidence>({});
  const [filter, setFilter] = useState<number | null>(null);
  const [expandedSubtopics, setExpandedSubtopics] = useState<string[]>([]);
  const [expandedTopics, setExpandedTopics] = useState<string[]>([]);

  const handleConfidenceChange = (topicNumber: string, level: number) => {
    const newConfidence: Confidence = { ...confidence };
    if (confidence[topicNumber] === level) {
      delete newConfidence[topicNumber];
    } else {
      newConfidence[topicNumber] = level;
    }
    setConfidence(newConfidence);
  };

  const toggleSubtopic = (subtopicNumber: string) => {
    setExpandedSubtopics((prev) =>
      prev.includes(subtopicNumber)
        ? prev.filter((num) => num !== subtopicNumber)
        : [...prev, subtopicNumber]
    );
  };

  const toggleTopic = (topicNumber: string) => {
    setExpandedTopics((prev) =>
      prev.includes(topicNumber)
        ? prev.filter((num) => num !== topicNumber)
        : [...prev, topicNumber]
    );
  };

  const clearAllConfidence = () => {
    if (
      window.confirm("Are you sure you want to clear all confidence levels?")
    ) {
      setConfidence({});
    }
  };

  const ConfidenceBoxes = ({ topicNumber }: { topicNumber: string }) => (
    <div className="flex gap-1 items-center ml-2">
      {[1, 2, 3].map((level) => (
        <button
          key={level}
          onClick={() => handleConfidenceChange(topicNumber, level)}
          className={`w-6 h-6 rounded-sm ${
            confidence[topicNumber] === level
              ? "border-2 border-black"
              : "border border-gray-300"
          } ${
            level === 1
              ? "bg-red-500"
              : level === 2
              ? "bg-yellow-500"
              : "bg-green-500"
          }`}
          aria-label={
            level === 1
              ? "No confidence"
              : level === 2
              ? "Some confidence"
              : "Confident"
          }
        />
      ))}
    </div>
  );

  const filterTopics = (topic: any) => {
    if (filter === null) return true;
    return topic.subtopics.some((subtopic: any) =>
      subtopic.subtopics
        ? subtopic.subtopics.some(
            (subsubtopic: any) => confidence[subsubtopic.number] === filter
          )
        : confidence[subtopic.number] === filter
    );
  };

  const getConfidenceColor = (level: number | undefined) => {
    switch (level) {
      case 1:
        return "bg-red-100";
      case 2:
        return "bg-yellow-100";
      case 3:
        return "bg-green-100";
      default:
        return "bg-white";
    }
  };

  return (
    <div className="p-4 flex flex-col gap-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        GCSE Mathematics Specification Demo
      </h1>
      <div
        className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4"
        role="alert"
      >
        <p className="font-bold">Demo Notice</p>
        <p>
          This is a demo version. Your confidence levels will not be saved and
          will reset on page refresh.
        </p>
      </div>
      <div className="flex justify-between mb-4 items-center">
        <div>
          <button
            onClick={() => setFilter(null)}
            className={`mr-2 px-3 py-1 rounded-full ${
              filter === null
                ? "bg-gray-300 font-bold border-2 border-gray-500"
                : "bg-gray-100"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter(3)}
            className={`mr-2 px-3 py-1 rounded-full ${
              filter === 3
                ? "bg-green-300 font-bold border-2 border-green-500"
                : "bg-green-100"
            }`}
          >
            Confident
          </button>
          <button
            onClick={() => setFilter(2)}
            className={`mr-2 px-3 py-1 rounded-full ${
              filter === 2
                ? "bg-yellow-300 font-bold border-2 border-yellow-500"
                : "bg-yellow-100"
            }`}
          >
            Unsure
          </button>
          <button
            onClick={() => setFilter(1)}
            className={`mr-2 px-3 py-1 rounded-full ${
              filter === 1
                ? "bg-red-300 font-bold border-2 border-red-500"
                : "bg-red-100"
            }`}
          >
            Don't Know
          </button>
        </div>
        <button
          onClick={clearAllConfidence}
          className="px-3 py-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-300"
        >
          Clear All Confidence Levels
        </button>
      </div>

      {mathGCSESpec.topics.filter(filterTopics).map((topic) => (
        <div
          key={topic.number}
          className="mb-8 border-2 border-gray-300 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleTopic(topic.number)}
          >
            <h2
              className={`text-2xl font-semibold ${
                topic.subtopics.every(
                  (subtopic) =>
                    (!subtopic.subtopics &&
                      confidence[subtopic.number] === 3) ||
                    (subtopic.subtopics &&
                      subtopic.subtopics.every(
                        (subsubtopic) => confidence[subsubtopic.number] === 3
                      ))
                )
                  ? "text-green-600"
                  : "text-gray-700"
              }`}
            >
              {topic.number}. {topic.title}
            </h2>
            <span className="ml-2">
              {expandedTopics.includes(topic.number) ? (
                <FaChevronDown className="inline" />
              ) : (
                <FaChevronRight className="inline" />
              )}
            </span>
          </div>
          {expandedTopics.includes(topic.number) && (
            <ul className="space-y-4 mt-4">
              {topic.subtopics.map((subtopic, index) => (
                <li
                  key={subtopic.number}
                  className={`p-4 border border-gray-200 rounded-lg transition-all duration-300 hover:border-gray-400
                  
                  ${getConfidenceColor(confidence[subtopic.number])}
                  }`}
                  style={{
                    display:
                      filter === null ||
                      confidence[subtopic.number] === filter ||
                      (subtopic.subtopics &&
                        subtopic.subtopics.some(
                          (subsubtopic) =>
                            confidence[subsubtopic.number] === filter
                        ))
                        ? "block"
                        : "none",
                  }}
                >
                  <div
                    className="flex items-start justify-between cursor-pointer"
                    onClick={() =>
                      subtopic.subtopics && toggleSubtopic(subtopic.number)
                    }
                  >
                    <div className="flex-grow">
                      <h3
                        className={`text-lg font-medium mb-2 ${
                          subtopic.subtopics
                            ? subtopic.subtopics.every(
                                (subsubtopic) =>
                                  confidence[subsubtopic.number] === 3
                              )
                              ? "text-green-600"
                              : "text-gray-800"
                            : confidence[subtopic.number] === 1
                            ? "text-red-600"
                            : confidence[subtopic.number] === 2
                            ? "text-yellow-600"
                            : confidence[subtopic.number] === 3
                            ? "text-green-600"
                            : "text-gray-800"
                        }`}
                      >
                        {subtopic.number} {subtopic.title}
                        {subtopic.subtopics && (
                          <span className="ml-2">
                            {expandedSubtopics.includes(subtopic.number) ? (
                              <FaChevronDown className="inline" />
                            ) : (
                              <FaChevronRight className="inline" />
                            )}
                          </span>
                        )}
                      </h3>
                      {subtopic.description && (
                        <p className="text-sm text-gray-600 mb-3">
                          {subtopic.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center">
                      {!subtopic.subtopics && (
                        <ConfidenceBoxes topicNumber={subtopic.number} />
                      )}
                    </div>
                  </div>
                  {subtopic.subtopics &&
                    expandedSubtopics.includes(subtopic.number) && (
                      <ul className="mt-3 space-y-2">
                        {subtopic.subtopics.map((subsubtopic, subIndex) => (
                          <li
                            key={subsubtopic.number}
                            className={`p-3 border border-gray-200 rounded-md transition-all duration-300 hover:border-gray-400 ${getConfidenceColor(
                              confidence[subsubtopic.number]
                            )}`}
                            style={{
                              display:
                                filter === null ||
                                confidence[subsubtopic.number] === filter
                                  ? "block"
                                  : "none",
                            }}
                          >
                            <div className="flex items-start">
                              <div className="flex-grow">
                                <h4
                                  className={`text-md font-medium mb-1 ${
                                    confidence[subsubtopic.number] === 1
                                      ? "text-red-600"
                                      : confidence[subsubtopic.number] === 2
                                      ? "text-yellow-600"
                                      : confidence[subsubtopic.number] === 3
                                      ? "text-green-600"
                                      : "text-gray-800"
                                  }`}
                                >
                                  {subsubtopic.number} {subsubtopic.title}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {subsubtopic.description}
                                </p>
                              </div>
                              <ConfidenceBoxes
                                topicNumber={subsubtopic.number}
                              />
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
