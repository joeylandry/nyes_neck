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

Replace `public/images/products/product-placeholder.svg` and update image paths in `src/data/products.ts`. Final product names, copy, variants, availability, and integer-cent prices also live in that file for this starter phase.

## Replacing local products with Sanity

The pages do not import the raw product array. They call the async functions in `src/lib/products.ts`. Keep the centralized types in `src/types/product.ts`, create Sanity schemas and queries, then replace the bodies of `getProducts`, `getFeaturedProducts`, and `getProductBySlug`.

Likely schemas include Product, Product Variant, Category or Collection, Product Image, Featured Product Ordering, Availability, Product Copy, and SEO Metadata. Add Sanity image mapping at the data boundary so visual components continue receiving the existing `ProductImage` shape.

## Future cart and checkout

`src/components/shop/PurchaseAction.tsx` is the future cart integration boundary. It already receives stable product and variant IDs, but is intentionally disabled. Add provider-neutral cart state near the root layout only after a commerce provider is selected. Provider-specific checkout and order-confirmation code should live in a dedicated `src/lib/commerce/` area and route handlers or server actions, not in product cards.

The contact form in `src/components/contact/ContactForm.tsx` is also intentionally non-submitting until a destination or form provider is selected.
