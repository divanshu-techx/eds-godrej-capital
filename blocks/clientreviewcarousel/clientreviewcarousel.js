export default async function decorate(block) {
    console.log(block);
  
    // Select the parent container
    const carouselContainer = document.querySelector('.clientreviewcarousel');
  
    if (!carouselContainer) {
      console.error('Carousel container not found');
      return;
    }
  
    // Get all review divs
    const reviews = Array.from(carouselContainer.children);
  
    // Create a new ul element
    const ul = document.createElement('ul');
    ul.classList.add('swiper-wrapper'); // Add Swiper wrapper class
  
    // Loop through each review
    reviews.forEach((review, index) => {
      // Create a new li for each review
      const li = document.createElement('li');
      li.classList.add('swiper-slide'); // Add Swiper slide class
  
      // Extract picture and other divs
      const picture = review.querySelector('picture');
      const nameLocationDiv = review.querySelector('div:nth-child(2)'); // Assuming this is the element containing name and location
      const descriptionDiv = review.querySelector('div:nth-child(3)'); // Assuming this is the element containing description
  
      // Create container divs
      const pictureContainer = document.createElement('div');
      pictureContainer.classList.add('picture-container');
      pictureContainer.appendChild(picture);
  
      const infoContainer = document.createElement('div');
      infoContainer.classList.add('info-container');
  
      // Function to replace elements with divs
      const replaceWithDivs = (container) => {
        if (container) {
          const modifiedContainer = document.createElement('div');
          container.childNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // If element is not a <div>, create a <div> and copy content
              if (node.tagName !== 'DIV') {
                const div = document.createElement('div');
                div.textContent = node.textContent;
                modifiedContainer.appendChild(div);
              } else {
                // If element is already a <div>, clone it
                modifiedContainer.appendChild(node.cloneNode(true));
              }
            } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
              // Handle text nodes directly inside the container
              const div = document.createElement('div');
              div.textContent = node.textContent;
              modifiedContainer.appendChild(div);
            }
          });
          return modifiedContainer;
        }
        return null;
      };
  
      // Replace elements inside nameLocationDiv and descriptionDiv with <div> elements
      const modifiedNameLocationDiv = replaceWithDivs(nameLocationDiv);
      const modifiedDescriptionDiv = replaceWithDivs(descriptionDiv);
  
      // Append modified elements to infoContainer
      if (modifiedNameLocationDiv) {
        infoContainer.appendChild(modifiedNameLocationDiv);
      }
      if (modifiedDescriptionDiv) {
        infoContainer.appendChild(modifiedDescriptionDiv);
      }
  
      // Append containers to li
      li.appendChild(pictureContainer);
      li.appendChild(infoContainer);
  
      // Append li to ul
      ul.appendChild(li);
    });
  
    // Clear the original container and append the ul
    carouselContainer.innerHTML = '';
    carouselContainer.appendChild(ul);
  
    // Initialize Swiper after modifying the HTML structure
    new Swiper('.clientreviewcarousel', {
      // Swiper options here
      slidesPerView: 1,
      spaceBetween: 10,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
  }
  