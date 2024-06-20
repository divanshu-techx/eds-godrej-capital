export default async function decorate(block) {
  const allDivs = block.querySelectorAll(":scope > div");
  allDivs.forEach((div, index) => {
    if (index == allDivs.length - 1) {
      div.classList.add("quick-apply");
    } else {
      div.classList.add("quicktool-item");
    }
    const quickToolItem = div.querySelectorAll(":scope > div");
    quickToolItem.forEach((item, index) => {
      if (index === 0) {
        item.classList.add("quicktool-item-picture");
      } else {
        item.classList.add("quicktool-item-text");
      }
    });
  });
}
