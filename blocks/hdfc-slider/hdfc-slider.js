export default async function decorate(block) {
    // Ensure all direct child divs of the block have the carousel-item class
    const childDivs = block.querySelectorAll(':scope > div');
    childDivs.forEach((div) => {
        div.classList.add('slider-item');
    });
    
    // Select the carousel container within the block
    const carousel = block;
    console.log(carousel);
    if (!carousel) return; // Return if the carousel container is not found
    
    // Select all carousel items within the carousel container
    const items = carousel.querySelectorAll('.slider-item');
    let currentIndex = 0;
    const intervalTime = 2000; // Interval time in milliseconds
    
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
