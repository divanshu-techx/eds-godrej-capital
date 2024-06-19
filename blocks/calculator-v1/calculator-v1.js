// export default async function decorate() {
//     initializetabs();
// }
 
// // Function to initialize tabs dynamically
// function initializetabs() {
//     const mainElement = document.querySelector('main');
 
//     if (mainElement) {
//         const calSections = Array.from(mainElement.querySelectorAll('.cal'));
//         const uniqueSections = new Map();
 
//         calSections.forEach((section, index) => {
//             const tabTitle = section.getAttribute('data-tab-title') || `Tab ${index + 1}`;
//             if (!uniqueSections.has(tabTitle)) {
//                 uniqueSections.set(tabTitle, section);
//             } else {
//                 section.remove(); // Remove duplicate section from DOM
//             }
//         });
 
//         const uniqueSectionsArray = Array.from(uniqueSections.values());
 
//         if (uniqueSectionsArray.length >= 2) {
//             const tabsContainer = document.createElement('div');
//             tabsContainer.classList.add('tabs-container-calculator');
 
//             const buttonContainer = document.createElement('div');
//             buttonContainer.classList.add('button-container');
 
//             const tabContentContainer = document.createElement('div');
//             tabContentContainer.classList.add('tab-content-container-calculator');
 
//             let initialTabIndex = 0;
 
//             // Create tabs and corresponding buttons dynamically
//             uniqueSectionsArray.forEach((section, index) => {
//                 const tabTitle = section.getAttribute('data-tab-title') || `Tab ${index + 1}`;
 
//                 const tabButton = document.createElement('button');
//                 tabButton.textContent = tabTitle;
//                 tabButton.addEventListener('click', () => {
//                     activateTab(index);
//                 });
//                 buttonContainer.appendChild(tabButton);
 
//                 if (section.getAttribute('data-active') === 'true') {
//                     initialTabIndex = index;
//                     tabButton.classList.add('active');
//                 }
 
//                 // Move .cal content into corresponding tab content section
//                 const tabContent = document.createElement('div');
//                 tabContent.classList.add('tab-content');
//                 tabContent.appendChild(section); // Move the original content
//                 tabContentContainer.appendChild(tabContent);
//             });
 
//             tabsContainer.appendChild(buttonContainer);
//             tabsContainer.appendChild(tabContentContainer);
 
//             function activateTab(index) {
//                 const tabContents = tabContentContainer.querySelectorAll('.tab-content');
//                 const tabButtons = buttonContainer.querySelectorAll('button');
 
//                 tabContents.forEach((tabContent, i) => {
//                     tabContent.style.display = i === index ? 'block' : 'none';
//                 });
 
//                 tabButtons.forEach((button, i) => {
//                     button.classList.toggle('active', i === index);
//                 });
//             }
 
//             // Append the tabs container at the appropriate location in the main element
//             mainElement.appendChild(tabsContainer);
 
//             // Show the initial active tab and its content
//             activateTab(initialTabIndex);
//         }
//     }
// }

export default async function decorate(block) {
    initializeCarousel(block);
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
         slideIndicatorsNav.setAttribute('aria-label','Carousel Slide Controls');
         slideIndicators = document.createElement('ol');
         slideIndicators.classList.add('carousel-v1-slide-indicators');
         slideIndicatorsNav.append(slideIndicators);
         block.append(slideIndicatorsNav);
  
         const slideNavButtons = document.createElement('div');
  
         slideNavButtons.classList.add('carousel-v1--navigation-buttons');
         slideNavButtons.innerHTML = `
           <button type="button" class= "slide-prev" aria-label='Previous Slide'></button>
           <button type="button" class="slide-next" aria-label='Next Slide'></button>
         `;
  
         container.append(slideNavButtons);
      }
  
      teaserContainers.forEach((row,idx) => {
          const slide = createSlide(row,idx, carouselId);
          slidesWrapper.append(slide);
  
           if (slideIndicators) {
                const indicator = document.createElement('li');
                indicator.classList.add('carousel-slide-indicator');
                indicator.dataset.targetSlide = idx;
                indicator.innerHTML = `<button type="button"><span>'Show Slide' ${idx + 1}  'of' ${teaserContainers.length}</span></button>`;
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
    block.querySelectorAll('.carousel-slide').forEach((slide) => {
      slideObserver.observe(slide);
    });
  }
  
  function showSlide(block, slideIndex = 0) {
    const slides = block.querySelectorAll('.carousel-v1-slide');
    let realSlideIndex = slideIndex < 0 ? slides.length - 1 : slideIndex;
    if (slideIndex >= slides.length) realSlideIndex = 0;
    const activeSlide = slides[realSlideIndex];
  
    activeSlide.querySelectorAll('a').forEach((link) => link.removeAttribute('tabindex'));
    block.querySelector('.carousel-v1-slides').scrollTo({
      top: 0,
      left: activeSlide.offsetLeft,
      behavior: 'smooth',
    });
  }