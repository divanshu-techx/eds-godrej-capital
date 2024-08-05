export default async function decorate() {
  initializetabs();
}
// Function to initialize tabs dynamically
function initializetabs() {
  const mainElement = document.querySelector('main');
  const heroCarouselSecondary = document.querySelector('.calculator-v1-container');

  const sec = mainElement.querySelector('.loaneligibility-container');
  if (mainElement && heroCarouselSecondary) {
    const calSections = mainElement.querySelectorAll('.cal');
    if (calSections.length >= 2) {
      const tabsContainer = document.createElement('div');
      tabsContainer.classList.add('tabs-container');

      // create a div for button wrapper
      const buttonWrapper = document.createElement('div');
      buttonWrapper.classList.add('button-container');

      // Create a new container for tab buttons
      const buttonContainer = document.createElement('div');
      buttonContainer.classList.add('buttonWrapper');

      // Create a select element for mobile dropdown
      const dropDownContainer = document.createElement('div');
      dropDownContainer.classList.add('dropDownContainer');

      const calculatorDropdown = document.createElement('div');
      calculatorDropdown.classList.add('calculator-dropdown');

      const calculatorLabel = document.createElement('label');
      calculatorLabel.classList.add('calculator-label');
      calculatorLabel.textContent = 'Select Calculator';

      const dropdown = document.createElement('select');
      dropdown.classList.add('tab-dropdown');

      // create a select element for secound mobile dropdown

      const productDropdown = document.createElement('div');
      productDropdown.classList.add('product-dropdown');

      const productLabel = document.createElement('label');
      productLabel.classList.add('product-label');
      productLabel.textContent = 'Select Product';

      const secDropdownContainer = document.createElement('select');
      secDropdownContainer.classList.add('sec-tab-dropdown');

      // Add the default option for 'Select Product'
      const defaultOption = document.createElement('option');
      defaultOption.textContent = 'Select Product';
      defaultOption.value = '';
      defaultOption.selected = true;
      defaultOption.disabled=true;
      secDropdownContainer.appendChild(defaultOption);
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
        buttonWrapper.appendChild(buttonContainer);

        // Create dropdown option
        const option = document.createElement('option');
        option.textContent = tabTitle;
        option.value = index;
        dropdown.appendChild(option);
        calculatorDropdown.append(calculatorLabel, dropdown);
        dropDownContainer.appendChild(calculatorDropdown);

        // Check if the section has a data-product-list attribute
        const productListData = section.getAttribute('data-product-list');
        if (productListData) {
          // Show the second dropdown
          secDropdownContainer.style.display = 'block';

          // Get data attribute value and split it into an array
          const productList = productListData.split(',');
          // Append product list options to secondary dropdown
          productList.forEach((product, index) => {
            const productOption = document.createElement('option');
            productOption.textContent = product.trim();
            productOption.value = index;
            secDropdownContainer.appendChild(productOption);
          });
        } else {
          // Hide the second dropdown
          secDropdownContainer.style.display = 'none';
        }

        // Check if this section is marked as active
        if (section.getAttribute('data-active') === 'true') {
          initialTabIndex = index;
          tabButton.classList.add('active');
          dropdown.value = index;
        }

        // Hide the section initially (except for the active one)
        if (index !== initialTabIndex) {
          section.style.display = 'none';
        }
      });

      tabsContainer.appendChild(buttonWrapper);
      tabsContainer.appendChild(dropDownContainer);
      productDropdown.append(productLabel, secDropdownContainer);
      dropDownContainer.appendChild(productDropdown);

      dropdown.addEventListener('change', (event) => {
        activateTab(calSections[event.target.value], parseInt(event.target.value));
      });

      function activateTab(selectedSection, index) {
        // Hide all sections except the selected one
        calSections.forEach((section, i) => {
          section.style.display = i === index ? 'block' : 'none';
        });

        // Update the active state of tab buttons
        const tabButtons = buttonContainer.querySelectorAll('button');
        tabButtons.forEach((button, i) => {
          button.classList.toggle('active', i === index);
        });

        // Update the dropdown value
        dropdown.value = index;

        // Retrieve the tab title for the selected section
        const selectedTabTitle = selectedSection.getAttribute('data-product-list');
        if (selectedTabTitle) {
          secDropdownContainer.disabled = false;
        } else {
          secDropdownContainer.disabled = true;
        }
      }

      // Append tabsContainer after heroCarouselSecondary
      heroCarouselSecondary.insertAdjacentElement('afterend', tabsContainer);

      // Append each .cal section to the tabs container (move instead of append)
      calSections.forEach((section) => {
        tabsContainer.appendChild(section);
      });

      // Show the initial active tab and its content
      activateTab(calSections[initialTabIndex], initialTabIndex);
    }
  }
}
