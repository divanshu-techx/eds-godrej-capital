export default async function decorate(block) {
    // Create the close button element
    var closeButton = document.createElement('button');
    closeButton.className = 'close-button';
  
    // Add click event to close the popup
    closeButton.addEventListener('click', function() {
      document.querySelector('.feedback-title-btn').style = 'display:block';
      var popup = block.parentElement;
      if (popup) {
        popup.style.display = 'none';
      }
    });
  
    // Append the close button to the popup
    var popup = block;
    if (popup) {
      popup.appendChild(closeButton);
    }
}
  