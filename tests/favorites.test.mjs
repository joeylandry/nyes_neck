import assert from "node:assert/strict";
import { test } from "node:test";
import { getFavoriteGroups, getFavoriteProducts } from "../src/lib/favorites.ts";

const product = (id, name, categoryLabel, brand) => ({ id, name, categoryLabel, brand });

test("favorites pick the staple products in a fixed group order", () => {
  const catalog = [
    product("glass", "Nyes Neck Stemless Wine Glass", "Glassware"),
    product("polo", "Harbor Polo", "Polos"),
    product("hat", "Classic Retro Dad Hat", "Hats"),
    product("cc-tee", "Coastal Pocket Tee", "T-Shirts", "Comfort Colors"),
    product("spirit", "Nyes Neck Spirit Tee", "T-Shirts", "Gildan"),
    product("crew", "Embroidered Crewneck Sweatshirt", "Sweatshirts"),
    product("retro-crew", "Retro Nyes Neck Sweatshirt", "Sweatshirts"),
    product("towel", "Classic Beach Towel", "Towels"),
    product("mug", "Harbor Mug", "Drinkware"),
  ];
  const groups = getFavoriteGroups(catalog);
  assert.deepEqual(groups.map((group) => group.label), ["T-shirts", "Sweatshirts", "Hats", "Beach towels", "Wine glasses"]);
  assert.deepEqual(getFavoriteProducts(catalog).map((item) => item.id), ["spirit", "cc-tee", "crew", "retro-crew", "hat", "towel", "glass"]);
});

test("one style cannot crowd out the rest of its group", () => {
  const tees = Array.from({ length: 5 }, (_, index) => product(`cc-${index}`, `Comfort Colors Tee ${index}`, "T-Shirts"));
  const groups = getFavoriteGroups([...tees, product("spirit", "Spirit Tee", "T-Shirts")]);
  assert.deepEqual(groups[0].products.map((item) => item.id), ["spirit", "cc-0", "cc-1"]);
});
