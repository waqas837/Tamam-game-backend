const express = require("express");
const router = express.Router();
const upload = require("../middleware/Imageupload");
const {
  singin,
  signup,
  makePayment,
  postQuestion,
  getAllQuestions,
  createGame,
  getAllQuestionsForUser
} = require("../controller/userLogics");
// routes for user account
router.post("/user/signup", signup);
router.post("/user/signin", singin); 
router.post("/user/createGame", createGame); 
router.get("/admin/getAllQuestions", getAllQuestions);
router.post("/user/getAllQuestionsForUser", getAllQuestionsForUser);
router.post(
  "/admin/postQuestion",
  upload.fields([
    { name: "categoryImage", maxCount: 1 },
    { name: "questionFiles", maxCount: 6 },
  ]),
  postQuestion
);
// payment method
router.post("/payment", makePayment);
module.exports = router;
