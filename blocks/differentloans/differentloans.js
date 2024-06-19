import ffetch from '../../scripts/ffetch.js';

const SELECTORS = {
  tabsSelector: '.tab',
};

const API_URL = {
  Different_Home_Loan_Url:
    'https://main--eds-godrej-capital--divanshu-techx.hlx.live/different_type_of_loan/query-index.json',
};

const CREATE_SELECTOR_CLASS = {
  contentContainer: 'content-container',
  tabsContainer: 'tabs-container',
  titleContainer: 'different-loans-title',
};

const AUTHORABLE_VALUES = {
  loansTitle: 'Different Types of Loans for Your Financing Needs',
};

function createTitle(block) {
  const title = document.createElement('h4');
  title.textContent = AUTHORABLE_VALUES.loansTitle;
  title.className = CREATE_SELECTOR_CLASS.titleContainer;
  block.appendChild(title);
}

function createTabs(block) {
  const tabsContainer = document.createElement('div');
  tabsContainer.classList.add(CREATE_SELECTOR_CLASS.tabsContainer);
  block.appendChild(tabsContainer);
  const buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add('buttons-container');
  tabsContainer.appendChild(buttonsContainer);
  const tabNames = ['All', 'Housing', 'Business'];
  tabNames.forEach((tabName) => {
    const tab = document.createElement('button');
    tab.classList.add('tab');
    tab.textContent = tabName;
    tab.dataset.tabName = tabName.toLowerCase();
    buttonsContainer.appendChild(tab);
  });
  return tabsContainer;
}
function createContentContainer(block) {
  const contentContainer = document.createElement('div');
  contentContainer.classList.add(CREATE_SELECTOR_CLASS.contentContainer);
  block.appendChild(contentContainer);
  return contentContainer;
}
function handleLoanTab(tabName, contentContainer, data) {
  contentContainer.textContent = `Loading ${tabName} data...`;
  let filteredData;
  if (tabName === 'all') {
    filteredData = data;
  } else {;
    filteredData = data.filter((item) =>
      item.category.toLowerCase().split(',').includes(tabName)
    );
    console.log(filteredData);
  }
  if (filteredData.length > 0) {
    contentContainer.innerHTML = filteredData
      .map(
        (item) => `
      <a href='${item.url}' class='loan-card'>
        <img src='${item.image}' alt='${item.title}' class='loan-image'/>
          <div class='loan-content'>
             <h2 class='loanTitle'>${item.title}</h2>
             <p class='loanDescription'>${item.description}</p>
          </div>
      </a>
          `
      )
      .join('');
  } else {
    contentContainer.textContent = `No data available for ${tabName}.`;
  }
}
async function fetchData() {
  const responseData = await ffetch(API_URL.Different_Home_Loan_Url).all();
  if (!responseData.ok) {
    console.log('Api is not getting response');
  }
  return responseData;
}
function addEventListeners(tabsContainer, contentContainer) {
  const tabs = tabsContainer.querySelectorAll(SELECTORS.tabsSelector);
  console.log('tabs are', tabs);
  tabs.forEach((tab) => {
    tab.addEventListener('click', async () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      try {
        const responseData = await fetchData();
        handleLoanTab(tab.dataset.tabName, contentContainer, responseData);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    });
  });
  tabs[0].classList.add('active');
}
export default async function decorate(block) {
  createTitle(block);
  const tabsContainer = createTabs(block);
  const contentContainer = createContentContainer(block);
  addEventListeners(tabsContainer, contentContainer);
  try {
    const responseData = await fetchData();
    handleLoanTab('all', contentContainer, responseData);
  } catch (err) {
    console.error('Error fetching data:', err);
  }
}
