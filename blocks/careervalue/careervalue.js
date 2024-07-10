export default async function decorate(block) {
let blockDiv = block.children;
for(let i =0 ;i<blockDiv.length;i++){
    let childDiv = blockDiv[i];
    childDiv.classList.add('career-child-cards');

    if(childDiv.children){
        let innerChildDiv = childDiv.children;
        for(let j= 0;j<innerChildDiv.length;j++){
            innerChildDiv[j].classList.add('career-inner-child-cards');
        }
    }
}
}