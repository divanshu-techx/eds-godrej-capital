// Function to add classes to specific divs and convert <p> elements to <div> elements
export default async function decorate(block) {
    if (!block) {
      console.error('Main container not found');
      return;
    }
    
    // Select all direct children divs of the container
    const parentDivs = block.querySelectorAll(':scope > div');
    parentDivs.forEach(parentDiv => {
      // Add the contentandpictureparent class to the parent div
      parentDiv.classList.add('contentpicparent');
      
      // Select the first div (content) and the second div (picture) within each direct child div
      const contentDiv = parentDiv.querySelector('div:first-of-type');
      const pictureDiv = parentDiv.querySelector('div:last-of-type');
      
      if (contentDiv) {
        contentDiv.classList.add('imagedata');
      }
      
      if (pictureDiv) {
        pictureDiv.classList.add('contentdata');
        // Select the second <p> tag under contentdata
        const pTags = pictureDiv.querySelectorAll('p');
        if (pTags.length > 1) {
          const secondPTag = pTags[1];
          // Add the responsive-visibility class
          secondPTag.classList.add('responsive-visibility');
          // Handle initial visibility based on screen size
          updateVisibility(secondPTag);
          // Add resize event listener to handle screen size changes
          window.addEventListener('resize', () => updateVisibility(secondPTag));
        }
      }
    });
}
// Function to update visibility of the second <p> tag based on screen size
function updateVisibility(element) {
  if (window.innerWidth <= 768) {
    element.style.display = 'block'; // Show on mobile screens
  } else {
    element.style.display = 'none'; // Hide on desktop screens
  }
}

