function addInitialStrurcture(block) {
  [...block.children].forEach((row) => {
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    summary.append(...label.childNodes);
    if (summary.querySelector(' p >picture img')) {
      summary.classList.add('accordian-item-label-pictuire');
    }
    var body = row.children[1];
    if (body) {
      body.className = 'header-accordion-item-body';
      if (!body.hasChildNodes()) {
        body.classList.add('no-children-inside');
      }
    }
    const details = document.createElement('details');
    details.className = 'header-accordion-item';
    if (body === undefined) {
      body = '';
    }
    details.append(summary, body);
    row.replaceWith(details);
  });
}

function addingHeaderMobFunctionlity(block) {
  const accordionBodies = block.querySelectorAll('.header-accordion-item-body > ol > li , .header-accordion-item-body > ul > li');
  accordionBodies.forEach(item => {
    const childOl = item.querySelector('ol, ul');
    if (childOl) {
      item.classList.add('has-children');
      childOl.style.display = 'none';
      item.addEventListener('click', (event) => {
        event.stopPropagation();
        const isActive = childOl.style.display === 'block';
        item.parentElement.querySelectorAll('.has-children .active').forEach((activeItem) => {
          if (activeItem !== item) {
            activeItem.querySelector('ol, ul').style.display = 'none';
            activeItem.classList.remove('active');
          }
        });
        childOl.style.display = isActive ? 'none' : 'block';
        item.classList.toggle('active', !isActive);
      });
    } else {
      item.classList.add('no-children');
    }
  });
}

export default async function decorate(block) {
  addInitialStrurcture(block);
  addingHeaderMobFunctionlity(block);
}