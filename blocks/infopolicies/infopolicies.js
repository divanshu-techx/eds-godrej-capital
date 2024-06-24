// Main function that initializes and decorates the block
// Fetch data from the provided URL
async function fetchData() {
  const responseData = await fetch('https://main--edge--pushpanderyadav.hlx.page/information_and_policies/query-index.json');
  const dataObj = await responseData.json();
  console.log('new object is', dataObj);
  return dataObj.data;
}

// Get distinct parents from the data
function getDistinctParents(data) {
  const uniqueParents = new Set();
  data.forEach((item) => {
    uniqueParents.add(item.parent);
  });
  return Array.from(uniqueParents);
}

// Get all paths from the data
function getAllPaths(data) {
  return data.map((item) => item.path);
}

// Get or create the main container element
function getOrCreateMainContainer() {
  let main = document.getElementById('main');
  if (!main) {
    main = document.createElement('div');
    main.id = 'main';
    document.body.appendChild(main);
  }
  return main;
}

// Create and return the tabs and tab contents containers
function createTabsAndContentsContainers(main) {
  let tabsContainer = document.getElementById('tabs');
  if (!tabsContainer) {
    tabsContainer = document.createElement('div');
    tabsContainer.id = 'tabs';
    tabsContainer.className = 'tabs-container';
    main.appendChild(tabsContainer);
  }

  let tabContentsContainer = document.getElementById('tab-contents');
  if (!tabContentsContainer) {
    tabContentsContainer = document.createElement('div');
    tabContentsContainer.id = 'tab-contents';
    tabContentsContainer.className = 'tabs-content';
    main.appendChild(tabContentsContainer);
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
  const mainUrl = `https://main--edge--pushpanderyadav.hlx.live${dataPath}`;
  fetch(mainUrl)
    .then((response) => response.text())
    .then((data) => {
      console.log(data);
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(data, 'text/html');

      // Get the content inside the <main> tag
      const mainContent = htmlDoc.querySelector('main').innerHTML;

      // Handle the fetched data as needed, e.g., update target element
      console.log(mainContent);
      const tabContentsDiv = document.getElementById('tab-contents');
      tabContentsDiv.innerHTML = mainContent;
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
}

// Update dropdown options based on the selected tab
function updateDropdownOptionsOnTabs(parent, data, dropdown) {
  const selectedValue = dropdown.value;
  console.log('Selected value:', selectedValue);

  // Clear existing options
  dropdown.innerHTML = '';

  // Add new options based on the selected tab
  data.filter((item) => item.parent === parent).forEach((item) => {
    const option = document.createElement('option');
    option.value = item.selector;
    option.innerText = item.selector;
    option.setAttribute('data-path', item.path);
    dropdown.appendChild(option);

    // If the option matches the previously selected value, select it and fetch its data
    if (option.value === selectedValue) {
      option.selected = true;
      fetchSelectedOptionData(option.getAttribute('data-path'));
    }
  });
}

// Populate the tabs and their corresponding contents
function populateTabsAndContents(data, tabsContainer, tabContentsContainer, dropdown) {
  const parents = [...new Set(data.map((item) => item.parent))];

  parents.forEach((parent) => {
    // Create and append the tab element
    const tab = document.createElement('div');
    tab.className = 'tab';
    tab.innerText = parent;
    tab.dataset.parent = parent;
    tabsContainer.appendChild(tab);

    // Append the dropdown to the tabs container
    tabsContainer.appendChild(dropdown);

    // Create and append the tab content element
    const tabContent = document.createElement('div');
    tabContent.className = 'tab-content';
    tabContent.id = `content-${parent.replace(/\s+/g, '-')}`;
    tabContentsContainer.appendChild(tabContent);

    // Add click event listener to each tab
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab-content').forEach((content) => content.classList.remove('active'));
      tabContent.classList.add('active');
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
  console.log('Selected value:', selectedValue);
  console.log('Data attribute value:', dataAttribute);
  if (selectedOption.value === selectedValue) {
    selectedOption.selected = true;
    fetchSelectedOptionData(selectedOption.getAttribute('data-path'));
  }
}

export default async function decorate() {
  console.log('hii');
  let dropdown; let data; let parent; let
    path;

  try {
    // Fetch the data asynchronously
    data = await fetchData();

    // Get distinct parents and paths from the data
    parent = getDistinctParents(data);
    path = getAllPaths(data);
    console.log(path);
    console.log(parent);

    // Get or create the main container
    const main = getOrCreateMainContainer();

    // Create the tabs and tab contents containers
    const { tabsContainer, tabContentsContainer } = createTabsAndContentsContainers(main);

    // Create the dropdown element once
    dropdown = createDropdown();

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
