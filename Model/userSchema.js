const mongoose = require("mongoose");
const validator = require("validator");
mongoose
  .connect(
    process.env.mongoDBStr
  )
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
//admin
const admin = new mongoose.Schema({
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

// Product schema
const productSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  qty: {
    type: String,
    default: 0,
  },
  selectedFile: String,
  price: {
    type: String,
  },
  description: {
    type: String,
  },
  view: {
    type: String,
  },
});
// Product schema
const product = new mongoose.Schema({
  title: {
    type: String,
  },
  qty: {
    type: String,
    default: 0,
  },
  selectedFile: String,
  price: {
    type: String,
  },
  description: {
    type: String,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
  view: {
    type: String,
  },
});

// addtocart schema
const addtocart = new mongoose.Schema({
  email: {
    type: String,
  },
  products: [product],
});
// Services schema
const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
  },

  price: {
    type: String,
    defalut: 0,
  },
  description: {
    type: String,
  },
});

const orders = new mongoose.Schema({
  totalprice: {
    type: String,
  },
  useremail: {
    type: String,
  },
});
// price calculator
const priceCalc = new mongoose.Schema({
  CementPrice: {
    type: Number,
    required: true,
    unique: true,
  },
  OneMarlaPrice: {
    type: Number,
    required: true,
    unique: true,
  },
  SandPrice: {
    type: Number,
    required: true,
    unique: true,
  },
  SmallStonesPrice: {
    type: Number,
    required: true,
    unique: true,
  },
  qtyForCement: {
    type: Number,
    required: true,
    unique: true,
  },
  qtyForSand: {
    type: Number,
    required: true,
  },
  qtyForSmallStones: {
    type: Number,
    required: true,
    unique: true,
  },
});

// user slip
const slipSch = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    // unique:true
  },
  price: {
    type: String,
    // unique:true
  },
  totalPrice: {
    type: String,
    // unique:true
  },
  oneProduct: {
    type: String,
    // unique:true
  },
  image: {
    type: String,
    // unique:true
  },
  pimage: {
    type: String,
  },
});
// images crud
const images = new mongoose.Schema({
  image: {
    type: String,
  },
});
const usersignup = new mongoose.model("usersignup", userData);
const Product = new mongoose.model("productData", productSchema);
const AdminData = new mongoose.model("adminData", admin);
const ServiceData = new mongoose.model("serviceData", serviceSchema);
const cartadd = new mongoose.model("addtocartitems", addtocart);
const custmOrders = new mongoose.model("customerorders", orders);
const priceCalculator = new mongoose.model("priceCalcultr", priceCalc);
const slip = new mongoose.model("userslip", slipSch);
const ImgModel = new mongoose.model("imgupload", images);

module.exports = {
  usersignup,
  Product,
  AdminData,
  ServiceData,
  cartadd,
  custmOrders,
  priceCalculator,
  slip,
  ImgModel,
};
