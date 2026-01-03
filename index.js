const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/attendance", require("./routes/attendance"));
app.use("/api/leave", require("./routes/leave"));
app.use("/api/users", require("./routes/user"));


app.listen(process.env.PORT, () =>
  console.log("Server running on port " + process.env.PORT)
);
