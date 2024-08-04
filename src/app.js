require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("../routes");
const app = express();
const path = require("path");
app.use(cors());
require("../db")
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));
var Port = process.env.PORT || 1000;
app.use("/", router);
// http://host/images/filename.jpg or any file
app.use("/images", express.static(path.join("public/images/")));
app.get("/", (req, res) => {
  res.json({ message: "welcome to the tamam game backend" });
});

// insert many questions:

// Import the Question model
const { questionSchem } = require("../Model/userSchema");

// Example data array to be inserted
const categories = [
  {
    name: "Geography",
    image:
      "https://images.pexels.com/photos/335393/pexels-photo-335393.jpeg?auto=compress&cs=tinysrgb&w=600",
    questions: [
      {
        points: 200,
        question: "What is the capital of Pakistan?",
        answered: false,
        answer: "Islamabad",
      },
      {
        points: 400,
        question: "What is the largest country in the world?",
        answered: false,
        answer: "Russia",
      },
      {
        points: 600,
        question: "What is the tallest mountain in the world?",
        answered: false,
        answer: "Mount Everest",
      },
      {
        points: 200,
        question: "What is the longest river in Africa?",
        answered: false,
        answer: "Nile",
      },
      {
        points: 400,
        question: "Which country has the most islands?",
        answered: false,
        answer: "Sweden",
      },
      {
        points: 600,
        question: "What is the driest place on Earth?",
        answered: false,
        answer: "Atacama Desert",
      },
    ],
  },
  {
    name: "History",
    image:
      "https://images.pexels.com/photos/820735/pexels-photo-820735.jpeg?auto=compress&cs=tinysrgb&w=600",
    questions: [
      {
        points: 200,
        question: "Who was the first President of the USA?",
        answered: false,
        answer: "George Washington",
      },
      {
        points: 400,
        question: "What year did World War II end?",
        answered: false,
        answer: "1945",
      },
      {
        points: 600,
        question:
          "What was the name of the ship that carried the Pilgrims to America?",
        answered: false,
        answer: "Mayflower",
      },
      {
        points: 200,
        question: "Who wrote the Declaration of Independence?",
        answered: false,
        answer: "Thomas Jefferson",
      },
      {
        points: 400,
        question: "In what year did the Berlin Wall fall?",
        answered: false,
        answer: "1989",
      },
      {
        points: 600,
        question: "Who was the last Pharaoh of Egypt?",
        answered: false,
        answer: "Cleopatra",
      },
    ],
  },
  {
    name: "Science",
    image:
      "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=600",
    questions: [
      {
        points: 200,
        question: "What is the chemical symbol for gold?",
        answered: false,
        answer: "Au",
      },
      {
        points: 400,
        question: "What is the largest planet in our solar system?",
        answered: false,
        answer: "Jupiter",
      },
      {
        points: 600,
        question: "What is the speed of light in meters per second?",
        answered: false,
        answer: "299,792,458",
      },
      {
        points: 200,
        question: "What is the hardest natural substance on Earth?",
        answered: false,
        answer: "Diamond",
      },
      {
        points: 400,
        question: "What is the process by which plants make their own food?",
        answered: false,
        answer: "Photosynthesis",
      },
      {
        points: 600,
        question: "What is the name of the closest galaxy to the Milky Way?",
        answered: false,
        answer: "Andromeda",
      },
    ],
  },
  {
    name: "Literature",
    image:
      "https://images.pexels.com/photos/1261180/pexels-photo-1261180.jpeg?auto=compress&cs=tinysrgb&w=600",
    questions: [
      {
        points: 200,
        question: "Who wrote 'Romeo and Juliet'?",
        answered: false,
        answer: "William Shakespeare",
      },
      {
        points: 400,
        question: "What is the name of the wizard school in Harry Potter?",
        answered: false,
        answer: "Hogwarts",
      },
      {
        points: 600,
        question: "Who is the author of '1984'?",
        answered: false,
        answer: "George Orwell",
      },
      {
        points: 200,
        question: "What is the name of the hobbit in 'The Lord of the Rings'?",
        answered: false,
        answer: "Frodo Baggins",
      },
      {
        points: 400,
        question: "Who wrote 'To Kill a Mockingbird'?",
        answered: false,
        answer: "Harper Lee",
      },
      {
        points: 600,
        question:
          "What is the name of the monster in Mary Shelley's famous novel?",
        answered: false,
        answer: "Frankenstein's Monster",
      },
    ],
  },
  {
    name: "Pop Culture",
    image:
      "https://images.pexels.com/photos/9611352/pexels-photo-9611352.jpeg?auto=compress&cs=tinysrgb&w=600",
    questions: [
      {
        points: 200,
        question: "Who played Iron Man in the Marvel Cinematic Universe?",
        answered: false,
        answer: "Robert Downey Jr.",
      },
      {
        points: 400,
        question: "What is the name of the fictional country in Black Panther?",
        answered: false,
        answer: "Wakanda",
      },
      {
        points: 600,
        question: "Who is the lead singer of the band Queen?",
        answered: false,
        answer: "Freddie Mercury",
      },
      {
        points: 200,
        question: "What is the name of the theme park in Jurassic Park?",
        answered: false,
        answer: "Jurassic Park",
      },
      {
        points: 400,
        question: "Who directed the movie 'Titanic'?",
        answered: false,
        answer: "James Cameron",
      },
      {
        points: 600,
        question:
          "What is the name of Eleven's favorite food in 'Stranger Things'?",
        answered: false,
        answer: "Eggo Waffles",
      },
    ],
  },
  {
    name: "Sports",
    image:
      "https://images.pexels.com/photos/1618269/pexels-photo-1618269.jpeg?auto=compress&cs=tinysrgb&w=600",
    questions: [
      {
        points: 200,
        question: "In which sport would you perform a slam dunk?",
        answered: false,
        answer: "Basketball",
      },
      {
        points: 400,
        question: "How many players are on a soccer team on the field?",
        answered: false,
        answer: "11",
      },
      {
        points: 600,
        question: "Who has won the most Grand Slam tennis tournaments?",
        answered: false,
        answer: "Margaret Court",
      },
      {
        points: 200,
        question: "What country invented the sport of rugby?",
        answered: false,
        answer: "England",
      },
      {
        points: 400,
        question: "In which Olympics did Usain Bolt first compete?",
        answered: false,
        answer: "2008 Beijing Olympics",
      },
      {
        points: 600,
        question: "What is the diameter of a basketball hoop in inches?",
        answered: false,
        answer: "18",
      },
    ],
  },
];

// Function to insert data
const insertCategories = async () => {
  try {
    // Insert the categories into the database
    await questionSchem.insertMany(categories);
    console.log("Categories inserted successfully!");
  } catch (err) {
    console.error("Error inserting categories:", err);
  }
};

// Call the function to insert data
// insertCategories();

app.listen(Port, () => {
  console.log(`server is listening at port ${Port}`);
});
