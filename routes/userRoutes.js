import express from "express";
import * as userData from "../data/users.js";
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
