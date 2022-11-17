import { faker } from "@faker-js/faker";
// import { faker } from '@faker-js/faker/locale/de';
import * as fs from "fs";
import { Card } from "./Card";
import { Tier } from "./tier";

var commonCount = 45000;
var unCommonCount = 75000;
var rareCount = 90000;
var epicCount = 97000;
var legendaryCount = 100000;
var count = 1;

export const dataArr: Card[] = [];

export function createRandomDog(): Card {
  var chosen = Tier[Tier.Common];
  if (count >= 1 && count <= commonCount) {
    chosen = Tier[Tier.Common];
  } else if (count >= 45001 && count <= unCommonCount) {
    chosen = Tier[Tier.Uncommon];
  } else if (count >= 75001 && count <= rareCount) {
    chosen = Tier[Tier.Rare];
  } else if (count >= 90001 && count <= epicCount) {
    chosen = Tier[Tier.Epic];
  } else if (count >= 97001 && count <= legendaryCount) {
    chosen = Tier[Tier.Legendary];
  }
  count++;
  return {
    name: faker.animal.dog(),
    image_url: faker.image.imageUrl(600, 400, "dog"),
    id: faker.datatype.uuid(),
    tier: chosen.toString(),
  };
}
Array.from({ length: 100000 }).forEach(() => {
  dataArr.push(createRandomDog());
});

fs.writeFile("input.json", JSON.stringify(dataArr), function (err) {
  if (err) throw err;
  console.log("complete");
});
