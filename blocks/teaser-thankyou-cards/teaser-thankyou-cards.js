export default function decorate(block) {
  const cols = block.firstElementChild.children.length;
  block.parentElement.classList.add(`teaser-cards-${cols}`);
  // go through all teasers
  [...block.children].forEach((row) => [...row.children].forEach((elem) => {
    // add teaser class for each entry
    elem.classList.add('teaser');
    if (elem.querySelector('.cta-list')) {
      elem.classList.add('with-cta-list');
    }
    // give p containing the image a specific class
    const picture = elem.querySelector('picture');
    if (picture && picture.closest('p')) {
      picture.closest('p').classList.add('image');
    }
    elem
      .querySelector('p:not(.image, .button-container)')
      ?.classList.add('text');

    // add class to all p elements immediately after any heading (h1 to h6)
    const headings = elem.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading) => {
      let nextElem = heading.nextElementSibling;
      while (nextElem && nextElem.tagName === 'P') {
        nextElem.classList.add('special-paragraph');
        nextElem = nextElem.nextElementSibling;
      }
    });

    // give cta's link(s) a specific class name
    const ctaLinks = elem.querySelectorAll('.button-container a.button');
    ctaLinks.forEach((cta) => {
      cta.classList.add('cta');
    });
  }));
}
