# Artwork and brand assets

The supplied JSS logo is used with its original visual content. Food illustrations are generated concept artwork, labelled as illustrative in the shop. They do not depict the actual products, facility, washing/drying method or packaging.

Generation mode: built-in image generation. The creative directions below are condensed descriptions of the prompts used.

| Asset | Creative direction | Purpose |
|---|---|---|
| `public/images/hero-food.png` | Warm ivory editorial still life: a cream bowl of golden sev/gathiya, a small red bowl of banana chips, stacked khakhra and atta biscuits with soft linen. Gentle daylight, carefully composed food textures, no people, text or invented branding. | Original hero and sharing-image concept |
| `public/images/hero-cutout.png` | Edit the hero arrangement to remove the background while preserving bowls, food, linen, materials and natural contact shadows. Transparent background, unchanged composition. | Main homepage/about illustration |
| `public/images/categories.png` | A square contact sheet, exactly three columns by two rows, with six consistent ivory food arrangements: namkeen; banana chips; biscuits/bread; papad/khakhra; peanuts/snacks; flour/spices. No labels, people or claims. | Six category compositions displayed through CSS background positioning |
| `public/images/logo.png` | User-supplied original logo; no generated redesign. | Brand source |

Matching `.webp` files are delivery copies compressed for browser performance; the logo delivery copy is sized to 256 px. Original PNGs are preserved. The website uses the WebP copies. Generated hero and category assets come from the conversation's built-in image generation tool; no scraped product photographs were used.

Saved originals in the project's `public/images/` directory are portable with the source ZIP. The generated-image cache originals also reside in `/Users/admin/.codex/generated_images/01a11ffe-cc98-7102-aff2-5e31befa3df2/`.

Generated imagery should be replaced or supplemented with owner-supplied photos before relying on it as an exact depiction of a particular product. Real product photos can be uploaded through the admin panel. The original user logo remains at `/Users/admin/Downloads/Feelance/JSS/Logo jss.png`.


## Individual product illustrations

All 52 supplied products have separate square illustrations in `public/images/products/<product-id>.webp`, generated with the built-in image generation tool. Full prompts are saved in `public/images/products/prompts.json`. The consistent direction uses warm ivory ceramic bowls or plates, a cream background, soft daylight and realistic food textures, with no invented packaging, labels or certifications. These are general visual interpretations of the named foods; they do not verify a recipe, niyam suitability or actual product appearance.

Original generated PNGs are preserved in the neighbouring `artwork/products/originals/` folder outside the deployable website. Browser copies are 720 px WebP images. Product-specific defaults work for both previously stored catalogue records and new deployments. Any image saved by the owner takes priority, so adding illustrations does not replace uploaded photos or modify the database. Category artwork remains for category displays and new items without an uploaded image.

Visual naming references for the less familiar foods were checked against [420 Namkeen's moong mogar range](https://www.snacksandnamkeen.com/moong-daal-namkeen.html) and [Muskans Mangodi](https://www.mangodi.com/). These references informed general shape only; no photographs or recipes from those businesses were copied.
