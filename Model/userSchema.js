const mongoose = require("mongoose");
const validator = require("validator");
mongoose
  .connect(process.env.mongoDBStr)
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(`DB connection failed ${err}`));

const userData = new mongoose.Schema({
  email: {
    unique: true,
    type: String,
    validate(val) {
      if (!validator.isEmail(val)) throw new Error("emailWrongPattern");
    },
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cpassword: {
    type: String,
    required: true,
  },
});
// Question Schema
const questionSchema = new mongoose.Schema({
  answered: { type: Boolean, default: false },
  question: { type: String, required: true },
  points: { type: Number, required: true },
  answer: { type: String, required: true },
  image: { type: String }, // Optional, as not all questions might have images
});

// Category Schema
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
