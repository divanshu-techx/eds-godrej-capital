function getDataAttributeValueByName(name) {
  const element = document.querySelector(`[data-${name}]`);
  return element ? element.getAttribute(`data-${name}`) : null;
}

async function decorate(block) {
  const calculatorDetailPageWrapper = document.querySelector('.calculator-detail-page-wrapper');
  const calculatorDetailPage = document.querySelector('.calculator-detail-page');

  const linksDiv = document.createElement('div');
  linksDiv.classList.add('links-div'); // Add class for styling
  let links = getDataAttributeValueByName('calculatorsLinks'); // Use let to allow reassignment

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

  calculatorDetailPageWrapper.insertBefore(linksDiv, calculatorDetailPage);

  const mobileViewContainer = document.createElement('div');
  mobileViewContainer.classList.add('mobileViewContainer');

  function handleMobileView() {
       const isMobile = window.innerWidth <= 768;
       if (isMobile) {
         mobileViewContainer.innerHTML = ''; // Clear previous content
         Array.from(calculatorDetailPage.children).forEach(child => {
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
         calculatorDetailPage.style.display = 'none'; // Hide the calculator detail page
         linksDiv.style.display = 'none'; // Hide the links div
       } else {
         mobileViewContainer.innerHTML = '';
         calculatorDetailPage.style.display = 'block'; // Show the calculator detail page
         if (links) {
           linksDiv.style.display = 'block'; // Show the links div if links are present
         }
       }
     }

  calculatorDetailPageWrapper.appendChild(mobileViewContainer);

  // Initial call
  handleMobileView();

  // Add resize event listener
  window.addEventListener('resize', handleMobileView);
}

export default decorate;
