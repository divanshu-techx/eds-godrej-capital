export default async function decorate(block) {
    console.log(block);
    const blockEle = block.closest('.section.feedbackform-container');
    console.log(blockEle.getAttribute('data-feedbackbuttontitle'));

    

}