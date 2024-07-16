export default async function decorate(block) {
    const divElements = block.querySelectorAll('.aditya-birla-images > div');

    divElements.forEach((div, index) => {
        div.classList.add(`aditya-birla-picture-source-${index + 1}`);
    });
}
