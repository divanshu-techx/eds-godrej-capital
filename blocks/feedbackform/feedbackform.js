import { createForm } from '/blocks/form/form.js';

export default async function decorate(block) {
    console.log(block);
    const blockEle = block.closest('.section.feedbackform-container');
    console.log(block.parentElement.nextElementSibling);

    const feedbackAttributes = extractValuesOfSectionMetadata(blockEle);
    console.log(feedbackAttributes);

    const form = await createForm("https://main--eds-godrej-capital--divanshu-techx.hlx.page/feedback-form/feedback-excel.json");

    const feedbackBtn = createButton(feedbackAttributes.feedbackTitleButton, 'feedback-title-btn');
    block.appendChild(feedbackBtn);

    // create parent container div
    const parentContainerDiv = createContainer('parentContainerDiv');

    // create heading container div which contain title and description
    const headingContainerDiv = createContainer('headingContainerDiv');

    // create heading title div
    const headingTitleDiv = createContainer('headingTitleDiv');

    // create heading description div
    const headingDescriptionDiv = createContainer('headingDescriptionDiv');

    // create a dynamic div which have data change accordingly btn click
    const dynamicDiv = createContainer('dynamicDiv');

 


    // feedback click event
    document.getElementById('feedback-title-btn').addEventListener('click', function() {
       // getWelocomeContainer(form, block);
        forEmptyDiv(headingTitleDiv, headingDescriptionDiv, dynamicDiv);

        forWelcomeContainer(feedbackAttributes, headingTitleDiv, headingDescriptionDiv,
             headingContainerDiv, parentContainerDiv, block);

        forCreatePagination(dynamicDiv, feedbackAttributes, parentContainerDiv, block, form);
        //this.style = 'display:none';
        parentContainerDiv.style = 'display:block';
    });

}

// function for empty div
function forEmptyDiv (headingTitleDiv, headingDescriptionDiv, dynamicDiv) {
    headingTitleDiv.innerHTML = '';
    headingDescriptionDiv.innerHTML = '';
    dynamicDiv.innerHTML = '';
}

// function create div's
function createContainer(className) {
    const containerDiv = document.createElement('div');
    containerDiv.className = className;
    return containerDiv
}

// function create buttons
function createButton (feedBackValue, idValue) {    
    const button = document.createElement('button');
    button.textContent = feedBackValue;
    button.id = idValue;
    button.className = idValue;
    return button;
}

// get value from section metadata
function extractValuesOfSectionMetadata(blockEle) {
    return {
        feedbackTitleButton: blockEle.getAttribute('data-feedbackbuttontitle'),
        feedbackTitle: blockEle.getAttribute('data-feedbackTitle'),
        feedbackDescription: blockEle.getAttribute('data-feedbackDescription'),
        minReviewCount: blockEle.getAttribute('data-minReviewCount'),
        maxReviewCount: blockEle.getAttribute('data-maxReviewCount'),
        lessLikelyLabel: blockEle.getAttribute('data-lessLikelyLabel'),
        moreLikelyLabel: blockEle.getAttribute('data-moreLikelyLabel'),
        laterButtonLabel: blockEle.getAttribute('data-laterButtonLabel'),
        reviewsubmitButtonLabel: blockEle.getAttribute('data-reviewsubmitButtonLabel'),
        reviewDescription : blockEle.getAttribute('data-reviewDescription')
    };
}

// to show welcome container div first view on feedback click
function forWelcomeContainer(feedbackAttributes, headingTitleDiv, headingDescriptionDiv, headingContainerDiv, parentContainerDiv, block) {
    const headingTitle = document.createElement('h4');
    headingTitle.textContent = feedbackAttributes.feedbackTitle;
    headingTitle.className = 'headingTitle';
    headingTitleDiv.appendChild(headingTitle);

    const headingDescription = document.createElement('p');
    headingDescription.textContent = feedbackAttributes.feedbackDescription;
    headingDescription.className = 'headingDescription';
    headingDescriptionDiv.appendChild(headingDescription);

    headingContainerDiv.appendChild(headingTitleDiv);
    headingContainerDiv.appendChild(headingDescriptionDiv);

    parentContainerDiv.appendChild(headingContainerDiv);
    
    block.appendChild(parentContainerDiv);

}

function forCreatePagination (dynamicDiv, feedbackAttributes, parentContainerDiv, block, form) {
        // for rating points
        const ratingContainer = createContainer('ratingContainer');
        const paginationDiv = createContainer('paginationDiv');
        const lessMoreLikeLabelDiv = createContainer('lessMoreLikeLabelDiv');
    
        let minLimit = parseInt(feedbackAttributes.minReviewCount),
        maxLimit = parseInt(feedbackAttributes.maxReviewCount);
    
        for (let i = minLimit ; i <= maxLimit ; i++) {
            let label = document.createElement('label');
            label.textContent = i + ' ';
            
            let input = document.createElement('input');
            input.type = 'radio';
            input.name = 'rating';
            input.value = i;
            
            label.appendChild(input);
            paginationDiv.appendChild(label);
        }
    
        const lessLiskely = document.createElement('p');
        lessLiskely.textContent = feedbackAttributes.lessLikelyLabel;
        lessLiskely.className = 'lessLikely';
        lessMoreLikeLabelDiv.appendChild(lessLiskely);
    
        const moreLikely = document.createElement('p');
        moreLikely.textContent = feedbackAttributes.moreLikelyLabel;
        moreLikely.className = 'moreLikely';
        lessMoreLikeLabelDiv.appendChild(moreLikely);
        
        ratingContainer.appendChild(paginationDiv);
        ratingContainer.appendChild(lessMoreLikeLabelDiv);
    
        // create div container for button which contain later and submit button
        const laterButtonContainer = createContainer('laterButtonContainer');

        const laterBtn = document.createElement('p');
        laterBtn.textContent = feedbackAttributes.laterButtonLabel;
        laterBtn.className = 'feedback-later-btn';
        const submitRatingButton = createButton(feedbackAttributes.reviewsubmitButtonLabel, 'feedback-rating-button');

        laterButtonContainer.appendChild(laterBtn);
        laterButtonContainer.appendChild(submitRatingButton);

        dynamicDiv.appendChild(ratingContainer);
        dynamicDiv.appendChild(laterButtonContainer);

        parentContainerDiv.appendChild(dynamicDiv);
        block.appendChild(parentContainerDiv);

        // Add the event listener here
        laterBtn.addEventListener('click', function() {
            parentContainerDiv.style.display = 'none';
            block.querySelector('.feedback-title-btn').style = 'display: block';
        });

        submitRatingButton.addEventListener('click', function() {
         dynamicDiv.innerHTML = '';
         dynamicDiv.appendChild(form);
         parentContainerDiv.appendChild(dynamicDiv);
         block.appendChild(parentContainerDiv);
         forFeedback(dynamicDiv, block);
        })
}

// function for feedback checkbox
function forFeedback (dynamicDiv, block) {

    const submitDiv = block.querySelector('.feedback-checkbox-class.field-wrapper.submit-wrapper');
    const descriptionDiv = block.querySelector('.feedback-description.field-wrapper.text-area-wrapper');
    // set attribute in mobile field
    const mobileNoDiv = block.querySelector('#form-mobilenumber');
    mobileNoDiv.setAttribute('maxlength','10');
    console.log(mobileNoDiv);
    mobileNoDiv.addEventListener('input', function() {
    // Remove any non-numeric characters using regex
    this.value = this.value.replace(/\D/g, '');

    // Limit the input to 10 characters
    if (this.value.length > 10) {
        this.value = this.value.slice(0, 10);
    }
    });

    // set attribute in full name field
    const fullNameField = block.querySelector('#form-fullname');
    fullNameField.addEventListener('input', function() {
        this.value = this.value.replace(/[^a-zA-Z]/g, '');
    });
    if(!submitDiv) {
        return; 
    } else {
        const button = submitDiv.querySelector('button');
        if (!button){
            return;
        } else {
            button.disabled = true;
            const fieldset = block.querySelector('#form-feedback-checkbox');
            if (!fieldset) {
              return;
            } else {
                const checkboxes = fieldset.querySelectorAll('input[type="checkbox"]');               
                const otherCheckbox = block.querySelector('input[value="Other"]');
                // Attach change event listeners to each checkbox
                checkboxes.forEach(checkbox => {
                    checkbox.addEventListener('change', function() {
                        // Check if any checkbox is checked
                        const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
                        // Enable or disable the button based on the checkbox state
                        button.disabled = !anyChecked;

                         // Show or hide the description div based on the "Other" checkbox
                         if (checkbox === otherCheckbox && checkbox.checked) {
                            descriptionDiv.style.display = 'block';
                            descriptionDiv.querySelector('textarea').value = '';
                        } else if (!otherCheckbox.checked) {
                            // If "Other" checkbox is unchecked, hide description box
                            descriptionDiv.style.display = 'none';
                        }
                    });
                });
            }
            // feedback submit buttn click event
            button.addEventListener('click', function(event) {
                event.preventDefault();
                let getCheckValue = clickEventOnFeedbackSubmitBtn(fieldset, block, descriptionDiv);
                if (getCheckValue[0]) {
                    let checkedFeildArr = getCheckValue[1];
                    forFormFields(block, descriptionDiv, submitDiv, checkedFeildArr);
                } else {
                    console.log('further functionality not occur');
                }
            });
        }
    }
}

// function for feedback submit button click event
function clickEventOnFeedbackSubmitBtn (fieldset, block, descriptionDiv) {
    const checkedCheckboxes = fieldset.querySelectorAll('input[type="checkbox"]:checked');
    const checkedValues = Array.from(checkedCheckboxes).map(checkbox => checkbox.value);
    console.log('Checked values:', checkedValues);
    if (descriptionDiv.style.display === 'block') {
    const textAreaDiv = descriptionDiv.querySelector('textarea');
    const descLimit = descriptionDiv.querySelector('label').textContent;
    let descArr = descLimit.split('/');
    let descMinLimit = parseInt(descArr[0]);
    let descMaxLimit = parseInt(descArr[1]);
    var descriptionReview = textAreaDiv.value;
     if (!descriptionReview) {
        console.log('please write feedback in description box');
        return false;
     } else {
        if (!(descriptionReview.length > descMinLimit && descriptionReview.length <= descMaxLimit)) {
           console.log('Limit is exceed');
           return false;
        }
     }
    }   
    return [true, checkedValues];
}

// function for form when it show on click of feedback submit button
function forFormFields(block, descriptionDiv, submitDiv, checkedFeildArr) {
    console.log(checkedFeildArr);
    block.querySelector('.headingContainerDiv').style = 'display:none';
    block.querySelector('.feedback-checkbox-fieldset.field-wrapper.fieldset-wrapper').style = 'display:none';
    descriptionDiv.style = 'display:none';
    submitDiv.style = 'display:none';

    const formContainerDiv = block.querySelector('.feedback-form-fieldset.field-wrapper.fieldset-wrapper');
    formContainerDiv.style = 'display:block';
     // Hide all elements with class 'feedback-error-msg' inside formContainerDiv
     const errorMessages = formContainerDiv.querySelectorAll('.feedback-error-msg');
     errorMessages.forEach(element => {
         element.style.display = 'none';
     });

     const formSubmitBtnEle = formContainerDiv.querySelector('.field-wrapper.submit-wrapper.feedback-submit-btn');
     const formSubmitBtn = formSubmitBtnEle.querySelector('button');

     formSubmitBtn.addEventListener('click', function(event) {
        event.preventDefault(); 
        console.log('form submit btn');
        if(validateForm(formContainerDiv)){
         console.log('form is submitted'); 
         const thankyouDiv = block.parentElement.nextElementSibling;
         thankyouDiv.style = 'display:block';
        } else {
            console.log('form is not submitted some error');
        }
    });

    
}

// function for form validation
function validateForm(formContainerDiv) {
    const inputFieldsDivs = formContainerDiv.querySelectorAll('.feedback-input-field');
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
                errorMsg.style.display = 'block';
                isFormValid = false;
            } else if (inputField.name === 'fullName' && !nameRegex.test(value)) {
                errorMsg.style.display = 'block';
                isFormValid = false;
            } else if (inputField.name === 'mobileNumber' && !mobileRegex.test(value)) {
                errorMsg.style.display = 'block';
                isFormValid = false;
            } else if (inputField.name === 'emailId' && !emailRegex.test(value)) {
                errorMsg.style.display = 'block';
                isFormValid = false;
            } else {
                errorMsg.style.display = 'none';
            }
        }
    });

    return isFormValid;
}
