function hasWrapper(el) {
    return !!el.firstElementChild && window.getComputedStyle(el.firstElementChild).display === 'block';
}
export default async function decorate(block) {
    [...block.children].forEach((row) => {

        // decorate accordion item label
        const label = row.children[0];
        const summary = document.createElement('summary');
        summary.className = 'accordion-item-label';
        summary.append(...label.childNodes);
        // if (!hasWrapper(summary)) {
        //     summary.innerHTML = `<p>${summary.innerHTML}</p>`;
        // }
        // decorate accordion item body
        const body = row.children[1];
        console.log(body);
        if (body) {
            body.className = 'header-accordion-item-body';
            if (!body.hasChildNodes()) {
                body.classList.add('no-children-inside');
            }
            // if (body.hasChildNodes('p')) {
            //     console('check')
            // }
            // if (!hasWrapper(body)) {
            //     body.innerHTML = `<p>${body.innerHTML}</p>`;
            // }
        }

        // decorate accordion item
        const details = document.createElement('details');
        details.className = 'header-accordion-item';
        details.append(summary, body);
        row.replaceWith(details);
    });
    console.log('block header accordian', block)
    const accordionBodies = block.querySelectorAll('.header-accordion-item-body > ol > li , .header-accordion-item-body > ul > li');
    console.log('accordian bodies', accordionBodies)
    accordionBodies.forEach(item => {
        const childOl = item.querySelector('ol, ul');
        console.log(childOl);
        if (childOl) {
            item.classList.add('has-children');
            childOl.style.display = 'none'; // Initially hide children
            item.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevents triggering parent's click event
                const isActive = childOl.style.display === 'block';
                // Close all other open items within the same parent
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

