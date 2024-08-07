const mongoose = require("mongoose")
mongoose
  .connect("mongodb+srv://bughlani:bughlani@cluster0.9qki3lg.mongodb.net/tamam?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(`DB connection failed ${err}`));