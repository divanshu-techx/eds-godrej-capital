export default async function decorate(block) {
  const allDivs = block.querySelectorAll(':scope > div');

  allDivs.forEach((div) => {
    div.classList.add('third-party-cards');

    const link = div.querySelector('a.button');
    const picture = div.querySelector('picture');

    if (link && picture) {

      const pictureLink = document.createElement('a');
      pictureLink.href = link.href;
      pictureLink.title = link.title;

      pictureLink.appendChild(picture.cloneNode(true));

      // Replace the original picture with the new anchor-wrapped picture
      picture.replaceWith(pictureLink);
    }

    div.querySelectorAll(':scope > *').forEach((child) => {
      child.classList.add('third-party-cards-child');
    });
  });


  // Adding a container class to manage the flex layout
  block.classList.add('third-party-cards-container');
}
