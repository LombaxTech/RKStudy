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

export type Syllabus = {
  id: string;
  title: string;
  spec: string;
  topics: Topic[];
};

export type UserSubject = {
  id: string;
  title: string;
  examBoard: string;
  topics: Topic[];
};

export type User = {
  id?: string;
  uid?: string;
  email?: string;
  subjects?: UserSubject[];
  specs?: UserSpec[];
};

export type ConfidenceRating = "low" | "medium" | "high";
