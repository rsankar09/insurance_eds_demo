import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function buildTeaserMarkup(title, subtitle, descriptionHtml, ctaText, pictureHtml) {
  const ctaMarkup = ctaText
    ? `<a href="${ctaText}" data-aue-prop="ctaText" data-aue-label="Button Text" data-aue-type="text" class="button secondary">${ctaText}</a>`
    : '';

  return `
  <div class="teaser" data-aue-resource="" data-aue-label="CF Teaser" data-aue-type="reference">
    <div class="teaser-background">
      ${pictureHtml || ''}
    </div>
    <div class="teaser-content">
      <div class="teaser-text">
        <h3 data-aue-prop="teaserTitle" data-aue-label="Title" data-aue-type="text" class="title">${title}</h3>
        <div data-aue-prop="teaserDescription" data-aue-label="Description" data-aue-type="richtext" class="description">
          ${descriptionHtml}
        </div>
      </div>
      ${ctaMarkup ? `<div class="teaser-cta">${ctaMarkup}</div>` : ''}
    </div>
  </div>`;
}

export default function decorate(block) {
  const rows = [...block.children];

  const img = rows[0].querySelector('img');
  if (!img) return;

  const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
  moveInstrumentation(img, optimizedPic.querySelector('img'));

  const title = rows[1].textContent.trim();
  const subtitle = rows[2].textContent.trim();
  const description = rows[3].innerHTML;
  const cta = rows[4].textContent.trim();

  block.innerHTML = buildTeaserMarkup(
    title,
    subtitle,
    description,
    cta,
    optimizedPic.outerHTML,
  );
}
