const DESKTOP = window.matchMedia('(min-width: 900px)');

const CHEVRON = `
  <svg class="nav-chevron" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <path d="M2 5l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

const SEARCH = `
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <circle cx="10.5" cy="10.5" r="7" fill="none" stroke="currentColor" stroke-width="2"/>
    <path d="M15.8 15.8L21 21" fill="none" stroke="currentColor" stroke-width="2"
      stroke-linecap="round"/>
  </svg>`;

const PERSON = `
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <circle cx="12" cy="8" r="3.5" fill="none" stroke="currentColor" stroke-width="1.6"/>
    <path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" fill="none" stroke="currentColor"
      stroke-width="1.6" stroke-linecap="round"/>
  </svg>`;

const NAV_ITEMS = [
  ['Choose your firm', [
    ['Bank', '/content/insurance-demo/financial-professional/bank.html'],
    ['Credit union', '/content/insurance-demo/financial-professional/credit-union.html'],
    ['Wirehouse', '/content/insurance-demo/financial-professional/wirehouse.html'],
    ['Regional broker/dealer', '/content/insurance-demo/financial-professional/regional.html'],
    ['Independent broker/dealer', '/content/insurance-demo/financial-professional/independent.html'],
    ['Insurance professional', '/content/insurance-demo/financial-professional/insurance-professional.html'],
    ['RIA & Wealth Manager', '/content/insurance-demo/financial-professional/ria-and-wealth-manager.html'],
  ]],
  ['Our products', [
    ['Overview', '/content/insurance-demo/financial-professional/annuity-products.html'],
    ['Product Match Pro', '/content/insurance-demo/financial-professional/annuity-products/product-match-pro.html'],
    ['Variable annuities', '/content/insurance-demo/financial-professional/annuity-products/variable-annuities.html'],
    ['Registered index-linked annuities', '/content/insurance-demo/financial-professional/annuity-products/registered-index-linked-annuities.html'],
    ['Fixed index annuities', '/content/insurance-demo/financial-professional/annuity-products/fixed-index-annuities.html'],
    ['Fixed annuities', '/content/insurance-demo/financial-professional/annuity-products/fixed-annuities.html'],
    ['Fee-based annuities', '/content/insurance-demo/financial-professional/annuity-products/fee-based-annuities.html'],
    ['Client needs', '/content/insurance-demo/financial-professional/annuity-products/client-needs.html'],
  ]],
  ['Tools and resources', [
    ['Overview', '/content/insurance-demo/financial-professional/resources.html'],
    ['Calculators and tools', '/content/insurance-demo/financial-professional/resources/annuity-calculator-and-tools.html'],
    ['Client resources', '/content/insurance-demo/financial-professional/resources/client-resources.html'],
    ['Retirement articles and insights', '/content/insurance-demo/financial-professional/resources/retirement-articles.html'],
    ['Retirement research center', '/content/insurance-demo/financial-professional/resources/retirement-research.html'],
  ]],
  ['Why Jackson?', [
    ['Overview', '/content/insurance-demo/financial-professional/why-jackson.html'],
    ['Wholesaler support', '/content/insurance-demo/financial-professional/why-jackson/wholesaler-support.html'],
    ['Financial strength', '/content/insurance-demo/financial-professional/why-jackson/financial-strength.html'],
    ['Value-added services', '/content/insurance-demo/financial-professional/why-jackson/value-added-services.html'],
    ['Customer care', '/content/insurance-demo/financial-professional/why-jackson/customer-care.html'],
  ]],
];

/**
 * builds a nav item with its dropdown menu
 * @param {string} label the nav item label
 * @param {Array} items array of [text, href] pairs
 * @param {number} index position of the item, used to link trigger and menu
 * @returns {string} the nav item markup
 */
function buildDrop(label, items, index) {
  const id = `masthead-menu-${index}`;
  return `
    <li class="nav-item">
      <button class="nav-trigger" type="button" aria-expanded="false" aria-controls="${id}">
        <span>${label}</span>
        ${CHEVRON}
      </button>
      <ul class="nav-dropdown" id="${id}">
        ${items.map(([text, href]) => `<li><a href="${href}">${text}</a></li>`).join('')}
      </ul>
    </li>
  `;
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default function decorate(block) {
  block.innerHTML = `
    <div class="masthead">
      <div class="masthead-utility">
        <ul class="site-selector">
          <li><a href="/">Individuals</a></li>
          <li class="active"><a href="/content/insurance-demo/financial-professional.html" aria-current="page">Financial professionals</a></li>
        </ul>
      </div>

      <div class="masthead-main">
        <a class="masthead-logo" href="/content/insurance-demo/financial-professional.html" aria-label="Jackson home">
          <img src="/icons/fp_masthead_logo.svg" alt="Jackson" width="205" height="37" loading="eager">
        </a>

        <div class="masthead-actions">
          <a class="secondary-button" href="/content/insurance-demo/financial-professional/get-appointed.html">Get appointed</a>
          <a class="primary-button" href="/login/login.xhtml?showFpSiteNavigation=true">
            ${PERSON}<span>Sign in</span>
          </a>
        </div>

        <div class="masthead-bar">
          <nav class="masthead-nav" aria-label="Main">
            <ul class="nav-list">
              ${NAV_ITEMS.map(([label, items], i) => buildDrop(label, items, i)).join('')}
            </ul>
          </nav>

          <button class="hamburger" type="button" aria-label="Open menu" aria-expanded="false">
            <span class="hamburger-icon"></span>
          </button>

          <button class="search-icon" type="button" aria-label="Search">${SEARCH}</button>
        </div>
      </div>
    </div>
  `;

  const masthead = block.querySelector('.masthead');
  const hamburger = block.querySelector('.hamburger');
  const drops = [...block.querySelectorAll('.nav-item')];

  const closeDrops = () => {
    drops.forEach((drop) => {
      drop.classList.remove('expanded', 'align-right');
      drop.querySelector('.nav-trigger').setAttribute('aria-expanded', 'false');
    });
  };

  const closeMenu = () => {
    masthead.classList.remove('expanded');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open menu');
    document.body.style.overflowY = '';
    closeDrops();
  };

  hamburger.addEventListener('click', () => {
    if (masthead.classList.contains('expanded')) {
      closeMenu();
      return;
    }
    masthead.classList.add('expanded');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close menu');
    if (!DESKTOP.matches) document.body.style.overflowY = 'hidden';
  });

  drops.forEach((drop) => {
    const trigger = drop.querySelector('.nav-trigger');
    const dropdown = drop.querySelector('.nav-dropdown');
    trigger.addEventListener('click', () => {
      const open = drop.classList.contains('expanded');
      closeDrops();
      if (open) return;
      drop.classList.add('expanded');
      trigger.setAttribute('aria-expanded', 'true');
      // flip menus that would overflow the viewport to align with the trigger's right edge
      if (DESKTOP.matches && dropdown.getBoundingClientRect().right > window.innerWidth - 16) {
        drop.classList.add('align-right');
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!block.contains(e.target)) closeDrops();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (masthead.classList.contains('expanded')) closeMenu();
    else closeDrops();
  });

  DESKTOP.addEventListener('change', closeMenu);
}
