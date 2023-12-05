import express from "express";
import {
  createUser,
  getUser,
  updateUser,
  getTags,
  getFollowers,
  getFollowing,
  updateLastTimeStamp,
  deleteUser,
  addFollowing,
  addFollower,
  addTags,
  addReview,
  deleteReview,
  addComment,
  deleteComment,
} from "../data/users.js";
import * as helper from "../helpers/validation.js";

const usersRouter = express.Router();

usersRouter
  .route("/register")
  .get(async (req, res) => {})
  .post(async (req, res) => {});

usersRouter
  .route("/login")
  .get(async (req, res) => {})
  .post(async (req, res) => {});

export default usersRouter;
