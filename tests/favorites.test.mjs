import assert from "node:assert/strict";
import { test } from "node:test";
import { getFavoriteProducts } from "../src/lib/favorites.ts";

const product = (id, name, categoryLabel, brand) => ({ id, name, categoryLabel, brand });

test("favorites pick the staples first, then the good brands", () => {
  const catalog = [
    product("glass", "Nyes Neck Stemless Wine Glass", "Glassware"),
    product("polo", "Harbor Polo", "Polos", "Port Authority"),
    product("retro-hat", "Nyes Neck Retro Trucker", "Hats", "Otto Cap"),
    product("hat", "Classic Dad Hat", "Hats"),
    product("cc-tee", "Coastal Pocket Tee", "T-Shirts", "Comfort Colors"),
    product("cc-retro", "Retro Nyes Neck Tee", "T-Shirts", "Comfort Colors"),
    product("spirit", "Nyes Neck Spirit Tee", "T-Shirts", "Gildan"),
    product("crew", "Embroidered Crewneck Sweatshirt", "Sweatshirts"),
    product("retro-crew", "Retro Nyes Neck Sweatshirt", "Sweatshirts"),
    product("towel", "Classic Beach Towel", "Towels"),
    product("columbia", "Nyes Neck Fleece Jacket", "Jackets", "Columbia"),
    product("ua", "Nyes Neck Performance Polo", "Polos", "Under Armour"),
    product("mug", "Harbor Mug", "Drinkware"),
  ];
  assert.deepEqual(getFavoriteProducts(catalog).map((item) => item.id), [
    "spirit", "cc-retro", "cc-tee", "crew", "retro-crew", "retro-hat", "hat", "towel", "glass", "columbia", "ua",
  ]);
});

test("one style cannot crowd out the rest", () => {
  const tees = Array.from({ length: 5 }, (_, index) => product(`cc-${index}`, `Pocket Tee ${index}`, "T-Shirts", "Comfort Colors"));
  const favorites = getFavoriteProducts([...tees, product("spirit", "Spirit Tee", "T-Shirts")]).map((item) => item.id);
  assert.deepEqual(favorites, ["spirit", "cc-0", "cc-1", "cc-2"]); // the brand pass tops tees up to their cap of 4
});
