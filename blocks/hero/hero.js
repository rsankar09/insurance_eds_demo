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
 * Moves every link in the source row into the CTA container as a button.
 * @param {Element} container The CTA container
 * @param {Element} sourceRow The authored CTA row
 */
function decorateCta(container, sourceRow) {
  if (!sourceRow) return;
  sourceRow.querySelectorAll('a').forEach((link) => {
    link.classList.add('button', 'primary');
    container.append(link);
  });
}

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
 * Authored rows, in order: image, title, subtitle, description, cta.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const img = rows[0]?.querySelector('img');

  const titleHtml = cellHtml(rows[1], true);
  const subtitleHtml = cellHtml(rows[2], true);
  const descriptionHtml = cellHtml(rows[3]);

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
    // no image authored — the content sits on a flat colour band instead
    block.classList.add('no-image');
  }

  const contentWrap = document.createElement('div');
  contentWrap.className = 'hero-content';

  const textWrap = document.createElement('div');
  textWrap.className = 'hero-text';

  let subtitle;
  if (subtitleHtml) {
    subtitle = document.createElement('p');
    subtitle.className = 'hero-subtitle';
    subtitle.innerHTML = subtitleHtml;
  }

  // subtitle sits above the title unless the author selected "Subtitle below title"
  if (subtitle && !block.classList.contains('subtitle-below')) textWrap.append(subtitle);

  if (titleHtml) {
    const title = document.createElement('h1');
    title.className = 'hero-title';
    title.innerHTML = titleHtml;
    decorateAccent(title);
    textWrap.append(title);
  }

  if (subtitle && block.classList.contains('subtitle-below')) textWrap.append(subtitle);

  if (descriptionHtml) {
    const description = document.createElement('div');
    description.className = 'hero-description';
    description.innerHTML = descriptionHtml;
    textWrap.append(description);
  }

  const ctaWrap = document.createElement('div');
  ctaWrap.className = 'hero-cta';
  decorateCta(ctaWrap, rows[4]);

  contentWrap.append(textWrap);
  if (ctaWrap.childElementCount) contentWrap.append(ctaWrap);

  inner.append(contentWrap);
  block.replaceChildren(inner);
}
