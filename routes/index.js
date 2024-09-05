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
  getAllQuestionsForUser,
  singleCorrectAnswer,
  startovergame,
  fetchAllPackages,
  buypackage,
  adminsingin,
  deleteCategory,
  deleteQuestion,
  getAllUsers,
  deleteUser,
  useauxilarymean,
} = require("../controller/userLogics");
// routes for user account
router.post("/user/signup", signup);
router.post("/user/signin", singin);
router.post("/admin/signin", adminsingin);
router.post("/user/createGame", createGame);
router.get("/admin/getAllQuestions", getAllQuestions);
router.get("/admin/getAllUsers", getAllUsers);
router.post("/user/getAllQuestionsForUser", getAllQuestionsForUser);
router.post("/user/singleCorrectAnswer", singleCorrectAnswer);
router.post("/user/startovergame/:userid/:gameid", startovergame);
router.post("/user/payment", makePayment);
router.post(
  "/user/buypackage/:loggedInUser/:PackagesId/:PackageName",
  buypackage
);
router.post(
  "/admin/postQuestion",
  upload.fields([
    { name: "categoryImage", maxCount: 1 },
    { name: "questionFiles", maxCount: 6 },
  ]),
  postQuestion
);

// New Routes //
router.get("/user/fetchAllPackages", fetchAllPackages);
router.delete("/admin/deleteQuestion", deleteQuestion);
router.delete("/admin/deleteCategory", deleteCategory);
router.delete("/admin/deleteUser", deleteUser);
router.put("/user/use-auxiliary-mean", useauxilarymean);


module.exports = router;
