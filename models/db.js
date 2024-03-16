const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  database: "aula",
  host: "localhost",
  port: 3306,
  username: "root",
  dialect: "mysql",
  password: "root",
});

const book = sequelize.define("book", {
  title: {
    type: DataTypes.STRING,
  },
  author: {
    type: DataTypes.STRING,
  },
});
book.sync({ force: true });

module.exports = {
  db: {
    sequelize,
    book,
  },
};
