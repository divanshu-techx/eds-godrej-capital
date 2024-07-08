export default async function decorate(block) {
  // add all child div class name
  getChildNames('support-landing-cards');

  // Add text in nackground image
  const element = document.querySelectorAll('.support-landing-cards-child')[1];
  const pictureElement = element.querySelector('picture');
  const img = pictureElement.querySelector('img').src;
  const ImgEle = element.querySelectorAll('div')[1];
  ImgEle.style.backgroundImage = `url(${img})`;
  ImgEle.style.width = '310px';
  ImgEle.style.height = '281px';
  // ImgEle.style.backgroundSize = 'cover';
  // ImgEle.style.marginLeft = '-25px';
  // ImgEle.style.marginTop = '-35px';
  // ImgEle.style.borderRadius = '10px';
  ImgEle.style.backgroundRepeat = 'no-repeat';
  ImgEle.style.backgroundPosition = 'center center';
  // ImgEle.parentElement.style.overflow = 'hidden';
  element.removeChild(element.firstElementChild);

  // get all the child elements divs
  const CustomerDiv = document.querySelectorAll('.support-landing-cards-child')[0];
  const registeredDiv = document.querySelectorAll('.support-landing-cards-child')[1];
  const investorDiv = document.querySelectorAll('.support-landing-cards-child')[2];
  const faqContainer = document.querySelectorAll('.support-landing-cards-child')[3];
  const trackstatus = document.querySelectorAll('.support-landing-cards-child')[4];
  const freecredit = document.querySelectorAll('.support-landing-cards-child')[5];
  const whatsappDiv = document.querySelectorAll('.support-landing-cards-child')[6];
  const giachatDiv = document.querySelectorAll('.support-landing-cards-child')[7];
  const portalDiv = document.querySelectorAll('.support-landing-cards-child')[8];
  const policiesDiv = document.querySelectorAll('.support-landing-cards-child')[9];
  const branchDiv = document.querySelectorAll('.support-landing-cards-child')[10];
  const parentEle = document.getElementsByClassName('support-landing-cards')[0];

  // get first partition div which contain customerquery, image, whats-up div
  const containerDivForCustomer = createDivElement('containerDivForCustomer');
  const imageDiv = createDivElement('imageDiv');
  const forCustomerDivEle = CustomerDiv;
  const imageDivEle = registeredDiv;
  imageDiv.appendChild(forCustomerDivEle);
  imageDiv.appendChild(imageDivEle);
  containerDivForCustomer.appendChild(imageDiv);
  const whatupDivEle = whatsappDiv;
  containerDivForCustomer.appendChild(whatupDivEle);

  // get second partition div which contain investor query, faq, gia chatbot
  const containerDivForInvestor = createDivElement('containerDivForInvestor');

  // append investor query and faq
  const faqDiv = createDivElement('faqDiv');
  const forInvestQuery = investorDiv;
  const forFaqElem = document.createElement('div');
  forFaqElem.append(faqContainer);
  forFaqElem.append(trackstatus);
  forFaqElem.append(freecredit);
  faqDiv.appendChild(forInvestQuery);
  faqDiv.appendChild(forFaqElem);
  containerDivForInvestor.appendChild(faqDiv);

  // append gia chatbot , info policy in one div and customer portal and branch locator in one div
  const newFifth = giachatDiv.querySelectorAll('div')[0];
  const newSixth = portalDiv.querySelectorAll('div')[0];
  const GiaInfoDiv = createDivElement('gia-info-policy');
  GiaInfoDiv.appendChild(newFifth);
  GiaInfoDiv.appendChild(newSixth);
  giachatDiv.appendChild(GiaInfoDiv);

  const newSeventh = policiesDiv.querySelectorAll('div')[0];
  const newEigth = branchDiv.querySelectorAll('div')[0];
  const customerPortalBranchLocDiv = createDivElement('customerPortal-branchLocator');
  customerPortalBranchLocDiv.appendChild(newSeventh);
  customerPortalBranchLocDiv.appendChild(newEigth);
  giachatDiv.appendChild(customerPortalBranchLocDiv);
  portalDiv.remove('support-landing-cards-child');
  policiesDiv.remove('support-landing-cards-child');
  branchDiv.remove('support-landing-cards-child');

  containerDivForInvestor.append(giachatDiv);

  // Add both div's in one container parentEle
  parentEle.appendChild(containerDivForCustomer);
  parentEle.appendChild(containerDivForInvestor);

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
   console.log(accordions)
    accordions.forEach((accordion) => {
      const header = accordion.children[0];
      const content = accordion.children[1];

      header.classList.add('accordion-header');
      content.classList.add('accordion-content');

      header.addEventListener('click', () => {
        header.classList.toggle('active-show');
        content.classList.toggle('active-show');
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
  childDivs.forEach((div) => {
    div.className = `${parentId}-child`;
  });
}

// create div's cntainer element
function createDivElement(className) {
  const divEle = document.createElement('div');
  divEle.className = className;
  return divEle;
}
