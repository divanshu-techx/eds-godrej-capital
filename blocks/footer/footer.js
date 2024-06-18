import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta
    ? new URL(footerMeta, window.location).pathname
    : '/footer';
  const fragment = await loadFragment(footerPath);
  block.textContent = '';
  const footer = document.createElement('div');
  footer.id = 'footer-items';
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  const classes = ['footer-1', 'footer-2', 'footer-3'];
  classes.forEach((c, i) => {
    const section = footer.children[i];
    if (section) section.classList.add(`footer-${c}`);
  });

  const footerSections = footer.querySelector('.footer-footer-1');
  if (footerSections) {
    footerSections
      .querySelectorAll(':scope .default-content-wrapper > ul > li')
      .forEach((footerSection) => {
        footerSection.setAttribute('aria-expanded', 'false');
        footerSection.setAttribute('role', 'button');
        footerSection.setAttribute('tabindex', '0');

        if (footerSection.querySelector('ul'))
          footerSection.classList.add('footer-li');
        footerSection.addEventListener('click', () => {
          if (isDesktop.matches) {
            const expanded =
              footerSection.getAttribute('aria-expanded') === 'true';
            footerSection.setAttribute(
              'aria-expanded',
              expanded ? 'false' : 'true'
            );
          }
        });
      });
  }
  const thirdsection = footer.querySelector(
    '.third-section-wrapper > .third-section'
  );
  const enterinside = thirdsection.querySelector('div');
  enterinside.classList.add('third-section_part');
  const enterinsidediv = enterinside.querySelectorAll('div');
  enterinsidediv.forEach((elm) => {
    elm.classList.add('third-section_part-subparts');
  });
  block.append(footer);
}

