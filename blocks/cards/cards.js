import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Card styles supported by the block, matching jackson.com's card types.
 * `product-cards` renders an image over a list of forward links, `icon-cards`
 * renders a gradient tile whose whole surface links out, and `icon-features`
 * renders an icon, heading, copy and a button separated by gradient rules.
 */
const CARD_STYLES = ['product-cards', 'icon-cards', 'icon-features'];

/** Cells of an item row, in the field order declared in `_cards.json`. The
    first cell holds the product card's image or the icon card's icon name. */
const [MEDIA, TITLE, DESCRIPTION, LINKS] = [0, 1, 2, 3];

/**
 * Returns the authored markup of a cell. Headings pass `unwrapParagraph` so a
 * lone wrapping `<p>` is dropped while authored `<br>` and inline spans survive.
 * @param {Element} cell A block row cell
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
    const html = cellHtml(cell, true);
    if (!html) return;

    if (index === 0) {
      const authoredHeading = cell.querySelector('h1, h2, h3, h4, h5, h6');
      const heading = document.createElement('h2');
      heading.className = 'cards-title';
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
 * Builds a card icon. Authors either pick one of the icon names shipped in
 * `/icons` or reference their own image asset; both render at the same size.
 * Named icons are drawn as a CSS mask so they inherit the card's text colour.
 * @param {Element} cell The icon cell
 * @returns {Element|null} The icon element, or null when no icon was authored
 */
function buildIcon(cell) {
  if (!cell) return null;

  const img = cell.querySelector('img');
  if (img) {
    const wrap = document.createElement('span');
    wrap.className = 'cards-card-icon cards-card-icon-asset';
    wrap.append(img.closest('picture') || img);
    return wrap;
  }

  const name = cell.textContent.trim().toLowerCase();
  if (!/^[a-z0-9-]+$/.test(name)) return null;

  const icon = document.createElement('span');
  icon.className = 'cards-card-icon';
  icon.style.setProperty('--cards-icon', `url("/icons/${name}.svg")`);
  icon.setAttribute('aria-hidden', 'true');
  return icon;
}

/**
 * Builds the image of a product card.
 * @param {Element} cell The image cell
 * @returns {Element|null} The image wrapper, or null when no image was authored
 */
function buildImage(cell) {
  const img = cell?.querySelector('img');
  if (!img) return null;

  const wrap = document.createElement('div');
  wrap.className = 'cards-card-image';
  const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]);
  moveInstrumentation(img, optimizedPic.querySelector('img'));
  wrap.append(optimizedPic);
  return wrap;
}

/**
 * Builds the heading and copy shared by all card styles.
 * @param {Element} titleCell The title cell
 * @param {Element} descriptionCell The description cell
 * @returns {Element|null} The text block, or null when nothing was authored
 */
function buildText(titleCell, descriptionCell) {
  const text = document.createElement('div');
  text.className = 'cards-card-text';

  const titleHtml = cellHtml(titleCell, true);
  if (titleHtml) {
    const authoredHeading = titleCell.querySelector('h1, h2, h3, h4, h5, h6');
    const heading = document.createElement('h3');
    heading.className = 'cards-card-title';
    heading.innerHTML = authoredHeading ? authoredHeading.innerHTML : titleHtml;
    moveInstrumentation(titleCell, heading);
    text.append(heading);
  }

  const descriptionHtml = cellHtml(descriptionCell);
  if (descriptionHtml) {
    const description = document.createElement('div');
    description.className = 'cards-card-description';
    description.innerHTML = descriptionHtml;
    moveInstrumentation(descriptionCell, description);
    text.append(description);
  }

  return text.childElementCount ? text : null;
}

/**
 * Builds the list of forward links used by product cards.
 * @param {Element[]} links The authored links
 * @returns {Element} The links wrapper
 */
function buildLinkList(links) {
  const wrap = document.createElement('div');
  wrap.className = 'cards-card-links';
  links.forEach((link) => {
    const item = document.createElement('p');
    item.className = 'cards-card-link';
    link.classList.add('cards-forward-link');
    item.append(link);
    wrap.append(item);
  });
  return wrap;
}

/**
 * Builds the call to action buttons used by icon features.
 * @param {Element[]} links The authored links
 * @returns {Element} The CTA wrapper
 */
function buildCta(links) {
  const wrap = document.createElement('div');
  wrap.className = 'cards-card-cta';
  links.forEach((link) => {
    link.classList.add('button', 'primary');
    wrap.append(link);
  });
  return wrap;
}

/**
 * Builds a single card in the style the block was authored with.
 * Cards degrade gracefully: any field the author leaves empty is left out.
 * @param {Element} row The item row
 * @param {string} style One of `CARD_STYLES`
 * @returns {Element} The card list item
 */
function buildCard(row, style) {
  const cells = [...row.children];
  const li = document.createElement('li');
  li.className = 'cards-card';
  moveInstrumentation(row, li);

  const inner = document.createElement('div');
  inner.className = 'cards-card-inner';

  // The media cell carries an image on product cards and an icon name elsewhere.
  const media = style === 'product-cards' ? buildImage(cells[MEDIA]) : buildIcon(cells[MEDIA]);
  if (media) inner.append(media);

  const text = buildText(cells[TITLE], cells[DESCRIPTION]);
  const links = [...(cells[LINKS]?.querySelectorAll('a') || [])];

  if (style === 'icon-features') {
    if (text) inner.append(text);
    if (links.length) (text || inner).append(buildCta(links));
  } else if (style === 'icon-cards') {
    if (text) inner.append(text);
  } else {
    const body = document.createElement('div');
    body.className = 'cards-card-body';
    if (text) body.append(text);
    if (links.length) body.append(buildLinkList(links));
    if (body.childElementCount) inner.append(body);
  }

  // An icon card links out as a whole; the first authored link wins.
  if (style === 'icon-cards' && links.length) {
    const [link] = links;
    const anchor = document.createElement('a');
    anchor.className = 'cards-card-anchor';
    anchor.href = link.href;
    if (link.target) anchor.target = link.target;
    if (link.target === '_blank') anchor.rel = 'noopener';
    if (link.title) anchor.title = link.title;
    if (!text) anchor.setAttribute('aria-label', link.textContent.trim());
    moveInstrumentation(cells[LINKS], anchor);
    anchor.append(inner);
    li.append(anchor);
    return li;
  }

  li.append(inner);
  return li;
}

/**
 * Decorate cards block — Jackson card grid with an optional section heading.
 * Block-level rows (title, description) render as the section header; the
 * remaining rows render as cards. A style class on the block selects the card
 * type, and further classes drive the background theme, column count and
 * heading alignment.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // Item rows expose one cell per model field; block-level fields expose one.
  const firstCardIndex = rows.findIndex((row) => row.children.length >= 2);
  const hasCards = firstCardIndex !== -1;
  const headerRows = hasCards ? rows.slice(0, firstCardIndex) : rows;
  const cardRows = hasCards ? rows.slice(firstCardIndex) : [];

  // Without an explicit style, cards carrying an image are product cards.
  let style = CARD_STYLES.find((name) => block.classList.contains(name));
  if (!style) {
    style = cardRows.some((row) => row.querySelector('picture, img')) ? 'product-cards' : 'icon-cards';
    block.classList.add(style);
  }

  const inner = document.createElement('div');
  inner.className = 'cards-inner';

  const header = buildHeader(headerRows);
  if (header) inner.append(header);

  if (cardRows.length) {
    const list = document.createElement('ul');
    list.className = 'cards-list';
    cardRows.forEach((row) => list.append(buildCard(row, style)));
    inner.append(list);
  }

  block.replaceChildren(inner);
}
