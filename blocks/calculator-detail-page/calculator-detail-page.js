// export default decorate;
export default async function decorate(block) {
  const calculatorDetailPageWrapper = block.parentElement;
  const defaultWrapper = calculatorDetailPageWrapper.parentElement;

  const mobileViewContainer = document.createElement('div');
  mobileViewContainer.classList.add('mobileViewContainer');
  calculatorDetailPageWrapper.append(mobileViewContainer);

  const linksDiv = document.createElement('div');
  linksDiv.classList.add('links-div');
  defaultWrapper.append(linksDiv);

  let links = getDataAttributeValueByName('calculatorsLinks'); // Use let to allow reassignment
  displayLinks(links, linksDiv);
  calculatorDetailPageWrapper.insertBefore(linksDiv, block);

  // Add class to calculator detail page children and their descendants
  Array.from(block.children).forEach(child => {
    addClassToElementAndDescendants(child, 'calculator-detail-page_v1'); // Adding 'calculator-child' class
  });

       // Create a new div to wrap the linksDiv content

 const linksClone = linksDiv.cloneNode(true); // Clone the linksDiv
 linksClone.classList.add('mobile-links-wrapper'); // Add class to the cloned div
 linksClone.classList.remove('links-div'); // Remove the original class if needed            // Append the cloned linksDiv to mobileViewContainer
 mobileViewContainer.appendChild(linksClone);
             Array.from(linksClone.children).forEach(child => {
                 addClassToElementAndDescendants(child, 'mobile-view-child'); // Adding 'calculator-child' class
//                 child.classList.add('sigle-div')

               });
  window.addEventListener('resize', () => {
    handleMobileView(mobileViewContainer, block, linksDiv);
  });


}
function addClassToElementAndDescendants(element, className) {
  element.classList.add(className);

  // Check if the element is a calculator-detail-page_v1
  if (element.classList.contains('calculator-detail-page_v1')) {
    // Ensure there are at least two child elements to wrap
    if (element.children.length >= 2) {
      // Create a new div to wrap the last two children
      const newDiv = document.createElement('div');
      newDiv.classList.add('last-two-divs'); // Add class to the new div

      // Move the last two children into the new div
      const lastTwoChildren = Array.from(element.children).slice(-2); // Get the last two children
      lastTwoChildren.forEach((child, index) => {
        const lastTwoDiv = document.createElement('div');
        if (index === 0) {
          lastTwoDiv.classList.add('first-last-two-child'); // Class for first div in last two
          child.classList.add('first-child-of-last-two'); // Add class to first child of last two

        } else {
          lastTwoDiv.classList.add('second-last-two-child'); // Class for second div in last two
          child.classList.add('second-child-of-last-two'); // Add class to second child of last two
        }

        // Change class of div elements inside last two children div


        lastTwoDiv.appendChild(child);
        newDiv.appendChild(lastTwoDiv);
      });

      // Append the new div at the end of the calculator-detail-page_v1
      element.appendChild(newDiv);
    }
  }

  // Recursively add the class to all descendant div elements
  Array.from(element.getElementsByTagName('div')).forEach((div,index) => {
    if(index==0)
    div.classList.add('inner-div'); // Adding 'inner-div' class to all divs inside 'calculator-detail-page_v1'
  });
}





function getDataAttributeValueByName(name) {
  const element = document.querySelector(`[data-${name}]`);
  return element ? element.getAttribute(`data-${name}`) : null;
}

function displayLinks(links, linksDiv) {
  if (links) {
    linksDiv.style.display = 'block'; // Initially show links div

    links = links.split(',');
    links = links.map(link => {
      return link.trim().charAt(0).toUpperCase() + link.slice(1).trim(); // Trim spaces around links
    });

    links.forEach(link => {
      const linkElement = document.createElement('a');
      linkElement.textContent = link;
      linkElement.href = '#'; // Set the href attribute to make it clickable, change this to the actual URL if available
      linkElement.classList.add('link-element'); // Add class for styling
      linksDiv.appendChild(linkElement);
    });
  } else {
    linksDiv.style.display = 'none'; // Hide links div if no links are found
  }
}

function handleMobileView(mobileViewContainer, block, linksDiv) {
  // Determine if the current view is mobile
  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    // Clear previous content in the mobile view container
    // Hide the calculator detail page and original linksDiv
    block.style.display = 'none';
    linksDiv.style.display = 'none';
    mobileViewContainer.style.display='block'

  } else {
    // Clear previous content in the mobile view container
    //mobileViewContainer.innerHTML = '';

    // Show the calculator detail page and linksDiv
    block.style.display = 'block';
    linksDiv.style.display = 'block';
     mobileViewContainer.style.display='none'
  }

}





