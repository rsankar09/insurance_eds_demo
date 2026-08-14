import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function buildTeaserMarkup(title, subtitle, descriptionHtml, ctaText, pictureHtml) {
  return `
  <div class="feature-50-50 v1">
    <div class="feature-50-50__wrapper color-grad-red-plum-diag" style="--bg-color: inherit;">
      <div class="feature-50-50__block" data-analytics-region="feature-50-50">
        <div class="feature-50-50__content image-left animation-disabled">

          <div class="feature-50-50__image animation animation--static">
            <div class="feature-50-50__image-inner">
              ${pictureHtml}
            </div>
          </div>

          <div class="feature-50-50__card">
            <div class="feature-50-50__card-content animation contents-left animation--static">
              <div class="feature-50-50__content-inner">

                <h2 class="feature-50-50__title" id="form-heading">
                  <span class="text__color--primary-white">${title}</span>
                </h2>

                <div class="feature-50-50__description">
                  ${descriptionHtml}
                </div>

                <div class="feature-50-50__links">
                  ${ctaText ? `<a class="primary-button" href="${ctaText}">Explore protection options</a>` : ''}
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
  `;
}

export default function decorate(block) {
  const rows = [...block.children];

  const img = rows[0].querySelector('img');
  if (!img) return;

  const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
  moveInstrumentation(img, optimizedPic.querySelector('img'));

  const title = rows[1].textContent.trim();
  const subtitle = rows[2].textContent.trim(); // unused but kept for future use
  const descriptionHtml = rows[3].innerHTML;
  const cta = rows[4].textContent.trim();

  block.innerHTML = buildTeaserMarkup(
    title,
    subtitle,
    descriptionHtml,
    cta,
    optimizedPic.outerHTML,
  );
}
