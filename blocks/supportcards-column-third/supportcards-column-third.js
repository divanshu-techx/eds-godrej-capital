export default async function decorate(block) {
    const supportCardsColumnFirst = block.querySelectorAll('.supportcards-column-third> div');
    supportCardsColumnFirst.forEach((div, index) => {
      div.classList.add(`col-third`);
  });
  }
  