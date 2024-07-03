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
  <div class="buttonControls">
    <button class="swiper-button-prev" tabindex="0" aria-label="Previous slide">
    
    </button>
    <span class="swiper-pagination"></span> <!-- Container for pagination -->
    <button class="swiper-button-next" tabindex="0" aria-label="Next slide">
    
    </button>
  </div>
  `;
  carouselContainer.appendChild(navigationContainer);
 
  // Initialize Swiper after modifying the HTML structure
  const swiper = new Swiper('.clientreviewcarousel', {
    slidesPerView: 9, // Show one slide at a time
    loop: true, // Enable continuous loop
    pagination: {
      el: '.swiper-pagination',
      type: 'custom', // Use custom type for pagination
      renderCustom: function (swiper, current, total) {
        return `<span>${current}</span> / <span>${total}</span>`; // Custom rendering of current / total
      },
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    on: {
      init: function () {
        updateSlideDimensions(this);
      },
      slideChange: function () {
        updateSlideDimensions(this);
      },
    },
  });
 
  // Function to update slide dimensions
  function updateSlideDimensions(swiper) {
    const slides = document.querySelectorAll('.swiper-slide');
    slides.forEach((slide, index) => {
      if (index === swiper.activeIndex + 1) {
        slide.classList.add('active-dimension');
      } else {
        slide.classList.remove('active-dimension');
      }
    });
  }
}