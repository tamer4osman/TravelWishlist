const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const routes = require("./routes/routes"); // Import the routes.js file
const path = require("path");
dotenv.config();

const port = process.env.PORT || 3000;

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.json());
app.use("/api", routes);



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
