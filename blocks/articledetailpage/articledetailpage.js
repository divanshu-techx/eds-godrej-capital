export default async function decorate(block) {
  console.log(block.parentElement);
  const parentEle = block.parentElement;
  console.log(parentEle.nextElementSibling);
  const deafaultEle = parentEle.nextElementSibling;
  buildImageBlocks(deafaultEle);

}

/**
 * builds images blocks from default content.
 * @param {Element} mainEl The container element
 */
function buildImageBlocks(mainEl) {
  // select all non-featured, default (non-images block) images
  const imgEls = [...mainEl.querySelectorAll('div > p > picture')];
  let lastImagesBlock;
  imgEls.forEach((imgEl) => {
    const parentEl = imgEl.parentNode;
    const imagesBlockEl = buildBlock('images', {
      elems: [imgEl.cloneNode(true), getImageCaption(imgEl)],
    });
    if (parentEl.parentNode) {
      parentEl.replaceWith(imagesBlockEl);
      lastImagesBlock = imagesBlockEl;
    } else {
      // same parent, add image to last images block
      lastImagesBlock.firstChild.append(imagesBlockEl.firstChild.firstChild);
    }
  });
}

/**
 * returns an image caption of a picture elements
 * @param {Element} picture picture element
 */
function getImageCaption(picture) {
  const parentEl = picture.parentNode;
  const parentSiblingEl = parentEl.nextElementSibling;
  return (parentSiblingEl && parentSiblingEl.firstChild.nodeName === 'EM' ? parentSiblingEl : undefined);
}

/**
 * Builds a block DOM Element from a two dimensional array
 * @param {string} blockName name of the block
 * @param {any} content two dimensional array or string or object of content
 */
function buildBlock(blockName, content) {
  const table = Array.isArray(content) ? content : [[content]];
  const blockEl = document.createElement('div');
  // build image block nested div structure
  blockEl.classList.add(blockName);
  table.forEach((row) => {
    const rowEl = document.createElement('div');
    row.forEach((col) => {
      const colEl = document.createElement('div');
      const vals = col.elems ? col.elems : [col];
      vals.forEach((val) => {
        if (val) {
          if (typeof val === 'string') {
            colEl.innerHTML += val;
          } else {
            colEl.appendChild(val);
          }
        }
      });
      rowEl.appendChild(colEl);
    });
    blockEl.appendChild(rowEl);
  });
  return (blockEl);
}

