const express = require("express");
const app = express();

app.set("view engine", "pug");
app.use("/static", express.static("public"));

const PORT = 5050;

app.get("/", (req, res) => {
  res.render("home");
});

app.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log(`server is running on port ${PORT}`);
});
