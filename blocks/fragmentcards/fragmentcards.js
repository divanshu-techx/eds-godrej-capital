export default async function decorate(block) {

    if (!document.querySelector('.fragmentcards')) {
      return;
    }
    // Get the anchor tag
    const anchor = document.querySelector('.fragmentcards .button');

    // Get the URL from the href attribute
    const url = anchor.getAttribute('href');
 if (block){
    const parentDivs = block.querySelectorAll(':scope > div');
      parentDivs.forEach(parentDiv => {
        // Add the contentandpictureparent class to the parent div
        parentDiv.classList.add('fragmentcards-container');
        
        // Select the first div (content) and the second div (picture) within each direct child div
        const contentDiv = parentDiv.querySelector('div:first-of-type');
        const pictureDiv = parentDiv.querySelector('div:last-of-type');
        
        if (contentDiv) {
          contentDiv.classList.add('fragmentcards-container_left');
          
          // Add class to the first h2 element within fragmentcards-container_left
          const firstH2 = contentDiv.querySelector('h2');
          if (firstH2) {
            firstH2.classList.add('fragmentcards-container_left__title'); // Replace 'your-class-name' with the class you want to add
          }
        }
        
        if (pictureDiv) {
          pictureDiv.classList.add('fragmentcards-container_right');
        }
      });
    }


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
    // contentDiv.insertAdjacentHTML('beforeend', contentToInsert);
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

