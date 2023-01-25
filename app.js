const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const nodemon = require("nodemon");

const app = express();
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const wikiSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", wikiSchema);

app
  .route("/articles/:articleTitle")

  .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle }, (err, article) => {
      if (err) {
        console.log(err);
      } else {
        res.send(article);
      }
    });
  })
  .put((req, res) => {
    Article.updateOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      (err) => {
        if (err) {
          console.log(err)
        } else {
          res.send("put article")
        }
      }
    );
  })
  .patch((req, res) => {
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: req.body },
      (err) => {
        if (err) {
          console.log(err)
        } else {
          res.send("patched article")
        }
      }
    );
  })
  .delete((req, res) => {
    Article.deleteOne({title: req.params.articleTitle}, (err) => {
      if (err) {
        console.log(err);
      } else {
        res.send("succesfully deleted article");
      }
    });
  })

app
  .route("/articles")
  .get((req, res) => {
    Article.find({}, (err, foundArticles) => {
      if (err) {
        console.log(err);
      } else {
        console.log(foundArticles);
        res.send(foundArticles);
      }
    });
  })
  .post((req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const article = new Article({
      title: title,
      content: content,
    });

    article
      .save()
      .then(() => res.send("successfully saved article about " + title));
  })
  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (err) {
        console.log(err);
      } else {
        res.send("succesfully deleted all articles");
      }
    });
  });

app.listen(3000, () => {
  console.log("connected to 3000");
});
