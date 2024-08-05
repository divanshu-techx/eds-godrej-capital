export default async function decorate(block) {
  const divElements = block.querySelectorAll('.about-us-mobile > div');
  console.log(divElements);
  divElements.forEach((div, index) => {
    div.classList.add('about-us-mobile');
    div.classList.add(`index-${index + 1}`);
    const childElements = div.querySelectorAll('*');
    childElements.forEach((child, childIndex) => {
      child.classList.add(`about-us-mobile-child-${index + 1}-${childIndex + 1}`);
    });
  });
}
