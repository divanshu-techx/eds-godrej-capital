export default async function decorate(block) {
    // Function to handle the changes for mobile view
    function handleMobileView() {
        let slideCards = document.querySelector('.career-value-cards');
        let parentBlockDiv = document.querySelector('.careervalue-wrapper');
        const buttonDiv = document.createElement('div');
        buttonDiv.classList.add('btn-container');
 
        // sliderChart
        let slideCount = slideCards.children.length;
        const pTagDiv = document.createElement('div');
        pTagDiv.classList.add('numberChart');
 
        for (let i = 1; i <= slideCount; i++) {
            let countChart = document.createElement('p');
            countChart.innerHTML = `0${i}`;
            countChart.style.display = 'contents';
            countChart.classList.add(`card-0${i}`);
            pTagDiv.append(countChart);
        }
 
        // Add click event listener to each p tag
        pTagDiv.querySelectorAll('p').forEach((element, index) => {
            element.addEventListener('click', () => {
                console.log(`Clicked element index: ${index}`);
                showSlide(index); // Move slide based on the clicked p tag's index
            });
        });
 
        // left shift button
        let leftBtn = document.createElement('button');
        leftBtn.innerHTML = '&#10094';
        leftBtn.style.width = '20px';
        leftBtn.classList.add("prev");
        buttonDiv.appendChild(leftBtn);
 
        // add chart list
        buttonDiv.appendChild(pTagDiv);
 
        // right shift button
        let rightBtn = document.createElement('button');
        rightBtn.innerHTML = '&#10095';
        rightBtn.style.width = '20px';
        rightBtn.classList.add("next");
        buttonDiv.appendChild(rightBtn);
 
        parentBlockDiv.prepend(buttonDiv);
 
        leftBtn.addEventListener('click', () => {
            moveSlide(-1);
        });
 
        rightBtn.addEventListener('click', () => {
            moveSlide(1);
        });
 
        let currentSlide = 0;
 
        function moveSlide(n) {
            showSlide(currentSlide + n);
        }
 
        function showSlide(index) {
            if (index >= slideCards.children.length) {
                currentSlide = 0;
            } else if (index < 0) {
                currentSlide = slideCards.children.length - 1;
            } else {
                currentSlide = index;
            }
 
            let parentNumber = document.querySelector('.numberChart');
 
            for (let i = 0; i < parentNumber.children.length; i++) {
                parentNumber.children[i].classList.remove('currentnode', 'underline');
            }
 
            parentNumber.children[currentSlide].classList.add('currentnode', 'underline');
 
            for (let j = 0; j < block.children.length; j++) {
                block.children[j].classList.add('hidecards');
            }
 
            block.children[currentSlide].classList.remove('hidecards');
        }
 
        moveSlide(0);
 
        // Add touch/swipe functionality
        let startX = 0;
        let endX = 0;
 
        slideCards.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
 
        slideCards.addEventListener('touchmove', (e) => {
            endX = e.touches[0].clientX;
        });
 
        slideCards.addEventListener('touchend', () => {
            if (startX - endX > 50) {
                moveSlide(1); // swipe left, move to next slide
            } else if (endX - startX > 50) {
                moveSlide(-1); // swipe right, move to previous slide
            }
        });
    }
 
    // Function to remove mobile view handlers
    function removeMobileView() {
        // Remove buttons and other elements added for mobile view
        const buttonDiv = document.querySelector('.btn-container');
        if (buttonDiv) {
            buttonDiv.remove();
        }
 
        // Remove added classes and event listeners if needed
        const slideCards = document.querySelector('.career-value-cards');
        if (slideCards) {
            slideCards.removeEventListener('touchstart', () => {});
            slideCards.removeEventListener('touchmove', () => {});
            slideCards.removeEventListener('touchend', () => {});
        }
 
        const blockChildren = block.querySelectorAll('.career-child-cards');
        blockChildren.forEach((child) => {
            child.classList.remove('hidecards');
        });
    }
 
    function handleResize() {
        if (document.documentElement.clientWidth <= 768) {
            removeMobileView();
            handleMobileView();
        } else {
            removeMobileView();
            // Ensure all cards are visible in desktop mode
            const blockChildren = block.querySelectorAll('.career-inner-child-cards');
            blockChildren.forEach((child) => {
                child.classList.remove('hidecards');
            });
        }
    }
 
    // Add classes to block and its children
    let blockDiv = block.children;
    for (let i = 0; i < blockDiv.length; i++) {
        let childDiv = blockDiv[i];
        childDiv.classList.add('career-child-cards');
 
        if (childDiv.children) {
            let innerChildDiv = childDiv.children;
            for (let j = 0; j < innerChildDiv.length; j++) {
                innerChildDiv[j].classList.add('career-inner-child-cards');
            }
        }
    }
 
    // Initial check
    handleResize();
 
    // Listen for resize events
    window.addEventListener('resize', handleResize);
}