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
  let color = "rgba(30, 255, 49, 0.8)";
  switch (color) {
    case "UNCOMMON":
      color = "rgba(30, 229, 255, 0.8)";
      break;
    case "RARE":
      color = "rgba(10, 15, 73, 0.8)";
      break;
    case "EPIC":
      color = "rgba(128, 5, 177, 0.8)";
      break;
    case "LEGENDARY":
      color = "rgba(226, 11, 11, 0.8)";
      break;
  }
  res.render("claim-card", {
    card: randomCard,
    tier_color: color,
  });
});

const ITEMS_PER_PAGE = 4;
app.get("/list", (req, res) => {
  let claimCards = readData("./claim-list.json").map((e) => new Card(e));
  let totalItems = claimCards.length;
  let page = parseInt(req.query.page) || 1;
  let start = ITEMS_PER_PAGE * (page - 1);
  let end = totalItems;
  if (end > ITEMS_PER_PAGE * page - 1) {
    end = ITEMS_PER_PAGE * page - 1;
  }
  res.render("list-card", {
    list: claimCards.slice(start, end + 1),
    currentPage: page,
    hasNextPage: ITEMS_PER_PAGE * page < totalItems,
    hasPreviousPage: page > 1,
    nextPage: page + 1,
    previousPage: page - 1,
    lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
  });
});

app.get("/get", (req, res) => {
  res.render("get-card");
});

app.get("/img/background.avif", function (req, res) {
  res.sendFile(path.join(__dirname, "img/background.avif"));
});

app.get("/js/pagination.js", function (req, res) {
  res.sendFile(path.join(__dirname, "js/pagination.js"));
});

app.listen(port, () => {
  console.log(`Express is running on port ${port}`);
});

app.get("/generate", async (req, res) => {
  let allCards = readData("./input.json").map((e) => new Card(e));
  for (let i = 0; i < allCards.length; i++) {
    let response = await fetch("https://dog.ceo/api/breeds/image/random");
    let data = await response.json();
    let url = await data.message;
    allCards[i].image_url = url;
    console.log(i);
  }

  console.log("Complete get");
  await writeData("./input.json", allCards);
  console.log("Complete write");
});
