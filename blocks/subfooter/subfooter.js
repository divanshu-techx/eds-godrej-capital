export default async function decorate(block) {
    console.log(block);
    
    // add a class name on sub div of parent div
    const footerItem=block.querySelectorAll(':scope > div');
    footerItem.forEach((elm)=>{
        elm.classList.add('footer-item');
    })
 
    // add class name item and content for key value pair
    const footerItems = document.querySelectorAll('.subfooter .footer-item');
    // Loop through each .footer-item
    footerItems.forEach(item => {
      // Find the first child <div> and add class 'item'
      const firstDiv = item.querySelector('div:first-child');
      if (firstDiv) {
        firstDiv.classList.add('item');
      }
 
      // Find the second child <div> and add class 'content'
      const secondDiv = item.querySelector('div:nth-child(2)');
      if (secondDiv) {
        secondDiv.classList.add('content');
        secondDiv.classList.add('hidden');
      }
    });

    // on click list is shown of sub div
    const footerItemsclick = document.querySelectorAll('.footer-item');
    footerItemsclick.forEach(footerItem => {
        const itemDiv = footerItem.querySelector('.item');
        const contentDiv = footerItem.querySelector('.content.hidden');

        if (itemDiv && contentDiv) {
            itemDiv.addEventListener('click', () => {
               contentDiv.classList.toggle('hidden');
            });
        }
    });

    // Select all list items that contain child lists
    const listItems = document.querySelectorAll('.content ol > li');
    // Hide all child lists on page load
    document.querySelectorAll('.content ol ol').forEach(ol => {
        ol.classList.add('hidden');
    });

    // on click of ordered list show their nested list and hide 
    listItems.forEach(item => {
        item.addEventListener('click', (event) => {
            // Prevent event bubbling to avoid triggering parent's parent click event
            event.stopPropagation();
            
            // Select the child ol element
            const childList = item.querySelector('ol');

            if (childList) {
                // Hide all other child lists and remove the active class from all parent items
                document.querySelectorAll('.content ol ol').forEach(ol => {
                    if (ol !== childList) {
                        ol.classList.add('hidden');
                    }
                });
                listItems.forEach(listItem => {
                    listItem.classList.remove('active');
                });

                // Toggle the visibility of the child list and add active class to the clicked parent item
                childList.classList.toggle('hidden');
                if (!childList.classList.contains('hidden')) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            }
        });
    });
   
}