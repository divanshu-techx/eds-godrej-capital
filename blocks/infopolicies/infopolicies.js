const indexUrl = getDataAttributeValueByName('queryindexurl');
const title = getDataAttributeValueByName('title');
let dropdown;
let dropDownContainer;

// For check the view is mobile or desktop
function isMobileView() {
  return window.matchMedia('(max-width: 767px)').matches;
}

export default async function decorate() {
  let data;

  try {
    // Fetch the data asynchronously
    data = await fetchData();

    const infopoliciesEle = document.getElementsByClassName('infopolicies');

    let firstChildElement;
    if (infopoliciesEle.length > 0) {
      firstChildElement = infopoliciesEle[0];
    }

    // Create the dropdown element once
    dropdown = createDropdown();

    // Create the tabs and tab contents containers
    const { tabsContainer, tabContentsContainer } = createTabsAndContentsContainers(firstChildElement);

    // Populate tabs and their contents
    populateTabsAndContents(data, tabsContainer, tabContentsContainer, dropdown);

    // Initialize the first tab and update the dropdown
    initializeFirstTab(data, dropdown);
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  // Add event listener to the dropdown to update options on change
  dropdown.addEventListener('change', () => {
    updateDropdownOptions(dropdown);
  });
}

// Get authoring values
function getDataAttributeValueByName(name) {
  const element = document.querySelector(`[data-${name}]`);
  return element ? element.getAttribute(`data-${name}`) : null;
}

// Fetch data from the provided URL
async function fetchData() {
  const responseData = await fetch(indexUrl);
  const dataObj = await responseData.json();
  return dataObj.data;
}

// Create and return the tabs and tab contents containers
function createTabsAndContentsContainers(infoPoliciesEle) {
  if (title) {
    const titleContainer = document.createElement('div');
    titleContainer.className = 'title-container';
    const titleEle = document.createElement('h3');
    titleEle.textContent = title;
    titleEle.className = 'title-name';
    titleContainer.appendChild(titleEle);
    infoPoliciesEle.appendChild(titleContainer);
  }

  if(dropdown) {
      dropDownContainer = document.createElement('div');
      if(isMobileView()){
        dropDownContainer.className = 'dropdown-container-for-mobile';
      } else {
        dropDownContainer.className = 'dropdown-container-for-desktop';
      }
      dropDownContainer.appendChild(dropdown);
      infoPoliciesEle.appendChild(dropDownContainer);
  }

  let tabsContainer = document.getElementById('tabs');
  if (!tabsContainer) {
    tabsContainer = document.createElement('div');
    tabsContainer.id = 'tabs';
    tabsContainer.className = 'tabs-container';
    infoPoliciesEle.appendChild(tabsContainer);
  }

  let tabContentsContainer = document.getElementById('tab-contents');
  if (!tabContentsContainer) {
    tabContentsContainer = document.createElement('div');
    tabContentsContainer.id = 'tab-contents';
    tabContentsContainer.className = 'tabs-content';
    infoPoliciesEle.appendChild(tabContentsContainer);
  }

  return { tabsContainer, tabContentsContainer };
}

// Create and return the dropdown element
function createDropdown() {
  const dropdown = document.createElement('select');
  dropdown.className = 'dropdown';
  return dropdown;
}

// Fetch and display data for the selected option
function fetchSelectedOptionData(dataPath) {
  const mainUrl = dataPath;
  fetch(mainUrl)
    .then((response) => response.text())
    .then((data) => {
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(data, 'text/html');

      // Get the content inside the <main> tag
      const mainContent = htmlDoc.querySelector('main').innerHTML;

      // Handle the fetched data as needed, e.g., update target element
      const tabContentsDiv = document.getElementById('tab-contents');
      tabContentsDiv.innerHTML = mainContent;

      // Add accordion functionality to elements with class "accordion"
      const accordions = tabContentsDiv.querySelectorAll('.accordion > div > div:first-child');
      accordions.forEach((header) => {
        header.classList.add('accordion-header');
        header.nextElementSibling.classList.add('accordion-content');
        header.addEventListener('click', () => {
          header.classList.toggle('active');
          header.nextElementSibling.classList.toggle('active');
        });
      });
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
}

// Update dropdown options based on the selected tab
function updateDropdownOptionsOnTabs(parent, data, dropdown) {
  const selectedValue = dropdown.value;

  // Clear existing options
  dropdown.innerHTML = '';

  // Add new options based on the selected tab
  if (isMobileView()) {
    data.filter((item) => item.selector === parent).forEach((item) => {
      const option = document.createElement('option');
      option.value = item.parent;
      option.innerText = item.parent;
      option.setAttribute('data-path', item.path);
      dropdown.appendChild(option);

      if (option.value === selectedValue) {
        option.selected = true;
        fetchSelectedOptionData(option.getAttribute('data-path'));
      }
    });
  } else {
    data.filter((item) => item.parent === parent).forEach((item) => {
      const option = document.createElement('option');
      option.value = item.selector;
      option.innerText = item.selector;
      option.setAttribute('data-path', item.path);
      dropdown.appendChild(option);

      if (option.value === selectedValue) {
        option.selected = true;
        fetchSelectedOptionData(option.getAttribute('data-path'));
      }
    });
  }
}

// Populate the tabs and their corresponding contents
function populateTabsAndContents(data, tabsContainer, tabContentsContainer, dropdown) {
  let parents;
  if (isMobileView()) {
    parents = [...new Set(data.map((item) => item.selector))];
  } else {
    parents = [...new Set(data.map((item) => item.parent))];
  }
  parents.forEach((parent) => {
    // Create and append the tab element
    const tab = document.createElement('div');
    tab.className = 'tab';
    tab.innerText = parent;
    tab.dataset.parent = parent;
    tabsContainer.appendChild(tab);

    // Append the dropdown to the tabs container
    if(isMobileView()){
      dropDownContainer.appendChild(dropdown);
    } else {
      dropDownContainer.appendChild(dropdown);
      tabsContainer.appendChild(dropDownContainer);
    }

    // Create and append the tab content element
    const tabContent = document.createElement('div');
    tabContent.className = 'tab-content';
    tabContent.id = `content-${parent.replace(/\s+/g, '-')}`;
    tabContentsContainer.appendChild(tabContent);

    tab.addEventListener('click', () => {
      // document.querySelectorAll('.tab-content').forEach((content) => content.classList.remove('active'));
      // tabContent.classList.add('active');
      document.querySelectorAll('.tab').forEach((tab) => tab.classList.remove('active'));
      tab.classList.add('active');
      updateDropdownOptionsOnTabs(parent, data, dropdown);
    });
  });
}

// Initialize the first tab and update the dropdown
function initializeFirstTab(data, dropdown) {
  const firstTab = document.querySelector('.tab');
  if (firstTab) {
    firstTab.click();
    const selectedOption = dropdown.options[dropdown.selectedIndex];
    const dataPath = selectedOption.getAttribute('data-path');
    if (dataPath) {
      fetchSelectedOptionData(dataPath);
    }
  }
}

// Update dropdown options when the dropdown value changes
function updateDropdownOptions(dropdown) {
  const selectedOption = dropdown.options[dropdown.selectedIndex];
  const selectedValue = selectedOption.value;
  const dataAttribute = selectedOption.getAttribute('data-path');
  if (selectedOption.value === selectedValue) {
    selectedOption.selected = true;
    fetchSelectedOptionData(selectedOption.getAttribute('data-path'));
  }
}
