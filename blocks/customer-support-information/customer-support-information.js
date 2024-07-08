export default async function decorate(block) {
    const divElements = block.querySelectorAll('.customer-support-information > div');

    divElements.forEach((div, index) => {
        div.classList.add(`custom-title-icon`); 
    });
}