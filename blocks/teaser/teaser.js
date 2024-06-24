import { div } from "../utils/dom-helper.js";
export default async function decorate(block) {
  const teaserContainer = block.closest('.teaser-container');

  if (teaserContainer) {
    createTeaser(teaserContainer);
    //applyInitialStyles(teaserContainer);
    applyTextAlignmentAndPlacement(teaserContainer);
   // convertAnchorsToButtons(block);
    hideSpecifiedButtons(teaserContainer);

    handleBackgroundStyle(teaserContainer, block);
    // hidePictures(block);
    // showContainer(teaserContainer);
    triggerCustomEvent();
  }
}

function triggerCustomEvent() {
  // Create the custom event
  const customEvent = new CustomEvent("allMethodsCompleted", {
    detail: {
      message: "All methods completed",
      timestamp: new Date()
    }
  });

  // Dispatch the custom event on the document
  document.dispatchEvent(customEvent);
}

/**
 * Transforms the HTML structure by:
 * 1. Removing the `teaser-wrapper` and moving its child `teaser` element up.
 * 2. Creating separate containers for image elements and text content inside the `teaser` element.
 */
function createTeaser(teaserContainer){
    // Select the teaser-wrapper element
    const teaserWrapper = teaserContainer.querySelector(".teaser-wrapper");
    if (!teaserWrapper) return;

    // Select the teaser element inside teaser-wrapper
    const teaser = teaserWrapper.querySelector(".teaser");
    if (!teaser) return;

    // Add the teaser-wrapper class to the teaser element
    teaser.classList.add("teaser-wrapper");

    // Move the teaser element out of the teaser-wrapper
    teaserWrapper.parentNode.insertBefore(teaser, teaserWrapper);

    // Remove the teaser-wrapper element
    teaserWrapper.remove();

    // Create new structure elements using domEl
    const carouselSlideImage = div({ class: "carousel-slide-image" });
    const carouselSlideContent = div({ class: "carousel-slide-content" });

    // Move image elements to carousel-slide-image
    const images = teaser.querySelectorAll("picture");
    images.forEach(image => {
        const imageWrapper = div(image);
        carouselSlideImage.appendChild(imageWrapper);
    });

    // Move text content to carousel-slide-content
    const paragraphs = teaser.querySelectorAll("p");
    paragraphs.forEach(paragraph => {
        carouselSlideContent.appendChild(paragraph);
    });

    // Clear the teaser's children and append the new structure
    teaser.innerHTML = '';
    teaser.appendChild(carouselSlideImage);
    teaser.appendChild(carouselSlideContent);
}


const applyInitialStyles = (container) => {
  const mobileAlignment = container.getAttribute('data-mobile-alignment');
  const desktopAlignment = container.getAttribute(
    'data-desktop-text-alignment'
  );

  const applyStyles = () => {
    const isMobile = window.innerWidth < 600;
    container.style.textAlign = isMobile ? mobileAlignment : desktopAlignment;
  };

  applyStyles();
  window.addEventListener('resize', applyStyles);
};

const applyTextAlignmentAndPlacement = (container) => {
  const desktopTextAlignment = container.getAttribute(
    'data-desktop-text-alignment'
  );
  const desktopTextPlacement = container.getAttribute(
    'data-desktop-text-placement'
  );

  const wrapper = container.querySelector('.teaser-wrapper .carousel-slide-content');

  wrapper.style.textAlign = desktopTextAlignment;

  switch (desktopTextPlacement) {
    case 'left':
      wrapper.style.marginLeft = '20px';
      wrapper.style.marginRight = 'auto';
      break;
    case 'right':
      wrapper.style.marginLeft = 'auto';
      wrapper.style.marginRight = '20px';
      break;
    case 'center':
      wrapper.style.margin = '0 auto';
      break;
    default:
      break;
  }
};

const convertAnchorsToButtons = (block) => {
  const paragraphs = block.querySelectorAll('p');

  paragraphs.forEach((paragraph) => {
    convertAnchorToButton(paragraph, 'strong a', 'primary-button');
    convertAnchorToButton(paragraph, 'a', 'primary-button');
    convertAnchorToButton(paragraph, 'em a', 'secondary-button');
  });
};

const convertAnchorToButton = (parent, selector, buttonClass) => {
  const element = parent.querySelector(selector);
  if (element) {
    const anchor = element.closest('a');
    const button = createButton(anchor.innerText, anchor.href, buttonClass);
    anchor.replaceWith(button);
  }
};

const createButton = (text, href, className) => {
  const button = document.createElement('button');
  button.innerText = text;
  button.className = className;
  button.onclick = () => {
    window.location.href = href;
  };
  return button;
};

const hideSpecifiedButtons = (container) => {
  const buttonsToHide = container.getAttribute('data-hide-button')?.split(' ');
 
  if (buttonsToHide) {
    buttonsToHide.forEach((buttonType) => {
      const buttonSelector
       = buttonType === 'primary' ? '.primary-button' : '.secondary-button';
      const button = container.querySelector(buttonSelector);
      if (button) {
        button.style.display = 'none';
      }
    });
  }
};

const handleBackgroundStyle = (container, block) => {
  const backgroundStyle = container.getAttribute('data-background-style');
  const teaserWrappers = container.querySelectorAll('.teaser-wrapper');

  if (backgroundStyle === 'image') {
    const pictures = container.querySelectorAll('picture');
    let desktopImageSrc = '';
    let mobileImageSrc = '';
    pictures.forEach((picture, index) => {
      const img = picture.querySelector('img');
      if (img) {
        if (index === 0) {
          desktopImageSrc = img.src;
        } else if (index === 1) {
          mobileImageSrc = img.src;
        }
      }
    });
    // const applyBackgroundImage = () => {
    //   container.style.backgroundImage = `url(${
    //     window.innerWidth < 600 ? mobileImageSrc : desktopImageSrc
    //   })`;
    // };
    // applyBackgroundImage();
    // window.addEventListener('resize', applyBackgroundImage);
  }

 

  const videoLinks = block.querySelectorAll('a[href]');
  
  let videoUrl = '';
  let mp4VideoUrl = '';

  videoLinks.forEach((link) => {
    const href = link.href;
    if (href.includes('youtube.com')) {
      videoUrl = href;
    } else if (href.match(/\.(mp4|webm|ogg)$/)) {
      mp4VideoUrl = href;
    }
  });
  if (backgroundStyle === "video") {
   
    createInlineVideoPlayer(container, mp4VideoUrl);
  } else if (videoUrl) {
   
    createVideoPopup(container, videoUrl, false);
  }

  // if (!mp4VideoUrl) {
  //   const pictures = container.querySelectorAll('picture img');
  //   if (pictures.length > 0) {
  //     let imageUrl
  //      = window.innerWidth < 600 ? pictures[1].src : pictures[0].src;
  //     //createImageBackground(container, imageUrl);
  //   }
  // }
};

const createVideoPopup = (container, videoUrl, isMp4) => {
  const playButton = document.createElement('button');
  playButton.className = 'play-button';
  playButton.innerText = 'Play Video';
  playButton.onclick = () => {
    const popup = document.createElement('div');
    popup.className = 'video-popup';
    if (isMp4) {
      const video = document.createElement('video');
      video.setAttribute('controls', true);
      const source = document.createElement('source');
      source.src = videoUrl;
      source.type = 'video/mp4';
      video.style.maxWidth = '100%';
      video.style.maxHeight = '100%';
      video.appendChild(source);
      popup.appendChild(video);
    } else {
      const iframe = document.createElement('iframe');
      iframe.src = videoUrl.replace('watch?v=', 'embed/');
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allow', 'autoplay; encrypted-media');
      iframe.setAttribute('allowfullscreen', 'true');
      popup.appendChild(iframe);
    }

    const closeButton = document.createElement('button');
    closeButton.className = 'close-button';
    closeButton.innerText = 'Close';
    closeButton.onclick = () => {
      popup.remove();
    };
    popup.appendChild(closeButton);
    document.body.appendChild(popup);
  };
  container.querySelector('.button-container').appendChild(playButton);
};


// Function to find carousel-slide-image div inside a container
const findCarouselSlideImage = (container) => {
  const children = container.children;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    // Check if the child has a picture element inside
    const pictureElement = child.querySelector('picture');
    if (pictureElement) {
      return child; // Return the first div found with a picture element
    }
  }
  return null; // Return null if no suitable div is found
};


const createInlineVideoPlayer  = (container, videoUrl) => {
  const slideContent = container.querySelector('.carousel-slide-content');

  const carouselSlideImage = findCarouselSlideImage(container);
  
   // Step 1: Create and style the play button
   const playButton = document.createElement('button');
   playButton.className = 'play-button';
   playButton.innerText = '▶';
   playButton.style.position = 'absolute';
   playButton.style.top = '50%';
   playButton.style.left = '50%';
   playButton.style.transform = 'translate(-50%, -50%)';
   playButton.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
   playButton.style.color = 'white';
   playButton.style.border = 'none';
   playButton.style.borderRadius = '50%';
   playButton.style.padding = '10px 15px';
   playButton.style.fontSize = '24px';
   playButton.style.cursor = 'pointer';
   playButton.style.zIndex = '10'; // Ensure it's above the video
 
   // Ensure container is positioned relatively
   container.style.position = 'relative';
   container.style.display = 'flex';
   container.style.justifyContent = 'center';
   container.style.alignItems = 'center';
   
   // Add play button to the container
   slideContent.appendChild(playButton);
 
   // Step 2: Handle button click
   playButton.onclick = (event) => {
    const parentElement = event.target.parentNode;
    // Get the parent of the parent (container of carousel-slide-image)
    const grandparentElement = parentElement.parentNode;
    console.log('Grandparent element:', grandparentElement);

    // Find a div with class "image" inside grandparentElement
    const imageDiv = grandparentElement.querySelector('.carousel-slide-image div');

     // Remove the play button
     playButton.remove();
     const pictureElement = imageDiv.querySelector('picture');
     if (pictureElement) {
        // Hide the picture element
        pictureElement.style.display = 'none';
      }
     // Step 3: Add the video element
    
       const video = document.createElement('video');
       video.setAttribute('controls', true);
       video.src = videoUrl;
       video.style.width = '100%';
       video.style.height = '100%';
       video.style.objectFit = 'cover'; // Ensure video covers the container
       imageDiv.appendChild(video);
       video.play();
    
   };
};


const createImageBackground = (container, imageUrl) => {
  container.style.backgroundImage = `url(${imageUrl})`;
  container.style.backgroundSize = '100% 100%';
  container.style.backgroundPosition = 'center';
};

const hidePictures = (block) => {
  const pictures = block.querySelectorAll('picture');
  pictures.forEach((picture) => {
    picture.style.display = 'none';
  });
};

const showContainer = (container) => {
  container.style.display = 'block';
};
