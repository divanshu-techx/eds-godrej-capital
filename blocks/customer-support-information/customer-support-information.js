export default async function decorate(block) {
  const divElements = block.querySelectorAll('.customer-support-information > div');
  divElements.forEach((div, index) => {
    div.classList.add(`custom-title-icon`);
  });
  // for mobile view
  const accordionWrappers = document.getElementsByClassName('accordion-support-wrapper');
  const titleContentEle = document.getElementsByClassName('mobilegrievancetab-wrapper');
  if (titleContentEle.length > 0) {
    const supportContainerDiv = document.createElement('div');
    supportContainerDiv.className = 'table-content-container';
    supportContainerDiv.appendChild(titleContentEle[0]);
    const parentElement = document.querySelector('.accordion-support.support-table-name.block > div');
    if (parentElement) {
      parentElement.appendChild(supportContainerDiv);
    } else {
      console.error('Parent element not found.');
    }
  } else {
    console.error('Element with class "tabs-wrapper" not found.');
  }
  Array.from(accordionWrappers).forEach((wrapper) => {
    const accordions = wrapper.querySelectorAll('.accordion-support > div');
    accordions.forEach((accordion) => {
      const header = accordion.children[0];
      const content = accordion.children[1];
      header.classList.add('accordion-header');
      content.classList.add('accordion-content');
      header.addEventListener('click', () => {
        const isActive = header.classList.contains('active-show');
        accordions.forEach((acc) => {
          acc.children[0].classList.remove('active-show');
          acc.children[1].classList.remove('active-show');
          // header.parentElement.parentElement.classList.remove('active-support-table');
        });
        if (!isActive) {
          header.classList.add('active-show');
          content.classList.add('active-show');
          //  header.parentElement.parentElement.classList.add('active-support-table');
        }
      });
    });
  });
}
// change screen ui accordingly desktop and mobile view
function setDisplaySingle(className, displayValue) {
  const element = document.querySelector(`.${className}`);
  if (element) {
    element.style.display = displayValue;
  }
}
function handleResize() {
  if (window.innerWidth <= 1198) {
    setDisplaySingle('supportcards-column-first-wrapper', 'none');
    setDisplaySingle('supportcards-column-second-wrapper', 'none');
    setDisplaySingle('supportcards-column-third-wrapper', 'none');
    setDisplaySingle('support-table-ui', 'none');
    setDisplaySingle('customer-support-information-container', 'block');
  } else {
    setDisplaySingle('supportcards-column-first-wrapper', 'block');
    setDisplaySingle('supportcards-column-second-wrapper', 'block');
    setDisplaySingle('supportcards-column-third-wrapper', 'block');
    setDisplaySingle('support-table-ui', 'block');
    setDisplaySingle('customer-support-information-container', 'none');
  }
}
// Execute on page load
window.addEventListener('load', handleResize);
// Execute on window resize
window.addEventListener('resize', handleResize);
