// export default async function decorate(block) {
//   const teaserContainer = block.closest('.teaser-container');

//   if (teaserContainer) {
//     applyInitialStyles(teaserContainer);
//     applyTextAlignmentAndPlacement(teaserContainer);
//     convertAnchorsToButtons(block);
//     hideSpecifiedButtons(teaserContainer);
//     handleBackgroundStyle(teaserContainer, block);
//     hidePictures(block);
//     showContainer(teaserContainer);
//   }
// }

// const applyInitialStyles = (container) => {
//   const mobileAlignment = container.getAttribute("data-mobile-alignment");
//   const desktopAlignment = container.getAttribute(
//     "data-desktop-text-alignment"
//   );

//   const applyStyles = () => {
//     const isMobile = window.innerWidth < 600;
//     container.style.textAlign = isMobile ? mobileAlignment : desktopAlignment;
//   };

//   applyStyles();
//   window.addEventListener('resize', applyStyles);
// };

// const applyTextAlignmentAndPlacement = (container) => {
//   const desktopTextAlignment = container.getAttribute(
//     "data-desktop-text-alignment"
//   );
//   const desktopTextPlacement = container.getAttribute(
//     "data-desktop-text-placement"
//   );

//   const wrapper = container.querySelector('.teaser-wrapper');

//   wrapper.style.textAlign = desktopTextAlignment;

//   switch (desktopTextPlacement) {
//     case 'left':
//       wrapper.style.marginLeft = '20px';
//       wrapper.style.marginRight = 'auto';
//       break;
//     case 'right':
//       wrapper.style.marginLeft = 'auto';
//       wrapper.style.marginRight = '20px';
//       break;
//     case 'center':
//       wrapper.style.margin = '0 auto';
//       break;
//     default:
//       break;
//   }
// };

// const convertAnchorsToButtons = (block) => {
//   const paragraphs = block.querySelectorAll("p");

//   paragraphs.forEach((paragraph) => {
//     convertAnchorToButton(paragraph, "strong a", "primary-button");
//     convertAnchorToButton(paragraph, "em a", "secondary-button");
//   });
// };

// const convertAnchorToButton = (parent, selector, buttonClass) => {
//   const element = parent.querySelector(selector);
//   if (element) {
//     const anchor = element.closest("a");
//     const button = createButton(anchor.innerText, anchor.href, buttonClass);
//     anchor.replaceWith(button);
//   }
// };

// const createButton = (text, href, className) => {
//   const button = document.createElement("button");
//   button.innerText = text;
//   button.className = className;
//   button.onclick = () => {
//     window.location.href = href;
//   };
//   return button;
// };

// const hideSpecifiedButtons = (container) => {
//   const buttonsToHide = container.getAttribute('data-hide-button')?.split(' ');
//   if (buttonsToHide) {
//     buttonsToHide.forEach((buttonType) => {
//       const buttonSelector =
//         buttonType === 'primary' ? '.primary-button' : '.secondary-button';
//       const button = container.querySelector(buttonSelector);
//       if (button) {
//         button.style.display = 'none';
//       }
//     });
//   }
// };

// const handleBackgroundStyle = (container, block) => {
//   const backgroundStyle = container.getAttribute('data-background-style');
//   const teaserWrappers = container.querySelectorAll('.teaser-wrapper');
//   if (backgroundStyle === 'image') {
//     const pictures = container.querySelectorAll('picture');
//     let desktopImageSrc = '';
//     let mobileImageSrc = '';
//     pictures.forEach((picture, index) => {
//       const img = picture.querySelector('img');
//       if (img) {
//         console.log(`Picture ${index + 1} Image Source:`, img.src);
//         if (index === 0) {
//           desktopImageSrc = img.src;
//         } else if (index === 1) {
//           mobileImageSrc = img.src;
//         }
//       } else {
//         console.log(`Picture ${index + 1} Image Source: Not found`);
//       }
//     });
//     const applyBackgroundImage = () => {
//       container.style.backgroundImage = `url(${
//         window.innerWidth < 600 ? mobileImageSrc : desktopImageSrc
//       })`;
//     };
//     applyBackgroundImage();
//     window.addEventListener('resize', applyBackgroundImage);
//   }

//   const videoLinks = block.querySelectorAll('a[href]');
//   let videoUrl = '';
//   let mp4VideoUrl = '';

//   videoLinks.forEach((link) => {
//     const href = link.href;
//     console.log(href);
//     if (href.includes('youtube.com')) {
//       videoUrl = href;
//     } else if (href.match(/\.(mp4|webm|ogg)$/)) {
//       mp4VideoUrl = href;
//     }
//   });
//   if (mp4VideoUrl) {
//     createVideoPopup(container, mp4VideoUrl, true);
//   } else if (videoUrl) {
//     createVideoPopup(container, videoUrl, false);
//   }

//   if (!mp4VideoUrl) {
//     const pictures = container.querySelectorAll('picture img');
//     if (pictures.length > 0) {
//       let imageUrl =
//         window.innerWidth < 600 ? pictures[1].src : pictures[0].src;
//       createImageBackground(container, imageUrl);
//     }
//   }
// };

// const createVideoPopup = (container, videoUrl, isMp4) => {
//   const playButton = document.createElement('button');
//   playButton.className = 'play-button';
//   playButton.innerText = 'Play Video';
//   playButton.onclick = () => {
//     const popup = document.createElement('div');
//     popup.className = 'video-popup';
//     if (isMp4) {
//       const video = document.createElement('video');
//       video.setAttribute('controls', true);
//       const source = document.createElement('source');
//       source.src = videoUrl;
//       source.type = 'video/mp4';
//       video.style.maxWidth = '100%';
//       video.style.maxHeight = '100%';
//       video.appendChild(source);
//       popup.appendChild(video);
//     } else {
//       const iframe = document.createElement('iframe');
//       iframe.src = videoUrl.replace('watch?v=', 'embed/');
//       iframe.setAttribute('frameborder', '0');
//       iframe.setAttribute('allow', 'autoplay; encrypted-media');
//       iframe.setAttribute('allowfullscreen', 'true');
//       popup.appendChild(iframe);
//     }

//     const closeButton = document.createElement('button');
//     closeButton.className = 'close-button';
//     closeButton.innerText = 'Close';
//     closeButton.onclick = () => {
//       popup.remove();
//     };
//     popup.appendChild(closeButton);
//     document.body.appendChild(popup);
//   };
//   container.querySelector('.button-container').appendChild(playButton);
// };

// const createImageBackground = (container, imageUrl) => {
//   container.style.backgroundImage = `url(${imageUrl})`;
//   container.style.backgroundSize = '100% 100%';
//   container.style.backgroundPosition = 'center';
// };

// const hidePictures = (block) => {
//   const pictures = block.querySelectorAll('picture');
//   pictures.forEach((picture) => {
//     picture.style.display = 'none';
//   });
// };

// const showContainer = (container) => {
//   // container.style.display = 'block';
// };
export default async function decorate(block) {
  initializeCarousel(block);
}

let carouselId = 0;
function initializeCarousel(block) {
  carouselId += 1;
  const carouselContainer = block.closest('.carousel-v1-container');
  const targetId = carouselContainer.getAttribute('data-teaser-target-id');
  const isPagination = carouselContainer.getAttribute('data-pagination') === 'true';
  const slideChangeTime = parseInt(carouselContainer.getAttribute('data-timing'), 10) || 5000;

  const teaserContainers = document.querySelectorAll(`.teaser-container[data-teaser-target-id="${targetId}"]`);

  const mainElement = document.createElement('div');
  mainElement.classList.add('carousel-wrapper');
  mainElement.setAttribute('id', `carousel-v1-${carouselId}`);

  const isSingleSlide = teaserContainers.length < 2;

  // Append teaser containers to the main wrapper
  teaserContainers.forEach(teaser => {
    mainElement.appendChild(teaser);
  });
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'Carousel-v1');

  block.appendChild(mainElement);

  const container = document.createElement('div');
  container.classList.add('carousel-v1-slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('carousel-v1-slides');

  mainElement.prepend(slidesWrapper);

  let slideIndicators;
  if (!isSingleSlide && isPagination) {
    const slideIndicatorsNav = document.createElement('nav');
    slideIndicatorsNav.setAttribute('aria-label', 'Carousel Slide Controls');
    slideIndicators = document.createElement('ol');
    slideIndicators.classList.add('carousel-v1-slide-indicators');
    slideIndicatorsNav.append(slideIndicators);
    block.append(slideIndicatorsNav);

    const slideNavButtons = document.createElement('div');
    slideNavButtons.classList.add('carousel-v1-navigation-buttons');
    slideNavButtons.innerHTML = `
      <button type="button" class="slide-prev" aria-label="Previous Slide"></button>
      <button type="button" class="slide-next" aria-label="Next Slide"></button>
    `;

    container.append(slideNavButtons);
  }

  teaserContainers.forEach((row, idx) => {
    const slide = createSlide(row, idx, carouselId);
    slidesWrapper.append(slide);

    if (slideIndicators) {
      const indicator = document.createElement('li');
      indicator.classList.add('carousel-v1-slide-indicator');
      indicator.dataset.targetSlide = idx;
      indicator.innerHTML = `<button type="button"><span>Show Slide ${idx + 1} of ${teaserContainers.length}</span></button>`;
      slideIndicators.append(indicator);
    }
    row.remove();
  });
  container.append(slidesWrapper);
  block.prepend(container);

  if (!isSingleSlide) {
    bindEvents(block);
    setInterval(() => {
      const currentIndex = parseInt(block.dataset.activeSlide, 10) || 0;
      showSlide(block, currentIndex + 1);
    }, slideChangeTime);
  }
}

function createSlide(row, slideIndex, carouselId) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.setAttribute('id', `carousel-${carouselId}-slide-${slideIndex}`);
  slide.classList.add('carousel-v1-slide');

  row.querySelectorAll(':scope > div').forEach((column, colIdx) => {
    column.classList.add(`carousel-slide-v1-${colIdx === 0 ? 'image' : 'content'}`);
    slide.append(column);
  });

  const labeledBy = slide.querySelector('h1, h2, h3, h4, h5, h6');
  if (labeledBy) {
    slide.setAttribute('aria-labelledby', labeledBy.getAttribute('id'));
  }

  return slide;
}

function bindEvents(block) {
  const slideIndicators = block.querySelector('.carousel-v1-slide-indicators');
  if (slideIndicators) {
    slideIndicators.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', (e) => {
        const slideIndicator = e.currentTarget.parentElement;
        showSlide(block, parseInt(slideIndicator.dataset.targetSlide, 10));
      });
    });
  }

  block.querySelector('.slide-prev').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) - 1);
  });
  block.querySelector('.slide-next').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) + 1);
  });

  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) updateActiveSlide(entry.target);
    });
  }, { threshold: 0.5 });

  block.querySelectorAll('.carousel-v1-slide').forEach((slide) => {
    slideObserver.observe(slide);
  });
}

function showSlide(block, slideIndex = 0) {
  const slides = block.querySelectorAll('.carousel-v1-slide');
  let realSlideIndex = slideIndex < 0 ? slides.length - 1 : slideIndex;
  if (slideIndex >= slides.length) realSlideIndex = 0;
  const activeSlide = slides[realSlideIndex];

  block.querySelectorAll('.carousel-v1-slide-indicators li').forEach((indicator, index) => {
    indicator.classList.toggle('active', index === realSlideIndex);
  });

  block.querySelector('.carousel-v1-slides-container').style.transform = `translateX(-${realSlideIndex * 100}%)`;
  block.dataset.activeSlide = realSlideIndex;
}

function updateActiveSlide(slide) {
  const block = slide.closest('.carousel-v1');
  const slideIndex = parseInt(slide.dataset.slideIndex, 10);
  block.dataset.activeSlide = slideIndex;

  const slides = block.querySelectorAll('.carousel-slide-v1');

  slides.forEach((aSlide, idx) => {
    aSlide.setAttribute('aria-hidden', idx !== slideIndex);
    aSlide.querySelectorAll('a').forEach((link) => {
      if (idx !== slideIndex) {
        link.setAttribute('tabindex', '-1');
      } else {
        link.removeAttribute('tabindex');
      }
    });
  });
}