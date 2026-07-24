import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { sanityWriteClient } from "@/sanity/writeClient";

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function makeSkuPart(value: string) {
  return value
    .toUpperCase()
    .trim()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(request: NextRequest) {
  const providedSecret = request.headers.get("x-store-manager-secret");
  const expectedSecret = process.env.STORE_MANAGER_SECRET;

  if (!expectedSecret || providedSecret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;

    const title =
      typeof body.title === "string" ? body.title.trim() : "";

    const shortDescription =
      typeof body.shortDescription === "string"
        ? body.shortDescription.trim()
        : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    const productType =
      typeof body.productType === "string" ? body.productType.trim() : "";

    const collection =
      typeof body.collection === "string" ? body.collection.trim() : "";

    const price =
      typeof body.price === "number" ? body.price : undefined;

    const sizes: string[] = Array.isArray(body.sizes)
      ? body.sizes.filter(
          (size: unknown): size is string =>
            typeof size === "string" && size.trim().length > 0,
        )
      : [];

    const colors: string[] = Array.isArray(body.colors)
      ? body.colors.filter(
          (color: unknown): color is string =>
            typeof color === "string" && color.trim().length > 0,
        )
      : [];

    if (
      !title ||
      !shortDescription ||
      !description ||
      !productType ||
      !collection
    ) {
      return NextResponse.json(
        {
          error:
            "title, shortDescription, description, productType, and collection are required",
        },
        { status: 400 },
      );
    }

    const productSlug = makeSlug(title);
    const productTypeSlug = makeSlug(productType);
    const collectionSlug = makeSlug(collection);

    const productTypeId = await sanityWriteClient.fetch<string | null>(
      `*[
        _type == "productType" &&
        (slug.current == $slug || title == $title)
      ][0]._id`,
      {
        slug: productTypeSlug,
        title: productType,
      },
    );

    if (!productTypeId) {
      return NextResponse.json(
        {
          error: `Product type "${productType}" was not found in Sanity`,
        },
        { status: 400 },
      );
    }

    const collectionId = await sanityWriteClient.fetch<string | null>(
      `*[
        _type == "collection" &&
        (slug.current == $slug || title == $title)
      ][0]._id`,
      {
        slug: collectionSlug,
        title: collection,
      },
    );

    if (!collectionId) {
      return NextResponse.json(
        {
          error: `Collection "${collection}" was not found in Sanity`,
        },
        { status: 400 },
      );
    }

    const normalizedSizes = sizes.map((size) => size.trim());
    const normalizedColors = colors.map((color) => color.trim());

    const variantSizes =
      normalizedSizes.length > 0 ? normalizedSizes : ["One Size"];

    const variantColors =
      normalizedColors.length > 0 ? normalizedColors : ["Default"];

    const variants = variantSizes.flatMap((size) =>
      variantColors.map((color) => ({
        _type: "productVariant",
        _key: randomUUID(),
        sku: [
          makeSkuPart(title),
          makeSkuPart(color),
          makeSkuPart(size),
        ].join("-"),
        size,
        color,
        available: false,
      })),
    );

    const document = {
      _id: `drafts.${randomUUID()}`,
      _type: "product",
      title,
      slug: {
        _type: "slug",
        current: productSlug,
      },
      shortDescription,
      description,
      price,
      currency: "USD",
      available: false,
      featured: false,
      productType: {
        _type: "reference",
        _ref: productTypeId,
      },
      collections: [
        {
          _type: "reference",
          _key: randomUUID(),
          _ref: collectionId,
        },
      ],
      sizes: normalizedSizes,
      colors: normalizedColors,
      variants,
    };

    const product = await sanityWriteClient.create(document);

    return NextResponse.json(
      {
        success: true,
        message: "Complete product draft created in Sanity",
        productId: product._id,
        title: product.title,
        variantCount: variants.length,
        note: "Add at least one Main product image before publishing.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Store manager error:", error);

    return NextResponse.json(
      { error: "Could not create the Sanity product draft" },
      { status: 500 },
    );
  }
}
