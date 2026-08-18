import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * jackson.com's hero headline is two-tone: the run after the final line break
 * takes the accent colour. Authors can mark that run up themselves — with an
 * `.accent` span, or jackson.css's own `text__color--*` utilities — and when
 * they haven't, wrap the trailing run so the headline still matches the design.
 * @param {Element} heading The hero's heading element
 */
function decorateAccent(heading) {
  if (!heading || heading.querySelector('.accent, [class*="text__color"]')) return;

  const breaks = heading.querySelectorAll('br');
  const lastBreak = breaks[breaks.length - 1];
  if (!lastBreak) return;

  const trailing = [];
  for (let node = lastBreak.nextSibling; node; node = node.nextSibling) trailing.push(node);
  if (!trailing.some((node) => node.textContent.trim())) return;

  const accent = document.createElement('span');
  accent.className = 'accent';
  accent.append(...trailing);
  lastBreak.after(accent);
}

/**
 * Decorate hero block — covers both of jackson.com's hero layouts from a single
 * block, chosen by whether the author supplied a background image:
 *  - image authored    → `home-page-hero`, content overlaid on the image
 *  - image left empty  → `no-image-hero`, content on a flat background band,
 *                        marked with `.no-image` so the CSS can switch layout
 * Authored rows: image, then rich text (heading, description, optional CTA links).
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // an author who skips the image still leaves an empty cell behind, so locate
  // the rows by what they hold rather than by their position
  const imageRow = rows.find((row) => row.querySelector('img'));
  const contentRow = rows.find((row) => row !== imageRow && row.textContent.trim());
  if (!contentRow) return;

  const img = imageRow?.querySelector('img');

  const inner = document.createElement('div');
  inner.className = 'hero-inner';

  if (img) {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));

    const imageWrap = document.createElement('div');
    imageWrap.className = 'hero-image';
    imageWrap.append(optimizedPic);
    inner.append(imageWrap);
  } else {
    block.classList.add('no-image');
  }

  const contentWrap = document.createElement('div');
  contentWrap.className = 'hero-content';

  const textWrap = document.createElement('div');
  textWrap.className = 'hero-text';

  const ctaWrap = document.createElement('div');
  ctaWrap.className = 'hero-cta';

  // the authored rich text sits in the row's single cell — iterate the cell's
  // children so the heading and description end up as direct children of
  // `.hero-text`, and an authored link row is recognised as a CTA
  const contentCell = contentRow.firstElementChild ?? contentRow;

  [...contentCell.children].forEach((child) => {
    const links = child.querySelectorAll('a');
    if (links.length) {
      links.forEach((link) => {
        link.classList.add('button', 'primary');
        ctaWrap.append(link);
      });
      return;
    }
    textWrap.append(child);
  });

  decorateAccent(textWrap.querySelector('h1'));

  contentWrap.append(textWrap);
  if (ctaWrap.childElementCount) contentWrap.append(ctaWrap);

  inner.append(contentWrap);
  block.replaceChildren(inner);
}
