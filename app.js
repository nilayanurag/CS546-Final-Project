import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import session from "express-session";
const app = express();
import configRoutes from "./routes/index.js";
import exphbs from "express-handlebars";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import path from 'path';

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const staticDir = express.static(__dirname + "/public");

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }
  next();
};

app.use("/public", staticDir);
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(
    session({
      name: "AuthState",
      secret: "some secret string!",
      resave: false,
      saveUninitialized: false,
    })
  );


  app.use("/login", async (req, res, next) => {
    if (req.session.user) {
        return res.redirect("/home");
    } else {
      next();
    }
  });

  app.use("/register", async (req, res, next) => {
    if (req.session.user) {
        return res.redirect("/home"); 
    } else {
      next();
    }
  });

  app.use("/logout", async (req, res, next) => {
    if (!req.session.user) {
      return res.redirect("/login");
    } else {
      next();
    }
  });

  app.use("/review/createReview", async (req, res, next) => {
    if (!req.session.user) {
      return res.redirect("/login");
    } else {
      next();
    }
  });

  app.use("/review/getMyReview", async (req, res, next) => {
    if (!req.session.user) {
      return res.redirect("/login");
    } else {
      next();
    }
  });

  app.use("/updateUser/", async (req, res, next) => {
    if (!req.session.user) {
      return res.redirect("/login");
    } else {
      next();
    }
  });

  app.use("/review/getReview/:id", async (req, res, next) => {
    if (!req.session.user) {
      return res.redirect("/login");
    } else {
      next();
    }
  });

  app.use("/business/createBusiness", async (req, res, next) => {
    if (!req.session.user) {
      return res.redirect("/login");
    } else {
      next();
    }
  });

  app.use("/review/updateReview/:id", async (req, res, next) => {
    if (!req.session.user) {
      return res.redirect("/login");
    } else {
      next();
    }
  });
  
configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
