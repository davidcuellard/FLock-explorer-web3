const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;

app.use(cors());

const routes = require("./routes");

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Flock Explorer Backend");
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
