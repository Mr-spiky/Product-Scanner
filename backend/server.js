const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { initFirebase } = require("./config/firebase");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Product Scanner Full Backend is running");
});

app.use("/api/products", require("./routes/products"));

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  initFirebase();

  app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
  });
})();
