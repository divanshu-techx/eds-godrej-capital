var quesAnsUrl = getDataAttributeValueByName('quesansurl');
console.log(quesAnsUrl);
var productPageUrl = getDataAttributeValueByName('productpageurl');
console.log(productPageUrl);


export default async function decorate(block) {
  let bannerDataArray;
  const mainContainer = document.createElement('div');
  mainContainer.className = 'container';
  block.appendChild(mainContainer);

  // Create search container div
  const searchContainer = document.createElement('div');
  searchContainer.className = 'search-container';
  mainContainer.appendChild(searchContainer);

  // Create input field
  const inputField = document.createElement('input');
  inputField.type = 'text';
  inputField.className = 'input-field';
  inputField.placeholder = 'What are you looking for?';
  searchContainer.appendChild(inputField);

  try {
    const responseData = await fetch(quesAnsUrl
    );
    const dataObj = await responseData.json();
    const originalData = dataObj.data;

    // Event listener for input field
    inputField.addEventListener('input', (event) => {
      const searchTerm = event.target.value.trim().toLowerCase();
      const categoryItem = document.querySelector('.product_dropdown').value.trim().toLowerCase();
      const searcharay = [searchTerm, categoryItem];
      const categorytagsSearched = getTagsBySearchTerm(originalData, categoryItem);
      if (searchTerm.length <= 3) {
        const tagsSerched = getTagsBySearchTerm(originalData, categoryItem);
        createTagsButtons('.faq.block .container', tagsSerched);
        const filteredData = originalData.filter((item) =>
          // Check if the question or answer contains the search ter
          (
            item.question.toLowerCase().includes(categoryItem.toLowerCase())
            || item.answer.toLowerCase().includes(categoryItem.toLowerCase())
          ));
        if (tagsSerched.length > 1) {
          renderQA('', '', categoryItem, filteredData);
          // Render the filtered question-answer pairs
        } else {
          renderNotFound();
        }
      }
      if (searchTerm.length >= 3) {
        const tagsSearched = getTagsBySearchTerm(originalData, searchTerm);
        if (JSON.stringify(categorytagsSearched) !== JSON.stringify(tagsSearched)){
        const combinedArray = categorytagsSearched.concat(tagsSearched);
        createTagsButtons('.faq.block .container', combinedArray);
        const filteredData = originalData.filter((item) => {
          // Check if the question or answer contains the search term
          const matchesSearchTerm = searcharay.some((searchTerm) =>
            item.question.toLowerCase().includes(searchTerm.toLowerCase())
            || item.answer.toLowerCase().includes(searchTerm.toLowerCase()));
          return (
            matchesSearchTerm
          );
        });

        if (tagsSearched.length > 1) {
          renderarrayQA('', '', searcharay, filteredData);
          // Render the filtered question-answer pairs
        } else {
          renderNotFound();
        }
      } else {
        // Clear the rendered question-answer pairs if the search term is less than 3 characters
        const notFoundContainer = document.querySelector(
          '.not-found-container',
        );
        if (notFoundContainer) {
          notFoundContainer.remove();
          document.querySelector('.tabs-container').classList.remove('d-none');
        } else {
          const category = document.querySelector('.product_dropdown').value;
          const tags = getTagsByCategory(category, originalData);
          createTagsButtons('.faq.block .container', tags);
        }
      }
      }
    });

    // Function to render no matches found screen
    function renderNotFound() {
      let notFoundContainer = document.querySelector('.not-found-container');

      if (!notFoundContainer) {
        notFoundContainer = document.createElement('div');
        notFoundContainer.className = 'not-found-container';
        searchContainer.insertAdjacentElement('afterend', notFoundContainer);
      }

      notFoundContainer.innerHTML = '';

      // Create and append no matches found message
      const message = document.createElement('p');
      message.textContent = 'Sorry, Couldn’t find what you’re looking for';

      // Append the message to the container
      notFoundContainer.appendChild(message);
      document.querySelector('.not-found-container').classList.remove('d-none');
    //  document.querySelector(".tabs-container").classList.add("d-none");
    } // Example usage:

    const category = getValueFromURL('category');
    const categoryDropdown = document.createElement('select');
    const tags = getTagsByCategory(category, originalData);
    // getCategoryObject(category,bannerDataArray)

    createTagsButtons('.faq.block .container', tags);

    const faqBannerContainer = document.createElement('div');
    faqBannerContainer.className = 'faq-banner-container';
    mainContainer.appendChild(faqBannerContainer);

    categoryDropdown.className = 'product_dropdown';

    const placeholderOption = document.createElement('option');
    placeholderOption.textContent = 'Select category';
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    categoryDropdown.appendChild(placeholderOption);

    const uniqueCategories = [
      ...new Set(originalData.map((item) => item.category)),
    ];
    uniqueCategories.forEach((optionData) => {
      const option = document.createElement('option');
      option.value = optionData;

      option.textContent = optionData;
      categoryDropdown.appendChild(option);
    });

    // Append dropdown to main container
    searchContainer.appendChild(categoryDropdown);
    // categroy dropdown end

    const cardContainer = document.createElement('div');
    cardContainer.className = 'card-container';
    faqBannerContainer.appendChild(cardContainer);
    renderQA(category, '', '', originalData);

    const categoryDropdownList = document.querySelector('.product_dropdown');
    categoryDropdownList.addEventListener('change', (event) => {
      const selectedCategory = event.target.value;
      const selectedTags = getTagsByCategory(selectedCategory, originalData);
      createTagsButtons('.faq.block .container', selectedTags);
      renderQA(selectedCategory, '', '', originalData);

      const result = filterDataByCategory(bannerDataArray, selectedCategory);

      // Check if filtered-card-container exists
      let newContainer = document.querySelector('.filtered-card-container');
      if (newContainer) {
        newContainer.innerHTML = ''; // Empty the existing container
      } else {
        newContainer = document.createElement('div');
        newContainer.className = 'filtered-card-container';
      }

      // Append new cards
      result.forEach((item) => {
        const card = renderBannerValue(item);
        newContainer.appendChild(card);
      });

      const cardContainer = document.querySelector('.card-container');
      const parent = cardContainer.parentNode;

      // Remove any existing filtered-card-container
      const existingContainers = parent.querySelectorAll(
        '.filtered-card-container',
      );
      existingContainers.forEach((container) => container.remove());

      // Insert the newContainer before cardContainer
      parent.insertBefore(newContainer, cardContainer);
    });

    fetchCarsoulData().then((data) => {
      if (data) {

        // Add conditional access here based on inspected structure

        if (Array.isArray(data)) {
          bannerDataArray = data;
        } else if (data && data.data) {
          bannerDataArray = data.data;
        } else if (data && data.faqItems) {
          bannerDataArray = data.faqItems;
        } else {
          bannerDataArray = [];
        }

        const result = filterDataByCategory(bannerDataArray, category);
        const newContainer = document.createElement('div');
        newContainer.className = 'filtered-card-container';

        result.forEach((item) => {
          const card = renderBannerValue(item);
          newContainer.appendChild(card);
        });

        const cardContainer = document.querySelector('.card-container');
        cardContainer.parentNode.insertBefore(newContainer, cardContainer);
      } else {
        console.log('Failed to retrieve FAQ data.');
      }
    });

    // Get the category value from the URL
    const categoryValue = getValueFromURL('category');
    if (categoryValue !== null) {
      selectDropdownOption('.product_dropdown', categoryValue);
    }

    // Assuming .tabs-container is a static parent element that contains the dynamically created tabs
    const tabsContainer = document.querySelector('.tabs-container');

    tabsContainer.addEventListener('click', (event) => {
      const targetTab = event.target.closest('.tab');
      if (!targetTab) return;

      renderQA('', targetTab.textContent, '', originalData);
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// function of making tabs intially
function createTagsButtons(selector, stringsArray) {
  const container = document.querySelector(selector);
  let tabContainer = container.querySelector('.tabs-container');
  if (!tabContainer) {
    tabContainer = document.createElement('div');
    tabContainer.className = 'tabs-container';
    container.appendChild(tabContainer);
  } else {
    tabContainer.innerHTML = '';
  }
  if (stringsArray.length > 0) {
    document.querySelector('.tabs-container').classList.remove('d-none');
    const notFoundContainer = document.querySelector('.not-found-container');
    if (notFoundContainer) {
      document.querySelector('.not-found-container').classList.add('d-none');
    }
    stringsArray.forEach((string) => {
      const tab = document.createElement('div');
      tab.textContent = string;
      tab.className = 'tab';
      tabContainer.appendChild(tab);
    });
  }
}

// method for getting tag by category
function getTagsByCategory(selectedCategory, data) {
  const filteredData = data.filter(
    (item) => item.category === selectedCategory,
  );
  const tagsArray = filteredData.map((item) => item.tags.split(','));
  const flattenedTagsArray = tagsArray.flat();
  return [...new Set(flattenedTagsArray)];
}

function getTagsBySearchTerm(data, searchTerm) {
  // Filter the data to include only items that contain the search term in any relevant field
  const filteredData = data.filter((item) => (
    item.category.toLowerCase().includes(searchTerm)
      || item.tags.toLowerCase().includes(searchTerm)
  ));
  const tagsArray = filteredData.map((item) => item.tags.split(','));
  const flattenedTagsArray = tagsArray.flat();

  // Remove duplicates by converting to a Set and then back to an array
  return [...new Set(flattenedTagsArray)];
}

// method for getting value by param name
function getValueFromURL(paramName) {
  const currentURL = new URL(window.location.href);
  const paramValue = currentURL.searchParams.get(paramName);
  if (paramValue !== null) {
    const processedValue = paramValue.replace(/_/g, ' ');
    return processedValue;
  }
  return null;
}

// Function to select an option in the dropdown based on its value
function selectDropdownOption(dropdownSelector, optionValue) {
  const dropdown = document.querySelector(dropdownSelector);
  for (let i = 0; i < dropdown.options.length; i++) {
    if (dropdown.options[i].value === optionValue) {
      dropdown.options[i].selected = true;
      break;
    }
  }
}

// function to render the question answer
function renderarrayQA(category, tags, searchText, data) {
  const filteredData = data.filter((item) => {
    const matchesCategory = category ? item.category === category : true;
    const matchesTags = tags ? item.tags.split(',').includes(tags) : true;
    const matchesText = searchText.length > 0
      ? searchText.some((searchTexts) => item.question.toLowerCase().includes(searchTexts.toLowerCase())
          || item.answer.toLowerCase().includes(searchTexts.toLowerCase()))
      : true;
    return matchesCategory && matchesTags && matchesText;
  });

  const cardContainer = document.querySelector('.card-container');
  cardContainer.innerHTML = '';
  filteredData.forEach((item) => {
    const accordion = document.createElement('div');
    accordion.className = 'accordion';

    const question = document.createElement('button');
    question.className = 'accordion-header';
    question.textContent = item.question;

    const answer = document.createElement('div');
    answer.className = 'accordion-content';
    answer.textContent = item.answer;

    accordion.appendChild(question);
    accordion.appendChild(answer);
    question.addEventListener('click', () => {
      answer.classList.toggle('active');
    });

    cardContainer.appendChild(accordion);
  });
}

// function to render the question answer
function renderQA(category, tags, searchText, data) {
  const filteredData = data.filter((item) => {
    const matchesCategory = category ? item.category === category : true;
    const matchesTags = tags ? item.tags.split(',').includes(tags) : true;
    const matchesText = searchText
      ? item.question.toLowerCase().includes(searchText.toLowerCase())
        || item.answer.toLowerCase().includes(searchText.toLowerCase())
      : true;
    return matchesCategory && matchesTags && matchesText;
  });

  const cardContainer = document.querySelector('.card-container');
  cardContainer.innerHTML = '';
  filteredData.forEach((item) => {
    const accordion = document.createElement('div');
    accordion.className = 'accordion';

    const question = document.createElement('button');
    question.className = 'accordion-header';
    question.textContent = item.question;

    const answer = document.createElement('div');
    answer.className = 'accordion-content';
    answer.textContent = item.answer;

    accordion.appendChild(question);
    accordion.appendChild(answer);
    question.addEventListener('click', () => {
      answer.classList.toggle('active');
    });

    cardContainer.appendChild(accordion);
  });
}

// function to render carsoul value on the basic of category
function renderBannerValue(item) {
  const card = document.createElement('div');
  card.className = 'banner-category';

  const imgDiv = document.createElement('div');
  imgDiv.className = 'banner-image';
  imgDiv.style.backgroundImage = `url(${item.Image})`;
  card.appendChild(imgDiv);

  const categoryDiv = document.createElement('div');
  categoryDiv.className = 'category';
  categoryDiv.innerText = item.category;
  card.appendChild(categoryDiv);

  const descriptionDiv = document.createElement('div');
  descriptionDiv.className = 'description';
  descriptionDiv.innerText = item.description;
  card.appendChild(descriptionDiv);

  const bulletsList = document.createElement('ul');
  bulletsList.className = 'bullets';
  item.BulletsPoint.split('\n').forEach((point) => {
    const li = document.createElement('li');
    li.innerText = point;
    bulletsList.appendChild(li);
  });
  card.appendChild(bulletsList);

  const applyNowAnchor = document.createElement('a');
  applyNowAnchor.className = 'apply-now';
  applyNowAnchor.href = item.ApplyNowLink;
  applyNowAnchor.innerText = item.ApplyNow;
  applyNowAnchor.target = '_blank'; // Open link in new tab
  card.appendChild(applyNowAnchor);

  const knowMoreAnchor = document.createElement('a');
  knowMoreAnchor.className = 'know-more';
  knowMoreAnchor.href = item.KnowMoreLink;
  knowMoreAnchor.innerText = item.KnowMore;
  knowMoreAnchor.target = '_blank'; // Open link in new tab
  card.appendChild(knowMoreAnchor);

  return card;
}

// fetching carsoul data from second json
async function fetchCarsoulData() {
  const url = productPageUrl;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Fetched data:', data); // Log the fetched data to inspect its structure
    return data;
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
    return null;
  }
}

// function for filter the data on the basis of category
function filterDataByCategory(data, category) {
  if (Array.isArray(data)) {
    return data.filter((item) => item.category === category);
  }
  console.error('Data is not an array:', data);
  return [];
}

// Retrieve the value of a data attribute by name
function getDataAttributeValueByName(name) {
  const element = document.querySelector(`[data-${name}]`);
  return element ? element.getAttribute(`data-${name}`) : '';
}


