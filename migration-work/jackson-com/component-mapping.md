# Component Mapping — jackson.com → EDS blocks

**Source:** https://www.jackson.com/ (public site, no AEM author access provided)
**Fetch method:** headless Chromium via `playwright-cli` (plain WebFetch times out on this domain; browser-probe confirmed no bot protection, default config works)
**Pages analyzed:** 9 of 9 planned representative pages (product-detail page re-run completed)
**Target block sources:** `insurance_eds_demo/blocks` (6 blocks) + `../eds-block/blocks` (18 blocks, richer reference palette)

## Summary table

| # | Component (as seen on jackson.com) | Pages seen on | Matched block | Confidence | Notes |
|---|---|---|---|---|---|
| 1 | Global header: logo, primary nav, audience toggle, phone/share strip, sign-in | all 8 | `header` (local) | high→medium | Base nav matches, but real header also carries an audience-switch bar, phone/share widget, and (on financial-professional.html) is delivered as an AEM Experience Fragment. Needs header block extended, not a 1:1 port. |
| 2 | Breadcrumb trail | annuities, forms, faq, contact, who-we-are, news | — (gap) | gap | No palette block. Small; likely worth a lightweight new block or folding into page template rather than block-collection search. |
| 3 | Hero (heading + paragraph, CTA sometimes missing) | all 8, varying richness | `hero` (local) | medium | Real usage ranges from bare H1 (faq, who-we-are title) to heading+paragraph+list+CTA (financial-professional). Current local `hero` assumes heading+paragraph+CTA; several instances have no CTA — may need a no-CTA variant, or some instances are just default content, not a hero block at all. |
| 4 | **Tab-switching hero** (tablist driving a hero-scale panel) | home | — (gap) | gap | Neither `hero` nor `tabs` (eds-block) covers a tablist that swaps hero content. Needs a decision: extend hero, extend tabs, or new composite block. |
| 5 | Repeating grid: title+description(+CTA), no image | home ("resources" grids), annuities ("products"), who-we-are ("family of companies", "additional resources") | `cards` (local) | medium | Recurs on 4+ pages. Current local `cards` is defined as image/heading/description; these instances are frequently text-only or add a CTA link per card — confirm/extend before treating as a clean match. |
| 6 | Promo/teaser card (heading + text + single CTA, no repeating grid) | home, annuities, who-we-are, news | `teaser` (eds-block, not yet ported) | medium–high | Recurring single-item promo pattern, distinct from the grid above. Good port candidate. |
| 7 | Icon/label tile grid (no heading/description text, just icon+link) | annuities ("benefits"), financial-professional ("choose your firm type") | `cardsntt` (eds-block, not yet ported) or gap | medium | Lighter-weight than `cards`; cardsntt's icon/style-variant support is the closer fit, but should be visually confirmed. |
| 8 | Stat/counter row (big number + caption, e.g. "$338 billion" / "Total assets") | home | — (gap) | gap | No local or eds-block entry. Recommend checking Adobe Block Collection for a stats/counter block before building new. |
| 9 | **FAQ pattern: tabs (category) wrapping accordion (Q&A), in a 2-column grid, with dot-pagination** | faq | `tabs` + `accordion` (eds-block, not yet ported) | medium (composite gap) | Neither block alone models this; needs tabs-containing-accordion composition, plus 2-col layout and pagination behavior that don't exist in either block today. |
| 10 | 2–3 column text+image or text+list+CTA layout | home, financial-professional (×4, one with a style/gradient variant) | `columns` (local) | medium | Content richness (bulleted lists, 2 CTAs, background-gradient variant) exceeds a plain 2-column text block — confirm columns supports rich content per cell, and consider a style-variant mechanism like eds-block's teaser/cardsntt. |
| 11 | Contact form (name/email/topic/message + reCAPTCHA), gated by a radio-button "I am a…" selector | contact-us | `form` (eds-block, not yet ported) | medium, with a genuine gap | Field shape matches eds-block's JSON-driven form, but (a) the radio-driven branching selector in front of it and (b) the embedded reCAPTCHA iframe are not modeled by the palette. |
| 12 | **Nested contact-method directory** (Call/Mail/Fax/Reassure × legal entity × multiple table rows) | contact-us | — (gap), individual rows fit `table` (eds-block) | gap | Rows alone match `table`; the nested grouping (method → entity → rows, repeated 4×) has no single block. Candidate for a new "contact-directory" block or a documented columns+table composition. |
| 13 | Office/location list (clickable name+address, likely opens a map) | contact-us | `cards` (local) | medium | Static content fits cards; map-click interaction is not covered — check Block Collection for a location/map block if that interaction must be preserved. |
| 14 | **Faceted document search** (keyword + 4 dropdown filters) over a **sortable/paginated/selectable results grid** (385 results, bulk email action) | forms/forms.xhtml | — (gap); `search` (eds-block) and `table` (eds-block) each cover a slice | gap (most significant) | This is a document-library/data-grid pattern well beyond either `search` or `table` alone (sort, paginate, row-select, bulk action). Needs either a new interactive block or a Block Collection lookup for an equivalent pattern. |
| 15 | **Filterable press-release list** (year dropdown + date-sorted items linking to PDFs, possible lazy-loaded pagination) | news | — (gap) | gap | Dynamic listing, not a static cards grid. Also a candidate for the dynamic-listing/query-index pattern EDS supports for "pages that list other pages" — worth evaluating whether these are indexable pages vs. PDFs only. |
| 16 | Legal/regulatory disclosure text (paragraphs with footnote superscripts) | all 8 | — (no block needed) | n/a | Plain default content everywhere it appears; not a component. |
| 17 | Site footer (3–4 link columns, social icons, BrokerCheck badge, FDIC-style disclosure, address) | all 8 | `footer` (local) | high | Consistent high-confidence match everywhere, but content-richer than a minimal footer (compliance badge, multi-paragraph disclosure, address) — confirm the local footer block's authoring model holds all of this. |
| 18 | Cookie-consent overlay, feedback-widget button, reCAPTCHA iframe | all 9 | — (out of scope) | n/a | Third-party script-injected chrome (OneTrust/Qualtrics/reCAPTCHA), not authorable page content. Not part of the block palette. |
| 19 | Page-level tab shell (Overview / How it Works / Use the Tool) gating three full-length content areas, plus nested sub-tabs inside (product-literature by state, performance-by-term) | product detail | `tabs` (eds-block, not yet ported) | medium | Reinforces the tabs port from #9, but at page-shell scale with much heavier per-panel content and up to 3 levels of nesting — eds-block's tabs may need to support large/nested panels, not just short blurbs. |
| 20 | **Interactive charts** (index-return-by-year, performance-by-term negative/positive bars) rendered via canvas/SVG inside tab panels | product detail | — (gap) | gap | No palette entry covers data visualization. Chart internals weren't inspectable via the accessibility tree; flag for a screenshot-based follow-up if this pattern must be reproduced rather than replaced with a static table. |
| 21 | **Third-party interactive tool embedded via iframe** (state picker → scenario/rate builder) | product detail | `embed` (eds-block, not yet ported) — partial fit | gap | eds-block's `embed` targets video/social scripts, not general iframe tool embeds. Structurally closest but needs extension. |
| 22 | Dense legal/regulatory disclosure text with many inline citation links (index trademark/licensing disclaimers, prospectus links) | product detail (heaviest instance), recurs lighter elsewhere | — (no block, flagged as recurring) | n/a | Plain rich text everywhere else, but volume/repetition here is notable — worth a dedicated disclosure/legal-footnote block only if this exact pattern repeats across many product pages (product detail is the only page analyzed so far with this density). |
| 23 | Product-literature cards (title + description + 2-column resource-link list) nested inside per-state tabs | product detail | `cards` (local), nested in `tabs` (eds-block) | medium | Same "cards with a link list instead of a single CTA" variant seen in #5, compounded by living inside a nested tabs structure. |

## Gap list requiring a Phase 3 decision

Ranked roughly by how much new work each implies:

1. **Faceted document search + sortable/paginated results grid** (forms page) — largest gap, needs new interactive block or Block Collection lookup.
2. **Filterable press-release listing** (news page) — dynamic listing pattern; consider EDS query-index approach.
3. **Nested contact-method directory** (contact page) — composition gap, not a single missing primitive.
4. **Tab-driven hero** (home page) — composite gap between hero and tabs.
5. **FAQ tabs+accordion composite** with 2-column layout and pagination dots — port both blocks, then extend.
6. **Stat/counter row** (home page) — check Block Collection before building new.
7. **Radio-driven conditional form selector** (contact page) — extension to the `form` block.
8. **Breadcrumb** — small, likely a quick new block or template-level, not block-collection-worthy on its own.

## Blocks to port from eds-block (medium/high-confidence, no gap)

`teaser`, `cardsntt`, `tabs`, `accordion`, `form` — each recurs across 2+ pages with medium-or-better confidence and no unresolved structural gap once ported. Building-blocks + content-modeling should review each during Phase 3 for the UE `_<name>.json` model insurance_eds_demo expects (eds-block blocks don't have these yet).

## Outstanding

- Nav flyout/mega-menu content (all top-level nav items resolve to `href="#"` in the static DOM; flyout panels are populated on hover/click and weren't captured). Needed only if header authoring must reproduce flyout content exactly.
- Interactive chart internals (item #20) and the state-picker iframe tool (item #21) weren't visually inspected — accessibility-tree analysis only. Screenshot/DOM follow-up needed if these must be reproduced rather than simplified.
