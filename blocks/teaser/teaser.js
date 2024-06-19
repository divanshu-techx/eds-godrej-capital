export default async function decorate(block) {
  const teaserContainer = block.closest('.teaser-container');

  if (teaserContainer) {
    applyInitialStyles(teaserContainer);
    applyTextAlignmentAndPlacement(teaserContainer);
    convertAnchorsToButtons(block);
    hideSpecifiedButtons(teaserContainer);
    handleBackgroundStyle(teaserContainer, block);
    hidePictures(block);
    showContainer(teaserContainer);
  }
}

const applyInitialStyles = (container) => {
  const mobileAlignment = container.getAttribute("data-mobile-alignment");
  const desktopAlignment = container.getAttribute(
    "data-desktop-text-alignment"
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
    "data-desktop-text-alignment"
  );
  const desktopTextPlacement = container.getAttribute(
    "data-desktop-text-placement"
  );

  const wrapper = container.querySelector('.teaser-wrapper');

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
  const paragraphs = block.querySelectorAll("p");

  paragraphs.forEach((paragraph) => {
    convertAnchorToButton(paragraph, "strong a", "primary-button");
    convertAnchorToButton(paragraph, "em a", "secondary-button");
  });
};

const convertAnchorToButton = (parent, selector, buttonClass) => {
  const element = parent.querySelector(selector);
  if (element) {
    const anchor = element.closest("a");
    const button = createButton(anchor.innerText, anchor.href, buttonClass);
    anchor.replaceWith(button);
  }
};

const createButton = (text, href, className) => {
  const button = document.createElement("button");
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
      const buttonSelector =
        buttonType === 'primary' ? '.primary-button' : '.secondary-button';
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
    const applyBackgroundImage = () => {
      container.style.backgroundImage = `url(${
        window.innerWidth < 600 ? mobileImageSrc : desktopImageSrc
      })`;
    };
    applyBackgroundImage();
    window.addEventListener('resize', applyBackgroundImage);
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
  if (mp4VideoUrl) {
    createVideoPopup(container, mp4VideoUrl, true);
  } else if (videoUrl) {
    createVideoPopup(container, videoUrl, false);
  }

  if (!mp4VideoUrl) {
    const pictures = container.querySelectorAll('picture img');
    if (pictures.length > 0) {
      let imageUrl =
        window.innerWidth < 600 ? pictures[1].src : pictures[0].src;
      createImageBackground(container, imageUrl);
    }
  }
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