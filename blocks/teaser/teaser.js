import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function decorateCta(container, sourceRow) {
  if (!sourceRow) return;
  sourceRow.querySelectorAll('a').forEach((link) => {
    link.classList.add('button', 'primary');
    container.append(link.cloneNode(true));
  });
}

/**
 * Decorate teaser block — Jackson feature-50-50 split layout.
 * Authored rows: image, title, subtitle (optional), text, cta.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  const img = rows[0]?.querySelector('img');
  if (!img) return;

  const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '1200' }]);
  moveInstrumentation(img, optimizedPic.querySelector('img'));

  const titleText = rows[1]?.textContent?.trim() || '';
  const descriptionHtml = rows[3]?.innerHTML || rows[2]?.innerHTML || '';

  const teaser = document.createElement('div');
  teaser.className = 'teaser';

  const background = document.createElement('div');
  background.className = 'teaser-background';
  background.append(optimizedPic);

  const content = document.createElement('div');
  content.className = 'teaser-content';

  const text = document.createElement('div');
  text.className = 'teaser-text';

  if (titleText) {
    const title = document.createElement('h2');
    title.className = 'title';
    title.innerHTML = titleText;
    text.append(title);
  }

  if (descriptionHtml) {
    const description = document.createElement('div');
    description.className = 'description';
    description.innerHTML = descriptionHtml;
    text.append(description);
  }

  const cta = document.createElement('div');
  cta.className = 'teaser-cta';
  decorateCta(cta, rows[4]);

  content.append(text);
  if (cta.childElementCount) content.append(cta);
  teaser.append(background, content);
  block.replaceChildren(teaser);
}
