// export default function decorate(block) {
//   console.log('Teaser block decoration ');
//   console.log('Block:',block);
//   block.classList.add('teaser');  
//   console.log(block.dataset);
//   console.log(block.dataset.style);
//   const styleClass = block.dataset.style;
//   if (styleClass) block.classList.add(styleClass);

//   const rows = [...block.children];

//   const getCol = (row) => row?.children?.[0] || row;

//   const imageCol = getCol(rows[0]);
//   console.log('Image Column:', imageCol);
//   const titleCol = getCol(rows[1]);
//   console.log('Title Column:', titleCol);
//   const subtitleCol = getCol(rows[2]);
//   console.log('Subtitle Column:', subtitleCol);
//   const descCol = getCol(rows[3]);
//   console.log('Description Column:', descCol);
//   const ctaCol = getCol(rows[4]);
//   console.log('CTA Column:', ctaCol);
//   console.log(imageCol, titleCol, subtitleCol, descCol, ctaCol);    

//   console.log('Rows:', rows);
//   const picture = imageCol?.querySelector('picture');
// //   const title = titleCol?.querySelector('h1, h2, h3') || block.querySelector('h1, h2, h3')
//   const title = titleCol?.querySelector('p') || titleCol?.querySelector('h2[data-richtext-prop="teaser-title"]');
//   console.log('Title:', title);
//   const subtitle = subtitleCol?.querySelector('p');
//   console.log('Subtitle:', subtitle);
//   const description = descCol?.querySelector('p');
//   console.log('Description:', description);
//   const cta = ctaCol?.querySelector('p');
//   console.log('CTA:', cta);

//   block.innerHTML = '';

//   // TITLE
//   if (title) {
//     title.classList.add('teaser-title');
//     block.appendChild(title);
//   }

//   const body = document.createElement('div');
//   body.className = 'teaser-body';

//   // IMAGE WRAPPER
//   if (picture) {
//     const imageWrapper = document.createElement('div');
//     imageWrapper.className = 'image-wrapper';
//     imageWrapper.appendChild(picture);
//     body.appendChild(imageWrapper);
//   }

//   // TEXT WRAPPER
//   const textWrapper = document.createElement('div');
//   textWrapper.className = 'text-wrapper';

//   if (subtitle) {
//     subtitle.classList.add('teaser-subtitle');
//     textWrapper.appendChild(subtitle);
//   }

//   if (description) {
//     description.classList.add('teaser-description');
//     textWrapper.appendChild(description);
//   }

//   if (cta) {
//     const ctaP = document.createElement('p');
//     ctaP.classList.add('teaser-cta');
//     ctaP.appendChild(cta);
//     textWrapper.appendChild(ctaP);
//   }

//   body.appendChild(textWrapper);
//   block.appendChild(body);
// }


// export default function decorate(block) {
//   [...block.children].forEach((row) => {
//     const label = row.children[0];
//     console.log('Label:', label);
//     const content = row.children[1];
//     console.log('Content:', content);
//   });
// }

import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';


export default function decorate(block) {
  const rows = [...block.children];

  const img = rows[0].textContent.trim();
  console.log('Image:', img);

  if(img) {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
    console.log('Optimized Picture:', optimizedPic);
  }

  const title = rows[1].textContent.trim();
  console.log('Title :', title);
  
  const subtitle = rows[2].textContent.trim();
  console.log('Subtitle:', subtitle);
  

  const description = rows[3].innerHTML;
  console.log('Description:', description);


  // // Now you can rebuild your HTML
  // block.innerHTML = `
  //   <h2>${title}</h2>
  //   <div class="desc">${description}</div>
  // `;
}