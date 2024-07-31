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
    parentDiv.classList.add('contentandpictureparent');
    // Select the first div (content) and the second div (picture) within each direct child div
    const firstDiv = parentDiv.querySelector('div:first-of-type');
    const secondDiv = parentDiv.querySelector('div:last-of-type');
    if (firstDiv) {
      firstDiv.classList.add('card-contentdetails');
      // Convert <p> elements to <div> elements within the contentDiv
      const paragraphs = firstDiv.querySelectorAll('p');
      paragraphs.forEach(p => {
        const div = document.createElement('div');
        div.innerHTML = p.innerHTML;
        p.replaceWith(div);
      });
      // Add specific classes to title and description
      const description = firstDiv.querySelector('div:first-of-type');
      if (description) {
        description.classList.add('card-description');
      }
    }
    if (secondDiv) {
      secondDiv.classList.add('picturedetails');
    }
  });
}
