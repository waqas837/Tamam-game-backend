const express = require("express");
const router = express.Router();
const upload = require("../middleware/Imageupload");
const { singin, signup, makePayment } = require("../controller/userLogics");
// routes for user account
router.post("/signup", signup);
router.post("/signin", singin);
// payment method
router.post("/payment", makePayment);
module.exports = router;
