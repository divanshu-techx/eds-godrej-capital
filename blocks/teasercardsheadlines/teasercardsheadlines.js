
function decorate(block) {
  const pictureDivs = block.querySelectorAll(".teasercardsheadlines.block > div:first-child > div");

  if (pictureDivs.length > 0) {
    if (pictureDivs.length >= 1) {
      pictureDivs[0].classList.add("desktop-picture");
    }
    if (pictureDivs.length >= 2) {
      pictureDivs[1].classList.add("mobile-picture");
    }
  }

  const teaserContentDiv = block.querySelector('.teasercardsheadlines.block > div:last-child > div');

  if (teaserContentDiv) {
    teaserContentDiv.classList.add("teaser-content");
  }
}

const blockElement = document.querySelector(".teasercardsheadlines.block");

decorate(blockElement);
