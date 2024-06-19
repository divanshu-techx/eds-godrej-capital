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

  allDivs.forEach((div) => {
    div.classList.add('footer-element');

    const childDivs = div.querySelectorAll(':scope > div');
    if (childDivs.length > 1) {
      const [firstDiv, secondDiv] = childDivs;
      secondDiv.classList.add('dropdown-content');
      secondDiv.style.display = 'none';

      firstDiv.addEventListener('click', () => {
        console.log('footer js called');
        const isExpanded = secondDiv.style.display === 'block';
        hideAllDropdowns(secondDiv); // Hide all other dropdowns
        secondDiv.style.display = isExpanded ? 'none' : 'block';
        firstDiv.style.backgroundColor = isExpanded ? '' : '#f0f0f0'; // Change color for open dropdown
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