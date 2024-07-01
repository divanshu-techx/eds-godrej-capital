async function fetchAndParseContent(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network response was not ok ${response.statusText}`);
    }
    const html = await response.text();
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = html;
    const mainDiv = tempContainer.querySelector('main');
    if (!mainDiv) {
      return null;
    }
    return Array.from(mainDiv.children)
      .filter(child => child.tagName === 'DIV')
      .map(div => div.outerHTML)
      .join('');
  } catch (error) {
    console.error('Error fetching the HTML:', error);
    return null;
  }
}

function insertContentIntoButtonContainer(anchor, contentToInsert) {
  const buttonContainer = anchor.parentElement;
  buttonContainer.innerHTML = contentToInsert;
  const profilePicture = buttonContainer.querySelector('.profiles picture img');
  if (!profilePicture) {
    return null;
  }
  const profileBlock = profilePicture.closest('.profiles');
  const descriptionDiv = profileBlock.querySelector('div:nth-child(2)');
  if (!descriptionDiv) {
    return null;
  }
  descriptionDiv.style.display = 'none';
  return { profilePicture, contentToInsert };
}

function addEventListenersToProfilePicture(profilePicture, contentToInsert) {
  const overlay = document.createElement('div');
  overlay.style.display = 'none';
  overlay.style.position = 'fixed';
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.zIndex = 999;
  document.body.appendChild(overlay);

  const popup = document.createElement('div');
  popup.style.display = 'none';
  popup.style.position = 'fixed';
  popup.style.top = '50%';
  popup.style.left = '50%';
  popup.style.transform = 'translate(-50%, -50%)';
  popup.style.border = '1px solid #ccc';
  popup.style.padding = '20px';
  popup.style.backgroundColor = 'white';
  popup.style.zIndex = 1000;
  popup.style.maxWidth = '80%';
  popup.style.maxHeight = '80%';
  popup.style.overflow = 'auto';
  document.body.appendChild(popup);

  const popupContent = document.createElement('div');
  popupContent.innerHTML = contentToInsert;
  popup.appendChild(popupContent);

  function showPopup() {
    overlay.style.display = 'block';
    popup.style.display = 'block';
  }

  function hidePopup() {
    overlay.style.display = 'none';
    popup.style.display = 'none';
  }

  profilePicture.addEventListener('click', showPopup);
  overlay.addEventListener('click', hidePopup);
}

export default async function decorate(block) {
  if (!block) {
    return;
  }
  const boardMembersElements = block.querySelectorAll('.boardmembers');
  if (boardMembersElements.length === 0) {
    return;
  }

  boardMembersElements.forEach(async (boardMembersElement) => {
    const anchors = boardMembersElement.querySelectorAll('.button');
    if (anchors.length === 0) {
      return;
    }

    anchors.forEach(async (anchor) => {
      const url = anchor.getAttribute('href');
      if (!url) {
        return;
      }

      const contentToInsert = await fetchAndParseContent(url);
      if (!contentToInsert) {
        return;
      }

      const elements = insertContentIntoButtonContainer(anchor, contentToInsert);
      if (!elements) {
        return;
      }

      addEventListenersToProfilePicture(elements.profilePicture, elements.contentToInsert);
    });
  });
}
 

