export default function decorate(block) {
    if (!block) {
        console.error('Main container not found');
        return;
    }
    const parentDivs = block.querySelectorAll(':scope > div');
    parentDivs.forEach(parentDiv => {
        parentDiv.classList.add('usp-details-parent');
        const pictureDiv = parentDiv.querySelector('div picture');
        if (pictureDiv) {
            pictureDiv.parentElement.classList.add('imagedata');
        }
        const contentDiv = parentDiv.querySelector('div p');
        if (contentDiv) {
            contentDiv.parentElement.classList.add('uspcontentdetails');
        }
    });
    
}
