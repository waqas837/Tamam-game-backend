const { usersignup, questionSchem } = require("../Model/userSchema");
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(process.env.stripeSecretKey);
exports.signup = async (req, res) => {
  const data = req.body;
  // console.log(data);
  try {
    if (data.password === data.cpassword) {
      const dataCheck = new usersignup(data);
      await dataCheck.save();
      res.json({ email: dataCheck.email, userData: dataCheck });
    } else {
      res.json({ passerr: "passerr" });
    }
  } catch (error) {
    console.log(`error during signup ${error}`);
    console.log(error);
    res.json(error);
  }
};

//sign in data
exports.singin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const isExists = await usersignup.findOne({ email, password });
    // console.log(isExists);
    //respose
    if (isExists === null) {
      res.json({ err: "err" });
    }
    if (isExists !== null) {
      res.json({
        success: "success",
        user: isExists.email,
        fulldata: isExists,
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
