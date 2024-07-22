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
  
  export default async function decorate(block) {
    prepareBackgroundImage(block);
    const headings = block.querySelectorAll("h1, h2, h3, h4, h5, h6");
  
    [...headings].forEach((heading) => heading.classList.add("banner__title"));
  
    block.parentElement.classList.add("under-1200px-width");
  
    const contentElWrapper = block.querySelector(":scope > div");
    contentElWrapper.classList.add("overlayteaser-banner__content-wrapper");
    const contentEl = block.querySelector(":scope > div > div");
    contentEl.classList.add("overlayteaser-banner__content");
  }
  