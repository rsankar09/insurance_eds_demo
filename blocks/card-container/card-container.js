import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Decorate card-container block — Jackson product-card grid with section heading.
 * First row: heading (and optional description). Remaining rows: product cards.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const headingRow = rows[0];
  const cardRows = rows.slice(1);

  const wrapper = document.createElement('div');
  wrapper.className = 'card-container-inner';

  const header = document.createElement('div');
  header.className = 'card-container-header';
  const heading = headingRow.querySelector('h2, h3, h4');
  if (heading) {
    header.append(heading.cloneNode(true));
  } else {
    const h2 = document.createElement('h2');
    h2.textContent = headingRow.textContent.trim();
    header.append(h2);
  }
  const desc = headingRow.querySelector('p');
  if (desc && !desc.querySelector('a')) {
    const description = document.createElement('div');
    description.className = 'card-container-description';
    description.append(desc.cloneNode(true));
    header.append(description);
  }
  wrapper.append(header);

  const grid = document.createElement('ul');
  grid.className = 'card-container-cards';

  cardRows.forEach((row) => {
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
      const imageWrap = document.createElement('div');
      imageWrap.className = 'product-card-image';
      const img = imageCol.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageWrap.append(optimizedPic);
      }
      cardBlock.append(imageWrap);
    }

    if (textCol) {
      const linksWrap = document.createElement('div');
      linksWrap.className = 'product-card-links';
      textCol.querySelectorAll('a').forEach((link) => {
        const linkWrap = document.createElement('p');
        linkWrap.className = 'product-card-link';
        const cloned = link.cloneNode(true);
        cloned.classList.add('forward-link');
        linkWrap.append(cloned);
        linksWrap.append(linkWrap);
      });
      cardBlock.append(linksWrap);
    }

    li.append(cardBlock);
    grid.append(li);
  });

  wrapper.append(grid);
  block.replaceChildren(wrapper);
}
