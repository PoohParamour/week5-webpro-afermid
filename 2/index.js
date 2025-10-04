const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(
  session({
    secret: "restaurant-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  const response = await fetch("http://webdev.it.kmitl.ac.th:8000/restaurant");
  const menu = await response.json();
  res.render("menu", { menu });
});

app.get("/cart", (req, res) => {
  const cart = req.session.cart || [];
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  res.render("cart", { cart, total });
});

app.get("/add/:id", async (req, res) => {
  const id = req.params.id;
  const response = await fetch(`http://webdev.it.kmitl.ac.th:8000/detail/${id}`);
  const item = await response.json();
  if (!req.session.cart) req.session.cart = [];
  req.session.cart.push(item);
  res.redirect("/");
});

app.get("/confirm", (req, res) => {
  req.session.cart = [];
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
