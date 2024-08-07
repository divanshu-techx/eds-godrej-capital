import ffetch from '../../scripts/ffetch.js';

var categories;

// Retrieve the value of a data attribute by name
function getDataAttributeValueByName(name) {
  const element = document.querySelector(`[data-${name}]`);
  return element ? element.getAttribute(`data-${name}`) : '';
}

// Retrieve configurable values from data attributes
const queryIndexApiUrl = getDataAttributeValueByName('queryindexurl');
// Selectors for DOM elements
const SELECTORS = {
  tabsSelector: '.tab',
};

// API URLs
const API_URL = {
  Different_Home_Loan_Url: queryIndexApiUrl,
};
// CSS class names for creating elements
const CREATE_SELECTOR_CLASS = {
  contentContainer: 'content-container',
  tabsContainer: 'tabs-loans-container',
  titleContainer: 'different-loans-title',
};

// Render cards based on the filtered data
function renderCards(data, contentContainer) {
  contentContainer.innerHTML = ''; // Clear existing content
  data.forEach((item) => {
    const itemElement = document.createElement('a');
    itemElement.href = item.detailpageredirection;
    itemElement.classList.add('loan-card');
    const imageElement = document.createElement('img');
    imageElement.src = item.image;
    imageElement.alt = item.title;
    imageElement.classList.add('loan-image');
    itemElement.appendChild(imageElement);
    const loanContent = document.createElement('div');
    loanContent.classList.add('loan-content');
    const loanTitle = document.createElement('h2');
    loanTitle.classList.add('loanTitle');
    loanTitle.textContent = item.title;
    loanContent.appendChild(loanTitle);
    const loanDescription = document.createElement('p');
    loanDescription.classList.add('loanDescription');
    loanDescription.textContent = item.description;
    loanContent.appendChild(loanDescription);
    itemElement.appendChild(loanContent);
    contentContainer.appendChild(itemElement);
  });
}

// Filter and render content based on the selected category
function renderFilteredContent(category, responseData, contentContainer) {
  const filteredData = responseData.filter(
    (item) => item.category.toLowerCase().split(',').includes(category.toLowerCase()),
  );
  renderCards(filteredData, contentContainer);
}

// Add event listeners to tabs for filtering content
function addEventListeners(tabs, responseData, contentContainer) {
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      renderFilteredContent(tab.dataset.tabName, responseData, contentContainer);
    });
  });
}

function getTabNamesFromMetadata() {
  const tabsName = getDataAttributeValueByName('tabs-name-ordering');
  if (!tabsName || tabsName.trim().length === 0) {
    return [];
  }
  return tabsName.includes(',') ? tabsName.split(',') : [tabsName];
}

// Extract distinct categories from the data
function getDistinctCategories(data) {
  const categoriesSet = new Set();
  data.forEach((item) => {
    item.category.split(',').map((cat) => categoriesSet.add(cat.trim().toLowerCase()));
  });
  return Array.from(categoriesSet);
}

// Fetch data from the API
async function fetchData() {
  const responseData = await ffetch(API_URL.Different_Home_Loan_Url).all();
  if (!responseData.ok) {
    console.log('API is not getting response');
  }
  return responseData;
}

// Create tabs for each category and append to the block
function createTabs(block, categoriesVal) {
  const tabsContainer = document.createElement('div');
  tabsContainer.classList.add(CREATE_SELECTOR_CLASS.tabsContainer);
  block.appendChild(tabsContainer);
  const buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add('buttons-container');
  tabsContainer.appendChild(buttonsContainer);
  categoriesVal.forEach((category) => {
    const tab = document.createElement('button');
    tab.classList.add('tab');
    tab.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    tab.dataset.tabName = category.toLowerCase();
    buttonsContainer.appendChild(tab);
  });
  return tabsContainer;
}
// Create and append the content container to the block
function createContentContainer(block) {
  const contentContainer = document.createElement('div');
  contentContainer.classList.add(CREATE_SELECTOR_CLASS.contentContainer);
  block.appendChild(contentContainer);
  return contentContainer;
}

// Main function to decorate the block
export default async function decorate(block) {
  try {
    const responseData = await fetchData();
    const tabsNameArray = getTabNamesFromMetadata();
    let tabsContainer;
    if (tabsNameArray.length > 0) {
      tabsContainer = createTabs(block, tabsNameArray);
    } else {
      categories = getDistinctCategories(responseData);
      tabsContainer = createTabs(block, categories);
    }
    const tabs = tabsContainer.querySelectorAll(SELECTORS.tabsSelector);
    tabs[0].classList.add('active');
    const contentContainer = createContentContainer(block);
    renderFilteredContent(tabs[0].dataset.tabName, responseData, contentContainer);
    addEventListeners(tabs, responseData, contentContainer);
  } catch (err) {
    console.error('Error fetching data:', err);
  }
}
