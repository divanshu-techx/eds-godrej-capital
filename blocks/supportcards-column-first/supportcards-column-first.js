
export default async function decorate(block) {
  // Create a new div to wrap the first two divs
  const wrapperDiv = document.createElement('div');
  wrapperDiv.classList.add('col-wrapper');

  // Select the direct child divs of the block
  const blockContainer = block.querySelectorAll(':scope > div');
  
  // Check if there are at least three child divs
  if (blockContainer.length >= 3) {
    // Move the first two child divs into the wrapperDiv
    wrapperDiv.appendChild(blockContainer[0]);
    wrapperDiv.appendChild(blockContainer[1]);
    
    // Add different classes to the children of the col-wrapper
    wrapperDiv.children[0].classList.add('col-wrapper-child-1');
    wrapperDiv.children[1].classList.add('col-wrapper-child-2');

    // Add unique classes to children of col-wrapper-child-1
    const colWrapperChild1Children = wrapperDiv.children[0].children;
    for (let i = 0; i < colWrapperChild1Children.length; i++) {
      colWrapperChild1Children[i].classList.add(`col-wrapper-child-1-child-${i + 1}`);
    }

    // Add unique classes to children of col-wrapper-child-2
    const colWrapperChild2Children = wrapperDiv.children[1].children;
    for (let i = 0; i < colWrapperChild2Children.length; i++) {
      colWrapperChild2Children[i].classList.add(`col-wrapper-child-2-child-${i + 1}`);
    }

    // Insert the wrapperDiv before the third div
    block.insertBefore(wrapperDiv, blockContainer[2]);
    
    // Add the class 'col-first' to the third div
    blockContainer[2].classList.add('col-first');

    // Add different class to each child of col-first
    const colFirstChildren = blockContainer[2].children;
    for (let i = 0; i < colFirstChildren.length; i++) {
      colFirstChildren[i].classList.add(`col-first-child-${i + 1}`);
    }
  }
}













