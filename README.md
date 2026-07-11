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

## Sanity setup

1. Copy `.env.example` to `.env.local` and enter the Sanity project ID and dataset.
2. Add `http://localhost:3000` as a CORS origin in the Sanity project settings.
3. Run `npm run dev` and open `/studio`, or run `npm run studio` for the standalone Studio.
4. Create product types and collections and upload/crop the tile image on each entry, then configure the featured category in the singleton **Shop page** document.
5. Add products. Each product requires exactly one Main image, permits one Hover image, and accepts any number of Gallery images.

Product media uses a 4:5 crop preview. Shop tiles use a 4:3 crop preview. Sanity stores the selected crop and hotspot; the storefront image pipeline applies both automatically.

## Contact form

The contact form posts to `/api/contact`, which forwards submissions to Formspree. Set `CONTACT_FORM_ENDPOINT` in `.env.local` and in production using the endpoint from the Formspree dashboard, for example:

```bash
CONTACT_FORM_ENDPOINT=https://formspree.io/f/your-form-id
```

`FORMSPREE_ENDPOINT` is still supported as a legacy alias.

## Future cart and checkout

`src/components/shop/PurchaseAction.tsx` is the future cart integration boundary. It already receives stable product and variant IDs, but is intentionally disabled. Add provider-neutral cart state near the root layout only after a commerce provider is selected. Provider-specific checkout and order-confirmation code should live in a dedicated `src/lib/commerce/` area and route handlers or server actions, not in product cards.
