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
 * Decorate hero block — Jackson home-page-hero overlay layout.
 * Authored rows: image, then rich text (heading, description, optional CTA links).
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  const imageRow = rows[0];
  const contentRow = rows[1];

  const img = imageRow.querySelector('img');
  if (!img) return;

  const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]);
  moveInstrumentation(img, optimizedPic.querySelector('img'));

  const inner = document.createElement('div');
  inner.className = 'hero-inner';

  const imageWrap = document.createElement('div');
  imageWrap.className = 'hero-image';
  imageWrap.append(optimizedPic);

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

  inner.append(imageWrap, contentWrap);
  block.replaceChildren(inner);
}
