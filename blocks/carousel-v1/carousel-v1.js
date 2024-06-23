// export default async function decorate(block) {
//   initializeCarousel(block);
// }

// let carouselId = 0;
// function initializeCarousel(block) {
//     carouselId += 1;
//     const carouselContainer = block.closest('.carousel-v1-container');
//     const targetId = carouselContainer.getAttribute('data-teaser-target-id');
//     const isPagination = carouselContainer.getAttribute('data-pagination');
//     const summary = carouselContainer.getAttribute('data-summary');
//     const slideChangeTime = carouselContainer.getAttribute('data-timing');

//     const teaserContainers = document.querySelectorAll(`.teaser-container[data-teaser-target-id="${targetId}"]`);

//     const mainElement = document.createElement('div');
//     mainElement.classList.add('carousel-wrapper');
//     mainElement.setAttribute('id', `carousel-v1-${carouselId}`);

//     const isSingleSlide = teaserContainers.length < 2;

//     // Append teaser containers to the main wrapper
//     teaserContainers.forEach(teaser => {
//         mainElement.appendChild(teaser);
//     });
//     block.setAttribute('role', 'region');
//     block.setAttribute('aria-roledescription', 'Carousel-v1');

//     block.appendChild(mainElement);


//     const container = document.createElement('div');
//     container.classList.add('carousel-v1-slides-container');

//     const slidesWrapper = document.createElement('ul');
//     slidesWrapper.classList.add('carousel-v1-slides');

//     mainElement.prepend(slidesWrapper);

//   let slideIndicators;
//     if (!isSingleSlide) {
//        const slideIndicatorsNav = document.createElement('nav');
//        slideIndicatorsNav.setAttribute('aria-label','Carousel Slide Controls');
//        slideIndicators = document.createElement('ol');
//        slideIndicators.classList.add('carousel-v1-slide-indicators');
//        slideIndicatorsNav.append(slideIndicators);
//        block.append(slideIndicatorsNav);

//        const slideNavButtons = document.createElement('div');

//        slideNavButtons.classList.add('carousel-v1--navigation-buttons');
//        slideNavButtons.innerHTML = `
//          <button type="button" class= "slide-prev" aria-label='Previous Slide'></button>
//          <button type="button" class="slide-next" aria-label='Next Slide'></button>
//        `;

//        container.append(slideNavButtons);
//     }

//     teaserContainers.forEach((row,idx) => {
//         const slide = createSlide(row,idx, carouselId);
//         slidesWrapper.append(slide);

//          if (slideIndicators) {
//               const indicator = document.createElement('li');
//               indicator.classList.add('carousel-slide-indicator');
//               indicator.dataset.targetSlide = idx;
//               indicator.innerHTML = `<button type="button"><span>'Show Slide' ${idx + 1}  'of' ${teaserContainers.length}</span></button>`;
//               slideIndicators.append(indicator);
//             }
//             row.remove();
//     });
//      container.append(slidesWrapper);
//      block.prepend(container);

//      if (!isSingleSlide) {
//          bindEvents(block);
//       }
// }

// function createSlide(row, slideIndex, carouselId) {
//   const slide = document.createElement('li');
//   slide.dataset.slideIndex = slideIndex;
//   slide.setAttribute('id', `carousel-${carouselId}-slide-${slideIndex}`);
//   slide.classList.add('carousel-v1-slide');

//   row.querySelectorAll(':scope > div').forEach((column, colIdx) => {
//     column.classList.add(`carousel-slide-v1-${colIdx === 0 ? 'image' : 'content'}`);
//     slide.append(column);
//   });

//   const labeledBy = slide.querySelector('h1, h2, h3, h4, h5, h6');
//   if (labeledBy) {
//     slide.setAttribute('aria-labelledby', labeledBy.getAttribute('id'));
//   }

//   return slide;
// }

// function bindEvents(block) {
//   const slideIndicators = block.querySelector('.carousel-v1-slide-indicators');
//   if (!slideIndicators) return;

//   slideIndicators.querySelectorAll('button').forEach((button) => {
//     button.addEventListener('click', (e) => {
//       const slideIndicator = e.currentTarget.parentElement;
//       showSlide(block, parseInt(slideIndicator.dataset.targetSlide, 10));
//     });
//   });

//   block.querySelector('.slide-prev').addEventListener('click', () => {
//     showSlide(block, parseInt(block.dataset.activeSlide, 10) - 1);
//   });
//   block.querySelector('.slide-next').addEventListener('click', () => {
//     showSlide(block, parseInt(block.dataset.activeSlide, 10) + 1);
//   });

//   const slideObserver = new IntersectionObserver((entries) => {
//     entries.forEach((entry) => {
//       if (entry.isIntersecting) updateActiveSlide(entry.target);
//     });
//   }, { threshold: 0.5 });
//   block.querySelectorAll('.carousel-slide').forEach((slide) => {
//     slideObserver.observe(slide);
//   });
// }

// function showSlide(block, slideIndex = 0) {
//   const slides = block.querySelectorAll('.carousel-v1-slide');
//   let realSlideIndex = slideIndex < 0 ? slides.length - 1 : slideIndex;
//   if (slideIndex >= slides.length) realSlideIndex = 0;
//   const activeSlide = slides[realSlideIndex];

//   activeSlide.querySelectorAll('a').forEach((link) => link.removeAttribute('tabindex'));
//   block.querySelector('.carousel-v1-slides').scrollTo({
//     top: 0,
//     left: activeSlide.offsetLeft,
//     behavior: 'smooth',
//   });
// }

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
  const teaserContainers = mainElement.querySelectorAll(
    "[data-teaser-target-id]"
  );

  // If no teaser containers are found, return an empty object
  if (teaserContainers.length === 0) {
    console.warn(
      `No teaser containers found in main element with selector: ${mainSelector}`
    );
    return {};
  }

  // Group the teasers by their data-teaser-target-id values
  const groupedTeasers = Array.from(teaserContainers).reduce(
    (groups, container) => {
      // Get the data attribute value
      const id = container.getAttribute("data-teaser-target-id");

      // Get the teaser element
      const teaser = container.querySelector(".teaser");

      // If no teaser element is found, skip this container
      if (!teaser) {
        console.warn(
          `No teaser found in container with data-teaser-target-id: ${id}`
        );
        return groups;
      }

      // Initialize the group if it doesn't exist
      if (!groups[id]) {
        groups[id] = [];
      }

      // Add the teaser element to the group
      groups[id].push(teaser);

      return groups;
    },
    {}
  );

  return groupedTeasers;
}

import { fetchPlaceholders } from '../../scripts/aem.js';

export default async function decorate(block) {
  const carouselContainer = block.closest('.carousel-v1-container');
  const targetId = carouselContainer.getAttribute('data-teaser-target-id');
// Select the main element
  let teaser = groupTeasersByTargetId('main'); 

  createCarousel(block, teaser[targetId]);
//initializeCarousel(block);


}


async function createCarousel(block, rows){
  carouselId += 1;
  const placeholders = await fetchPlaceholders();

  const mainElement = document.createElement('div');
  mainElement.classList.add('carousel-wrapper');
  mainElement.setAttribute('id', `carousel-v1-${carouselId}`);

  // Append teaser containers to the main wrapper
  rows.forEach(teaser => {
    mainElement.appendChild(teaser);
  });

  
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', placeholders.carousel || 'Carousel-v1');

  block.appendChild(mainElement);

  const container = document.createElement('div');
  container.classList.add('carousel-v1-slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('carousel-v1-slides');
  mainElement.prepend(slidesWrapper);

  let slideIndicators;
  const isSingleSlide = rows.length < 2;

  const slideIndicatorsNav = document.createElement('nav');
  slideIndicatorsNav.setAttribute('aria-label', placeholders.carouselSlideControls || 'Carousel Slide Controls');
  slideIndicators = document.createElement('ol');
  slideIndicators.classList.add('carousel-v1-slide-indicators');
  slideIndicatorsNav.append(slideIndicators);
  block.append(slideIndicatorsNav);

  const slideNavButtons = document.createElement('div');
  slideNavButtons.classList.add('carousel-v1-navigation-buttons');
  slideNavButtons.innerHTML = `
    <button type="button" class= "slide-prev" aria-label="${placeholders.previousSlide || 'Previous Slide'}"></button>
    <button type="button" class="slide-next" aria-label="${placeholders.nextSlide || 'Next Slide'}"></button>
  `;

  container.append(slideNavButtons);


  rows.forEach((row, idx) => {
    const slide = createSlide(row, idx, carouselId);
    slidesWrapper.append(slide);

    if (slideIndicators) {
      const indicator = document.createElement('li');
      indicator.classList.add('carousel-v1-slide-indicator');
      indicator.dataset.targetSlide = idx;
      indicator.innerHTML = `<button type="button"><span>${placeholders.showSlide || 'Show Slide'} ${idx + 1} ${placeholders.of || 'of'} ${rows.length}</span></button>`;
      slideIndicators.append(indicator);
    }
    row.remove();
  });

  container.append(slidesWrapper);
  block.prepend(container);

  if (!isSingleSlide) {
    bindEvents(block);
  }

}

let carouselId = 0;

function initializeCarousel(block) {
  carouselId += 1;
  const carouselContainer = block.closest('.carousel-v1-container');
  const targetId = carouselContainer.getAttribute('data-teaser-target-id');
  const isPagination = carouselContainer.getAttribute('data-pagination');
  const summary = carouselContainer.getAttribute('data-summary');
  const slideChangeTime = carouselContainer.getAttribute('data-timing');

  const teaserContainers = document.querySelectorAll(`.teaser-container[data-teaser-target-id="${targetId}"]`);
  const mainElement = document.createElement('div');
  mainElement.classList.add('carousel-wrapper');
  mainElement.setAttribute('id', `carousel-v1-${carouselId}`);

  const isSingleSlide = teaserContainers.length < 2;

  // Append teaser containers to the main wrapper
  teaserContainers.forEach(teaser => {
    mainElement.appendChild(teaser);
  });

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'Carousel-v1');

  block.appendChild(mainElement);

  const container = document.createElement('div');
  container.classList.add('carousel-v1-slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('carousel-v1-slides');

  mainElement.prepend(slidesWrapper);

  let slideIndicators;

  if (!isSingleSlide) {

    const slideIndicatorsNav = document.createElement('nav');
    slideIndicatorsNav.setAttribute('aria-label', 'Carousel Slide Controls');
    slideIndicators = document.createElement('ol');
    slideIndicators.classList.add('carousel-v1-slide-indicators');
    slideIndicatorsNav.append(slideIndicators);
    block.append(slideIndicatorsNav);

    const slideNavButtons = document.createElement('div');
    slideNavButtons.classList.add('carousel-v1--navigation-buttons');
    slideNavButtons.innerHTML = `
      <button type="button" class="slide-prev" aria-label='Previous Slide'></button>
      <button type="button" class="slide-next" aria-label='Next Slide'></button>
    `;

    container.append(slideNavButtons);
  }

  console.log("teasercontainer", teaserContainers);

  teaserContainers.forEach((row, idx) => {
    const slide = createSlide(row, idx, carouselId);
    slidesWrapper.append(slide);

    if (slideIndicators) {
      const indicator = document.createElement('li');
      indicator.classList.add('carousel-v1-slide-indicator');
      indicator.dataset.targetSlide = idx;
      indicator.innerHTML = `<button type="button"><span>Show Slide ${idx + 1} of ${teaserContainers.length}</span></button>`;
      slideIndicators.append(indicator);
    }
    row.remove();
  });

//   container.append(slidesWrapper);
//   block.prepend(container);

//   if (!isSingleSlide) {
//     bindEvents(block);
//   }
}

function createSlide(row, slideIndex, carouselId) {
  console.log("row", row);
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.setAttribute('id', `carousel-${carouselId}-slide-${slideIndex}`);
  slide.classList.add('carousel-v1-slide');

  row.querySelectorAll(':scope > div').forEach((column, colIdx) => {
    //console.log("column", column);
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
  const slideIndicators = block.querySelector('.carousel-v1-slide-indicators');
  if (!slideIndicators) return;

  slideIndicators.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (e) => {
      const slideIndicator = e.currentTarget.parentElement;
      showSlide(block, parseInt(slideIndicator.dataset.targetSlide, 10));
    });
  });

  block.querySelector('.slide-prev').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) - 1);
  });

  block.querySelector('.slide-next').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) + 1);
  });

  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) updateActiveSlide(entry.target);
    });
  }, { threshold: 0.5 });

  block.querySelectorAll('.carousel-v1-slide').forEach((slide) => {
    slideObserver.observe(slide);
  });
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
}
