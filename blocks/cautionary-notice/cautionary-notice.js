export default async function decorate(block) {
  if (!block) {
    console.error('Main container not found');
    return;
  }
  // Add the custom class to the main block
  const parentDivs = block.querySelectorAll(':scope > div');
  parentDivs.forEach((parentDiv) => {
    // Add the contentandpictureparent class to the parent div
    parentDiv.classList.add('parent-details');
    // Select the first div (content) and the second div (picture) within each direct child div
    const contentDiv = parentDiv.querySelector('div:first-of-type');
    if (contentDiv) {
      contentDiv.classList.add('child-div');
    }
  });
}
