const express = require("express");
const cookieParser = require("cookie-parser");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3000;

const db = new sqlite3.Database("./customers.db");

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  db.get("SELECT * FROM customers ORDER BY RANDOM() LIMIT 1", (err, row) => {
    res.render("form", { customer: row || {}, cookies: req.cookies });
  });
});

app.post("/save", (req, res) => {
  const { CustomerId, FirstName, LastName, Address, Phone, Email } = req.body;
  res.cookie(
    "customerData",
    JSON.stringify({ CustomerId, FirstName, LastName, Address, Phone, Email }),
    { maxAge: 24 * 60 * 60 * 1000 }
  );
  res.redirect("/clearform");
});

app.get("/show", (req, res) => {
  if (req.cookies.customerData) {
    const data = JSON.parse(req.cookies.customerData);
    res.render("form", { customer: data, cookies: req.cookies });
  } else {
    res.redirect("/");
  }
});

app.get("/clear", (req, res) => {
  res.clearCookie("customerData");
  res.redirect("/clearform");
});

app.get("/clearform", (req, res) => {
  res.render("form", { customer: {}, cookies: req.cookies });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
