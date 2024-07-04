export default function loadBoardContentFromURL() {
  document.addEventListener('DOMContentLoaded', () => {
    const boardMembersElements = document.querySelectorAll('.boardmembers');
    if (boardMembersElements.length === 0) {
      return;
    }
    boardMembersElements.forEach((boardMembersElement) => {
      const anchors = boardMembersElement.querySelectorAll('.button.primary');
      if (anchors.length === 0) {
        return;
      }

      anchors.forEach((anchor) => {
        const url = anchor.getAttribute('href');
        if (!url) {
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

            // Extract content from the fetched HTML
            const contentToInsert = tempContainer.innerHTML;

            // Insert the content into the button container
            const buttonContainer = anchor.parentElement;
            buttonContainer.innerHTML = contentToInsert;

            // Find the profile picture and associated description div
            const profilePicture = buttonContainer.querySelector('.profiles picture img');
            if (!profilePicture) {
              return;
            }

            const profileBlock = profilePicture.closest('.profiles');
            const descriptionDiv = profileBlock.querySelector('div:nth-child(2)');
            if (!descriptionDiv) {
              return;
            }

            // Hide the description div initially
            descriptionDiv.style.display = 'none';

            // Create overlay and popup elements for each anchor
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

            // Function to show the popup
            function showPopup() {
              overlay.style.display = 'block';
              popup.style.display = 'block';
            }

            // Function to hide the popup
            function hidePopup() {
              overlay.style.display = 'none';
              popup.style.display = 'none';
            }

            // Add click event listener to the profile picture
            profilePicture.addEventListener('click', showPopup);

            // Add click event listener to the overlay to close the popup
            overlay.addEventListener('click', hidePopup);
          })
          .catch((error) => {
            console.error('Error fetching the HTML:', error);
          });
      });
    });
  });
}
