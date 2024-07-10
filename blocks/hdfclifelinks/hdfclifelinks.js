export default async function decorate(block){
    const childDivs = block.querySelectorAll(':scope > div');
    childDivs.forEach((div) => {
        div.classList.add('hdfc-life-child-div');
    });

}
