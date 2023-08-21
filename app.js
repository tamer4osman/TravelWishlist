const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const routes = require("./routes/routes"); // Import the routes.js file
dotenv.config();

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use("/api", routes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
