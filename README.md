# NYES NECK

A premium, responsive starter website for NYES NECK, a Cape Cod lifestyle apparel brand rooted in North Falmouth and the Upper Cape.

## Install and run

Requirements: Node.js 20.9 or newer and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production

```bash
npm run lint
npm run build
npm start
```

## Project structure

```text
src/
  app/                 App Router pages, layouts, metadata, and global CSS
  components/
    brand/             Replaceable text wordmark
    contact/           Contact form presentation
    home/              Hero gallery and crossfade hook
    layout/            Header, mobile drawer, and footer
    shop/              Product cards, grid, and purchase boundary
    ui/                Shared button and page header
  data/                Local hero and product records
  lib/                 Product data-access functions and formatting
  types/               Central product contracts
public/images/         Local hero and product placeholders
```

## Replacing assets

### Logo

The current logo is text-based. Replace the implementation in `src/components/brand/Wordmark.tsx` with `next/image` or an inline SVG while preserving the component props (`tone` and `className`). All placements will update together.

### Hero photography

Add optimized local images to `public/images/hero/`, then edit `src/data/hero-images.ts`. Each entry supports separate `desktopPosition` and `mobilePosition` values. The included WebP photographs are original generated placeholders; PNG source copies are also included.

### Product photography and products

Products, product types, collections, featured category, prices, variants, availability, and photography are managed in Sanity. Product-type and collection documents automatically become shop tiles and each document owns its tile image and 4:3 crop. Local records in `src/data/products.ts` are used only when Sanity is not configured; a configured storefront lists only published Sanity product types and collections.

## Canonical site URL

`NEXT_PUBLIC_SITE_URL` sets the origin used for canonical links, Open Graph
tags, `robots.txt`, and `sitemap.xml`. On Vercel the deployment URL is used
automatically; locally it falls back to `http://localhost:3000`.

## Sanity setup

1. Copy `.env.example` to `.env.local` and enter the Sanity project ID and dataset.
2. Add `http://localhost:3000` as a CORS origin in the Sanity project settings.
3. Run `npm run dev` and open `/studio`, or run `npm run studio` for the standalone Studio.
4. Create product types and collections and upload/crop the tile image on each entry, then configure the featured category in the singleton **Shop page** document.
5. Add products. Each product requires exactly one Main image, permits one Hover image, and accepts any number of Gallery images.

Product media uses a 4:5 crop preview. Shop tiles use a 4:3 crop preview. Sanity stores the selected crop and hotspot; the storefront image pipeline applies both automatically.

## Printful product display

Set `PRINTFUL_API_TOKEN` to show synced Printful products in the storefront. When this token is present, Printful becomes the source for product names, mockup image thumbnails, prices, variants, sizes, colors, and availability. Sanity still controls shop layout, product type tiles, collection tiles, and the featured category.

Optional settings:

```bash
PRINTFUL_STORE_ID=123456
PRINTFUL_REVALIDATE_SECONDS=300
PRINTFUL_DEFAULT_COLLECTION_SLUG=nyes-neck
PRINTFUL_DEFAULT_PRODUCT_TYPE_SLUG=t-shirts
PRINTFUL_PRODUCT_OVERRIDES='{"123456789":{"category":"hoodies","collection":"old-silver","featured":true}}'
```

`PRINTFUL_PRODUCT_OVERRIDES` is keyed by Printful sync product ID, external ID, or exact product name. Use it when a product should appear in a specific site category or collection. Ignored Printful products are hidden from the storefront.

## Checkout and bulk pricing

Adding to cart is available on every purchasable product, including one-size
goods such as glasses, hats, and decals: a product with a single size (or none
at all) never asks the customer to choose one. The cart hands the whole order
to Shopify as a cart permalink, so Shopify remains the source of truth for
prices, taxes, shipping, and payment. `SHOPIFY_STORE_DOMAIN` must be set for
checkout to be reachable.

Volume pricing is defined in `src/lib/bulkPricing.ts` and applies to the order
as a whole — mixed items count together:

| Items in the order | Discount |
| --- | --- |
| 3 or more | 5% |
| 6 (half dozen) | 10% |
| 12 (dozen) | 15% |

Product pages offer matching quantity presets (one-size goods get Single/Half
dozen/Dozen; sized apparel also gets a 3-pack), and the cart shows the saving
before checkout.

**The storefront only displays the discount — Shopify has to apply it.** Set it
up once in the Shopify admin, either way:

1. **Automatic discounts (recommended).** Discounts → Create discount →
   Amount off order → Automatic. Set the percentage and a minimum quantity of
   items, once per tier (3 / 6 / 12). Nothing else is needed; Shopify applies
   the tier at checkout for every customer.
2. **Discount codes.** Create the same three discounts as codes, then list them
   in `NEXT_PUBLIC_SHOPIFY_BULK_DISCOUNT_CODES` as
   `3:CODE3,6:CODE6,12:CODE12`. The cart adds the best matching code to the
   checkout link.

Until the Shopify side exists, set `NEXT_PUBLIC_BULK_DISCOUNTS=off` so the
storefront stops advertising a saving the checkout will not honor. Tiers,
percentages, and per-category presets are edited in `src/lib/bulkPricing.ts`;
keep them in step with the discounts configured in Shopify.

## Contact form

The contact form posts to `/api/contact`, which forwards submissions to Formspree. Set `CONTACT_FORM_ENDPOINT` in `.env.local` and in production using the endpoint from the Formspree dashboard, for example:

```bash
CONTACT_FORM_ENDPOINT=https://formspree.io/f/your-form-id
```

`FORMSPREE_ENDPOINT` is still supported as a legacy alias.

## Cart and checkout structure

`src/components/shop/PurchaseAction.tsx` is the cart boundary and receives stable product and variant IDs. Cart state is provider-neutral (`src/components/shop/CartProvider.tsx`, persisted in `localStorage`). Provider-specific checkout code lives in `src/lib/commerce/` — `shopifyCheckout.ts` builds the checkout permalink — and never in product cards.
