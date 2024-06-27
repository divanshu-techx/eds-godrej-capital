function getDataAttributeValueByName(name) {
  const element = document.querySelector(`[data-${name}]`);
  return element ? element.getAttribute(`data-${name}`) : null;
}

const dataUrl = getDataAttributeValueByName('queryindexurl');
const mainTitle = getDataAttributeValueByName('title');

async function fetchData(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.data;
  } catch (error) {
    return null;
  }
}

function renderData(data, selectedTab, selectedOption, tabpanel) {
  if (!selectedTab || !selectedOption) {
    return;
  }

  const filteredData = data.filter(
    (item) => item.parent === selectedTab && item.category === selectedOption
    );

  if (filteredData.length === 0) { return; }

  tabpanel.innerHTML = '';

  filteredData.forEach((item) => {
    let sectionIndex = 1;

    // Create a container for the sections
    const sectionsContainer = document.createElement('div');
    sectionsContainer.className = 'sections-container';

    // Iterate through sections until no more titles are found
    while (item[`title_${sectionIndex}`]) {
      const title = item[`title_${sectionIndex}`].trim();
      const description = item[`description_${sectionIndex}`] || ''; // Default to empty string if description is not present
      const bulletPoints = item[`bullet_points_${sectionIndex}`] || ''; // Default to empty string if bullet points are not present

      // Create section element
      const sectionElement = document.createElement('div');
      sectionElement.className = `section section-${sectionIndex}`;

      // Create paragraph element for title with bold styling
      const titleElement = document.createElement('p');
      titleElement.textContent = title;
      titleElement.style.fontWeight = 'bold'; // Set bold font weight
      sectionElement.appendChild(titleElement);

      // Create paragraph element for description
      const descriptionElement = document.createElement('p');
      descriptionElement.textContent = description.trim();
      sectionElement.appendChild(descriptionElement);

      // Render bullet points if available
      if (bulletPoints.trim() !== '') {
        const bulletPointsList = bulletPoints
          .split('\n')
          .map((bp) => bp.trim())
          .filter((bp) => bp !== '');

        if (bulletPointsList.length > 0) {
          const listElement = document.createElement('ul');
          listElement.style.listStyleType = 'disc'; // Set list style to bullet points

          // Show only the first 3 bullet points initially
          const initialBulletPoints = bulletPointsList.slice(0, 3);
          initialBulletPoints.forEach((bullet) => {
            const listItem = document.createElement('li');
            listItem.textContent = bullet;
            listElement.appendChild(listItem);
          });

          sectionElement.appendChild(listElement);

          // Add "Read More" button if there are more than 3 bullet points
          if (bulletPointsList.length > 3) {
            const readMoreButton = document.createElement('button');
            readMoreButton.textContent = 'View Complete Lists of Documents';
            readMoreButton.className = 'read-more-button';

            readMoreButton.addEventListener('click', () => {
              const remainingBulletPoints = bulletPointsList.slice(3);
              remainingBulletPoints.forEach((bullet) => {
                const listItem = document.createElement('li');
                listItem.textContent = bullet;
                listElement.appendChild(listItem);
              });
              readMoreButton.style.display = 'none'; // Hide "Read More" button after expanding
            });

            sectionElement.appendChild(readMoreButton);
          }
        }
      }

      sectionsContainer.appendChild(sectionElement);
      sectionIndex += 1;
    }

    tabpanel.appendChild(sectionsContainer);
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
  const selectedTabButton = tablist.querySelector(
    'button[aria-selected="true"]'
  );
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

  // Create title element
  const title = document.createElement('div');
  title.textContent = mainTitle;
  title.classList.add('main-title');
  const allCards = document.createElement('div');
  allCards.classList.add('allCards');
  const documentsDiv = document.createElement('div');
  documentsDiv.classList.add('documentDiv');

  if (interestRateBlock) {
    const divs = interestRateBlock.querySelectorAll(':scope > div');

    divs.forEach((div) => {
      const name = div.querySelector('div p').innerHTML;
      div.id = name;
      div.classList.add('interest-card');
      allCards.appendChild(div);
    });
  }

  interestRateBlock.appendChild(title); // Append mainTitle before allCards
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
  documentsWrapper.className = 'documents-wrapper';

  const tabListLabel = document.createElement('label');
  tabListLabel.textContent = 'Select Documents:';
  tabListLabel.className = 'tabs-list-label';

  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');

  const tabpanel = document.createElement('div');
  tabpanel.className = 'tabs-panel';
  tabpanel.id = 'tabpanel-tab';
  tabpanel.setAttribute('aria-labelledby', 'tabpanel-tab');

  const mobileCardContainer = document.createElement('div');
  mobileCardContainer.className = 'mobile-card-container';

  tabListWrapper.appendChild(documentsWrapper);
  documentsWrapper.appendChild(tabListLabel);
  documentsWrapper.appendChild(tablist);
  documentsWrapper.appendChild(
    createDropdownForTabs(['Tab1', 'Tab2'], tablist, [], tabpanel, dropdown)
  );

  tabListWrapper.appendChild(categoryWrapper);
  tabListWrapper.appendChild(tabpanel);
  tabListWrapper.appendChild(mobileCardContainer);

  interestRateBlock.appendChild(tabListWrapper);

  const data = await fetchData(dataUrl);

  data.forEach((item) => {
    const optionElement = document.createElement('option');
    optionElement.value = item.category;
    optionElement.text = item.category;
    if (selectedOption === item.category) {
      optionElement.selected = true;
    }
    dropdown.add(optionElement);
  });

  tablist.addEventListener('click', (event) => {
    if (event.target && event.target.nodeName === 'BUTTON') {
      handleTabClick(event, data, tablist, tabpanel, dropdown);
    }
  });

  dropdown.addEventListener('change', () =>
    handleDropdownChange(data, tablist, tabpanel, dropdown));

  handleViewportChange(tablist, tablist.querySelector('.tabs-list-dropdown'));
  window.addEventListener('resize', () =>
    handleViewportChange(tablist, tablist.querySelector('.tabs-list-dropdown')));
}

document.addEventListener('DOMContentLoaded', () => {
  const blocks = document.querySelectorAll('.block');
  blocks.forEach((block) => {
    if (block.classList.contains('interest-rate')) {
      decorate(block);
    }
  });
});
