import {
  sampleRUM,
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
  loadSubHeader,
  loadSecFooter,
  // loadheaderMobile,
  getMetadata,
} from './aem.js';
import ffetch from './ffetch.js';
import { createExpression , renderExpressions} from './expressions.js';
const LCP_BLOCKS = []; // add your LCP blocks to the list

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const firstSection = main.querySelector('div');
  if (!firstSection) return;
  const firstElement = firstSection.firstElementChild;
  if (firstElement.tagName === 'DIV' && firstElement.classList.length && !firstElement.classList.contains('hero')) return;
}

async function fetchInterestRates() {
  const interestRates = await ffetch('/interest-rates-sheet.json').all();
  return interestRates;
}


  createExpression('interest', ({ context, args }) => {
    const subcategory = args;
    const interestRateData = context.find(item => item.key == subcategory);
    const interest = interestRateData ? interestRateData.interest_rate : 'N/A';
    return `${interest}%`;
  });

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

function updateLinks() {
  // Get all anchor tags in the document
  const links = document.querySelectorAll('a');

  links.forEach(link => {
      // Check if the href contains the specified base URL
      const url = new URL(link.href);
      if (url.searchParams.has('gtm')) {
          // Get the gtm value
          const gtmValue = url.searchParams.get('gtm');

          // Add data attribute with the gtm value
          link.setAttribute('id', gtmValue);

          // Remove the gtm query parameter from the URL
          url.searchParams.delete('gtm');
          link.href = url.toString();
      }
  });
}

function updateButtonWithGtm() {
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    if (button.hasAttribute('data-path')) {
      let redirectionUrl = new URL(button.getAttribute('data-path'), window.location.origin);
      if (redirectionUrl) {
        // Get the gtm value
        const gtmValue = redirectionUrl.searchParams.get('gtm');

        // Add data attribute with the gtm value
        button.setAttribute('id', gtmValue);

        // Remove the gtm query parameter from the URL
        redirectionUrl.searchParams.delete('gtm');
        button.href = redirectionUrl.toString();
      } else {
        return;
      }
    }
    else {
      return;
    }
  })
}

function getAnchorButtonTag() {
  const buttonEle = document.querySelectorAll('button');
  const anchorEle = document.querySelectorAll('a');

  buttonEle.forEach(button => {
    button.addEventListener('click', function() {
      const gtmValue = this.getAttribute('data-gtm');
      if (gtmValue) {
        dataStoreInDataLayer(gtmValue);
      }
      console.log('Button clicked:', gtmValue);
    });
  });

  anchorEle.forEach(anchor => {
    anchor.addEventListener('click', function() {
      const gtmValue = this.getAttribute('data-gtm');
      if (gtmValue) {
        dataStoreInDataLayer(gtmValue);
      }
      console.log('Anchor clicked:', gtmValue);
    });
  });
}

function dataStoreInDataLayer(gtmValue) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'gtmEvent': gtmValue ? gtmValue : 'NA'
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  updateLinks();
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await waitForLCP(LCP_BLOCKS);
     // Render the expressions in the DOM
     let interestRate = await fetchInterestRates();
     const context = {
      interestRate: 5.25 // or fetch dynamically from an API
    };
    renderExpressions(main,interestRate);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  // loadheaderMobile(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));
  loadSecFooter(doc.querySelector('footer'));
  loadSubHeader(doc.querySelector('header'));
  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();

  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
  updateButtonWithGtm();
  getAnchorButtonTag();
}

loadPage();
