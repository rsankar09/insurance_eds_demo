const DESKTOP = window.matchMedia('(min-width: 900px)');

export default function decorate(block) {
  block.innerHTML = `
    <div class="masthead">
      <div class="masthead-top">
        <ul class="site-selector">
          <li><a href="/">Individuals</a></li>
          <li class="active"><a href="/financial-professional.html">Financial professionals</a></li>
        </ul>

        <a class="masthead-logo" href="/financial-professional.html">
          <img src="/content/dam/insurance-demo/jacksoncom/logo/fp_masthead_logo.svg" alt="Jackson">
        </a>

        <div class="masthead-icons">
          <button class="search-icon" aria-label="Search"></button>
          <button class="hamburger" aria-label="Menu"></button>
        </div>

        <div class="masthead-actions">
          <a class="secondary-button" href="/financial-professional/get-appointed.html">Get appointed</a>
          <a class="primary-button" href="/login/login.xhtml?showFpSiteNavigation=true">Sign in</a>
        </div>
      </div>

      <nav class="masthead-nav" aria-expanded="false">
        ${buildDrop('Choose your firm', [
          ['Bank', '/financial-professional/bank.html'],
          ['Credit union', '/financial-professional/credit-union.html'],
          ['Wirehouse', '/financial-professional/wirehouse.html'],
          ['Regional broker/dealer', '/financial-professional/regional.html'],
          ['Independent broker/dealer', '/financial-professional/independent.html'],
          ['Insurance professional', '/financial-professional/insurance-professional.html'],
          ['RIA & Wealth Manager', '/financial-professional/ria-and-wealth-manager.html'],
        ])}

        ${buildDrop('Our products', [
          ['Overview', '/financial-professional/annuity-products.html'],
          ['Product Match Pro', '/financial-professional/annuity-products/product-match-pro.html'],
          ['Variable annuities', '/financial-professional/annuity-products/variable-annuities.html'],
          ['Registered index-linked annuities', '/financial-professional/annuity-products/registered-index-linked-annuities.html'],
          ['Fixed index annuities', '/financial-professional/annuity-products/fixed-index-annuities.html'],
          ['Fixed annuities', '/financial-professional/annuity-products/fixed-annuities.html'],
          ['Fee-based annuities', '/financial-professional/annuity-products/fee-based-annuities.html'],
          ['Client needs', '/financial-professional/annuity-products/client-needs.html'],
        ])}

        ${buildDrop('Tools and resources', [
          ['Overview', '/financial-professional/resources.html'],
          ['Calculators and tools', '/financial-professional/resources/annuity-calculator-and-tools.html'],
          ['Client resources', '/financial-professional/resources/client-resources.html'],
          ['Retirement articles and insights', '/financial-professional/resources/retirement-articles.html'],
          ['Retirement research center', '/financial-professional/resources/retirement-research.html'],
        ])}

        ${buildDrop('Why Jackson?', [
          ['Overview', '/financial-professional/why-jackson.html'],
          ['Wholesaler support', '/financial-professional/why-jackson/wholesaler-support.html'],
          ['Financial strength', '/financial-professional/why-jackson/financial-strength.html'],
          ['Value-added services', '/financial-professional/why-jackson/value-added-services.html'],
          ['Customer care', '/financial-professional/why-jackson/customer-care.html'],
        ])}
      </nav>
    </div>
  `;

  const nav = block.querySelector('.masthead-nav');
  const hamburger = block.querySelector('.hamburger');
  const drops = block.querySelectorAll('.nav-item');

  function toggleNav() {
    const expanded = nav.getAttribute('aria-expanded') === 'true';
    nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    document.body.style.overflowY = expanded || DESKTOP.matches ? '' : 'hidden';
  }

  hamburger.addEventListener('click', toggleNav);

  drops.forEach((drop) => {
    const trigger = drop.querySelector('.nav-trigger');
    trigger.addEventListener('click', () => {
      const open = drop.classList.contains('expanded');
      drops.forEach((d) => d.classList.remove('expanded'));
      drop.classList.toggle('expanded', !open);
    });
  });

  DESKTOP.addEventListener('change', () => {
    nav.setAttribute('aria-expanded', 'false');
    drops.forEach((d) => d.classList.remove('expanded'));
  });
}

function buildDrop(label, items) {
  return `
    <div class="nav-item">
      <button class="nav-trigger">${label}</button>
      <ul class="nav-dropdown">
        ${items.map(([text, href]) => `<li><a href="${href}">${text}</a></li>`).join('')}
      </ul>
    </div>
  `;
}
