const { validationResult, body } = require("express-validator");
const fs = require("fs"); // Import the "fs" module
const countryData = require("../data/countryData.json"); // Load country data from JSON file

const countryValidationRules = [
  body("name")
    .isString()
    .notEmpty()
    .withMessage("Country name is required and must be a string."),
  body("alpha2Code")
    .isString()
    .isLength({ min: 2, max: 2 })
    .withMessage("Alpha 2 code must be a string of length 2."),
  body("alpha3Code")
    .isString()
    .isLength({ min: 3, max: 3 })
    .withMessage("Alpha 3 code must be a string of length 3."),
  body("visited")
    .isBoolean()
    .withMessage("Visited status must be a boolean value."),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

function updateCountryDataFile() {
  fs.writeFileSync("./countryData.json", JSON.stringify(countryData, null, 2));
}

const getCountries = (req, res) => {
  let sortedCountries = countryData.slice(); // Use countryData instead of countryList
  const sortParam = req.query.sort;

  if (sortParam && sortParam.toLowerCase() === "true") {
    sortedCountries = sortedCountries.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  res.json(sortedCountries);
};

const getCountryByCode = (req, res) => {
  const code = req.params.code.toUpperCase();
  const country = countryData.find(
    (country) => country.alpha2Code === code || country.alpha3Code === code
  );

  if (!country) {
    return res.status(404).json({ message: "Country not found." });
  }

  res.json(country);
};

const createCountry = (req, res) => {
  const { name, alpha2Code, alpha3Code, visited } = req.body;

  const existingCountry = countryData.find(
    (country) =>
      country.alpha2Code === alpha2Code || country.alpha3Code === alpha3Code
  );

  if (existingCountry) {
    return res
      .status(409)
      .json({ message: "Country already exists in the list." });
  }

  const newCountry = {
    id: countryData.length + 1,
    name: name,
    alpha2Code: alpha2Code,
    alpha3Code: alpha3Code,
    visited: visited || false,
  };

  countryData.push(newCountry); // Push to countryData instead of modifying countryList
  updateCountryDataFile(); // Update the JSON file
  res.status(201).json(newCountry);
};

const updateCountryByCode = (req, res) => {
  const code = req.params.code.toUpperCase();

  const countryIndex = countryData.findIndex(
    (country) => country.alpha2Code === code || country.alpha3Code === code
  );

  if (countryIndex === -1) {
    return res.status(404).json({ message: "Country not found." });
  }

  countryData[countryIndex] = {
    ...countryData[countryIndex],
    ...req.body,
  };

  updateCountryDataFile(); // Update the JSON file
  res.json(countryData[countryIndex]);
};

const updateCountryVisitedStatus = (req, res) => {
  const code = req.params.code.toUpperCase();

  const countryIndex = countryData.findIndex(
    (country) => country.alpha2Code === code || country.alpha3Code === code
  );

  if (countryIndex === -1) {
    return res.status(404).json({ message: "Country not found." });
  }

  countryData[countryIndex].visited = true;
  
  updateCountryDataFile(); // Update the JSON file
  res.json(countryData[countryIndex]);
};

const displayWishlist = (req, res) => {
  res.render("wishlist", { countries: countryData });
};

const addCountry = (req, res) => {
  const { name, visited } = req.body;
  const newCountry = {
    id: countryData.length + 1,
    name: name,
    alpha2Code: "", // Add appropriate code generation logic
    alpha3Code: "", // Add appropriate code generation logic
    visited: !!visited,
  };
  countryData.push(newCountry);
  updateCountryDataFile();
  res.redirect("/wishlist");
};

module.exports = {
  countryValidationRules,
  handleValidationErrors,
  getCountries,
  getCountryByCode,
  createCountry,
  updateCountryByCode,
  updateCountryVisitedStatus,
  displayWishlist,
  addCountry,
};
