import assert from "node:assert/strict";
import { test } from "node:test";
import { getShopifyOrigin, getShopifyCartUrl, applyLaunchAvailability } from "../src/lib/commerce/shopify.ts";
import { makeProductSlug, productMatchesSlug } from "../src/lib/productSlugs.ts";
import { inferManufacturer, inferProductTypeCategory } from "../src/lib/productTaxonomy.ts";
import { getProductDefaultColor, mergeSynchronizedProductImages } from "../src/lib/productImages.ts";

test("cart links accept numeric Shopify IDs and only a Shopify HTTPS domain", () => {
  const previous = process.env.SHOPIFY_STORE_DOMAIN;
  try {
    delete process.env.SHOPIFY_STORE_DOMAIN;
    assert.equal(getShopifyCartUrl("10388806795549", "52907466260765"), undefined);
    process.env.SHOPIFY_STORE_DOMAIN = "test-store.myshopify.com";
    assert.equal(getShopifyCartUrl("10388806795549", "52907466260765"), "https://test-store.myshopify.com/cart/add?id=52907466260765&quantity=1");
    assert.equal(getShopifyCartUrl("printful-463174354", "52843603820829"), undefined);
    assert.equal(getShopifyCartUrl("10388806795549", "printful-123"), undefined);
    assert.equal(getShopifyCartUrl("10388806795549", "123:1,456"), undefined);
    for (const domain of ["http://test.myshopify.com", "https://test.myshopify.com.evil.com", "https://test.myshopify.com/path", "https://user:password@test.myshopify.com"]) {
      process.env.SHOPIFY_STORE_DOMAIN = domain;
      assert.equal(getShopifyOrigin(), undefined);
    }
  } finally {
    if (previous === undefined) delete process.env.SHOPIFY_STORE_DOMAIN;
    else process.env.SHOPIFY_STORE_DOMAIN = previous;
  }
});

test("catalog availability is preserved for synchronized products", () => {
  const product = { id: "other", available: true, externalLink: "https://example.com", variants: [{ available: true, cartUrl: "https://test.myshopify.com/cart/add?id=123&quantity=1" }] };
  const result = applyLaunchAvailability(product);
  assert.equal(result, product);
  assert.equal(result.available, true);
  assert.equal(result.variants[0].available, true);
});

test("product routes survive Unicode trademark differences and source fallback", () => {
  const product = {
    slug: makeProductSlug("Under Armour® athletic t-shirt", "10388806795549"),
    externalId: "10388806795549",
    legacySlugs: ["under-armourⓡ-athletic-t-shirt"],
    name: "Under Armour® athletic t-shirt",
  };
  assert.equal(productMatchesSlug(product, "under-armourr-athletic-t-shirt-10388806795549"), true);
  assert.equal(productMatchesSlug(product, "under-armour%E2%93%A1-athletic-t-shirt"), true);
  assert.equal(productMatchesSlug(product, "10388806795549"), true);
});

test("catalog metadata produces useful product types and manufacturer fallbacks", () => {
  const categories = [{ slug: "t-shirts", value: "t-shirts", label: "T-Shirts", kind: "product-type", description: "" }];
  assert.equal(inferProductTypeCategory({ categories, preferredType: "EMBROIDERY", searchText: "Under Armour women's polo" })?.label, "Polos");
  assert.equal(inferProductTypeCategory({ categories, preferredType: "DRINKWARE", searchText: "Retro wine tumbler" })?.label, "Tumblers");
  assert.equal(inferProductTypeCategory({ categories, preferredType: "DRINKWARE", searchText: "Retro wine glass" })?.label, "Glassware");
  assert.equal(inferProductTypeCategory({ categories, preferredType: "DTFILM", searchText: "Unclassified item" })?.label, "Other");
  assert.equal(inferProductTypeCategory({ categories, preferredType: "T-SHIRT", searchText: "Retro crewneck sweatshirt" })?.label, "Sweatshirts");
  assert.equal(inferManufacturer("Retro Columbia fleece jacket"), "Columbia");
  assert.equal(inferManufacturer("Custom shirt", "Comfort Colors"), "Comfort Colors");
});

test("synchronized product images do not repeat Shopify's primary image", () => {
  const printfulImages = [
    { id: "printful-main", src: "https://printful.test/front.png", alt: "Front", role: "main", colors: ["Blue"] },
    { id: "printful-back", src: "https://printful.test/back.png", alt: "Back", role: "gallery", colors: ["Blue"] },
  ];
  const shopifyImages = [
    { id: "shopify-main", src: "https://shopify.test/shirt-blue-front.png", alt: "Front", role: "main", colors: ["Blue"] },
    { id: "shopify-front-copy", src: "https://shopify.test/shirt-blue-front-abc.jpg", alt: "Front", role: "gallery", colors: ["Blue"] },
    { id: "shopify-back", src: "https://shopify.test/back.png", alt: "Back", role: "gallery", colors: ["Blue"] },
    { id: "shopify-back-copy", src: "https://shopify.test/back.png", alt: "Back", role: "gallery", colors: ["Blue"] },
  ];

  const images = mergeSynchronizedProductImages(printfulImages, shopifyImages);
  assert.deepEqual(images.map((image) => image.id), ["shopify-main", "printful-back", "shopify-back"]);
  assert.deepEqual(images.map((image) => image.role), ["main", "gallery", "gallery"]);
});

test("the published primary image controls the initial product color", () => {
  assert.equal(getProductDefaultColor({
    colors: ["Black", "Blue"],
    images: [
      { id: "blue-main", src: "https://shopify.test/blue-front.png", alt: "Blue", role: "main", colors: ["Blue"] },
      { id: "black", src: "https://shopify.test/black-front.png", alt: "Black", role: "gallery", colors: ["Black"] },
    ],
    variants: [
      { id: "black-small", color: "Black", size: "S", available: true },
      { id: "blue-small", color: "Blue", size: "S", available: true },
    ],
  }), "Blue");
});
