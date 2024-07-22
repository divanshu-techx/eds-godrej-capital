
const MEDIA_BREAKPOINTS = {
  MOBILE: "MOBILE",
  TABLET: "TABLET",
  DESKTOP: "DESKTOP",
};

function getImageForBreakpoint(imagesList, onChange = () => {}) {
  const mobileMQ = window.matchMedia("(max-width: 743px)");
  const tabletMQ = window.matchMedia(
    "(min-width: 744px) and (max-width: 1199px)"
  );
  const desktopMQ = window.matchMedia("(min-width: 1200px)");

  const [mobilePic, tabletPic, desktopPic] =
    imagesList.querySelectorAll("picture");

  const onBreakpointChange = (mq, picture, breakpoint) => {
    if (mq.matches) {
      onChange(picture, breakpoint);
    }
  };
  const onMobileChange = (mq) =>
    onBreakpointChange(mq, mobilePic, MEDIA_BREAKPOINTS.MOBILE);
  const onTabletChange = (mq) =>
    onBreakpointChange(mq, tabletPic, MEDIA_BREAKPOINTS.TABLET);
  const onDesktopChange = (mq) =>
    onBreakpointChange(mq, desktopPic, MEDIA_BREAKPOINTS.DESKTOP);

  mobileMQ.addEventListener("change", onMobileChange);
  tabletMQ.addEventListener("change", onTabletChange);
  desktopMQ.addEventListener("change", onDesktopChange);

  if (mobileMQ.matches) {
    onMobileChange(mobileMQ);
    return;
  }

  if (tabletMQ.matches) {
    onTabletChange(tabletMQ);
    return;
  }
  onDesktopChange(desktopMQ);
}

function prepareBackgroundImage(block) {
  const onBackgroundImgChange = (imgEl, backgroundTarget, breakpoint) => {
    const backgroundPostionStyles = initBackgroundPosition(
      block.classList,
      breakpoint
    );
    const backgroundSrc = imgEl.currentSrc;
    backgroundTarget.style.backgroundImage = `url(${backgroundSrc})`;
    backgroundTarget.style.backgroundPosition = backgroundPostionStyles;
  };

  const onBreakpointChange = (pictureEl, breakpoint) => {
    const pictureClone = pictureEl.cloneNode(true);
    const img = pictureClone.querySelector("img");
    pictureClone.classList.add("v2-dlt__picture");

    block.append(pictureClone);

    if (img.currentSrc) {
      onBackgroundImgChange(img, block, breakpoint);
      pictureClone.remove();
    } else {
      img.addEventListener("load", () => {
        onBackgroundImgChange(img, block, breakpoint);
        pictureClone.remove();
      });
    }
  };

  const listOfPictures = block.querySelector("ul");
  // removing from DOM - prevent loading all of provided images
  listOfPictures.remove();
  getImageForBreakpoint(listOfPictures, onBreakpointChange);
}

function initBackgroundPosition(classList, breakpoint) {
  const classPrefixes = {
    [MEDIA_BREAKPOINTS.MOBILE]: "s",
    [MEDIA_BREAKPOINTS.TABLET]: "m",
    [MEDIA_BREAKPOINTS.DESKTOP]: "l",
  };
  const classPrefix = classPrefixes[breakpoint];
  const backgroudPositionClass = [...classList].find((item) =>
    item.startsWith(`bp-${classPrefix}-`)
  );
  let backgroundPositionValue = "unset";

  if (backgroudPositionClass) {
    let [, , xPosition, yPosition] = backgroudPositionClass.split("-");

    // workaround, '-' character classes are not supported
    // so for '-45px' we need to put 'm45px'
    xPosition = xPosition.replace("m", "-");
    yPosition = yPosition.replace("m", "-");

    backgroundPositionValue = `${xPosition} ${yPosition}`;
  }

  return backgroundPositionValue;
}

function createModal() {
  const modalHtml = `
    <div id="customVideoModal" class="custom-video-modal">
      <div class="custom-video-modal-content">
        <span class="custom-video-modal-close">&times;</span>
        <div class="custom-video-container">
          <video id="videoPlayer" controls autoplay name="media">
            <source id="videoSource" src="" type="video/mp4">
          </video>
        </div>
      </div>
    </div>
  `;

  const modalDiv = document.createElement('div');
  modalDiv.innerHTML = modalHtml;
  document.body.appendChild(modalDiv);

  const modal = document.getElementById("customVideoModal");
  const span = modal.querySelector(".custom-video-modal-close");
  const videoPlayer = document.getElementById("videoPlayer");

  span.onclick = function() {
    modal.style.display = "none";
    videoPlayer.pause();
    videoPlayer.src = "";
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
      videoPlayer.pause();
      videoPlayer.src = "";
    }
  }
}

export default async function decorate(block) {
  prepareBackgroundImage(block);

  const headings = block.querySelectorAll("h1, h2, h3, h4, h5, h6");
  headings.forEach((heading) => heading.classList.add("banner__title"));

  block.parentElement.classList.add("full-width");

  const contentElWrapper = block.querySelector(":scope > div");
  contentElWrapper.classList.add("mainteaservideo-banner__content-wrapper");
  const contentEl = block.querySelector(":scope > div > div");
  contentEl.classList.add("mainteaservideo-banner__content");

  // Create the modal
  createModal();

  // Video Modal Functionality
  const modal = document.getElementById("customVideoModal");
  const videoSource = document.getElementById("videoSource");

  // Use a more generic selector to handle both buttons and anchors
  const clickableElements = block.querySelectorAll('.button, a');

  clickableElements.forEach(el => {
    el.addEventListener('click', function(event) {
      event.preventDefault();

      // Get the video URL from the href attribute or data attribute
      const videoUrl = el.getAttribute('href');

      console.log('Clicked element:', el);
      console.log('Video URL:', videoUrl);

      // Check if the clicked element or its parent has the 'video-bg' class
      const isBackgroundVideo = el.classList.contains('video-bg') || el.closest('.video-bg');
      console.log('Is background video:', isBackgroundVideo);

      if (isBackgroundVideo) {
        if (videoUrl) {
          console.log('Setting background video source');
          
          let mainTeaser = document.querySelector('.main-video-teaser');
          console.log(mainTeaser);

          // Remove any existing background video
          let existingVideo = mainTeaser.querySelector('.video-bg');
          if (existingVideo) {
            existingVideo.remove();
          }

          // Create and insert a new video element
          let backgroundVideo = document.createElement('video');
          backgroundVideo.className = 'video-bg';
          backgroundVideo.muted = true;
          backgroundVideo.loop = true;
          backgroundVideo.autoplay = true;

          let videoSourceElement = document.createElement('source');
          videoSourceElement.src = videoUrl;
          videoSourceElement.type = 'video/mp4';
          backgroundVideo.appendChild(videoSourceElement);

          mainTeaser.appendChild(backgroundVideo);

          backgroundVideo.load();
          backgroundVideo.play().catch(error => console.error('Error playing background video:', error));
          backgroundVideo.style.position = 'absolute';
          backgroundVideo.style.top = '0';
          backgroundVideo.style.left = '0';
          backgroundVideo.style.width = '100%';
          backgroundVideo.style.height = '100%';
          backgroundVideo.style.objectFit = 'cover';
        }
      } else {
        if (videoUrl) {
          console.log('Setting modal video source');
          videoSource.src = videoUrl;
          modal.style.display = "block";
          const videoPlayer = document.getElementById("videoPlayer");
          videoPlayer.load();
        }
      }
    });
  });
}


