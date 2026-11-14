// Shopify `/products.json` shape for the Classic Under Armour hoodie. The five
// hidden SKUs are the real ones; the other SKUs are fixture placeholders. In
// this fixture Shopify still reports the hidden variants as for sale (they
// must disappear regardless) and marks every other size except Black / S as
// sold out.
const rows = [
  ["Black", "S", "fixture_black_s", true],
  ["Black", "M", "fixture_black_m", false],
  ["Black", "L", "7715585_19721", true],
  ["Black", "XL", "fixture_black_xl", false],
  ["Black", "2XL", "7715585_19731", true],
  ["Navy", "S", "7715585_19713", true],
  ["Navy", "M", "fixture_navy_m", false],
  ["Navy", "L", "7715585_19723", true],
  ["Navy", "XL", "fixture_navy_xl", false],
  ["Navy", "2XL", "7715585_19733", true],
];

export const classicUaHoodie = {
  id: 15420252913949,
  title: "Classic Under Armour hoodie",
  handle: "classic-under-armour-hoodie",
  body_html: "<p>Under Armour hoodie.</p>",
  product_type: "Hoodies",
  options: [{ name: "Color" }, { name: "Size" }],
  images: [
    { id: 1, src: "https://cdn.shopify.com/s/files/1/ua-hoodie-black-front-1.png", variant_ids: [] },
    { id: 2, src: "https://cdn.shopify.com/s/files/1/ua-hoodie-navy-front-1.png", variant_ids: [] },
  ],
  variants: rows.map(([color, size, sku, available], index) => ({
    id: 60000000000001 + index,
    sku,
    title: `${color} / ${size}`,
    price: "65.00",
    option1: color,
    option2: size,
    available,
  })),
};

export const shopCategories = [
  { slug: "hoodies", value: "hoodies", label: "Hoodies", kind: "product-type", description: "" },
  { slug: "nyes-neck-collection", value: "nyes-neck", label: "Nyes Neck", kind: "collection", description: "" },
];
