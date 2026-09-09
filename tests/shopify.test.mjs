import assert from "node:assert/strict";
import { test } from "node:test";
import { getShopifyOrigin, getShopifyCartUrl, applyLaunchAvailability, RETRO_CREWNECK_ID } from "../src/lib/commerce/shopify.ts";

test("cart links only accept the launch product, numeric Shopify IDs, and a Shopify HTTPS domain", () => {
  const previous = process.env.SHOPIFY_STORE_DOMAIN;
  try {
    delete process.env.SHOPIFY_STORE_DOMAIN;
    assert.equal(getShopifyCartUrl(RETRO_CREWNECK_ID, "52843603820829"), undefined);
    process.env.SHOPIFY_STORE_DOMAIN = "test-store.myshopify.com";
    assert.equal(getShopifyCartUrl(RETRO_CREWNECK_ID, "52843603820829"), "https://test-store.myshopify.com/cart/add?id=52843603820829&quantity=1");
    assert.equal(getShopifyCartUrl("printful-463174354", "52843603820829"), undefined);
    assert.equal(getShopifyCartUrl(RETRO_CREWNECK_ID, "printful-123"), undefined);
    assert.equal(getShopifyCartUrl(RETRO_CREWNECK_ID, "123:1,456"), undefined);
    for (const domain of ["http://test.myshopify.com", "https://test.myshopify.com.evil.com", "https://test.myshopify.com/path", "https://user:password@test.myshopify.com"]) {
      process.env.SHOPIFY_STORE_DOMAIN = domain;
      assert.equal(getShopifyOrigin(), undefined);
    }
  } finally {
    if (previous === undefined) delete process.env.SHOPIFY_STORE_DOMAIN;
    else process.env.SHOPIFY_STORE_DOMAIN = previous;
  }
});

test("other products and fallback catalogs cannot expose purchase links", () => {
  const product = { id: "other", available: true, externalLink: "https://example.com", variants: [{ available: true, cartUrl: "https://test.myshopify.com/cart/add?id=123&quantity=1" }] };
  const result = applyLaunchAvailability(product);
  assert.equal(result.available, false);
  assert.equal(result.externalLink, undefined);
  assert.equal(result.variants[0].cartUrl, undefined);
  assert.equal(product.available, true);
  assert.equal(applyLaunchAvailability({ ...product, id: RETRO_CREWNECK_ID }).available, true);
  assert.equal(applyLaunchAvailability({ ...product, id: RETRO_CREWNECK_ID, variants: [{ available: true }] }).available, false);
  const soldOutOnPrintful = applyLaunchAvailability({ ...product, id: RETRO_CREWNECK_ID, variants: [{ available: false, cartUrl: "https://test.myshopify.com/cart/add?id=123&quantity=1" }] });
  assert.equal(soldOutOnPrintful.available, false);
  assert.equal(soldOutOnPrintful.variants[0].available, false);
});
