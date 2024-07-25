export default async function decorate(block) {
  const emptyDiv = block.querySelector(":scope > div > div");
  if (emptyDiv) {
    emptyDiv.classList.add("spinner");
  }
}
const spinnerCircularBlock = document.querySelector(".spinner-circular.block");
if (spinnerCircularBlock) {
  decorate(spinnerCircularBlock);
}
