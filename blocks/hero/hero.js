import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

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

  [...contentRow.children].forEach((child) => {
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

  contentWrap.append(textWrap);
  if (ctaWrap.childElementCount) contentWrap.append(ctaWrap);

  inner.append(imageWrap, contentWrap);
  block.replaceChildren(inner);
}
