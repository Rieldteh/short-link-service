const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mainRouter = require("./routers/main-router");
const infoRouter = require("./routers/info-router");

dotenv.config();
const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cors());

app.use("/", mainRouter);
app.use("/info", infoRouter);

app.listen(PORT, () => {
  console.log(`Server start on ${PORT}`);
});
