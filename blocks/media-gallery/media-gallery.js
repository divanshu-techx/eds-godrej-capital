function createAndAppendElement(parent, elementType, attributes = {}) {
  const element = document.createElement(elementType);
  Object.keys(attributes).forEach((key) => {
    element.setAttribute(key, attributes[key]);
  });
  parent.appendChild(element);
  return element;
}

function truncateText(text, maxLength) {
  return text.length > maxLength ? `${text.substring(0, maxLength)}…` : text;
}

function truncateDescription(text) {
  const maxLength = 150;
  const truncatedText = text.length > maxLength ? `${text.substring(0, maxLength)}…` : text;
  return truncatedText.split('\n').slice(0, 3).join('\n');
}

function handleSearch(searchInput, cardsContainer) {
  let noResultsMessage = null; // Initialize no results message variable
  document.body.addEventListener('input', (event) => {
    if (event.target === searchInput) {
      const searchQuery = searchInput.value.trim().toLowerCase();

      // If search query length is less than 3, display all cards
      if (searchQuery.length < 3) {
        cardsContainer.querySelectorAll('.card').forEach((card) => {
          card.style.display = 'block';
        });

        // Remove no results message if exists
        if (noResultsMessage) {
          noResultsMessage.remove();
          noResultsMessage = null; // Reset no results message variable
        }
        return;
      }

      let hasResults = false; // Flag to check if any matching card is found

      // Filter cards based on search query
      cardsContainer.querySelectorAll('.card').forEach((card) => {
        const headingText = card.querySelector('h5').textContent.toLowerCase();
        const isVisible = headingText.includes(searchQuery);
        card.style.display = isVisible ? 'block' : 'none';
        if (isVisible) {
          hasResults = true; // Set flag to true if any matching card is found
        }
      });

      // Display 'No results found' message only if no matching cards are found
      if (!hasResults && !noResultsMessage) {
        noResultsMessage = document.createElement('p');
        noResultsMessage.textContent = 'No results found';
        noResultsMessage.className = 'no-results-message';
        noResultsMessage.style.textAlign = 'center';
        cardsContainer.appendChild(noResultsMessage);
      } else if (hasResults && noResultsMessage) {
        // Remove 'No results found' message if matching cards are found
        noResultsMessage.remove();
        noResultsMessage = null; // Reset no results message variable
      }
    }
  });
}

function createControls(parent) {
  const controlsWrapper = createAndAppendElement(parent, 'div', {
    class: 'controls-wrapper',
  });

  const tabSelector = createAndAppendElement(controlsWrapper, 'div', {
    class: 'tab-selector',
  });
  const videoTab = createAndAppendElement(tabSelector, 'button', {
    class: 'tab active',
    'data-tab-name': 'video',
  });
  videoTab.textContent = 'Video';
  const pictureTab = createAndAppendElement(tabSelector, 'button', {
    class: 'tab',
    'data-tab-name': 'picture',
  });
  pictureTab.textContent = 'Picture Gallery';

  createAndAppendElement(controlsWrapper, 'input', {
    type: 'text',
    class: 'search-field',
    placeholder: 'What are you looking for?',
  });

  const dropdownSelector = createAndAppendElement(controlsWrapper, 'select', {
    class: 'dropdown-selector',
  });
  const optionDefault = createAndAppendElement(dropdownSelector, 'option', {
    value: '',
  });
  optionDefault.textContent = 'Sort By';
  const option1 = createAndAppendElement(dropdownSelector, 'option', {
    value: 'old_to_new',
  });
  option1.textContent = 'Date (Old to New)';
  const option2 = createAndAppendElement(dropdownSelector, 'option', {
    value: 'new_to_old',
  });
  option2.textContent = 'Date (New to Old)';

  return {
    videoTab,
    pictureTab,
    dropdownSelector,
  };
}

async function fetchData(url) {
  const response = await fetch(url);
  return response.json();
}

function createVideoCards(data, container) {
  data.forEach((item) => {
    const card = createAndAppendElement(container, 'div', { class: 'card' });

    const videoUrl = item.videoUrl.replace('watch?v=', 'embed/');
    createAndAppendElement(card, 'iframe', {
      src: videoUrl,
      frameborder: '0',
      allow:
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
      allowfullscreen: true,
    });

    const heading = createAndAppendElement(card, 'h5');
    heading.textContent = truncateText(item.Heading, 45);

    const description = createAndAppendElement(card, 'p');
    description.textContent = truncateDescription(item.Description);
  });
}

// Display Slides in picture gallery
async function fetchAndDisplayHtml(url, container, categoryDiv) {
  const response = await fetch(url);
  const html = await response.text();

  // Parse the fetched HTML to extract the myalbum div
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const album = doc.querySelector('.myalbum');

  // Append the myalbum div to the container
  container.innerHTML = '';
  container.appendChild(album);

  // Get all direct child divs of the 'myalbum' element
  const childDivs = album.querySelectorAll(':scope > div');

  // Loop through each child div and add a new class name
  childDivs.forEach((div) => {
    div.classList.add('myalbum-child');
    const childDiv = div.querySelectorAll(':scope > div');
    childDiv.forEach((child) => {
      child.classList.add('myalbum-child-div');
    });
  });

  // Hide text and links
  childDivs.forEach((div) => {
    const text = div.querySelector('p');
    const link = div.querySelector('a');
    if (text) text.style.display = 'none';
    if (link) link.style.display = 'none';
  });

  // Count images and videos
  let imageCount = 0;
  let videoCount = 0;
  childDivs.forEach((div) => {
    if (div.querySelector('img')) {
      imageCount += 1;
    } else if (div.querySelector('a')) {
      videoCount += 1;
    }
  });

  // Create and append the div displaying the count of images and videos
  const countDiv = document.createElement('div');
  countDiv.innerHTML = `${imageCount} Images  ${videoCount} Videos`;
  countDiv.classList.add('count-div');
  categoryDiv.appendChild(countDiv);

  // Create the thumbnail container
  const thumbnailContainer = document.createElement('div');
  thumbnailContainer.classList.add('thumbnail-container');
  album.appendChild(thumbnailContainer);

  let slideIndex = 0;
  function showSlides(n) {
    const slides = document.querySelectorAll('.myalbum-child');

    if (n >= slides.length) {
      slideIndex = 0;
    }
    if (n < 0) {
      slideIndex = slides.length - 1;
    }

    slides.forEach((slide) => {
      slide.classList.remove('active');
      const img = slide.querySelector('img');
      const video = slide.querySelector('video'); // Change to video tag
      if (img) img.style.display = 'none';
      if (video) video.style.display = 'none';
    });

    const activeSlide = slides[slideIndex];
    activeSlide.classList.add('active');

    const img = activeSlide.querySelector('img');
    const link = activeSlide.querySelector('a');

    if (img) {
      img.style.display = 'block';
    } else if (link) {
      let video = activeSlide.querySelector('video'); // Change to video tag
      if (!video) {
        video = document.createElement('video'); // Change to video tag
        video.src = link.href;
        video.controls = true;
        video.width = 640;
        video.height = 360;
        activeSlide.appendChild(video);
      }
      video.style.display = 'block';
    }

    // Highlight the active thumbnail
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumbnail, index) => {
      if (index === slideIndex) {
        thumbnail.style.opacity = '0.6';
        thumbnail.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        });
      } else {
        thumbnail.style.opacity = '1';
      }
    });
  }

  // Add thumbnails to the container
  childDivs.forEach((div, index) => {
    const img = div.querySelector('img');
    const link = div.querySelector('a');
    const thumbnail = document.createElement('div');
    thumbnail.classList.add('thumbnail');
    let thumbnailImg;

    if (img) {
      thumbnailImg = img.cloneNode();
      thumbnailImg.width = 100; // Thumbnail width
    } else if (link) {
      thumbnailImg = document.createElement('img');
      thumbnailImg.src = 'video-thumbnail-placeholder.png'; // Fallback placeholder for video thumbnails
      thumbnailImg.width = 100; // Thumbnail width
    }

    if (thumbnailImg) {
      thumbnail.appendChild(thumbnailImg);
      thumbnail.addEventListener('click', () => {
        showSlides((slideIndex = index));
      });
      thumbnailContainer.appendChild(thumbnail);
    }
  });

  showSlides(slideIndex);
  function handlePrevButtonClick() {
    showSlides(slideIndex -= 1);
  }

  function handleNextButtonClick() {
    showSlides(slideIndex += 1);
  }

  // Create navigation buttons
  const prevButton = document.createElement('a');
  prevButton.classList.add('prev');
  prevButton.innerHTML = '&#10094;';
  prevButton.addEventListener('click', handlePrevButtonClick);

  const nextButton = document.createElement('a');
  nextButton.classList.add('next');
  nextButton.innerHTML = '&#10095;';
  nextButton.addEventListener('click', handleNextButtonClick);

  album.appendChild(prevButton);
  album.appendChild(nextButton);
}

function createPictureCards(data, container) {
  data.forEach((item) => {
    const card = createAndAppendElement(container, 'div', { class: 'card' });

    createAndAppendElement(card, 'img', {
      src: item.img_url,
      alt: item.category,
      style: 'width: 100%; height: 200px;',
    });

    const heading = createAndAppendElement(card, 'h5');
    heading.textContent = item.category.toUpperCase();

    card.addEventListener('click', async () => {
      container.innerHTML = '';
      const categoryDiv = createAndAppendElement(container, 'div', {
        class: 'category-div',
      });

      const goBackButton = createAndAppendElement(categoryDiv, 'button', {
        class: 'go-back-button',
      });
      goBackButton.textContent = 'Go Back';

      const categoryHeading = createAndAppendElement(categoryDiv, 'h5', {
        class: 'category-heading',
      });
      categoryHeading.textContent = item.category.toUpperCase();

      goBackButton.addEventListener('click', () => {
        container.innerHTML = '';
        categoryDiv.remove();
        createPictureCards(data, container);
      });

      const cardContainer = createAndAppendElement(container, 'div', {
        class: 'main-card-div',
        style: 'display: flex;',
      });
      fetchAndDisplayHtml(item.album_doc, cardContainer, categoryDiv);
    });
  });
}

function handleTabSwitching(tabs, contents) {
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const tabName = tab.getAttribute('data-tab-name');
      tabs.forEach((t) => {
        t.classList.remove('active');
        t.style.color = 'black'; // Unselected tab text color
      });
      tab.classList.add('active');
      tab.style.color = 'white'; // Selected tab text color
      contents.forEach((content) => {
        content.style.display = content.getAttribute('data-tab-content') === tabName ? 'block' : 'none';
      });
    });
  });
}

function handleSorting(dropdownSelector, data, container, createCards) {
  dropdownSelector.addEventListener('change', () => {
    const sortOrder = dropdownSelector.value;

    if (sortOrder) {
      const sortedData = [...data].sort((a, b) => {
        const dateA = new Date(a.date.split('.').reverse().join('-'));
        const dateB = new Date(b.date.split('.').reverse().join('-'));

        return sortOrder === 'old_to_new' ? dateA - dateB : dateB - dateA;
      });

      container.innerHTML = '';
      createCards(sortedData, container);
    }
  });
}

export default async function decorate() {
  const mediatabWrapper = document.querySelector('.media-gallery-wrapper');

  const { pictureTab, dropdownSelector } = createControls(mediatabWrapper);

  const videoContent = createAndAppendElement(mediatabWrapper, 'div', {
    class: 'tab-content',
    'data-tab-content': 'video',
    style: 'display: block;',
  });
  const videoCardsContainer = createAndAppendElement(videoContent, 'div', {
    class: 'cards-container',
  });

  const pictureContent = createAndAppendElement(mediatabWrapper, 'div', {
    class: 'tab-content',
    'data-tab-content': 'picture',
    style: 'display: none;',
  });
  const pictureCardsContainer = createAndAppendElement(pictureContent, 'div', {
    class: 'cards-container',
  });

  const videoData = await fetchData(
    'https://main--godrej-capital-internal--divanshu-techx.hlx.page/website/mediagallery-video.json',
  );
  createVideoCards(videoData.data, videoCardsContainer);

  const pictureData = await fetchData(
    'https://main--godrej-capital-internal--divanshu-techx.hlx.page/website/mediagallery-picture.json',
  );

  pictureTab.addEventListener('click', async () => {
    if (pictureCardsContainer.children.length === 0) {
      createPictureCards(pictureData.data, pictureCardsContainer);
    }
  });

  handleSorting(
    dropdownSelector,
    videoData.data,
    videoCardsContainer,
    createVideoCards,
  );
  handleSorting(
    dropdownSelector,
    pictureData.data,
    pictureCardsContainer,
    createPictureCards,
  );

  const tabs = document.querySelectorAll('.tab');
  const contents = document.querySelectorAll('.tab-content');
  handleTabSwitching(tabs, contents);

  handleSearch(document.querySelector('.search-field'), videoCardsContainer);
  handleSearch(document.querySelector('.search-field'), pictureCardsContainer);
}
