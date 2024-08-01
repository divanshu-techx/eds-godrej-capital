import { createForm } from '/blocks/form/form.js';

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
    reviewDescription: blockEle.getAttribute('data-reviewDescription'),
    formJsonApi: blockEle.getAttribute('data-jsonFormApi'),
  };
}

// function create buttons
function createButton(feedBackValue, idValue) {
  const button = document.createElement('button');
  button.textContent = feedBackValue;
  button.id = idValue;
  button.className = idValue;
  return button;
}

// function create div's
function createContainer(className) {
  const containerDiv = document.createElement('div');
  containerDiv.className = className;
  return containerDiv;
}

// function for empty div
function forEmptyDiv(headingTitleDiv, headingDescriptionDiv, dynamicDiv) {
  headingTitleDiv.innerHTML = '';
  headingDescriptionDiv.innerHTML = '';
  dynamicDiv.innerHTML = '';
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
  headingContainerDiv.style = 'display:block';
  parentContainerDiv.appendChild(headingContainerDiv);
  block.appendChild(parentContainerDiv);
}

// function on click of submit rating button and show feedback pop up
function showFeedBackPopUp(block, dynamicDiv, parentContainerDiv, form, feedbackAttributes) {
  dynamicDiv.innerHTML = '';
  dynamicDiv.appendChild(form);

  const headingDescriptionDiv = block.querySelector('.headingDescriptionDiv');
  headingDescriptionDiv.innerHTML = '';

  const headingDescription = document.createElement('p');
  headingDescription.textContent = feedbackAttributes.reviewDescription;
  headingDescription.className = 'headingDescription';
  headingDescriptionDiv.appendChild(headingDescription);

  block.querySelector('.headingContainerDiv').style = 'display:block';
  block.querySelector('.feedback-checkbox-fieldset').style = 'display:block';
  block.querySelector('.feedback-checkbox-class.field-wrapper.submit-wrapper').style = 'display:block';
  block.querySelector('.feedback-form-fieldset').style = 'display:none';
  block.querySelector('.button-fieldset').style = 'display:none';
  parentContainerDiv.appendChild(dynamicDiv);
  block.appendChild(parentContainerDiv);
}

// Function to reset checkboxes
function resetCheckboxes(checkboxes) {
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
}

// function for feedback submit button click event
function clickEventOnFeedbackSubmitBtn(fieldset, block, descriptionDiv) {
  const checkedCheckboxes = fieldset.querySelectorAll('input[type="checkbox"]:checked');
  const checkedValues = Array.from(checkedCheckboxes).map((checkbox) => checkbox.value);

  if (descriptionDiv.style.display === 'block') {
    const textAreaDiv = descriptionDiv.querySelector('textarea');
    const descLimit = descriptionDiv.querySelector('label').textContent;
    const descArr = descLimit.split('/');
    const descMinLimit = parseInt(descArr[0], 10);
    const descMaxLimit = parseInt(descArr[1], 10);
    const descriptionReview = textAreaDiv.value;

    const emptyErrorMsg = block.querySelector('.description-empty-err-msg');
    const limitErrorMsg = block.querySelector('.description-limit-err-msg');

    // Hide error messages when the user starts typing
    textAreaDiv.addEventListener('input', () => {
      emptyErrorMsg.style.display = 'none';
      limitErrorMsg.style.display = 'none';
    });

    if (!descriptionReview) {
      emptyErrorMsg.style.display = 'block';
      return false;
    } else {
      if (!(descriptionReview.length > descMinLimit && descriptionReview.length <= descMaxLimit)) {
        limitErrorMsg.style.display = 'block';
        return false;
      }
    }
  }
  return [true, checkedValues];
}

// function to reset the input fields
function resetInputField(formContainerDiv) {
  const inputFieldsDivs = formContainerDiv.querySelectorAll('.feedback-input-field');
  inputFieldsDivs.forEach((element) => {
    const inputField = element.querySelector('input');
    if (inputField) {
      inputField.value = '';
    }
  });
}

// function forThankyou Pop up is shown when user click on skip button or submit button
function showThankYouPopUp(block) {
  const thankyouDiv = block.parentElement.nextElementSibling;
  thankyouDiv.style = 'display:block';
  block.querySelector('.parentContainerDiv').style = 'display:none';
}

// function for form validation
function validateForm(formContainerDiv) {
  const inputFieldsDivs = formContainerDiv.querySelectorAll('.feedback-input-field');
  let isFormValid = true;

  inputFieldsDivs.forEach((element) => {
    const inputField = element.querySelector('input');
    const errorMsg = element.nextElementSibling;

    // Attach input event listener to hide error message when user starts typing
    inputField.addEventListener('input', () => {
      errorMsg.style.display = 'none';
      inputField.classList.remove('error-msg-active');
      errorMsg.classList.remove('error-msg-show');
    });

    if (inputField && errorMsg) {
      const value = inputField.value.trim();

      const nameRegex = /^[a-zA-Z\s]{2,50}$/;
      const mobileRegex = /^[0-9]{10}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Check if the input field is empty or does not match the regex pattern
      if (value === '') {
        errorMsg.style.display = 'block';
        inputField.classList.add('error-msg-active');
        errorMsg.classList.add('error-msg-show');
        isFormValid = false;
      } else if (inputField.name === 'fullName' && !nameRegex.test(value)) {
        errorMsg.style.display = 'block';
        inputField.classList.add('error-msg-active');
        errorMsg.classList.add('error-msg-show');
        isFormValid = false;
      } else if (inputField.name === 'mobileNumber' && !mobileRegex.test(value)) {
        errorMsg.style.display = 'block';
        inputField.classList.add('error-msg-active');
        errorMsg.classList.add('error-msg-show');
        isFormValid = false;
      } else if (inputField.name === 'emailId' && !emailRegex.test(value)) {
        errorMsg.style.display = 'block';
        inputField.classList.add('error-msg-active');
        errorMsg.classList.add('error-msg-show');
        isFormValid = false;
      } else {
        inputField.classList.remove('error-msg-active');
        errorMsg.classList.remove('error-msg-show');
        errorMsg.style.display = 'none';
      }
    }
  });
  return isFormValid;
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
  const formBtnContainer = block.querySelector('.button-fieldset.field-wrapper.fieldset-wrapper');
  formBtnContainer.style = 'display:block';
  resetInputField(formContainerDiv);
  // Hide all elements with class 'feedback-error-msg' inside formContainerDiv
  const errorMessages = formContainerDiv.querySelectorAll('.feedback-error-msg');
  errorMessages.forEach((element) => {
    element.style.display = 'none';
  });

  const skipBtnDiv = formBtnContainer.querySelector('.feedback-skip-btn');
  const skipBtn = skipBtnDiv.querySelector('button');

  const formSubmitBtnEle = formBtnContainer.querySelector('.field-wrapper.submit-wrapper.feedback-submit-btn');
  const formSubmitBtn = formSubmitBtnEle.querySelector('button');

  skipBtn.addEventListener('click', (event) => {
    event.preventDefault();
    showThankYouPopUp(block);
  });

  formSubmitBtn.addEventListener('click', (event) => {
    event.preventDefault();
    if (validateForm(formContainerDiv)) {
      showThankYouPopUp(block);
    } else {
      console.log('form is not submitted some error');
    }
  });
}

// function for feedback checkbox
function forFeedback(block) {
  const submitDiv = block.querySelector('.feedback-checkbox-class.field-wrapper.submit-wrapper');
  const descriptionDiv = block.querySelector('.feedback-description.field-wrapper.text-area-wrapper');

  // set attribute in mobile field
  const mobileNoDiv = block.querySelector('#form-mobilenumber');
  mobileNoDiv.setAttribute('maxlength', '10');
  mobileNoDiv.addEventListener('input', function () {
    // Remove any non-numeric characters using regex
    this.value = this.value.replace(/\D/g, '');

    // Limit the input to 10 characters
    if (this.value.length > 10) {
      this.value = this.value.slice(0, 10);
    }
  });

  // set attribute in full name field
  const fullNameField = block.querySelector('#form-fullname');
  fullNameField.addEventListener('input', function () {
    this.value = this.value.replace(/[^a-zA-Z]/g, '');
  });

  if (!submitDiv) {
    return;
  } else {
    const button = submitDiv.querySelector('button');
    if (!button) {
      return;
    } else {
      button.disabled = true;
      const fieldset = block.querySelector('#form-feedback-checkbox');
      if (!fieldset) {
        return;
      } else {
        const checkboxes = fieldset.querySelectorAll('input[type="checkbox"]');
        resetCheckboxes(checkboxes);
        const otherCheckbox = block.querySelector('input[value="Other"]');
        // Attach change event listeners to each checkbox
        checkboxes.forEach((checkbox) => {
          checkbox.addEventListener('change', () => {
            // Check if any checkbox is checked
            const anyChecked = Array.from(checkboxes).some((cb) => cb.checked);
            // Enable or disable the button based on the checkbox state
            button.disabled = !anyChecked;

            // Show or hide the description div based on the 'Other' checkbox
            if (checkbox === otherCheckbox && checkbox.checked) {
              descriptionDiv.style.display = 'block';
              descriptionDiv.querySelector('textarea').value = '';
            } else if (!otherCheckbox.checked) {
              // If 'Other' checkbox is unchecked, hide description box
              descriptionDiv.style.display = 'none';
              block.querySelector('.description-empty-err-msg').style = 'display:none';
              block.querySelector('.description-limit-err-msg').style = 'display:none';
            }
          });
        });
      }
      // feedback submit buttn click event
      button.addEventListener('click', (event) => {
        event.preventDefault();
        const getCheckValue = clickEventOnFeedbackSubmitBtn(fieldset, block, descriptionDiv);
        if (getCheckValue[0]) {
          const checkedFeildArr = getCheckValue[1];
          forFormFields(block, descriptionDiv, submitDiv, checkedFeildArr);
        } else {
          console.log('further functionality not occur');
        }
      });
    }
  }
}

function forCreateRatingRadioBtn(dynamicDiv, feedbackAttributes, parentContainerDiv, block, form) {
  // for rating points
  var ratingNumber;
  const ratingContainer = createContainer('ratingContainer');
  const ratingDiv = createContainer('ratingDiv');
  const lessMoreLikeLabelDiv = createContainer('lessMoreLikeLabelDiv');
  const submitRatingButton = createButton(feedbackAttributes.reviewsubmitButtonLabel, 'feedback-rating-button');
  submitRatingButton.disabled = true;

  let minLimit = parseInt(feedbackAttributes.minReviewCount, 10),
    maxLimit = parseInt(feedbackAttributes.maxReviewCount, 10);

  for (let i = minLimit; i <= maxLimit; i++) {
    const label = document.createElement('label');
    label.textContent = i + ' ';

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'rating';
    input.value = i;

    label.appendChild(input);
    ratingDiv.appendChild(label);

    input.addEventListener('change', () => {
      // Enable the submit button if any radio button is checked
      ratingNumber = input.value;
      submitRatingButton.disabled = false;
    });
  }

  const lessLiskely = document.createElement('p');
  lessLiskely.textContent = feedbackAttributes.lessLikelyLabel;
  lessLiskely.className = 'lessLikely';
  lessMoreLikeLabelDiv.appendChild(lessLiskely);

  const moreLikely = document.createElement('p');
  moreLikely.textContent = feedbackAttributes.moreLikelyLabel;
  moreLikely.className = 'moreLikely';
  lessMoreLikeLabelDiv.appendChild(moreLikely);

  ratingContainer.appendChild(ratingDiv);
  ratingContainer.appendChild(lessMoreLikeLabelDiv);

  // create div container for button which contain later and submit button
  const laterButtonContainer = createContainer('laterButtonContainer');

  const laterBtn = document.createElement('p');
  laterBtn.textContent = feedbackAttributes.laterButtonLabel;
  laterBtn.className = 'feedback-later-btn';

  laterButtonContainer.appendChild(laterBtn);
  laterButtonContainer.appendChild(submitRatingButton);

  dynamicDiv.appendChild(ratingContainer);
  dynamicDiv.appendChild(laterButtonContainer);

  parentContainerDiv.appendChild(dynamicDiv);
  block.appendChild(parentContainerDiv);

  // Add the event listener here
  laterBtn.addEventListener('click', () => {
    parentContainerDiv.style.display = 'none';
    block.querySelector('.feedback-title-btn').style = 'display: block';
  });

  submitRatingButton.addEventListener('click', () => {
    showFeedBackPopUp(block, dynamicDiv, parentContainerDiv, form, feedbackAttributes);
    forFeedback(block);
  });
}

export default async function decorate(block) {
  const blockEle = block.closest('.section.feedbackform-container');

  const feedbackAttributes = extractValuesOfSectionMetadata(blockEle);

  // const formJsonApi = feedbackAttributes.formJsonApi;
  const { formJsonApi } = feedbackAttributes;
  const form = await createForm(formJsonApi);

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

  // Create collapse button
  const collapseButton = document.createElement('button');
  collapseButton.className = 'collapse-button';
  const collapseBtnIcon = document.createElement('img');
  collapseBtnIcon.classList.add('collapse-btn-icon');
  // collapseBtnIcon.src = '../../icons/greater-then-icon.png'
  collapseBtnIcon.setAttribute('src', '../../icons/greater-then-icon.png');
  collapseButton.appendChild(collapseBtnIcon);
  // collapseButton.textContent = '>';
  parentContainerDiv.appendChild(collapseButton);

  // feedback click event
  document.getElementById('feedback-title-btn').addEventListener('click', function () {
    forEmptyDiv(headingTitleDiv, headingDescriptionDiv, dynamicDiv);

    forWelcomeContainer(
      feedbackAttributes,
      headingTitleDiv,
      headingDescriptionDiv,
      headingContainerDiv,
      parentContainerDiv,
      block,
    );

    forCreateRatingRadioBtn(dynamicDiv, feedbackAttributes, parentContainerDiv, block, form);
    parentContainerDiv.style = 'display:block';
    parentContainerDiv.classList.add('visible-parent');
    this.style = 'display:none';
  });

  collapseButton.addEventListener('click', () => {
    parentContainerDiv.classList.remove('visible-parent');
    // parentContainerDiv.style.display = 'none';
    document.getElementById('feedback-title-btn').style.display = 'block';
  });
}
