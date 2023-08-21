const express = require("express");
const { query, param } = require("express-validator");
const {
  handleValidationErrors,
  countryValidationRules,
  getCountries,
  getCountryByCode,
  createCountry,
  updateCountryByCode,
  updateCountryVisitedStatus,
} = require("../controllers/countriesController"); // Import controller functions and variables

const router = express.Router();

// Validation middlewares
const validateCountryCode = param("code")
  .isString()
  .isLength({ min: 2, max: 3 });
const validateCountryData = [...countryValidationRules, handleValidationErrors];

// Route definitions
router.get(
  "/countries",
  [
    query("sort").optional().isBoolean(),
    query("visited").optional().isBoolean(),
  ],
  handleValidationErrors,
  getCountries
);
router.get(
  "/countries/:code",
  validateCountryCode,
  handleValidationErrors,
  getCountryByCode
);
router.post("/countries", validateCountryData, createCountry);
router.put(
  "/countries/:code",
  [validateCountryCode, ...validateCountryData],
  updateCountryByCode
);
router.delete(
  "/countries/:code",
  validateCountryCode,
  handleValidationErrors,
  updateCountryVisitedStatus
);

module.exports = router;
