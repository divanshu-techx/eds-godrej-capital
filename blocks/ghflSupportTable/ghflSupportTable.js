// import {getIndexedChildNames} from '../CommonUtils/CommonUtils.js';
// getIndexedChildNames('ghflsupporttable');

export function getIndex(n) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }
   
  // Function to get indexed child names and set class with numbering
  export function getIndexedChildNames(parentId) {
    const newParentId = `.${parentId}`;
    const parentElement = document.querySelector(newParentId);
   
    if (!parentElement) {
      return;
    }
   
    const childDivs = parentElement.querySelectorAll(`${newParentId} > div`);
   
    childDivs.forEach((div, index) => {
      const lastIndexed = getIndex(index + 1);
      div.className = `${parentId}-child-${lastIndexed}`;
    });
  }

   getIndexedChildNames('ghflsupporttable');