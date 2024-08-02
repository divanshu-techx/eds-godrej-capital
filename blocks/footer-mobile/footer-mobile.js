export default async function decorate(block) {
  const allDivs = block.querySelectorAll(':scope > div');

  // Create overlay element
  const overlay = document.createElement('div');
  overlay.classList.add('overlay', 'overlay-footer-mobile');
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
    dropdown.style.width = '-webkit-fill-available';
    overlay.style.height = `${halfRemainingHeight + headerHeight}px`;
    overlay.style.top = `0`;
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
      firstDiv.addEventListener('click', function () {
        const isExpanded = secondDiv.style.display === 'block';
        hideAllDropdowns(secondDiv); // Hide all other dropdowns
        allDivs.forEach((el) => {
          el.classList.remove('active-el');
        });
        if (isExpanded) {
          this.parentElement.classList.remove('active-el');

          secondDiv.style.display = 'none';
          secondDiv.classList.remove('open'); // Remove fade-in effect
          overlay.classList.remove('open'); // Hide the overlay
          firstDiv.style.backgroundColor = '';
        } else {
          this.parentElement.classList.add('active-el');
          adjustDropdownSize(secondDiv);
          secondDiv.style.display = 'block';
          secondDiv.classList.add('open');
          overlay.classList.add('open'); //
          firstDiv.style.backgroundColor = '#fff';
        }
      });

      const listItems = secondDiv.querySelectorAll('li');
      listItems.forEach((li) => {
        if (li.querySelector('ol')) {
          li.style.cursor = 'pointer';
          // li.classList = 'open-list'
          const innerOl = li.querySelector('ol');
          innerOl.style.display = 'none';
          li.addEventListener('click', function (event) {
            event.stopPropagation();
            const isExpanded = innerOl.style.display === 'block';
            innerOl.style.display = isExpanded ? 'none' : 'block';
            this.classList.add('open-list');
            if (isExpanded) {
              this.classList.remove('open-list');
            }
          });
        }
      });
    }
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.tooltip-trigger')) {
      hideAllDropdowns();
    }
  });
}
