import usersRouter from "../routes/userRoutes.js";

const constructorMethod = (app) => {
  app.use("/", usersRouter);
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Route not found" });
  });
};

export default constructorMethod;

