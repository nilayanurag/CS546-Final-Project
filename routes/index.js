import usersRouter from "../routes/userRoutes.js";
import reviewRouter from "../routes/reviewRoutes.js";
import commentRouter from "../routes/commentRoutes.js";
import businessRouter from "./businessRoutes.js";


const constructorMethod = (app) => {
  app.use("/", usersRouter);
  app.use("/", reviewRouter);
  app.use("/", commentRouter);
  app.use("/", businessRouter);
  app.use("*", (req, res) => {
    res.redirect("/home");
    //res.status(404).json({ error: "Route not found" });
  });
};

export default constructorMethod;

