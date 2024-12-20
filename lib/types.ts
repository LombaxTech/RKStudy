export type Point = {
  title: string;
  number: string;
};

export type Topic = {
  number: string;
  title: string;
  subtopics: Subtopic[];
};

export type Subtopic = {
  number: string;
  title: string;
  points: Point[];
};

export type UserSpec = {
  id: string;
  spec: string;
  title: string;
  studyPointConfidenceRatings: {
    [key: string]: string;
  };
};

export type User = {
  id?: string;
  uid?: string;
  email?: string;
  specs?: UserSpec[];
};

export type ConfidenceRating = "low" | "medium" | "high";

export type Syllabus = {
  id: string;
  title: string;
  spec: string;
  topics: Topic[];
};
