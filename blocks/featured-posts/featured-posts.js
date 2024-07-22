export default async function decorate(block) {
  const parentDivs = block.querySelectorAll(':scope > div');
  parentDivs.forEach((parentDiv, index) => {
      parentDiv.classList.add('post', `post-${index + 1}`);
      const childDivs = parentDiv.querySelectorAll(':scope > div');
      childDivs.forEach((childDiv, childIndex) => {
          childDiv.classList.add(`post-${index + 1}-child`, `post-child-${childIndex + 1}`);
      });
  });
  const parentDiv = document.querySelector('.post-3-child.post-child-2');
    if (parentDiv) {
      const paragraphs = parentDiv.querySelectorAll('p');
      paragraphs.forEach((paragraph, index) => {
        paragraph.classList.add(`paragraph-${index}`);
      });
  }
  
  const parentDiv2 = document.querySelector('.post-4-child.post-child-1');
    if (parentDiv2) {
      const paragraphs = parentDiv2.querySelectorAll('p');
      paragraphs.forEach((paragraph, index) => {
        paragraph.classList.add(`para-${index}`);
      });
  }
}




