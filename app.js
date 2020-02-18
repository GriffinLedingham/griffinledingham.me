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
  const promises = [];
  fs.readdir(postsDir, (err, files) => {
    files.reverse().forEach(postFile => {
      promises.push(parseMarkdown(postFile.split(".")[0]));
    });
    Promise.all(promises).then(posts => {
      res.render("home", { posts });
    });
  });
});

// Post Routes
app.get("/post/:id", (req, res) => {
  const postId = req.params.id;
  parseMarkdown(postId)
    .then(postData => res.render("post", postData))
    .catch(e => res.render("404"));
});

app.get("*", (req, res) => {
  res.render("404");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

function parseMarkdown(postId) {
  return new Promise((resolve, reject) => {
    fs.readFile(
      `${postsDir}/${postId}.md`,
      { encoding: "utf8" },
      (err, data) => {
        if (err == null) {
          const dataArr = data.split("</summary>");
          const md = new MarkdownIt().use(require("markdown-it-footnote"));
          const postData = { id: postId };
          if (dataArr.length === 2) {
            const titleArr = dataArr[0].split("</title>");
            if (titleArr.length === 2) {
              postData.title = md
                .render(titleArr[0])
                .replace(/(<([^>]+)>)/gi, "");
              postData.summary = md.render(titleArr[1]);
              postData.post = md.render(dataArr[1]);
            } else {
              return reject();
            }
          } else {
            return reject();
          }
          return resolve(postData);
        } else {
          reject();
        }
      }
    );
  });
}
