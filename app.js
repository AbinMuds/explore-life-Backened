const express = require("express");
const bodyParser = require("body-parser");

const placesRoutes = require("./routes/places-routes"); //this is our middleware
const usersRoutes = require("./routes/users-routes");

const app = express();

app.use("/api/places", placesRoutes); // => app/places/...
app.use("/api/users", usersRoutes);

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An Unknown Error Occured" });
});

app.listen(4000);
