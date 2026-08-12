/**
 * loads and decorates the block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const getCol = (row) => row?.children?.[0];

  const [imageRow, titleRow, subtitleRow, textRow, ctaRow] = [...block.children];

  const picture = getCol(imageRow)?.querySelector('picture');
  console.log('picture', picture);
  const title = getCol(titleRow)?.textContent.trim();
  console.log('title', title);    
  const subtitle = getCol(subtitleRow)?.textContent.trim();
  console.log('subtitle', subtitle);  
  const description = getCol(textRow);
  console.log('description', description);
  const cta = getCol(ctaRow)?.querySelector('a');
  console.log('cta', cta);

  block.textContent = '';

  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'teaser-image';
  if (picture) imageWrapper.append(picture);

  const content = document.createElement('div');
  content.className = 'teaser-content';

  if (subtitle) {
    const subtitleEl = document.createElement('p');
    subtitleEl.className = 'teaser-subtitle';
    subtitleEl.textContent = subtitle;
    content.append(subtitleEl);
  }

  if (title) {
    const titleEl = document.createElement('h2');
    titleEl.className = 'teaser-title';
    titleEl.textContent = title;
    content.append(titleEl);
  }

  if (description) {
    description.className = 'teaser-description';
    content.append(...description.children);
  }

  if (cta) {
    cta.classList.add('button', 'primary');
    const ctaWrapper = document.createElement('p');
    ctaWrapper.className = 'teaser-cta';
    ctaWrapper.append(cta);
    content.append(ctaWrapper);
  }

  block.append(imageWrapper, content);
}
