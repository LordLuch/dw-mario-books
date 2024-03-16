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
  const book = await db.book.findOne({ where: { id: req.params.id } })
  if (!book) return res.status(404).json({ message: 'BOOK_NOT_FOUND' })
  res.render("update", { book: book.toJSON() });
});
app.get("/book/delete/:id", async (req, res) => {
  try {
    await db.book.destroy({ where: { id: req.params.id } });
  } catch (err) {
    console.log(err)
  }
  res.redirect("/");
});
app.post("/book", async (req, res) => {
  try {
    await db.book.create({
      title: req.body.title,
      author: req.body.author,
    });
    res.redirect("/");
  } catch (err) {
    res.status(500).json({ "message": "Erro ao tentar adicionar um novo livro." })
  }
});
app.post("/book/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    const { title, author } = req.body;

    await db.book.update(
      { title, author },
      { where: { id: bookId } }
    );

    res.redirect("/");
  } catch (error) {
    console.error("Erro ao atualizar o livro:", error);
    res.status(500).send("Erro ao atualizar o livro.");
  }
});

app.listen(8080, () => {
  console.log("> [app] servidor inicializado na porta 8080");
});
