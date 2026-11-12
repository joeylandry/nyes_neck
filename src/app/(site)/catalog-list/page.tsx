import type { Metadata } from "next";
import { CatalogPicker, type CatalogRow } from "./CatalogPicker";
import { FrontPhotoPicker, type FrontPhotoRow } from "./FrontPhotoPicker";
import { getFavoriteProducts, productStyle } from "@/lib/favorites";
import { productDetails } from "@/data/productDetails";
import { getProducts } from "@/lib/products";
import { imageFileName, isPersonPhoto } from "@/lib/productImages";

// An unlinked working page for choosing "Our Favorites". Kept out of search.
export const metadata: Metadata = {
  title: "Catalog list",
  robots: { index: false, follow: false },
};

export default async function CatalogListPage() {
  const products = await getProducts();
  const current = new Set(getFavoriteProducts(products).map((product) => product.id));
  const rows: CatalogRow[] = products.map((product) => {
    const details = productDetails[product.externalId ?? product.id];
    const mainImage = product.images.find((image) => image.role === "main") ?? product.images[0];
    return {
    id: product.externalId ?? product.id,
    name: product.name,
    image: mainImage?.src ?? "",
    type: product.categoryLabel,
    brand: details?.brand ?? product.brand ?? "",
    model: details?.model ?? product.model ?? "",
    decoration: product.decoration ?? "",
    style: productStyle(product) ?? "",
    favorite: current.has(product.id),
    };
  });

  // The first photo of each color is the one its card and product page open on.
  const frontPhotos: FrontPhotoRow[] = products.flatMap((product) => {
    const colors = product.colors.length ? product.colors : [""];
    return colors.flatMap((color) => {
      const front = color ? product.images.find((image) => image.colors?.includes(color)) : product.images[0];
      if (!front || front.src.startsWith("/")) return [];
      return [{
        key: `${product.id}-${color}-${front.id}`,
        product: product.name,
        color,
        image: front.src,
        fileName: imageFileName(front.src),
        personPhoto: isPersonPhoto(front),
      }];
    });
  });

  return (
    <div className="mx-auto max-w-6xl px-3 py-10 md:px-6 md:py-14">
      <h1 className="font-ui text-3xl font-semibold tracking-[-0.04em] md:text-5xl">Catalog list</h1>
      <p className="mt-3 max-w-2xl text-black/65">
        Every product on the site. Tick the ones for Our Favorites (today&apos;s picks are pre-ticked), then use
        “Copy selected” and send the list over.
      </p>
      <CatalogPicker rows={rows} />

      <h2 id="front-photos" className="font-ui mt-16 text-2xl font-semibold tracking-[-0.03em] md:text-3xl">Front photos</h2>
      <p className="mt-3 max-w-2xl text-black/65">
        The photo each product and color opens on. Photos of people are moved to the back of the gallery
        automatically when their file name gives them away. Tick any front photo that still shows a person, then
        use “Copy ticked” and send the list over.
      </p>
      <FrontPhotoPicker rows={frontPhotos} />
    </div>
  );
}
