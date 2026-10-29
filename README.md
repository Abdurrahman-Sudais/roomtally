# Roomtally

**Know what you have before you move.**

Roomtally is a furniture inventory and reuse-planning platform for office relocations, facilities teams, and commercial furniture refurbishers. This repository holds the marketing site and an interactive product demo, built with Vite, React, TypeScript, Tailwind CSS v4, React Router, and Lucide React.

- Domain: roomtally.top
- Founder: Tunde Ogunleye, tunde@roomtally.top

## Setup

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build
```

Requires Node 18+. You don't need any API keys or a backend.

## Routes

| Path | Page |
| --- | --- |
| `/` | Home: hero, dashboard mockup, sections A–G |
| `/product`, `/inventory-management`, `/relocation-planning`, `/how-it-works`, `/pricing`, `/about`, `/contact` | Marketing pages |
| `/inventory` | Demo workspace overview for Meridian House |
| `/inventory/properties` · `/rooms` · `/items` · `/duplicates` · `/plan` · `/reports` · `/settings` | Demo workspace sections |

The app is a single-page app. `public/_redirects` (Netlify) and `vercel.json` route every path to `index.html`.

## Demo functionality

- **Furniture inventory** (`/inventory/items`): search; filter by property, room, type, condition, review status, and action (filters are kept in the URL); edit actions inline; one-click quantity confirmation; a side panel to add, edit, or remove records, with location, quantity, condition, dimensions, action notes, and photo references; CSV export of the filtered rows.
- **Duplicate review** (`/inventory/duplicates`): three observations of one sit-stand desk, shown side by side. You can confirm them as the same item (records merge and the quantity becomes 1), keep them separate (each is confirmed with quantity 1), or mark them for manual inspection. Each decision can be undone.
- **Relocation plan** (`/inventory/plan`): summary cards and a board of action columns. Move cards by dragging or with the action menu, and add notes in a modal. By default the board shows only confirmed and inspection items.
- **Rooms**: a clickable schematic floor plan and a room table, with add and edit room.
- **Reports**: five CSV exports and summary tables.
- **Settings**: organisation name, default dimension unit, and "Reset demo data".
- **Saving edits**: everything is stored in `localStorage` under the key `roomtally.demo.v1`.

## Simulated integrations and data boundaries

- All data comes from sample records in `src/data/seed.ts`. Meridian House and Calder Yard Annex are fictional.
- The proposed duplicate matches are pre-written sample data and are labelled as simulated. The demo does no image matching or AI analysis.
- Dimensions are only ever entered, imported, or measured on site, always with explicit units. Nothing is estimated from photographs.
- Condition is recorded by the reviewer. The app never determines a resale value.
- Photograph references are placeholder thumbnails. Editorial photos load from Unsplash, with a fallback if they fail.
- The contact form validates on the client and does not transmit data. It offers a pre-filled `mailto:` link instead.

## Configuration

- **Pricing**: `src/config/pricing.ts` holds the tiers, prices, units, features, CTAs, currency symbol, and annual discount.
- **Theme**: design tokens live in `src/index.css` (`@theme`).
- **SEO**: base metadata and JSON-LD are in `index.html`, and each route sets its own title, description, and canonical URL with `useSeo`. `robots.txt` and `sitemap.xml` are in `public/`.
