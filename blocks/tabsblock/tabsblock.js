export default async function tabsblock(block) {
  const mainElement = document.querySelector('main');
  const tabsheading = mainElement.querySelector('.tabsheading');
  // Ensure tabs are created only once
  let tabsCreated = false;

  // Function to create tabs based on the section data
  function createTabs() {
    // Get all sections with class 'section' that have a data-tab-title attribute
    const sections = document.querySelectorAll('.section[data-tab-title][data-section-status="loaded"]');

    if (sections.length === 0) {
      console.warn('No sections with data-tab-title and data-section-status="loaded" found.');
      return;
    }

    // Create a tab container
    const tabContainer = document.createElement('div');
    tabContainer.classList.add('custom-tabs-container');
    tabContainer.classList.add('section')

    // Create a tabs wrapper
    const tabsWrapper = document.createElement('div');
    tabsWrapper.classList.add('custom-tabs-wrapper');

    // Create a content container
    const contentContainer = document.createElement('div');
    contentContainer.classList.add('custom-tabs-content');

    // Track active tab index
    let activeTabIndex = 0;

    // Iterate over each section to create corresponding tab and content
    sections.forEach((section, index) => {
      // Remove display: none style from section if present
      section.style.display = '';

      // Create tab element
      const tabTitle = section.dataset.tabTitle;
      const tab = document.createElement('button');
      tab.classList.add('custom-tab');
      tab.textContent = tabTitle;
      tab.dataset.index = index;

      // active class added for default tab
      if (index === activeTabIndex) {
        tab.classList.add('active');
      }

      // Create content element
      const content = document.createElement('div');
      content.classList.add('custom-tab-content');

      // Append section content to tab content
      content.appendChild(section); // Clone section to preserve original structure

      // Hide all contents except the first one
      if (index !== activeTabIndex) {
        content.style.display = 'none';
      }

      // Append tab and content to respective containers
      tabsWrapper.appendChild(tab);
      contentContainer.appendChild(content);
    });

    // Append tabs wrapper and content container to tab container
    tabContainer.appendChild(tabsWrapper);
    tabContainer.appendChild(contentContainer);

    // Get main element
    const main = document.querySelector('main');

    // Remove sections with data-tab-title from main
    const sectionsToRemove = main.querySelectorAll('.section[data-tab-title]');
    sectionsToRemove.forEach(section => {
      section.parentNode.removeChild(section);
    });

    // Append tab container to main element
    if (tabsheading) {
      tabsheading.insertAdjacentElement('afterend', tabContainer);
    } else {
      main.appendChild(tabContainer);
    }

    // Add click event listener to tabs
    tabsWrapper.addEventListener('click', (event) => {
      if (event.target.classList.contains('custom-tab')) {
        const tabIndex = event.target.dataset.index;

        // Hide all contents and remove active class from tabs
        tabsWrapper.querySelectorAll('.custom-tab').forEach(tab => {
          tab.classList.remove('active');
        });
        contentContainer.querySelectorAll('.custom-tab-content').forEach(content => {
          content.style.display = 'none';
        });

        // Show the selected tab content and mark the tab as active
        event.target.classList.add('active');
        contentContainer.querySelectorAll('.custom-tab-content')[tabIndex].style.display = 'block';
      }
    });
  }

  // Function to check the section status
  function checkSectionStatus() {
    const sections = document.querySelectorAll('.section[data-tab-title]');
    return Array.from(sections).every(section => section.getAttribute('data-section-status') === 'loaded');
  }

  // Function to wait for all sections to be loaded
  function waitForSections() {
    if (checkSectionStatus()) {
      if (!tabsCreated) {
        // Set tabsCreated to true to prevent multiple creations
        tabsCreated = true;
        createTabs();
      }
    } else {
      // Use MutationObserver to wait for changes in the data-section-status attribute
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'data-section-status') {
            if (checkSectionStatus()) {
              observer.disconnect(); // Stop observing once all sections are loaded
              if (!tabsCreated) {
                tabsCreated = true;
                createTabs();
              }
            }
          }
        });
      });

      // Observe each section for attribute changes
      document.querySelectorAll('.section[data-tab-title]').forEach(section => {
        observer.observe(section, { attributes: true });
      });
    }
  }
  waitForSections();
  // Wait for DOMContentLoaded event
  //  document.addEventListener("DOMContentLoaded", waitForSections);
}












