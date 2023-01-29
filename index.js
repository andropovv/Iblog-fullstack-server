import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";

import mongoose from "mongoose";
import { loginValidation, registerValidation } from "./validations/auth.js";
import { postCreateValidation } from "./validations/postCreate.js";

import { handleValidationErrors, checkAuth } from "./utils/index.js";

import {
  CommentController,
  PostController,
  UserController,
} from "./controllers/index.js";
import { commentCreateValidation } from "./validations/commentCreate.js";
console.log(process.env);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Db ok"))
  .catch((err) => console.log("error:", err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync("uploads")) fs.mkdir("uploads");
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(cors());

//Auth

app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.get("/auth/me", checkAuth, UserController.getMe);

//Image upload

app.post("/upload", upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

//Posts

app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update
);

// Comments
app.post(
  "/posts/:id/createComment",
  checkAuth,
  commentCreateValidation,
  handleValidationErrors,
  CommentController.create
);
app.get("/posts/:id/comments", CommentController.getForPost);
app.delete("/posts/:id/:commentId", checkAuth, CommentController.remove);

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    console.log(err);
  }
  console.log("OK");
});
