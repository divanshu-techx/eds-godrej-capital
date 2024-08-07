function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = 'expires=' + date.toUTCString();
  document.cookie = name + '=' + value + ';' + expires + ';path=/';
}
function getCookie(name) {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
function createOverlay() {
  const overlay = document.createElement('div');
  overlay.classList.add('cookie-overlay');
  document.body.appendChild(overlay);
}
function addClass(block) {
  const defaultclass = ['cookieHeading', 'cookieDescription', 'cookieButton'];
  const allDiv = block.querySelectorAll(':scope > div');
  allDiv.forEach((element, index) => {
    element.classList.add(defaultclass[index]);
  });
  // Replace all <p> elements with <button> elements in the .cookieButton div
  const cookieButtonDiv = block.querySelector('.cookieButton div');
  const paragraphs = cookieButtonDiv.querySelectorAll('p');
  const buttonClass = ['customize', 'reject_cookie', 'accept_cookie'];
  const buttonIds = ['customize-btn', 'reject-btn', 'accept-btn'];
  paragraphs.forEach((paragraph, index) => {
    const button = document.createElement('button');
    button.textContent = paragraph.textContent;
    button.classList.add(buttonClass[index]);
    button.id = buttonIds[index];
    paragraph.replaceWith(button);
  });
}
function showCookieModal(block) {
  block.style.display = 'block';
  document.querySelector('.cookie-overlay').style.display = 'block';
}
function showCookieModalCustom(modelId) {
  modelId.style.display = 'block';
  document.querySelector('.cookie-overlay').style.display = 'block';
}
function hideCookieModal(block) {
  block.style.display = 'none';
  document.querySelector('.cookie-overlay').style.display = 'none';
}
function addAction(block) {
  const customizeBtn = block.querySelector('#customize-btn');
  const rejectBtn = block.querySelector('#reject-btn');
  const acceptBtn = block.querySelector('#accept-btn');
  if (customizeBtn) {
    const main = document.querySelector('main');
    const customCookie = main.querySelector('.custom-cookie-usage');
    customizeBtn.addEventListener('click', () => {
      showCookieModalCustom(customCookie);
    });
  } else {
    console.log('There is no customize button present.');
  }
  if (rejectBtn) {
    rejectBtn.addEventListener('click', () => {
      setCookie('cookiesAccepted', 'false', 365);
      hideCookieModal(block);
    });
  } else {
    console.log('There is no reject button present.');
  }
  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      setCookie('cookiesAccepted', 'true', 365);
      hideCookieModal(block);
    });
  } else {
    console.log('There is no accept button present.');
  }
}
export default function decorate(block) {
  createOverlay();
  addClass(block);
  if (!getCookie('cookiesAccepted')) {
    setTimeout(() => {
      showCookieModal(block);
    }, 3000); // Show after 3 seconds
  }
  addAction(block);
}
