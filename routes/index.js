const meRouter = require("./me");
const siteRouter = require("./site");
const productRouter = require("./product");
const authRouter = require("./auth");
const categoryRouter = require("./category.js");
const reviewRouter = require("./review");

function route(app) {
  //   app.get("/news", function (req, res) {
  //     res.render("news");
  //   });

  //   app.get("/search", function (req, res) {
  //     console.log(req.query.q);
  //     res.render("search");
  //   });

  app.post("/search", function (req, res) {
    console.log(req.body);
    res.send("");
  });
  //   app.get("/", function (req, res) {
  //     res.render("home");
  //   });
  app.use("/category", categoryRouter);
  app.use("/user", meRouter);
  app.use("/product", productRouter);
  app.use("/site", siteRouter);
  app.use("/review", reviewRouter);
  app.use("/", authRouter);
}

module.exports = route;
