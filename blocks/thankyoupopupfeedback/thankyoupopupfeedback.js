export default async function decorate(block) {
  const divElements = block.querySelectorAll('.thankyoupopupfeedback > div > div');
  divElements.forEach((div, index) => {
    div.classList.add(`element-${index + 1}`);
  });
  // Create the close button element
  const closeButton = document.createElement('button');
  closeButton.className = 'close-button';

  // Add click event to close the popup
  closeButton.addEventListener('click', function () {
    document.querySelector('.feedback-title-btn').style = 'display:block';
    const popup = block.parentElement;
    if (popup) {
      popup.style.display = 'none';
    }
  });

  // Append the close button to the popup
  const popup = block;
  if (popup) {
    popup.appendChild(closeButton);
  }
}
