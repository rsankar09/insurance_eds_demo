import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function buildTeaserMarkup(title, subtitle, descriptionHtml, ctaText, pictureHtml) {
  const ctaMarkup = ctaText
    ? `<a href="${ctaText}" data-aue-prop="ctaText" data-aue-label="Button Text" data-aue-type="text" class="button secondary">${ctaText}</a>`
    : '';

  // return `
  // <div class="teaser" data-aue-resource="" data-aue-label="CF Teaser" data-aue-type="reference">
  //   <div class="teaser-background">
  //     ${pictureHtml || ''}
  //   </div>
  //   <div class="teaser-content">
  //     <div class="teaser-text">
  //       <h3 data-aue-prop="teaserTitle" data-aue-label="Title" data-aue-type="text" class="title">${title}</h3>
  //       <div data-aue-prop="teaserDescription" data-aue-label="Description" data-aue-type="richtext" class="description">
  //         ${descriptionHtml}
  //       </div>
  //     </div>
  //     ${ctaMarkup ? `<div class="teaser-cta">${ctaMarkup}</div>` : ''}
  //   </div>
  // </div>`;

  return `
  <div class="feature-50-50 v1">
    <div class="feature-50-50__wrapper color-grad-red-plum-diag" style="--bg-color: inherit;">
      <div class="feature-50-50__block" data-analytics-region="feature-50-50">
        <div class="feature-50-50__content image-left animation-disabled">
          <div class="feature-50-50__image animation animation--static">
            <div class="feature-50-50__image-inner">    
              <img src="${pictureHtml}" alt="">
            </div>
          </div>
          <div class="feature-50-50__card">
            <div class="feature-50-50__card-content animation contents-left animation--static">
              <div class="feature-50-50__content-inner">
                <h2 class="feature-50-50__title" id="form-heading">
                  <span class="text__color--primary-white">
                    ${title}
                  </span>
                </h2>
                <div class="feature-50-50__description">
                  <p>
                    <span class="text__color--primary-white">
                      ${description}
                    </span>&nbsp;
                  </p>
                </div>
                <div class="feature-50-50__links">
                  <a class="primary-button" href="/financial-professional/annuity-products/client-needs/protection-options.html">
                    Explore protection options
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`;


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
