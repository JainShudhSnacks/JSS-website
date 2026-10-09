# Jain Shudh Snacks website

A custom Hindi/English catalogue and owner admin panel for Jain Shudh Snacks, Indore. Customers browse the range and **call Mayank on +91 8982819979 to order**. There is no shopping bag, checkout, website order form or payment-provider integration.

The design pairs the supplied red logo with buttery yellow, deep green, oversized typography and clearly labelled illustrative food artwork. The homepage includes an interactive category shelf, a snack mood selector, quick product previews and gentle scroll effects. Visitors can pause the moving marquee; reduced-motion preferences are respected.

## Open the preview

Website: **http://127.0.0.1:3000**  
Owner studio: **http://127.0.0.1:3000/admin**

If the preview server is stopped, double-click **Start Preview.command** on this Mac. Keep its terminal open while reviewing. In the owner studio choose **Open local owner preview**. This option only works on the local development server and is disabled in production.

On another computer, install Node.js 24 and pnpm, then run from this folder:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Local catalogue edits are stored in `.local/jss.sqlite`; uploads are stored in `.local/images`. These folders are excluded from Git and the source ZIP.

## Included

- Responsive home, searchable catalogue, six categories and individual product pages.
- Category switching and snack recommendations use the current published catalogue, including owner edits. Product previews show the actual pack price and link directly to the product page or a phone call.
- 52 products transcribed from the supplied list, with known prices and units.
- A bilingual welcome popup asks visitors to choose English or Hindi; their choice is remembered and can be changed from the header.
- Call-to-order links throughout the catalogue, product pages and contact page.
- Information about Indore pickup, Porter delivery and nationwide shipping for namkeen and biscuits.
- Written shuddh practices, a factual 2022 business introduction and customer policies.
- Owner login, product creation/editing, image upload, multiple packs, draft/published/hidden/archived states, availability and featured products.
- Pack-specific sale prices with optional start/end dates in India time; expired offers return to regular prices.
- Editable order contact, pickup hours, address, announcements, genuine FSSAI/GST numbers and business-approved product-issue instructions.
- Signed owner sessions, origin checks and durable local or Supabase catalogue storage.
- Page metadata, sitemap and search-index controls for production versus previews.

The admin supports **one owner account**. Orders, payment arrangements, delivery charges and fulfilment are agreed directly with the business by phone. Old checkout and order-status URLs redirect to the contact page, and the previous order/payment APIs are disabled.

## GitHub and Vercel

For GitHub browser upload, open the clean `github-upload` folder and drag its contents into the upload area: `src`, `public`, `supabase`, `tests` and the root files. Keep the folders intact. Upload the extracted files rather than the ZIP itself. The source uses ordinary folder names; `next.config.mjs` preserves the public page and API URLs through rewrites.

1. Create a GitHub repository and upload this folder's contents. Include `src`, `public`, `supabase`, tests, `package.json`, `pnpm-lock.yaml`, configuration files and `.gitignore`. Exclude `node_modules`, `.next`, `.local` and real `.env` files.
2. Import the repository into Vercel. Choose **Next.js**. Include the supplied `vercel.json`, which explicitly selects Next.js even if a previous coming-soon deployment used **Other**. If this folder is nested inside your repository, select it as the **Root Directory**; otherwise use the repository root. Leave the output-directory override disabled.
3. Use Node.js **24.x**, the detected install command, and build command **pnpm build**. See [Vercel package managers](https://vercel.com/docs/package-managers) and [Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).
4. Set `SITE_URL` to the actual HTTPS website origin. You can deploy the seeded public catalogue without a database. To save catalogue changes through the hosted admin, complete the owner and storage setup below.

If an existing Vercel project shows `404 NOT_FOUND` after uploading the full website, open **Settings → Build and Deployment**, set **Framework Preset** to **Next.js**, save, then redeploy the latest commit. For `JainShudhSnacks/JSS-website`, `package.json` is at the repository root, so **Root Directory** should be empty. Keep the output-directory override disabled; do not select `public` or `dist`. Changing settings alone does not rebuild an existing deployment.

### Enable the hosted owner studio

Create a business-owned Supabase project and run **supabase/schema.sql** in its SQL editor. This creates the protected catalogue records table and the public product-image bucket. Add these environment variables in Vercel; secrets must stay server-only, without a `NEXT_PUBLIC_` prefix.

| Variable | Value |
|---|---|
| `ADMIN_EMAIL` | The owner's real email |
| `ADMIN_PASSWORD` | A strong password of at least 12 characters |
| `SESSION_SECRET` | A random secret of at least 32 characters |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only service-role key |
| `SITE_URL` | The actual HTTPS website origin, with no path |

Deploy and sign into `/admin` using the configured owner account. The local preview button is absent on the hosted site. The first database initialization seeds the catalogue once; subsequent deployments preserve owner edits. Without durable storage on Vercel, saving an item fails with a setup message instead of silently losing the change.

Local edits and uploads do not automatically migrate to Supabase. Enter them in the hosted admin or deliberately migrate them. Use separate storage and credentials for testing and production. No payment account, payment keys or webhook configuration is needed.

## Content to complete

Confirm the remaining pack quantities, full ingredients, dairy status, item-specific shelf life and storage instructions with the business. The catalogue labels missing details and invites customers to discuss them by phone. Add real product photos, pickup hours, genuine registration numbers and the approved product-issue policy when available. Generated illustrations and unknown certification details are not represented as verified business evidence.

## Validation

```sh
pnpm test
pnpm build
```

Seven tests cover signed sessions, origin checks, India-time offer boundaries, invalid discounts and persistent local catalogue saves. The production build passes. Browser checks cover desktop/mobile layouts, English/Hindi, catalogue search, keyboard category selection, quick previews, recommendations, the language popup and call-to-order links. Hosted Supabase storage still needs verification with the business's own account.

See **OWNER_GUIDE.md** for daily use and **ASSETS.md** for artwork provenance.
