import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/* Text cells of an item row, in `card` model order. The image is the
   first field, so it is pulled out before these are matched up by position. */
const CARD_FIELDS = ['title', 'subtitle', 'description', 'links'];

/* Card styles the block can render, matching jackson.com's card types.
   `product-card` is the default and so carries no class of its own. */
const CARD_STYLES = ['icon-feature', 'feature-card'];

/**
 * Returns the authored markup of a cell.
 * Plain-text fields pass `unwrapParagraph` so the lone wrapping `<p>` is
 * dropped while authored `<br>` and inline spans survive; rich text keeps
 * its paragraphs.
 * @param {Element} cell A block cell
 * @param {boolean} [unwrapParagraph] Whether to unwrap a lone wrapping paragraph
 * @returns {string} The cell's inner markup, or an empty string
 */
function cellHtml(cell, unwrapParagraph = false) {
  if (!cell) return '';
  const only = cell.children.length === 1 ? cell.firstElementChild : null;
  const source = unwrapParagraph && only?.tagName === 'P' ? only : cell;
  return source.innerHTML.trim();
}

/**
 * Builds the section header from the block-level rows (title, description).
 * @param {Element[]} headerRows Leading single-cell rows
 * @returns {Element|null} The header element, or null when nothing was authored
 */
function buildHeader(headerRows) {
  const header = document.createElement('div');
  header.className = 'cards-header';

  headerRows.forEach((row, index) => {
    const cell = row.firstElementChild;
    const html = cell?.innerHTML.trim();
    if (!html) return;

    const authoredHeading = cell.querySelector('h1, h2, h3, h4, h5, h6');
    if (index === 0) {
      const heading = document.createElement('h2');
      heading.innerHTML = authoredHeading ? authoredHeading.innerHTML : html;
      moveInstrumentation(row, heading);
      header.append(heading);
      return;
    }

    const description = document.createElement('div');
    description.className = 'cards-description';
    description.innerHTML = html;
    moveInstrumentation(row, description);
    header.append(description);
  });

  return header.childElementCount ? header : null;
}

/**
 * Splits an item row into its media cell and its named text cells.
 * The media cell is the one holding the image; when the image was left empty
 * the first cell is still its (empty) slot, so it is dropped either way to
 * keep the remaining cells aligned with `CARD_FIELDS`.
 * @param {Element} row The item row
 * @returns {{media: Element|null, fields: Object<string, Element>}} Row parts
 */
function readCard(row) {
  const cells = [...row.children];
  const mediaIndex = cells.findIndex((cell) => cell.querySelector('img, svg, .icon'));
  const mediaCell = mediaIndex === -1 ? cells.shift() : cells.splice(mediaIndex, 1)[0];

  // Content authored before title/subtitle/description existed has a single
  // text cell, which held the links.
  const names = cells.length > 1 ? CARD_FIELDS : ['links'];
  const fields = {};
  names.forEach((name, index) => {
    if (cells[index]) fields[name] = cells[index];
  });

  // The cell is handed over whatever it holds; `buildMedia` decides whether
  // there is anything renderable in it.
  return { media: mediaCell || null, fields };
}

/**
 * Builds the media slot of a card. Photographic images are re-rendered as
 * optimized pictures; icons and inline SVGs are passed through so the block
 * can also be used for icon-led cards.
 * @param {Element} cell The media cell
 * @param {string} style The card style, which decides whether the artwork is
 * always treated as an icon
 * @returns {Element|null} The media wrapper, or null when nothing was authored
 */
function buildMedia(cell, style) {
  const wrap = document.createElement('div');
  wrap.className = 'card-media';

  const iconFeature = style === 'icon-feature';
  const img = cell.querySelector('img');
  const icon = cell.querySelector('.icon, svg');

  if (img && !iconFeature && !img.src.endsWith('.svg')) {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    wrap.append(optimizedPic);
  } else if (img || icon) {
    wrap.classList.add('card-media-icon');
    wrap.append(img?.closest('picture') || img || icon);
  } else {
    // Icon feature cards may name one of the SVGs shipped in `/icons` instead
    // of referencing an asset. Named icons are drawn as a CSS mask so they take
    // the card's text colour on both light and dark themes.
    const name = cell.textContent.trim().toLowerCase();
    if (!iconFeature || !/^[a-z0-9-]+$/.test(name)) return null;

    const glyph = document.createElement('span');
    glyph.className = 'card-media-glyph';
    glyph.style.setProperty('--card-icon', `url("/icons/${name}.svg")`);
    glyph.setAttribute('aria-hidden', 'true');
    wrap.classList.add('card-media-icon');
    wrap.append(glyph);
  }

  return wrap;
}

/**
 * Builds a single card from an item row.
 * In the product card variant the subtitle renders above the title as a
 * category eyebrow, matching the jackson.com product card; the icon feature
 * variant renders an icon, copy, and a pill call to action; the feature card
 * variant renders a photo over a dark tile of copy.
 * @param {Element} row The item row
 * @param {string} style The card style
 * @returns {Element} The card list item
 */
function buildCard(row, style) {
  const li = document.createElement('li');
  li.className = 'card';
  moveInstrumentation(row, li);

  const cardBlock = document.createElement('div');
  cardBlock.className = 'card-block';

  const { media, fields } = readCard(row);
  if (media) {
    const mediaWrap = buildMedia(media, style);
    if (mediaWrap) cardBlock.append(mediaWrap);
  }

  const body = document.createElement('div');
  body.className = 'card-body';

  const subtitleHtml = cellHtml(fields.subtitle, true);
  if (subtitleHtml) {
    const subtitle = document.createElement('p');
    subtitle.className = 'card-subtitle';
    subtitle.innerHTML = subtitleHtml;
    moveInstrumentation(fields.subtitle, subtitle);
    body.append(subtitle);
  }

  const titleHtml = cellHtml(fields.title, true);
  if (titleHtml) {
    const title = document.createElement('h3');
    title.className = 'card-title';
    title.innerHTML = titleHtml;
    moveInstrumentation(fields.title, title);
    body.append(title);
  }

  const descriptionHtml = cellHtml(fields.description);
  if (descriptionHtml) {
    const description = document.createElement('div');
    description.className = 'card-description';
    description.innerHTML = descriptionHtml;
    moveInstrumentation(fields.description, description);
    body.append(description);
  }

  const linksWrap = document.createElement('div');
  linksWrap.className = 'card-links';
  fields.links?.querySelectorAll('a').forEach((link) => {
    const linkWrap = document.createElement('p');
    linkWrap.className = 'card-link';
    if (style === 'icon-feature') {
      // Icon feature calls to action are pill buttons. `decorateButtons` only
      // buttonizes links the author emphasised, so the classes are ensured here
      // and an unemphasised link falls back to the primary style.
      link.classList.add('button');
      if (!link.classList.contains('secondary') && !link.classList.contains('accent')) {
        link.classList.add('primary');
      }
    } else {
      // The other calls to action are plain forward links, not pill buttons, so
      // the classes `decorateButtons` added upstream are dropped. The light
      // variant is the one that reads against the feature card's dark tile.
      link.classList.remove('button', 'primary', 'secondary', 'accent');
      link.classList.add(style === 'feature-card' ? 'forward-link-light' : 'forward-link-dark');
    }
    linkWrap.append(link);
    linksWrap.append(linkWrap);
  });
  if (linksWrap.childElementCount) body.append(linksWrap);

  if (body.childElementCount) cardBlock.append(body);

  li.append(cardBlock);
  return li;
}

/**
 * Decorate cards block — Jackson card grid with section heading.
 * Block-level rows (title, description) render as the section header; item rows,
 * which expose one cell per card field, render as cards in the style the author
 * picked.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const style = CARD_STYLES.find((name) => block.classList.contains(name)) || 'product-card';

  // Item rows expose a cell per card field; block-level fields expose one.
  const firstCardIndex = rows.findIndex((row) => row.children.length >= 2);
  const hasCards = firstCardIndex !== -1;
  const headerRows = hasCards ? rows.slice(0, firstCardIndex) : rows;
  const cardRows = hasCards ? rows.slice(firstCardIndex) : [];

  const wrapper = document.createElement('div');
  wrapper.className = 'cards-inner';

  const header = buildHeader(headerRows);
  if (header) wrapper.append(header);

  if (cardRows.length) {
    const grid = document.createElement('ul');
    grid.className = 'cards-cards';
    cardRows.forEach((row) => grid.append(buildCard(row, style)));
    wrapper.append(grid);
  }

  block.replaceChildren(wrapper);
}
