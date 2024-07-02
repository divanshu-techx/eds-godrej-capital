// Retrieve configurable values from data attributes
const queryIndexApiUrl = getDataAttributeValueByName('blogs-apiUrl');
const readMoreLabel = getDataAttributeValueByName('read-more-label');
const pdpType = getDataAttributeValueByName('pdp-name');
const notFoundMsg = getDataAttributeValueByName('not-found-msg');

// Main function to decorate the block
export default async function decorate(block) {
	try {
		const responseData = await fetchData(queryIndexApiUrl);
		console.log(responseData);
		if (responseData) {
			let category = getCategory();
			if (category) {
				let filteredData = filterArticlesByCategory(responseData, category);
				// Render initial cards
				renderCards(block, filteredData);
			} else {
				createNoResultDiv(block);
			}

		} else {
			console.error('No data fetched from API.');
		}
	} catch (error) {
		console.error('Error fetching data:', error);
	}
}

function createNoResultDiv(block) {
	const notFoundContainer = document.createElement('div');
	notFoundContainer.id = "blogs-not-found-container";
	notFoundContainer.innerHTML = notFoundMsg;
	block.appendChild(notFoundContainer);
}

function getCategory() {
	const urlParams = getURLParameters();
	let category = urlParams['category'];
	if (category) {
		category = category.replace(/_/g, ' ').toLowerCase();
	} else if (pdpType) {
		category = pdpType.toLowerCase();
	} else {
		category = '';
	}
	return category;
}

// Render article cards
function renderCards(block, data) {
	const blogsContainer = document.createElement('div');
	blogsContainer.id = "blogs-container";
	blogsContainer.classList.add("blogs-container");
	block.appendChild(blogsContainer);

	data.forEach(blog => {
		const blogCard = document.createElement('div');
		blogCard.classList.add('blog-card');
		blogCard.innerHTML = `
			<a href="#"><img src="${blog.image}" alt="${blog.imagealt}">
				<div class="blog-content">
					<p class="article-date">${formatDate(blog.articlepublishdate)}</p>
					<p class="article-description">${blog.description}</p>
					<a href="#" class="read-more">${readMoreLabel}</a>
				</div>
			</a>
		`;
		blogsContainer.appendChild(blogCard);
	});
}

// Fetch data from API
async function fetchData(apiUrl) {
	try {
		const response = await fetch(apiUrl);
		const data = await response.json();
		return data.data;
	} catch (error) {
		console.error("Error fetching data:", error);
		return [];
	}
}

// Filter articles by category
function filterArticlesByCategory(data, selectedCategory) {
	return data.filter(article => article.category.toLowerCase() === selectedCategory.toLowerCase());
}

// Function to get URL parameters
function getURLParameters() {
	const params = new URLSearchParams(window.location.search);
	const paramObject = {};
	params.forEach((value, key) => {
		paramObject[key] = value;
	});
	return paramObject;
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
	const date = new Date(excelEpoch.getTime() + (serial - 2) * 24 * 60 * 60 * 1000);
	return date;
}

// Get data attribute value by name
function getDataAttributeValueByName(name) {
	const element = document.querySelector(`[data-${name}]`);
	return element ? element.getAttribute(`data-${name}`) : '';
}