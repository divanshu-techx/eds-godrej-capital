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
function sortCards(sortBy, block) {
    // Select containers for each category
    const pictureGalleryContainer = block.querySelector('.picture-gallery-container');
    const otherCategoryContainer = block.querySelector('.other-category-container');

    // Ensure otherCategoryContainer is properly handled
    const otherCategoryWrapper = otherCategoryContainer ? otherCategoryContainer.querySelector('.other-category-wrapper') : null;

    // Convert NodeList to Array and sort each container's cards
    const sortAndAppendCards = (container) => {
        if (container) {
            const cards = Array.from(container.getElementsByClassName('card-media-gallery'));

            cards.sort((a, b) => {
                const publishDateA = parseInt(a.getAttribute('data-publishdate'));
                const publishDateB = parseInt(b.getAttribute('data-publishdate'));

                if (sortBy === 'ascending') {
                    return publishDateA - publishDateB;
                } else if (sortBy === 'descending') {
                    return publishDateB - publishDateA;
                } else {
                    return 0; // Default case if no valid sort option is selected
                }
            });

            // Clear the container and re-append sorted cards
            container.innerHTML = '';
            cards.forEach(card => container.appendChild(card));
        }
    };

    // Sort and update each category container
    sortAndAppendCards(pictureGalleryContainer);
    sortAndAppendCards(otherCategoryWrapper);
}

function createFilter(categories, block) {
    const searchInputPlaceholder = getDataAttributeValueByName('searchInputPlaceholder');
    const tabContainer = document.createElement('div');

    const sortByLabel = getDataAttributeValueByName('sortByLabel');
    const sortByLabelDropDownLabel = getDataAttributeValueByName('sortByLabelDropDownLabel');

    tabContainer.classList.add('media-gallery-filter');
    const tabsDiv = document.createElement('div');
    tabsDiv.classList.add('tabs-wrapper-media-gallery');

    categories.forEach((category, index) => {
        const tab = document.createElement('button');
        tab.classList.add('media-tab');
        tab.setAttribute('data-category', category);
        tab.textContent = category;
        tab.addEventListener('click', () => {
            showCategoryContent(category, block, tab);
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
    const sortValues = ['descending', 'ascending'];
    sortOptions.forEach((option, index) => {
        // const cleanOption = option.replace(/\(|\)/g, ''); 
        const sortOption = document.createElement('option');
        sortOption.value = sortValues[index];
        sortOption.textContent = option;
        sortDropdown.appendChild(sortOption);
    });
    sortDropdown.addEventListener('change', () => {
        sortCards(sortDropdown.value, block);
    });

    sortDiv.appendChild(sortDropdown);

    const SearchDropDiv=document.createElement('div');
    SearchDropDiv.classList.add('search-sortBy-filter');
    SearchDropDiv.append(searchDiv,sortDiv);
    // Add search input and tabs to the block
    tabContainer.append(tabsDiv, SearchDropDiv);
    block.insertBefore(tabContainer, block.firstChild);
}

function showCategoryContent(category, block) {
    const allTabs = block.querySelectorAll('.media-tab');
    const pictureContainer = block.querySelector('.main-picture-div');
    const videoContainer = block.querySelector('.other-category-container');
    let noResultsMessage = block.querySelector('.no-results');

    allTabs.forEach(tab => {
        if (tab.getAttribute('data-category') === category) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    // Show the content related to the active tab
    if (category === 'Videos') {
        pictureContainer.style.display = 'none';
        videoContainer.style.display = 'block';
    } else if (category === 'Picture Gallery') {
        pictureContainer.style.display = 'block';
        videoContainer.style.display = 'none';
    }

    // // Check if the containers have visible content
    // const hasPictureContent = pictureContainer.querySelector('.card-media-gallery')?.children.length > 0;
    // const hasVideoContent = videoContainer.querySelector('.card-media-gallery')?.children.length > 0;

    // // If no content is visible, show the no results message
    // if (!hasPictureContent && !hasVideoContent) {
    //     if (!noResultsMessage) {
    //         noResultsMessage = document.createElement('div');
    //         noResultsMessage.className = 'no-results';
    //         noResultsMessage.textContent = 'No results found';
    //         block.appendChild(noResultsMessage);
    //     }
    //     noResultsMessage.style.display = 'block';
    // } else {
    //     if (noResultsMessage) {
    //         noResultsMessage.style.display = 'none';
    //     }
    // }
}

function filterCardsBySearch(searchTerm, block) {
    const allCards = block.querySelectorAll('.card-media-gallery');
    const lowerCaseSearchTerm = searchTerm.trim().toLowerCase(); // Trim and convert to lowercase
    let resultsFound = false;

    // Check if searchTerm has at least 3 characters
    if (lowerCaseSearchTerm.length < 3) {
        // Reset all cards to be visible if searchTerm length is less than 3
        allCards.forEach(card => {
            card.style.display = 'block';
        });

        // Remove noResultsMessage if it exists
        let noResultsMessage = block.querySelector('.no-results');
        if (noResultsMessage) {
            noResultsMessage.remove();
        }
        return; // Exit function early
    }

    allCards.forEach(card => {
        const cardContent = card.textContent.toLowerCase();
        if (cardContent.includes(lowerCaseSearchTerm)) {
            card.style.display = 'block';
            resultsFound = true;
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
    modal.classList.add('media-gallery-modal');

    const modalContent = document.createElement('div');
    modalContent.classList.add('media-gallery-modal-content');

    // Modal header with close button
    const modalHeader = document.createElement('div');
    modalHeader.classList.add('media-gallery-modal-header');

    const closeModalBtn = document.createElement('span');
    closeModalBtn.classList.add('media-gallery-close-modal');
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

// Function to fetch and append content to pictureGalleryContainer
function fetchAndAppendContent(block, url, container,cardTitle) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            const mainContent = doc.querySelector('main');

            if (mainContent) {
                container.innerHTML = mainContent.innerHTML;
            } else {
                container.innerHTML = '<p>No main content found.</p>';
            }
            // console.log(container);
            updateNewCard(block, container,cardTitle,url)
            console.log(mainContent);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            // Optionally, show an error message to the user
            container.innerHTML = '<p>Failed to load content. Please try again later.</p>';
        });
}

// Helper function to convert Excel date format to JavaScript Date
function convertExcelDate(excelDate) {
    const date = new Date((excelDate - (25567 + 2)) * 86400 * 1000);
    return date;
}


function generateCards(data, block) {
    // Create the main parent div for all cards
    const mainParentDiv = document.createElement('div');
    mainParentDiv.classList.add('main-parent-container');

    // Create the div for Picture Gallery cards
    const pictureGalleryContainer = document.createElement('div');
    pictureGalleryContainer.classList.add('picture-gallery-container');

    const newContentDiv = document.createElement('div');
    newContentDiv.classList.add('new-content-card');

    const mainPicture = document.createElement('div');
    mainPicture.classList.add('main-picture-div');

    // Create the div for other category cards and a wrapper for its cards
    const otherCategoryContainer = document.createElement('div');
    otherCategoryContainer.classList.add('other-category-container');

    const otherCategoryWrapper = document.createElement('div');
    otherCategoryWrapper.classList.add('other-category-wrapper');

    data.data.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('card-media-gallery');
        card.setAttribute('data-category', item.category);

        const publishDate = convertExcelDate(item.publishdate);
        card.setAttribute('data-publishdate', publishDate.getTime()); // Store as timestamp for easier sorting

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
            cardTitle.href = item.path;
            cardTitle.textContent = item.cardtitle;
            cardLinkDiv.appendChild(cardTitle);


            cardImageDiv.addEventListener('click', (e) => {
                e.preventDefault();
                pictureGalleryContainer.style.display = 'none';
                newContentDiv.classList.add('active');
                fetchAndAppendContent(block, item.path, newContentDiv,item.cardtitle);
            });

            cardTitle.addEventListener('click', (e) => {
                e.preventDefault();
                pictureGalleryContainer.style.display = 'none';
                newContentDiv.classList.add('active');
                fetchAndAppendContent(block, item.path, newContentDiv,item.cardtitle);
            });

            card.append(cardImageDiv, cardLinkDiv);
            pictureGalleryContainer.appendChild(card);
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
                iframe.style.pointerEvents = 'none'; // Prevent click events from affecting iframe
                cardVideoDiv.appendChild(iframe);
            } else {
                const video = document.createElement('video');
                video.src = item.cardvideolink;
                video.controls = true;
                video.width = 560;
                video.height = 315;
                video.style.pointerEvents = 'none'; // Prevent click events from affecting video
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

            // Add click event listener to open modal or redirect
            cardVideoDiv.addEventListener('click', (e) => {
                e.preventDefault();
                if (item.videotype === 'popup') {
                    openModal(item.cardvideolink);
                } else {
                    window.location.href = item.cardvideolink;
                }
            });

            cardLinkDiv.append(cardTitle, cardVideoDescription);
            card.append(cardVideoDiv, cardLinkDiv);
            otherCategoryWrapper.appendChild(card);
        }
    });

    // Append the picture gallery container and other category wrapper to the main parent div
    otherCategoryContainer.appendChild(otherCategoryWrapper);
    mainPicture.append(pictureGalleryContainer, newContentDiv);
    mainParentDiv.appendChild(mainPicture);
    mainParentDiv.appendChild(otherCategoryContainer);

    // Append the main parent div to the block
    block.appendChild(mainParentDiv);
}

function updateNewCard(block, container,cardTitle,url) {
    const mainCardDiv = container.querySelector(':scope > div');
    mainCardDiv.classList.add('mainNewCardDiv');

    const mainCardPictureDiv = mainCardDiv.querySelector(':scope > div');
    mainCardPictureDiv.classList.add('mainCardPictureDiv');

    const newTopDiv = document.createElement('div');
    newTopDiv.classList.add('redirectDiv-media-gallery');

    const backPage = document.createElement('div');
    backPage.classList.add('back-page');

    const backAnchor = document.createElement('a');
    backAnchor.href=url;
    backAnchor.classList.add('back-link-media-gallery');
    backAnchor.textContent = cardTitle;
    backPage.appendChild(backAnchor);

    const totalImgVid=document.createElement('div');
    totalImgVid.classList.add('total-img-video-media-gallery');

    const countCards=document.createElement('p');
    totalImgVid.appendChild(countCards);

    newTopDiv.append(backPage,totalImgVid);

    mainCardDiv.insertBefore(newTopDiv, mainCardPictureDiv);

    // Create upperPictureDiv and insert it into mainCardDiv (not mainCardPictureDiv)
    const upperPictureDiv = document.createElement('div');
    upperPictureDiv.classList.add('upperPictureDiv');
    mainCardDiv.insertBefore(upperPictureDiv, mainCardPictureDiv); // Insert before mainCardPictureDiv

    const allChildDiv = mainCardPictureDiv.querySelectorAll(':scope > div');
    let currentIndex = 0;

    // Set the first new-card-picture-div as active by default
    allChildDiv[currentIndex].classList.add('active');
    const initialClone = allChildDiv[currentIndex].cloneNode(true);
    upperPictureDiv.appendChild(initialClone);

    function updateActiveElement(index) {
        allChildDiv.forEach(el => el.classList.remove('active'));
        allChildDiv[index].classList.add('active');

        const clone = allChildDiv[index].cloneNode(true);
        upperPictureDiv.innerHTML = '';
        upperPictureDiv.appendChild(clone);

        allChildDiv[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Add click event listener to each new-card-picture-div
    allChildDiv.forEach((element, index) => {
        element.classList.add('new-card-picture-div');
        element.addEventListener('click', () => {
            currentIndex = index;
            updateActiveElement(currentIndex);
        });
    });

    // Create Previous and Next buttons
    const prevButton = document.createElement('button');
    prevButton.innerText = 'Previous';
    prevButton.classList.add('media-gallery-nav-button', 'prev-button');
    mainCardPictureDiv.insertBefore(prevButton, mainCardPictureDiv.firstChild); // Insert at the beginning

    const nextButton = document.createElement('button');
    nextButton.innerText = 'Next';
    nextButton.classList.add('media-gallery-nav-button', 'next-button');
    mainCardPictureDiv.appendChild(nextButton); // Insert at the end

    // Add event listeners for Previous and Next buttons
    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex = (currentIndex - 1 + allChildDiv.length) % allChildDiv.length;
            updateActiveElement(currentIndex);
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentIndex < allChildDiv.length - 1) {
            currentIndex = (currentIndex + 1) % allChildDiv.length;
            updateActiveElement(currentIndex);
        }
    });

    // Event listener for backAnchor
    backAnchor.addEventListener('click', (e) => {
        e.preventDefault();
        // Select the elements you want to modify
        const pictureGalleryContainer = block.querySelector('.picture-gallery-container');
        const newContentCard = block.querySelector('.new-content-card');

        // Ensure that picture-gallery-container is displayed as block
        if (pictureGalleryContainer) {
            pictureGalleryContainer.style.display = 'flex';
        }

        // Ensure that new-content-card is hidden and remove the active class
        if (newContentCard) {
            newContentCard.style.display = 'none';
            newContentCard.classList.remove('active');
        }
    });

    // Event listener for picture-gallery-container
    const pictureGalleryContainer = block.querySelector('.picture-gallery-container');
    if (pictureGalleryContainer) {
        pictureGalleryContainer.addEventListener('click', () => {
            // Select the elements you want to modify
            const newContentCard = block.querySelector('.new-content-card');
            const galleryContainer = block.querySelector('.picture-gallery-container');

            // Ensure that new-content-card is displayed as block
            if (newContentCard) {
                newContentCard.style.display = 'block';
            }

            // Ensure that picture-gallery-container is hidden
            if (galleryContainer) {
                galleryContainer.style.display = 'none';
            }
        });
    }

    
    const pictureDivs = block.querySelectorAll('.new-card-picture-div');
    const pictureLength = pictureDivs.length;
    const videoDivs=document.querySelectorAll('.other-category-wrapper .card-media-gallery');
    const videoDivLendth= videoDivs.length;
    countCards.textContent=`${pictureLength} Images ${videoDivLendth} Videos`;

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
            const firstTab = block.querySelector('.media-tab');
            if (firstTab) {
                showCategoryContent(firstTab.getAttribute('data-category'), block, firstTab);
            }
        } else {
            console.log('Failed to fetch data.');
        }
    } catch (error) {
        console.error('Error in fetchDataFromUrl:', error);
    }
}
