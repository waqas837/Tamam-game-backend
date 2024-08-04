const { usersignup, questionSchem } = require("../Model/userSchema");
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(process.env.stripeSecretKey);
const jwt = require("jsonwebtoken"); // For creating tokens

exports.signup = async (req, res) => {
  const { username, email, password, phone } = req.body;

  try {
    // Check if email or phone number already exists
    const existingUser = await usersignup.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or phone number already in use" });
    }

    // Create new user
    const newUser = new usersignup({
      username,
      email,
      password, // Store password as plain text
      phone,
    });

    await newUser.save();

    // Generate a token and send it in response
    const token = jwt.sign({ userId: newUser._id }, "your_jwt_secret", {
      expiresIn: "1h",
    });

    res
      .status(201)
      .json({ message: "User created successfully", token, user: newUser });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//sign in data
exports.singin = async (req, res) => {
  try {
    const isExists = await usersignup.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    if (isExists) {
      // Generate a token and send it in response
      const token = jwt.sign({ userId: isExists._id }, "your_jwt_secret", {
        expiresIn: "1h",
      });
      res.json({
        success: true,
        token,
        user: isExists,
      });
    } else {
      res.json({
        success: false,
      });
    }
  } catch (error) {
    console.log(`error during sigin the data ${error}`);
    console.log(error);
    // res.json({err:error});
  }
};

//make payment
exports.makePayment = (req, res) => {
  const { totalPrice, token } = req.body;
  // console.log(totalPrice,token)
  const idempotencyKey = uuidv4(); //so that user don't be doubled charged from the same product
  //just in the reallity //we create stripe.customer.create({email,source:tokenid}).then((customer)=>) stripe.create a stripe.charges.create({amount:product.price*100,currency:"usd",customer:customer.id,receipt_email:token.email,description:product.name},{idempotencyKey on this transactoin}).then(result).catch(err)
  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges.create(
        {
          // original account will be charged here,it recieves from the front end amount object value,for more details visit it ts file to for its object formulation
          amount: totalPrice * 100,
          currency: "pkr",
          customer: customer.id,

          //we can send email after a successfull transanction
          //it is now optional just sake of fun
          receipt_email: token.email,
          // description: `Your product name: ${product.name}`,
          //shipping can contain about the user's card
          shipping: {
            name: token.card.name,
            address: {
              line1: token.card.address_country,
              country: token.card.address_country,
            },
          },
        },
        { idempotencyKey }
      );
    })
    .then((result) => {
      //this result must contain a succedd payment data
      res.status(200).json(result);
    })
    .catch((err) => console.log(`error during the payment ${err}`));
};

exports.postQuestion = async (req, res) => {
  try {
    const { category } = req.body;
    const questions = JSON.parse(req.body.questions);

    // Handle file uploads
    const categoryImage = req.files.categoryImage[0].filename;
    const questionFiles = req.files.questionFiles;

    // Find the category by name or create it if it doesn't exist
    let categoryDoc = await questionSchem.findOne({ name: category });

    if (!categoryDoc) {
      // If the category does not exist, create a new one
      categoryDoc = new questionSchem({
        name: category,
        image: categoryImage,
        questions: [],
      });
    } else {
      // If the category exists, update its image
      categoryDoc.image = categoryImage;
    }

    // Process each question
    questions.forEach((q, index) => {
      const questionImage = questionFiles[index]
        ? questionFiles[index].filename
        : null;

      categoryDoc.questions.push({
        points: q.points,
        question: q.question,
        answer: q.answer,
        image: questionImage,
        answered: false, // Default value
      });
    });

    // Save the category document
    const savedCategory = await categoryDoc.save();

    if (savedCategory) {
      res.json({
        success: true,
        message: "Category and questions added successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to add category and questions",
      });
    }
  } catch (error) {
    console.error("Error in postQuestion:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getAllQuestions = async (req, res) => {
  try {
    let questions = await questionSchem.find();
    if (questions) {
      res.json({ success: true, message: "questions got", data: questions });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    res.json({ success: false });
    console.log("error in getAllQuestions", error);
  }
};

// This function is only getting the data for current game.
exports.getAllQuestionsForUser = async (req, res) => {
  try {
    let { categoriesIds } = req.body.metaData;
    let { _id } = req.body.userData;
    // Assuming 'myGames' has references to categories or questions
    let user = await usersignup.findById(_id);
    // Filter myGames to only include the categories in categoriesIds
    user.myGames = user.myGames.filter((gameId) =>
      categoriesIds.includes(gameId.toString())
    );
    let result = await usersignup.populate(user, { path: "myGames" });
    if (result) {
      res.json({
        success: true,
        message: "Questions fetched successfully",
        data: result.myGames,
      });
    } else {
      res.json({ success: false, message: "No questions found" });
    }
  } catch (error) {
    res.json({ success: false, message: "Error in fetching questions" });
    console.log("Error in getAllQuestionsForUser:", error);
  }
};

// Create a Game
exports.createGame = async (req, res) => {
  try {
    let { userId, categoriesIds, gameName, team1, team2 } = req.body;
    // console.log("req.body;", req.body);

    // First, find data of this user
    let findUserData = await usersignup.findOne({ _id: userId });

    if (!findUserData) {
      console.log(`User not found for userId: ${userId}`);
      return res.json({ success: false, message: "User not found" });
    }
    // We will first find our data for put.
    // 1. First find categoreis
    const results = await questionSchem.find({
      _id: { $in: categoriesIds },
    });
    // console.log("results", results);
    let GamesData = [
      {
        // Allowed to create 1 Game only
        FreePackage: [
          {
            // Only one game is allowed if user has basic package
            [gameName]: {
              allQuestions: results.map((val) => val),
              Teams: [
                {
                  teamName: team1,
                  score: 0,
                  Questions: [],
                },
                {
                  teamName: team2,
                  score: 0,
                  Questions: [],
                },
                // Additional teams can be added here
              ],
            },
          },
        ],
      },
    ];

    // create Game for every package
    const createYourGame = async (noOfGames, package) => {
      try {
        if (package === "free") {
          // we will create no. of games.
          let createGame = await usersignup.findByIdAndUpdate(
            { _id: userId },
            {
              myGames: GamesData,
            },
            {new:true}
          );
          // console.log("createGame", createGame)
        }
      } catch (error) {
        console.log("error in createGame", error);
      }
    };
    //  we will first check if user has the free package used,
    if (findUserData.currentPackage === "free") {
      console.log(
        "findUserData.myGames.FreePackage",
        findUserData.myGames.FreePackage.length
      );
      if (findUserData.myGames.FreePackage.length === 0) {
        // Now you can create a game
        await createYourGame(1, "free"); // we can get  any time.
        res.json({ success: true, message: "Game was created successfully." });
      } else if (findUserData.myGames.FreePackage.length === 1) {
        console.log("LimitReached for Free Package");
        res.json({success: false , message: "Limit Reached For Free Package" });
      }
    } else if (findUserData.currentPackage === "basic") {
      if (findUserData.myGames.BasicPackage.length < 1) {
        // Now you can create a game
        createYourGame(1, "basic");
      } else if (findUserData.myGames.BasicPackage.length === 1) {
        console.log("LimitReached for Basic Package");
        res.json({ message: "LimitReachedBasicPackage" });
      }
    } else if (findUserData.currentPackage === "premium") {
      if (findUserData.myGames.PremiumPackage.length < 2) {
        // Now you can create a game
        createYourGame(2, "premium");
      } else if (findUserData.myGames.PremiumPackage.length === 2) {
        console.log("LimitReached for Premium Package");
        res.json({ message: "LimitReachedPremiumPackage" });
      }
    } else if (findUserData.currentPackage === "elite") {
      if (findUserData.myGames.ElitePackage.length < 5) {
        // Now you can create a game
        createYourGame(5, "elite");
      } else if (findUserData.myGames.ElitePackage.length === 5) {
        console.log("LimitReached for Elite Package");
        res.json({ message: "LimitReachedElitePackage" });
      }
    } else if (findUserData.currentPackage === "diamond") {
      if (findUserData.myGames.DiamondPackage.length < 10) {
        // Now you can create a game
        createYourGame(10, "diamond");
      } else if (findUserData.myGames.DiamondPackage.length === 10) {
        console.log("LimitReached for dimond Package");
        res.json({ message: "LimitReachedDiamondPackage" });
      }
    }
  } catch (error) {
    console.log("Error in createGame", error);
    res.json({ success: false, message: "Error in creating game" });
  }
};
