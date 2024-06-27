/**
 * Groups teaser elements by their data-teaser-target-id values within a given main element.
 *
 * @param {string} mainSelector - The CSS selector for the main element containing the teasers.
 * @returns {Object}  teaser elements.
 */
function groupTeasersByTargetId(mainSelector) {
  // Select the main element
  const mainElement = document.querySelector(mainSelector);

  // Check if main element exists
  if (!mainElement) {
    console.warn(`Main element not found with selector: ${mainSelector}`);
    return {};
  }

  // Select all elements with the data-teaser-target-id attribute within the main element
  const teaserContainers = mainElement.querySelectorAll('[data-teaser-target-id]');

  // If no teaser containers are found, return an empty object
  if (teaserContainers.length === 0) {
    console.warn(`No teaser containers found in main element with selector: ${mainSelector}`);
    return {};
  }

  // Group the teasers by their data-teaser-target-id values
  const groupedTeasers = Array.from(teaserContainers).reduce((groups, container) => {
    // Get the data attribute value
    const id = container.getAttribute("data-teaser-target-id");

    // Check if the container already processed (ensure to reset groups before processing)
    if (!groups._processed) {
      groups._processed = new Set();
    }

    if (groups._processed.has(container)) {
      console.warn(`Skipping already processed container with id: ${id}`);
      return groups;
    }

    // Get the teaser element
    const teaser = container.querySelector(".teaser");

    // If no teaser element is found, skip this container
    if (!teaser) {
      console.warn(`No teaser found in container with data-teaser-target-id: ${id}`);
      return groups;
    }

    // Initialize the group if it doesn't exist
    if (!groups[id]) {
      groups[id] = [];
    }

    // Add the teaser element to the group
    groups[id].push(teaser);
    
    // Mark this container as processed
    groups._processed.add(container);

    return groups;
  }, {});

  // Clean up the helper property
  delete groupedTeasers._processed;
 
  return groupedTeasers;

}


import { fetchPlaceholders } from '../../scripts/aem.js';



export default async function decorate(block) {
  const carouselContainer = block.closest('.carousel-v1-container');
  const targetId = carouselContainer.getAttribute('data-teaser-target-id');
// Select the main element
  let teaser = groupTeasersByTargetId('main'); 

  createCarousel(block, teaser[targetId],targetId);

}


async function createCarousel(block, rows,targetId){
  carouselId += 1;
  const placeholders = await fetchPlaceholders();
  const carouselContainer = block.closest('.carousel-v1-container');
  // Create the main carousel wrapper
  const mainElement = document.createElement('div');
  mainElement.classList.add('carousel-wrapper');
  mainElement.setAttribute('id', `carousel-v1-${carouselId}`);
 
  let summaryContent = carouselContainer.getAttribute("data-summary");
 

  // Append teaser containers to the main wrapper
  rows.forEach(teaser => {
    mainElement.appendChild(teaser);
  });

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', placeholders.carousel || 'Carousel-v1');

  // Append main element to block
  block.appendChild(mainElement);

  // Create container for slides
  const container = document.createElement('div');
  container.classList.add('carousel-v1-slides-container');

  // Create the slides wrapper
  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('carousel-v1-slides');
  mainElement.prepend(slidesWrapper);

  // Create navigation for slide indicators
  const slideIndicatorsNav = document.createElement('nav');
  slideIndicatorsNav.setAttribute('aria-label', placeholders.carouselSlideControls || 'Carousel Slide Controls');

  const summaryWrapper = document.createElement("div");
  summaryWrapper.className = 'summary-wrapper';
  const summary = document.createElement("div");
  summary.className = 'summary-content';
  summary.innerHTML = summaryContent;
  summaryWrapper.appendChild(summary);
  const progressBar = document.createElement('div');
  progressBar.classList.add('carousel-v1-progress-bar-container');
  progressBar.innerHTML = `<div class="carousel-v1-progress-bar"></div>`;
  // Create the <ol> element for slide indicators
  const slideIndicators = document.createElement('ol');
  slideIndicators.classList.add('carousel-v1-slide-indicators');

  // Create navigation buttons as DOM elements
  const prevButton = document.createElement('button');
  prevButton.type = 'button';
  prevButton.className = 'slide-prev';
  prevButton.setAttribute('aria-label', placeholders.previousSlide || 'Previous Slide');

  const nextButton = document.createElement('button');
  nextButton.type = 'button';
  nextButton.className = 'slide-next';
  nextButton.setAttribute('aria-label', placeholders.nextSlide || 'Next Slide');

  // Append navigation buttons to the slideIndicators
 let styleType = carouselContainer.getAttribute('data-teaser-target-id');
 if(styleType == 'homepage-carousel-secondary'){
  slideIndicators.appendChild(prevButton);
  slideIndicators.appendChild(nextButton);
 }
  
  // Append slideIndicators to slideIndicatorsNav
  slideIndicatorsNav.append(slideIndicators);

  // Append slideIndicatorsNav to block
  block.append(progressBar)
  block.append(summaryWrapper);
  block.append(slideIndicatorsNav);

  rows.forEach((row, idx) => {
    const slide = createSlide(row, idx, carouselId);
    slidesWrapper.append(slide);

    if (slideIndicators) {
      const indicator = document.createElement('li');
      indicator.classList.add('carousel-v1-slide-indicator');
      indicator.dataset.targetSlide = idx;
      indicator.innerHTML = `<button type="button"><span>${placeholders.showSlide || 'Show Slide'} ${idx + 1} ${placeholders.of || 'of'} ${rows.length}</span></button>`;
      if(styleType == 'homepage-carousel-secondary'){
      // Append indicator to slideIndicators
      slideIndicators.insertBefore(indicator, nextButton); // Insert each indicator before the next button
      }else{
      slideIndicators.append(indicator); 
      }
      const span = indicator.querySelector('span');
      const formattedIndex = String(idx + 1).padStart(2, '0'); // Formats index as 01, 02, etc.
      span.textContent = formattedIndex;
    }
    row.remove();
  });

  // Append slidesWrapper to container
  container.append(slidesWrapper);

  // Prepend container to block
  block.prepend(container);



  if (rows.length >= 2) {
    bindEvents(block);
    startAutoSlide(block);
  }

  const teaserContainers = document.querySelectorAll(`[data-teaser-target-id=${targetId}]`);
  teaserContainers.forEach(container => {
    if (container.innerHTML.trim() === '') {
      container.remove();
    }
  });

}

let carouselId = 0;



function createSlide(row, slideIndex, carouselId) {
 
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.setAttribute('id', `carousel-${carouselId}-slide-${slideIndex}`);
  slide.classList.add('carousel-v1-slide');

  row.querySelectorAll(':scope > div').forEach((column, colIdx) => {
    column.classList.add(`carousel-slide-v1-${colIdx === 0 ? 'image' : 'content'}`);
    slide.append(column);
  });

  const labeledBy = slide.querySelector('h1, h2, h3, h4, h5, h6');
  if (labeledBy) {
    slide.setAttribute('aria-labelledby', labeledBy.getAttribute('id'));
  }

  return slide;
}

function bindEvents(block) {
  const slides = block.querySelectorAll('.carousel-v1-slides > li');
  const totalSlides = slides.length;

  const slideIndicators = block.querySelectorAll('.carousel-v1-slide-indicator');
  if (!slideIndicators) return;

  slideIndicators.forEach((button) => {
    button.addEventListener('click', (e) => {
      const slideIndicator = e.currentTarget;
      showSlide(block, parseInt(slideIndicator.dataset.targetSlide, 10));
    });
  });

  const prevButton = block.querySelector('.slide-prev');
  const nextButton = block.querySelector('.slide-next');

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      const activeSlide = parseInt(block.dataset.activeSlide, 10);
      showSlide(block, isNaN(activeSlide) ? 0 : activeSlide - 1);
    });
  }
  
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      const activeSlide = parseInt(block.dataset.activeSlide, 10);
      showSlide(block, isNaN(activeSlide) ? 0 : activeSlide + 1);
    });
  }

  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) updateActiveSlide(entry.target);
    });
  }, { threshold: 0.5 });

  block.querySelectorAll('.carousel-v1-slide').forEach((slide) => {
    slideObserver.observe(slide);
  });

  updateProgressBar(0,totalSlides,block);
}


function updateProgressBar(currentSlideIndex, totalSlides,block) {
  const progressBar = block.querySelector('.carousel-v1-progress-bar');
  if (!progressBar) return;

  const progressPercentage = ((currentSlideIndex + 1) / totalSlides) * 100;
  progressBar.style.width = `${progressPercentage}%`;
}

function updateActiveSlide(slide) {
  const block = slide.closest('.carousel-v1');
  const slideIndex = parseInt(slide.dataset.slideIndex, 10);
  block.dataset.activeSlide = slideIndex;

  const slides = block.querySelectorAll('.carousel-v1-slide');

  slides.forEach((aSlide, idx) => {
    aSlide.setAttribute('aria-hidden', idx !== slideIndex);
    aSlide.querySelectorAll('a').forEach((link) => {
      if (idx !== slideIndex) {
        link.setAttribute('tabindex', '-1');
      } else {
        link.removeAttribute('tabindex');
      }
    });
  });

  const indicators = block.querySelectorAll('.carousel-v1-slide-indicator');
  indicators.forEach((indicator, idx) => {
    if (idx !== slideIndex) {
      indicator.querySelector('button').removeAttribute('disabled');
    } else {
      indicator.querySelector('button').setAttribute('disabled', 'true');
    }
  });

  updateProgressBar(slideIndex, slides.length,block);
}

let autoSlideTimer;

function startAutoSlide(block) {
  autoSlideTimer = setInterval(() => {
    const currentSlideIndex = parseInt(block.dataset.activeSlide, 10);
    showSlide(block, currentSlideIndex + 1);
  }, 10000); // 10 seconds
}

function resetAutoSlide(block) {
  clearInterval(autoSlideTimer);
  startAutoSlide(block);
}

function showSlide(block, slideIndex = 0) {
  const slides = block.querySelectorAll('.carousel-v1-slide');
  let realSlideIndex = slideIndex < 0 ? slides.length - 1 : slideIndex;
  if (slideIndex >= slides.length) realSlideIndex = 0;
  const activeSlide = slides[realSlideIndex];

  activeSlide.querySelectorAll('a').forEach((link) => link.removeAttribute('tabindex'));

  block.querySelector('.carousel-v1-slides').scrollTo({
    top: 10,
    left: activeSlide.offsetLeft,
    behavior: 'smooth',
  });

  // Update active slide index in the dataset for reference
  block.dataset.activeSlide = realSlideIndex;

  updateProgressBar(realSlideIndex, slides.length,block);
  resetAutoSlide(block);
}
