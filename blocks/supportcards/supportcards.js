export default async function decorate(block) {
// console.log('js called');

getIndexedChildNames('support-landing-cards');


  let element = document.querySelectorAll('.support-landing-cards-child')[1];
  let pictureElement = element.querySelector('picture');
  let img = pictureElement.querySelector('img').src;
  let ImgEle=  element.querySelectorAll('div')[1];
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

  let zerothDiv = document.querySelectorAll('.support-landing-cards-child')[0];
  let firstDiv = document.querySelectorAll('.support-landing-cards-child')[1];
  let secondDiv = document.querySelectorAll('.support-landing-cards-child')[2];
  let thirdDiv = document.querySelectorAll('.support-landing-cards-child')[3];
  let fourthDiv = document.querySelectorAll('.support-landing-cards-child')[4];
  let fifthDiv = document.querySelectorAll('.support-landing-cards-child')[5];
  let sixthDiv = document.querySelectorAll('.support-landing-cards-child')[6];
  let seventhDiv = document.querySelectorAll('.support-landing-cards-child')[7];
  let eigthDiv = document.querySelectorAll('.support-landing-cards-child')[8];
const containerDivForCustomer = createDivElement('containerDivForCustomer');

// image div
const imageDiv = createDivElement('imageDiv');

// get starting first div
let forCustomerDivEle = zerothDiv;
let imageDivEle = firstDiv;
imageDiv.appendChild(forCustomerDivEle);
imageDiv.appendChild(imageDivEle);
containerDivForCustomer.appendChild(imageDiv);

let parentEle= document.getElementsByClassName('support-landing-cards')[0];


let whatupDivEle = fourthDiv;
containerDivForCustomer.appendChild(whatupDivEle);

// get second div
const containerDivForInvestor = createDivElement('containerDivForInvestor');

const faqDiv = createDivElement('faqDiv');

 // get starting first div
let forInvestQuery = secondDiv;
let forFaqElem =thirdDiv;
faqDiv.appendChild(forInvestQuery);
faqDiv.appendChild(forFaqElem);
containerDivForInvestor.appendChild(faqDiv);


let newFifth=fifthDiv.querySelectorAll('div')[0];
let newSixth= sixthDiv.querySelectorAll('div')[0];
let newDiv=document.createElement('div');
newDiv.appendChild(newFifth);
newDiv.appendChild(newSixth);
newDiv.classList.add("newDiv");
fifthDiv.appendChild(newDiv);

let newSeventh=seventhDiv.querySelectorAll('div')[0];
let newEigth= eigthDiv.querySelectorAll('div')[0];
let customDiv=document.createElement('div');
customDiv.classList.add("customDiv");
customDiv.appendChild(newSeventh);
customDiv.appendChild(newEigth);
fifthDiv.appendChild(customDiv);
fifthDiv.classList.add("fifthElement");
sixthDiv.remove('support-landing-cards-child');
seventhDiv.remove('support-landing-cards-child');
eigthDiv.remove('support-landing-cards-child');

containerDivForInvestor.append(fifthDiv);

parentEle.appendChild(containerDivForCustomer);
parentEle.appendChild(containerDivForInvestor);


}

// Function to get indexed child names and set class with numbering
function getIndexedChildNames(parentId) {
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
 
function createDivElement (className) {
  let divEle = document.createElement('div');
  divEle.className = className;
  return divEle;
}
 

