const quesAnsUrl = getDataAttributeValueByName('quesansurl');
const faqTitle = getDataAttributeValueByName('title');
const cannotFindLabel = getDataAttributeValueByName('cannotfindlabel');
const viewAllLabel = getDataAttributeValueByName('viewallbuttonlabel');
const viewAllRedirection = getDataAttributeValueByName('viewallbuttonredirection');
const mobileTitle = 'FAQs'



export default async function decorate(block) {

  const faqContainer = document.createElement('div');
  faqContainer.className = 'faq-container';
  block.appendChild(faqContainer);

  const faqTabs = document.createElement('div');
  faqTabs.className = 'faq-tabs';
  faqContainer.appendChild(faqTabs);

  const titleContainer = document.createElement('div');
  titleContainer.className = 'main-title';
  const title = document.createElement('h2');
  title.classList.add('title');
  changeTiltleWithScreens(title);
  window.addEventListener('resize', () => { changeTiltleWithScreens(title) });




  titleContainer.append(title)
  faqTabs.append(titleContainer);





  const cantFindEl1 = createCantFindEl();

  faqTabs.append(cantFindEl1);

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
  console.log(faqTabs)
  const buttons = faqTabs.querySelectorAll('.tags-btn-container .tag-button')
  buttons.forEach(function (button, index) {
    if (index === 0) button.classList.add('active-tag')
    button.addEventListener('click', function (event) {
      buttons.forEach(btn => btn.classList.remove('active-tag'));
      this.classList.add('active-tag')
      // Get the clicked button element
      const clickedButton = event.target;
      renderQA(filteredData, '', clickedButton.innerHTML, faqAccordion, cannotFindDiv);
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
  const tagBtnContainer = document.createElement('div');
  tagBtnContainer.classList.add('tags-btn-container');

  tags.forEach((tag, index) => {
    const button = document.createElement('button');
    button.className = 'tag-button';

    button.textContent = tag;
    tagBtnContainer.appendChild(button)

  });
  containerSelector.insertBefore(tagBtnContainer, containerSelector.children[1]);
}






function renderQA(data, selectedCategory, selectedtags, containerSelector, cannotFindDiv) {
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
    question.classList.add('faq-heading')
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
  const cantFindDivEl2 = createCantFindEl();
  containerSelector.append(cantFindDivEl2)
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

function createCantFindEl() {
  let cannotFindDiv = document.createElement('div');
  cannotFindDiv.className = 'cannot-find-container';
  const cannotFindText = document.createElement('p');
  cannotFindText.classList.add('cannot-find-text');
  cannotFindText.textContent = cannotFindLabel;
  cannotFindDiv.append(cannotFindText)
  // cannotFindDiv.textContent = cannotFindLabel;


  const viewAllDiv = document.createElement('div');
  viewAllDiv.className = 'view-all-label';
  viewAllDiv.textContent = viewAllLabel;
  viewAllDiv.onclick = () => {
    window.location.href = viewAllRedirection;
  };
  cannotFindDiv.appendChild(viewAllDiv);

  return cannotFindDiv;
}


function changeTiltleWithScreens(title) {
  if (window.matchMedia('(max-width: 600px)').matches) {
    console.log('mobile vew run')
    // Screen width is 600px or less
    title.textContent = mobileTitle;
  } else {
    // Screen width is more than 600px
    title.textContent = faqTitle
  }
}
