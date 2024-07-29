export default async function tabsblock() {
  const mainElement = document.querySelector('main');
  const tabsheading = mainElement.querySelector('.tabsheading');
  let tabsCreated = false;
  // ------------------------------------------------------------------------------
  function setupCarouselNavigation() {
    const carousels = document.querySelectorAll('.cards-container-wrapper');
    carousels.forEach((carousel) => {
      const navContainer = document.createElement('div');
      navContainer.classList.add('carousel-nav-container');
      const prevBtn = document.createElement('button');
      prevBtn.classList.add('carousel-nav-btn', 'carousel-prev-btn');
      const prevIcon = document.createElement('img');
      prevIcon.src = '/icons/nexticon.svg';
      prevIcon.alt = 'Previous';
      prevBtn.appendChild(prevIcon);
      const nextBtn = document.createElement('button');
      nextBtn.classList.add('carousel-nav-btn', 'carousel-next-btn');
      const nextIcon = document.createElement('img');
      nextIcon.src = '/icons/nexticon.svg';
      nextIcon.alt = 'Next';
      nextBtn.appendChild(nextIcon);
      const countDisplay = document.createElement('div');
      countDisplay.classList.add('carousel-count-display');
      navContainer.appendChild(prevBtn);
      navContainer.appendChild(countDisplay);
      navContainer.appendChild(nextBtn);
      carousel.parentElement.insertBefore(navContainer, carousel);
      let currentIndex = 0;
      const items = Array.from(carousel.children);
      const totalItems = items.length;
      function updateCarousel() {
        items.forEach((item, index) => {
          item.classList.toggle('active', index === currentIndex);
        });
        // Calculate the offset based on the width of the carousel
        const itemWidth = items[0].offsetWidth;
        const offset = -currentIndex * itemWidth;
        carousel.style.transform = `translateX(${offset}px)`;
        // Update count display
        countDisplay.innerHTML = ''; // Clear previous numbers
        for (let i = 0; i < totalItems; i + 1) {
          const number = document.createElement('span');
          number.textContent = i + 1;
          number.classList.add('carousel-number');
          if (i === currentIndex) {
            number.classList.add('active-number');
          }
          number.addEventListener('click', () => {
            currentIndex = i;
            updateCarousel();
          });
          countDisplay.appendChild(number);
        }
        // Update buttons' disabled state
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === totalItems - 1;
      }
      prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
          currentIndex -= 1;
          updateCarousel();
        }
      });
      nextBtn.addEventListener('click', () => {
        if (currentIndex < totalItems - 1) {
          currentIndex += 1;
          updateCarousel();
        }
      });
      window.addEventListener('resize', () => {
        if (window.innerWidth > 600) {
          carousel.style.transform = 'translateX(0)';
          currentIndex = 0;
          updateCarousel();
        }
      });
      // Initialize display
      updateCarousel();
    });
  }
  function createTabs() {
    const sections = document.querySelectorAll('.section[data-tab-title][data-section-status="loaded"]');
    if (sections.length === 0) {
      console.warn('No sections with data-tab-title and data-section-status="loaded" found.');
      return;
    }
    const tabContainer = document.createElement('div');
    tabContainer.classList.add('custom-tabs-container', 'section');
    const tabsWrapper = document.createElement('div');
    tabsWrapper.classList.add('custom-tabs-wrapper');
    const contentContainer = document.createElement('div');
    contentContainer.classList.add('custom-tabs-content');
    const activeTabIndex = 0;
    sections.forEach((section, index) => {
      section.style.display = '';
      //const tabTitle = section.dataset.tabTitle;
      
      // Object destructuring to extract tabTitle from dataset
      const { tabTitle } = section.dataset;
      const tab = document.createElement('button');
      tab.classList.add('custom-tab');
      tab.textContent = tabTitle;
      tab.dataset.index = index;
      if (index === activeTabIndex) {
        tab.classList.add('active');
      }
      const content = document.createElement('div');
      content.classList.add('custom-tab-content');
      const cardsContainer = document.createElement('div');
      cardsContainer.classList.add('cards-container-wrapper');
      const leftContentDivs = section.querySelectorAll('.leftcontentusploan-wrapper');
      leftContentDivs.forEach((div) => {
        cardsContainer.appendChild(div);
      });
      section.appendChild(cardsContainer);
      content.appendChild(section);
      if (index !== activeTabIndex) {
        content.style.display = 'none';
      }
      tabsWrapper.appendChild(tab);
      contentContainer.appendChild(content);
    });
    tabContainer.appendChild(tabsWrapper);
    tabContainer.appendChild(contentContainer);
    const main = document.querySelector('main');
    const sectionsToRemove = main.querySelectorAll('.section[data-tab-title]');
    sectionsToRemove.forEach((section) => {
      section.parentNode.removeChild(section);
    });
    if (tabsheading) {
      tabsheading.insertAdjacentElement('afterend', tabContainer);
    } else {
      main.appendChild(tabContainer);
    }
    tabsWrapper.addEventListener('click', (event) => {
      if (event.target.classList.contains('custom-tab')) {
        const tabIndex = event.target.dataset.index;
        tabsWrapper.querySelectorAll('.custom-tab').forEach((tab) => {
          tab.classList.remove('active');
        });
        contentContainer.querySelectorAll('.custom-tab-content').forEach((content) => {
          content.style.display = 'none';
        });
        event.target.classList.add('active');
        contentContainer.querySelectorAll('.custom-tab-content')[tabIndex].style.display = 'block';
      }
    });
    setupCarouselNavigation();
  }
  // Call the function to setup the carousel navigation
  setupCarouselNavigation();
  // --------------------------------------------------------
  function checkSectionStatus() {
    const sections = document.querySelectorAll('.section[data-tab-title]');
    return Array.from(sections).every((section) => section.getAttribute('data-section-status') === 'loaded');
  }
  function waitForSections() {
    if (checkSectionStatus()) {
      if (!tabsCreated) {
        tabsCreated = true;
        createTabs();
      }
    } else {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'data-section-status') {
            if (checkSectionStatus()) {
              observer.disconnect();
              if (!tabsCreated) {
                tabsCreated = true;
                createTabs();
              }
            }
          }
        });
      });
      document.querySelectorAll('.section[data-tab-title]').forEach((section) => {
        observer.observe(section, { attributes: true });
      });
    }
  }
  waitForSections();
}
