export default async function decorate() {
// console.log('js called');

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


 

