import { createForm, generatePayload, handleSubmitError } from '../form/form.js';
import { getDataAttributes } from '../utils/common.js';

function getDataAttributeValueByName(name) {
  const element = document.querySelector(`[data-${name}]`);
  return element ? element.getAttribute(`data-${name}`) : '';
}
function getMetaTagsContentValueByName(name) {
  const el = document.querySelector(`meta[property="og:${name}"]`);
  return el ? el.getAttribute('content') : '';
}

const VALIDATION_DATA = [
  {
    fieldName: 'FullName',
    regexPattern: /^[A-Za-z\s]+$/,
    validationMessage: getDataAttributeValueByName('namevalidationerrormessage'),
  },
  {
    fieldName: 'EnterEmail',
    regexPattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    validationMessage: getDataAttributeValueByName('emailvalidationerrormessage'),
  },
  {
    fieldName: 'Mobile',
    regexPattern: /^[6789]\d{9}$/,
    validationMessage: getDataAttributeValueByName('mobilevalidationerrormessage'),
  },
];

export function ApiCall(METHOD, url, data) {
  // Return a promise
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: METHOD,
      headers: {
        'Content-Type': 'application/json',
        'auth-key': getDataAttributeValueByName('authkey'),
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            reject(err);
          });
        }
        return response.json();
      })
      .then((datajson) => resolve(datajson))
      .catch((error) => reject(error));
  });
}
export function toggleResendOTPClass(active) {
  const resendOtpParagraph = document.getElementById('form-message3');
  if (active) {
    resendOtpParagraph.classList.remove('inactive');
    resendOtpParagraph.classList.add('active');
    resendOtpParagraph.removeAttribute('disabled');
  } else {
    resendOtpParagraph.classList.remove('active');
    resendOtpParagraph.classList.add('inactive');
    resendOtpParagraph.setAttribute('disabled', 'disabled');
  }
}

export function startTimer() {
  let seconds = 30;
  const otpConfirmationParagraph = document.getElementById('form-message2');
  let otpSeconds = document.getElementById('otp-seconds');

  // Check if the span element already exists, if not create and append it
  if (!otpSeconds) {
    otpSeconds = document.createElement('span');
    otpSeconds.id = 'otp-seconds';
    otpConfirmationParagraph.appendChild(otpSeconds);
  }

  // Initially add inactive class
  toggleResendOTPClass(false);

  const intervalId = setInterval(() => {
    seconds -= 1;
    otpSeconds.textContent = ` ${seconds} Seconds`;

    if (seconds === 0) {
      clearInterval(intervalId);
      toggleResendOTPClass(true); // Add active class
    }
  }, 1000);

  // Initial text content
  otpConfirmationParagraph.textContent = "Didn't receive any OTP?";
  otpConfirmationParagraph.appendChild(otpSeconds);
}

// Function to resend OTP
export function resendOTP() {
  const seconds = 30;
  const otpConfirmationParagraph = document.getElementById('form-message2');
  otpConfirmationParagraph.textContent = `Didn't receive any OTP? ${seconds} Seconds`;
  startTimer();
}

// Function to start the timer
export function retrieveOTP() {
  let otp = '';
  // Loop through each input field
  document
    .querySelectorAll("fieldset#form-box input[type='text']")
    .forEach((input) => {
      // Concatenate the value of each input field
      otp += input.value;
    });
  // Return the concatenated OTP
  return otp;
}

export function generateOtpPayload(formPayload) {
  const customPayload = {
    product: formPayload.loanType,
    name: formPayload.FullName,
    username: formPayload.Mobile,
    email: formPayload.Email,
    outSource: getDataAttributeValueByName('outsource'),
    pageUrl: 'https://www.godrejcapital.com/apply-now.html',
    pageTitle: getMetaTagsContentValueByName('title'),
    mx_Refferral_URL: '',
    mx_Refferal_Type: getDataAttributeValueByName('mx-refferal-type'),
  };
  return customPayload;
}

export function generateVerifyOtpPayload(formPayload) {
  const customPayload = {
    product: formPayload.loanType,
    name: formPayload.FullName,
    username: formPayload.Mobile,
    email: formPayload.Email,
    outSource: getDataAttributeValueByName('outsource'),
    pageUrl: 'https://www.godrejcapital.com/apply-now.html#HomeLoan',
    pageTitle: getMetaTagsContentValueByName('title'),
    mx_Refferral_URL: '',
    mx_Refferal_Type: getDataAttributeValueByName('mx-refferal-type'),
    utmSource: null,
    utmMedium: null,
    utmCampaign: null,
    utmTerm: null,
    utmContent: null,
  };
  return customPayload;
}

export async function handleVerify(payload, userMobileNumber, block) {
  if (userMobileNumber) {
    try {
      const response = await ApiCall(
        'POST',
        `${getDataAttributeValueByName('validateotpapiurl')}/${userMobileNumber}/${retrieveOTP()}`,
        payload,
      );
      if (response.status) {
        window.location.href = getDataAttributeValueByName('thankupageurl');
      } else if (response.status === false) {
        const existingErrorMessage = block.querySelector('#error-message');
        if (existingErrorMessage) {
          existingErrorMessage.remove();
        }

        const errorMessage = document.createElement('div');
        errorMessage.id = 'error-message';
        errorMessage.className = 'error-message';
        errorMessage.textContent = getDataAttributeValueByName('wrongotpvalidationerrormessage');
        // Append the error message to the fieldset
        const formBox = block.querySelector('#form-box');
        formBox.parentNode.insertBefore(errorMessage, formBox.nextSibling);
      } else {
        // Handle unsuccessful validation
        console.error('OTP validation failed:', response);
      }
    } catch (error) {
      console.error('Error during OTP validation:', error);
    }
  } else {
    console.error('Mobile number not found.');
  }
}

export function autoFocusEl(form) {
  const inputs = form.querySelectorAll('#form-box  input');

  inputs.forEach((input, index) => {
    input.addEventListener('input', () => {
      // Check if the input value is a single digit
      if (/^\d$/.test(input.value)) {
        input.parentNode.classList.add('filled');
        if (index < inputs.length - 1) {
          inputs[index + 1].focus();
        }
      } else {
        input.value = ''; // Clear the input if it's not a digit
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && input.value === '' && index > 0) {
        input.parentNode.classList.remove('filled');
        inputs[index - 1].focus();
      }
    });
  });
}

export function changeNumberFunctinality(block) {
  const changeNumber = block.querySelector('#form-common #change-number');
  changeNumber.addEventListener('click', () => {
    const verifyFormEl = block.querySelectorAll('.verify-step');
    verifyFormEl.forEach((el) => {
      el.style.display = 'none';
    });
    const registrationFormEl = block.querySelectorAll('.step1');
    registrationFormEl.forEach((el) => {
      el.style.display = 'flex';
    });

    const submitBtnRegistration = block.querySelector(
      '.step1.submit-registration button',
    );
    submitBtnRegistration.removeAttribute('disabled');
  });
}

let userMobNo = null;
function validateCheckboxes(form) {
  // Select the checkboxes you want to validate
  const checkboxes = form.querySelectorAll('input[type="checkbox"][name="loanType"]');
  // Convert NodeList to Array and use some() to check if at least one checkbox is checked
  const isAnyCheckboxChecked = Array.from(checkboxes).some((checkbox) => checkbox.checked);

  return isAnyCheckboxChecked; // Returns true if at least one checkbox is checked, otherwise false
}

function showError(fieldset, message) {
  // Check if an error message already exists
  let errorDiv = fieldset.querySelector('.error-message');
  if (!errorDiv) {
    // Create error message element if it doesn't exist
    errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = 'red'; // Add some styling
    fieldset.insertAdjacentElement('afterend', errorDiv);
  }
  errorDiv.textContent = message;
}

async function handleSubmit(form) {
  if (form.getAttribute('data-submitting') === 'true') return;

  const submit = form.querySelector('button[type="submit"]');
  try {
    form.setAttribute('data-submitting', 'true');
    submit.disabled = true;

    const loanTypeFieldset = form.querySelector('#loanTypeFieldset');

    if (!validateCheckboxes(form)) {
      showError(loanTypeFieldset, getDataAttributeValueByName('loantypevalidationerrormessage'));
      submit.disabled = false;
      form.setAttribute('data-submitting', 'false');
      return;
    }
    // create payload
    const payload = generatePayload(form);

    userMobNo = payload.Mobile;
    const mobileNoStr = userMobNo.toString();
    const lastFourDigits = mobileNoStr.slice(-4);
    const otpEl = document.querySelector('#form-message');

    // Replace last four digits in otpEl.textContent
    const otpText = otpEl.textContent;
    const otpTextWithoutDigits = otpText.replace(/\d{4}$/, '');
    otpEl.textContent = `${otpTextWithoutDigits} ${lastFourDigits}`;

    const mobileNoVerifyStep = document.querySelector('.verify-step.field-wrapper #form');
    if (mobileNoVerifyStep) {
      mobileNoVerifyStep.value = userMobNo;
      mobileNoVerifyStep.readOnly = true;
    }

    // Function to ensure only one digit is entered
    const enforceSingleDigit = function (event) {
      const inputField = event.target;
      let { value } = inputField;
      // Allow only numeric input and truncate to one character
      if (!/^\d$/.test(value)) {
        value = value.replace(/[^\d]/g, '');
      }
      inputField.value = value.slice(0, 1);
    };

    const otpFieldsEls = document.querySelectorAll('#form-box input[type="text"]');
    otpFieldsEls.forEach((otpFieldEl) => {
      otpFieldEl.addEventListener('input', enforceSingleDigit);
    });

    startTimer();

    ApiCall('POST', getDataAttributeValueByName('generateotpapiurl'), generateOtpPayload(payload));
    document.getElementById('form-message3').addEventListener('click', () => {
      const element = document.getElementById('form-message3');
      if (element.classList.contains('active')) {
        ApiCall('POST', getDataAttributeValueByName('generateotpapiurl'), generateOtpPayload(payload));
        resendOTP();
      } else {
        console.log('The element does not have the class "active".');
      }
    });
  } catch (e) {
    handleSubmitError(form, e);
  } finally {
    form.setAttribute('data-submitting', 'false');
  }
}

function createRedirection(attributesObj) {
  const termsAndConditionRedirection = document.createElement('a');
  termsAndConditionRedirection.classList.add('terms-and-condition-re');
  termsAndConditionRedirection.setAttribute('href', attributesObj.termsandconditionsurl);
  termsAndConditionRedirection.innerText = attributesObj.termsandconditionslabel;
  return termsAndConditionRedirection;
}

function changesScreenChange(el, dataAttrObj, initialContent) {
  if (window.innerWidth <= 900) {
    el.innerText = dataAttrObj.editnumberlabelmobileandtablet;
  } else {
    el.innerText = initialContent;
  }
}

function addChangeEventOnCheckboxes(block) {
  const checkboxes = block.querySelectorAll('.step1.field-wrapper.checkbox-wrapper.selection-wrapper input[type="checkbox"]');

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', (e) => {
      const parentWrapper = checkbox.closest('.step1.field-wrapper.checkbox-wrapper.selection-wrapper');
      // const label = parentWrapper.querySelector('label').textContent;

      if (checkbox.checked) {
        parentWrapper.classList.add('checked');
        // checkbox.value = label;
      } else {
        parentWrapper.classList.remove('checked');
        // checkbox.value = ''; // or set it back to the default value if needed
      }
    });
  });
}

export default async function decorate(block) {
  const container = block.closest('.applynowform-container');
  const attributesObj = getDataAttributes(container);
  const formLink = block.querySelector('a[href$=".json"]');
  if (!formLink) return;

  const form = await createForm(formLink.href);
  autoFocusEl(form);
  block.replaceChildren(form);

  const verifyFormEl = block.querySelectorAll('.verify-step');
  verifyFormEl.forEach((el) => {
    el.style.display = 'none';
  });

  const ChangeNoEl = block.querySelector('#change-number');
  const initialContent = ChangeNoEl.innerText;
  changesScreenChange(ChangeNoEl, attributesObj, initialContent);
  window.addEventListener('resize', () => changesScreenChange(ChangeNoEl, attributesObj, initialContent));
  const tAndCredirectionStepFirst = createRedirection(attributesObj);
  const tAndCredirectionStepSecond = createRedirection(attributesObj);

  block.querySelector('#form-description').append(tAndCredirectionStepFirst);
  block.querySelector('#form-message4').append(tAndCredirectionStepSecond);
  addInitiallychecked(block);
  addChangeEventOnCheckboxes(block);
  disableSubmitUntilFillForm(block);
  changeNumberFunctinality(block);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // const valid = form.checkValidity();
    if (validateFormInput(VALIDATION_DATA, block)) {
      handleSubmit(form);
      const registrationFormEl = block.querySelectorAll('.step1');
      registrationFormEl.forEach((el) => {
        el.style.display = 'none';
      });
      verifyFormEl.forEach((el) => {
        el.style.display = 'flex';
      });
    } else {
      const firstInvalidEl = form.querySelector(':invalid:not(fieldset)');
      if (firstInvalidEl) {
        firstInvalidEl.focus();
        firstInvalidEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });

  function addInitiallychecked(block) {
    const currentUrl = new URL(window.location.href);
    try {
      let categoryParam = currentUrl.searchParams.get('category');
      categoryParam = categoryParam.replace(/_/g, ' ');
      if (categoryParam) {
        const checkboxes = block.querySelectorAll('input[type="checkbox"][name="loanType"]');
        checkboxes.forEach(((checkbox) => {
          if (checkbox.getAttribute('value').toLowerCase() === categoryParam.toLowerCase()) {
            checkbox.checked = true;
            checkbox.parentNode.classList.add('checked');
          }
        }));
      }
    } catch (error) {
      console.error('error not retrived');
    }
  }
  function validateForm() {
    const fields = document.querySelectorAll('#form-box input[type="text"]');
    let isAnyFieldEmpty = false;

    // Remove existing error message if any
    const existingErrorMessage = document.getElementById('error-message');
    if (existingErrorMessage) {
      existingErrorMessage.remove();
    }

    // Check if any field is empty
    fields.forEach((field) => {
      if (field.value.trim() === '') {
        isAnyFieldEmpty = true;
      }
    });

    if (isAnyFieldEmpty) {
      // Create a new error message
      const errorMessage = document.createElement('div');
      errorMessage.id = 'error-message';
      errorMessage.className = 'error-message';
      errorMessage.textContent = getDataAttributeValueByName('emptyotpfieldvalidationmessage');

      // Append the error message to the fieldset
      const formBox = document.getElementById('form-box');
      formBox.parentNode.insertBefore(errorMessage, formBox.nextSibling);
      return false; // Form is not valid
    }

    return true; // Form is valid
  }

  const verifyFormBtn = document.querySelector('.verify-step.btn-verify-step button');
  verifyFormBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (validateForm()) {
      const payload = generatePayload(form);
      if (payload) {
        handleVerify(generateVerifyOtpPayload(payload), payload.Mobile, block);
      } else {
        console.error('error payload is not retrived');
      }
      // You can now proceed with the payload
    }
  });
}

function validateFormInput(rules, block) {
  // Clear previous error messages
  block.querySelectorAll('.error-message').forEach((el) => el.remove());
  let isValid = true;
  rules.forEach((rule) => {
    const inputField = block.querySelector(`[name="${rule.fieldName}"]`);
    const fieldValue = inputField.value;
    if (!fieldValue || !rule.regexPattern.test(fieldValue)) {
      isValid = false;
      // Create error message div
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.textContent = rule.validationMessage;

      // Append the error message to the corresponding field's parent node
      inputField.parentNode.appendChild(errorDiv);
    }
  });

  const checboxes = block.querySelectorAll('.step1.field-wrapper input[type="checkbox"]');
  let isChecked = false;
  for (let index = 0; index < checboxes.length; index += 1) {
    if (checboxes[index].checked === true) {
      isChecked = true;
    }
  }
  if (!isChecked) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = getDataAttributeValueByName('loantypevalidationerrormessage');
    checboxes[0].parentNode.parentNode.appendChild(errorDiv);
  }
  return (isValid && isChecked);
}

function disableSubmitUntilFillForm(block) {
  const inputs = Array.from(block.querySelectorAll('.step1.field-wrapper input'));
  const submitButton = block.querySelector('.step1.submit-registration button');

  const validators = {
    text: (value) => /^[a-zA-Z\s]*$/.test(value.trim()),
    tel: (value) => /^[6789]\d{9}$/.test(value.trim()),
    email: (value) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value.trim()),
  };

  const errorMessages = {
    text: getDataAttributeValueByName('namevalidationerrormessage'),
    tel: getDataAttributeValueByName('mobilevalidationerrormessage'),
    email: getDataAttributeValueByName('emailvalidationerrormessage'),
  };

  function createErrorElement(input) {
    let errorElement = input.parentNode.querySelector('.error-message');
    if (!errorElement) {
      errorElement = document.createElement('span');
      errorElement.className = 'error-message';
      input.parentNode.appendChild(errorElement);
    }
    return errorElement;
  }

  function showErrorMessage(input, message) {
    const errorElement = createErrorElement(input);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }

  function hideErrorMessage(input) {
    const errorElement = createErrorElement(input);
    errorElement.textContent = '';
    errorElement.style.display = 'none';
  }

  function validateInput(input, showErrors = true) {
    const value = input.value.trim();
    const type = input.type;
    let isValid = type in validators ? validators[type](value) : true;

    if (type === 'tel' && !/^\d*$/.test(value)) {
      isValid = false;
    }

    if (isValid) {
      hideErrorMessage(input);
    } else if (showErrors) {
      showErrorMessage(input, errorMessages[type]);
    }
    return isValid;
  }

  function validateForm() {
    const isInputFilled = inputs.every((input) => input.type === 'checkbox' || validateInput(input, false));
    const isCheckboxChecked = inputs.some((input) => input.type === 'checkbox' && input.checked);

    submitButton.disabled = !(isInputFilled && isCheckboxChecked);
  }

  inputs.forEach((input) => {
    let hasFocused = false;

    input.addEventListener('focus', () => {
      hasFocused = true;
    });

    input.addEventListener('blur', () => {
      if (hasFocused) {
        validateInput(input);
        validateForm();
      }
    });

    input.addEventListener('input', () => {
      if (input.type === 'tel') {
        input.value = input.value.replace(/[^\d]/g, '').slice(0, 10); // Allow only digits and limit to 10 characters
      } else if (input.type === 'text') {
        input.value = input.value.replace(/[^a-zA-Z\s]/g, '').replace(/\s{2,}/g, ' ');
      }
      validateForm();
    });

    if (input.type === 'checkbox') {
      input.addEventListener('change', validateForm);
    }
  });

  validateForm();
}
