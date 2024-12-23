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
  percentageCompleted?: number;
  link?: string;
};

export type Syllabus = {
  id: string;
  title: string;
  spec: string;
  topics: Topic[];
  percentageCompleted?: number;
  link?: string;
};

export type UserSubject = {
  id: string;
  title: string;
  examBoard: string;
  topics: Topic[];
  link?: string;
};

export type User = {
  id?: string;
  uid?: string;
  email?: string;
  subjects?: UserSubject[];
  specs?: UserSpec[];
  disabledGuides?: {
    [key: string]: boolean;
  };
  lastSeen: Date;
  studyStreak: number;
};

export type ConfidenceRating = "low" | "medium" | "high";

export type Todo = {
  id?: string;
  title: string;
  createdBy: string;
  createdAt: Date;
  dueDate?: any;
  completed: boolean;
  point?: Point;
  subjectInfo?: {
    id: string;
    title: string;
  };
};
