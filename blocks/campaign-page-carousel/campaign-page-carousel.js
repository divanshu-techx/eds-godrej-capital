function startTimer(block) {
    return setInterval(() => {
      const rightSwip = block.querySelector('.swip-right');
      rightSwip.click();
    }, 5000);
  }
  
  let timer;
  
  function commonOnClick(block, newIndex) {
    const activeEles = block.querySelectorAll('.active');
    const newEles = block.querySelectorAll(`[index='${newIndex}']`);
    const swiperWrapper = block.querySelector('.swiper-wrapper');
    let activeEleWidth = null;
  
    newEles.forEach((newEle) => {
      newEle.classList.add('active');
      if (!newEle.classList.contains('swiper-pagination-bullet')) {
        newEle.classList.add('unhide');
      }
    });
  
    activeEles.forEach((activeEle) => {
      activeEle.classList.remove('active');
      if (!activeEle.classList.contains('swiper-pagination-bullet')) {
        activeEle.classList.remove('unhide');
        if (activeEle.classList.contains('carousel-item')) {
          activeEleWidth = activeEle.clientWidth;
        }
      }
    });
  
    if (window.screen.width >= 992 && activeEleWidth) {
      swiperWrapper.style.transform = `translate3d(-${
        newIndex * activeEleWidth
      }px, 0, 0)`;
    } else {
      swiperWrapper.style.transform = `translate3d(-${
        newIndex * window.screen.width
      }px, 0, 0)`;
    }
  }
  
  function getPrevOrNextSwip(swipType, block, totalLength) {
    const swip = document.createElement('div');
    swip.classList.add(`swip-${swipType}`);
  
    const prevSwipSpan = document.createElement('span');
    prevSwipSpan.classList.add('icon', `icon-${swipType}`);
  
    swip.appendChild(prevSwipSpan);
  
    swip.onclick = () => {
      const activeEles = block.querySelectorAll('.active');
      const activeEle = activeEles[0];
      if (activeEle) {
        const index = Number(activeEle.getAttribute('index'));
        let newIndex = index + 1 >= totalLength ? 0 : index + 1;
        if (swipType === 'left') {
          newIndex = index - 1 < 0 ? totalLength - 1 : index - 1;
        }
        commonOnClick(block, newIndex);
        clearInterval(timer);
        timer = startTimer(block);
      }
    };
  
    return swip;
  }
  
  function getCarouselControl(block, totalLength) {
    const controlContainer = document.createElement('div');
    controlContainer.classList.add('control-container');
  
    const pagination = document.createElement('div');
    pagination.classList.add(
      'swip-pagination',
      'swiper-pagination-clickable',
      'swiper-pagination-bullets',
    );
  
    for (let index = 0; index < totalLength; index += 1) {
      const innerSpan = document.createElement('span');
      innerSpan.classList.add('swiper-pagination-bullet');
      innerSpan.setAttribute('index', index);
  
      innerSpan.onclick = () => {
        const isActive = innerSpan.classList.contains('active');
        if (!isActive) {
          commonOnClick(block, Number(innerSpan.getAttribute('index')));
          clearInterval(timer);
          timer = startTimer(block);
        }
      };
  
      if (index === 0) {
        innerSpan.classList.add('active');
      }
  
      pagination.appendChild(innerSpan);
    }
  
    controlContainer.appendChild(getPrevOrNextSwip('left', block, totalLength));
    controlContainer.appendChild(pagination);
    controlContainer.appendChild(getPrevOrNextSwip('right', block, totalLength));
  
    const heroContainer = document.createElement('div');
    heroContainer.classList.add('hero-slider-controller');
    heroContainer.appendChild(controlContainer);
  
    block.appendChild(heroContainer);
  }
  
  function addSwipeCapability(block) {
    let touchStartX = 0;
    let touchStartY = 0;
  
    block.addEventListener(
      'touchstart',
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
      },
      { passive: true },
    );
  
    block.addEventListener(
      'touchend',
      (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
  
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          return;
        }
  
        if (deltaX > 0) {
          const leftSwip = block.querySelector('.swip-left');
          leftSwip.click();
        } else if (deltaX < 0) {
          const rightSwip = block.querySelector('.swip-right');
          rightSwip.click();
        }
      },
      { passive: true },
    );
  }
  
  export default async function decorate(block) {
    const blockChildren = [...block.children];
    const totalLength = blockChildren.length;
  
    const swiperWrapper = document.createElement('div');
    swiperWrapper.classList.add('swiper-wrapper');
  
    blockChildren.forEach((element, index) => {
      const innerChilds = [...element.children];
      const carouselItem = document.createElement('div');
      carouselItem.classList.add('carousel-item');
      carouselItem.setAttribute('index', index);
  
      if (index === 0) {
        carouselItem.classList.add('active', 'unhide');
        innerChilds[0].classList.add('active', 'unhide');
        innerChilds[1].classList.add('active', 'unhide');
      }
  
      innerChilds[0].classList.add('text-item');
      innerChilds[1].classList.add('image-item');
  
      carouselItem.appendChild(innerChilds[1]); // Image first
      carouselItem.appendChild(innerChilds[0]); // Text overlay
  
      swiperWrapper.appendChild(carouselItem);
    });
  
    const container = document.createElement('div');
    container.classList.add('carousel-items-container');
  
    block.innerHTML = '';
  
    container.appendChild(swiperWrapper);
    block.appendChild(container);
  
    getCarouselControl(block, totalLength);
    timer = startTimer(block);
    addSwipeCapability(block);
  }
  