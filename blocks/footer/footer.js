import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */

function getDataAttributeValueByName(name) {
  const element = document.querySelector(`[data-${name}]`);
  return element ? element.getAttribute(`data-${name}`) : '';
}
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
        if (footerSection.querySelector('ul')) { footerSection.classList.add('footer-li'); }
        footerSection.addEventListener('click', () => {
          if (isDesktop.matches) {
            const expanded = footerSection.getAttribute('aria-expanded') === 'true';
            footerSection.setAttribute(
              'aria-expanded',
              expanded ? 'false' : 'true',
            );
          }
        });
      });
  }
  const thirdsection = footer.querySelector(
    '.third-section-wrapper > .third-section',
  );
  const enterinside = thirdsection.querySelector('div');
  enterinside.classList.add('third-section_part');
  const enterinsidediv = enterinside.querySelectorAll('div');
  enterinsidediv.forEach((elm) => {
    elm.classList.add('third-section_part-subparts');
  });

  block.append(footer);

  const partionBlockClass = ['godrej-icon', 'godrej-address', 'godrej-phone-contact', 'godrej-email', 'godrej-social-account'];
  const partitionBlock = block.querySelector('.partitionfirstcolumn');
  const partionAll = partitionBlock.querySelectorAll(':Scope>div');
  partionAll.forEach((elm, i) => {
    elm.classList.add(partionBlockClass[i]);
  });

  const godrejIcon = block.querySelector('.godrej-icon');

  const godrejIconLink = getDataAttributeValueByName('godrejIconLink');
  const godrejYoutubeLink = getDataAttributeValueByName('godrejYoutubeLink');
  const godrejFacebookLink = getDataAttributeValueByName('godrejFacebookLink');
  const godrejLinkdInLink = getDataAttributeValueByName('godrejLinkdInLink');
  const godrejInstaLink = getDataAttributeValueByName('godrejInstaLink');
  const godrejTwitterLink = getDataAttributeValueByName('godrejTwitterLink');

  godrejIcon.addEventListener('click', () => {
    window.location.href = godrejIconLink;
  });

  const godrejSocial = block.querySelectorAll('.godrej-social-account > div >p');
  godrejSocial.forEach((elm, i) => {
    elm.classList.add(`social-media${i}`)
  });

  const socialIconclass = ['godrej-twitter', 'godrej-youtube', 'godrej-facebook', 'godrej-linkdin', 'godrej-insta'];
  const socialMediaIcons = block.querySelectorAll('.social-media1 > picture');
  socialMediaIcons.forEach((elm, i) => {
    elm.classList.add(socialIconclass[i]);
  });

  const godrejTwitter = block.querySelector('.godrej-twitter');
  const godrejYoutube = block.querySelector('.godrej-youtube');
  const godrejFacebook = block.querySelector('.godrej-facebook');
  const godrejLinkdIn = block.querySelector('.godrej-linkdin');
  const godrejInsta = block.querySelector('.godrej-insta');

  godrejTwitter.addEventListener('click', () => {
    window.location.href = godrejTwitterLink;
  });
  godrejYoutube.addEventListener('click', () => {
    window.location.href = godrejYoutubeLink;
  });
  godrejFacebook.addEventListener('click', () => {
    window.location.href = godrejFacebookLink;
  });
  godrejLinkdIn.addEventListener('click', () => {
    window.location.href = godrejLinkdInLink;
  });
  godrejInsta.addEventListener('click', () => {
    window.location.href = godrejInstaLink;
  });
}
