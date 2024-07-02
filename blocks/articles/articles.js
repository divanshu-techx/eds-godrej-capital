// Retrieve configurable values from data attributes
const queryIndexApiUrl = getDataAttributeValueByName('blogs-apiUrl');
const readTimeIcon = getDataAttributeValueByName('read-time-icon');
const readTimeIconAltText = getDataAttributeValueByName('read-time-icon-alt-text');
const searchIcon = getDataAttributeValueByName('search-icon');
const searchIconAltText = getDataAttributeValueByName('search-icon-alt-text');
const searchPlaceholderText = getDataAttributeValueByName('search-placeholder-text');
const filterLabel = getDataAttributeValueByName('filter-label');
const productLabel = getDataAttributeValueByName('default-dropdown-label');
const sortingFilters = getDataAttributeValueByName('sorting-filters');
let articlesPerPage = 2;
let currentPage = 1;
var responseData, sortedResData;

// Main function to decorate the block
export default async function decorate(block) {
	renderSearchSection(block);
	responseData = await fetchData(queryIndexApiUrl);
	console.log(responseData);
	if (responseData != null) {
		sortedResData =  [...responseData];
		const categories = getDistinctCategories(responseData);
		renderFiltersInDropdown();
		renderCategoriesInDropdown(categories);
		renderCards(block, responseData);
		renderPagination(block, responseData);
	}
}

async function fetchData(apiUrl) {
	try {
		const response = await fetch(apiUrl);
		const data = await response.json();
		return data.data;
	} catch (error) {
		console.error("Error fetching data:", error);
		return null;
	}
}

function renderSearchSection(block) {
	// Create search filter container
	const searchFilterContainer = document.createElement('div');
	searchFilterContainer.classList.add('search-filter');

	const searchContainer = document.createElement('div');
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
	handleSearching(block, searchInput);

	// Create first select dropdown for filter
	const filterDropdown = document.createElement('select');
	filterDropdown.classList.add('dropdown');
	filterDropdown.id = 'filter-dropdown';
	// Create the first option with default text "Select"
	const defaultOption = document.createElement('option');
	defaultOption.value = '';
	defaultOption.textContent = filterLabel;
	filterDropdown.appendChild(defaultOption);

	searchFilterContainer.appendChild(filterDropdown);

	// Create second select dropdown for category
	const categoryDropdown = document.createElement('select');
	categoryDropdown.classList.add('dropdown');
	categoryDropdown.id = 'category-dropdown';
	// Create the first option with default text "Select"
	const defaultOptionCategory = document.createElement('option');
	defaultOptionCategory.value = '';
	defaultOptionCategory.textContent = productLabel;
	categoryDropdown.appendChild(defaultOptionCategory);

	searchFilterContainer.appendChild(categoryDropdown);

	// Append search filter container to body
	block.appendChild(searchFilterContainer);
}

function handleSearching(block, searchInputField) {
	// Event listner for input in search field
	searchInputField.addEventListener('input', function (event) {
		const inputValue = event.target.value.trim();
		const filteredArticlesByUserInput = responseData.filter(article => article.description.toLowerCase().includes(inputValue.toLowerCase()));
		renderCards(block, filteredArticlesByUserInput);
		renderPagination(block, filteredArticlesByUserInput);
	});
}

function renderFiltersInDropdown() {
	const filters = getfiltersArrayFromString();
	console.log(filters);
	const filtersDropdown = document.getElementById('filter-dropdown');
	filters.forEach(filter => {
		const option = document.createElement('option');
		option.value = filter;
		option.text = filter
			.replace(/-/g, ' ') // Replace hyphens with spaces
			.replace(/(^\w|\s\w)/g, m => m.toUpperCase()); // capitalizes the first letter of every word in a string
		filtersDropdown.appendChild(option);

		// Event listener for filter dropdown change
		filtersDropdown.addEventListener('change', (event) => {
			const selectedFilter = event.target.value;
			console.log(selectedFilter);
			if (selectedFilter && selectedFilter !== '') {
				const sortedArticles = sortArticles(selectedFilter);
				console.log(sortArticles);
				renderCards('', sortedArticles);
				renderPagination('', sortedArticles);
			} else {
				renderCards('', responseData); // Render all articles if no filter is selected
			}
			
		});
	});
}

function sortArticles(selectedFilter) {
	if (selectedFilter === 'oldest-to-latest') {
		return sortedResData.sort((a, b) => new Date(a.articlepublishdate) - new Date(b.articlepublishdate));
	} else if (selectedFilter === 'latest-to-oldest') {
		return sortedResData.sort((a, b) => new Date(b.articlepublishdate) - new Date(a.articlepublishdate));
	}
}

function renderCategoriesInDropdown(categories) {
	const categoriesDropdown = document.getElementById('category-dropdown');
	categories.forEach(category => {
		const option = document.createElement('option');
		option.value = category;
		option.text = category.replace(/(^\w|\s\w)/g, m => m.toUpperCase()); // capitalizes the first letter of every word in a string
		categoriesDropdown.appendChild(option);
	});

	// Event listener for category dropdown change
	categoriesDropdown.addEventListener('change', (event) => {
		const selectedCategory = event.target.value;
		console.log(selectedCategory);
		if (selectedCategory && selectedCategory !== '') {
			const filteredArticles = filterArticlesByCategory(responseData, selectedCategory);
			sortedResData = [...filteredArticles];
			console.log(filteredArticles);
			renderCards('', filteredArticles);
			renderPagination('', filterArticlesByCategory);
		} else {
			renderCards('', responseData); // Render all articles if no category is selected.
			renderPagination('', responseData);
		}
	});
}

function filterArticlesByCategory(data, selectedCategory) {
	// Filtered array to store matching articles
	const filteredArticles = data.filter(article => article.category.toLowerCase() === selectedCategory.toLowerCase());
	return filteredArticles;
}

function renderCards(block, data) {
	let articlesContainer = document.getElementById('articles-container');
	if (!articlesContainer && block != '') {
		articlesContainer = document.createElement('div');
		articlesContainer.id = "articles-container";
		block.appendChild(articlesContainer);
	}
	articlesContainer.innerHTML = '';
	const start = (currentPage - 1) * articlesPerPage;
	const end = start + articlesPerPage;
	const paginatedArticles = data.slice(start, end);

	paginatedArticles.forEach(article => {
		const articleCard = document.createElement('div');
		articleCard.classList.add('article-card');
		articleCard.innerHTML = `
				<a href="#"><img src="${article.image}" alt="${article.imagealt}">
					<div class="article-content">
							<p class="article-date">${formatDate(article.articlepublishdate)}</p>
							<div class="article-read-time">
								<img src="${readTimeIcon}" alt="${readTimeIconAltText}">
								<span>${article.readtime}</span>
							</div>
							<h2>${article.description}</h2>
					</div>
				</a>
		`;
		articlesContainer.appendChild(articleCard);
	});
}

function renderPagination(block, data) {
	let paginationContainer = document.getElementById('pagination-container');
	if (!paginationContainer && block != '') {
		paginationContainer = document.createElement('div');
		paginationContainer.id = "pagination-container";
		block.appendChild(paginationContainer);
	}
	paginationContainer.innerHTML = '';

	let totalPages = Math.ceil(data.length / articlesPerPage);
	console.log(totalPages);

	if (totalPages > 1) {
		// Left arrow button
		const leftButton = document.createElement('button');
		leftButton.innerHTML = '<-';
		leftButton.classList.add('arrow', 'left');
		leftButton.addEventListener('click', () => {
			if (currentPage > 1) {
				currentPage--;
				renderCards(block, data);
				renderPagination(block, data);
			}
		});
		paginationContainer.appendChild(leftButton);

		// Numbered pages
		for (let i = 1; i <= totalPages; i++) {
			let pageLink = document.createElement('a');
			pageLink.href = '#';
			pageLink.innerText = i < 10 ? `0${i}` : i;
			pageLink.classList.toggle('active', i === currentPage);
			pageLink.addEventListener('click', (event) => {
				event.preventDefault();
				currentPage = i;
				renderCards(block, data);
				renderPagination(block, data);
			});
			paginationContainer.appendChild(pageLink);
		}

		// Right arrow button
		const rightButton = document.createElement('button');
		rightButton.innerHTML = '->';
		rightButton.classList.add('arrow', 'right');
		rightButton.addEventListener('click', () => {
			if (currentPage < totalPages) {
				currentPage++;
				renderCards(block, data);
				renderPagination(block, data);
			}
		});
		paginationContainer.appendChild(rightButton);
	}
}

// Extract distinct categories from the data
function getDistinctCategories(data) {
	const categoriesSet = new Set();
	data.forEach(item => {
		categoriesSet.add(item.category.trim().toLowerCase());
	});
	return Array.from(categoriesSet);
}

function formatDate(serial) {
	const date = excelDateToJSDate(serial);
	const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits for the day
	const month = date.toLocaleString('default', { month: 'long' }); // Full month name
	const year = date.getFullYear();
	return `${day} ${month} ${year}`;
}

function excelDateToJSDate(serial) {
	const excelEpoch = new Date(1900, 0, 1);
	const date = new Date(excelEpoch.getTime() + (serial - 2) * 24 * 60 * 60 * 1000);
	return date;
}

function getfiltersArrayFromString() {
	if (!sortingFilters || sortingFilters.trim().length === 0) {
		return [];
	}
	return sortingFilters.includes(',')
		? sortingFilters.split(',').map(item => item.trim())
		: [sortingFilters];
}

function getDataAttributeValueByName(name) {
	const element = document.querySelector(`[data-${name}]`);
	return element ? element.getAttribute(`data-${name}`) : '';
}