const express = require("express");
const path = require("path");
let app = express();
const port = 3000;
const fs = require("fs");

function readData(path) {
  let rawdata = fs.readFileSync(path);
  return JSON.parse(rawdata);
}

class Card {
  constructor(obj) {
    Object.assign(this, obj);
  }
  print() {
    console.log(this.a);
  }
}

function writeData(path, object) {
  let data = JSON.stringify(object);
  fs.writeFileSync(path, data);
}

function getRandomCard() {
  let allCards = readData("./input.json").map((e) => new Card(e));
  let claimCards = readData("./claim-list.json");
  let claimCardId = claimCards.map((e) => new Card(e).id);
  let unclaimCards = allCards.filter((e) => !claimCardId.includes(e.id));
  return unclaimCards[Math.floor(Math.random() * unclaimCards.length)];
}

function addToClaimList(object) {
  let claimCards = readData("./claim-list.json").map((e) => new Card(e));
  claimCards.push(object);
  writeData("./claim-list.json", claimCards);
}

app.use(express.static(path.join(__dirname, "views")));
app.set("view engine", "ejs");

app.get("/claim", (req, res) => {
  let randomCard = getRandomCard();
  addToClaimList(randomCard);
  res.render("claim-card", {
    card: randomCard,
  });
});

app.get("/list", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "/list-card.html"));
});

app.listen(port, () => {
  console.log(`Express is running on port ${port}`);
});
