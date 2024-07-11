export default async function decorate(block) {
  const childDivs = block.querySelectorAll(":scope > div");
  childDivs.forEach((div) => {
    div.classList.add("slider-item");
  });
  const carousel = block;
  console.log(carousel);
  if (!carousel) return;
  const items = carousel.querySelectorAll(".slider-item");
  let currentIndex = 0;
  const intervalTime = 2000;
  function showItem(index) {
    items.forEach((item, idx) => {
      if (idx === index) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }

  // Function to move to the next item
  function nextItem() {
    currentIndex = (currentIndex + 1) % items.length;
    showItem(currentIndex);
  }

  // Initial setup
  showItem(currentIndex);

  // Automatic sliding
  setInterval(nextItem, intervalTime);
}
