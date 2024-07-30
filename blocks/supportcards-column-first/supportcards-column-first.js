// export default async function decorate(block) {
//   const wrapperDiv = document.createElement('div');
//   wrapperDiv.classList.add('col-wrapper');

//   const blockContainer = block.querySelectorAll(':scope > div');

//   if (blockContainer.length >= 3) {
//     wrapperDiv.appendChild(blockContainer[0]);
//     wrapperDiv.appendChild(blockContainer[1]);
//     wrapperDiv.children[0].classList.add('col-wrapper-child-1');
//     wrapperDiv.children[1].classList.add('col-wrapper-child-2');
//     const colWrapperChild1Children = wrapperDiv.children[0].children;
//     for (let i = 0; i < colWrapperChild1Children.length; i++) {
//       colWrapperChild1Children[i].classList.add(`col-wrapper-child-1-child-${i + 1}`);
//     }
//     const colWrapperChild2Children = wrapperDiv.children[1].children;
//     for (let i = 0; i < colWrapperChild2Children.length; i++) {
//       colWrapperChild2Children[i].classList.add(`col-wrapper-child-2-child-${i + 1}`);
//     }
//     block.insertBefore(wrapperDiv, blockContainer[2]);
//     blockContainer[2].classList.add('col-first');
//     const colFirstChildren = blockContainer[2].children;
//     for (let i = 0; i < colFirstChildren.length; i++) {
//       colFirstChildren[i].classList.add(`col-first-child-${i + 1}`);
//     }
//   }
// }

export default async function decorate(block) {
  // Create a new div to wrap the first two divs
  const wrapperDiv = document.createElement('div');
  wrapperDiv.classList.add('col-wrapper');

  // Select the direct child divs of the block
  const blockContainer = block.querySelectorAll(':scope > div');

  blockContainer.forEach((div, index) => {     
    // Add unique class to each div
    div.classList.add(`col-wrapper-child-${index + 1}`);

    // Add unique classes to the children of each div
    Array.from(div.children).forEach((child, i) => {
      child.classList.add(`col-wrapper-child-${index + 1}-child-${i + 1}`);
    });

    wrapperDiv.appendChild(div);
  });

  const wrapperElement = wrapperDiv.querySelectorAll(':scope > div');

  if (wrapperElement.length <= 2) {
    block.appendChild(wrapperDiv);
  } else if (wrapperElement.length >= 3) {
    const lastDiv = wrapperDiv.lastElementChild;
    lastDiv.classList.add('col-first');
    const colFirstChildren = lastDiv.children;
    for (let i = 0; i < colFirstChildren.length; i + 1) {
      colFirstChildren[i].classList.add(`col-first-child-${i + 1}`);
    }
    wrapperDiv.removeChild(lastDiv);
    console.log(lastDiv);
    block.appendChild(wrapperDiv);
    block.appendChild(lastDiv);
  }
}
