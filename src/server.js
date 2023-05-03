const express = require("express");
const app = express();
const router = express.Router();
const mongoose = require("mongoose");
const { createClient } = require("redis");
require("dotenv").config();

const DB_USER = "root";
const DB_PASSWORD = "example";
const DB_HOST = "mongo";
const URI = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:27017`;

const REDIS_HOST = "redis";
const REDIS_PORT = 6379;

const redisClient = createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.on("connect", () => console.log("Redis Client connect"));

redisClient.connect();

async function main() {
  await mongoose
    .connect(URI)
    .then(() => console.log("connected to db"))
    .catch((err) => console.log(err));
}

main();

mongoose.model("User", { name: String });
const User = mongoose.model("User");

router.get("/test", async (req, res) => {
  redisClient.set("test", "ana gy mn redis test url");
  res.status(200).json({ message: "Hello ccc" });
});
router.get("/redis", async (req, res) => {
  const test = await redisClient.get("test");
  res.status(200).json({ message: "Hello ccc", test });
});

router.get("/add", async (req, res) => {
  const user = new User({ name: "John" });
  await user.save();
  res.status(200).json({ user });
});
router.get("/get", async (req, res) => {
  const users = await User.find();
  res.status(200).json({ users });
});

app.use("/api", router);

app.use("*", (req, res) => {
  res.status(200).json({ message: "helllooo" });
});

const port = 3005;

app.listen(port, () => {
  console.log(`server listening on http://localhost:${port}`);
});
