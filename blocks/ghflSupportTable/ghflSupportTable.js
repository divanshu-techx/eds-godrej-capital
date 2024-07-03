// import {getIndexedChildNames} from '../CommonUtils/CommonUtils.js';
// getIndexedChildNames('ghflsupporttable');

const tableTitle = getDataAttributeValueByName('support-table-title');
const tabTitle = getDataAttributeValueByName('support-tab-title');

console.log(tableTitle + tabTitle);
let titleButton = document.createElement('button');
titleButton.textContent=tabTitle;

let tableTitleHeading = document.createElement('h2');
tableTitleHeading.textContent = tableTitle;

const tabTitleDiv = document.createElement('div');
tabTitleDiv.className ='supoort-table-title';
tabTitleDiv.appendChild(tableTitleHeading);
tabTitleDiv.appendChild(titleButton);
document.querySelector('.support-table-ui').prepend(tabTitleDiv);



function getDataAttributeValueByName(name) {
    const element = document.querySelector(`[data-${name}]`);
    return element ? element.getAttribute(`data-${name}`) : null;
}

   
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

getChildNames('ghflsupporttable');