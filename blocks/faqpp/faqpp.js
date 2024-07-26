const quesAnsUrl = getDataAttributeValueByName('quesansurl');
const faqDesktopTitle = getDataAttributeValueByName('desktopTitle');
const faqMobileTitle = getDataAttributeValueByName('mobileTitle');
const cannotFindLabel = getDataAttributeValueByName('cannotfindlabel');
const viewAllLabel = getDataAttributeValueByName('viewallbuttonlabel');
const viewAllRedirection = getDataAttributeValueByName('viewallbuttonredirection');

// Main function to decorate the FAQ block
export default async function decorate(block) {
  // Create FAQ container and append to the block
  const faqmobileTitlediv = document.createElement('div');
  faqmobileTitlediv.className = 'faq-container-titleMobile';
  faqmobileTitlediv.textContent = faqMobileTitle;
  block.appendChild(faqmobileTitlediv);
  const faqContainer = document.createElement('div');
  faqContainer.className = 'faq-container';
  block.appendChild(faqContainer);

  // Create FAQ tabs container and append to the FAQ container
  const faqTabs = document.createElement('div');
  faqTabs.className = 'faq-tabs';
  faqContainer.appendChild(faqTabs);

  // Create title container and append to the FAQ tabs
  const titleContainer = document.createElement('div');
  titleContainer.className = 'main-title';
  const title = document.createElement('h2');
  title.classList.add('title');
  changeTiltleWithScreens(title);
  window.addEventListener('resize', () => { changeTiltleWithScreens(title) });

  titleContainer.append(title);
  faqTabs.append(titleContainer);

  // Create and append 'Can't Find' element to the FAQ tabs
  const cantFindEl1 = createCantFindEl();
  faqTabs.append(cantFindEl1);

  // Create FAQ accordion container and append to the FAQ container
  const faqAccordion = document.createElement('div');
  faqAccordion.className = 'faq-accordion';
  faqContainer.appendChild(faqAccordion);

  try {
    // Fetch Q&A data from the API
    const quesAnsData = await fetchData(quesAnsUrl);

    // Get the selected category from the URL parameter or data attribute
    let selectedCategory = getParameterByName('category');
    if (selectedCategory === null || selectedCategory === '') {
      selectedCategory = getDataAttributeValueByName('productPageName').toLowerCase();
    }

    // Filter Q&A data based on the selected category
    const filteredData = quesAnsData.filter(item => item.category.toLowerCase() === selectedCategory);

    // Extract unique tags from the filtered data and render them
    const tags = [...new Set(filteredData.flatMap(item => normalizeTags(item.tags)))];
    renderTags(tags, faqTabs);

    // Render Q&A items based on the selected category
    renderQA(filteredData, selectedCategory, '', faqAccordion);

    // Handle Q&A changes based on tag selection
    quesAnsChangeOnTags(faqTabs, quesAnsData, faqAccordion);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Function to retrieve the value of a data attribute by name
function getDataAttributeValueByName(name) {
  const element = document.querySelector(`[data-${name}]`);
  return element ? element.getAttribute(`data-${name}`) : '';
}

// Function to fetch data from the provided API URL
async function fetchData(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

// Function to retrieve the value of a URL parameter by name
function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' ')).replace(/_/g, ' ');
}

// Function to normalize category by converting to lowercase and replacing spaces with underscores
function normalizeCategory(category) {
  return category.toLowerCase().replace(/ /g, '_');
}

// Function to normalize tags by trimming whitespace, converting to lowercase, and splitting by commas
function normalizeTags(tags) {
  if (!tags || tags.trim().length === 0) {
    return [];
  }
  return tags.includes(',') ? tags.split(',').map(tag => tag.trim().toLowerCase()) : [tags.trim().toLowerCase()];
}

// Function to render tags as buttons within the container
function renderTags(tags, container) {
  const tagBtnContainer = document.createElement('div');
  tagBtnContainer.classList.add('tags-btn-container');

  tags.forEach((tag, index) => {
    const button = document.createElement('button');
    button.className = 'tag-button';
    button.textContent = tag;
    tagBtnContainer.appendChild(button);
  });

  container.insertBefore(tagBtnContainer, container.children[1]);
}

// Function to render the Q&A items within the container
function renderQA(data, selectedCategory, selectedTag, container) {
  container.innerHTML = '';
  let filteredData;

  // Filter data based on the selected category or tag
  if (selectedCategory) {
    filteredData = data.filter(item => item.category.toLowerCase() === selectedCategory);
  } else {
    filteredData = data.filter(item => normalizeTags(item.tags).includes(selectedTag.toLowerCase()));
  }

  // Create and append Q&A items to the container
  filteredData.forEach(item => {
    const qaItem = document.createElement('div');
    qaItem.className = 'qa-item';

    const question = document.createElement('h4');
    question.classList.add('faq-heading');
    question.textContent = item.question;
    qaItem.appendChild(question);

    const answer = document.createElement('p');
    answer.textContent = item.answer;
    qaItem.appendChild(answer);

    // Toggle Q&A item on click
    qaItem.addEventListener('click', () => {
      qaItem.classList.toggle('active');
    });

    container.appendChild(qaItem);
  });

  // Add 'Can't Find' element at the end
  const cantFindDivEl2 = createCantFindEl();
  container.append(cantFindDivEl2);

  // Add click event to accordion headers for expand/collapse functionality
  const accordionHeaders = container.querySelectorAll('.qa-item h4');
  accordionHeaders.forEach((question, index) => {
    if (index === 0) {
      question.classList.add('active');
      question.nextElementSibling.style.display = 'block';
    }

    question.addEventListener('click', function () {
      const isActive = this.classList.contains('active');

      accordionHeaders.forEach(header => {
        header.classList.remove('active');
        header.nextElementSibling.style.display = 'none';
      });

      if (!isActive) {
        this.classList.add('active');
        this.nextElementSibling.style.display = 'block';
      }
    });
  });
}

// Function to create the 'Can't Find' element
function createCantFindEl() {
  let cannotFindDiv = document.createElement('div');
  cannotFindDiv.className = 'cannot-find-container';

  const cannotFindText = document.createElement('p');
  cannotFindText.classList.add('cannot-find-text');
  cannotFindText.textContent = cannotFindLabel;
  cannotFindDiv.append(cannotFindText);

  const viewAllDiv = document.createElement('div');
  viewAllDiv.className = 'view-all-label';
  viewAllDiv.textContent = viewAllLabel;
  viewAllDiv.onclick = () => {
    window.location.href = viewAllRedirection;
  };
  cannotFindDiv.appendChild(viewAllDiv);

  return cannotFindDiv;
}

// Function to change title based on screen size
function changeTiltleWithScreens(title) {
  if (window.matchMedia('(max-width: 600px)').matches) {
    title.textContent = faqMobileTitle;
  } else {
    title.textContent = faqDesktopTitle;
  }
}

// Function to handle Q&A change based on selected tags
function quesAnsChangeOnTags(faqTabs, quesAnsData, faqAccordion) {
  let selectedCategory = getParameterByName('category');
  if (selectedCategory === null || selectedCategory === '') {
    selectedCategory = getDataAttributeValueByName('productPageName').toLowerCase();
  }
  let filteredData = [];
  if (selectedCategory) {
    filteredData = quesAnsData.filter(item => item.category.toLowerCase() === selectedCategory);
  }

  // Add click event to tag buttons for filtering Q&A items
  const buttons = faqTabs.querySelectorAll('.tags-btn-container .tag-button');
  buttons.forEach(function (button, index) {
    if (index === 0) button.classList.add('active-tag');
    button.addEventListener('click', function (event) {
      buttons.forEach(btn => btn.classList.remove('active-tag'));
      this.classList.add('active-tag');

      const clickedButton = event.target;
      renderQA(filteredData, '', clickedButton.innerHTML, faqAccordion);
    });
  });
}
