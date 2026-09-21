import assert from "node:assert/strict";
import { test } from "node:test";
import { bulkTiers, getBulkDiscountCents, getBulkTier, getNextBulkTier, getQuantityPresets, quantityPresetLabel } from "../src/lib/bulkPricing.ts";
import { buildShopifyCheckoutUrl } from "../src/lib/commerce/shopifyCheckout.ts";

test("volume tiers rise with the order quantity and stop at the top tier", () => {
  assert.equal(getBulkTier(1), undefined);
  assert.equal(getBulkTier(2), undefined);
  assert.equal(getBulkTier(3)?.percentOff, 5);
  assert.equal(getBulkTier(5)?.percentOff, 5);
  assert.equal(getBulkTier(6)?.percentOff, 10);
  assert.equal(getBulkTier(12)?.percentOff, 15);
  assert.equal(getBulkTier(40)?.percentOff, 15);
  assert.equal(getNextBulkTier(1)?.minimumQuantity, 3);
  assert.equal(getNextBulkTier(6)?.minimumQuantity, 12);
  assert.equal(getNextBulkTier(12), undefined);
  assert.deepEqual(bulkTiers.map((tier) => tier.minimumQuantity), [3, 6, 12]);
});

test("bulk savings round to whole cents and never apply below the first tier", () => {
  assert.equal(getBulkDiscountCents(10000, 2), 0);
  assert.equal(getBulkDiscountCents(10000, 3), 500);
  assert.equal(getBulkDiscountCents(12999, 6), 1300);
  assert.equal(getBulkDiscountCents(12000, 12), 1800);
  assert.equal(getBulkDiscountCents(0, 12), 0);
});

test("one-size goods offer half dozen and dozen packs", () => {
  assert.deepEqual(getQuantityPresets("glassware"), [1, 6, 12]);
  assert.deepEqual(getQuantityPresets("hats"), [1, 6, 12]);
  assert.deepEqual(getQuantityPresets("t-shirts"), [1, 3, 6, 12]);
  assert.deepEqual(getQuantityPresets(undefined), [1, 3, 6, 12]);
  assert.equal(quantityPresetLabel(1), "Single");
  assert.equal(quantityPresetLabel(6), "Half dozen");
  assert.equal(quantityPresetLabel(12), "Dozen");
  assert.equal(quantityPresetLabel(4), "4-pack");
});

test("checkout permalinks carry every line and reject unusable carts", () => {
  const line = (id, quantity) => ({ cartUrl: `https://test-store.myshopify.com/cart/add?id=${id}&quantity=1`, quantity });
  assert.equal(
    buildShopifyCheckoutUrl([line("52907466260765", 2), line("52907466260766", 12)]),
    "https://test-store.myshopify.com/cart/52907466260765:2,52907466260766:12?checkout",
  );
  assert.equal(buildShopifyCheckoutUrl([]), undefined);
  assert.equal(buildShopifyCheckoutUrl([{ cartUrl: "https://test-store.myshopify.com/cart/add?id=abc", quantity: 1 }]), undefined);
  assert.equal(buildShopifyCheckoutUrl([line("52907466260765", 0)]), undefined);
  assert.equal(buildShopifyCheckoutUrl([
    line("52907466260765", 1),
    { cartUrl: "https://other-store.myshopify.com/cart/add?id=52907466260766&quantity=1", quantity: 1 },
  ]), undefined);
});
