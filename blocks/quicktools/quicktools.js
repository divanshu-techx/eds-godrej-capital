export default async function decorate(block) {
  console.log(block)
  const allDivs = block.querySelectorAll(':scope > div');

  allDivs.forEach((div) => {
    div.classList.add('quicktool-item');
    const quickToolItem = div.querySelectorAll(':scope > div');
    quickToolItem.forEach((item, index) => {
      if (index === 0) {
        item.classList.add('quicktool-item-picture');
      } else {
        item.classList.add('quicktool-item-text');
        const isLastItem = index === quickToolItem.length - 1;
        if (isLastItem) {
          const textElement = item.querySelector(':scope > *');
          if (textElement && textElement.textContent.trim()) {
            const text = textElement.textContent.trim();
            const middleIndex = Math.floor(text.length / 2);
            let splitIndex = text.lastIndexOf(' ', middleIndex);
            if (splitIndex === -1) {
              splitIndex = middleIndex;
            }
            // const firstPart = text.substring(0, splitIndex).trim();
            // const secondPart = text.substring(splitIndex).trim();
            // textElement.innerHTML = `<span>${firstPart}</span><span>${secondPart}</span>`;
          }
        }
      }
    });
  });
}
