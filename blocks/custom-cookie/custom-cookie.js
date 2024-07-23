// Function to set a cookie with a specific name, value, and expiry date
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Function to get the value of a cookie based on its name
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Function to add classes and toggle buttons
// function addClass(block) {
//     const defaultclass = ['custom-cookieHeading', 'custom-cookieDescription-top', 'custom-cookieDescription', 'function-cookie', 'perform-cookie', 'custom-cookieButton'];
//     const allDiv = block.querySelectorAll(':scope > div');

//     // Create a new div to wrap all default class elements
//     const wrapperDiv = document.createElement('div');
//     wrapperDiv.classList.add('default-custom-cookie-wrapper');

//     allDiv.forEach((element, index) => {
//         // Add class to element
//         if (defaultclass[index]) {
//             element.classList.add(defaultclass[index]);
//         }
//         // Append element to the wrapper div
//         wrapperDiv.appendChild(element);
//     });

//     // Clear the original content of block and append the new wrapper div
//     block.innerHTML = '';
//     block.appendChild(wrapperDiv);

//     // Add the close button in the custom-cookieHeading
//     const cookieHeadingMain = wrapperDiv.querySelector('.custom-cookieHeading');
//     if (cookieHeadingMain) {
//         const closeButton = document.createElement('button');
//         closeButton.classList.add('close-btn');
//         closeButton.textContent = 'X';
//         cookieHeadingMain.appendChild(closeButton);
//     } else {
//         console.log("No such element is present.");
//     }

//     // Replace all <p> elements with <button> elements in the .custom-cookieButton div
//     const cookieButtonDiv = wrapperDiv.querySelector('.custom-cookieButton');
//     if (cookieButtonDiv) {
//         const paragraphs = cookieButtonDiv.querySelectorAll('p');
//         const buttonClass = ['cookie-customize', 'custom-reject_cookie', 'custom-accept_cookie'];
//         const buttonIds = ['cookie-customize-btn', 'custom-reject-btn', 'custom-accept-btn'];

//         paragraphs.forEach((paragraph, index) => {
//             const button = document.createElement('button');
//             button.textContent = paragraph.textContent;
//             button.classList.add(buttonClass[index]);
//             button.id = buttonIds[index]; // Add ID to the button
//             paragraph.replaceWith(button);
//         });
//     }

//     // Create and append toggle button for function-cookie
//     const functionCookie = wrapperDiv.querySelector('.function-cookie');
//     if (functionCookie) {
//         const functionToggleBtn = createToggleButton('function-toggle-button');
//         functionCookie.appendChild(functionToggleBtn);
//     }

//     // Create and append toggle button for perform-cookie
//     const performCookie = wrapperDiv.querySelector('.perform-cookie');
//     if (performCookie) {
//         const performToggleBtn = createToggleButton('perform-toggle-button');
//         performCookie.appendChild(performToggleBtn);
//     }

//     // Add event listeners to the toggle buttons
//     const toggleButtons = wrapperDiv.querySelectorAll('.toggle-button');
//     toggleButtons.forEach(button => {
//         button.addEventListener('click', function() {
//             this.classList.toggle('active');
//         });
//     });

//     // Function to create a toggle button with a specific class
//     function createToggleButton(className) {
//         const button = document.createElement('div');
//         button.className = `toggle-btns ${className}`;
//         button.innerHTML = `
//             <input type="checkbox" class="toggleCheckbox" />
//             <label class="toggleContainer">
//                 <div><img src="/icons/closetoggle.png" alt="Toggle Image 1" width="20" height="20"></div>   
//                 <div><img src="/icons/ticktoggle.png" alt="Button Image" width="20" height="20"></div>
//             </label>
//         `;
//         return button;
//     }
// }
function addClass(block) {
    const defaultclass = ['custom-cookieHeading','custom-cookieHeadingDescription', 'custom-cookieDescription-top', 'custom-cookieDescription', 'function-cookie','function-cookie-description', 'perform-cookie','perform-cookie-description', 'custom-cookieButton'];
    const allDiv = Array.from(block.querySelectorAll(':scope > div'));
 
    // Create a new div to wrap all default class elements
    const wrapperDiv = document.createElement('div');
    wrapperDiv.classList.add('default-custom-cookie-wrapper');
 
    // Find and remove the custom-cookieButton div from allDiv
    let cookieButtonDiv = null;
    const remainingDivs = allDiv.filter((element, index) => {
        if (defaultclass[index] === 'custom-cookieButton') {
            cookieButtonDiv = element;
            return false;
        }
        return true;
    });
 
    // Add class to remaining elements and append to the wrapper div
    remainingDivs.forEach((element, index) => {
        if (defaultclass[index]) {
            element.classList.add(defaultclass[index]);
        }
        wrapperDiv.appendChild(element);
    });
 
    // Clear the original content of block and append the new wrapper div
    block.innerHTML = '';
    block.appendChild(wrapperDiv);
 
    // Add the custom-cookieButton div outside the wrapperDiv
    if (cookieButtonDiv) {
        cookieButtonDiv.classList.add('custom-cookieButton');
        block.appendChild(cookieButtonDiv);
    }
 
    // Add the close button in the custom-cookieHeading
    const cookieHeadingMain = wrapperDiv.querySelector('.custom-cookieHeading');
    if (cookieHeadingMain) {
        const closeButton = document.createElement('button');
        closeButton.classList.add('close-btn');
        closeButton.textContent = 'X';
        cookieHeadingMain.appendChild(closeButton);
    } else {
        console.log("No such element is present.");
    }
 
    // Replace all <p> elements with <button> elements in the .custom-cookieButton div
    if (cookieButtonDiv) {
        const paragraphs = cookieButtonDiv.querySelectorAll('p');
        const buttonClass = ['cookie-customize', 'custom-reject_cookie', 'custom-accept_cookie'];
        const buttonIds = ['cookie-customize-btn', 'custom-reject-btn', 'custom-accept-btn'];
 
        paragraphs.forEach((paragraph, index) => {
            const button = document.createElement('button');
            button.textContent = paragraph.textContent;
            button.classList.add(buttonClass[index]);
            button.id = buttonIds[index]; // Add ID to the button
            paragraph.replaceWith(button);
        });
    }
 
     // Create and append toggle button for function-cookie
     const functionCookie = block.querySelector('.function-cookie');
     const functionToggleBtn = createToggleButton('function-toggle-button');
     functionCookie.appendChild(functionToggleBtn);
 
     // Create and append toggle button for perform-cookie
     const performCookie = block.querySelector('.perform-cookie');
     const performToggleBtn = createToggleButton('perform-toggle-button');
     performCookie.appendChild(performToggleBtn);
 
    // Add event listeners to the toggle buttons
    const toggleButtons = wrapperDiv.querySelectorAll('.switch-button');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
 
    // Function to create a toggle button with a specific class and id
  // Function to create a toggle button with a specific class
  function createToggleButton(className) {
    const container = document.createElement('div');
    container.className = `switch-button ${className}`;

    const checkbox = document.createElement('input');
    checkbox.className = 'switch-button-checkbox';
    checkbox.type = 'checkbox';

    const label = document.createElement('label');
    label.className = 'switch-button-label';
    label.setAttribute('for', '');

    const span = document.createElement('span');
    span.className = 'switch-button-label-span';

    label.appendChild(span);
    container.appendChild(checkbox);
    container.appendChild(label);

    return container;
}
}
 

function hideCustomCookieModel(modelId) {
    console.log(modelId);
    modelId.style.display = 'none';
}

// Function to handle actions based on button clicks
function addAction(block) {
    const customizeBtn = block.querySelector('#cookie-customize-btn');
    const rejectBtn = block.querySelector('#custom-reject-btn');
    const acceptBtn = block.querySelector('#custom-accept-btn');
    const mainElement = document.querySelector('main');
    const cookieUsage = mainElement.querySelector('.cookie-usage');
    const closeButtonX = block.querySelector('.close-btn');
    const overlay = document.querySelector('.cookie-overlay');
    if (customizeBtn) {
        customizeBtn.addEventListener('click', function() {
            // Initialize toggle states object
            let toggleStates = {};
    
            // Gather toggle states for function-cookie
            const functionToggle = block.querySelector('.function-cookie .switch-button');
            if (functionToggle.classList.contains('active')) {
                toggleStates['function-cookie'] = true;
            }
    
            // Gather toggle states for perform-cookie
            const performToggle = block.querySelector('.perform-cookie .switch-button');
            if (performToggle.classList.contains('active')) {
                toggleStates['perform-cookie'] = true;
            }
    
    
            // Store toggleStates in cookie
            setCookie('customCookie-ToggleStates', JSON.stringify(toggleStates), 365);
            hideCookieBlock(block);
            hideCustomCookieModel(cookieUsage);
            overlay.style.display='none';
        });
    } else {
        console.log("There is no customize button present.");
    }
    if (rejectBtn) {
        rejectBtn.addEventListener('click', function() {
            setCookie('cookiesAccepted-customization', 'false', 365);
            hideCookieBlock(block);
            hideCustomCookieModel(cookieUsage);
            overlay.style.display='none';
        });
    } else {
        console.log("There is no reject button present.");
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
            const toggleButtons = block.querySelectorAll('.switch-button');
            const toggleStates = Array.from(toggleButtons).map(button => button.classList.contains('active'));

            setCookie('cookiesAccepted-customization', 'true', 365);
            setCookie('toggleStates', JSON.stringify(toggleStates), 365);
            hideCookieBlock(block);
            hideCustomCookieModel(cookieUsage);
            overlay.style.display='none';

        });
    } else {
        console.log("There is no accept button present.");
    }
    if(closeButtonX){
        closeButtonX.addEventListener('click',function(){ 
        hideCookieBlock(block);
        hideCustomCookieModel(cookieUsage); 
        overlay.style.display='none';
        })
    }else{
        console.log("There is no close button present.")
    }
}

function hideCookieBlock(block) {
    block.style.display = 'none';
}

export default function decorate(block) {
    addClass(block);
    const cookiesAccepted = getCookie('cookiesAccepted-customization');
    if (cookiesAccepted) {
        hideCookieBlock(block);
    }
    addAction(block);
}
