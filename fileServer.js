const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const { error } = require("console");

app.use(express.json());

app.get("/files", function (req, res) {
  fs.readdir(path.join(__dirname, "./files/"), (error, files) => {
    if (error) {
      return res.status(500).json({ error: "Failed to retrieve files" });
    }
    res.json(files);
  });
});

app.get("/files/:fileName", function (req, res) {
  const filepath = path.join(__dirname, "./files/", req.params.fileName);
  fs.readFile(filepath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to retrieve files" });
    }
    res.send(data);
  });
});

app.all("*", (req, res) => {
  res.status(404).send("Route not found");
});

const port = 3000;

app.listen(port, function () {
  console.log(`Listening to port ${port}`);
});
