
export default async function decorate(block) {
  const allDivs = block.querySelectorAll(':scope > div');

  // Create overlay element
  const overlay = document.createElement('div');
  overlay.classList.add('overlay');
  document.body.appendChild(overlay);

  // Constants for header and footer height
  const headerHeight = 70;
  const footerHeight = 100;

  // Function to hide all dropdowns except the specified one
  function hideAllDropdowns(exceptDropdown) {
    const dropdowns = block.querySelectorAll('.dropdown-content');
    dropdowns.forEach((dropdown) => {
      if (dropdown !== exceptDropdown) {
        dropdown.style.display = 'none';
        dropdown.classList.remove('open'); // Remove fade-in effect
        overlay.classList.remove('open'); // Hide the overlay
      }
    });
  }

  // Function to adjust dropdown height to half the remaining screen height
  function adjustDropdownSize(dropdown) {
    const screenHeight = window.innerHeight;
    const remainingHeight = screenHeight - headerHeight - footerHeight;
    const halfRemainingHeight = remainingHeight / 2;

    dropdown.style.height = `${halfRemainingHeight}px`;
    dropdown.style.width = '100%';
    overlay.style.height = `${halfRemainingHeight + headerHeight}px`; // Extend to cover header
    overlay.style.top = `0`; // Start from the top of the viewport
  }

  allDivs.forEach((div, index) => {
    div.classList.add('footer-element');
    const childDivs = div.querySelectorAll(':scope > div');

    if (childDivs.length > 1) {
      const [firstDiv, secondDiv] = childDivs;

      if (index === 0) {
        secondDiv.classList.add('products-class');
      } else if (index === 2) {
        secondDiv.classList.add('calculators');
      }

      secondDiv.classList.add('dropdown-content');
      secondDiv.style.display = 'none';

      firstDiv.classList.add('tooltip-trigger');
      firstDiv.addEventListener('click', () => {
        const isExpanded = secondDiv.style.display === 'block';
        hideAllDropdowns(secondDiv); // Hide all other dropdowns
        if (isExpanded) {
          secondDiv.style.display = 'none';
          secondDiv.classList.remove('open'); // Remove fade-in effect
          overlay.classList.remove('open'); // Hide the overlay
          firstDiv.style.backgroundColor = '';
        } else {
          adjustDropdownSize(secondDiv); // Adjust size if now displayed
          secondDiv.style.display = 'block';
          secondDiv.classList.add('open'); // Apply fade-in effect
          overlay.classList.add('open'); // Show the overlay
          firstDiv.style.backgroundColor = '#fff';
        }
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

  // Hide dropdowns when clicking outside
  document.addEventListener('click', function(event) {
    if (!event.target.closest('.tooltip-trigger')) {
      hideAllDropdowns();
    }
  });
}
