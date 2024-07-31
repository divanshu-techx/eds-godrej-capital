export default async function decorate(block) {
  const supportCardsColumnThird = block.querySelectorAll('.supportcards-column-third > div');
  supportCardsColumnThird.forEach((div, index) => {
    div.classList.add(`col-third-parent-${index}`);
    if (div.children.length > 0) {
      Array.from(div.children).forEach((child, childIndex) => {
        child.classList.add(`col-third-child-${index}-${childIndex}`);
      });
    }
  });
}
