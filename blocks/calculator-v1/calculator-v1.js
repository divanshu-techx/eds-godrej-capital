// Exported default async function to decorate the block
export default async function decorate() {
    initializetabs();
}

// Function to initialize tabs dynamically
function initializetabs() {
    const mainElement = document.querySelector('main');

    if (mainElement) {
        const calSections = mainElement.querySelectorAll('.cal');

        if (calSections.length >= 2) {
            const tabsContainer = document.createElement('div');
            tabsContainer.classList.add('tabs-container-calculator');

            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('button-container');

            const tabContentContainer = document.createElement('div');
            tabContentContainer.classList.add('tab-content-container-calculator');

            let initialTabIndex = 0;

            // Create tabs and corresponding buttons dynamically
            calSections.forEach((section, index) => {
                const tabTitle = section.getAttribute('data-tab-title') || `Tab ${index + 1}`;

                const tabButton = document.createElement('button');
                tabButton.textContent = tabTitle;
                tabButton.addEventListener('click', () => {
                    activateTab(index);
                });
                buttonContainer.appendChild(tabButton);

                if (section.getAttribute('data-active') === 'true') {
                    initialTabIndex = index;
                    tabButton.classList.add('active');
                }

                // Move .cal content into corresponding tab content section
                const tabContent = document.createElement('div');
                tabContent.classList.add('contentTab');
                tabContent.appendChild(section.cloneNode(true)); // Clone the content
                tabContentContainer.appendChild(tabContent);
            });

            tabsContainer.appendChild(buttonContainer);
            tabsContainer.appendChild(tabContentContainer);

            function activateTab(index) {
                const tabContents = tabContentContainer.querySelectorAll('.content');
                const tabButtons = buttonContainer.querySelectorAll('button');

                tabContents.forEach((tabContent, i) => {
                    if (i === index) {
                        tabContent.style.display = 'block';
                    } else {
                        tabContent.style.display = 'none';
                    }
                });

                tabButtons.forEach((button, i) => {
                    if (i === index) {
                        button.classList.add('active');
                    } else {
                        button.classList.remove('active');
                    }
                });
            }

            // Clear main element and append the tabs container
            mainElement.innerHTML = '';
            mainElement.appendChild(tabsContainer);

            // Show the initial active tab and its content
            activateTab(initialTabIndex);
        }
    }
}
