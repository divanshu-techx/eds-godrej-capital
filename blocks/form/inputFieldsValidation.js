export function restrictNameInputs(block) {
  const usernameInput = block.querySelector('#form-username');
  usernameInput.addEventListener('input', () => {
    // Remove non-alphabetic characters
    usernameInput.value = usernameInput.value.replace(/[^a-zA-Z\s]/g, '');
  });
}

export function restrictPhoneNumberInputs(block) {
  block.querySelectorAll('input[type="tel"]').forEach(input => {
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

// Function to validate name
export function validateNameField(nameField, errorMessage) {
  if (nameField.value.trim() === '') {
    handleErrorMessages(false, nameField, errorMessage);
    return false;
  } else {
    handleErrorMessages(true, nameField);
    return true;
  }
}

// Function to validate email
export function validateEmail(emailField, errorMessage) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(emailField.value)) {
    handleErrorMessages(false, emailField, errorMessage);
    return false;
  } else {
    handleErrorMessages(true, emailField);
    return true;
  }
}

// Function to validate mobile number
export function validateMobileNumber(mobileField, errorMsg) {
  const mobilePattern = /^[0-9]{10}$/;
  if (!mobilePattern.test(mobileField.value)) {
    handleErrorMessages(false, mobileField, errorMsg);
    return false;
  } else {
    handleErrorMessages(true, mobileField);
    return true;
  }
}

// Function to validate the dropdown
export function validateLoanProducts(locationDropdown, errorMessage) {
  const selectedValue = locationDropdown.value;

  if (selectedValue === '') {
    handleErrorMessages(false, locationDropdown, errorMessage);
    return false;
  } else {
    handleErrorMessages(true, locationDropdown);
    return true;
  }
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
  } else {
    if (errorMessage && errorMessage.classList.contains('error-message')) {
      errorMessage.remove();
    }
    return true;
  }
}
