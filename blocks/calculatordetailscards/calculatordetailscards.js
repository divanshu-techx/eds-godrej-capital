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
      }
    });
  }
  