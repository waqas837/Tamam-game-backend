require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("../routes");
const app = express();
const path = require("path");
app.use(cors());
require("../db");
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
const { questionSchem, Category } = require("../Model/userSchema");

// Example data array to be inserted
const categories = [
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
      "https://images.pexels.com/photos/586415/pexels-photo-586415.jpeg?auto=compress&cs=tinysrgb&w=600",
    questions: [
      {
        points: 200,
        question: "What is the chemical symbol for water?",
        answered: false,
        answer: "H2O",
      },
      {
        points: 400,
        question: "What planet is known as the Red Planet?",
        answered: false,
        answer: "Mars",
      },
      {
        points: 600,
        question: "What is the powerhouse of the cell?",
        answered: false,
        answer: "Mitochondria",
      },
      {
        points: 200,
        question: "What gas do plants absorb from the atmosphere?",
        answered: false,
        answer: "Carbon Dioxide",
      },
      {
        points: 400,
        question: "Who developed the theory of relativity?",
        answered: false,
        answer: "Albert Einstein",
      },
      {
        points: 600,
        question: "What is the speed of light?",
        answered: false,
        answer: "299,792 km/s",
      },
    ],
  },
  {
    name: "Literature",
    image:
      "https://images.pexels.com/photos/374682/pexels-photo-374682.jpeg?auto=compress&cs=tinysrgb&w=600",
    questions: [
      {
        points: 200,
        question: "Who wrote 'Romeo and Juliet'?",
        answered: false,
        answer: "William Shakespeare",
      },
      {
        points: 400,
        question: "Who is the author of '1984'?",
        answered: false,
        answer: "George Orwell",
      },
      {
        points: 600,
        question: "In which novel does the character 'Atticus Finch' appear?",
        answered: false,
        answer: "To Kill a Mockingbird",
      },
      {
        points: 200,
        question: "Who wrote 'Pride and Prejudice'?",
        answered: false,
        answer: "Jane Austen",
      },
      {
        points: 400,
        question: "What is the title of the first Harry Potter book?",
        answered: false,
        answer: "Harry Potter and the Philosopher's Stone",
      },
      {
        points: 600,
        question: "Who wrote 'The Catcher in the Rye'?",
        answered: false,
        answer: "J.D. Salinger",
      },
    ],
  },
  {
    name: "Geography",
    image:
      "https://images.pexels.com/photos/259447/pexels-photo-259447.jpeg?auto=compress&cs=tinysrgb&w=600",
    questions: [
      {
        points: 200,
        question: "What is the capital of France?",
        answered: false,
        answer: "Paris",
      },
      {
        points: 400,
        question: "Which country has the largest population?",
        answered: false,
        answer: "China",
      },
      {
        points: 600,
        question: "What is the longest river in the world?",
        answered: false,
        answer: "Nile",
      },
      {
        points: 200,
        question: "What is the smallest country in the world?",
        answered: false,
        answer: "Vatican City",
      },
      {
        points: 400,
        question: "Which continent is the Sahara Desert located on?",
        answered: false,
        answer: "Africa",
      },
      {
        points: 600,
        question: "What is the tallest mountain in the world?",
        answered: false,
        answer: "Mount Everest",
      },
    ],
  },
  {
    name: "Movies",
    image:
      "https://images.pexels.com/photos/3206172/pexels-photo-3206172.jpeg?auto=compress&cs=tinysrgb&w=600",
    questions: [
      {
        points: 200,
        question: "Who directed 'Jurassic Park'?",
        answered: false,
        answer: "Steven Spielberg",
      },
      {
        points: 400,
        question: "What movie features the quote 'I'll be back'?",
        answered: false,
        answer: "The Terminator",
      },
      {
        points: 600,
        question: "Who played Jack Dawson in 'Titanic'?",
        answered: false,
        answer: "Leonardo DiCaprio",
      },
      {
        points: 200,
        question: "Which movie won the first Academy Award for Best Picture?",
        answered: false,
        answer: "Wings",
      },
      {
        points: 400,
        question: "Who directed 'Pulp Fiction'?",
        answered: false,
        answer: "Quentin Tarantino",
      },
      {
        points: 600,
        question: "What is the highest-grossing film of all time?",
        answered: false,
        answer: "Avatar",
      },
    ],
  },
  {
    name: "Sports",
    image:
      "https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=600",
    questions: [
      {
        points: 200,
        question: "Which country won the FIFA World Cup in 2018?",
        answered: false,
        answer: "France",
      },
      {
        points: 400,
        question: "Who is known as 'The Greatest' in boxing?",
        answered: false,
        answer: "Muhammad Ali",
      },
      {
        points: 600,
        question: "How many players are there in a baseball team?",
        answered: false,
        answer: "Nine",
      },
      {
        points: 200,
        question: "In which sport would you perform a slam dunk?",
        answered: false,
        answer: "Basketball",
      },
      {
        points: 400,
        question: "Who has won the most Grand Slam titles in tennis?",
        answered: false,
        answer: "Serena Williams",
      },
      {
        points: 600,
        question: "Which country hosted the 2016 Summer Olympics?",
        answered: false,
        answer: "Brazil",
      },
    ],
  },
  {
    name: "Music",
    image:
      "https://images.pexels.com/photos/164721/pexels-photo-164721.jpeg?auto=compress&cs=tinysrgb&w=600",
    questions: [
      {
        points: 200,
        question: "Who is known as the 'King of Pop'?",
        answered: false,
        answer: "Michael Jackson",
      },
      {
        points: 400,
        question: "Which band was Freddie Mercury the lead singer of?",
        answered: false,
        answer: "Queen",
      },
      {
        points: 600,
        question: "What is the best-selling album of all time?",
        answered: false,
        answer: "Thriller",
      },
      {
        points: 200,
        question: "Who sang 'Rolling in the Deep'?",
        answered: false,
        answer: "Adele",
      },
      {
        points: 400,
        question: "Which instrument does Yo-Yo Ma play?",
        answered: false,
        answer: "Cello",
      },
      {
        points: 600,
        question: "What is the stage name of Marshall Mathers?",
        answered: false,
        answer: "Eminem",
      },
    ],
  },
];


// Function to insert data
const insertCategories = async () => {
  try {
    // Insert the categories into the database
    await Category.insertMany(categories);
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
