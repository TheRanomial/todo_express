const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
const { stringify } = require("querystring");

app.use(bodyParser.json());

function findIndex(arr, id) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) return i;
  }
  return -1;
}

function removeAtIndex(arr, index) {
  let newArray = [];
  for (let i = 0; i < arr.length; i++) {
    if (i !== index) newArray.push(arr[i]);
  }
  return newArray;
}

app.get("/todos", (req, res) => {
  fs.readFile("todos.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to retrieve files" });
    }
    res.json(JSON.parse(data));
  });
});

app.get("/todos/:id", (req, res) => {
  const todoid = req.params.id;
  fs.readFile("todos.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to retrieve files" });
    }
    const todos = JSON.parse(data);
    const index = findIndex(todos, parseInt(todoid));

    if (index === -1) {
      return res.status(500).json({ error: "Failed to get index" });
    } else {
      res.json(todos[index]);
    }
  });
});

app.post("/todos", (req, res) => {
  const newObject = {
    id: Math.floor(Math.random() * 1000000),
    title: req.body.title,
    description: req.body.description,
  };

  fs.readFile("todos.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to open files" });
    }
    const todos = JSON.parse(data);
    todos.push(newObject);

    fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to write files" });
      }
    });
  });

  res.json({
    msg: "writing done",
  });
});

app.put("/todos/:id", (req, res) => {
  const todoid = req.params.id;

  fs.readFile("todos.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to retrieve files" });
    }
    const todos = JSON.parse(data);

    const todoindex = findIndex(todos, parseInt(todoid));

    if (todoindex === -1) {
      res.status(404).send();
    } else {
      const updatedtodo = {
        id: todos[todoindex.id],
        title: req.body.title,
        description: req.body.description,
      };
      todos[todoindex] = updatedtodo;

      fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to write files" });
        }
        res.status(200).send();
      });
    }

    res.json({
      msg: "updating done",
    });
  });
});

app.delete("/todos/:id", (req, res) => {
  const todoid = req.params.id;

  fs.readFile("todos.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to retrieve files" });
    }
    const todos = JSON.parse(data);

    const todoindex = findIndex(todos, parseInt(todoid));

    const newtodos = removeAtIndex(todos, todoindex);

    fs.writeFile("todos.json", JSON.stringify(newtodos), (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to write files" });
      }
      res.status(200).send();
    });

    res.json({
      msg: "deleting done",
    });
  });
});

const port = 3000;

app.listen(port, function () {
  console.log(`Listening to port ${port}`);
});
