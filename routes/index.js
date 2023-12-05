import usersRouter from "../routes/user_routes.js";

const constructorMethod = (app) => {
  app.use("/", usersRouter);
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Route not found" });
  });
};

export default constructorMethod;

