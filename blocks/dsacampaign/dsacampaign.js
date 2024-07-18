import { createForm } from '/blocks/form/form.js';

export default async function decorate(block) {

const blockEle = block.closest('.section.dsacampaign-container');
const metadataAttributes = extractValuesOfSectionMetadata(blockEle);
const form = await createForm(metadataAttributes.dsaCampaignFormApi);

forFormFields(block, form, metadataAttributes);

}

// function for extract section metadata values 
function extractValuesOfSectionMetadata(blockEle) {
  return {
    dsaCampaignFormApi: blockEle.getAttribute('data-dsacampaignapi'),
    tncDescription: blockEle.getAttribute('data-tncdescription'),
    tncLabel: blockEle.getAttribute('data-tncLabel'),
    tncUrl: blockEle.getAttribute('data-tncUrl')
  };
}


// function for form pop up
function forFormFields(block, form, metadataAttributes) {

   block.appendChild(form);
   block.querySelector('.mobile-otp-fieldset').style.display = 'none';

   const formContainerDiv = block.querySelector('.form-fields-set');
   const proceedBtnDiv = block.querySelector('.dsa-proceed-btn');
   const proceedBtn = proceedBtnDiv.querySelector('button');
   proceedBtn.disabled = true;

   const tncContainerDiv = document.createElement('div');
   tncContainerDiv.className = 'tncContainerDiv';

   const tncDescriptionEle = document.createElement('p');
   tncDescriptionEle.textContent = metadataAttributes.tncDescription + ' ';

   const tncLabelEle = document.createElement('a');
   tncLabelEle.textContent = metadataAttributes.tncLabel;
   tncLabelEle.href = metadataAttributes.tncUrl;
   
// Append both elements to the container
tncContainerDiv.appendChild(tncDescriptionEle);
tncDescriptionEle.appendChild(tncLabelEle);

formContainerDiv.appendChild(tncContainerDiv);

   setAttributeInputField(formContainerDiv);

    // Hide all elements with class 'feedback-error-msg' inside formContainerDiv
    const errorMessages = formContainerDiv.querySelectorAll('.dsa-err-msg');
    errorMessages.forEach(element => {
        element.style.display = 'none';
    });

    // Add event listeners to input fields to enable submit button when form is valid
    const inputFieldsDivs = formContainerDiv.querySelectorAll('.dsa-input-field');
    inputFieldsDivs.forEach(element => {
        const inputField = element.querySelector('input');
        if (inputField) {
            inputField.addEventListener('input', () => {
                if (validateForm(formContainerDiv)) {
                    proceedBtn.disabled = false;
                } else {
                    proceedBtn.disabled = true;
                }
            });
        }
    });

    proceedBtn.addEventListener('click', function(event) {
        event.preventDefault();
        if (validateForm(formContainerDiv)) {
        console.log('form submitted');
          //  showThankYouPopUp(block);
        } else {
            console.log('form is not submitted some error');
        }
    });
}

// Function for form validation
function validateForm(formContainerDiv) {
    const inputFieldsDivs = formContainerDiv.querySelectorAll('.dsa-input-field');
    let isFormValid = true;

    inputFieldsDivs.forEach(element => {
        const inputField = element.querySelector('input');
        const errorMsg = element.nextElementSibling;

        // Attach input event listener to hide error message when user starts typing
        inputField.addEventListener('input', () => {
            errorMsg.style.display = 'none';
        });

        if (inputField && errorMsg) {
            const value = inputField.value.trim();

            const nameRegex = /^[a-zA-Z\s]{2,50}$/;
            const mobileRegex = /^[0-9]{10}$/;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            // Check if the input field is empty or does not match the regex pattern
            if (value === '') {
              //  errorMsg.style.display = 'block';
                isFormValid = false;
            } else if (inputField.name === 'name' && !nameRegex.test(value)) {
                errorMsg.style.display = 'block';
                isFormValid = false;
            } else if (inputField.name === 'mobileNumber' && !mobileRegex.test(value)) {
                errorMsg.style.display = 'block';
                isFormValid = false;
            } else if (inputField.name === 'mailId' && !emailRegex.test(value)) {
                errorMsg.style.display = 'block';
                isFormValid = false;
            } else {
                errorMsg.style.display = 'none';
            }
        }
    });

    return isFormValid;
}

// function set attribute
function setAttributeInputField(formContainerDiv) {
        // set attribute in mobile field
        const mobileNoDiv = formContainerDiv.querySelector('#form-mobilenumber-1');
        mobileNoDiv.setAttribute('maxlength','10');
        mobileNoDiv.addEventListener('input', function() {
        // Remove any non-numeric characters using regex
        this.value = this.value.replace(/\D/g, '');
    
        // Limit the input to 10 characters
        if (this.value.length > 10) {
            this.value = this.value.slice(0, 10);
        }
        });
    
        // set attribute in full name field
        const fullNameField = formContainerDiv.querySelector('#form-name-1');
        fullNameField.addEventListener('input', function() {
            this.value = this.value.replace(/[^a-zA-Z]/g, '');
        });

}
