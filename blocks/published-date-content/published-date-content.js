export default async function decorate(block) {
  const classNames = ['description', 'social-images'];
  const divs = block.querySelectorAll(':scope > div > div');
  if (divs.length >= classNames.length) {
    divs.forEach((div, index) => {
      if (index < classNames.length) {
        div.classList.add(classNames[index]);
      }
    });
  } else {
    console.log('Not enough <div> elements to assign all classes.');
  }
}
