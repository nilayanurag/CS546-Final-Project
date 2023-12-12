import usersRouter from "../routes/userRoutes.js";
import reviewRouter from "../routes/reviewRoutes.js";

const constructorMethod = (app) => {
  app.use("/", usersRouter);
  app.use("/review/", reviewRouter);
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Route not found" });
  });
};

export default constructorMethod;

