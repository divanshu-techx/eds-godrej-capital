function getChildNames(parentId) {
  const newParentId = `.${parentId}`;
  const parentElement = document.querySelector(newParentId);
  const childDivs = parentElement.querySelectorAll(`${newParentId} > div`);
  childDivs.forEach((div) => {
    div.className = `${parentId}-child`;
  });
}
getChildNames('ghfl-cards');
const element = document.querySelectorAll('.ghfl-cards-child')[1];
element.classList.add('newDiv');
const pictureElement = element.querySelector('picture');
const img = pictureElement.querySelector('img').src;
const ImgEle = element.querySelectorAll('div')[1];
ImgEle.style.backgroundImage = `url(${img})`;
ImgEle.style.width = '317px';
ImgEle.style.height = '281px';
ImgEle.style.backgroundSize = 'cover';
ImgEle.style.marginLeft = '-25px';
ImgEle.style.marginTop = '-35px';
ImgEle.style.borderRadius = '10px';
ImgEle.style.backgroundRepeat = 'no-repeat';
ImgEle.style.backgroundPosition = 'center center';
ImgEle.parentElement.style.overflow = 'hidden';

element.removeChild(element.firstElementChild);
console.log(element.querySelector('picture'));
