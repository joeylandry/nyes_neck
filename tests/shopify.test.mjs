import assert from "node:assert/strict";
import { test } from "node:test";
import { getShopifyOrigin, getShopifyCartUrl, applyLaunchAvailability } from "../src/lib/commerce/shopify.ts";
import { makeProductSlug, productMatchesSlug } from "../src/lib/productSlugs.ts";
import { inferManufacturer, inferProductTypeCategory } from "../src/lib/productTaxonomy.ts";
import { detectProductImageView, getProductDefaultColor, mergeSynchronizedProductImages, orderFrontViewsFirst } from "../src/lib/productImages.ts";

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

test("mockup file names reveal which side of the product they show", () => {
  assert.equal(detectProductImageView("https://cdn.shopify.com/s/files/1/unisex-hoodie-navy-front-65f1a2.png?v=1"), "front");
  assert.equal(detectProductImageView("https://cdn.shopify.com/s/files/1/unisex-hoodie-navy-back-2-65f1a2.png"), "other");
  assert.equal(detectProductImageView("https://cdn.shopify.com/s/files/1/unisex-hoodie-navy-left-front-65f1a2.png"), "angled-front");
  assert.equal(detectProductImageView("mockup_Front_Black.png"), "front");
  assert.equal(detectProductImageView("https://cdn.shopify.com/s/files/1/back-bay-tee-white-front-65f1.png"), "front");
  assert.equal(detectProductImageView("https://files.cdn.printful.com/files/abc/abc_preview.png"), undefined);
  assert.equal(detectProductImageView(undefined, "https://cdn.shopify.com/s/files/1/tee-black-back-65f1.png"), "other");
});

test("each color opens on its front mockup without changing the primary color", () => {
  const images = orderFrontViewsFirst([
    { id: "navy-back", src: "https://shopify.test/hoodie-navy-back-1.png", alt: "", role: "main", colors: ["Navy"] },
    { id: "black-sleeve", src: "https://shopify.test/hoodie-black-left-1.png", alt: "", role: "gallery", colors: ["Black"] },
    { id: "navy-front", src: "https://shopify.test/hoodie-navy-front-1.png", alt: "", role: "gallery", colors: ["Navy"] },
    { id: "black-preview", src: "https://printful.test/abc_preview.png", alt: "", role: "gallery", colors: ["Black"], view: "front" },
    { id: "black-back", src: "https://shopify.test/hoodie-black-back-1.png", alt: "", role: "gallery", colors: ["Black"] },
  ]);
  assert.deepEqual(images.map((image) => image.id), ["navy-front", "black-preview", "navy-back", "black-sleeve", "black-back"]);
  assert.deepEqual(images.map((image) => image.role), ["main", "gallery", "gallery", "gallery", "gallery"]);
});

test("synchronized products keep Shopify's front for colors Printful did not mock up", () => {
  const images = mergeSynchronizedProductImages(
    [{ id: "printful-blue-back", src: "https://printful.test/blue-back.png", alt: "", role: "main", colors: ["Blue"] }],
    [
      { id: "shopify-blue-back", src: "https://shopify.test/tee-blue-back-1.png", alt: "", role: "main", colors: ["Blue"] },
      { id: "shopify-red-back", src: "https://shopify.test/tee-red-back-1.png", alt: "", role: "gallery", colors: ["Red"] },
      { id: "shopify-red-front", src: "https://shopify.test/tee-red-front-1.png", alt: "", role: "gallery", colors: ["Red"] },
    ],
  );
  assert.deepEqual(images.filter((image) => image.colors?.includes("Red")).map((image) => image.id), ["shopify-red-front", "shopify-red-back"]);
});

test("drinkware keeps Shopify's named front when Printful's preview is an unnamed angle", () => {
  const images = mergeSynchronizedProductImages(
    [
      { id: "printful-white-preview", src: "https://files.cdn.printful.com/files/a1/a1_preview.png", alt: "", role: "main", colors: ["White"] },
      { id: "printful-black-preview", src: "https://files.cdn.printful.com/files/b2/b2_preview.png", alt: "", role: "gallery", colors: ["Black"] },
    ],
    [
      { id: "shopify-white-right", src: "https://cdn.shopify.com/s/files/1/water-bottle-white-17oz-right-6a.png", alt: "", role: "main", colors: ["White"] },
      { id: "shopify-white-front", src: "https://cdn.shopify.com/s/files/1/water-bottle-white-17oz-front-6a.png", alt: "", role: "gallery", colors: ["White"] },
      { id: "shopify-white-left", src: "https://cdn.shopify.com/s/files/1/water-bottle-white-17oz-left-6a.png", alt: "", role: "gallery", colors: ["White"] },
    ],
  );
  assert.deepEqual(images.map((image) => image.id), ["shopify-white-front", "printful-black-preview", "shopify-white-right", "shopify-white-left"]);
  assert.equal(images[0].role, "main");
});

test("brands are found in Printful catalog names when the brand field is empty", () => {
  assert.equal(inferManufacturer("Unisex Garment-Dyed Heavyweight T-Shirt | Comfort Colors 1717 (Black / S)"), "Comfort Colors");
  assert.equal(inferManufacturer("Unisex Staple T-Shirt | Bella+Canvas 3001"), "Bella + Canvas");
  assert.equal(inferManufacturer("Classic Dad Hat | Yupoong 6245CM"), "Yupoong");
  assert.equal(inferManufacturer("Wine glass"), undefined);
});
