// export default decorate;
export default async function decorate(block) {
  const calculatorDetailPageWrapper = block.parentElement;
  const defaultWrapper = calculatorDetailPageWrapper.parentElement;

  // Find or create the calculator-links div
  let linksDiv = defaultWrapper.querySelector('.calculator-links');
  if (!linksDiv) {
    linksDiv = document.createElement('div');
    linksDiv.classList.add('calculator-links');
    defaultWrapper.insertBefore(linksDiv, calculatorDetailPageWrapper);
  }

  // Add class to calculator-links div and its children
  linksDiv.classList.add('links-div');
  Array.from(linksDiv.children).forEach(child => {
    addClassToElementAndDescendants(child, 'calculator-links-child');
    child.children[0].classList.add('calculator-links-child-child');

    // Convert <p> tags to <div> tags while preserving buttons
    Array.from(child.children[0].getElementsByTagName('p')).forEach(paragraph => {
      const divElement = document.createElement('div');
      divElement.classList.add('calculator-button');

      // Move buttons from <p> to newly created <div>
      Array.from(paragraph.childNodes).forEach(node => {
        divElement.appendChild(node.cloneNode(true));
      });

      paragraph.parentNode.replaceChild(divElement, paragraph);
    });
  });

  // Add class to calculator detail page children and their descendants
  Array.from(block.children).forEach(child => {
    addClassToElementAndDescendants(child, 'calculator-detail-page_v1');
  });

  // Handle initial view based on window size
  handleMobileView(block);

  // Add resize event listener
  window.addEventListener('resize', () => {
    handleMobileView(block);
  });
}

function addClassToElementAndDescendants(element, className) {
  element.classList.add(className);

  if (element.classList.contains('calculator-detail-page_v1')) {
    if (element.children.length >= 2) {
      const newDiv = document.createElement('div');
      newDiv.classList.add('last-two-divs');

      const lastTwoChildren = Array.from(element.children).slice(-2);
      lastTwoChildren.forEach((child, index) => {
        const lastTwoDiv = document.createElement('div');
        if (index === 0) {
          lastTwoDiv.classList.add('first-last-two-child');
          child.classList.add('first-child-of-last-two');
        } else {
          lastTwoDiv.classList.add('second-last-two-child');
          child.classList.add('second-child-of-last-two');
        }
        lastTwoDiv.appendChild(child);
        newDiv.appendChild(lastTwoDiv);
      });

      element.appendChild(newDiv);
    }
  }

  Array.from(element.getElementsByTagName('div')).forEach((div, index) => {
    if (index === 0) div.classList.add('inner-div');
  });
}
function handleMobileView(block) {
  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    block.style.display = 'none';
  } else {
    block.style.display = 'block';
  }
}
