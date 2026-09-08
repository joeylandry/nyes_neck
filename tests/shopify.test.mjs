import assert from "node:assert/strict";
import { test } from "node:test";
import { getShopifyOrigin, getShopifyCheckoutUrl, applyLaunchAvailability, RETRO_CREWNECK_ID } from "../src/lib/commerce/shopify.ts";

test("checkout only accepts the launch product, numeric Shopify IDs, and a Shopify HTTPS domain", () => {
  const previous = process.env.SHOPIFY_STORE_DOMAIN;
  try {
    delete process.env.SHOPIFY_STORE_DOMAIN;
    assert.equal(getShopifyCheckoutUrl(RETRO_CREWNECK_ID, "52843603820829"), undefined);
    process.env.SHOPIFY_STORE_DOMAIN = "test-store.myshopify.com";
    assert.equal(getShopifyCheckoutUrl(RETRO_CREWNECK_ID, "52843603820829"), "https://test-store.myshopify.com/cart/52843603820829:1");
    assert.equal(getShopifyCheckoutUrl("printful-463174354", "52843603820829"), undefined);
    assert.equal(getShopifyCheckoutUrl(RETRO_CREWNECK_ID, "printful-123"), undefined);
    assert.equal(getShopifyCheckoutUrl(RETRO_CREWNECK_ID, "123:1,456"), undefined);
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
  const product = { id: "other", available: true, externalLink: "https://example.com", variants: [{ available: true, checkoutUrl: "https://test.myshopify.com/cart/123:1" }] };
  const result = applyLaunchAvailability(product);
  assert.equal(result.available, false);
  assert.equal(result.externalLink, undefined);
  assert.equal(result.variants[0].checkoutUrl, undefined);
  assert.equal(product.available, true);
  assert.equal(applyLaunchAvailability({ ...product, id: RETRO_CREWNECK_ID }).available, true);
  assert.equal(applyLaunchAvailability({ ...product, id: RETRO_CREWNECK_ID, variants: [{ available: true }] }).available, false);
  assert.equal(applyLaunchAvailability({ ...product, id: RETRO_CREWNECK_ID, variants: [{ available: false, checkoutUrl: "https://test.myshopify.com/cart/123:1" }] }).available, false);
});
