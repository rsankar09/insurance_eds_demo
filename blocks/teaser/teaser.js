import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  // IMAGE
  const img = rows[0].querySelector('img');
  if (!img) return;

  const optimizedPic = createOptimizedPicture(
    img.src,
    img.alt,
    false,
    [{ width: '750' }]
  );

  moveInstrumentation(img, optimizedPic.querySelector('img'));

  // TEXT FIELDS
  const title = rows[1].textContent.trim();
  const subtitle = rows[2].textContent.trim();
  const description = rows[3].innerHTML;
  const cta = rows[4].textContent.trim();

  // AUTHORED CLASSES (Style field)
  const authoredClasses = [...block.classList].filter(
    c => !['block', block.dataset.blockName].includes(c)
  );

  // BUILD TEASER MARKUP
  block.innerHTML = `
    <div class="teaser ${authoredClasses.join(' ')}">
      <div class="teaser__wrapper">
        <div class="teaser__block">
          <div class="teaser__content">

            <div class="teaser__image">
              <div class="teaser__image-inner"></div>
            </div>

            <div class="teaser__card">
              <div class="teaser__card-content">
                <div class="teaser__content-inner">

                  <h2 class="teaser__title">${title}</h2>
                  <h3 class="teaser__subtitle">${subtitle}</h3>

                  <div class="teaser__description">${description}</div>

                  <div class="teaser__links">
                    <a class="primary-button">${cta}</a>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  `;

  // Insert optimized image
  block.querySelector('.teaser__image-inner').appendChild(optimizedPic);
}
