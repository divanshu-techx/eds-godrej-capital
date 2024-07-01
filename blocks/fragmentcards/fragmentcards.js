// Fetch and extract the required content from the URL
async function fetchAndExtractContent(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Network response was not ok ${response.statusText}`);
  }

  const html = await response.text();
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  const bodyTag = tempDiv.querySelector('body');
  if (bodyTag) {
    return bodyTag.innerHTML;
  }

  const mainTag = tempDiv.querySelector('main');
  if (mainTag) {
    const firstChildDiv = mainTag.querySelector('div');
    if (firstChildDiv) {
      return firstChildDiv.innerHTML;
    }
  }

  return null;
}

// Main decorate function
export default async function decorate(block) {
  if (!block) {
    return;
  }

  const fragmentCards = block.querySelector('.fragmentcards');
  if (!fragmentCards) {
    return;
  }

  // Get the anchor tag
  const anchor = fragmentCards.querySelector('.button');
  if (!anchor) {
    console.error('No anchor found in fragmentcards');
    return;
  }

  // Get the URL from the href attribute
  const url = anchor.getAttribute('href');
  if (!url) {
    console.error('No URL found in the anchor href attribute');
    return;
  }

  try {
    const contentToInsert = await fetchAndExtractContent(url);
    if (contentToInsert) {
      // Replace the content in the block with the extracted content
      const buttonContainer = anchor.parentElement;
      buttonContainer.innerHTML = contentToInsert;
    } else {
      console.error('No valid content to insert');
    }
  } catch (error) {
    console.error('Error fetching the HTML:', error);
  }
}

// Example of how to call the decorate function
document.addEventListener('DOMContentLoaded', () => {
  const block = document.querySelector('.fragmentcards-wrapper'); // Replace with your block's actual class or ID
  if (block) {
    decorate(block);
  } else {
    console.error('Block element not found');
  }
});


// //Fetch and extract the required content from the URL
// async function fetchAndExtractContent(url) {
//   const response = await fetch(url);
//   if (!response.ok) {
//     throw new Error(`Network response was not ok ${response.statusText}`);
//   }

//   const html = await response.text();
//   const tempDiv = document.createElement('div');
//   tempDiv.innerHTML = html;

//   const bodyTag = tempDiv.querySelector('body');
//   if (bodyTag) {
//     return bodyTag.innerHTML;
//   }

//   const mainTag = tempDiv.querySelector('main');
//   if (mainTag) {
//     const firstChildDiv = mainTag.querySelector('div');
//     if (firstChildDiv) {
//       return firstChildDiv.innerHTML;
//     }
//   }

//   return null;
// }

// // Function to create tabs and handle click events
// function createTabs() {
//   const tabContainers = document.querySelectorAll('[data-section-status="loaded"]');
//   const tabTitles = [];

//   tabContainers.forEach(container => {
//     const tabTitle = container.getAttribute('data-tab-title');
//     if (tabTitle) {
//       tabTitles.push(tabTitle);
//     }
//   });

//   tabTitles.forEach(title => {
//     const tabButton = document.createElement('button');
//     tabButton.textContent = title;
//     tabButton.addEventListener('click', () => {
//       showTabContent(title);
//     });
//     document.body.appendChild(tabButton);
//   });
// }

// // Function to show content based on clicked tab
// function showTabContent(tabTitle) {
//   const tabContainers = document.querySelectorAll('[data-section-status="loaded"]');
//   tabContainers.forEach(container => {
//     const containerTabTitle = container.getAttribute('data-tab-title');
//     if (containerTabTitle === tabTitle) {
//       container.style.display = 'block';
//     } else {
//       container.style.display = 'none';
//     }
//   });
// }

// // Main decorate function
// export default async function decorate(block) {
//   if (!block) {
//     console.error('Block is undefined');
//     return;
//   }

//   createTabs(); // Call function to create tabs

//   const fragmentCards = block.querySelector('.fragmentcards-container');
//   if (!fragmentCards) {
//     console.error('Fragment Cards container not found');
//     return;
//   }

//   const boardMembers = block.querySelector('.boardmembers-container');
//   if (!boardMembers) {
//     console.error('Board Members container not found');
//     return;
//   }

//   // Get the anchor tags within each section (assuming they are `.button` class)
//   const anchors = fragmentCards.querySelectorAll('.button, .profiles picture img');
//   if (!anchors || anchors.length === 0) {
//     console.error('Anchors not found in fragment cards');
//     return;
//   }

//   // Loop through each anchor and attach click event listeners
//   anchors.forEach(anchor => {
//     anchor.addEventListener('click', () => {
//       const profileBlock = anchor.closest('.profiles');
//       if (!profileBlock) {
//         console.error('Profile block not found');
//         return;
//       }

//       const descriptionDiv = profileBlock.querySelector('div:nth-child(2)');
//       if (!descriptionDiv) {
//         console.error('Description div not found');
//         return;
//       }

//       // Toggle visibility of description div
//       descriptionDiv.style.display = descriptionDiv.style.display === 'none' ? 'block' : 'none';
//     });
//   });

//   // Similarly for Board Members
//   const boardAnchors = boardMembers.querySelectorAll('.button, .profiles picture img');
//   if (!boardAnchors || boardAnchors.length === 0) {
//     console.error('Anchors not found in board members');
//     return;
//   }

//   boardAnchors.forEach(anchor => {
//     anchor.addEventListener('click', () => {
//       const profileBlock = anchor.closest('.profiles');
//       if (!profileBlock) {
//         console.error('Profile block not found in board members');
//         return;
//       }

//       const descriptionDiv = profileBlock.querySelector('div:nth-child(2)');
//       if (!descriptionDiv) {
//         console.error('Description div not found in board members');
//         return;
//       }

//       // Toggle visibility of description div
//       descriptionDiv.style.display = descriptionDiv.style.display === 'none' ? 'block' : 'none';
//     });
//   });
// }

// // Example of how to call the decorate function
// document.addEventListener('DOMContentLoaded', () => {
//   const block = document.querySelector('.fragmentcards-wrapper'); // Replace with your block's actual class or ID
//   if (block) {
//     decorate(block);
//   } else {
//     console.error('Block element not found');
//   }
// });

