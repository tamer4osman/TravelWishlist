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

app.get(
  " /api/countries",
  countryValidationRules,
  handleValidationErrors,
  (req, res) => {
    let sortedCountries = countryList.slice();
    const sortParam = req.query.sort;

    if (sortParam && sortParam.toLowerCase() === "true") {
      sortedCountries = sortedCountries.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    res.json(sortedCountries);
  }
);

app.get(
  " /api/countries/:code",
  countryValidationRules,
  handleValidationErrors,
  (req, res) => {
    const code = req.params.code.toUpperCase(); // Convert the code to uppercase
    console.log(code);
    // Find the country based on alpha2Code or alpha3Code
    const country = countryList.find(
      (country) => country.alpha2Code === code || country.alpha3Code === code
    );

    if (!country) {
      return res.status(404).json({ message: "Country not found." });
    }

    res.json(country);
  }
);

app.post(
  "/api/countries",
  countryValidationRules,
  handleValidationErrors,
  (req, res) => {
    const { name, alpha2Code, alpha3Code, visited } = req.body;

    // Check if the country already exists
    const existingCountry = countryList.find(
      (country) =>
        country.alpha2Code === alpha2Code || country.alpha3Code === alpha3Code
    );

    if (existingCountry) {
      return res
        .status(409)
        .json({ message: "Country already exists in the list." });
    }

    // Add the new country
    const newCountry = {
      id: countryList.length + 1,
      name: name,
      alpha2Code: alpha2Code,
      alpha3Code: alpha3Code,
      visited: visited || false,
    };

    countryList.push(newCountry);
    res.status(201).json(newCountry);
  }
);

app.put(
  "/api/countries/:code",
  countryValidationRules,
  handleValidationErrors,
  (req, res) => {
    const code = req.params.code.toUpperCase(); // Convert the code to uppercase

    // Find the index of the country based on alpha2Code or alpha3Code
    const countryIndex = countryList.findIndex(
      (country) => country.alpha2Code === code || country.alpha3Code === code
    );

    if (countryIndex === -1) {
      return res.status(404).json({ message: "Country not found." });
    }

    // Update the country data
    countryList[countryIndex] = {
      ...countryList[countryIndex], // Keep existing properties
      ...req.body, // Update with new properties
    };

    res.json(countryList[countryIndex]);
  }
);



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
