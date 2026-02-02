const express = require("express");
const cors = require("cors");
const app = express();

require("dotenv").config();
require("./config/db.js");
app.set("view engine", "ejs");

const allowedOrigins = [
  "http://localhost:5173"
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads'))

const predictRoute = require("./routes/predict.js");
const productRoutes = require('./routes/productRoutes');

app.use("/predict", predictRoute);
app.use('/api/products', productRoutes);

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port http://localhost:${process.env.PORT || 3000}`);
});