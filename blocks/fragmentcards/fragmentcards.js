export default async function decorate() {
  if (!document.querySelector('.fragmentcards')) {
    return;
  }
  // Get the anchor tag
  const anchor = document.querySelector('.fragmentcards .button');

  // Get the URL from the href attribute
  const url = anchor.getAttribute('href');

  // Fetch the HTML content from the URL
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok ${response.statusText}`);
      }
      return response.text();
    })
    .then((html) => {
      // Create a temporary div to hold the fetched HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;

      // Extract the content you need
      let contentToInsert = '';
      const bodyTag = tempDiv.querySelector('body');
      if (bodyTag) {
        contentToInsert = bodyTag.innerHTML;
      } else {
        const mainTag = tempDiv.querySelector('main');
        if (mainTag) {
          const firstChildDiv = mainTag.querySelector('div');
          if (firstChildDiv) {
            contentToInsert = firstChildDiv.innerHTML;
          } else {
            return;
          }
        } else {
          return;
        }
      }

      // Replace the link with the fetched body content
      const buttonContainer = anchor.parentElement;
      buttonContainer.innerHTML = contentToInsert;
      // Add custom classes directly based on structure
      const addressContainer = buttonContainer.querySelector('.address');
      if (addressContainer) {
        const addressDivs = addressContainer.querySelectorAll('div');
        if (addressDivs.length >= 3) {
          addressContainer.children[0].classList.add('registered-office-address');
          addressContainer.children[1].classList.add('locate-on-map');
          addressContainer.children[2].classList.add('office-work-timings');
        }
      }

      const forQueryContainer = buttonContainer.querySelector('.forquery');
      if (forQueryContainer) {
        const forQueryDivs = forQueryContainer.querySelectorAll('div');
        if (forQueryDivs.length >= 3) {
          forQueryContainer.children[0].classList.add('for-query');
          forQueryContainer.children[1].classList.add('contact-number');
          forQueryContainer.children[2].classList.add('work-timings');
        }
      }
    })
    .catch((error) => {
      console.error('Error fetching the HTML:', error);
    });
}
