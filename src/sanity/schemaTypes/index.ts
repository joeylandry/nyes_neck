import { collection } from "./collection";
import { product } from "./product";
import { productImage } from "./productImage";
import { productType } from "./productType";
import { productVariant } from "./productVariant";
import { shopSettings } from "./shopSettings";

export const schemaTypes = [
  product,
  productType,
  collection,
  shopSettings,
  productImage,
  productVariant,
];
