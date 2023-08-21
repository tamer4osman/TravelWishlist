const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { validationResult, body } = require("express-validator");

dotenv.config();
app.set("view engine", "ejs");
app.use(bodyParser.json());

const countryList = [
  {
    id: 1,
    name: "Bhutan",
    alpha2Code: "BT",
    alpha3Code: "BTN",
    visited: false,
  },
  {
    id: 2,
    name: "Canada",
    alpha2Code: "CA",
    alpha3Code: "CAN",
    visited: false,
  },
  {
    id: 3,
    name: "Australia",
    alpha2Code: "AU",
    alpha3Code: "AUS",
    visited: true,
  },
  {
    id: 4,
    name: "Japan",
    alpha2Code: "JP",
    alpha3Code: "JPN",
    visited: false,
  },
  {
    id: 5,
    name: "United Kingdom",
    alpha2Code: "GB",
    alpha3Code: "GBR",
    visited: true,
  },
];

const countryValidationRules = [
  body("name").isString().notEmpty(),
  body("alpha2Code").isString().isLength({ min: 2, max: 2 }),
  body("alpha3Code").isString().isLength({ min: 3, max: 3 }),
  body("visited").isBoolean(),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const port = process.env.PORT || 3000;


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
