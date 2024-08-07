// Retrieve configurable values from data attributes
const queryIndexApiUrl = getDataAttributeValueByName('blogs-apiUrl');
const readTimeIcon = getDataAttributeValueByName('read-time-icon');
const readTimeIconAltText = getDataAttributeValueByName(
  'read-time-icon-alt-text',
);
const searchIcon = getDataAttributeValueByName('search-icon');
const searchIconAltText = getDataAttributeValueByName('search-icon-alt-text');
const searchPlaceholderText = getDataAttributeValueByName(
  'search-placeholder-text',
);
const filterLabel = getDataAttributeValueByName('filter-label');
const productLabel = getDataAttributeValueByName('default-dropdown-label');
const sortingFilters = getDataAttributeValueByName('sorting-filters');
const blogsNotFoundMsg = getDataAttributeValueByName('blogs-not-found-msg');
const articlesPerPage = getDataAttributeValueByName('blogs-per-page');
let currentPage = 1;

// Main function to decorate the block
export default async function decorate(block) {
  // Render search section and initial elements
  renderSearchSection(block);
  createNoResultDiv(block);

  try {
    const responseData = await fetchData(queryIndexApiUrl);
    console.log(responseData);
    if (responseData) {
      // Extract and render distinct categories and filters
      const searchInput = block.querySelector('#search-input');
      const categories = getDistinctCategories(responseData);
      renderFiltersAndCategoriesDropdown(
        block,
        categories,
        responseData,
        searchInput,
      );
      // Render initial cards
      renderCards(block, responseData);
      // Handle searching functionality
      handleSearching(block, searchInput, responseData);

      renderPagination(block, responseData);

      // Resize event listener to handle responsive changes
      window.addEventListener('resize', () => {
        renderPagination(block, responseData);
      });
    } else {
      console.error('No data fetched from API.');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Fetch data from API
async function fetchData(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

// Render the search section with search input and filter/category dropdowns
function renderSearchSection(block) {
  // Create search filter container
  const searchFilterContainer = document.createElement('div');
  searchFilterContainer.classList.add('blogs-search-filter');

  // Create search container
  const searchContainer = document.createElement('div');
  searchContainer.classList.add('search-container');
  searchContainer.id = 'search-container';

  // Create search icon
  const searchImage = document.createElement('img');
  searchImage.src = searchIcon;
  searchImage.alt = searchIconAltText;
  searchContainer.appendChild(searchImage);
  // Create search input
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = searchPlaceholderText;
  searchInput.id = 'search-input';
  searchContainer.appendChild(searchInput);

  searchFilterContainer.appendChild(searchContainer);

  // Create dropdown container for filter
  const filterDropdownContainer = document.createElement('div');
  filterDropdownContainer.classList.add('blogs-filter-dropdown-container');

  // Create first select dropdown for filter
  const filterDropdown = document.createElement('select');
  filterDropdown.classList.add('dropdown');
  filterDropdown.id = 'filter-dropdown';
  // Create the first option with default text 'Select'
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = filterLabel;
  filterDropdown.appendChild(defaultOption);

  filterDropdownContainer.appendChild(filterDropdown);

  // Create dropdown container for category
  const categoryDropdownContainer = document.createElement('div');
  categoryDropdownContainer.classList.add('blogs-category-dropdown-container');

  // Create second select dropdown for category
  const categoryDropdown = document.createElement('select');
  categoryDropdown.classList.add('dropdown');
  categoryDropdown.id = 'category-dropdown';
  // Create the first option with default text 'Select'
  const defaultOptionCategory = document.createElement('option');
  defaultOptionCategory.value = '';
  defaultOptionCategory.textContent = productLabel;
  categoryDropdown.appendChild(defaultOptionCategory);

  categoryDropdownContainer.appendChild(categoryDropdown);

  // Append the dropdown containers to the search filter container
  searchFilterContainer.appendChild(filterDropdownContainer);
  searchFilterContainer.appendChild(categoryDropdownContainer);

  // Append search filter container to block
  block.appendChild(searchFilterContainer);
}


// Handle search input functionality
function handleSearching(block, searchInputField, responseData) {
  // Event listener for input in search field
  const noResultDiv = block.querySelector('#articles-not-found-container');
  const articlesContainer = block.querySelector('#articles-container');
  const filterDropdown = block.querySelector('#filter-dropdown');
  const categoryDropdown = block.querySelector('#category-dropdown');

  searchInputField.addEventListener('input', (event) => {
    const inputValue = event.target.value.trim().toLowerCase();
    let filteredData = [];
    if (inputValue.length > 0) {
      const filteredArticlesByUserInput = filterArticlesByDescription(
        responseData,
        inputValue,
      );
      filteredData = getFilteredDataBasedOnDropdown(
        filteredArticlesByUserInput,
        filterDropdown.value,
        categoryDropdown.value
      );

      if (filteredData.length === 0) {
        noResultDiv.style.display = 'block';
        articlesContainer.style.display = 'none';
      } else {
        noResultDiv.style.display = 'none';
        articlesContainer.style.display = 'grid';
      }
    } else {
      filteredData = getFilteredDataBasedOnDropdown(
        responseData,
        filterDropdown.value,
        categoryDropdown.value,
      );
      noResultDiv.style.display = 'none';
      articlesContainer.style.display = 'grid';
    }
    renderCards(block, filteredData);
    renderPagination(block, filteredData);
  });
}

function getFilteredDataBasedOnDropdown(data, filterValue, categoryValue) {
  let filteredData = data.slice();

  switch (true) {
    case filterValue !== '' && categoryValue !== '':
      const filteredDataByCategory = filterArticlesByCategory(
        filteredData,
        categoryValue,
      );
      filteredData = sortArticles(filterValue, filteredDataByCategory);
      break;
    case filterValue !== '' && categoryValue === '':
      filteredData = sortArticles(filterValue, filteredData);
      break;
    case filterValue === '' && categoryValue !== '':
      filteredData = filterArticlesByCategory(filteredData, categoryValue);
      break;
    default:
      break;
  }
  return filteredData;
}

// Render filters and categories dropdown
function renderFiltersAndCategoriesDropdown(
  block,
  categories,
  responseData,
  searchInputField,
) {
  const filters = getFiltersArrayFromString();
  const filtersDropdown = block.querySelector('#filter-dropdown');
  const categoriesDropdown = block.querySelector('#category-dropdown');

  filters.forEach((filter) => {
    const option = document.createElement('option');
    option.value = filter;
    option.text = formatFilterText(filter);
    filtersDropdown.appendChild(option);
  });

  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category;
    option.text = formatCategoryText(category);
    categoriesDropdown.appendChild(option);
  });

  filtersDropdown.addEventListener('change', () =>
    handleDropdownChange(
      block,
      filtersDropdown,
      categoriesDropdown,
      searchInputField,
      responseData,
    ),
  );
  categoriesDropdown.addEventListener('change', () =>
    handleDropdownChange(
      block,
      filtersDropdown,
      categoriesDropdown,
      searchInputField,
      responseData,
    ),
  );
}

// Handle dropdown change
function handleDropdownChange(
  block,
  filtersDropdown,
  categoriesDropdown,
  searchInputField,
  responseData,
) {
  const selectedFilter = filtersDropdown.value;
  const selectedCategory = categoriesDropdown.value;
  const inputValue = searchInputField.value.trim().toLowerCase();
  const noResultDiv = block.querySelector('#articles-not-found-container');
  const articlesContainer = block.querySelector('#articles-container');

  let filteredAndSortedData = getFilteredDataBasedOnDropdown(
    responseData,
    selectedFilter,
    selectedCategory,
  );
  if (inputValue.length > 0) {
    const filterDataBasedOnInput = filterArticlesByDescription(
      responseData,
      inputValue,
    );
    filteredAndSortedData = getFilteredDataBasedOnDropdown(
      filterDataBasedOnInput,
      selectedFilter,
      selectedCategory,
    );
    if (filteredAndSortedData.length === 0) {
      noResultDiv.style.display = 'block';
      articlesContainer.style.display = 'none';
    } else {
      noResultDiv.style.display = 'none';
      articlesContainer.style.display = 'grid';
    }
  } else {
    noResultDiv.style.display = 'none';
    articlesContainer.style.display = 'grid';
  }

  renderCards(block, filteredAndSortedData);
  renderPagination(block, filteredAndSortedData);
}

function sortArticles(selectedFilter, data) {
  if (selectedFilter === 'oldest-to-latest') {
    return data.sort(
      (a, b) => new Date(a.articlepublishdate) - new Date(b.articlepublishdate),
    );
  } else if (selectedFilter === 'latest-to-oldest') {
    return data.sort(
      (a, b) => new Date(b.articlepublishdate) - new Date(a.articlepublishdate),
    );
  }
}

// Render article cards
function renderCards(block, data) {
  let articlesContainer = block.querySelector('#articles-container');
  if (!articlesContainer) {
    articlesContainer = document.createElement('div');
    articlesContainer.classList.add('articles-container');
    articlesContainer.id = 'articles-container';
    block.appendChild(articlesContainer);
  }

  articlesContainer.innerHTML = '';

  const start = (currentPage - 1) * articlesPerPage;
  const end = start + articlesPerPage;
  const paginatedArticles = data.slice(start, end);

  paginatedArticles.forEach((article) => {
    const articleCard = document.createElement('div');
    articleCard.classList.add('article-card');
    articleCard.innerHTML = `
      <a href="#" class="article-single-card">
        <div class="article-image">
          <img src="${article.image}" alt="${article.imagealt}">
        </div>
        <div class="article-content">
          <div class="date-time-article">
            <div class="article-date">${formatDate(article.articlepublishdate)}</div>
            <div class="article-read-time">
              <img src="${readTimeIcon}" alt="${readTimeIconAltText}">
              <span class="read-time">${article.readtime}</span>
            </div>
          </div>		
          <div class="description-article">${article.description}</div>
        </div>
      </a>
    `;
    articlesContainer.appendChild(articleCard);
  });
}

function createNoResultDiv(block) {
  const notFoundContainer = document.createElement('div');
  notFoundContainer.id = 'articles-not-found-container';
  notFoundContainer.style.display = 'none';
  notFoundContainer.innerHTML = blogsNotFoundMsg;
  block.appendChild(notFoundContainer);
}

function createPaginationContainer(block) {
  let mobilePaginationContainer = block.querySelector('#mobile-pagination-container');
  let desktopPaginationContainer = block.querySelector('#desktop-pagination-container');
  const categoryContainer = block.querySelector('.blogs-category-dropdown-container');

  if (window.matchMedia('(max-width: 767px)').matches) {
    if (!mobilePaginationContainer) {
      mobilePaginationContainer = document.createElement('div');
      mobilePaginationContainer.classList.add('mobile-pagination-container');
      mobilePaginationContainer.id = 'mobile-pagination-container';

      categoryContainer.appendChild(mobilePaginationContainer);
    }
    if (desktopPaginationContainer) {
      desktopPaginationContainer.style.display = 'none';
    }
    mobilePaginationContainer.style.display = 'flex';

    return mobilePaginationContainer;
  } else {
    if (!desktopPaginationContainer) {
      desktopPaginationContainer = document.createElement('div');
      desktopPaginationContainer.classList.add('desktop-pagination-container');
      desktopPaginationContainer.id = 'desktop-pagination-container';

      block.appendChild(desktopPaginationContainer);
    }

    if (mobilePaginationContainer) {
      mobilePaginationContainer.style.display = 'none';
    }
    desktopPaginationContainer.style.display = 'flex';

    return desktopPaginationContainer;
  }
}

function renderPagination(block, data) {
  const paginationContainer = createPaginationContainer(block);
  paginationContainer.innerHTML = '';

  const totalPages = Math.ceil(data.length / articlesPerPage);

  if (totalPages > 1) {
    // Left arrow button
    const leftButton = document.createElement('button');
    leftButton.innerHTML = `<img src='/icons/nexticon.svg' alt='Previous' />`;
    leftButton.classList.add('arrow', 'left');
    leftButton.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderCards(block, data);
        renderPagination(block, data);
      }
    });
    paginationContainer.appendChild(leftButton);

    const pageLinksContainer = document.createElement('div');
    pageLinksContainer.classList.add('page-links');

    // Generate pagination based on device type
    handleDeviceSpecificCode(block, data, totalPages, currentPage, pageLinksContainer);

    paginationContainer.appendChild(pageLinksContainer);

    // Right arrow button
    const rightButton = document.createElement('button');
    rightButton.innerHTML = `<img src='/icons/nexticon.svg' alt='Next' />`;
    rightButton.classList.add('arrow', 'right');
    rightButton.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderCards(block, data);
        renderPagination(block, data);
      }
    });
    paginationContainer.appendChild(rightButton);

    if (currentPage === 1) {
      leftButton.disabled = true;
    } else if (currentPage === totalPages) {
      rightButton.disabled = true;
    }
  }
}

// Function to determine the device view and run the appropriate code
function handleDeviceSpecificCode(block, data, totalPages, currentPageEle, pageLinksContainer) {
  const mobileView = window.matchMedia('(max-width: 767px)');
  // const tabletView = window.matchMedia('(min-width: 767.99px) and (max-width: 1024px)');

  if (mobileView.matches) {
    const pageLink = document.createElement('span');
    pageLink.classList.add('number-node');
    pageLink.innerText = formatNumberWithLeadingZero(currentPageEle);
    pageLink.classList.add('active');
    const totalPageNo = document.createElement('span');
    totalPageNo.innerText = `/ ${formatNumberWithLeadingZero(totalPages)}`;

    pageLinksContainer.appendChild(pageLink);
    pageLinksContainer.appendChild(totalPageNo);

  } else {
    // Numbered pages
    for (let i = 1; i <= totalPages; i += 1) {
      const pageLink = document.createElement('span');
      pageLink.classList.add('number-node');
      pageLink.innerText = formatNumberWithLeadingZero(i);
      pageLink.classList.toggle('active', i === currentPageEle);
      pageLink.addEventListener('click', (event) => {
        event.preventDefault();
        currentPageEle = i;
        renderCards(block, data);
        renderPagination(block, data);
      });
      pageLinksContainer.appendChild(pageLink);
    }

  }
}

function formatNumberWithLeadingZero(number) {
  return number < 10 ? `0${number}` : number;
}

// Extract distinct categories from the data
function getDistinctCategories(data) {
  const categoriesSet = new Set();
  data.forEach((item) => {
    categoriesSet.add(item.category.trim().toLowerCase());
  });
  return Array.from(categoriesSet);
}

// Filter articles by description
function filterArticlesByDescription(data, input) {
  return data.filter((article) =>
    article.description.toLowerCase().includes(input.toLowerCase()),
  );
}

// Filter articles by category
function filterArticlesByCategory(data, selectedCategory) {
  const filteredArticles = data.filter(
    (article) =>
      article.category.toLowerCase() === selectedCategory.toLowerCase(),
  );
  return filteredArticles;
}

// Format category text
function formatCategoryText(category) {
  return category.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase()); // Capitalize the first letter of every word
}

// Format filter text
function formatFilterText(filterText) {
  return filterText
    .replace(/-/g, ' ') // Replace hyphens with spaces
    .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase()); // Capitalize the first letter of every word
}

// Format date
function formatDate(serial) {
  const date = excelDateToJSDate(serial);
  const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits for the day
  const month = date.toLocaleString('default', { month: 'long' }); // Full month name
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

// Convert Excel date to JS date
function excelDateToJSDate(serial) {
  const excelEpoch = new Date(1900, 0, 1);
  const date = new Date(
    excelEpoch.getTime() + (serial - 2) * 24 * 60 * 60 * 1000,
  );
  return date;
}

// Get filters array from string
function getFiltersArrayFromString() {
  if (!sortingFilters || sortingFilters.trim().length === 0) {
    return [];
  }
  return sortingFilters.includes(',')
    ? sortingFilters.split(',').map((item) => item.trim())
    : [sortingFilters];
}

// Get data attribute value by name
function getDataAttributeValueByName(name) {
  const element = document.querySelector(`[data-${name}]`);
  return element ? element.getAttribute(`data-${name}`) : '';
}
