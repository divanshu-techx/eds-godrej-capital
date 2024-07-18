function getDataAttributeValueByName(name) {
    const element = document.querySelector(`[data-${name}]`);
    return element ? element.getAttribute(`data-${name}`) : "";
}
async function fetchDataFromUrl(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error.message);
        return null;
    }
}

function createFilter(categories, block) {
    const searchInputPlaceholder = getDataAttributeValueByName('searchInputPlaceholder');
    const tabContainer = document.createElement('div');

    const sortByLabel =getDataAttributeValueByName('sortByLabel');
    const sortByLabelDropDownLabel =getDataAttributeValueByName('sortByLabelDropDownLabel');

    tabContainer.classList.add('media-gallery-filter');
    const tabsDiv = document.createElement('div');
    tabsDiv.classList.add('tabs-wrapper-media-gallery');

    categories.forEach((category, index) => {
        const tab = document.createElement('button');
        tab.classList.add('media-tab');
        tab.setAttribute('data-category', category);
        tab.textContent = category;
        tab.addEventListener('click', () => {
            showCategoryContent(category, block);
        });

        // Set the first tab as active by default
        if (index === 0) {
            tab.classList.add('active');
        }

        tabsDiv.appendChild(tab);
    });

    const searchDiv = document.createElement('div');
    searchDiv.classList.add('seach-input-media-gallery');
    // Create a search input
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = searchInputPlaceholder;
    searchInput.classList.add('media-search-input');
    searchInput.addEventListener('input', () => {
        filterCardsBySearch(searchInput.value, block);
    });
    searchDiv.appendChild(searchInput);

        // Create a dropdown for sorting
        const sortDiv = document.createElement('div');
        sortDiv.classList.add('sort-input-media-gallery');
    
        const sortDropdown = document.createElement('select');
        sortDropdown.id = 'sortDropdown';
        sortDropdown.classList.add('media-sort-dropdown');

        // Create the default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = sortByLabel;
        defaultOption.disabled = true;
        defaultOption.selected = true;
        sortDropdown.appendChild(defaultOption);

        const sortOptions = sortByLabelDropDownLabel.split(', ');
        sortOptions.forEach(option => {
            const sortOption = document.createElement('option');
            sortOption.value = option;
            sortOption.textContent = option;
            sortDropdown.appendChild(sortOption);
        });
        sortDiv.appendChild(sortDropdown); 

    // Add search input and tabs to the block
    tabContainer.append(tabsDiv, searchDiv,sortDiv);
    block.insertBefore(tabContainer, block.firstChild);
}

function showCategoryContent(category, block) {
    const allTabs = block.querySelectorAll('.media-tab');
    allTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-category') === category) {
            tab.classList.add('active');
        }
    });

    const allCards = block.querySelectorAll('.card-media-gallery');
    allCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (cardCategory === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}
function filterCardsBySearch(searchTerm, block) {
    const activeCategory = block.querySelector('.media-tab.active').getAttribute('data-category');
    const allCards = block.querySelectorAll('.card-media-gallery');
    const lowerCaseSearchTerm = searchTerm.trim().toLowerCase(); // Trim and convert to lowercase
    let resultsFound = false;

    // Check if searchTerm has at least 3 characters
    if (lowerCaseSearchTerm.length < 3) {
        // Reset all cards to be visible if searchTerm length is less than 3
        allCards.forEach(card => {
            card.style.display = (card.getAttribute('data-category') === activeCategory) ? 'block' : 'none';
        });

        // Remove noResultsMessage if it exists
        let noResultsMessage = block.querySelector('.no-results');
        if (noResultsMessage) {
            noResultsMessage.remove();
        }
        return; // Exit function early
    }

    allCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (cardCategory === activeCategory) {
            const cardContent = card.textContent.toLowerCase();
            if (cardContent.includes(lowerCaseSearchTerm)) {
                card.style.display = 'block';
                resultsFound = true;
            } else {
                card.style.display = 'none';
            }
        } else {
            card.style.display = 'none';
        }
    });

    // Create noResultsMessage if it doesn't exist
    let noResultsMessage = block.querySelector('.no-results');
    if (!noResultsMessage) {
        noResultsMessage = document.createElement('div');
        noResultsMessage.className = 'no-results';
        noResultsMessage.textContent = 'No results found';
        noResultsMessage.style.display = 'none';
        block.appendChild(noResultsMessage);
    }

    // Display or hide noResultsMessage based on resultsFound
    if (resultsFound) {
        noResultsMessage.style.display = 'none';
    } else {
        noResultsMessage.style.display = 'block';
    }
}
function getYoutubeIdFromUrl(url) {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

// Define openModal function to show only video
function openModal(videoLink) {
    // Create modal elements
    const modal = document.createElement('div');
    modal.classList.add('modal');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    // Modal header with close button
    const modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');

    const closeModalBtn = document.createElement('span');
    closeModalBtn.classList.add('close-modal');
    closeModalBtn.textContent = '×';
    closeModalBtn.addEventListener('click', () => {
        modal.remove(); // Close modal on close button click
    });

    modalHeader.appendChild(closeModalBtn);

    // Modal body
    const modalBody = document.createElement('div');
    modalBody.classList.add('modal-body');

    // Embed video
    const videoContainer = document.createElement('div');
    videoContainer.classList.add('video-container');

    if (videoLink.includes('youtube.com') || videoLink.includes('youtu.be')) {
        const youtubeId = getYoutubeIdFromUrl(videoLink);
        if (youtubeId) {
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${youtubeId}`;
            iframe.width = '560';
            iframe.height = '315';
            iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            videoContainer.appendChild(iframe);
        }
    } else {
        const video = document.createElement('video');
        video.src = videoLink;
        video.controls = true;
        video.width = 560;
        video.height = 315;
        videoContainer.appendChild(video);
    }

    modalBody.appendChild(videoContainer);

    // Append modal parts to modal content
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);

    // Append modal content to modal
    modal.appendChild(modalContent);

    // Append modal to document body
    document.body.appendChild(modal);
}


function generateCards(data, block) {
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('media-gallery-cards');

    data.data.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('card-media-gallery');
        card.setAttribute('data-category', item.category);

        if (item.cardimagelink) {
            // Create the div for the card image
            const cardImageDiv = document.createElement('div');
            cardImageDiv.classList.add('card-image-media-gallery');
            const cardImagePath = document.createElement('a');
            cardImagePath.classList.add('card-image-path');
            cardImagePath.href = item.path;

            const cardImage = document.createElement('img');
            cardImage.src = item.cardimagelink;
            cardImage.alt = item.cardtitle;
            cardImagePath.appendChild(cardImage);
            cardImageDiv.appendChild(cardImagePath);

            // Create the div for the card-link
            const cardLinkDiv = document.createElement('div');
            cardLinkDiv.classList.add('card-media-gallery-link');
            const cardTitle = document.createElement('a');
            cardTitle.textContent = item.cardtitle;
            cardTitle.href = item.path;
            cardLinkDiv.appendChild(cardTitle);

            card.append(cardImageDiv, cardLinkDiv);
        } else if (item.cardvideolink) {
            // Create the div for the card video
            const cardVideoDiv = document.createElement('div');
            cardVideoDiv.classList.add('card-video-media-gallery');

            const youtubeId = getYoutubeIdFromUrl(item.cardvideolink);
            if (youtubeId) {
                const iframe = document.createElement('iframe');
                iframe.src = `https://www.youtube.com/embed/${youtubeId}`;
                iframe.width = '560';
                iframe.height = '315';
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                iframe.allowFullscreen = true;
                cardVideoDiv.appendChild(iframe);
            } else {
                const video = document.createElement('video');
                video.src = item.cardvideolink;
                video.controls = true;
                video.width = 560;
                video.height = 315;
                cardVideoDiv.appendChild(video);
            }

            // Create the div for the card-link
            const cardLinkDiv = document.createElement('div');
            cardLinkDiv.classList.add('card-media-gallery-video-heading');
            const cardTitle = document.createElement('h3');
            cardTitle.textContent = item.cardtitle;
            const cardVideoDescription = document.createElement('div');
            cardVideoDescription.classList.add('card-video-description');
            cardVideoDescription.textContent = item.carddescription;

            // Add click event listener to open modal on cardVideoDescription click
            cardVideoDescription.addEventListener('click', () => {
                if (item.videotype === 'popup') {
                    openModal(item.cardvideolink);
                } else {
                    window.location.href = item.cardvideolink;
                }
            });

            cardLinkDiv.append(cardTitle, cardVideoDescription);
            card.append(cardVideoDiv, cardLinkDiv);
        }

        // Append card to container
        cardContainer.appendChild(card);
    });

    block.appendChild(cardContainer);

    // Show content for the first tab by default
    const firstCategory = data.data.length > 0 ? data.data[0].category : null;
    if (firstCategory) {
        showCategoryContent(firstCategory, block);
    }
}


export default async function decorate(block) {
    const apiUrl = getDataAttributeValueByName('apiUrl');
    const categories = getDataAttributeValueByName('categorytab').split(',').map(cat => cat.trim());

    if (!apiUrl) {
        console.error('API URL attribute not found.');
        return;
    }

    if (!categories || categories.length === 0) {
        console.error('Categories not found.');
        return;
    }

    createFilter(categories, block);

    try {
        const data = await fetchDataFromUrl(apiUrl);
        if (data) {
            generateCards(data, block);
        } else {
            console.log('Failed to fetch data.');
        }
    } catch (error) {
        console.error('Error in fetchDataFromUrl:', error);
    }
}
