export function restrictNameInputs(block) {
  const usernameInput = block.querySelector('#form-username');
  usernameInput.addEventListener('input', () => {
    // Remove non-alphabetic characters
    usernameInput.value = usernameInput.value.replace(/[^a-zA-Z\s]/g, '');
  });
}

export function restrictPhoneNumberInputs(block) {
  block.querySelectorAll('input[type="tel"]').forEach((input) => {
    input.addEventListener('input', () => {
      // Remove non-numeric characters
      input.value = input.value.replace(/[^0-9]/g, '');
      // Limit to 10 digits
      if (input.value.length > 10) {
        input.value = input.value.slice(0, 10);
      }
    });
  });
}

export function handleErrorMessages(condition, fieldset, errorMessageText) {
  let errorMessage = fieldset.nextElementSibling;

  if (!condition) {
    if (!errorMessage || !errorMessage.classList.contains('error-message')) {
      errorMessage = document.createElement('div');
      errorMessage.textContent = errorMessageText;
      errorMessage.classList.add('error-message');
      fieldset.insertAdjacentElement('afterend', errorMessage);
    }
    return false;
  }
  if (errorMessage && errorMessage.classList.contains('error-message')) {
    errorMessage.remove();
  }
  return true;
}

// Function to validate name
// export function validateNameField(nameField, errorMessage) {
//   if (nameField.value.trim() === '') {
//     handleErrorMessages(false, nameField, errorMessage);
//     return false;
//   } else {
//     handleErrorMessages(true, nameField);
//     return true;
//   }
// }

export function validateNameField(nameField, errorMessage) {
  if (nameField.value.trim() === '') {
    handleErrorMessages(false, nameField, errorMessage);
    return false;
  }
  // No need for 'else' since we already return in the 'if' block
  handleErrorMessages(true, nameField);
  return true;
}

// Function to validate email
export function validateEmail(emailField, errorMessage) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(emailField.value)) {
    handleErrorMessages(false, emailField, errorMessage);
    return false;
  }
  handleErrorMessages(true, emailField);
  return true;
}

// Function to validate mobile number
export function validateMobileNumber(mobileField, errorMsg) {
  const mobilePattern = /^[0-9]{10}$/;
  if (!mobilePattern.test(mobileField.value)) {
    handleErrorMessages(false, mobileField, errorMsg);
    return false;
  }
  handleErrorMessages(true, mobileField);
  return true;
}

// Function to validate the dropdown
export function validateLoanProducts(locationDropdown, errorMessage) {
  const selectedValue = locationDropdown.value;

  if (selectedValue === '') {
    handleErrorMessages(false, locationDropdown, errorMessage);
    return false;
  }
  handleErrorMessages(true, locationDropdown);
  return true;
}

// Function to disable or enable the submit button based on form validation
export function toggleSubmitButton(block, formSelector, submitButton) {
  const inputs = Array.from(block.querySelectorAll(`${formSelector} input, ${formSelector} select, ${formSelector} textarea`));

  // Check if all inputs are valid
  const allValid = inputs.every(input => {
    if (input.type === 'checkbox') {
      // Check if at least one radio button in the group is selected
      const radioGroup = block.querySelectorAll(`${formSelector} input[type="checkbox"]`);
      return Array.from(radioGroup).some(radio => radio.checked);
    } else if (input.type === 'text' || input.type === 'email' || input.type === 'tel' || input.tagName === 'SELECT' || input.tagName === 'TEXTAREA') {
      return input.value.trim() !== '';
    }
    return true;
  });

  // Enable or disable the submit button
  submitButton.disabled = !allValid;
}

// Initialize form validation with disabling the submit button initially
export function initFormValidation(block, formSelector, submitButtonSelector) {
  const submitButton = block.querySelector(submitButtonSelector);

  // Initially disable the submit button
  submitButton.disabled = true;

  // Add event listeners to all form inputs to check their state
  block.querySelectorAll(`${formSelector} input, ${formSelector} select, ${formSelector} textarea`).forEach(input => {
    const eventType = input.type === 'checkbox' ? 'change' : 'input';
    input.addEventListener(eventType, () => {
      toggleSubmitButton(block, formSelector, submitButton);
    });
  });
  // If you want to check on page load as well
  toggleSubmitButton(block, formSelector, submitButton);
}

