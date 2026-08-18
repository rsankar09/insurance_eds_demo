/* jackson-importer.js */

/* ---------------------------
   SECTION HEADER (no-image-hero)
   --------------------------- */
// const createSectionHeader = (document, block) => {
//   const title = block.querySelector('.no-image-hero__title');
//   const desc = block.querySelector('.no-image-hero__description');

//   const rows = [
//     ['section-header'],
//     [title ? title.textContent.trim() : ''],
//     [desc ? desc.innerHTML.trim() : ''],
//   ];

//   return WebImporter.DOMUtils.createTable(rows, document);
// };

const extractTeaserClasses = (block) => {
  const classes = [];

  // IMAGE POSITION
  const content = block.querySelector('.feature-50-50__content');
  if (content) {
    if (content.classList.contains('image-left')) classes.push('image-on-left');
    if (content.classList.contains('image-right')) classes.push('image-on-right');
    if (content.classList.contains('image-top')) classes.push('image-on-top');
    if (content.classList.contains('image-bottom')) classes.push('image-on-bottom');
  }

  // BACKGROUND COLOR
  const wrapper = block.querySelector('.feature-50-50__wrapper');
  if (wrapper) {
    const bg = wrapper.style.getPropertyValue('--bg-color').trim();

    switch (bg) {
      case '#ffffff': classes.push('bg-white'); break;
      case '#ebebeb': classes.push('bg-gray'); break;
      case '#d4b5a3': classes.push('bg-tan'); break;
      case '#f2d7d5': classes.push('bg-blush'); break;
      default:
        if (wrapper.classList.contains('color-grad-red-plum-diag')) {
          classes.push('color-grad-red-plum-diag');
        } else {
          classes.push('bg-plum');
        }
    }
  }

  // CONTENT ALIGNMENT
  const inner = block.querySelector('.feature-50-50__content-inner');
  if (inner) {
    if (inner.classList.contains('contents-left')) classes.push('content-left');
    if (inner.classList.contains('contents-center')) classes.push('content-center');
    if (inner.classList.contains('contents-right')) classes.push('content-right');
  }

  // SUBTITLE POSITION
  const subtitle = block.querySelector('.feature-50-50__subtitle');
  if (subtitle) {
    const subtitleAbove = subtitle.compareDocumentPosition(block.querySelector('.feature-50-50__title')) & Node.DOCUMENT_POSITION_FOLLOWING;
    classes.push(subtitleAbove ? 'subtitle-above' : 'subtitle-below');
  }

  return classes;
};


/* ---------------------------
   TEASER (feature-50-50)
   --------------------------- */
const createTeaserBlock = (document, block) => {
  const teaser = {};

  const image = block.querySelector('.feature-50-50__image img');
  if (image) {
    const el = document.createElement('img');
    el.src = image.src;
    teaser.Image = el;
  }

  const title = block.querySelector('.feature-50-50__title');
  if (title) teaser.Title = title.textContent.trim();

  const desc = block.querySelector('.feature-50-50__description');
  if (desc) teaser.Description = desc.innerHTML.trim();

  const cta = block.querySelector('.feature-50-50__links a');
  if (cta) {
    teaser.CTA = `<p><a href="${cta.href}">${cta.textContent.trim()}</a></p>`;
  }

//   const wrapper = block.querySelector('.feature-50-50__wrapper');
//   if (wrapper) {
//     teaser.Background = wrapper.classList.contains('color-grad-red-plum-diag')
//       ? 'bg-plum'
//       : 'bg-default';
//   }

  // CLASSES (the part you asked for)
  const classes = extractTeaserClasses(block);
  console.log('Teaser classes:', classes);

  const rows = [
    ['Teaser'],
    [teaser.Image || ''],
    [teaser.Title || ''],
    [''],
    [teaser.Description || ''],
    [teaser.CTA || ''],
    [classes.join(',') || ''],
  ];

  return WebImporter.DOMUtils.createTable(rows, document);
};

/* ---------------------------
   CARD LIST (card-container)
   --------------------------- */
const createCardListBlock = (document, block) => {
  const title = block.querySelector('.card-container__title');
  const desc = block.querySelector('.card-container__description');

  const cards = [...block.querySelectorAll('.product-card__block')].map((card) => {
    const img = card.querySelector('.product-card__image img');
    const line = card.querySelector('.product-card__product-line');
    const name = card.querySelector('.product-card__product-name');
    const text = card.querySelector('.product-card__product-description');
    const link = card.querySelector('.product-card__links a');

    const imgEl = img ? (() => {
      const el = document.createElement('img');
      el.src = img.src;
      return el;
    })() : '';

    const ctaHtml = link
      ? `<p><a href="${link.href}">${link.textContent.trim()}</a></p>`
      : '';

    return [
      imgEl,
      line ? line.textContent.trim() : '',
      name ? name.innerHTML.trim() : '',
      text ? text.innerHTML.trim() : '',
      ctaHtml,
    ];
  });

  const rows = [
    ['card-list'],
    [title ? title.textContent.trim() : ''],
    [desc ? desc.innerHTML.trim() : ''],
    ...cards,
  ];

  return WebImporter.DOMUtils.createTable(rows, document);
};


const createCardsBlock = (document, block) => {
  // Find all product-card blocks
  const cardItems = [...block.querySelectorAll('.product-card__block')];

  const cardRows = cardItems.map((card) => {
    // IMAGE
    const img = card.querySelector('.product-card__image img');
    const imgEl = img ? (() => {
      const el = document.createElement('img');
      el.src = img.src;
      el.alt = img.alt || '';
      return el;
    })() : '';

    // TEXT (richtext: line + name + description + CTA)
    const line = card.querySelector('.product-card__product-line');
    const name = card.querySelector('.product-card__product-name');
    const desc = card.querySelector('.product-card__product-description');
    const link = card.querySelector('.product-card__links a');

    let textHtml = '';

    if (line) textHtml += `<p>${line.textContent.trim()}</p>`;
    if (name) textHtml += `<p>${name.innerHTML.trim()}</p>`;
    if (desc) textHtml += desc.innerHTML.trim();
    if (link) textHtml += `<p><a href="${link.href}">${link.textContent.trim()}</a></p>`;

    return [
      imgEl || '',
      textHtml || ''
    ];
  });

  // Build final table
  const rows = [
    ['Cards'],   // block name
    // [''],        // empty row (matches model)
    // [''],        // empty row (matches model)
    ...cardRows  // all card rows
  ];

  return WebImporter.DOMUtils.createTable(rows, document);
};



/* ---------------------------
   TEXT BLOCK (text-block)
   --------------------------- */
const createTextBlock = (document, block) => {
  const text = block.querySelector('.cmp-text');
  const rows = [
    ['Text'],
    [text ? text.innerHTML.trim() : ''],
  ];
  return WebImporter.DOMUtils.createTable(rows, document);
};

// /* ---------------------------
//    ICON FEATURE (icon-feature)
//    --------------------------- */
// const createIconFeatureBlock = (document, block) => {
//   const title = block.querySelector('.icon-feature__title');
//   const desc = block.querySelector('.icon-feature__description');
//   const link = block.querySelector('.icon-feature__link a');

//   const ctaHtml = link
//     ? `<p><a href="${link.href}">${link.textContent.trim()}</a></p>`
//     : '';

//   const rows = [
//     ['icon-feature'],
//     [title ? title.textContent.trim() : ''],
//     [desc ? desc.innerHTML.trim() : ''],
//     [ctaHtml],
//   ];

//   return WebImporter.DOMUtils.createTable(rows, document);
// };

/* ---------------------------
   MAIN IMPORTER
   --------------------------- */
export default {
  transformDOM: ({ document }) => {
    const main = document.querySelector('.content-wrapper') || document.body;

    // Remove AEM Franklin teaser blocks (prevent duplicates)
    document.querySelectorAll('[model="teaser"]').forEach((el) => el.remove());

    // Remove global chrome
    document.querySelectorAll('nav, footer, masthead').forEach((el) => el.remove());

    // Walk DOM in HTML order and replace in-place
    const all = document.querySelectorAll('body *');

    all.forEach((el) => {
      let table;

      if (el.classList.contains('no-image-hero')) {
        // table = createSectionHeader(document, el);
      } else if (el.classList.contains('feature-50-50')) {
        table = createTeaserBlock(document, el);
      } else if (el.classList.contains('card-container')) {
        table = createCardsBlock(document, el);
      } else if (el.classList.contains('text-block')) {
        table = createTextBlock(document, el);
      } else if (el.classList.contains('icon-feature')) {
        // table = createIconFeatureBlock(document, el);
      }

      if (table) {
        el.parentNode.insertBefore(table, el);
        el.remove();
      }
    });

    return main;
  },
};
