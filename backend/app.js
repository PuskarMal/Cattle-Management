const express = require("express");
const cors = require("cors");
const app = express();
const {initGridFS} = require("./config/gridfs.js");
require("dotenv").config();
require("./db.js");
app.set("view engine", "ejs");

const allowedOrigins = [
  "http://localhost:5173"
];
initGridFS()
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

const predictRoute = require("./routes/predict.js");
const registerCattleRoute = require("./routes/registercattle.js");
const report = require("./routes/report.js")
const biometric = require("./routes/biometric.js")
const user = require("./routes/user.js");

app.use("/", user);

app.use("/", registerCattleRoute);

app.use("/predict", predictRoute);
app.use("/",report);
app.use("/",biometric)

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port http://localhost:${process.env.PORT || 3000}`);
});