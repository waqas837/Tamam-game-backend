const {
  User,
  FreePackage,
  PremiumPackage,
  ElitePackage,
  DiamondPackage,
  BasicPackage,
  Category,
  Question,
  CreateGame,
  Team,
  Answer,
  Admin,
} = require("../Model/userSchema");
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(process.env.stripeSecretKey);
const jwt = require("jsonwebtoken"); // For creating tokens

exports.signup = async (req, res) => {
  const { username, email, password, phone } = req.body;

  try {
    // Check if email or phone number already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or phone number already in use" });
    }

    // Create new user
    const newUser = new User({
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
    const isExists = await User.findOne({
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
//sign in data
exports.adminsingin = async (req, res) => {
  try {
    const isExists = await Admin.findOne({
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
        message: "Your record not exits",
        user: isExists,
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

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges.create(
        {
          // original account will be charged here,it recieves from the front end amount object value,for more details visit it ts file to for its object formulation
          // stripe always uses lowest currency of your country
          amount: totalPrice < 50 ? 50 : totalPrice,
          currency: "USD",
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
    let categoryDoc = await Category.findOne({ name: category });

    if (!categoryDoc) {
      // If the category does not exist, create a new one
      categoryDoc = new Category({
        name: category,
        image: categoryImage,
        questions: [], // Initialize with an empty array
      });
    } else {
      // If the category exists, update its image
      categoryDoc.image = categoryImage;
      // Note: We're not clearing existing questions
    }

    const savePromises = questions.map((q, index) => {
      const questionImage = questionFiles[index].filename;

      // Create and save the Question instance
      return new Question({
        points: q.points,
        question: q.question,
        answer: q.answer,
        image: questionImage,
        category: categoryDoc._id,
      }).save();
    });

    // Execute all save promises concurrently
    const savedQuestions = await Promise.all(savePromises);

    // Add the new question IDs to the category's existing questions
    categoryDoc.questions = [
      ...categoryDoc.questions,
      ...savedQuestions.map((q) => q._id),
    ];

    // Save the category document with the updated questions array
    const savedCategory = await categoryDoc.save();

    if (savedCategory) {
      res.json({
        success: true,
        message: "Category updated and new questions added successfully",
        category: savedCategory,
        newQuestions: savedQuestions,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to update category and add questions",
      });
    }
  } catch (error) {
    console.error("Error in postQuestion:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getAllQuestions = async (req, res) => {
  try {
    let questions = await Category.find().populate("questions");
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

exports.getAllUsers = async (req, res) => {
  try {
    let users = await User.find();
    if (users) {
      res.json({ success: true, message: "users got", data: users });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    res.json({ success: false });
    console.log("error in getAllusers", error);
  }
};

// This function is only getting the data for current game.
exports.getAllQuestionsForUser = async (req, res) => {
  try {
    let { _id } = req.body.userData;
    // Fetch game details for the user
    let GameDetails = await User.findById(_id).populate("myHostGames");
    if (!GameDetails || !GameDetails.myHostGames.length) {
      return res.json({ success: false, message: "No games found for user." });
    }

    if (req.body.fetchAllGames) {
      // Get All games
      let myGames = GameDetails.myHostGames;
      let GameData = await CreateGame.find({
        _id: { $in: myGames.map((val) => val._id) },
      })
        .populate({ path: "categories", model: "Category" })
        .populate({ path: "teams", model: "Team" });
      if (!GameData) {
        return res.json({ success: false, message: "Game data not found." });
      } else {
        res.json({ success: true, YourGames: GameData });
      }
    } else {
      // get only created Game
      let myGames = GameDetails.myHostGames.find((val) =>
        val._id.equals(req.body.gameId)
      );
      let GameData = await CreateGame.findById(myGames._id)
        .populate("categories")
        .populate("teams");
      // Extract teams and question data
      let teams = GameData.teams.map((team) => team);
      let categoriesWithQuestions = await Promise.all(
        GameData.categories.map(async (val) => {
          let categories_itself = val;
          // Fetch the questions data for the current category
          // console.log("teams[0]._id,",teams[0]._id)
          const answers = await Answer.find({
            teamId: teams[0]._id,
            question: { $in: categories_itself.questions.map((q) => q._id) },
          }).populate("question");
          // Populate 'question' field
          // Extract the answer data, including 'answered' field
          // console.log("is need thing is missed??",answers.map((val)=>val.question._id.toString()))
          let questionData = answers.map((answer) => ({
            _id: answer.question._id,
            points: answer.question.points,
            question: answer.question.text,
            image: answer.question.image,
            answered: answer.answered, // Directly include the 'answered' field from the 'Answer' document
          }));

          return {
            _id: categories_itself._id.toString(),
            name: categories_itself.name,
            image: categories_itself.image,
            questions: questionData,
          };
        })
      );

      let questionIDs = GameData.categories.flatMap(
        (category) => category.questions
      );
      // Fetch answers related to the question IDs
      let answerData = await Answer.find({
        question: { $in: questionIDs },
      }).populate("question");

      let LongInfo = {
        GameDetails,
        teams,
        myGames,
        answerData,
        categoriesWithQuestions,
      };
      if (!GameData) {
        return res.json({ success: false, message: "Game data not found." });
      }
      res.json({ success: true, LongInfo });
    }
  } catch (error) {
    console.error("Error in getAllQuestionsForUser:", error);
    res.json({ success: false, message: "Error in fetching questions" });
  }
};

// Create a Game
exports.createGame = async (req, res) => {
  try {
    let { userId, categoriesIds, gameName, team1, team2 } = req.body;

    // First, find data of this user
    let findUserData = await User.findOne({ _id: userId });
    if (!findUserData) {
      console.log(`User not found for userId: ${userId}`);
      return res.json({ success: false, message: "User not found" });
    }

    // create Game for every package
    const createYourGame = async (NoOfGames, package) => {
      try {
        if (package === "free") {
          // 1. First find categoreis
          const results = await Category.find({
            _id: { $in: categoriesIds },
          });

          // 1. Create New Teams
          let team1Data = await new Team({ name: team1 }).save();
          let team2Data = await new Team({ name: team2 }).save();

          // 2. Collect all category IDs
          const allCategoryIds = results.map((category) => category._id);

          // 3. Create a new Game with all categories and teams
          let createdGame = await new CreateGame({
            GameName: gameName,
            categories: allCategoryIds,
            teams: [team1Data._id, team2Data._id],
          }).save();

          // 4. Update User's myHostGames array with the new game ID
          await User.findByIdAndUpdate(
            { _id: userId },
            { $push: { myHostGames: createdGame._id } },
            { new: true }
          );

          // 5. Create Answer documents for each question in each category
          await Promise.all(
            results.map(async (category) => {
              await Promise.all(
                category.questions.map(async (questionId) => {
                  console.log({
                    question: questionId,
                    teamId: team1Data._id,
                  });
                  await new Answer({
                    question: questionId,
                    teamId: team1Data._id,
                  }).save();
                })
              );
            })
          );
          return createdGame._id;
          // console.log("createGame", createGame)
        } else if (package === "basic") {
          // we will create no. of games.
          let createGame = await User.findByIdAndUpdate(
            { _id: userId },
            {
              myGames: GamesData,
            },
            { new: true }
          );
        }
      } catch (error) {
        console.log("error in createGame", error);
      }
    };
    console.log(
      "findUserData. currentPackage ",
      findUserData.currentPackage.includes("free")
    );
    //  we will first check if user has the free package used,
    if (findUserData.currentPackage.includes("free")) {
      if (findUserData.myHostGames.length < 1) {
        // Now you can create a game
        let gameid = await createYourGame(1, "free"); // we can get  any time.
        res.json({
          success: true,
          message: "Game was created successfully.",
          gameid,
        });
      } else if (findUserData.myHostGames.length === 1) {
        console.log("LimitReached for Free Package");
        res.json({ success: false, message: "Limit Reached For Free Package" });
      }
    } else if (findUserData.currentPackage.includes("basic")) {
      if (findUserData.myHostGames.length < 2) {
        // Now you can create a game
        createYourGame(2, "basic");
      } else if (findUserData.myHostGames.length === 2) {
        console.log("LimitReached for Basic Package");
        res.json({ message: "LimitReachedBasicPackage" });
      }
    } else if (findUserData.currentPackage.includes("premium")) {
      if (findUserData.myHostGames.length < 3) {
        // Now you can create a game
        createYourGame(3, "premium");
      } else if (findUserData.myHostGames.length === 3) {
        console.log("LimitReached for Premium Package");
        res.json({ message: "LimitReachedPremiumPackage" });
      }
    } else if (findUserData.currentPackage.includes("elite")) {
      if (findUserData.myHostGames.length < 5) {
        // Now you can create a game
        createYourGame(5, "elite");
      } else if (findUserData.myHostGames.length === 5) {
        console.log("LimitReached for Elite Package");
        res.json({ message: "LimitReachedElitePackage" });
      }
    } else if (findUserData.currentPackage.includes("diamond")) {
      if (findUserData.myHostGames.length < 11) {
        // Now you can create a game
        createYourGame(11, "diamond");
      } else if (findUserData.myHostGames.length === 11) {
        console.log("LimitReached for dimond Package");
        res.json({ message: "LimitReachedDiamondPackage" });
      }
    }
  } catch (error) {
    console.log("Error in createGame", error);
    res.json({ success: false, message: "Error in creating game" });
  }
};

exports.singleCorrectAnswer = async (req, res) => {
  // console.log("rq.boyd", req.body);

  let {
    userid,
    gameName,
    categoryId,
    questionId,
    answer,
    categories,
    package,
    correctTeam,
    pointsGot,
    teamid,
  } = req.body;

  try {
    // console.log({
    //   userid,
    //   categoryId,
    //   questionId,
    //   pointsGot,
    //   correctTeam,
    //   teamid,
    // });
    await Answer.findOneAndUpdate(
      { question: questionId, teamId: teamid },
      { $set: { answered: true } },
      { new: true }
    );

    await Team.findOneAndUpdate(
      { _id: teamid },
      { $inc: { score: pointsGot } },
      { new: true }
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Error updating document:", error);
  }
};

// it will restart the game again.
exports.startovergame = async (req, res) => {
  try {
    let { userid, gameid } = req.params;
    console.log("userid, gameid", userid, gameid);
    // First, find data of this user
    let findUserData = await User.findOne({ _id: userid });

    if (!findUserData) {
      console.log(`User not found for userid: ${userid}`);
      return res.json({ success: false, message: "User not found" });
    }
    // console.log("findUserData", findUserData);
    // We will first find our data for put.
  } catch (error) {
    console.log("Error in createGame", error);
    res.json({ success: false, message: "Error in creating game" });
  }
};

// Fetch all pacakges
exports.fetchAllPackages = async (req, res) => {
  try {
    // Fetch all predefined packages
    const [
      freePackages,
      basicPackage,
      premiumPackages,
      elitePackages,
      diamondPackages,
    ] = await Promise.all([
      FreePackage.find(), // Limit to 1 if you only have one predefined free package
      BasicPackage.find(), // Limit to 1 if you only have one predefined premium package
      PremiumPackage.find(), // Limit to 1 if you only have one predefined premium package
      ElitePackage.find(), // Limit to 1 if you only have one predefined elite package
      DiamondPackage.find(), // Limit to 1 if you only have one predefined diamond package
    ]);
    // Combine all packages into one array
    const allPackages = [
      ...basicPackage.map((pkg) => ({ ...pkg.toObject(), type: "Basic" })),
      ...premiumPackages.map((pkg) => ({ ...pkg.toObject(), type: "Premium" })),
      ...elitePackages.map((pkg) => ({ ...pkg.toObject(), type: "Elite" })),
      ...diamondPackages.map((pkg) => ({ ...pkg.toObject(), type: "Diamond" })),
    ];
    res.json({ success: true, data: allPackages });
  } catch (error) {
    console.log("err", error);
  }
};
// buypackage
exports.buypackage = async (req, res) => {
  let { loggedInUser, PackagesId, PackageName } = req.params;
  try {
    console.log({ loggedInUser, PackagesId, PackageName });
    let newData = await User.findByIdAndUpdate(
      loggedInUser,
      {
        $addToSet: { currentPackage: ["free", PackageName] },
      },
      { new: true }
    );
    res.json({ success: true, data: newData });
  } catch (error) {
    console.log("err", error);
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.body.questionId);
    res.json({ success: true });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.body.categoryId);
    res.json({ success: true });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.body.userId);
    res.json({ success: true });
  } catch (error) {
    console.log(error);
  }
};
/////////////////////// Seed Packages /////////////////

const packagesData = [
  {
    name: "basic",
    img: "card1.png",
    text: "Basic features",
    price: 1,
    features: ["Basic support", "Basic access"],
  },
  {
    name: "premium",
    img: "card2.png",
    text: "Premium features",
    price: 3,
    features: ["Premium support", "Extended access"],
  },
  {
    name: "elite",
    img: "card3.png",
    text: "Elite features",
    price: 5,
    features: ["Priority support", "Full access"],
    additionalBenefits: ["Extra content"],
  },
  {
    name: "diamond",
    img: "card4.png",
    text: "Diamond features",
    price: 10,
    features: ["Exclusive support", "Exclusive content", "Full access"],
    exclusiveContent: ["VIP content"],
  },
];

async function seedDatabase() {
  try {
    // Seed Free Package
    const freeCount = await FreePackage.countDocuments();
    if (freeCount === 0) {
      await FreePackage.create(
        packagesData.find((pkg) => pkg.text === "Free features")
      );
    }

    // Seed Basic Package
    const basicCount = await BasicPackage.countDocuments();
    if (basicCount === 0) {
      await BasicPackage.create(
        packagesData.find((pkg) => pkg.text === "Basic features")
      );
    }

    // Seed Premium Package
    const premiumCount = await PremiumPackage.countDocuments();
    if (premiumCount === 0) {
      await PremiumPackage.create(
        packagesData.find((pkg) => pkg.text === "Premium features")
      );
    }

    // Seed Elite Package
    const eliteCount = await ElitePackage.countDocuments();
    if (eliteCount === 0) {
      await ElitePackage.create(
        packagesData.find((pkg) => pkg.text === "Elite features")
      );
    }

    // Seed Diamond Package
    const diamondCount = await DiamondPackage.countDocuments();
    if (diamondCount === 0) {
      await DiamondPackage.create(
        packagesData.find((pkg) => pkg.text === "Diamond features")
      );
    }

    console.log("Default packages seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seedDatabase();
