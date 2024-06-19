// Exported default async function to decorate the block
export default async function decorate() {
  initializetabs();
}

// Function to initialize tabs dynamically
function initializetabs() {
  const mainElement = document.querySelector('main');
  const heroCarouselSecondary = document.querySelector('.hero-carousel-secondary');

  if (mainElement && heroCarouselSecondary) {
    const calSections = mainElement.querySelectorAll('.cal');

    if (calSections.length >= 2) {
      console.log(calSections.length);
      const tabsContainer = document.createElement('div');
      tabsContainer.classList.add('tabs-container');

      // Create a new container for tab buttons
      const buttonContainer = document.createElement('div');
      buttonContainer.classList.add('button-container');

      let initialTabIndex = 0; // Default to the first tab

      // Create tabs and corresponding buttons dynamically
      calSections.forEach((section, index) => {
        // Get the data-tab-title attribute value
        const tabTitle = section.getAttribute('data-tab-title') || `Tab ${index + 1}`;

        // Create Tab button
        const tabButton = document.createElement('button');
        tabButton.textContent = tabTitle;
        tabButton.addEventListener('click', () => {
          activateTab(section, index);
        });
        buttonContainer.appendChild(tabButton);

        // Check if this section is marked as active
        if (section.getAttribute('data-active') === 'true') {
          initialTabIndex = index;
          tabButton.classList.add('active');
        }

        // Hide the section initially (except for the active one)
        if (index !== initialTabIndex) {
          section.style.display = 'none';
        }
      });
      tabsContainer.appendChild(buttonContainer);

      function activateTab(selectedSection, index) {
        // Hide all sections except the selected one
        calSections.forEach((section, i) => {
          if (i === index) {
            section.style.display = 'block';
          } else {
            section.style.display = 'none'; // Hide inactive tab content
          }
        });

        // Update the active state of tab buttons
        const tabButtons = buttonContainer.querySelectorAll('button');
        tabButtons.forEach((button, i) => {
          if (i === index) {
            button.classList.add('active');
          } else {
            button.classList.remove('active');
          }
        });
      }

      // Append tabsContainer after heroCarouselSecondary
      heroCarouselSecondary.insertAdjacentElement('afterend', tabsContainer);

      // Append each .cal section to the tabs container (move instead of append)
      calSections.forEach(section => {
        tabsContainer.appendChild(section);
      });

      // Show the initial active tab and its content
      activateTab(calSections[initialTabIndex], initialTabIndex);
    }
  }
}