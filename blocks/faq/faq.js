import { getDataAttributes } from '../utils/common.js';

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

function quesAnsChangeOnTags(tagsContainer, quesAnsData, quesAnsDiv) {
  const buttons = Array.from(tagsContainer.children);
  buttons.forEach((button, index) => {
    if (index === 0) {
      button.classList.add('active-tab');
    }

    button.addEventListener('click', function (event) {
      buttons.forEach((btn) => btn.classList.remove('active-tab'));
      this.classList.add('active-tab');
      const clickedButton = event.target;
      renderQA(quesAnsData, '', clickedButton.innerHTML, quesAnsDiv, '');
    });

  });
}

function normalizeCategory(category) {
  return category.toLowerCase().replace(/\s+/g, '_');
}

function normalizeTags(tags) {
  return tags.split(',').map((tag) => tag.trim().toLowerCase());
}

function normalizeText(text) {
  return text.trim().toLowerCase();
}

function renderCategoryDropdown(data, containerSelector) {
  const categories = [...new Set(data.map((item) => item.category))];
  const dropdown = document.createElement('select');
  dropdown.className = 'category-dropdown';
  dropdown.id = 'faq-loan-category-dropdown';

  categories.forEach((category) => {
    const option = document.createElement('option');
    option.classList.add('category-dropdown-option');
    option.value = normalizeCategory(category);
    option.textContent = category;
    dropdown.appendChild(option);
  });

  containerSelector.appendChild(dropdown);

  // Get the category from query params and set the selected option
  const urlParams = new URLSearchParams(window.location.search);
  const selectedCategory = urlParams.get('category');
  if (selectedCategory) {
    const categoryOption = Array.from(dropdown.options).find(
      (option) => option.value === normalizeCategory(selectedCategory),
    );
    if (categoryOption) {
      categoryOption.selected = true;
    } else {
      dropdown.options[0].selected = true;
    }
  } else {
    dropdown.options[0].selected = true;
  }
  return dropdown;
}

// Function to render tabs based on selected category
function renderTabs(data, selectedCategory, inputValue, tagsContainer) {
  tagsContainer.innerHTML = '';
  var filteredData;
  const notFoundEle = document.getElementById('faq-not-found');
  const faqLoanCategoryDropdown = document.getElementById('faq-loan-category-dropdown');
  if (inputValue.length >= 3) {
    const tagFilteredData = data.filter((item) => normalizeTags(item.tags));
    if (tagFilteredData.length > 0) {
      const categoryFilteredData = data.filter((item) => normalizeCategory(item.category).includes(selectedCategory.toLowerCase()));
      filteredData = [...new Set([...tagFilteredData, ...categoryFilteredData])];
      notFoundEle.style.display = 'none';
      faqLoanCategoryDropdown.style.display = 'block';
      tagsContainer.style.display = 'flex';
    } else {
      filteredData = tagFilteredData;
      notFoundEle.style.display = 'flex';
      faqLoanCategoryDropdown.style.display = 'none';
      tagsContainer.style.display = 'none';
    }
  } else {
    filteredData = data.filter((item) => normalizeCategory(item.category) === selectedCategory.toLowerCase());
    notFoundEle.style.display = 'none';
    faqLoanCategoryDropdown.style.display = 'block';
    tagsContainer.style.display = 'flex';
  }

  const tags = [...new Set(filteredData.flatMap((item) => item.tags.split(',').map((tag) => tag.trim())))];
  tags.forEach((tag) => {
    const button = document.createElement('button');
    button.className = 'tab-button';
    button.textContent = tag.trim();
    tagsContainer.appendChild(button);
  });
}

// Function to render category details
function renderCategoryDetails(data, selectedCategory, containerSelector) {
  containerSelector.innerHTML = '';

  const categoryData = data.find((item) => normalizeCategory(item.category) === selectedCategory);

  if (categoryData) {
    const detailsHTML = `
    <div class="banner-container">
    <div class="img-container">
    <img src="${categoryData.Image}" class="banner-image" alt="${categoryData.category}">
    </div>
    <div class="content-container">
            <div class="heading-container">
              <h3>${categoryData.category}</h3>
            </div>
            <div class="description-container">
             <p>${categoryData.description}</p>
            </div>
            <div class="details-container">
               <ul>${categoryData.FaqBulletsPoint.split('\n').map((point) => `<li>${point}</li>`).join('')}</ul>
               </div>
            <div class="btn-container"> 
            <a href="${categoryData.ApplyNowLink}" target="_blank" class="apply-now btn-details">${categoryData.ApplyNow}</a>
            <a href="${categoryData.KnowMoreLink}" target="_blank"  class="know-more btn-details">${categoryData.KnowMore}</a>
              </div>
    </div>
    </div>
            `;
    containerSelector.innerHTML = detailsHTML;
  }
}

function renderQA(data, selectedCategory, tagsName, containerSelector, inputValue) {
  containerSelector.innerHTML = '';
  var filteredData;
  if (selectedCategory) {
    filteredData = data.filter((item) => normalizeCategory(item.category) === selectedCategory);
  } else {
    if (tagsName) {
      filteredData = data.filter((item) => normalizeTags(item.tags).includes(tagsName.toLowerCase()));
    }
    if (inputValue && inputValue.length >= 3) {
      const normalizedSearchTerm = normalizeText(inputValue);
      filteredData = data.filter((item) =>
        normalizeText(item.question).includes(normalizedSearchTerm)
       || normalizeText(item.answer).includes(normalizedSearchTerm),
      );
      const tagsContainer = document.querySelector('.tags-button');
      renderTabs(filteredData, '', normalizedSearchTerm, tagsContainer);
    }
  }

  filteredData.forEach((item) => {
    const qaItem = document.createElement('div');
    qaItem.className = 'qa-item';

    const question = document.createElement('h4');
    question.classList.add('faq-heading');
    question.textContent = item.question;
    qaItem.appendChild(question);

    const answer = document.createElement('p');
    answer.classList.add('faq-description');
    answer.textContent = item.answer;
    qaItem.appendChild(answer);

    qaItem.addEventListener('click', () => {
      qaItem.classList.toggle('active');
    });

    containerSelector.appendChild(qaItem);
  });
  const accordionHeaders = containerSelector.querySelectorAll('.qa-item h4');

  accordionHeaders.forEach((question, index) => {
    // Initially open the first question
    if (index === 0) {
      question.classList.add('active');
      question.nextElementSibling.style.display = 'block';
    }

    question.addEventListener('click', function () {
      const isActive = this.classList.contains('active');

      // Close all panels
      accordionHeaders.forEach((header) => {
        header.classList.remove('active');
        header.nextElementSibling.style.display = 'none';
      });

      // If the clicked panel was not active, open it
      if (!isActive) {
        this.classList.add('active');
        this.nextElementSibling.style.display = 'block';
      }
    });
  });
}

export default async function decorate(block) {
  const container = block.closest('.faq-container');
  const attributeObj = getDataAttributes(container);

  //   let bannerDataArray;
  const upperContainer = document.createElement('div');
  upperContainer.className = 'upperContainer';
  block.appendChild(upperContainer);

  const middleContainer = document.createElement('div');
  middleContainer.className = 'middleContainer';
  block.appendChild(middleContainer);

  const lowerContainer = document.createElement('div');
  lowerContainer.className = 'lowerContainer';
  block.appendChild(lowerContainer);

  // Create search container div
  const searchContainer = document.createElement('div');
  searchContainer.className = 'search-container';
  upperContainer.appendChild(searchContainer);

  const tagsContainer = document.createElement('div');
  tagsContainer.className = 'tags-button';
  middleContainer.appendChild(tagsContainer);

  const notFoundDiv = document.createElement('div');
  notFoundDiv.id = 'faq-not-found';
  const warningText = document.createElement('p');
  warningText.innerHTML = 'Sorry, Couldn’t find what you’re looking for.';
  notFoundDiv.appendChild(warningText);
  notFoundDiv.style.display = 'none';
  middleContainer.appendChild(notFoundDiv);

  const productPageDiv = document.createElement('div');
  productPageDiv.className = 'product-page';
  lowerContainer.appendChild(productPageDiv);

  const quesAnsDiv = document.createElement('div');
  quesAnsDiv.className = 'ques-ans';
  lowerContainer.appendChild(quesAnsDiv);

  // Create input field
  const inputField = document.createElement('input');
  inputField.type = 'text';
  inputField.className = 'input-field';
  inputField.placeholder = 'What are you looking for?';
  const searchIconContainer = document.createElement('div');
  searchIconContainer.classList.add('icon-container');
  searchIconContainer.innerHTML = `<img src=${attributeObj.searchicon} alt=${'attributeObj.seachiconalttext'} class='icon'>`;

  searchContainer.append(searchIconContainer);
  searchContainer.appendChild(inputField);

  try {
    const quesAnsUrl = attributeObj.quesansurl;
    const quesAnsData = await fetchData(quesAnsUrl);
    const productPageUrl = attributeObj.productpageurl;
    const productPageData = await fetchData(productPageUrl);
    const dropdown = renderCategoryDropdown(quesAnsData, upperContainer);

    // Initial render of tabs based on the initial category
    renderTabs(quesAnsData, dropdown.value, '', tagsContainer);
    renderCategoryDetails(productPageData, dropdown.value, productPageDiv);
    renderQA(quesAnsData, dropdown.value, '', quesAnsDiv, '');

    quesAnsChangeOnTags(tagsContainer, quesAnsData, quesAnsDiv);

    dropdown.addEventListener('change', () => {
      renderTabs(quesAnsData, dropdown.value, '', tagsContainer);
      renderCategoryDetails(productPageData, dropdown.value, productPageDiv);
      renderQA(quesAnsData, dropdown.value, '', quesAnsDiv, '');
      quesAnsChangeOnTags(tagsContainer, quesAnsData, quesAnsDiv);
    });

    inputField.addEventListener('input', function (event) {
      const inputValue = event.target.value.trim();
      if (inputValue.length >= 3) {
        renderQA(quesAnsData, '', '', quesAnsDiv, inputValue);
      } else {
        if (inputValue.length < 3) {
          renderTabs(quesAnsData, dropdown.value, inputValue, tagsContainer);
          quesAnsChangeOnTags(tagsContainer, quesAnsData, quesAnsDiv);
          const tagsButtonDiv = block.querySelector('.tags-button');
          const activeTabButton = tagsButtonDiv.querySelector('.tab-button.active-tab');
          const activeTab = activeTabButton.innerHTML;
          if (!activeTab) {
            return;
          } else {
            renderQA(quesAnsData, '', activeTab, quesAnsDiv, '');
          }
        }
      }
      quesAnsChangeOnTags(tagsContainer, quesAnsData, quesAnsDiv);
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
