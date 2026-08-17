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
 * Decorate teaser block — Jackson feature-50-50 split layout.
 * Authored rows, in order: image, title, subtitle, text, cta.
 * Style classes on the block drive image position, background theme,
 * content alignment and subtitle placement.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  const img = rows[0]?.querySelector('img');

  const titleHtml = cellHtml(rows[1], true);
  const subtitleHtml = cellHtml(rows[2], true);
  const descriptionHtml = cellHtml(rows[3]);

  const teaser = document.createElement('div');
  teaser.className = 'teaser image-on-right bg-plum content-left';

  if (img) {
    const background = document.createElement('div');
    background.className = 'teaser-background';
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '1200' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    background.append(optimizedPic);
    teaser.append(background);
  } else {
    // no image authored — let the content span the full width
    teaser.classList.add('teaser-no-image');
  }

  const content = document.createElement('div');
  content.className = 'teaser-content';

  const text = document.createElement('div');
  text.className = 'teaser-text';

  let subtitle;
  if (subtitleHtml) {
    subtitle = document.createElement('p');
    subtitle.className = 'subtitle';
    subtitle.innerHTML = subtitleHtml;
  }

  // subtitle sits above the title unless the author selected "Subtitle below title"
  if (subtitle && !block.classList.contains('subtitle-below')) text.append(subtitle);

  if (titleHtml) {
    const title = document.createElement('h2');
    title.className = 'title';
    title.innerHTML = titleHtml;
    text.append(title);
  }

  if (subtitle && block.classList.contains('subtitle-below')) text.append(subtitle);

  if (descriptionHtml) {
    const description = document.createElement('div');
    description.className = 'description';
    description.innerHTML = descriptionHtml;
    text.append(description);
  }

  const cta = document.createElement('div');
  cta.className = 'teaser-cta';
  decorateCta(cta, rows[4]);
  if (cta.childElementCount) text.append(cta);

  content.append(text);
  teaser.append(content);
  block.replaceChildren(teaser);
}
