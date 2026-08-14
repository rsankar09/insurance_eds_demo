import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Builds the section header from the block-level rows (title, description).
 * @param {Element[]} headerRows Leading single-cell rows
 * @returns {Element|null} The header element, or null when nothing was authored
 */
function buildHeader(headerRows) {
  const header = document.createElement('div');
  header.className = 'card-container-header';

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
    description.className = 'card-container-description';
    description.innerHTML = html;
    moveInstrumentation(row, description);
    header.append(description);
  });

  return header.childElementCount ? header : null;
}

/**
 * Builds a single product card from an item row (image cell + links cell).
 * @param {Element} row The item row
 * @returns {Element} The card list item
 */
function buildCard(row) {
  const li = document.createElement('li');
  li.className = 'product-card';
  moveInstrumentation(row, li);

  const cardBlock = document.createElement('div');
  cardBlock.className = 'product-card-block';

  const imageCol = row.querySelector('picture, img')?.closest('div');
  const textCol = [...row.children].find(
    (col) => col !== imageCol && col.querySelector('a, p'),
  );

  if (imageCol) {
    const img = imageCol.querySelector('img');
    if (img) {
      const imageWrap = document.createElement('div');
      imageWrap.className = 'product-card-image';
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      imageWrap.append(optimizedPic);
      cardBlock.append(imageWrap);
    }
  }

  if (textCol) {
    const linksWrap = document.createElement('div');
    linksWrap.className = 'product-card-links';
    textCol.querySelectorAll('a').forEach((link) => {
      const linkWrap = document.createElement('p');
      linkWrap.className = 'product-card-link';
      link.classList.add('forward-link-dark');
      linkWrap.append(link);
      linksWrap.append(linkWrap);
    });
    if (linksWrap.childElementCount) cardBlock.append(linksWrap);
  }

  li.append(cardBlock);
  return li;
}

/**
 * Decorate card-container block — Jackson product-card grid with section heading.
 * Block-level rows (title, description) render as the section header; item rows,
 * which carry both an image cell and a links cell, render as product cards.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // Item rows always expose two cells (image, links); block-level fields expose one.
  const firstCardIndex = rows.findIndex((row) => row.children.length >= 2);
  const hasCards = firstCardIndex !== -1;
  const headerRows = hasCards ? rows.slice(0, firstCardIndex) : rows;
  const cardRows = hasCards ? rows.slice(firstCardIndex) : [];

  const wrapper = document.createElement('div');
  wrapper.className = 'card-container-inner';

  const header = buildHeader(headerRows);
  if (header) wrapper.append(header);

  if (cardRows.length) {
    const grid = document.createElement('ul');
    grid.className = 'card-container-cards';
    cardRows.forEach((row) => grid.append(buildCard(row)));
    wrapper.append(grid);
  }

  block.replaceChildren(wrapper);
}
