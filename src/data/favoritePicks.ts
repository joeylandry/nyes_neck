/**
 * Hand-picked products for "Our Favorites" on the homepage and at the top of
 * the shop, listed by Shopify product ID in the order they appear. Copy IDs
 * from the /catalog-list page. While this list is empty, favorites are chosen
 * automatically by the rules in src/lib/favorites.ts.
 */
export const FAVORITE_PRODUCT_IDS: string[] = [
  // Arranged in rows of four so tops, hats, outerwear and drinkware alternate.
  "15405137330461", // Classic Spirit Tee
  "15420626960669", // Classic crewneck sweatshirt
  "15420370288925", // Classic Coastal Washed Cap
  "15420594487581", // Classic Men's Columbia Jacket

  "15420481503517", // Classic hoodie
  "15420651962653", // Classic Under Armour men's polo
  "10373027660061", // Retro crewneck sweatshirt
  "10397161750813", // Stemless wine glass

  "10388785791261", // Retro Columbia booney hat
  "15405152436509", // Classic embroidered hoodie
  "10388751745309", // adidas retro polo
  "15420575154461", // Classic sweatshirt

  "15420310421789", // Classic Men's Columbia fleece vest
  "10388681752861", // Retro quarter-zip sweatshirt
  "10388809122077", // Under Armour retro dad hat
  "15420508438813", // Classic heavyweight long-sleeve shirt

  "10388712292637", // Retro hoodie
  "15405188710685", // Classic beach towel
  "15420363276573", // Classic quarter zip pullover
  "10388738015517", // Retro Coastal Washed Cap

  "10386431279389", // Retro Men's Columbia Jacket
  "15420465479965", // Classic fleece crewneck sweatshirt
  "10316107022621", // Retro Under Armour men's polo
  "10337170555165", // Retro wine tumbler

  "10388803911965", // Under Armour retro hoodie
  "10373051285789", // Retro baseball cap
  "15420443951389", // Classic youth lightweight hoodie
];

/**
 * The color each product opens on (its "cover") everywhere in the shop, by
 * Shopify product ID. Use the color's name as it appears in the store.
 * Favorites left out here get a color picked automatically so the grid stays
 * varied; other products open on their main photo's color.
 */
export const FAVORITE_START_COLORS: Record<string, string> = {
  "15405137330461": "Navy", // Classic Spirit Tee
  "15420626960669": "Crimson", // Classic crewneck sweatshirt
  "15420370288925": "Blue Jean", // Classic Coastal Washed Cap
  "15420594487581": "Black", // Classic Men's Columbia Jacket
  "15420481503517": "Blue Spruce", // Classic hoodie
  "15420651962653": "Navy", // Classic Under Armour men's polo
  "10373027660061": "Blue Jean", // Retro crewneck sweatshirt
  "10388785791261": "Fossil", // Retro Columbia booney hat
  "15405152436509": "G. Dyed Black Rock", // Classic embroidered hoodie
  "10388751745309": "Grey One Heather", // adidas retro polo
  "15420575154461": "Crimson", // Classic sweatshirt
  "15420310421789": "Collegiate Navy", // Classic Men's Columbia fleece vest
  "10388681752861": "Crimson", // Retro quarter-zip sweatshirt
  "10388809122077": "White", // Under Armour retro dad hat
  "15420508438813": "Navy", // Classic heavyweight long-sleeve shirt
  "15420363276573": "Black", // Classic quarter zip pullover
  "10388738015517": "Sandstone", // Retro Coastal Washed Cap
  "10386431279389": "Collegiate Navy", // Retro Men's Columbia Jacket
  "15420465479965": "Blue Jean", // Classic fleece crewneck sweatshirt
  "10388712292637": "Blue Jean", // Retro hoodie
  "10316107022621": "Grey", // Retro Under Armour men's polo
};
