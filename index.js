const express = require("express");
const app = express();
const { engine } = require("express-handlebars");
const { db } = require("./models/db");

app.engine("handlebars", engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", async (_req, res) => {
  const books = (await db.book.findAll()).map((post) => post.toJSON());
  res.render("home", { books });
});
app.get("/create", (_req, res) => {
  res.render("create");
});

app.get("/book/update/:id", async (req, res) => {
  const book = (
    await db.book.findOne({ where: { id: req.params.id } })
  ).toJSON();
  console.log(book);
  res.render("update", { book });
});
app.get("/book/delete/:id", async (req, res) => {
  await db.book.destroy({ where: { id: req.params.id } });
  res.redirect("/");
});
app.post("/book", async (req, res) => {
  await db.book.create({
    title: req.body.title,
    author: req.body.author,
  });
  res.redirect("/");
});
app.post("/book/:id", async (req, res) => {
  await db.book.update({
    where: {
      id: req.params.id,
    },
  });
  res.redirect("/");
});

app.listen(8080, () => {
  console.log("> [app] servidor inicializado na porta 8080");
});
