const express = require("express");
const app = express();

app.use(express.json());

var users = [
  {
    name: "john",
    kidneys: [
      {
        healthy: true,
      },
    ],
  },
];

app.get("/", function (req, res) {
  const johnkidneys = users[0].kidneys;
  const noofkidneys = johnkidneys.length;
  let healthykidneys = 0;
  for (let i = 0; i < johnkidneys.length; i++) {
    if (johnkidneys[i].healthy) {
      healthykidneys = healthykidneys + 1;
    }
  }

  const nounhealtykidneys = noofkidneys - healthykidneys;
  res.json({
    noofkidneys,
    healthykidneys,
    nounhealtykidneys,
  });
});

app.post("/", function (req, res) {
  const isHealthy = req.query.isHealthy;
  users[0].kidneys.push({
    healthy: isHealthy,
  });

  res.json({
    msg: "done",
  });
});

app.put("/", function (req, res) {
  let flag = true;

  for (let i = 0; i < users[0].kidneys.length; i++) {
    if (!users[0].kidneys[i].healthy) {
      flag = false;
    }
  }

  if (flag) {
    res.status(200).send("all are healthy");
  }

  for (let i = 0; i < users[0].kidneys.length; i++) {
    users[0].kidneys[i].healthy = true;
  }
  res.json({
    msg: "put done",
  });
});

app.delete("/", function (req, res) {
  let flag = true;

  for (let i = 0; i < users[0].kidneys.length; i++) {
    if (!users[0].kidneys[i].healthy) {
      flag = false;
    }
  }

  if(flag) {
    res.status(411).send("No unhealty kidneys available");
    return
  }

  users[0].kidneys.pop();
  res.json({
    msg: "pdelete done",
  });
});

const port = 3000;

app.listen(port, function () {
  console.log(`Listening to port ${port}`);
});

