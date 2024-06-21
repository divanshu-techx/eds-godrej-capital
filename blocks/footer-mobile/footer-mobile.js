// export default async function decorate(block) {
//   const allDivs = block.querySelectorAll(':scope > div');

//   // Function to hide all dropdowns except the specified one
//   function hideAllDropdowns(exceptDropdown) {
//     const dropdowns = block.querySelectorAll('.dropdown-content');
//     dropdowns.forEach((dropdown) => {
//       if (dropdown !== exceptDropdown) {
//         dropdown.style.display = 'none';
//       }
//     });
//   }

//   // Function to adjust dropdown position to be fully visible
//   function adjustDropdownPosition(dropdown) {
//     const rect = dropdown.getBoundingClientRect();
//     const viewportWidth = window.innerWidth;

//     if (rect.left < 0) {
//       dropdown.style.left = '0';
//       dropdown.style.transform = 'none';
//     } else if (rect.right > viewportWidth) {
//       dropdown.style.left = 'auto';
//       dropdown.style.right = '0';
//       dropdown.style.transform = 'none';
//     } else {
//       dropdown.style.left = '50%';
//       dropdown.style.right = 'auto';
//       dropdown.style.transform = 'translateX(-50%)';
//     }
//   }

//   allDivs.forEach((div) => {
//     div.classList.add('footer-element');

//     const childDivs = div.querySelectorAll(':scope > div');
//     if (childDivs.length > 1) {
//       const [firstDiv, secondDiv] = childDivs;
//       secondDiv.classList.add('dropdown-content');
//       secondDiv.style.display = 'none';

//       firstDiv.classList.add('tooltip-trigger');
//       firstDiv.addEventListener('click', () => {
//         const isExpanded = secondDiv.style.display === 'block';
//         hideAllDropdowns(secondDiv); // Hide all other dropdowns
//         secondDiv.style.display = isExpanded ? 'none' : 'block';
//         firstDiv.style.backgroundColor = isExpanded ? '' : '#fff';

//         if (!isExpanded) {
//           adjustDropdownPosition(secondDiv); // Adjust position if now displayed
//         }
//       });

//       const listItems = secondDiv.querySelectorAll('li');
//       listItems.forEach((li) => {
//         if (li.querySelector('ol')) {
//           li.style.cursor = 'pointer';
//           const innerOl = li.querySelector('ol');
//           innerOl.style.display = 'none';

//           const toggleSign = document.createElement('span');
//           toggleSign.textContent = ' +';
//           li.appendChild(toggleSign);

//           li.addEventListener('click', (event) => {
//             event.stopPropagation();
//             const isExpanded = innerOl.style.display === 'block';
//             innerOl.style.display = isExpanded ? 'none' : 'block';
//             toggleSign.textContent = isExpanded ? ' +' : ' -';
//           });
//         }
//       });
//     }
//   });

//   // Hide dropdowns when clicking outside
//   document.addEventListener('click', function(event) {
//     if (!event.target.closest('.tooltip-trigger')) {
//       hideAllDropdowns();
//     }
//   });
// }

export default async function decorate(block) {
  const allDivs = block.querySelectorAll(':scope > div');
 
  // Function to hide all dropdowns except the specified one
  function hideAllDropdowns(exceptDropdown) {
    const dropdowns = block.querySelectorAll('.dropdown-content');
    dropdowns.forEach((dropdown) => {
      if (dropdown !== exceptDropdown) {
        dropdown.style.display = 'none';
      }
    });
  }
  allDivs.forEach((div,index) => {
    div.classList.add('footer-element');
    const childDivs = div.querySelectorAll(':scope > div');
    if (childDivs.length > 1) {
      const [firstDiv, secondDiv] = childDivs;
      if(index === 0) {
        secondDiv.classList.add('products-class');
      }else if(index === 2){
        secondDiv.classList.add('calculators');
      }
      secondDiv.classList.add('dropdown-content');
      secondDiv.style.display = 'none';
 
      firstDiv.classList.add('tooltip-trigger');
      firstDiv.addEventListener('click', () => {
        const isExpanded = secondDiv.style.display === 'block';
        hideAllDropdowns(secondDiv); // Hide all other dropdowns
        secondDiv.style.display = isExpanded ? 'none' : 'block';
        firstDiv.style.backgroundColor = isExpanded ? '' : '#fff';
      });
      const listItems = secondDiv.querySelectorAll('li');
      listItems.forEach((li) => {
        if (li.querySelector('ol')) {
          li.style.cursor = 'pointer';
          const innerOl = li.querySelector('ol');
          innerOl.style.display = 'none';
          const toggleSign = document.createElement('span');
          toggleSign.textContent = ' +';
          li.appendChild(toggleSign);
          li.addEventListener('click', (event) => {
            event.stopPropagation();
            const isExpanded = innerOl.style.display === 'block';
            innerOl.style.display = isExpanded ? 'none' : 'block';
            toggleSign.textContent = isExpanded ? ' +' : ' -';
          });
        }
      });
    }
  });
}


