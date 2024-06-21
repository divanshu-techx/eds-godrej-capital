async function fetchData(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Response is not JSON');
    }
    const responseData = await response.json();
    return responseData.data; // Access the 'data' array
  } catch (error) {
    return null;
  }
}

function renderData(data, selectedTab, selectedOption, tabpanel) {
  if (!selectedTab || !selectedOption) {
    return;
  }

  const filteredData = data.filter(
    (item) => item.tab === selectedTab && item.dropdown === selectedOption,
  );

  if (filteredData.length === 0) {
    return;
  }

  // Clear previous data
  tabpanel.innerHTML = '';
  // Display the filtered data
  filteredData.forEach((item) => {
    let sectionIndex = 1;

    // Iterate through sections until no more titles are found
    while (item[`title_${sectionIndex}`]) {
      const title = item[`title_${sectionIndex}`].trim();
      const description = item[`description_${sectionIndex}`] || ''; // Default to empty string if description is not present
      const bulletPoints = item[`bullet_points_${sectionIndex}`] || ''; // Default to empty string if bullet points are not present

      // Create paragraph element for title with bold styling
      const titleElement = document.createElement('p');
      titleElement.textContent = title;
      titleElement.style.fontWeight = 'bold'; // Set bold font weight
      tabpanel.appendChild(titleElement);

      // Create paragraph element for description
      const descriptionElement = document.createElement('p');
      descriptionElement.textContent = description.trim();
      tabpanel.appendChild(descriptionElement);

      // Render bullet points if available
      if (bulletPoints.trim() !== '') {
        const bulletPointsList = bulletPoints
          .split('\n')
          .map((bp) => bp.trim())
          .filter((bp) => bp !== '');

        if (bulletPointsList.length > 0) {
          const listElement = document.createElement('ul');
          listElement.style.listStyleType = 'disc'; // Set list style to bullet points

          bulletPointsList.forEach((bullet) => {
            const listItem = document.createElement('li');
            listItem.textContent = bullet;
            listElement.appendChild(listItem);
          });

          tabpanel.appendChild(listElement);
        }
      }

      // Add some space between sections
      tabpanel.appendChild(document.createElement('hr'));

      sectionIndex += 1;
    }
  });
}

function handleTabClick(event, data, tablist, tabpanel, dropdown) {
  tablist.querySelectorAll('.tabs-tab').forEach((btn) => {
    btn.setAttribute('aria-selected', 'false');
    btn.style.backgroundColor = 'white';
    btn.style.color = 'black';
  });
  event.target.setAttribute('aria-selected', 'true');
  event.target.style.backgroundColor = 'var(--background-color)';
  event.target.style.color = 'white';
  const selectedTab = event.target.innerHTML;
  const selectedOption = dropdown.value;

  renderData(data, selectedTab, selectedOption, tabpanel);
}
let selectedOption = 'Indian Resident Salaried';
function handleDropdownChange(data, tablist, tabpanel, dropdown) {
  const selectedTabButton = tablist.querySelector('button[aria-selected="true"]');
  const selectedTab = selectedTabButton
    ? selectedTabButton.innerHTML
    : tablist.querySelector('button').innerHTML;
  selectedOption = dropdown.value;

  renderData(data, selectedTab, selectedOption, tabpanel);
}

function createDropdownForTabs(tabNames, tablist, data, tabpanel, dropdown) {
  const dropdownForTabs = document.createElement('select');
  dropdownForTabs.className = 'tabs-list-dropdown';

  tabNames.forEach((tabName, i) => {
    const optionElement = document.createElement('option');
    optionElement.value = tabName;
    optionElement.text = tabName;
    if (i === 0) {
      optionElement.selected = true;
    }
    dropdownForTabs.add(optionElement);
  });

  dropdownForTabs.addEventListener('change', () => {
    const selectedTab = dropdownForTabs.value;
    const selectedOptionLocal = dropdown.value;
    renderData(data, selectedTab, selectedOptionLocal, tabpanel);
  });

  return dropdownForTabs;
}

function handleViewportChange(tablist, tabsListDropdown) {
  const tabsWrapper = document.querySelector('.tabs-list-wrapper');
  const tabsListLabel = tabsWrapper.querySelector('.tabs-list-label');
  const tabsDropdownLabel = tabsWrapper.querySelector('.tabs-dropdown-label');
  const allCards = document.querySelectorAll('.interest-card');
  const mobileCardContainer = document.querySelector('.mobile-card-container');

  if (window.innerWidth <= 968) {
    tablist.style.display = 'none';
    tabsListDropdown.style.display = 'block';
    tabsListLabel.style.display = 'block'; // Show "Select Documents" label
    allCards.forEach((card) => {
      if (card.id === selectedOption) {
        card.style.display = 'block';
        mobileCardContainer.innerHTML = ''; // Clear previous content
        mobileCardContainer.appendChild(card.cloneNode(true));
      } else {
        card.style.display = 'none';
      }
    });
  } else {
    tablist.style.display = 'flex';
    tabsListDropdown.style.display = 'none';
    tabsListLabel.style.display = 'block'; // Show "Select Documents" label
    allCards.forEach((card) => {
      card.style.display = 'flex';
    });
    mobileCardContainer.innerHTML = ''; // Clear mobile card container
  }

  tabsDropdownLabel.style.display = 'block'; // Always show "Select Category" label
}

async function decorate(block) {
  const interestRateBlock = document.querySelector('.interest-rate.block');
  const headerDiv = document.createElement('div');
  headerDiv.classList.add('header-div');
  const allCards = document.createElement('div');
  allCards.classList.add('allCards');
  const documentsDiv = document.createElement('div');
  documentsDiv.classList.add('documentDiv');

  if (interestRateBlock) {
    const divs = interestRateBlock.querySelectorAll(':scope > div');

    divs.forEach((div, index) => {
      if (index === 0) {
        div.classList.add('interest-rate-header');
        headerDiv.appendChild(div);
      } else if (index == 1) {
        div.classList.add('other-card');
        allCards.appendChild(div);
      } else {
        const name = div.querySelector('div p').innerHTML;
        div.id = name
        div.classList.add('interest-card');
        allCards.appendChild(div);
      }
    });
  }
  interestRateBlock.appendChild(headerDiv);
  interestRateBlock.appendChild(allCards);
  interestRateBlock.appendChild(documentsDiv);

  const tabListWrapper = document.createElement('div');
  tabListWrapper.className = 'tabs-list-wrapper';

  // Create a div to hold the "Select Category" label and dropdown
  const categoryWrapper = document.createElement('div');
  categoryWrapper.className = 'category-wrapper';

  const dropdownLabel = document.createElement('label');
  dropdownLabel.textContent = 'Select Category:';
  dropdownLabel.className = 'tabs-dropdown-label';

  const dropdown = document.createElement('select');
  dropdown.className = 'tabs-dropdown';

  categoryWrapper.appendChild(dropdownLabel);
  categoryWrapper.appendChild(dropdown);

  // Create a wrapper for "Select Documents" label and dropdown
  const documentsWrapper = document.createElement('div');
  documentsWrapper.className = 'documents-wrapper'; // You can define your own class name here

  const tabListLabel = document.createElement('label');
  tabListLabel.textContent = 'Select Documents:';
  tabListLabel.className = 'tabs-list-label';

  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');

  const tabNames = ['KYC Documents', 'Income Documents', 'Property Documents'];
  const dropdownOptions = [
    'Indian Resident Salaried',
    'Non-Resident Indian Salaried',
    'Business Self Employed',
    'Professional Self Employed',
  ];

  const tabpanel = document.createElement('div');
  tabpanel.className = 'tabs-panel';
  tabpanel.id = 'tabpanel-tab';
  tabpanel.setAttribute('aria-labelledby', 'tab-1');
  tabpanel.setAttribute('role', 'tabpanel');

  let data = [];

  tabNames.forEach((tabName, i) => {
    const button = document.createElement('button');
    button.className = 'tabs-tab';
    button.innerHTML = tabName;
    button.setAttribute('aria-controls', 'tabpanel-tab');
    button.setAttribute('aria-selected', i === 0);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    button.addEventListener('click', (event) => handleTabClick(event, data, tablist, tabpanel, dropdown));
    tablist.append(button);
  });

  dropdownOptions.forEach((option) => {
    const optionElement = document.createElement('option');
    optionElement.text = option;
    dropdown.add(optionElement);
  });

  dropdown.addEventListener('change', () => handleDropdownChange(data, tablist, tabpanel, dropdown));

  // Append label and dropdown to documentsWrapper
  documentsWrapper.appendChild(tabListLabel);
  documentsWrapper.appendChild(tablist);
  tabListWrapper.appendChild(documentsWrapper);
  tabListWrapper.appendChild(categoryWrapper); // Append documentsWrapper to tabListWrapper
  documentsDiv.appendChild(tabListWrapper);
  documentsDiv.appendChild(tabpanel);

  // Create a container for the mobile card
  const mobileCardContainer = document.createElement('div');
  mobileCardContainer.className = 'mobile-card-container';
  tabListWrapper.insertBefore(mobileCardContainer, documentsWrapper);

  const apiUrl = 'https://main--godrej-capital-internal--divanshu-techx.hlx.live/website/query-index.json';
  data = await fetchData(apiUrl);

  if (!data) {
    return;
  }

  const selectedTabButton = tablist.querySelector('button[aria-selected="true"]');
  const selectedTab = selectedTabButton ? selectedTabButton.innerHTML : tabNames[0];
  const selectedOptionDefault = 'Indian Resident Salaried'; // Default category

  renderData(data, selectedTab, selectedOptionDefault, tabpanel);

  const tabsListDropdown = createDropdownForTabs(tabNames, tablist, data, tabpanel, dropdown);
  documentsWrapper.appendChild(tabsListDropdown);

  // Set default selections
  if (selectedTabButton) {
    selectedTabButton.click(); // Simulate click on the first tab button
  } else {
    tablist.querySelector('button').click(); // If no tab is selected, click the first tab button
  }
  dropdown.value = selectedOption; // Set dropdown to default value

  // Event listeners
  window.addEventListener('resize', () => handleViewportChange(tablist, tabsListDropdown, data, tabpanel));
  dropdown.addEventListener('change', () => {
    const selectedTabLocal = tablist.querySelector('button[aria-selected="true"]').innerHTML;
    const selectedOptionLocal = dropdown.value;
    handleViewportChange(tablist, tabsListDropdown, data, tabpanel);
    renderData(data, selectedTabLocal, selectedOptionLocal, tabpanel);
  });

  handleViewportChange(tablist, tabsListDropdown, data, tabpanel); // Initial setup
}

export default decorate;
