export default async function decorate(block) {
    initializeCarousels();
}

function getDataValues(attributeName) {
    const mainElement = document.querySelector('main');
    // Select all sections with the specified data attribute
    const sections = mainElement.querySelectorAll(`[data-${attributeName}]`);
    // Retrieve the values of the specified data attribute for each section
    const values = Array.from(sections).map(section => section.getAttribute(`data-${attributeName}`));
    return values;
}

let carouselsInitialized = false;

function initializeCarousels() {
    if (carouselsInitialized) {
        console.log('Carousels already initialized.');
        return;
    }

    const mainElement = document.querySelector('main');
    const carouselContainers = mainElement.querySelectorAll('.carousel-v1-container');

    carouselContainers.forEach(carouselContainer => {
        const targetId = carouselContainer.getAttribute('data-teaser-target-id');
        const teaserContainers = mainElement.querySelectorAll(`.teaser-container[data-teaser-target-id="${targetId}"]`);
        const paginationValue = carouselContainer.getAttribute('data-pagination');
        const summary = carouselContainer.getAttribute('data-summary');
        const slideChangeTime = carouselContainer.getAttribute('data-timing');

        if (teaserContainers.length > 1) {
            createCarousel(mainElement, carouselContainer, teaserContainers, targetId, paginationValue, summary, slideChangeTime);
        }
    });

    carouselsInitialized = true;
}

function createCarousel(mainElement, carouselContainer, teaserContainers, targetId,paginationValue,summary,slideChangeTime ) {
    const carouselWrapper = document.createElement('div');
    carouselWrapper.className = `carousel-wrapper ${targetId}`;//n
    carouselWrapper.setAttribute('data-teaser-target-id', targetId);
    carouselWrapper.setAttribute('data-pagination', paginationValue);
    carouselWrapper.setAttribute('data-summary',summary);
    carouselWrapper.setAttribute('data-timing',slideChangeTime);

    teaserContainers.forEach(container => {
        carouselWrapper.appendChild(container);
        container.style.display = 'none';
    });

    mainElement.appendChild(carouselWrapper);
    createSummary(carouselWrapper, summary);
    createCarouselControls(carouselWrapper);

    // Choose navigation creation based on pagination value
    if (paginationValue === 'true') {
        createProgressBar(carouselWrapper, teaserContainers.length);
        createNavigationNumbers(carouselWrapper);
    } else {
        createNavigationDots(carouselWrapper);
    }
    
    displaySlide(carouselWrapper, 0);
    const timingAttribute = carouselContainer.getAttribute('data-timing');
    const timerInterval = parseTimingAttribute(timingAttribute);
    startSlideInterval(carouselWrapper, timerInterval);
}
function createProgressBar(carouselWrapper, totalSlides) {
    const progressBar = document.createElement('div');
    progressBar.className = 'carousel-progress';

    const progressInner = document.createElement('div');
    progressInner.className = 'carousel-progress-inner';
    progressInner.style.width = '0%'; // Initially set to 0%

    progressBar.appendChild(progressInner);
    carouselWrapper.appendChild(progressBar);

    updateProgressBar(carouselWrapper, totalSlides, 0); // Update progress bar for initial slide

    // Optionally, update progress bar on slide change
}

function updateProgressBar(carouselWrapper, totalSlides, currentIndex) {
    const progressInner = carouselWrapper.querySelector('.carousel-progress-inner');
    const percentage = ((currentIndex + 1) / totalSlides) * 100;
    progressInner.style.width = `${percentage}%`;
    progressInner.style.backgroundColor = 'green';
    progressInner.style.height="3px";
    progressInner.style.margin='10px';
}


function createSummary(carouselWrapper, summaryValue) {
    // Create summary div
    const summaryDiv = document.createElement('div');
    summaryDiv.classList.add('summary');
    summaryDiv.textContent = summaryValue;

    // // Insert summary div into carousel wrapper
    carouselWrapper.insertBefore(summaryDiv, carouselWrapper.querySelector('.carousel-dots'));
}

function createCarouselControls(carouselWrapper, paginationValue) {
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'carousel-controls';

    const leftControl = document.createElement('button');
    leftControl.className = 'carousel-control left';
    leftControl.innerHTML = '&#10094;';
    leftControl.addEventListener('click', () => {
        slideCarousel(carouselWrapper, -1);
        resetSlideInterval(carouselWrapper);
    });

    const rightControl = document.createElement('button');
    rightControl.className = 'carousel-control right';
    rightControl.innerHTML = '&#10095;';
    rightControl.addEventListener('click', () => {
        slideCarousel(carouselWrapper, 1);
        resetSlideInterval(carouselWrapper);
    });

    controlsContainer.appendChild(leftControl);
    controlsContainer.appendChild(rightControl);

    // Only create navigation dots if paginationValue is 'false'
    if (paginationValue === 'false') {
        createNavigationDots(carouselWrapper);
    }

    carouselWrapper.appendChild(controlsContainer);
}

function resetSlideInterval(carouselWrapper) {
    clearInterval(slideInterval);
    const timingAttribute = carouselWrapper.getAttribute('data-timing');
    const timerInterval = parseTimingAttribute(timingAttribute);
    startSlideInterval(carouselWrapper, timerInterval);
}

function createNavigationNumbers(carouselWrapper) {
    const teasers = carouselWrapper.querySelectorAll('.teaser-container');
    const numberContainer = document.createElement('div');
    numberContainer.className = 'carousel-numbers';

    teasers.forEach((_, index) => {
        const numberButton = document.createElement('button');
        numberButton.className = 'carousel-number';
        numberButton.innerText = index + 1; // Start numbering from 1
        numberButton.setAttribute('data-slide-index', index); // Set slide index as data attribute
        numberButton.addEventListener('click', () => {
            const slideIndex = parseInt(numberButton.getAttribute('data-slide-index'));
            displaySlide(carouselWrapper, slideIndex);
            resetSlideInterval(carouselWrapper);
            updateNavigationNumbers(carouselWrapper, slideIndex);
        });
        numberContainer.appendChild(numberButton);
    });

    carouselWrapper.appendChild(numberContainer);
    updateNavigationNumbers(carouselWrapper, 0); // Initially highlight the first number
}

function updateNavigationNumbers(carouselWrapper, currentIndex) {
    const numberButtons = carouselWrapper.querySelectorAll('.carousel-number');
    numberButtons.forEach((button, index) => {
        if (index === currentIndex) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

function createNavigationDots(carouselWrapper) {
    const teasers = carouselWrapper.querySelectorAll('.teaser-container');
    const dotContainer = document.createElement('div');
    dotContainer.className = 'carousel-dots';

    teasers.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = 'carousel-dot';
        dot.addEventListener('click', () => {
            displaySlide(carouselWrapper, index);
            resetSlideInterval(carouselWrapper);
        });
        dotContainer.appendChild(dot);
    });

    carouselWrapper.appendChild(dotContainer);
    updateNavigationDots(carouselWrapper, 0); // Initially highlight the first dot
}

function updateNavigationDots(carouselWrapper, currentIndex) {
    const dots = carouselWrapper.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
        if (index === currentIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

let currentSlideIndices = {};

function slideCarousel(carouselWrapper, direction) {
    const targetId = carouselWrapper.getAttribute('data-teaser-target-id');
    const teasers = carouselWrapper.querySelectorAll('.teaser-container');
    if (!(targetId in currentSlideIndices)) {
        currentSlideIndices[targetId] = 0;
    }

    let currentIndex = currentSlideIndices[targetId];
    currentIndex += direction;

    if (currentIndex >= teasers.length) {
        currentIndex = 0;
    } else if (currentIndex < 0) {
        currentIndex = teasers.length - 1;
    }

    currentSlideIndices[targetId] = currentIndex;
    displaySlide(carouselWrapper, currentIndex);
}

let slideInterval;

function startSlideInterval(carouselWrapper, interval) {
    slideInterval = setInterval(() => {
        const targetId = carouselWrapper.getAttribute('data-teaser-target-id');
        const teasers = carouselWrapper.querySelectorAll('.teaser-container');
        if (!(targetId in currentSlideIndices)) {
            currentSlideIndices[targetId] = 0;
        }

        let currentIndex = currentSlideIndices[targetId];
        currentIndex += 1; // Progress to the next slide

        if (currentIndex >= teasers.length) {
            currentIndex = 0;
        }

        currentSlideIndices[targetId] = currentIndex;
        displaySlide(carouselWrapper, currentIndex);
        updateTimerLine(carouselWrapper, interval, currentIndex); // Update timer line for each slide change
    }, interval);
}


function displaySlide(carouselWrapper, index) {
    const teasers = carouselWrapper.querySelectorAll('.teaser-container');
    teasers.forEach((teaser, i) => {
        teaser.style.display = i === index ? 'flex' : 'none';
    });

    updateNavigationNumbers(carouselWrapper, index);
    updateNavigationDots(carouselWrapper, index);

    const paginationValue = carouselWrapper.getAttribute('data-pagination');
    if (paginationValue === 'true') {
        const totalSlides = teasers.length;
        updateProgressBar(carouselWrapper, totalSlides, index);
    }
}


function parseTimingAttribute(timingAttribute) {
    if (!timingAttribute) {
        return 100000; // Default interval of 100 seconds
    }

    const match = timingAttribute.match(/^(\d+)\s*(sec|seconds)?$/i);
    if (!match) {
        console.warn(`Invalid data-timing attribute: ${timingAttribute}. Using default interval.`);
        return 100000; // Default interval if attribute format is invalid
    }

    const interval = parseInt(match[1], 10) * 1000; // Convert seconds to milliseconds
    return interval;
}
