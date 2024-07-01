const quesAnsUrl = getDataAttributeValueByName('quesansurl');
const title = getDataAttributeValueByName('title');
const cannotFindLabel = getDataAttributeValueByName('cannotfindlabel');
const viewAllLabel = getDataAttributeValueByName('viewallbuttonlabel');
const viewAllRedirection = getDataAttributeValueByName('viewallbuttonredirection');



export default async function decorate(block) {

  const faqContainer = document.createElement('div');
  faqContainer.className = 'faq-container';
  block.appendChild(faqContainer);

  const faqTabs = document.createElement('div');
  faqTabs.className = 'faq-tabs';
  faqContainer.appendChild(faqTabs);


  const mainTitle = document.createElement('div');
  mainTitle.className = 'main-title';
  mainTitle.textContent = title;
  faqTabs.appendChild(mainTitle);

  const cannotFindDiv = document.createElement('div');
  cannotFindDiv.className = 'cannot-find-label';
  cannotFindDiv.textContent = cannotFindLabel;
  faqTabs.appendChild(cannotFindDiv);

  const viewAllDiv = document.createElement('div');
  viewAllDiv.className = 'view-all-label';
  viewAllDiv.textContent = viewAllLabel;
  viewAllDiv.onclick = () => {
    window.location.href = viewAllRedirection;
  };
  faqTabs.appendChild(viewAllDiv);


  const faqAccordion = document.createElement('div');
  faqAccordion.className = 'faq-accordion';
  faqContainer.appendChild(faqAccordion);



  try {
    const quesAnsData = await fetchData(quesAnsUrl);



    const selectedCategory = getParameterByName('category');
    if (selectedCategory) {
      const filteredData = quesAnsData.filter(item => normalizeCategory(item.category) === selectedCategory);
      const tags = [...new Set(filteredData.flatMap(item => normalizeTags(item.tags)))];
      renderTags(tags, faqTabs, faqAccordion);
      renderQA(filteredData, selectedCategory, '', faqAccordion);
    }
    quesAnsChangeOnTags(faqTabs, quesAnsData, faqAccordion);



  } catch (error) {
    console.error('Error fetching data:', error);
  }
}


function quesAnsChangeOnTags(faqTabs, quesAnsData, faqAccordion) {
  const selectedCategory = getParameterByName('category');
  let filteredData;
  if (selectedCategory) {
    filteredData = quesAnsData.filter(item => normalizeCategory(item.category) === selectedCategory);
  }
  const buttons = Array.from(faqTabs.children);
  buttons.forEach(button => {
    button.addEventListener('click', function (event) {
      // Get the clicked button element
      const clickedButton = event.target;
      renderQA(filteredData, '', clickedButton.innerHTML, faqAccordion);
    });
  });
}

// Retrieve the value of a data attribute by name
function getDataAttributeValueByName(name) {
  const element = document.querySelector(`[data-${name}]`);
  return element ? element.getAttribute(`data-${name}`) : '';
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

function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function normalizeCategory(category) {
  return category.toLowerCase().replace(/ /g, '_');
}

function normalizeTags(tags) {
  return tags.split(',').map(tag => tag.trim().toLowerCase());
}

function renderTags(tags, containerSelector) {
  //containerSelector.innerHTML = '';
  tags.forEach(tag => {
    const button = document.createElement('button');
    button.className = 'tag-button';
    button.textContent = tag;

    containerSelector.appendChild(button);
  });
}




function renderQA(data, selectedCategory, selectedtags, containerSelector) {
  containerSelector.innerHTML = '';
  let filteredData;
  if (selectedCategory) {
    filteredData = data.filter(item => normalizeCategory(item.category) === selectedCategory);
  }
  else {
    filteredData = data.filter(item => normalizeTags(item.tags).includes(selectedtags.toLowerCase()));
  }



  filteredData.forEach(item => {
    const qaItem = document.createElement('div');
    qaItem.className = 'qa-item';

    const question = document.createElement('h4');
    question.textContent = item.question;
    qaItem.appendChild(question);

    const answer = document.createElement('p');
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
      accordionHeaders.forEach(header => {
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
