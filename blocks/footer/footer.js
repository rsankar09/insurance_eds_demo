const ROOT = '/content/insurance-demo';

/* brand glyphs are drawn on a 24-unit grid and scaled into the 32-unit ringed icon */
const SOCIAL_GLYPHS = {
  facebook: 'M13.5 21v-7h2.4l.4-2.9h-2.8V9.3c0-.8.2-1.4 1.4-1.4h1.5V5.3c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.1H8V14h2.5v7h3z',
  linkedin: 'M6.9 8.6a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4zM5.4 10h3v9h-3v-9zm5.1 0h2.9v1.2h.1c.4-.8 1.4-1.4 2.7-1.4 2.2 0 3.4 1.3 3.4 3.8V19h-3v-4.6c0-1.1-.4-1.9-1.5-1.9s-1.6.7-1.6 1.9V19h-3v-9z',
  x: 'M17.5 5h2.6l-5.7 6.5L21 19h-5.3l-3.4-4.4L8.4 19H5.8l6.1-6.9L5.3 5h5.4l3.1 4.1L17.5 5zm-.9 12.4h1.4L9.4 6.5H7.9l8.7 10.9z',
  instagram: 'M12 7.4c-2.5 0-4.6 2-4.6 4.6s2 4.6 4.6 4.6 4.6-2 4.6-4.6-2.1-4.6-4.6-4.6zm0 7.5a3 3 0 1 1 0-5.9 3 3 0 0 1 0 5.9zm5.9-7.7a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM12 4.7c1.9 0 2.4 0 3.2.1.8 0 1.3.2 1.7.4.5.2.8.4 1.2.8s.6.7.8 1.2c.2.4.3.9.4 1.7 0 .8.1 1.3.1 3.2s0 2.4-.1 3.2c0 .8-.2 1.3-.4 1.7-.2.5-.4.8-.8 1.2s-.7.6-1.2.8c-.4.2-.9.3-1.7.4-.8 0-1.3.1-3.2.1s-2.4 0-3.2-.1c-.8 0-1.3-.2-1.7-.4-.5-.2-.8-.4-1.2-.8s-.6-.7-.8-1.2c-.2-.4-.3-.9-.4-1.7 0-.8-.1-1.3-.1-3.2s0-2.4.1-3.2c0-.8.2-1.3.4-1.7.2-.5.4-.8.8-1.2s.7-.6 1.2-.8c.4-.2.9-.3 1.7-.4.8 0 1.3-.1 3.2-.1zm0 1.5c-1.8 0-2.3 0-3.1.1-.6 0-1 .1-1.2.2-.3.1-.5.3-.7.5s-.4.4-.5.7c-.1.2-.2.6-.2 1.2 0 .8-.1 1.3-.1 3.1s0 2.3.1 3.1c0 .6.1 1 .2 1.2.1.3.3.5.5.7s.4.4.7.5c.2.1.6.2 1.2.2.8 0 1.3.1 3.1.1s2.3 0 3.1-.1c.6 0 1-.1 1.2-.2.3-.1.5-.3.7-.5s.4-.4.5-.7c.1-.2.2-.6.2-1.2 0-.8.1-1.3.1-3.1s0-2.3-.1-3.1c0-.6-.1-1-.2-1.2-.1-.3-.3-.5-.5-.7s-.4-.4-.7-.5c-.2-.1-.6-.2-1.2-.2-.8 0-1.3-.1-3.1-.1z',
  youtube: 'M19.6 9.1c-.2-.9-.7-1.5-1.6-1.7-1.4-.4-6-.4-6-.4s-4.6 0-6 .4c-.9.2-1.5.8-1.6 1.7-.2 1-.2 2.9-.2 2.9s0 1.9.2 2.9c.2.9.7 1.5 1.6 1.7 1.4.4 6 .4 6 .4s4.6 0 6-.4c.9-.2 1.5-.8 1.6-1.7.2-1 .2-2.9.2-2.9s0-1.9-.2-2.9zm-9.2 5.7V9.2l4.5 2.8-4.5 2.8z',
};

const COLUMNS = [
  {
    title: 'Choose your firm',
    links: [
      ['Bank', `${ROOT}/financial-professional/bank.html`],
      ['Credit union', `${ROOT}/financial-professional/credit-union.html`],
      ['Wirehouse', `${ROOT}/financial-professional/wirehouse.html`],
      ['Regional broker/dealer', `${ROOT}/financial-professional/regional.html`],
      ['Independent broker/dealer', `${ROOT}/financial-professional/independent.html`],
      ['Insurance professional', `${ROOT}/financial-professional/insurance-professional.html`],
      ['RIA & Wealth Manager', `${ROOT}/financial-professional/ria-and-wealth-manager.html`],
    ],
  },
  {
    title: 'Our products',
    titleHref: `${ROOT}/financial-professional/annuity-products.html`,
    links: [
      ['Product Match Pro', `${ROOT}/financial-professional/annuity-products/product-match-pro.html`],
      ['Variable annuities', `${ROOT}/financial-professional/annuity-products/variable-annuities.html`],
      ['Registered index-linked annuities', `${ROOT}/financial-professional/annuity-products/registered-index-linked-annuities.html`],
      ['Fixed index annuities', `${ROOT}/financial-professional/annuity-products/fixed-index-annuities.html`],
      ['Fixed annuities', `${ROOT}/financial-professional/annuity-products/fixed-annuities.html`],
      ['Fee-based annuities', `${ROOT}/financial-professional/annuity-products/fee-based-annuities.html`],
      ['Client needs', `${ROOT}/financial-professional/annuity-products/client-needs.html`],
    ],
  },
  {
    title: 'Tools and resources',
    titleHref: `${ROOT}/financial-professional/resources.html`,
    links: [
      ['Calculators and tools', `${ROOT}/financial-professional/resources/annuity-calculator-and-tools.html`],
      ['Client resources', `${ROOT}/financial-professional/resources/client-resources.html`],
      ['Retirement articles and insights', `${ROOT}/financial-professional/resources/retirement-articles.html`],
      ['Retirement research center', `${ROOT}/financial-professional/resources/retirement-research.html`],
      ['Find your wholesaler', `${ROOT}/financial-professional/find-your-wholesaler.html`],
    ],
  },
  {
    title: 'Why Jackson?',
    titleHref: `${ROOT}/financial-professional/why-jackson.html`,
    links: [
      ['Wholesaler support', `${ROOT}/financial-professional/why-jackson/wholesaler-support.html`],
      ['Financial strength', `${ROOT}/financial-professional/why-jackson/financial-strength.html`],
      ['Value-added services', `${ROOT}/financial-professional/why-jackson/value-added-services.html`],
      ['Customer care', `${ROOT}/financial-professional/why-jackson/customer-care.html`],
    ],
  },
  {
    title: 'Connect with us',
    social: [
      ['facebook', 'Facebook', 'https://www.facebook.com/JacksonNational'],
      ['linkedin', 'LinkedIn', 'https://www.linkedin.com/company/jackson'],
      ['x', 'X', 'https://www.twitter.com/jacksonnational'],
      ['instagram', 'Instagram', 'https://www.instagram.com/jackson_national/'],
      ['youtube', 'YouTube', 'https://www.youtube.com/user/JacksonNationalTV'],
    ],
  },
];

const LEGAL_LINKS = [
  ['Legal and Privacy', '/legal-and-privacy.html'],
  ['Cybersecurity', '/cyber-security.html'],
  ['Accessibility', `${ROOT}/financial-professional/accessibility.html`],
  ['Sitemap', `${ROOT}/financial-professional/sitemap.html`],
];

const BANK_DISCLOSURES = [
  'Not FDIC/NCUA insured',
  'Not bank/CU guaranteed',
  'May lose value',
  'Not a deposit',
  'Not insured by any federal agency',
];

/**
 * builds a ringed social icon
 * @param {string} name the glyph key in SOCIAL_GLYPHS
 * @returns {string} the svg markup
 */
function buildSocialIcon(name) {
  return `
    <svg class="social-icon" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <circle cx="16" cy="16" r="15" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <path d="${SOCIAL_GLYPHS[name]}" fill="currentColor" transform="translate(4 4)"/>
    </svg>`;
}

/**
 * builds a sitemap column, either a link list or the social icon row
 * @param {Object} column the column configuration
 * @returns {string} the column markup
 */
function buildColumn({
  title, titleHref, links, social,
}) {
  const heading = titleHref ? `<a href="${titleHref}">${title}</a>` : `<span>${title}</span>`;
  const body = social
    ? `<ul class="footer-social">
        ${social.map(([name, label, href]) => `
          <li>
            <a href="${href}" target="_blank" rel="noopener" aria-label="${label}">
              ${buildSocialIcon(name)}
            </a>
          </li>`).join('')}
      </ul>`
    : `<ul class="footer-links">
        ${links.map(([text, href]) => `<li><a href="${href}">${text}</a></li>`).join('')}
      </ul>`;

  return `
    <div class="footer-column">
      <h2 class="footer-column-title">${heading}</h2>
      ${body}
    </div>`;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default function decorate(block) {
  block.innerHTML = `
    <div class="global-footer">
      <div class="footer-sitemap">
        <div class="footer-sitemap-inner">
          <div class="footer-columns">
            ${COLUMNS.map(buildColumn).join('')}
          </div>

          <div class="footer-brand">
            <a class="footer-logo" href="${ROOT}/financial-professional.html" aria-label="Jackson home">
              <img src="content/dam/insurance-demo/jacksoncom/logo/fp_masthead_logo.svg" alt="Jackson" width="205" height="37" loading="lazy">
            </a>
            <div class="footer-legal">
              <p class="footer-copyright">&copy;${new Date().getFullYear()} All rights reserved.</p>
              <ul class="footer-legal-links">
                ${LEGAL_LINKS.map(([text, href]) => `<li><a href="${href}">${text}</a></li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-disclosures">
        <div class="footer-disclosures-inner">
          <div class="footer-disclosures-content">
            <p class="footer-bank-box">
              ${BANK_DISCLOSURES.map((text) => `<span>${text}</span>`).join('<span class="footer-bullet" aria-hidden="true">&bull;</span>')}
            </p>
            <p>
              Jackson works with vendors and other partners to help deliver online and mobile
              advertisements for Jackson that we think may be of interest to you. For more
              information about how we utilize cookies and vendors to deliver online advertising,
              please see our <a href="/legal-and-privacy.html#webprivacypolicy">Website Privacy
              Practices</a>. If you wish to opt-out of this type of advertising visit
              <a href="#showConsentPreferences" class="ot-sdk-show-settings">Do Not Share or Sell
              My Personal Information</a>.
            </p>
          </div>

          <a class="footer-brokercheck" href="https://brokercheck.finra.org/" target="_blank" rel="noopener">
            <img src="/content/dam/insurance-demo/jacksoncom/logo/broker-check.svg" alt="Check the background of this firm on BrokerCheck by FINRA" width="171" height="88" loading="lazy">
          </a>

          <p class="footer-form-number">CMC109957 04/26</p>

          <address class="footer-address">
            Jackson National Life Insurance Company<br>
            1 Corporate Way<br>
            Lansing, MI 48951
          </address>
        </div>
      </div>
    </div>
  `;
}
