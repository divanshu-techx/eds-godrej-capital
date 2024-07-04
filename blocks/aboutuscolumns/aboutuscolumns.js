export function getIndex(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// Function to get indexed child names and set class with numbering
export function getIndexedChildNames(parentId) {
  const newParentId = `.${parentId}`;
  const parentElement = document.querySelector(newParentId);

  if (!parentElement) {
    return;
  }

  const childDivs = parentElement.querySelectorAll(`${newParentId} > div`);

  childDivs.forEach((div, index) => {
    const lastIndexed = getIndex(index + 1);
    div.className = `${parentId}-child-${lastIndexed}`;
  });
}
export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`about-columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('about-columns-img-col');
        }
      }
    });
  });

  getIndexedChildNames('about-columns');
}
