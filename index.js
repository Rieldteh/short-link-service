const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mainRouter = require("./routers/main-router");

dotenv.config();

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cors());

app.use("/shorten", mainRouter);

app.listen(PORT, () => {
  console.log(`Server start on ${PORT}`);
});
