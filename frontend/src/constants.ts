export const testData: any = {
  topic: "History of Ancient Rome",
  questions: [
    {
      id: "q1",
      question: "Who was the first emperor of Rome?",
      choices: ["Julius Caesar", "Augustus", "Nero", "Caligula", "Tiberius"],
      answer: "Augustus",
    },
    {
      id: "q2",
      question: "What was the primary language spoken in Ancient Rome?",
      choices: ["Greek", "Latin", "Etruscan", "Phoenician", "Aramaic"],
      answer: "Latin",
    },
    {
      id: "q3",
      question: "Which Roman structure was used for gladiatorial contests?",
      choices: [
        "Pantheon",
        "Colosseum",
        "Forum",
        "Circus Maximus",
        "Baths of Caracalla",
      ],
      answer: "Colosseum",
    },
    {
      id: "q4",
      question: "What river runs through the city of Rome?",
      choices: ["Tiber", "Nile", "Danube", "Rhine", "Seine"],
      answer: "Tiber",
    },
    {
      id: "q5",
      question: "Who was the Roman god of war?",
      choices: ["Jupiter", "Mars", "Venus", "Neptune", "Saturn"],
      answer: "Mars",
    },
  ],
};

export const QUIZ_API_URL = process.env.REACT_APP_QUIZ_API_URL