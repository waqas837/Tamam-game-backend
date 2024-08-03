const express = require("express");
const router = express.Router();
const upload = require("../middleware/Imageupload");
const {
  singin,
  signup,
  makePayment,
  postQuestion,
  getAllQuestions,
} = require("../controller/userLogics");
// routes for user account
router.post("/admin/signup", signup);
router.post("/admin/signin", singin);
router.get("/admin/getAllQuestions", getAllQuestions);
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
