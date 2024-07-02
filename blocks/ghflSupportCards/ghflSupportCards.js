 function getIndex(n) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  // Function to get indexed child names and set class with numbering
 function getIndexedChildNames(parentId) {
    const newParentId = `.${parentId}`;
    const parentElement = document.querySelector(newParentId);

    if (!parentElement) {
      return;
    }

    const childDivs = parentElement.querySelectorAll(`${newParentId} > div`);

    childDivs.forEach((div, index) => {
      const lastIndexed = getIndex(index + 1);
      div.className = `${parentId}-child-${lastIndexed}`;
    });
  }
 function getChildNames(parentId) {
    const newParentId = `.${parentId}`;
    const parentElement = document.querySelector(newParentId);
    const childDivs = parentElement.querySelectorAll(`${newParentId} > div`);
    childDivs.forEach((div) => {
      div.className = `${parentId}-child`;
    });
  }
  getChildNames('ghfl-cards');
  let element = document.querySelectorAll('.ghfl-cards-child')[1];
  element.classList.add('newDiv');
  let pictureElement = element.querySelector('picture');
  let img = pictureElement.querySelector('img').src;
  let ImgEle=  element.querySelectorAll('div')[1];
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
  console.log(element.querySelector('picture'))