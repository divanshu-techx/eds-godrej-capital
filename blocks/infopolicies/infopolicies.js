var indexUrl=getDataAttributeValueByName('queryindexurl');
console.log(indexUrl);


export default async function decorate(block) {
  console.log('hii');
  var data,dropdown;
  //   path;

  try {
    // Fetch the data asynchronously
    data = await fetchData();

//   // Get distinct parents and paths from the data
  //   parent = getDistinctParents(data);
  //   path = getAllPaths(data);
  //   console.log(path);
  //   console.log(parent);

  const infopoliciesEle = document.getElementsByClassName('infopolicies');
  var firstChildElement;
  if (infopoliciesEle.length > 0) {
      firstChildElement = infopoliciesEle[0];
      console.log(firstChildElement);
  }
    // Create the tabs and tab contents containers
    const { tabsContainer, tabContentsContainer } = createTabsAndContentsContainers(firstChildElement);

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



function getDataAttributeValueByName(name) {
  const element = document.querySelector(`[data-${name}]`);
  return element ? element.getAttribute(`data-${name}`) : null;
}
// Fetch data from the provided URL
async function fetchData() {
  const responseData = await fetch(indexUrl);
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


// Create and return the tabs and tab contents containers
function createTabsAndContentsContainers(infoPoliciesEle) {
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
  console.log(mainUrl);
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

const accordions = document.querySelectorAll('.accordion > div');

    accordions.forEach(item => {
      const header = item.querySelector(':scope > div:nth-child(1)');
      const content = item.querySelector(':scope > div:nth-child(2)');

      header.style.cursor = 'pointer';
      header.style.fontWeight = 'bold';
      header.style.backgroundColor = '#f1f1f1';
      header.style.padding = '10px';
      header.style.border = '1px solid #ccc';

      content.classList.add('accordion-content');

      header.addEventListener('click', function () {
        // Close all accordion contents
        accordions.forEach(i => {
          if (i !== item) {
            i.querySelector(':scope > div:nth-child(2)').classList.remove('active');
          }
        });

        // Toggle the current accordion content
        content.classList.toggle('active');
      });
    });
  });