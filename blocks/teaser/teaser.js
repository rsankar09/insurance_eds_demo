import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  const img = rows[0].querySelector('img');
  if (!img) return;

  const optimizedPic = createOptimizedPicture(
    img.src,
    img.alt,
    false,
    [{ width: '750' }]
  );

  moveInstrumentation(img, optimizedPic.querySelector('img'));

  const title = rows[1].textContent.trim();
  const subtitle = rows[2].textContent.trim();
  const description = rows[3].innerHTML;
  const cta = rows[4].textContent.trim();

  const authoredClasses = [...block.classList].filter(
    c => !['block', block.dataset.blockName].includes(c)
  );

  // block.innerHTML = `
  //   <div class="teaser ${authoredClasses.join(' ')}">
  //     <div class="teaser__wrapper">
  //       <div class="teaser__block">
  //         <div class="teaser__content">

  //           <div class="teaser__image">
  //             <div class="teaser__image-inner"></div>
  //           </div>

  //           <div class="teaser__card">
  //             <div class="teaser__card-content">
  //               <div class="teaser__content-inner">

  //                 <h2 class="teaser__title">${title}</h2>
  //                 <h3 class="teaser__subtitle">${subtitle}</h3>

  //                 <div class="teaser__description">${description}</div>

  //                 <div class="teaser__links">
  //                   <a class="primary-button">${cta}</a>
  //                 </div>

  //               </div>
  //             </div>
  //           </div>

  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // `;

   // Insert EXACT Feature‑50‑50 markup (except image)
//   block.innerHTML = `
// <div class="feature-50-50 v1">
//   <div class="feature-50-50__wrapper" style="--bg-color: #d4b5a3;">
//     <div class="feature-50-50__block" data-analytics-region="feature-50-50">
//       <div class="feature-50-50__content image-left animation-disabled">

//         <div class="feature-50-50__image animation animation--static">
//           <div class="feature-50-50__image-inner"></div>
//         </div>

//         <div class="feature-50-50__card">
//           <div class="feature-50-50__card-content animation contents-left animation--static">
//             <div class="feature-50-50__content-inner">

//               <h2 class="feature-50-50__title" id="form-heading">${title}</h2>

//               <div class="feature-50-50__description">
//                 ${description}
//               </div>

//               <div class="feature-50-50__links">
//                 ${cta}
//               </div>

//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   </div>
// </div>
//   `;
//   block.querySelector('.feature-50-50__image-inner').appendChild(optimizedPic);
}
