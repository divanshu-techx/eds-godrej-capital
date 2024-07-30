async function fetchData(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.data;
  } catch (error) {
    return null;
  }
}

function getDataAttributeValueByName(name) {
  const element = document.querySelector(`[data-${name}]`);
  return element ? element.getAttribute(`data-${name}`) : null;
}

// Initialize the block
function excelDateToJSDate(serial) {
  const excelEpoch = new Date(1900, 0, 1);
  const date = new Date(excelEpoch.getTime() + (serial - 2) * 24 * 60 * 60 * 1000);
  return date;
}

function formatDate(serial) {
  const date = excelDateToJSDate(serial);
  const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits for the day
  const month = date.toLocaleString('default', { month: 'long' }); // Full month name
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export default async function decorate(block) {
  let responseData = [];
  const inputFieldPlaceholder = getDataAttributeValueByName('inputFieldPlaceholder');
  const typeFilter = getDataAttributeValueByName('typeFilter');
  const itemsPerPage = parseInt(getDataAttributeValueByName('itemsPerPage'), 10);
  const noResultFoundMessage = getDataAttributeValueByName('noResultFoundMessage');
  const apiUrl = getDataAttributeValueByName('apiUrl');
  const tabsNames = getDataAttributeValueByName('tabsName')?.split(',').map((name) => name.trim()) || [];
  const sortBy = getDataAttributeValueByName('sortByLabel');
  const searchIcon = getDataAttributeValueByName('searchIcon');

  const readArticleLabel = getDataAttributeValueByName('readArticleLabel');

  const sortOptions = typeFilter.split(',').map((option) => option.trim());

  // Create container
  const container = document.createElement('div');
  container.className = 'news-and-press-container';

  // Create tabs and controls container
  const tabsAndControlsContainer = document.createElement('div');
  tabsAndControlsContainer.className = 'tabs-and-controls-container';

  // Fetch data
  const data = await fetchData(apiUrl);
  if (!data) {
    return;
  }

  // Create tabs container
  const tabsContainer = document.createElement('div');
  tabsContainer.className = 'news-and-release-tabs';

  // If tabsNames is empty, create tabs based on unique categories in the data
  const capitalizedTabNames = tabsNames.length > 0
    ? tabsNames.map((tabName) => tabName.charAt(0).toUpperCase() + tabName.slice(1))
    : Array.from(new Set(data.map((item) => item.category.charAt(0).toUpperCase()
      + item.category.slice(1))));

  // Create tabs based on provided or extracted tab names
  capitalizedTabNames.forEach((tabName, index) => {
    const tab = document.createElement('div');
    tab.id = `tab-${tabName}`;
    tab.className = `tab ${index === 0 ? 'active' : ''}`; // Set the first tab as active
    tab.textContent = tabName;
    tab.addEventListener('click', () => setActiveTab(tabName));
    tabsContainer.appendChild(tab);
  });

  // Create controls container
  const controlsContainer = document.createElement('div');
  controlsContainer.className = 'news-and-release-controls';

  const searchInputContainer = document.createElement('div');
  searchInputContainer.className = 'search-input-container';

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.id = 'searchInput';
  searchInput.placeholder = inputFieldPlaceholder;
  const searchIconImg = document.createElement('img');
  searchIconImg.src = searchIcon;
  searchIconImg.alt = 'Search';
  searchIconImg.className = 'search-icon';
  searchInputContainer.appendChild(searchIconImg);
  searchInputContainer.appendChild(searchInput);

  const sortDropdownContainer = document.createElement('div');
  sortDropdownContainer.className = 'sort-dropdown-container';

  const sortDropdown = document.createElement('select');
  sortDropdown.id = 'sortDropdown';

  const selectPlaceholder = document.createElement('option');
  selectPlaceholder.value = '';
  selectPlaceholder.textContent = sortBy;
  selectPlaceholder.selected = true;
  sortDropdown.appendChild(selectPlaceholder);

  // Create options for sort dropdown based on sortOptions
  sortOptions.forEach((option) => {
    const optionElement = document.createElement('option');
    optionElement.value = option;
    optionElement.textContent = option;
    sortDropdown.appendChild(optionElement);
  });

  sortDropdownContainer.appendChild(sortDropdown);

  controlsContainer.appendChild(searchInputContainer);
  controlsContainer.appendChild(sortDropdownContainer);

  // Append tabs and controls to tabsAndControlsContainer
  tabsAndControlsContainer.appendChild(tabsContainer);
  tabsAndControlsContainer.appendChild(controlsContainer);

  // Create pagination container
  const paginationContainer = document.createElement('div');
  paginationContainer.className = 'pagination';

  // Create pagination wrapper for scroll functionality
  const paginationWrapper = document.createElement('div');
  paginationWrapper.className = 'pagination-wrapper';

  // Create left and right scroll buttons
  const scrollLeftButton = document.createElement('button');
  scrollLeftButton.className = 'scroll-button left';
  // scrollLeftButton.textContent = '<';
  scrollLeftButton.innerHTML = "<img src='/icons/nexticon.svg' alt='Previous' />"; // Custom icon

  const scrollRightButton = document.createElement('button');
  scrollRightButton.className = 'scroll-button right';
  // scrollRightButton.textContent = '>';
  scrollRightButton.innerHTML = "<img src='/icons/nexticon.svg' alt='next' />";

  paginationWrapper.appendChild(scrollLeftButton);
  paginationWrapper.appendChild(paginationContainer);
  paginationWrapper.appendChild(scrollRightButton);
  // Create content container
  const contentContainer = document.createElement('div');
  contentContainer.classList.add('contentContainer');
  contentContainer.id = 'contentContainer';

  // Append sub-divs to main container
  container.appendChild(tabsAndControlsContainer);
  container.appendChild(paginationWrapper);
  container.appendChild(contentContainer);

  block.appendChild(container);
  // Function to render news items
  const getResponseData = (filteredData) => {
    contentContainer.innerHTML = '';
    const paginationDiv = document.querySelector('.pagination');
    if (filteredData.length === 0) {
      contentContainer.innerHTML = noResultFoundMessage;
      paginationDiv.style.display = 'none';
    } else {
      paginationDiv.style.display = 'block';
      filteredData.forEach((item) => {
        const newsContainerData = document.createElement('div');
        newsContainerData.className = 'newsContainer';
        const titleElement = document.createElement('h3');
        titleElement.classList.add('heading_title');
        titleElement.textContent = item.title;
        const descriptionElement = document.createElement('p');
        descriptionElement.classList.add('discription-element');
        descriptionElement.textContent = item.description;
        const publishDateElement = document.createElement('p');
        publishDateElement.classList.add('publish-date');
        const formattedDate = formatDate(item.publishdate);
        publishDateElement.textContent = formattedDate;

        const readArticleElement = document.createElement('a');
        readArticleElement.classList.add('readArticle_anchor');
        readArticleElement.textContent = readArticleLabel;
        // Set the href to the redirection URL
        readArticleElement.href = item.readArticleRedirection;
        // Open the link in a new tab
        readArticleElement.target = '_blank';

        newsContainerData.appendChild(titleElement);
        newsContainerData.appendChild(descriptionElement);
        newsContainerData.appendChild(publishDateElement);
        newsContainerData.appendChild(readArticleElement);
        contentContainer.appendChild(newsContainerData);
      });
    }
  };

  // Function to render pagination spans
  const renderPagination = (totalPages, currentPage, renderPage) => {
    paginationContainer.innerHTML = '';
    if (responseData.length > itemsPerPage) {
      for (let i = 1; i <= totalPages; i += 1) {
        const pageSpan = document.createElement('span');
        pageSpan.textContent = i;
        pageSpan.className = 'page-span';
        if (i === currentPage) {
          pageSpan.classList.add('active-pagination');
        }
        pageSpan.addEventListener('click', () => {
          renderPage(i);
        });
        paginationContainer.appendChild(pageSpan);
      }
    }
    // FOR DISABLE BTN
    scrollLeftButton.disabled = currentPage === 1;
    scrollRightButton.disabled = currentPage === totalPages;
  };

  // Function to render items on the current page
  const renderPage = (page = 1) => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const currentData = responseData.slice(start, end);
    getResponseData(currentData);

    const totalPages = Math.ceil(responseData.length / itemsPerPage);
    renderPagination(totalPages, page, renderPage);
  };

  // Function to sort data based on the selected option
  const sortData = () => {
    const selectedOption = sortDropdown.value;
    const regexOldestToLatest = /oldest\s*to\s*latest/i;
    const regexLatestToOldest = /latest\s*to\s*oldest/i;
    if (regexLatestToOldest.test(selectedOption)) {
      responseData.sort((a, b) => new Date(b.publishdate) - new Date(a.publishdate));
    } else if (regexOldestToLatest.test(selectedOption)) {
      responseData.sort((a, b) => new Date(a.publishdate) - new Date(b.publishdate));
    }
    renderPage();
  };

  // Function to set active tab and fetch data based on category
  const setActiveTab = (tabName) => {
    document.querySelectorAll('.tab').forEach((tab) => tab.classList.remove('active'));
    document.getElementById(`tab-${tabName}`).classList.add('active');

    const filteredData = data.filter((item
    ) => item.category.toLowerCase() === tabName.toLowerCase());
    responseData = filteredData;
    sortData();
    renderPage(1);
  };

  // On load, set the first tab as active
  setActiveTab(capitalizedTabNames[0]);

  // Handle search input
  searchInput.addEventListener('input', (event) => {
    const searchText = event.target.value.toLowerCase();
    const filteredData = responseData.filter((item) => {
      const x = item.title.toLowerCase().includes(searchText);
      const y = item.description.toLowerCase().includes(searchText);
      return x || y;
    });
    getResponseData(filteredData);
  });

  // Add event listener to the sort dropdown
  sortDropdown.addEventListener('change', () => {
    sortData();
    renderPage();
  });

  // Add event listeners to scroll buttons
  scrollLeftButton.addEventListener('click', () => {
    const currentPageSpan = document.querySelector('.pagination .active-pagination');
    if (currentPageSpan) {
      const currentPage = parseInt(currentPageSpan.textContent);
      if (currentPage > 1) {
        renderPage(currentPage - 1);
        paginationContainer.scrollLeft -= paginationContainer.clientWidth;
      }
    }
  });

  scrollRightButton.addEventListener('click', () => {
    const currentPageSpan = document.querySelector('.pagination .active-pagination');
    if (currentPageSpan) {
      const currentPage = parseInt(currentPageSpan.textContent);
      const totalPages = Math.ceil(responseData.length / itemsPerPage);
      if (currentPage < totalPages) {
        renderPage(currentPage + 1);
        paginationContainer.scrollLeft += paginationContainer.clientWidth;
      }
    }
  });

}

