export default async function decorate(block){
    const childDivs = block.querySelectorAll(':scope > div');
    childDivs.forEach((div) => {
        div.classList.add('hdfc-life-child-div');
        const link = div.querySelector('a.button');
        console.log(link);
        if(link){
            const linkDiv = document.createElement('a');
            linkDiv.href = link.href;
            linkDiv.title = link.title;
            linkDiv.appendChild(div.cloneNode(true));
            div.replaceWith(linkDiv);
            console.log(linkDiv);
        }
    });
    

}
