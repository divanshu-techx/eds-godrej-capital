// Retrieve the value of a data attribute by name
function getDataAttributeValueByName(name) {
  const element = document.querySelector(`[data-${name}]`);
  return element ? element.getAttribute(`data-${name}`) : '';
}

export default async function decorate(block) {
  const crossBtn = getDataAttributeValueByName('close-button');
  const anchors = block.querySelectorAll('.button');
  if (anchors.length === 0) {
    console.error('No buttons found within the boardmembers block');
    return;
  }

  anchors.forEach((anchor) => {
    const url = anchor.getAttribute('href');
    if (!url) {
      console.error('Button does not have a valid href');
      return;
    }

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok ${response.statusText}`);
        }
        return response.text();
      })
      .then((html) => {
        // Create a temporary container to parse the fetched HTML
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = html;
        // Find the .profiles div in the fetched HTML
        const profileDiv = tempContainer.querySelector('.profiles');
        const profileContainers = profileDiv.children;
        Array.from(profileContainers).forEach((profile) => {
          const profileInnerDivs = profile.children;
          const descDiv = profileDiv;
          if (profileDiv) {
            profileDiv.children[0].classList.add('profile-details');
          }
          const pictureElement = profileInnerDivs[0]?.querySelector('picture');
          if (pictureElement) {
            pictureElement.parentElement.classList.add('profile-picture');
          }

          if (descDiv) {
            descDiv.children[1].classList.add('profile-description');
          }
        });

        const popcontenta = profileDiv.innerHTML;
        if (!profileDiv) {
          console.error('Profiles div not found in fetched HTML');
          return;
        }

        // Insert the .profiles div into the button container
        const buttonContainer = anchor.parentElement;
        buttonContainer.innerHTML = '';
        buttonContainer.appendChild(profileDiv);

        // Find the profile picture and associated description div
        const profilePicture = profileDiv.querySelector('picture img');
        if (!profilePicture) {
          console.error('Profile picture not found');
          return;
        }

        const descriptionDiv = profileDiv.querySelector('div:nth-child(2)');
        if (!descriptionDiv) {
          console.error('Description div not found');
          return;
        }

        // Hide the description div initially
        descriptionDiv.style.display = 'none';

        // Create overlay and popup elements for each anchor
        const overlay = document.createElement('div');
        overlay.classList.add('overlay-div');
        overlay.style.display = 'none';
        overlay.style.position = 'fixed';
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = 9999; //----
        document.body.appendChild(overlay);

        const popup = document.createElement('div');
        popup.classList.add('popup-div');
        popup.style.display = 'none';
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        // popup.style.transform = 'translate(-50%, -50%)';
        popup.style.border = '1px solid #ccc';
        popup.style.padding = '40px';
        popup.style.backgroundColor = 'white';
        popup.style.zIndex = 999999; //----
        popup.style.maxWidth = '80%';
        popup.style.maxHeight = '80%';
        // popup.style.overflow = 'auto';
        document.body.appendChild(popup);
        const popupContent = document.createElement('div');
        popupContent.innerHTML = popcontenta;
        popupContent.classList.add('popup-content');
        popup.appendChild(popupContent);
        // cross icon added to span
        const crossspan = document.createElement('span');
        if (crossBtn) {
          crossspan.innerText = crossBtn;
        } else {
          crossspan.innerText = '';
        }
        // span added to popup div
        const crossicon = document.createElement('div');
        crossicon.classList.add('closeicon');
        crossicon.appendChild(crossspan);
        popup.appendChild(crossicon);

        // Function to show the popup
        function showPopup() {
          overlay.style.display = 'block';
          popup.style.display = 'block';
          document.body.classList.add('popup-open');
        }

        // Function to hide the popup
        function hidePopup() {
          overlay.style.display = 'none';
          popup.style.display = 'none';
          document.body.classList.remove('popup-open');
        }

        // Add click event listener to the profile picture
        profilePicture.addEventListener('click', showPopup);

        // Add click event listener to the overlay to close the popup
        overlay.addEventListener('click', hidePopup);

        // Add click event listener to the close icon to close the popup
        crossicon.addEventListener('click', hidePopup);
      })
      .catch((error) => {
        console.error('Error fetching the HTML:', error);
      });
  });
}
