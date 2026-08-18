// import { getMetadata } from '../../scripts/aem.js';
// import { loadFragment } from '../fragment/fragment.js';

// // media query match that indicates mobile/tablet width
// const isDesktop = window.matchMedia('(min-width: 900px)');

// function closeOnEscape(e) {
//   if (e.code === 'Escape') {
//     const nav = document.getElementById('nav');
//     const navSections = nav.querySelector('.nav-sections');
//     if (!navSections) return;
//     const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
//     if (navSectionExpanded && isDesktop.matches) {
//       // eslint-disable-next-line no-use-before-define
//       toggleAllNavSections(navSections);
//       navSectionExpanded.focus();
//     } else if (!isDesktop.matches) {
//       // eslint-disable-next-line no-use-before-define
//       toggleMenu(nav, navSections);
//       nav.querySelector('button').focus();
//     }
//   }
// }

// function closeOnFocusLost(e) {
//   const nav = e.currentTarget;
//   if (!nav.contains(e.relatedTarget)) {
//     const navSections = nav.querySelector('.nav-sections');
//     if (!navSections) return;
//     const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
//     if (navSectionExpanded && isDesktop.matches) {
//       // eslint-disable-next-line no-use-before-define
//       toggleAllNavSections(navSections, false);
//     } else if (!isDesktop.matches) {
//       // eslint-disable-next-line no-use-before-define
//       toggleMenu(nav, navSections, false);
//     }
//   }
// }

// function openOnKeydown(e) {
//   const focused = document.activeElement;
//   const isNavDrop = focused.className === 'nav-drop';
//   if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
//     const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
//     // eslint-disable-next-line no-use-before-define
//     toggleAllNavSections(focused.closest('.nav-sections'));
//     focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
//   }
// }

// function focusNavSection() {
//   document.activeElement.addEventListener('keydown', openOnKeydown);
// }

// /**
//  * Toggles all nav sections
//  * @param {Element} sections The container element
//  * @param {Boolean} expanded Whether the element should be expanded or collapsed
//  */
// function toggleAllNavSections(sections, expanded = false) {
//   if (!sections) return;
//   sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
//     section.setAttribute('aria-expanded', expanded);
//   });
// }

// /**
//  * Toggles the entire nav
//  * @param {Element} nav The container element
//  * @param {Element} navSections The nav sections within the container element
//  * @param {*} forceExpanded Optional param to force nav expand behavior when not null
//  */
// function toggleMenu(nav, navSections, forceExpanded = null) {
//   const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
//   const button = nav.querySelector('.nav-hamburger button');
//   document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
//   nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
//   toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
//   button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
//   // enable nav dropdown keyboard accessibility
//   if (navSections) {
//     const navDrops = navSections.querySelectorAll('.nav-drop');
//     if (isDesktop.matches) {
//       navDrops.forEach((drop) => {
//         if (!drop.hasAttribute('tabindex')) {
//           drop.setAttribute('tabindex', 0);
//           drop.addEventListener('focus', focusNavSection);
//         }
//       });
//     } else {
//       navDrops.forEach((drop) => {
//         drop.removeAttribute('tabindex');
//         drop.removeEventListener('focus', focusNavSection);
//       });
//     }
//   }

//   // enable menu collapse on escape keypress
//   if (!expanded || isDesktop.matches) {
//     // collapse menu on escape press
//     window.addEventListener('keydown', closeOnEscape);
//     // collapse menu on focus lost
//     nav.addEventListener('focusout', closeOnFocusLost);
//   } else {
//     window.removeEventListener('keydown', closeOnEscape);
//     nav.removeEventListener('focusout', closeOnFocusLost);
//   }
// }

// /**
//  * loads and decorates the header, mainly the nav
//  * @param {Element} block The header block element
//  */
// export default async function decorate(block) {
//   // load nav as fragment
//   const navMeta = getMetadata('nav');
//   const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
//   const fragment = await loadFragment(navPath);

//   // decorate nav DOM
//   block.textContent = '';
//   const nav = document.createElement('nav');
//   nav.id = 'nav';
//   while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

//   const classes = ['brand', 'sections', 'tools'];
//   classes.forEach((c, i) => {
//     const section = nav.children[i];
//     if (section) section.classList.add(`nav-${c}`);
//   });

//   const navBrand = nav.querySelector('.nav-brand');
//   const brandLink = navBrand.querySelector('.button');
//   if (brandLink) {
//     brandLink.className = '';
//     brandLink.closest('.button-container').className = '';
//   }

//   const navSections = nav.querySelector('.nav-sections');
//   if (navSections) {
//     navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
//       if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
//       navSection.addEventListener('click', () => {
//         if (isDesktop.matches) {
//           const expanded = navSection.getAttribute('aria-expanded') === 'true';
//           toggleAllNavSections(navSections);
//           navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
//         }
//       });
//     });
//   }

//   // hamburger for mobile
//   const hamburger = document.createElement('div');
//   hamburger.classList.add('nav-hamburger');
//   hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
//       <span class="nav-hamburger-icon"></span>
//     </button>`;
//   hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
//   nav.prepend(hamburger);
//   nav.setAttribute('aria-expanded', 'false');
//   // prevent mobile nav behavior on window resize
//   toggleMenu(nav, navSections, isDesktop.matches);
//   isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

//   const navWrapper = document.createElement('div');
//   navWrapper.className = 'nav-wrapper';
//   navWrapper.append(nav);
//   block.append(navWrapper);
// }


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
