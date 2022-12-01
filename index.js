const express = require("express");
const path = require("path");
let app = express();
const port = 3000;
const fs = require("fs");
var favicon = require("serve-favicon");

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
app.use(favicon(path.join(__dirname, "img", "firework.ico")));

app.get("/", (req, res) => {
  res.render("claim-card");
});

app.get("/claim-card", (req, res) => {
  const date = new Date();
  const day = date.getDate();
  const dateStrArr = date.toDateString().split(" ");
  const month = dateStrArr[1];
  let randomCard = getRandomCard();
  randomCard.day = day;
  randomCard.month = month.toUpperCase();
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
  res.status(200).json({ card: randomCard, tier_color: color });
});

const ITEMS_PER_PAGE = 3;
app.get("/list", (req, res) => {
  let claimCards = readData("./claim-list.json").map((e) => new Card(e));
  let totalItems = claimCards.length;

  for (let card of claimCards) {
    let color = "rgba(30, 255, 49, 0.8)";
    switch (card.tier) {
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
    claimCards.tier_color = color;
  }

  let legendaryCount = claimCards.filter((e) => e.tier.toUpperCase() === 'LEGENDARY').length
  let epicCount = claimCards.filter((e) => e.tier.toUpperCase() === 'EPIC').length
  let rareCount = claimCards.filter((e) => e.tier.toUpperCase() === 'RARE').length
  let uncommonCount = claimCards.filter((e) => e.tier.toUpperCase() === 'UNCOMMON').length
  let commonCount = claimCards.filter((e) => e.tier.toUpperCase() === 'COMMON').length;
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
    total: totalItems,
    legendaryCount: legendaryCount,
    epicCount: epicCount,
    rareCount: rareCount,
    uncommonCount: uncommonCount,
    commonCount: commonCount
  });
});

app.get("/img/:name", function (req, res) {
  res.sendFile(path.join(__dirname, "img", req.params.name));
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
