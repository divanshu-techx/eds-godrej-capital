export default async function decorate(block) {
  function handleMobileView() {
    const slideCards = document.querySelector('.career-value-cards');
    const parentBlockDiv = document.querySelector('.careervalue-wrapper');
    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('btn-container');
    const slideCount = slideCards.children.length;
    const pTagDiv = document.createElement('div');
    pTagDiv.classList.add('numberChart');
    for (let i = 1; i <= slideCount; i += 1) {
      const countChart = document.createElement('span');
      countChart.innerHTML = `0${i}`;
      countChart.classList.add(`card-0${i}`);
      pTagDiv.append(countChart);
    }
    pTagDiv.querySelectorAll('span').forEach((element, index) => {
      element.addEventListener('click', () => {
        showSlide(index);
      });
    });
    // Create left button with custom icon
    const leftBtn = document.createElement('button');
    leftBtn.classList.add('prev');
    leftBtn.innerHTML = `<img src='/icons/nexticon.svg' alt='Previous' />`; // Custom icon
    buttonDiv.appendChild(leftBtn);
    buttonDiv.appendChild(pTagDiv);
    // Create right button with custom icon
    const rightBtn = document.createElement('button');
    rightBtn.classList.add('next');
    rightBtn.innerHTML = `<img src='/icons/nexticon.svg' alt='Next' />`; // Custom icon
    buttonDiv.appendChild(rightBtn);
    parentBlockDiv.prepend(buttonDiv);
    leftBtn.addEventListener('click', () => {
      moveSlide(-1);
    });
    rightBtn.addEventListener('click', () => {
      moveSlide(1);
    });
    let currentSlide = 0;

    function showSlide(index) {
      if (index >= slideCards.children.length) {
        currentSlide = 0;
      } else if (index < 0) {
        currentSlide = slideCards.children.length - 1;
      } else {
        currentSlide = index;
      }
      const parentNumber = document.querySelector('.numberChart');
      for (let i = 0; i < parentNumber.children.length; i += 1) {
        parentNumber.children[i].classList.remove('currentnode', 'underline');
      }
      parentNumber.children[currentSlide].classList.add(
        'currentnode',
        'underline',
      );
      for (let j = 0; j < block.children.length; j += 1) {
        block.children[j].classList.remove('show');
        block.children[j].classList.add('hidecards');
      }
      block.children[currentSlide].classList.add('show');
      block.children[currentSlide].classList.remove('hidecards');
      // Enable or disable buttons based on the current slide
      if (currentSlide === 0) {
        leftBtn.disabled = true;
      } else {
        leftBtn.disabled = false;
      }
      if (currentSlide === slideCards.children.length - 1) {
        rightBtn.disabled = true;
      } else {
        rightBtn.disabled = false;
      }
    }
    moveSlide(0);

    function moveSlide(n) {
      showSlide(currentSlide + n);
    }
    let startX = 0;
    let endX = 0;
    slideCards.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });
    slideCards.addEventListener('touchmove', (e) => {
      endX = e.touches[0].clientX;
    });
    slideCards.addEventListener('touchend', () => {
      if (startX - endX > 50) {
        moveSlide(1); // swipe left, move to next slide
      } else if (endX - startX > 50) {
        moveSlide(-1); // swipe right, move to previous slide
      }
    });
  }
  // Function to remove mobile view handlers
  function removeMobileView() {
    // Remove buttons and other elements added for mobile view
    const buttonDiv = document.querySelector('.btn-container');
    if (buttonDiv) {
      buttonDiv.remove();
    }
    // Remove added classes and event listeners if needed
    const slideCards = document.querySelector('.career-value-cards');
    if (slideCards) {
      slideCards.removeEventListener('touchstart', () => { });
      slideCards.removeEventListener('touchmove', () => { });
      slideCards.removeEventListener('touchend', () => { });
    }
    const blockChildren = block.querySelectorAll('.career-child-cards');
    blockChildren.forEach((child) => {
      child.classList.remove('hidecards');
    });
  }
  function handleResize() {
    if (document.documentElement.clientWidth <= 767) {
      removeMobileView();
      handleMobileView();
    } else {
      removeMobileView();
      // Ensure all cards are visible in desktop mode
      const blockChildren = block.querySelectorAll('.career-inner-child-cards');
      blockChildren.forEach((child) => {
        child.classList.remove('hidecards');
      });
    }
  }
  // Add classes to block and its children
  const blockDiv = block.children;
  for (let i = 0; i < blockDiv.length; i += 1) {
    const childDiv = blockDiv[i];
    childDiv.classList.add('career-child-cards');
    if (childDiv.children) {
      const innerChildDiv = childDiv.children;
      for (let j = 0; j < innerChildDiv.length; j += 1) {
        innerChildDiv[j].classList.add('career-inner-child-cards');
      }
    }
  }
  // Initial check
  handleResize();
  // Listen for resize events
  window.addEventListener('resize', handleResize);
}
