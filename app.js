const fs = require("fs");
const express = require("express");
const exphbs = require("express-handlebars");
const MarkdownIt = require("markdown-it");
const livereload = require("livereload");

// Live Reload
const server = livereload.createServer({
  exts: ["html", "css", "js", "md", "handlebars"],
  exclusions: [/\.git\//, /\.svn\//, /\.hg\//, /node_modules\//],
  delay: 100,
});
server.watch(__dirname);

// Init Express and Handlebars
const app = express();
const port = process.env.PORT || 3000;
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
app.use(express.static("client"));

const postsDir = "./posts";

// Home Route
app.get("/", (req, res) => {
  const homeData = { posts: [] };
  fs.readdir(postsDir, (err, files) => {
    files.forEach(postFile => {
      homeData.posts.push({ id: postFile.split(".")[0] });
    });
    res.render("home", homeData);
  });
});

// Post Routes
app.get("/post/:id", (req, res) => {
  const postId = req.params.id;
  fs.readFile(`${postsDir}/${postId}.md`, { encoding: "utf8" }, (err, data) => {
    if (err == null) {
      const md = new MarkdownIt();
      const result = md.render(data);
      res.render("post", { md: result });
    } else {
      res.render("404");
    }
  });
});

app.get("*", (req, res) => {
  res.render("404");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
