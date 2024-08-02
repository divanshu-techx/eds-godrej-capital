export default async function decorate(block) {
  const childDivs = block.querySelectorAll(':scope > div');
  childDivs.forEach((div) => {
    div.classList.add('hdfc-life-child-div');
  });
  const childDivssecond = block.querySelectorAll(
    ':scope > .hdfc-life-child-div',
  );
  childDivssecond.forEach((div) => {
    div.addEventListener('click', () => {
      const link = div.querySelector('a');
      if (link) {
        // Get the href attribute and navigate to the URL
        const url = link.getAttribute('href');
        window.location.href = url;
      }
    });
  });
}
