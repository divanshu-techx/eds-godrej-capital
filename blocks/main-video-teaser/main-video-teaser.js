
const MEDIA_BREAKPOINTS = {
  MOBILE: "MOBILE",
  TABLET: "TABLET",
  DESKTOP: "DESKTOP",
};
//Main Function
export default async function decorate(block) {
  prepareBackgroundImage(block);

  const headings = block.querySelectorAll("h1, h2, h3, h4, h5, h6");
  headings.forEach((heading) => heading.classList.add("banner__title"));

  block.parentElement.classList.add("full-width");

  const contentElWrapper = block.querySelector(":scope > div");
  contentElWrapper.classList.add("mainteaservideo-banner__content-wrapper");
  const contentEl = block.querySelector(":scope > div > div");
  contentEl.classList.add("mainteaservideo-banner__content");

  let mainEle = document.querySelectorAll('.main-video-teaser p picture');

  let playBtn = mainEle[0].parentElement;
  let pauseBtn = mainEle[1].parentElement;
  pauseBtn.style.display = 'none';

  const clickableElements = block.querySelectorAll('.button, a');
  let clickableElement = clickableElements[0];
  let linkUrl = clickableElement.href;
  let pictureElement = playBtn.querySelector('picture');

  let newAnchor = document.createElement('a');
  newAnchor.href = linkUrl;
  newAnchor.title = 'Play Video';


  // insert link in play image also 
  if (linkUrl && pictureElement) {
    let imgElement = pictureElement.querySelector('img');

    if (imgElement) {
      let newAnchor = document.createElement('a');
      newAnchor.href = linkUrl;
      newAnchor.title = 'Play Video';

      console.log(imgElement.parentNode);

      imgElement.parentNode.insertBefore(newAnchor, imgElement);
      newAnchor.appendChild(imgElement);
    }
  }



  const clickable = block.querySelectorAll('.button, a');

  clickable.forEach(el => {
    el.addEventListener('click', function (event) {
      event.preventDefault();

      const videoUrl = el.getAttribute('href');

      const isBackgroundVideo = el.classList.contains('video-bg') || el.closest('.video-bg');
      const parent = el.parentNode;




      // Extract the text content from the anchor tag
      const textContent = el.textContent;

      if (isBackgroundVideo) {
        if (videoUrl) {
          let mainTeaser = document.querySelector('.main-video-teaser');
          let existingVideo = mainTeaser.querySelector('.video-bg');
          if (existingVideo) {
            existingVideo.remove();
          }

          if (isYouTubeURL(videoUrl)) {
            let frame = document.createElement('iframe');
            frame.src = getYouTubeEmbedURL(videoUrl);
            frame.style.position = 'absolute';
            frame.style.width = '100%';
            frame.style.height = '100%';
            frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            frame.allowFullscreen = true;
            frame.loop = true;
            frame.autoplay = true;
            mainTeaser.appendChild(frame);
            playBtn.style.display = 'none';
            pauseBtn.style.display = 'none';
          } else {
            let backgroundVideo = document.createElement('video');
            backgroundVideo.className = 'video-bg';
            backgroundVideo.muted = true;

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

            playBtn.addEventListener('click', () => {
              backgroundVideo.play();
              playBtn.style.display = 'none';
              pauseBtn.style.display = 'block';
            });

            pauseBtn.addEventListener('click', () => {
              backgroundVideo.pause();
              playBtn.style.display = 'block';
              pauseBtn.style.display = 'none';
            });
          }
        }
         // Remove links from both image and text content
      const links = block.querySelectorAll('a');
      links.forEach(link => {
        const parent = link.parentNode;
        while (link.firstChild) {
          parent.insertBefore(link.firstChild, link);
        }
        parent.removeChild(link);
      });

      } else {
        // call to their model for pop up mode
        if (videoUrl) {
          if (isYouTubeURL(videoUrl)) {
            youtubeModel(videoUrl);
          } else {
            createModal(videoUrl);
          }
        }
      }
    });
  });
}



function getImageForBreakpoint(imagesList, onChange = () => { }) {
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
//function to identify youtube link
function isYouTubeURL(url) {
  const youtubePattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/(?:embed\/|v\/|watch\?v=)|youtu\.be\/)[\w-]+/;
  return youtubePattern.test(url);
}
//function to convert youtube link to embed form
function getYouTubeEmbedURL(url) {
  const urlObj = new URL(url);
  let videoId = '';

  if (urlObj.hostname === 'youtube.com') {
    const params = new URLSearchParams(urlObj.search);
    videoId = params.get('v');
  } else if (urlObj.hostname === 'youtu.be') {
    videoId = urlObj.pathname.substring(1);
  }

  return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
}
//Video Modal for Mp4 video and other 
function createModal(videoUrl) {
  let existingModal = document.querySelector('.custom-video-modal');
  if (existingModal) {
    existingModal.remove();
  }

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


  const videoSource = document.getElementById("videoSource");

  const modal = document.getElementById("customVideoModal");
  const span = modal.querySelector(".custom-video-modal-close");
  const videoPlayer = document.getElementById("videoPlayer");

  videoSource.src = videoUrl;
  modal.style.display = "block";
  videoPlayer.load();

  span.onclick = function () {
    modal.style.display = "none";
    videoPlayer.pause();
    videoPlayer.src = "";
  }

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
      videoPlayer.pause();
      videoPlayer.src = "";
    }
  }
}
//Video Model for YouTube Video
function youtubeModel(videoUrl) {
  if (!isYouTubeURL(videoUrl)) {
    console.error('Invalid YouTube URL');
    return;
  }

  const embedUrl = getYouTubeEmbedURL(videoUrl);

  // Remove any existing YouTube modal
  let existingModal = document.querySelector('.youtube-modal');
  if (existingModal) {
    existingModal.remove();
  }

  // Modal HTML
  const modalHtml = `
    <div id="youtubeModal" class="youtube-modal">
      <div class="youtube-modal-content">
        <span class="youtube-modal-close">&times;</span>
        <div class="youtube-video-container">
          <iframe src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      </div>
    </div>
  `;

  // Append modal HTML to the body
  const modalDiv = document.createElement('div');
  modalDiv.innerHTML = modalHtml;
  document.body.appendChild(modalDiv);

  const modal = document.getElementById("youtubeModal");
  const closeBtn = modal.querySelector(".youtube-modal-close");

  // Show the modal
  modal.style.display = "block";

  // Close modal on close button click
  closeBtn.onclick = function () {
    modal.style.display = "none";
  }

  // Close modal on clicking outside of the content area
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}
