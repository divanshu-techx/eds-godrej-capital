export default async function decorate(block) {
  console.log(block);
 
  // Select the parent container
  const carouselContainer = document.querySelector('.clientreviewcarousel');
 
  if (!carouselContainer) {
    console.error('Carousel container not found');
    return;
  }
 
  // Get all review divs
  const reviews = Array.from(carouselContainer.children);
 
  // Create a new div element instead of ul
  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper'); // Add Swiper wrapper class
 
  // Loop through each review
  reviews.forEach((review, index) => {
    // Create a new div for each review instead of li
    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide'); // Add Swiper slide class
 
    // Extract picture and other divs
    const picture = review.querySelector('picture');
    const nameLocationDiv = review.querySelector('div:nth-child(2)'); // Assuming this is the element containing name and location
    const descriptionDiv = review.querySelector('div:nth-child(3)'); // Assuming this is the element containing description
 
    // Create container divs
    const pictureContainer = document.createElement('div');
    pictureContainer.classList.add('picture-nameplace-container');
    pictureContainer.appendChild(picture);
 
    // Append name and location to pictureContainer
    if (nameLocationDiv) {
      pictureContainer.appendChild(nameLocationDiv);
    }
 
    // Create info container div
    const infoContainer = document.createElement('div');
    infoContainer.classList.add('info-container');
 
    // Append description to infoContainer
    if (descriptionDiv) {
      infoContainer.appendChild(descriptionDiv);
    }
 
    // Append pictureContainer and infoContainer to swiperSlide
    swiperSlide.appendChild(pictureContainer);
    swiperSlide.appendChild(infoContainer);
 
    // Append swiperSlide to swiperWrapper
    swiperWrapper.appendChild(swiperSlide);
  });
 
  // Clear the original container and append the swiperWrapper
  carouselContainer.innerHTML = '';
  carouselContainer.appendChild(swiperWrapper);
 
  // Create navigation buttons container
  const navigationContainer = document.createElement('div');
  navigationContainer.classList.add('swiper-navigation');
  navigationContainer.innerHTML = `
  <div class="swiper-pagination"></div> 
  <div class="buttonControls">
    <button class="swiper-button-prev" tabindex="0" aria-label="Previous slide">
    </button>
    <button class="swiper-button-next" tabindex="0" aria-label="Next slide">
    </button>
  </div>
  `;
  carouselContainer.appendChild(navigationContainer);

  function addLeadingZero(num) {
    return num.toString().padStart(2, '0');
  }

  // Initialize Swiper after modifying the HTML structure
  const swiper = new Swiper('.clientreviewcarousel', {
    slidesPerView: 1,
    spaceBetween: 10,
    // loop: true,
    // centeredSlides: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: true
    },
    pagination: {
      el: '.swiper-pagination',
      type: "custom",
      renderCustom: function (swiper, current, total) {
        return `<span class="swiper-pagination-current">${addLeadingZero(current)}</span> / <span class="swiper-pagination-total">${addLeadingZero(total)}</span>`;
      }
    },
    navigation: {
      nextEl: '.swiper-button-prev',
      prevEl: '.swiper-button-next',
    },
    breakpoints: {
      768: {
        slidesPerView: 2.2,
        spaceBetween: 10, 
      }
    }
  })
  swiper.on('slideChange', function () {
    document.querySelector('.swiper-button-prev').setAttribute('aria-disabled', swiper.isBeginning ? 'true' : 'false');
    document.querySelector('.swiper-button-next').setAttribute('aria-disabled', swiper.isEnd ? 'true' : 'false');
  });

  // Initial button state update
  document.querySelector('.swiper-button-prev').setAttribute('aria-disabled', swiper.isBeginning ? 'true' : 'false');
  document.querySelector('.swiper-button-next').setAttribute('aria-disabled', swiper.isEnd ? 'true' : 'false');
}