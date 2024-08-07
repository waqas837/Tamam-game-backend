const mongoose = require("mongoose");

// // / Sub-Schemas
// const UserQuestionSchema = new mongoose.Schema({
//   answered: { type: Boolean, default: false },
//   question: { type: String, required: true },
//   points: { type: Number, required: true },
//   answer: { type: String, required: true },
// });

// const UserCategorySchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   image: { type: String, default: "" },
//   questions: [UserQuestionSchema],
// });

// const UserQuestionsSchema = new mongoose.Schema({
//   categories: [UserCategorySchema],
// });

// const TeamSchema = new mongoose.Schema({
//   teamName: { type: String, required: true },
//   score: { type: Number, default: 0 },
//   solvedQuestion: [UserQuestionsSchema],
// });
// const GameSchema = new mongoose.Schema({
//   GameName: String,
//   Teams: [TeamSchema],
//   allQuestions: [
//     {
//       _id: "ObjectId",
//       name: "String",
//       image: "String",
//       questions: [
//         {
//           answered: "Boolean",
//           question: "String",
//           points: "Number",
//           answer: "String",
//           _id: "ObjectId",
//         },
//       ],
//     },
//   ],
// });
// // Define each package type schema
// const FreePackageSchema = new mongoose.Schema({
//   Game1: GameSchema, // 1 free
// });
// // Define each package type schema
// const BasicPackageSchema = new mongoose.Schema({
//   Game1: GameSchema,
// });

// const PremiumPackageSchema = new mongoose.Schema({
//   Game1: GameSchema,
//   Game2: GameSchema,
// });

// const ElitePackageSchema = new mongoose.Schema({
//   Game1: GameSchema,
//   Game2: GameSchema,
//   Game3: GameSchema,
//   Game4: GameSchema,
//   Game5: GameSchema,
// });

// const DiamondPackageSchema = new mongoose.Schema({
//   Game1: GameSchema,
//   Game2: GameSchema,
//   Game3: GameSchema,
//   Game4: GameSchema,
//   Game5: GameSchema,
//   Game6: GameSchema,
//   Game7: GameSchema,
//   Game8: GameSchema,
//   Game9: GameSchema,
//   Game10: GameSchema,
// });

// const userData = new mongoose.Schema({
//   username: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   phone: { type: String, required: true, unique: true },
//   // It is the form action while creat a new team
//   allowedToCreateGames: { type: Number, default: 1 },
//   currentPackage: { type: String, default: "free" },
//   currentPaid: { type: String },
//   totalPaid: { type: String },
//   // 6 categories = 1 Game and keeps only game records for the host
//   myGames: {
//     FreePackage: [FreePackageSchema],
//     BasicPackage: [BasicPackageSchema],
//     PremiumPackage: [PremiumPackageSchema],
//     ElitePackage: [ElitePackageSchema],
//     DiamondPackage: [DiamondPackageSchema],
//   },
// });

// // Ends user schema

// // Question Schema
// const questionSchema = new mongoose.Schema({
//   answered: { type: Boolean, default: false },
//   question: { type: String, required: true },
//   points: { type: Number, required: true },
//   answer: { type: String, required: true },
//   image: { type: String }, // Optional, as not all questions might have images
// });

// // RAW Category Schema
// const categorySchema = new mongoose.Schema({
//   name: { type: String, required: true, unique: true },
//   image: { type: String, required: true },
//   questions: [questionSchema], // Array of questions based on the questionSchema
// });
// const usersignup = new mongoose.model("usersignup", userData);
// const questionSchem = new mongoose.model("categorySchema", categorySchema);

// module.exports = {
//   usersignup,
//   questionSchem,
// };

// Define the User schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  currentPackage: { type: String, default: "free" },
  myHostGames: [
    { type: mongoose.mongoose.Schema.Types.ObjectId, ref: "MyGame" },
  ],

  freePackage: [
    { type: mongoose.mongoose.Schema.Types.ObjectId, ref: "FreePackage" },
  ],
  premiumPackage: [
    { type: mongoose.mongoose.Schema.Types.ObjectId, ref: "PremiumPackage" },
  ],
  elitePackage: [
    { type: mongoose.mongoose.Schema.Types.ObjectId, ref: "ElitePackage" },
  ],
  diamondPackage: [
    { type: mongoose.mongoose.Schema.Types.ObjectId, ref: "DiamondPackage" },
  ],
  paymentInfo: [
    { type: mongoose.mongoose.Schema.Types.ObjectId, ref: "PaymentInfo" },
  ],
});

// Define schemas with multiple references to the User schema
const BasicPackageSchema = new mongoose.Schema({
  title: { type: String, default: "Basic Package" },
  description: {
    type: String,
    default: "Advanced features with basic support.",
  },
  price: { type: Number, default: 1 },
  features: { type: [String], default: ["Basic support", "Basic access"] },
  img: { type: String, default: "package1.png" }, // Default image path
  text: { type: String, default: "Basic features" }, // Default text
});

const FreePackageSchema = new mongoose.Schema({
  title: { type: String, default: "Free Package" },
  description: { type: String, default: "Basic features available for free." },
  features: { type: [String], default: ["Basic support", "Limited access"] },
  img: { type: String, default: "package1.png" }, // Default image path
  text: { type: String, default: "Free features" }, // Default text
});

const PremiumPackageSchema = new mongoose.Schema({
  title: { type: String, default: "Premium Package" },
  description: {
    type: String,
    default: "Advanced features with premium support.",
  },
  price: { type: Number, default: 3 },
  features: { type: [String], default: ["Premium support", "Extended access"] },
  img: { type: String, default: "package2.png" }, // Default image path
  text: { type: String, default: "Premium features" }, // Default text
});

const ElitePackageSchema = new mongoose.Schema({
  title: { type: String, default: "Elite Package" },
  description: { type: String, default: "All features with priority support." },
  price: { type: Number, default: 5 },
  features: { type: [String], default: ["Priority support", "Full access"] },
  additionalBenefits: { type: [String], default: ["Extra content"] },
  img: { type: String, default: "package3.png" }, // Default image path
  text: { type: String, default: "Elite features" }, // Default text
});

const DiamondPackageSchema = new mongoose.Schema({
  title: { type: String, default: "Diamond Package" },
  description: {
    type: String,
    default: "All features with exclusive content and support.",
  },
  price: { type: Number, default: 10 },
  features: {
    type: [String],
    default: ["Exclusive support", "Exclusive content", "Full access"],
  },
  exclusiveContent: { type: [String], default: ["VIP content"] },
  img: { type: String, default: "package4.png" }, // Default image path
  text: { type: String, default: "Diamond features" }, // Default text
});

const CategorySchema = new mongoose.Schema({
  name: String,
  image: String,
  questions: [
    { type: mongoose.mongoose.Schema.Types.ObjectId, ref: "Question" },
  ],
  // Additional fields specific to Category
});

const QuestionSchema = new mongoose.Schema({
  points: String,
  question: String,
  answer: String,
  image: String,
  // Additional fields specific to Question
});

const MyGamesSchema = new mongoose.Schema({
  GameName: String,
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
  // Additional fields specific to GameName
});

const TeamSchema = new mongoose.Schema({
  name: String,
  score: { type: Number, default: 0 },
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
});

// Schema for Answer
const AnswerSchema = mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  answered: { type: Boolean, default: false },
  teamId:{ type: String },
});

// This may not Needed
const ScoreSchema = new mongoose.Schema({
  users: [{ type: mongoose.mongoose.Schema.Types.ObjectId, ref: "User" }],
  // Additional fields specific to Score
});

const PaymentInfoSchema = new mongoose.Schema({
  users: [{ type: mongoose.mongoose.Schema.Types.ObjectId, ref: "User" }],
  // Additional fields specific to PaymentInfo
});

// Create models for each schema
const User = mongoose.model("User", UserSchema);
const FreePackage = mongoose.model("FreePackage", FreePackageSchema);
const BasicPackage = mongoose.model("BasicPackage", BasicPackageSchema);
const PremiumPackage = mongoose.model("PremiumPackage", PremiumPackageSchema);
const ElitePackage = mongoose.model("ElitePackage", ElitePackageSchema);
const DiamondPackage = mongoose.model("DiamondPackage", DiamondPackageSchema);
const Category = mongoose.model("Category", CategorySchema);
const Question = mongoose.model("Question", QuestionSchema);
const CreateGame = mongoose.model("MyGame", MyGamesSchema);
const Team = mongoose.model("Team", TeamSchema);
const Answer = mongoose.model("Answer", AnswerSchema);
const Score = mongoose.model("Score", ScoreSchema);
const PaymentInfo = mongoose.model("PaymentInfo", PaymentInfoSchema);

// Export models
module.exports = {
  User,
  FreePackage,
  BasicPackage,
  PremiumPackage,
  ElitePackage,
  DiamondPackage,
  Category,
  Question,
  CreateGame,
  Team,
  Score,
  PaymentInfo,
  Question,
  Category,
  Answer,
};
