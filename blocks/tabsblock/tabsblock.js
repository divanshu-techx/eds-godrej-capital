
//new code


// export default async function decorate(block) {
//     // Ensure tabs are created only once
//     let tabsCreated = false;

//     // Function to create tabs based on the section data
//     function createTabs() {
//         // Get all sections with class 'section' that have a data-tab-title attribute
//         const sections = document.querySelectorAll('.section[data-tab-title]');

//         if (sections.length === 0) {
//             console.warn('No sections with data-tab-title found.');
//             return;
//         }

//         // Create a tab container
//         const tabContainer = document.createElement('div');
//         tabContainer.classList.add('tabs-container');

//         // Create a tabs wrapper
//         const tabsWrapper = document.createElement('div');
//         tabsWrapper.classList.add('tabs-wrapper');

//         // Create a content container
//         const contentContainer = document.createElement('div');
//         contentContainer.classList.add('tabs-content');

//         // Track active tab index
//         let activeTabIndex = 0;

//         // Iterate over each section to create corresponding tab and content
//         sections.forEach((section, index) => {
//             // Remove display: none style from section if present
//             section.style.display = '';

//             // Create tab element
//             const tabTitle = section.dataset.tabTitle;
//             const tab = document.createElement('button');
//             tab.classList.add('tab');
//             tab.textContent = tabTitle;
//             tab.dataset.index = index;

//             // Create content element
//             const content = document.createElement('div');
//             content.classList.add('tab-content');

//             // Append section content to tab content
//             content.appendChild(section.cloneNode(true)); // Clone section to preserve original structure

//             // Hide all contents except the first one
//             if (index !== activeTabIndex) {
//                 content.style.display = 'none';
//             }

//             // Append tab and content to respective containers
//             tabsWrapper.appendChild(tab);
//             contentContainer.appendChild(content);
//         });

//         // Append tabs wrapper and content container to tab container
//         tabContainer.appendChild(tabsWrapper);
//         tabContainer.appendChild(contentContainer);

//         // Get main element
//         const main = document.querySelector('main');

//         // Remove sections with data-tab-title from main
//         const sectionsToRemove = main.querySelectorAll('.section[data-tab-title]');
//         sectionsToRemove.forEach(section => {
//             section.parentNode.removeChild(section);
//         });

//         // Append tab container to main element
//         main.appendChild(tabContainer);

//         // Add click event listener to tabs
//         tabsWrapper.addEventListener('click', (event) => {
//             if (event.target.classList.contains('tab')) {
//                 const tabIndex = event.target.dataset.index;

//                 // Hide all contents and remove active class from tabs
//                 tabsWrapper.querySelectorAll('.tab').forEach(tab => {
//                     tab.classList.remove('active');
//                 });
//                 contentContainer.querySelectorAll('.tab-content').forEach(content => {
//                     content.style.display = 'none';
//                 });

//                 // Show the selected tab content and mark the tab as active
//                 event.target.classList.add('active');
//                 contentContainer.querySelectorAll('.tab-content')[tabIndex].style.display = 'block';
//             }
//         });

//         // Add fixed position CSS
//         const style = document.createElement('style');
//         style.textContent = `
//             .tabs-container {
//                 display: flex;
//                 flex-direction: column;
//             }
//             .tabs-wrapper {
//                 display: flex;
//                 border-bottom: 1px solid #ccc;
//             }
//             .tab {
//                 flex: 1;
//                 padding: 10px;
//                 cursor: pointer;
//                 border: none;
//                 background: none;
//                 text-align: center;
//                 transition: background-color 0.3s ease;
//             }
//             .tab.active {
//                 background-color: #f0f0f0;
//                 font-weight: bold;
//             }
//             .tabs-content {
//                 flex-grow: 1;
//             }
//             .tab-content {
//                 display: none;
//             }
//             .tab-content:first-of-type {
//                 display: block;
//             }
//         `;
//         document.head.appendChild(style);
//     }

//     // Check if tabs are already created
//     if (!tabsCreated) {
//         // Set tabsCreated to true to prevent multiple creations
//         tabsCreated = true;

//         // Wait for DOMContentLoaded event
//         document.addEventListener("DOMContentLoaded", createTabs);
//     }
// }



// export default async function tabsblock() {
//     // Ensure tabs are created only once
//     let tabsCreated = false;

//     // Function to create tabs based on the section data
//     function createTabs() {
//         // Get all sections with class 'section' that have a data-tab-title attribute
//         const sections = document.querySelectorAll('.section[data-tab-title][data-section-status="loaded"]');

//         if (sections.length === 0) {
//             console.warn('No sections with data-tab-title and data-section-status="loaded" found.');
//             return;
//         }

//         // Create a tab container
//         const tabContainer = document.createElement('div');
//         tabContainer.classList.add('tabs-container');

//         // Create a tabs wrapper
//         const tabsWrapper = document.createElement('div');
//         tabsWrapper.classList.add('tabs-wrapper');

//         // Create a content container
//         const contentContainer = document.createElement('div');
//         contentContainer.classList.add('tabs-content');

//         // Track active tab index
//         let activeTabIndex = 0;

//         // Iterate over each section to create corresponding tab and content
//         sections.forEach((section, index) => {
//             // Remove display: none style from section if present
//             section.style.display = '';

//             // Create tab element
//             const tabTitle = section.dataset.tabTitle;
//             const tab = document.createElement('button');
//             tab.classList.add('tab');
//             tab.textContent = tabTitle;
//             tab.dataset.index = index;

//             // Create content element
//             const content = document.createElement('div');
//             content.classList.add('tab-content');

//             // Append section content to tab content
//             content.appendChild(section.cloneNode(true)); // Clone section to preserve original structure

//             // Hide all contents except the first one
//             if (index !== activeTabIndex) {
//                 content.style.display = 'none';
//             }

//             // Append tab and content to respective containers
//             tabsWrapper.appendChild(tab);
//             contentContainer.appendChild(content);
//         });

//         // Append tabs wrapper and content container to tab container
//         tabContainer.appendChild(tabsWrapper);
//         tabContainer.appendChild(contentContainer);

//         // Get main element
//         const main = document.querySelector('main');

//         // Remove sections with data-tab-title from main
//         const sectionsToRemove = main.querySelectorAll('.section[data-tab-title]');
//         sectionsToRemove.forEach(section => {
//             section.parentNode.removeChild(section);
//         });

//         // Append tab container to main element
//         main.appendChild(tabContainer);

//         // Add click event listener to tabs
//         tabsWrapper.addEventListener('click', (event) => {
//             if (event.target.classList.contains('tab')) {
//                 const tabIndex = event.target.dataset.index;

//                 // Hide all contents and remove active class from tabs
//                 tabsWrapper.querySelectorAll('.tab').forEach(tab => {
//                     tab.classList.remove('active');
//                 });
//                 contentContainer.querySelectorAll('.tab-content').forEach(content => {
//                     content.style.display = 'none';
//                 });

//                 // Show the selected tab content and mark the tab as active
//                 event.target.classList.add('active');
//                 contentContainer.querySelectorAll('.tab-content')[tabIndex].style.display = 'block';
//             }
//         });
//     }

//     // Function to check the section status
//     function checkSectionStatus() {
//         const sections = document.querySelectorAll('.section[data-tab-title]');
//         return Array.from(sections).every(section => section.getAttribute('data-section-status') === 'loaded');
//     }

//     // Function to wait for all sections to be loaded
//     function waitForSections() {
//         if (checkSectionStatus()) {
//             if (!tabsCreated) {
//                 // Set tabsCreated to true to prevent multiple creations
//                 tabsCreated = true;
//                 createTabs();
//             }
//         } else {
//             // Use MutationObserver to wait for changes in the data-section-status attribute
//             const observer = new MutationObserver(mutations => {
//                 mutations.forEach(mutation => {
//                     if (mutation.type === 'attributes' && mutation.attributeName === 'data-section-status') {
//                         if (checkSectionStatus()) {
//                             observer.disconnect(); // Stop observing once all sections are loaded
//                             if (!tabsCreated) {
//                                 tabsCreated = true;
//                                 createTabs();
//                             }
//                         }
//                     }
//                 });
//             });

//             // Observe each section for attribute changes
//             document.querySelectorAll('.section[data-tab-title]').forEach(section => {
//                 observer.observe(section, { attributes: true });
//             });
//         }
//     }

//     // Wait for DOMContentLoaded event
//     document.addEventListener("DOMContentLoaded", waitForSections);
// }







// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';

export default async function decorate(block) {
    // Ensure tabs are created only once
    if (block.dataset.tabsCreated) {
        return;
    }
    block.dataset.tabsCreated = true;

    // Function to create tabs based on the section data
    function createTabs() {
        // Get all sections with class 'section' that have a data-tab-title attribute and data-section-status="loaded"
        const sections = block.querySelectorAll('.section[data-tab-title][data-section-status="loaded"]');

        if (sections.length === 0) {
            console.warn('No sections with data-tab-title and data-section-status="loaded" found.');
            return;
        }

        // Get existing elements
        const tabsWrapper = block.querySelector('.tabs-wrapper');
        const contentContainer = block.querySelector('.tabs-content');

        // Ensure the tabsWrapper and contentContainer exist
        if (!tabsWrapper || !contentContainer) {
            console.error('Tabs wrapper or content container not found.');
            return;
        }

        // Track active tab index
        let activeTabIndex = 0;

        // Iterate over each section to create corresponding tab and content
        sections.forEach((section, index) => {
            // Create tab element
            const tabTitle = section.dataset.tabTitle;
            const tab = document.createElement('button');
            tab.classList.add('tab');
            tab.textContent = tabTitle;
            tab.dataset.index = index;

            // Remove display: none style from section if present
            section.style.display = '';

            // Hide all contents except the first one
            if (index !== activeTabIndex) {
                section.style.display = 'none';
            } else {
                tab.classList.add('active');
            }

            // Append tab and section to respective containers
            tabsWrapper.appendChild(tab);
            contentContainer.appendChild(section);
        });

        // Add click event listener to tabs
        tabsWrapper.addEventListener('click', (event) => {
            if (event.target.classList.contains('tab')) {
                const tabIndex = event.target.dataset.index;

                // Hide all contents and remove active class from tabs
                tabsWrapper.querySelectorAll('.tab').forEach(tab => {
                    tab.classList.remove('active');
                });
                contentContainer.querySelectorAll('.section').forEach(section => {
                    section.style.display = 'none';
                });

                // Show the selected tab content and mark the tab as active
                event.target.classList.add('active');
                contentContainer.querySelectorAll('.section')[tabIndex].style.display = 'block';
            }
        });

        // Add fixed position CSS
        const style = document.createElement('style');
        style.textContent = `
            .tabs-wrapper {
                display: flex;
                border-bottom: 1px solid #ccc;
            }
            .tab {
                flex: 1;
                padding: 10px;
                cursor: pointer;
                border: none;
                background: none;
                text-align: center;
                transition: background-color 0.3s ease;
            }
            .tab.active {
                background-color: #f0f0f0;
                font-weight: bold;
            }
            .tabs-content {
                flex-grow: 1;
            }
            .section {
                display: none;
            }
            .section:first-of-type {
                display: block;
            }
        `;
        document.head.appendChild(style);
    }

    // Check if sections are already loaded
    if (document.readyState === 'complete') {
        createTabs();
    } else {
        document.addEventListener("DOMContentLoaded", createTabs);
    }
}

// eslint-disable-next-line import/no-unresolved
// eslint-disable-next-line import/no-unresolved












