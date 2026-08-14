import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Returns the authored markup of a block row's single cell.
 * Headings pass `unwrapParagraph` so a lone wrapping `<p>` is dropped while
 * authored `<br>` and inline spans survive; rich text keeps its paragraphs.
 * @param {Element} row A block row
 * @param {boolean} [unwrapParagraph] Whether to unwrap a lone wrapping paragraph
 * @returns {string} The cell's inner markup, or an empty string
 */
function cellHtml(row, unwrapParagraph = false) {
  const cell = row?.firstElementChild;
  if (!cell) return '';
  const only = cell.children.length === 1 ? cell.firstElementChild : null;
  const source = unwrapParagraph && only?.tagName === 'P' ? only : cell;
  return source.innerHTML.trim();
}

/**
 * Decorate banner block — Jackson full-image-feature layout: a full-bleed
 * background image with a content panel overlaid on top of it.
 * Authored rows, in order: image, title, text, cta.
 * Style classes drive the panel position, overlay tint and text colour.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  const img = rows[0]?.querySelector('img');

  const titleHtml = cellHtml(rows[1], true);
  const textHtml = cellHtml(rows[2]);

  const inner = document.createElement('div');
  inner.className = 'banner-inner';

  if (img) {
    const imageWrap = document.createElement('div');
    imageWrap.className = 'banner-image';
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    imageWrap.append(optimizedPic);
    inner.append(imageWrap);
  } else {
    inner.classList.add('banner-no-image');
  }

  const content = document.createElement('div');
  content.className = 'banner-content';

  if (titleHtml) {
    const title = document.createElement('h2');
    title.className = 'banner-title';
    title.innerHTML = titleHtml;
    content.append(title);
  }

  if (textHtml) {
    const description = document.createElement('div');
    description.className = 'banner-description';
    description.innerHTML = textHtml;
    content.append(description);
  }

  const cta = document.createElement('div');
  cta.className = 'banner-cta';
  rows[3]?.querySelectorAll('a').forEach((link) => {
    link.classList.add('button', 'primary');
    cta.append(link);
  });
  if (cta.childElementCount) content.append(cta);

  if (content.childElementCount) inner.append(content);
  block.replaceChildren(inner);
}
