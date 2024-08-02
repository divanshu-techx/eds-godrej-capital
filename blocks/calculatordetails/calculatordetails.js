export default function decorate(block) {
  if (!block) {
    console.error('Main container not found');
    return;
  }
  const parentDivs = block.querySelectorAll(':scope > div');
  parentDivs.forEach((parentDiv) => {
    // Add the contentandpictureparent class to the parent div
    parentDiv.classList.add('detailsparent');

    // Select the first div (content) and the second div (picture) within each direct child div
    const contentDiv = parentDiv.querySelector('div:first-of-type');
    const pictureDiv = parentDiv.querySelector('div:last-of-type');

    if (contentDiv) {
      contentDiv.classList.add('firstdata');
    }

    if (pictureDiv) {
      pictureDiv.classList.add('seconddata');
    }
  });
}
