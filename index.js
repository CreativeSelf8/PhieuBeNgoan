// $(document).ready(function () {
//   $("#slc-options").on("change", function () {
//     if (this.value == "CL") {
//       $("#claim_card_div").show();
//       $("#list_card_div").hide();
//     } else if (this.value == "LST") {
//       $("#list_card_div").show();
//       $("#claim_card_div").hide();
//     }
//   });

//   loadJSON(
//     "https://raw.githubusercontent.com/LearnWebCode/json-example/master/animals-1.json",
//     function (response) {
//       // Parse JSON string into object
//       var actual_JSON = JSON.parse(response);
//       for (let i = 0; i < actual_JSON.length; i++) {
//         let obj = actual_JSON[i];
//         var html = `<div class="col">
//         <img
//           id="card_img"
//           src="https://loremflickr.com/600/400/dog"
//         />
//         <div id="card_name">${obj.name}</div>
//         <div id="card_tier">${obj.species}</div>
//       </div>`;
//         $("#list_card_div").append(html);
//       }
//     }
//   );
// });

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
  let allCards = readData("./input.json").map(e => new Card(e));
  let claimCards = readData("./claim-list.json");
  let claimCardId = claimCards.map(e => new Card(e).id);
  let unclaimCards = allCards.filter(e => !claimCardId.includes(e.id));
  return unclaimCards[Math.floor(Math.random()*unclaimCards.length)];
}

function addToClaimList(object) {
  let claimCards = readData("./claim-list.json").map(e => new Card(e));
  claimCards.push(object);
  writeData("./claim-list.json", claimCards);
}

app.use(express.static(path.join(__dirname, "views")));

app.get("/claim", (req, res) => {
  let randomCard = getRandomCard();
  addToClaimList(randomCard);
  res.sendFile(path.join(__dirname, "views", "/claim-card.html"));
});

app.get("/list", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "/claim-list.html"));
});

app.listen(port, () => {
  console.log(`Express is running on port ${port}`);
});
