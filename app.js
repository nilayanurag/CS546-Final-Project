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
// app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Serve static files from the 'uploads' directory
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// Middleware to implement
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


  // app.get('/', (req, res) => {
  //   let user;
  //   if (req.session.user) {
  //   user= req.session.user
  //   }else{
  //   user={}
  //   user.firstName="Guest"
  //   }
  //   const data = {
  //     user: user,
  //     items: ['Item 1', 'Item 2', 'Item 3'] ,
  //     reviews:["review1","review2","review3"]

  //   };
  //   res.render('home',{data});
  // });

  // app.get('/refresh-content', (req, res) => {
  //   const data = {
  //     items: ['Item 1', 'Item 2', 'Item 3'] // Sample data
  //   };
  //   res.render('partials/followingList', data, (err, html) => {
  //     res.send(html);
  //   });
  //   // res.render('followingList', data);
  // });



configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
