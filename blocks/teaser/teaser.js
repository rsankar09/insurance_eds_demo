export default function decorate(block) {
  block.classList.add('teaser');

  const rows = [...block.children];
  const getCol = (row) => row?.children?.[0] || row;

  const imageCol = getCol(rows[0]);
  const titleCol = getCol(rows[1]);
  const descCol = getCol(rows[2]);
  const ctaCol = getCol(rows[3]);

  const picture = imageCol?.querySelector('picture');
  const title = titleCol?.querySelector('p, h2, h3');

  block.innerHTML = '';

  if (title) {
    title.classList.add('teaser-title');
    block.appendChild(title);
  }

  const body = document.createElement('div');
  body.className = 'teaser-body';

  if (picture) {
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'image-wrapper';
    imageWrapper.appendChild(picture);
    body.appendChild(imageWrapper);
  }

  const textWrapper = document.createElement('div');
  textWrapper.className = 'text-wrapper';

  if (descCol) {
    while (descCol.firstElementChild) {
      descCol.firstElementChild.classList.add('teaser-description');
      textWrapper.appendChild(descCol.firstElementChild);
    }
  }

  const cta = ctaCol?.querySelector('p');
  if (cta) {
    cta.classList.add('teaser-cta');
    textWrapper.appendChild(cta);
  }

  body.appendChild(textWrapper);
  block.appendChild(body);
}
