export const subjects = [
  "Mathematics",
  "English Language",
  "English Literature",
  "Biology",
  "Chemistry",
  "Physics",
  "History",
  "Geography",
  "Computer Science",
  "Religious Studies",
  "Business Studies",
  "Economics",
  "Finance",
  "Art and Design",
  "Design and Technology",
  "Music",
];

export const studyLevels = ["GCSE", "A-Level"];

export const historyQuiz = {
  title: "History Quiz: Slavery",
  topic: "History",
  creator: "User123",
  dateCreated: "2024-03-03T12:00:00Z",
  questions: [
    {
      questionText: "Who issued the Emancipation Proclamation?",
      options: [
        "Abraham Lincoln",
        "Thomas Jefferson",
        "Andrew Jackson",
        "George Washington",
      ],
      correctAnswer: "Abraham Lincoln",
    },
    {
      questionText: "When was the Civil Rights Act of 1964 signed into law?",
      options: ["1963", "1964", "1965", "1966"],
      correctAnswer: "1964",
    },
    {
      questionText:
        "Which state was the first to secede from the Union prior to the Civil War?",
      options: ["South Carolina", "Virginia", "Texas", "Georgia"],
      correctAnswer: "South Carolina",
    },
    {
      questionText:
        "What was the name of the network of escape routes used by enslaved African Americans to escape to free states and Canada?",
      options: [
        "Underground Railroad",
        "Freedom Trail",
        "Path to Liberty",
        "Emancipation Pathway",
      ],
      correctAnswer: "Underground Railroad",
    },
  ],
};

export const monthlyLimit = 5;

export const demoGenerationLimit = 2;

export const analyticEvents = {
  demoQuizGen: "demo-quiz-gen",
  quizGen: "quiz-gen",
  demoLimitHit: "demo-limit-hit",
  limitHit: "limit-hit",
  signup: "",
  genError: "gen-error",
  createAccount: "create-account",
};
