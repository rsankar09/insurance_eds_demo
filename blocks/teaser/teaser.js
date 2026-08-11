export default function decorate(block) {
  block.classList.add('teaser');

  const rows = [...block.children];
  const getCol = (row) => row?.children?.[0] || row;

  const imageCol = getCol(rows[0]);
  const textCol = getCol(rows[1]);
  const ctaCol = getCol(rows[2]);

  const picture = imageCol?.querySelector('picture');
  const textChildren = textCol ? [...textCol.children] : [];
  const title = textChildren[0]?.matches('h1, h2, h3, h4') ? textChildren.shift() : null;

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

  textChildren.forEach((child) => {
    child.classList.add('teaser-description');
    textWrapper.appendChild(child);
  });

  const cta = ctaCol?.querySelector('p');
  if (cta) {
    cta.classList.add('teaser-cta');
    textWrapper.appendChild(cta);
  }

  body.appendChild(textWrapper);
  block.appendChild(body);
}
