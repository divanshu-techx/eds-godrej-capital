// export default async function decorate(block) {
// let blockDiv = block.children;
// for(let i = 0;i<blockDiv.length ;i++){
//     let childDiv = blockDiv[i];
//     childDiv.classList.add(`career-child-${i}`);
//     // console.log(childDiv.length);
//     if(childDiv.children){
//         let innerChildDiv = childDiv.children;
//         for(let j = 0;j<innerChildDiv.length;j++){
//             innerChildDiv[j].classList.add(`career-inner-child-${i}-${j}`);
//         }
//     }
// }
// }
export default async function decorate(block) {
  const blockDiv = block.children;
  for (let i = 0; i < blockDiv.length; i += 1) {
    const childDiv = blockDiv[i];
    childDiv.classList.add(`career-child-${i}`);
    if (childDiv.children) {
      const innerChildDiv = childDiv.children;
      for (let j = 0; j < innerChildDiv.length; j += 1) {
        innerChildDiv[j].classList.add(`career-inner-child-${i}-${j}`);
      }
    }
  }
}
