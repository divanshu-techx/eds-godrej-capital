/* eslint-disable import/no-unresolved */
import { toClassName } from '../../scripts/aem.js';

function hasWrapper(el) {
    return !!el.firstElementChild && window.getComputedStyle(el.firstElementChild).display === 'block';
}

function createMediaElement(url) {
    // Check if the URL is a YouTube link
    const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
    if (isYouTube) {
        // Extract the YouTube video ID from the URL
        const videoId = url.split('/').pop().split('?')[0];
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}`;
        iframe.width = '560';
        iframe.height = '315';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        return iframe;
    }

    const imgExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const videoExtensions = ['mp4', 'webm', 'ogg'];

    // Extract the file extension, ignoring query parameters
    const urlWithoutParams = url.split('?')[0];
    const extension = urlWithoutParams.split('.').pop().toLowerCase();

    if (imgExtensions.includes(extension)) {
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Image';
        img.style.maxWidth = '100%';
        return img;
    } else if (videoExtensions.includes(extension)) {
        const video = document.createElement('video');
        video.src = url;
        video.controls = true;
        video.style.maxWidth = '100%';
        return video;
    }

    const fallback = document.createElement('p');
    fallback.textContent = 'Unsupported media type';
    return fallback;
}

export default async function decorate(block) {
    // Select the element with the desired class
    const element1 = document.querySelector('.usp-section-links.ups-tabs-container');

    // Initialize an array to store the data attribute names and values
    const dataAttributes = [];

    // Loop through each data attribute in the element
    if (element1) {
        Array.from(element1.attributes).forEach(attr => {
            if (attr.name.startsWith('data-')) {
                // Add an object with the attribute name and value to the array
                dataAttributes.push({ name: attr.name, value: attr.value });
            }
        });

        // Log the array to the console
        console.log(dataAttributes);
    }

    // build tablist
    const tablist = document.createElement('div');
    tablist.className = 'ups-tabs-list';
    tablist.setAttribute('role', 'tablist');

    // decorate tabs and tabpanels
    const tabs = [...block.children].map((child) => child.firstElementChild);
    tabs.forEach((tab, i) => {
        const id = toClassName(tab.textContent);

        // decorate tabpanel
        const tabpanel = block.children[i];
        tabpanel.className = 'ups-tabs-panel';
        tabpanel.id = `tabpanel-data-${id}`;
        tabpanel.setAttribute('aria-hidden', !!i);
        tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
        tabpanel.setAttribute('role', 'tabpanel');
        if (!hasWrapper(tabpanel.lastElementChild)) {
            tabpanel.lastElementChild.innerHTML = `<p>${tabpanel.lastElementChild.innerHTML}</p>`;
        }

        // build tab button
        const button = document.createElement('button');
        button.className = 'ups-tabs-tab';
        button.id = `tab-${id}`;
        button.innerHTML = tab.innerHTML;
        button.setAttribute('aria-controls', `tabpanel-data-${id}`);
        button.setAttribute('aria-selected', !i);
        button.setAttribute('role', 'tab');
        button.setAttribute('type', 'button');
        button.addEventListener('click', () => {
            block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
                panel.setAttribute('aria-hidden', true);
            });
            tablist.querySelectorAll('button').forEach((btn) => {
                btn.setAttribute('aria-selected', false);
            });
            tabpanel.setAttribute('aria-hidden', false);
            button.setAttribute('aria-selected', true);
        });
        tablist.append(button);
        tab.remove();

        // Only add media elements if the data attributes have a matching id
        dataAttributes.forEach(x => {
            // Use the tab's id as a reference
            if (`tabpanel-data-${id}` === `tabpanel-${x.name}`) {
                let tabpanelDiv = document.getElementById(`tabpanel-data-${id}`);
                if (tabpanelDiv != null) {
                    const mediaElement = createMediaElement(x.value);
                    if (mediaElement) {
                        tabpanelDiv.prepend(mediaElement);
                    }
                }
            }
        });
    });

    // Add the tablist to the block
    block.prepend(tablist);

    // Mobile view functionality
    if (document.documentElement.clientWidth <= 768) {
        let tabsDiv = document.querySelectorAll('.ups-tabs table');
        tabsDiv.forEach((element, index) => {
            element.classList.add(`ups-child-tab-${index}`);
            addButton(element);
        });
    }
}

function addButton(element) {
    let btnDiv = document.createElement('div');
    btnDiv.classList.add('btnDiv');

    let leftBtn = document.createElement('button');
    leftBtn.innerHTML = '&#10094';
    leftBtn.style.width = '20px';
    leftBtn.classList.add('prev');
    leftBtn.addEventListener('click', () => moveSlide(element, -1));

    let rightBtn = document.createElement('button');
    rightBtn.innerHTML = '&#10095';
    rightBtn.style.width = '20px';
    rightBtn.classList.add('next');
    rightBtn.addEventListener('click', () => moveSlide(element, 1));

    btnDiv.appendChild(leftBtn);

    let tableBody = element.querySelectorAll('tbody')[0];
    let tableLength = tableBody.children.length;

    if (tableLength === 0) return; // Exit if no rows

    let countDiv = document.createElement('div');
    countDiv.classList.add('countDiv');

    for (let i = 0; i < tableLength; i++) {
        let pTag = document.createElement('p');
        pTag.innerHTML = `0${i + 1}`;
        pTag.classList.add(`card-${i + 1}`);
        countDiv.appendChild(pTag);
    }

    btnDiv.appendChild(countDiv);
    btnDiv.appendChild(rightBtn);

    element.prepend(btnDiv);

    // Initialize first slide
    navigateTabs(element, 0);

    // Add click event listener to <p> tags
    let countPdiv = countDiv;
    let pTags = countPdiv.querySelectorAll('p');
    pTags.forEach(countTag => {
        let indexData = countTag.innerHTML;
        countTag.addEventListener('click', () => navigateTabs(element, parseInt(indexData) - 1));
    });
}

let currentSlide = 0;

function moveSlide(element, n) {
    let tableBody = element.querySelectorAll('tbody')[0];
    let underElement = Array.from(tableBody.children);
    let newIndex = currentSlide + n;

    if (newIndex >= underElement.length) {
        currentSlide = 0;
    } else if (newIndex < 0) {
        currentSlide = underElement.length - 1;
    } else {
        currentSlide = newIndex;
    }

    navigateTabs(element, currentSlide);
}

function navigateTabs(element, index) {
    let tableBody = element.querySelectorAll('tbody')[0];
    let underElement = Array.from(tableBody.children);

    // Hide all rows
    underElement.forEach(row => {
        row.classList.add('hideTr');
        row.classList.remove('showTr');
    });

    // Show the current row
    if (underElement[index]) {
        underElement[index].classList.remove('hideTr');
        underElement[index].classList.add('showTr');
    }
}
