export default async function decorate(block) {

  // add all child div class name
  getChildNames('support-landing-cards');

  // Add text in nackground image
  let element = document.querySelectorAll('.support-landing-cards-child')[1];
  let pictureElement = element.querySelector('picture');
  let img = pictureElement.querySelector('img').src;
  let ImgEle = element.querySelectorAll('div')[1];
  ImgEle.style.backgroundImage = `url(${img})`;
  ImgEle.style.width = '317px';
  ImgEle.style.height = '281px';
  ImgEle.style.backgroundSize = 'cover';
  ImgEle.style.marginLeft = '-25px';
  ImgEle.style.marginTop = '-35px';
  ImgEle.style.borderRadius = '10px';
  ImgEle.style.backgroundRepeat = 'no-repeat';
  ImgEle.style.backgroundPosition = 'center center';
  ImgEle.parentElement.style.overflow = 'hidden';
  element.removeChild(element.firstElementChild);

  // get all the child elements divs
  let zerothDiv = document.querySelectorAll('.support-landing-cards-child')[0];
  let firstDiv = document.querySelectorAll('.support-landing-cards-child')[1];
  let secondDiv = document.querySelectorAll('.support-landing-cards-child')[2];
  let thirdDiv = document.querySelectorAll('.support-landing-cards-child')[3];
  let fourthDiv = document.querySelectorAll('.support-landing-cards-child')[4];
  let fifthDiv = document.querySelectorAll('.support-landing-cards-child')[5];
  let sixthDiv = document.querySelectorAll('.support-landing-cards-child')[6];
  let seventhDiv = document.querySelectorAll('.support-landing-cards-child')[7];
  let eigthDiv = document.querySelectorAll('.support-landing-cards-child')[8];
  let parentEle = document.getElementsByClassName('support-landing-cards')[0];

  // get first partition div which contain customerquery, image, whats-up div
  const containerDivForCustomer = createDivElement('containerDivForCustomer');
  const imageDiv = createDivElement('imageDiv');
  let forCustomerDivEle = zerothDiv;
  let imageDivEle = firstDiv;
  imageDiv.appendChild(forCustomerDivEle);
  imageDiv.appendChild(imageDivEle);
  containerDivForCustomer.appendChild(imageDiv);
  let whatupDivEle = fourthDiv;
  containerDivForCustomer.appendChild(whatupDivEle);

  // get second partition div which contain investor query, faq, gia chatbot
  const containerDivForInvestor = createDivElement('containerDivForInvestor');

  // append investor query and faq
  const faqDiv = createDivElement('faqDiv');
  let forInvestQuery = secondDiv;
  let forFaqElem = thirdDiv;
  faqDiv.appendChild(forInvestQuery);
  faqDiv.appendChild(forFaqElem);
  containerDivForInvestor.appendChild(faqDiv);

  // append gia chatbot , info policy in one div and customer portal and branch locator in one div
  let newFifth = fifthDiv.querySelectorAll('div')[0];
  let newSixth = sixthDiv.querySelectorAll('div')[0];
  let GiaInfoDiv = createDivElement("gia-info-policy");
  GiaInfoDiv.appendChild(newFifth);
  GiaInfoDiv.appendChild(newSixth);
  fifthDiv.appendChild(GiaInfoDiv);

  let newSeventh = seventhDiv.querySelectorAll('div')[0];
  let newEigth = eigthDiv.querySelectorAll('div')[0];
  let customerPortalBranchLocDiv = createDivElement("customerPortal-branchLocator");
  customerPortalBranchLocDiv.appendChild(newSeventh);
  customerPortalBranchLocDiv.appendChild(newEigth);
  fifthDiv.appendChild(customerPortalBranchLocDiv);
  sixthDiv.remove('support-landing-cards-child');
  seventhDiv.remove('support-landing-cards-child');
  eigthDiv.remove('support-landing-cards-child');

  containerDivForInvestor.append(fifthDiv);

  // Add both div's in one container parentEle
  parentEle.appendChild(containerDivForCustomer);
  parentEle.appendChild(containerDivForInvestor);

  // for mobile view
  let accordionWrappers = document.getElementsByClassName('accordion-wrapper');

  let titleContentEle = document.getElementsByClassName('mobilegrievancetab-wrapper');

  if (titleContentEle.length > 0) {
    const supportContainerDiv = document.createElement("div");
    supportContainerDiv.className = 'table-content-container';
    supportContainerDiv.appendChild(titleContentEle[0]);
    const parentElement = document.querySelector('.accordion.support-table-name.block > div');

    if (parentElement) {
      parentElement.appendChild(supportContainerDiv);
    } else {
      console.error('Parent element not found.');
    }
  } else {
    console.error('Element with class "tabs-wrapper" not found.');
  }

  Array.from(accordionWrappers).forEach(wrapper => {
    const accordions = wrapper.querySelectorAll('.accordion > div');

    accordions.forEach((accordion) => {
      const header = accordion.children[0];
      const content = accordion.children[1];

      header.classList.add('accordion-header');
      content.classList.add('accordion-content');

      header.addEventListener('click', () => {
        header.classList.toggle('active');
        content.classList.toggle('active');
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
  if (window.innerWidth <= 768) {
    setDisplaySingle('supportcards-container', 'none');
    setDisplaySingle('support-table-ui', 'none');
    setDisplaySingle('customer-support-information-container', 'block');
  } else {
    setDisplaySingle('supportcards-container', 'block');
    setDisplaySingle('support-table-ui', 'block');
    setDisplaySingle('customer-support-information-container', 'none');
  }
}

// Execute on page load
window.addEventListener('load', handleResize);

// Execute on window resize
window.addEventListener('resize', handleResize);

// Function to get indexed child names and set class with numbering
function getChildNames(parentId) {
  const newParentId = `.${parentId}`;
  const parentElement = document.querySelector(newParentId);
  if (!parentElement) {
    return;
  }
  const childDivs = parentElement.querySelectorAll(`${newParentId} > div`);
  childDivs.forEach((div, index) => {
    div.className = `${parentId}-child`;
  });
}

// create div's cntainer element
function createDivElement(className) {
  let divEle = document.createElement('div');
  divEle.className = className;
  return divEle;
}


