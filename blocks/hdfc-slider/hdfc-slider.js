export default async function decorate(block) {
  // Ensure all direct child divs of the block have the carousel-item class
  const childDivs = block.querySelectorAll(':scope > div');
  childDivs.forEach((div) => {
    div.classList.add('slider-item');
  });
  // Select all carousel items within the carousel container
  const items = block.querySelectorAll('.slider-item');
  let currentIndex = 0;
  const parentDiv = document.querySelector('.hdfc-slider-section-container');
  const timer = parentDiv.getAttribute('data-slider-timer-in-second');
  console.log(timer);
  let intervalTime = 5000;
  if (timer) {
    intervalTime = timer * 1000;
  }
  // Function to show current item
  function showItem(index) {
    items.forEach((item, idx) => {
      if (idx === index) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
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
