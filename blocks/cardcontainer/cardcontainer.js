import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/* Text cells of an item row, in `productcard` model order. The image is the
   first field, so it is pulled out before these are matched up by position. */
const CARD_FIELDS = ['title', 'subtitle', 'description', 'links'];

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
  header.className = 'cardcontainer-header';

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
    description.className = 'cardcontainer-description';
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

  return { media: mediaCell?.querySelector('img, svg, .icon') ? mediaCell : null, fields };
}

/**
 * Builds the media slot of a card. Photographic images are re-rendered as
 * optimized pictures; icons and inline SVGs are passed through so the block
 * can also be used for icon-led cards.
 * @param {Element} cell The media cell
 * @returns {Element|null} The media wrapper, or null when nothing was authored
 */
function buildMedia(cell) {
  const wrap = document.createElement('div');
  wrap.className = 'productcard-media';

  const img = cell.querySelector('img');
  const icon = cell.querySelector('.icon, svg');

  if (img && !img.src.endsWith('.svg')) {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    wrap.append(optimizedPic);
  } else if (img || icon) {
    wrap.classList.add('productcard-media-icon');
    wrap.append(img?.closest('picture') || img || icon);
  } else {
    return null;
  }

  return wrap;
}

/**
 * Builds a single product card from an item row.
 * The subtitle renders above the title as a category eyebrow, matching the
 * jackson.com product card.
 * @param {Element} row The item row
 * @returns {Element} The card list item
 */
function buildCard(row) {
  const li = document.createElement('li');
  li.className = 'productcard';
  moveInstrumentation(row, li);

  const cardBlock = document.createElement('div');
  cardBlock.className = 'productcard-block';

  const { media, fields } = readCard(row);
  if (media) {
    const mediaWrap = buildMedia(media);
    if (mediaWrap) cardBlock.append(mediaWrap);
  }

  const body = document.createElement('div');
  body.className = 'productcard-body';

  const subtitleHtml = cellHtml(fields.subtitle, true);
  if (subtitleHtml) {
    const subtitle = document.createElement('p');
    subtitle.className = 'productcard-subtitle';
    subtitle.innerHTML = subtitleHtml;
    moveInstrumentation(fields.subtitle, subtitle);
    body.append(subtitle);
  }

  const titleHtml = cellHtml(fields.title, true);
  if (titleHtml) {
    const title = document.createElement('h3');
    title.className = 'productcard-title';
    title.innerHTML = titleHtml;
    moveInstrumentation(fields.title, title);
    body.append(title);
  }

  const descriptionHtml = cellHtml(fields.description);
  if (descriptionHtml) {
    const description = document.createElement('div');
    description.className = 'productcard-description';
    description.innerHTML = descriptionHtml;
    moveInstrumentation(fields.description, description);
    body.append(description);
  }

  const linksWrap = document.createElement('div');
  linksWrap.className = 'productcard-links';
  fields.links?.querySelectorAll('a').forEach((link) => {
    const linkWrap = document.createElement('p');
    linkWrap.className = 'productcard-link';
    // Card calls to action are plain forward links, not pill buttons, so the
    // classes `decorateButtons` added upstream are dropped.
    link.classList.remove('button', 'primary', 'secondary', 'accent');
    link.classList.add('forward-link-dark');
    linkWrap.append(link);
    linksWrap.append(linkWrap);
  });
  if (linksWrap.childElementCount) body.append(linksWrap);

  if (body.childElementCount) cardBlock.append(body);

  li.append(cardBlock);
  return li;
}

/**
 * Decorate cardcontainer block — Jackson productcard grid with section heading.
 * Block-level rows (title, description) render as the section header; item rows,
 * which expose one cell per productcard field, render as product cards.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // Item rows expose a cell per productcard field; block-level fields expose one.
  const firstCardIndex = rows.findIndex((row) => row.children.length >= 2);
  const hasCards = firstCardIndex !== -1;
  const headerRows = hasCards ? rows.slice(0, firstCardIndex) : rows;
  const cardRows = hasCards ? rows.slice(firstCardIndex) : [];

  const wrapper = document.createElement('div');
  wrapper.className = 'cardcontainer-inner';

  const header = buildHeader(headerRows);
  if (header) wrapper.append(header);

  if (cardRows.length) {
    const grid = document.createElement('ul');
    grid.className = 'cardcontainer-cards';
    cardRows.forEach((row) => grid.append(buildCard(row)));
    wrapper.append(grid);
  }

  block.replaceChildren(wrapper);
}
