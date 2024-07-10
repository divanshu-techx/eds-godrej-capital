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

  handleMobileView(mobileViewContainer, block, linksDiv);

  window.addEventListener('resize', () => {
    handleMobileView(mobileViewContainer, block, linksDiv);
  });
}

function addClassToElementAndDescendants(element, className) {
  element.classList.add(className);
  // Recursively add the class to all descendant div elements
  Array.from(element.getElementsByTagName('div')).forEach(div => {
    div.classList.add(className + '-internal'); // Adding 'calculator-child' class to divs inside 'calculator-child'
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
    // Clear previous content
    mobileViewContainer.innerHTML = '';

    // Loop through the block's children and create links
    Array.from(block.children).forEach(child => {
      const childDivs = child.children;
      if (childDivs.length >= 3) {
        const thirdDiv = childDivs[2].cloneNode(true);
        const linkElement = document.createElement('a');
        linkElement.href = '#'; // Set the href attribute to make it clickable, change this to the actual URL if available
        linkElement.classList.add('mobile-link-element'); // Add class for styling
        linkElement.appendChild(thirdDiv);
        mobileViewContainer.appendChild(linkElement);
      }
    });

    // Hide the calculator detail page and links div
    block.style.display = 'none';
    linksDiv.style.display = 'none';
  } else {
    // Clear previous content in the mobile view container
    mobileViewContainer.innerHTML = '';

    // Show the calculator detail page and links div if links are present
    block.style.display = 'block';
    if (linksDiv) {
      linksDiv.style.display = 'block';
    }
  }
}
