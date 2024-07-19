export default async function decorate(block) {
    const supportCardsColumnFirst = block.querySelectorAll('.supportcards-column-second > div');
    supportCardsColumnFirst.forEach((div, index) => {
      div.classList.add(`col-second-parent-${index}`);
      if (div.children.length > 0) {
        Array.from(div.children).forEach((child, childIndex) => {
            child.classList.add(`col-second-child-${index}-${childIndex}`);
        });
    }
  });
  }
  