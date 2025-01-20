import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import "dotenv/config";
import "./database.js";
import { User } from "./models/index.js";

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json()); // ye body ko JSON mein convert karta hai
app.use(
  cors({
    origin: ["http://localhost:5173", "https://frontend-todo-list.surge.sh"],
  })
);

// ye api signup ko call karti hai
app.post("/api/v1/signup", async (request, response) => {
  if (!request.body.name || !request.body.email || !request.body.password) {
    response.status(400).send({ message: "Parameters Missing Hein" });
    return;
  }

  const user = await User.findOne({ email: request.body.email });

  if (user) {
    response
      .status(400)
      .send({ message: "Email phele se data mein aa chuki hai" });
    return;
  }

  const encryptedPassword = await bcrypt.hash(request.body.password, 10);

  const result = await User.create({
    name: request.body.name,
    email: request.body.email,
    password: request.body.password,
  });

  response.send({ message: "Signup Successfully ho raha hai", data: result });
});

// ye api login ki hai
app.post("/api/v1/login", async (request, response) => {
  // const object = {
  //   email: request.body.email,
  //   password: request.body.password,
  // };

  const result = await User.findOne({ email: request.body.email });
  console.log("result:", result);

  if (!result) {
    response.status(404).send({ message: "User Not Found" });
    return;
  }

  const match = await bcrypt.compare(request.body.password, result.password);
  // if (result.password !== request.body.password) {
  if (!match) {
    response.status(400).send({ message: "password mein galti ki hai" });
    return;
  }
  response.send({ message: "login Successfully ho raha hai" });
});

app.use((request, response) => {
  response.status(404).send({ message: "No Route Found!" });
});

// Start server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
