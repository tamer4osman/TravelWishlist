const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { validationResult, body } = require("express-validator");

dotenv.config();
app.set("view engine", "ejs");
app.use(bodyParser.json());



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
