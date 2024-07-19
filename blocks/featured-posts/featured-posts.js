export default async function decorate(block) {
  const parentDivs = block.querySelectorAll(':scope > div');
  parentDivs.forEach((parentDiv, index) => {
      parentDiv.classList.add('post', `post-${index + 1}`);
      const childDivs = parentDiv.querySelectorAll(':scope > div');
      childDivs.forEach((childDiv, childIndex) => {
          childDiv.classList.add(`post-${index + 1}-child`, `post-child-${childIndex + 1}`);
      });
  });
}




