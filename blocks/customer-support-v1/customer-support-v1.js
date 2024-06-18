export default async function decorate(block) {
  const allDivs = block.querySelectorAll(':scope > div');
  const headerDiv = document.createElement('div');
  headerDiv.classList.add('cards-header');
  const cardsContainer = document.createElement('div');
  cardsContainer.classList.add('cards-container');
  const footerDiv = document.createElement('div');
  footerDiv.classList.add('cards-footer');
  allDivs.forEach((div, index) => {
    if (index == 0 || index == 1) {
      const valueElement = div.querySelector('div:nth-child(2) p');
      if (valueElement && valueElement.textContent.trim() === 'true') {
        div.classList.add('show-on-mobile');
        const removeDiv = div.querySelector('div:nth-child(2)');
        removeDiv.classList.add('cards-remove');
        headerDiv.appendChild(div);
      } else {
        div.classList.add('hide-on-mobile');
        const removeDiv = div.querySelector('div:nth-child(2)');
        removeDiv.classList.add('cards-remove');
        headerDiv.appendChild(div);
      }
    } else if (index == 7) {
      div.classList.add('hide-on-mobile');
      const removeDiv = div.querySelector('div:nth-child(2)');
      removeDiv.classList.add('cards-remove');
      footerDiv.appendChild(div);
      console.log(div);
    } else {
      const valueElement = div.querySelector('div:nth-child(3) > p');
      // console.log(valueElement);
      if (valueElement && valueElement.textContent.trim() === 'true') {
        div.classList.add('cards');
        const removeDiv = div.querySelector('div:nth-child(3)');
        removeDiv.classList.add('cards-remove');
        cardsContainer.appendChild(div);
      } else {
        div.classList.add('cards', 'hide-on-mobile');
        const removeDiv = div.querySelector('div:nth-child(3)');
        removeDiv.classList.add('cards-remove');
        cardsContainer.appendChild(div);
      }
    }
  });
  const mainDiv = document.querySelector('.customer-support-v1');
  mainDiv.appendChild(headerDiv);
  mainDiv.appendChild(cardsContainer);
  mainDiv.appendChild(footerDiv);
}
