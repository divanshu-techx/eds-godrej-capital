export default async function decorate(block) {
  // This will be your API response data
  let responseData = [];

  // Function to get authored label data
  function getDataAttributeValueByName(name) {
    const element = document.querySelector(`[data-${name}]`);
    return element ? element.getAttribute(`data-${name}`) : null;
  }

  const newsTabLabel = getDataAttributeValueByName('newsTabLabel');
  const pressReleaseLabel = getDataAttributeValueByName('pressReleaseLabel');
  const inputFieldPlaceholder = getDataAttributeValueByName('inputFieldPlaceholder');
  const latestToOldestLabel = getDataAttributeValueByName('latestToOldestLabel');
  const oldestToLatestLabel = getDataAttributeValueByName('oldestToLatestLabel');
  const itemsPerPage = parseInt(getDataAttributeValueByName('itemsPerPage'), 10);
  const noResultFoundMessage = getDataAttributeValueByName('noResultFoundMessage');
  const newsApi = getDataAttributeValueByName('newsApi');
  const pressReleaseApi = getDataAttributeValueByName('pressApi');

  // Create container
  const container = document.createElement('div');
  container.className = 'container';

  // Create tabs and controls container
  const tabsAndControlsContainer = document.createElement('div');
  tabsAndControlsContainer.className = 'tabs-and-controls-container';

  // Create tabs container
  const tabsContainer = document.createElement('div');
  tabsContainer.className = 'tabs';

  const newsTab = document.createElement('div');
  const pressReleaseTab = document.createElement('div');

  newsTab.id = 'newsTab';
  newsTab.className = 'tab active';
  newsTab.textContent = newsTabLabel;

  pressReleaseTab.id = 'pressReleaseTab';
  pressReleaseTab.className = 'tab';
  pressReleaseTab.textContent = pressReleaseLabel;

  tabsContainer.appendChild(newsTab);
  tabsContainer.appendChild(pressReleaseTab);

  // Create controls container
  const controlsContainer = document.createElement('div');
  controlsContainer.className = 'controls';

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.id = 'searchInput';
  searchInput.placeholder = inputFieldPlaceholder;

  const sortDropdown = document.createElement('select');
  sortDropdown.id = 'sortDropdown';
  const optionNewToOld = document.createElement('option');
  optionNewToOld.value = 'newToOld';
  optionNewToOld.textContent = latestToOldestLabel;
  const optionOldToNew = document.createElement('option');
  optionOldToNew.value = 'oldToNew';
  optionOldToNew.textContent = oldestToLatestLabel;

  sortDropdown.appendChild(optionNewToOld);
  sortDropdown.appendChild(optionOldToNew);

  controlsContainer.appendChild(searchInput);
  controlsContainer.appendChild(sortDropdown);

  // Append tabs and controls to tabsAndControlsContainer
  tabsAndControlsContainer.appendChild(tabsContainer);
  tabsAndControlsContainer.appendChild(controlsContainer);

  // Create pagination container
  const paginationContainer = document.createElement('div');
  paginationContainer.className = 'pagination';

  // Create content container
  const contentContainer = document.createElement('div');
  contentContainer.id = 'contentContainer';

  // Append sub-divs to main container
  container.appendChild(tabsAndControlsContainer);
  container.appendChild(paginationContainer);
  container.appendChild(contentContainer);

  // Append main container to block
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
        titleElement.textContent = item.title;
        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = item.description;
        const publishDateElement = document.createElement('p');
        publishDateElement.textContent = item.publishdate;
        newsContainerData.appendChild(titleElement);
        newsContainerData.appendChild(descriptionElement);
        newsContainerData.appendChild(publishDateElement);
        contentContainer.appendChild(newsContainerData);
      });
    }
  };

  // Function to render pagination buttons
  const renderPagination = (totalPages, currentPage, renderPage) => {
    paginationContainer.innerHTML = '';
    if (responseData.length > itemsPerPage) {
      for (let i = 1; i <= totalPages; i += 1) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = 'page-button';
        if (i === currentPage) {
          pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', () => {
          renderPage(i);
        });
        paginationContainer.appendChild(pageButton);
      }
    }
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
    if (selectedOption === 'newToOld') {
      responseData.sort((a, b) => new Date(b.publishdate) - new Date(a.publishdate));
    } else if (selectedOption === 'oldToNew') {
      responseData.sort((a, b) => new Date(a.publishdate) - new Date(b.publishdate));
    }
    renderPage();
  };

  // Function for an API call
  const getApiResponse = async (api) => {
    try {
      const response = await fetch(api, { method: 'GET' });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      responseData = data.data;
      sortData(); // Ensure data is sorted initially
      renderPage(1); // Pass the initial page as 1
    } catch (error) {
      contentContainer.innerHTML = noResultFoundMessage;
    }
  };

  // Function for active tabs
  const setActiveTab = (tab) => {
    if (tab === 'news') {
      newsTab.classList.add('active');
      pressReleaseTab.classList.remove('active');
    } else {
      newsTab.classList.remove('active');
      pressReleaseTab.classList.add('active');
    }
    getApiResponse(tab === 'news' ? newsApi : pressReleaseApi);
  };

  // On load API call function call
  getApiResponse(newsApi);

  // News Tab Event Listener
  newsTab.addEventListener('click', () => setActiveTab('news'));

  // Press Release Tab Event Listener
  pressReleaseTab.addEventListener('click', () => setActiveTab('pressRelease'));

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
}

// Initialize the block
const blockElement = document.getElementById('block');
decorate(blockElement);
