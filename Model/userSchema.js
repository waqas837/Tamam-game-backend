const mongoose = require("mongoose");


// / Sub-Schemas
const UserQuestionSchema = new mongoose.Schema({
  answered: { type: Boolean, default: false },
  question: { type: String, required: true },
  points: { type: Number, required: true },
  answer: { type: String, required: true },
});

const UserCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, default: "" },
  questions: [UserQuestionSchema],
});

const UserQuestionsSchema = new mongoose.Schema({
  categories: [UserCategorySchema],
});

const TeamSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  score: { type: Number, default: 0 },
  Questions: [UserQuestionsSchema],
  
});
const GameSchema = new mongoose.Schema({
  GameName:String,
  Teams: [TeamSchema],
  allQuestions:[]
});
// Define each package type schema
const FreePackageSchema = new mongoose.Schema({
  Game1: GameSchema, // 1 free
});
// Define each package type schema
const BasicPackageSchema = new mongoose.Schema({
  Game1: GameSchema,
});

const PremiumPackageSchema = new mongoose.Schema({
  Game1: GameSchema,
  Game2: GameSchema,
});

const ElitePackageSchema = new mongoose.Schema({
  Game1: GameSchema,
  Game2: GameSchema,
  Game3: GameSchema,
  Game4: GameSchema,
  Game5: GameSchema,
});

const DiamondPackageSchema = new mongoose.Schema({
  Game1: GameSchema,
  Game2: GameSchema,
  Game3: GameSchema,
  Game4: GameSchema,
  Game5: GameSchema,
  Game6: GameSchema,
  Game7: GameSchema,
  Game8: GameSchema,
  Game9: GameSchema,
  Game10: GameSchema,
});

const userData = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  // It is the form action while creat a new team
  allowedToCreateGames: { type: Number, default: 1 },
  currentPackage: { type: String, default: "free" },
  currentPaid: { type: String },
  totalPaid: { type: String },
  // 6 categories = 1 Game and keeps only game records for the host
  myGames: {
    FreePackage: [FreePackageSchema],
    BasicPackage: [BasicPackageSchema],
    PremiumPackage: [PremiumPackageSchema],
    ElitePackage: [ElitePackageSchema],
    DiamondPackage: [DiamondPackageSchema],
  },
});

// Ends user schema

// Question Schema
const questionSchema = new mongoose.Schema({
  answered: { type: Boolean, default: false },
  question: { type: String, required: true },
  points: { type: Number, required: true },
  answer: { type: String, required: true },
  image: { type: String }, // Optional, as not all questions might have images
});

// RAW Category Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  questions: [questionSchema], // Array of questions based on the questionSchema
});
const usersignup = new mongoose.model("usersignup", userData);
const questionSchem = new mongoose.model("categorySchema", categorySchema);

module.exports = {
  usersignup,
  questionSchem,
};
