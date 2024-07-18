export default function decorate(block) {
    // Ensure the block is defined and log its content
    if (!block) {
        console.error('Main container not found');
        return;
    }

    // Select direct child divs of the block
    const parentDivs = block.querySelectorAll(':scope > div');
    parentDivs.forEach(parentDiv => {
        // Add the usp-details-parent class to the parent div
        parentDiv.classList.add('usp-details-parent');

        // Select the div that contains a picture tag and add the imagedata class
        const pictureDiv = parentDiv.querySelector('div picture');
        if (pictureDiv) {
            pictureDiv.parentElement.classList.add('imagedata');
        }

        // Select the div that contains a p tag and add the uspcontentdetails class
        const contentDiv = parentDiv.querySelector('div p');
        if (contentDiv) {
            contentDiv.parentElement.classList.add('uspcontentdetails');
        }
    });
}
