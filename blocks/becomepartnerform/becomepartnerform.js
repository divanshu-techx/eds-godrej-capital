import { createForm, generatePayload } from '../../blocks/form/form.js';
import { restrictNameInputs, restrictPhoneNumberInputs, validateNameField, validateEmail, validateMobileNumber, validateLoanProducts, handleErrorMessages } from '../form/inputFieldsValidation.js';

const apiUrl = getDataAttributeValueByName('otpapiurl');
const formSheetUrl = getDataAttributeValueByName('sheeturl');
const thankYouPageUrl = getDataAttributeValueByName('thankyoupageurl');

export default async function decorate(block) {

  const formLink = block.querySelector('a[href$=".json"]');
  if (!formLink) return;

  const form = await createForm(formLink.href);
  block.replaceChildren(form);

  // restrict the inputs
  restrictNameInputs(block);
  restrictPhoneNumberInputs(block);

  // Add change event for checkboxes
  addChangeEventOnCheckboxes(block);
  handlSelectOnTabAndMob(block)
  otpsEforcements(block)
  const editNumberInputEle = block.querySelector('#form-mobilenumber');
  editNumberInputEle.setAttribute('readonly', true);

  handleSubmitBtn(block, form, editNumberInputEle);

  // handle edit mobile number
  block.querySelector('#form-editmobilenumber').addEventListener('click', (e) => {
    toggleFormVisibility('.form2', '.form1', block);
  })
}

document.addEventListener('DOMContentLoaded', () => {

  fetch(formSheetUrl)
    .then(response => response.json())
    .then(data => {
      const dropdown = document.getElementById('categoryDropdown');
      const tabsContainer = document.getElementById('tabs-container');
      const contentContainer = document.getElementById('content-container');

      // Populate dropdown
      data.data.forEach((item, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.innerText = item.category;
        dropdown.appendChild(option);
      });

      // Update tabs and content based on selected category
      const updateTabsAndContent = () => {
        const selectedIndex = dropdown.value;
        const selectedCategory = data.data[selectedIndex];
        tabsContainer.innerHTML = '';
        contentContainer.innerHTML = '';

        selectedCategory.documentCateory.forEach((doc, index) => {
          const tabDiv = document.createElement('div');
          tabDiv.className = `tab${index === 0 ? ' active' : ''}`;
          tabDiv.dataset.tab = index;
          tabDiv.innerText = doc.documentType;
          tabsContainer.appendChild(tabDiv);

          const contentDiv = document.createElement('div');
          contentDiv.className = 'content';
          contentDiv.style.display = index === 0 ? 'block' : 'none';
          contentDiv.innerHTML = `<h3>${doc.title}</h3><p>${doc.description}</p><ul>${doc.documents.map(d => `<li>${d}</li>`).join('')}</ul>`;
          contentContainer.appendChild(contentDiv);

          tabDiv.addEventListener('click', function () {
            document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
            this.classList.add('active');
            document.querySelectorAll('.content').forEach((content, contentIndex) => {
              content.style.display = contentIndex == index ? 'block' : 'none';
            });
          });
        });
      };

      dropdown.addEventListener('change', updateTabsAndContent);
      updateTabsAndContent();


    })
    .catch(error => console.error('Error fetching data:', error));
});

function handleSubmitBtn(block, form, editNumberInputEle) {
  const submitBtnEle = block.querySelector('#submit-btn');
  submitBtnEle.addEventListener('click', async (e) => {

    if (!validateForm1(block)) {
      focusOnFirstInvalidElement(form);
      return;
    }

    const form1Payload = generatePayload(form);
    try {
      const response = await makeAjaxRequest('POST', apiUrl, generateRequestBody(form1Payload, true, '', getSelectedCheckboxValues(block)));
      console.log(response);
      if (response.status) {
        editNumberInputEle.value = form1Payload.userMobileNumder;
        updateOTPMessage(block, form1Payload.userMobileNumder);
        toggleFormVisibility('.form1', '.form2', block);
        startTimer(block, form);
        handleVerifyBtn(block, form);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
}

function handleVerifyBtn(block, form) {
  block.querySelector('#verify-btn').addEventListener('click', (e) => {

    if (validateOtp(block, form)) {
      console.log("otp is verified");
      // Perform any specific action needed for the verify button
    } else {
      focusOnFirstInvalidElement(form);
    }
  });
}

function updateOTPMessage(block, userMobNo) {
  const mobileNoStr = userMobNo.toString();
  const lastFourDigits = mobileNoStr.slice(-4);

  const otpMsgEle = block.querySelector('#form-otpmessage');

  // If the element exists
  if (otpMsgEle) {
    const otpMsgTextContent = otpMsgEle.textContent;
    const otpTextWithoutDigits = otpMsgTextContent.replace(/\d{4}$/, '');

    // Update the text content with the new last four digits
    otpMsgEle.textContent = `${otpTextWithoutDigits}${lastFourDigits}`;
  }

}

// Function to validate form2 inputs
async function validateOtp(block, form) {
  const otpFields = block.querySelectorAll("fieldset#form-otpfieldset input[type='text']");

  let isValid = true;

  let otpValue = '';
  otpFields.forEach((otpField) => {
    if (otpField.value.trim() === "") {
      isValid = false;
    }
    otpValue += otpField.value;
  });

  const otpFieldSetEle = document.querySelector("fieldset#form-otpfieldset");
  if (!isValid) {
    handleErrorMessages(false, otpFieldSetEle, getDataAttributeValueByName('otperrorvalidationmessage'));
  } else {
    handleErrorMessages(true, otpFieldSetEle);
    const form2Payload = generatePayload(form);
    try {
      const otpVerifyRes = await makeAjaxRequest('POST', apiUrl, generateRequestBody(form2Payload, false, otpValue, getSelectedCheckboxValues(block)));
      if (otpVerifyRes.status) {
        handleErrorMessages(true, otpFieldSetEle);
        window.location.href = thankYouPageUrl;
      } else {
        handleErrorMessages(false, otpFieldSetEle, getDataAttributeValueByName('otperrorverifcationmessage'));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return isValid;
}


function focusOnFirstInvalidElement(form) {
  const firstInvalidEl = form.querySelector(':invalid:not(fieldset)');
  if (firstInvalidEl) {
    firstInvalidEl.focus();
    firstInvalidEl.scrollIntoView({ behavior: 'smooth' });
  }
}

function addChangeEventOnCheckboxes(block) {
  const checkboxes = block.querySelectorAll('.form1.field-wrapper.checkbox-wrapper.selection-wrapper input[type="checkbox"]');

  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const parentWrapper = checkbox.closest('.form1.field-wrapper.checkbox-wrapper.selection-wrapper');
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

function getSelectedCheckboxValues(block) {
  // Get all checkboxes inside the specified fieldset
  const checkboxes = block.querySelectorAll('fieldset#firstset input[type="checkbox"]');
  let selectedValues = [];

  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      selectedValues.push(checkbox.value);
    }
  });

  return selectedValues;
}

// Function to validate form1 inputs
function validateForm1(block) {
  const nameField = block.querySelector('#form-username');
  const mobileField = block.querySelector('#form-usermobilenumder');
  const emailField = block.querySelector('#form-useremailid');
  const loanProductField = block.querySelector("#firstset");
  const locationDropdown = block.querySelector('#form-location');
  const isLoanProductsValid = validateLoanProductCheckboxs(loanProductField);
  const isLocationValid = validateLoanProducts(locationDropdown, getDataAttributeValueByName('locationerrorvalidationmessage'));

  let isValid = true;
  if (!validateNameField(nameField, getDataAttributeValueByName('nameerrorvalidationmessage'))) {
    isValid = false;
  }
  if (!validateMobileNumber(mobileField, getDataAttributeValueByName('mobileerrorvalidationmessage'))) {
    isValid = false;
  }
  if (!validateEmail(emailField, getDataAttributeValueByName('emailerrorvalidationmessage'))) {
    isValid = false;
  }

  return isLoanProductsValid && isLocationValid && isValid;
}

// Consolidated validation function
function validateLoanProductCheckboxs(loanProductFieldSet) {
  const selectedInputs = loanProductFieldSet.querySelectorAll(`.form1.field-wrapper.checkbox-wrapper.selection-wrapper.checked`);
  return handleErrorMessages(selectedInputs.length > 0, loanProductFieldSet, getDataAttributeValueByName('producterrorvalidationmessage'));
}

function toggleFormVisibility(hideSelector, showSelector, block) {
  const hideElements = block.querySelectorAll(hideSelector);
  const showElements = block.querySelectorAll(showSelector);
  hideElements.forEach(el => el.style.display = 'none');
  showElements.forEach(el => el.style.display = 'block');
}

function makeAjaxRequest(method, url, requestBody) {
  // Return a promise
  return new Promise((resolve, reject) => {
    $.ajax({
      type: method,
      url: url,
      headers: {
        "Content-Type": "application/json"
      },
      data: JSON.stringify(requestBody),
      success: function (response) {
        resolve(response);
      },
      error: function (error) {
        reject(error);
      },
    });
  });
}

function generateRequestBody(formPayload, isOtpGeneration, otp, selectedProducts) {
  const customPayload = {
    fullname: formPayload.userName,
    emailId: formPayload.userEmailId,
    mobile: formPayload.userMobileNumder,
    location: formPayload.location,
    products: selectedProducts,
    eventType: isOtpGeneration ? "OTP_GENERATE" : "OTP_VERIFY",
    otp: otp
  };
  return customPayload;
}

// Function to start the timer
function startTimer(block, form) {
  var timerElement = block.querySelector('#form-otpconfirmation'); // Timer element
  var resendButton = block.querySelector('#form-resendotp'); // Resend button

  var count = 30; // Initial count in seconds
  resendButton.disabled = true; // Disable resend button initially

  var interval = setInterval(function () {
    var seconds = count % 60; // Calculate remaining seconds
    var displaySeconds = seconds < 10 ? "0" + seconds : seconds;

    timerElement.innerText = "Didn't receive any OTP? " + displaySeconds + " Seconds"; // Update timer display

    if (count <= 0) {
      clearInterval(interval); // Clear interval when count reaches 0
      resendButton.disabled = false; // Enable resend button
      timerElement.innerText = "Didn't receive any OTP?"; // Reset timer text
    }
    count--; // Decrement count
  }, 1000); // Update every second (1000 milliseconds)

  resendButton.addEventListener('click', async (e) => {
    const payload = generatePayload(form);
    const response = await makeAjaxRequest('POST', apiUrl, generateRequestBody(payload, true, '', getSelectedCheckboxValues(block)));
    console.log(response);
  });

}

// Get data attribute value by name
function getDataAttributeValueByName(name) {
  const element = document.querySelector(`[data-${name}]`);
  return element ? element.getAttribute(`data-${name}`) : '';
}

function handlSelectOnTabAndMob(block) {
  const dropdowns = block.querySelectorAll('.form1 #form-loancategoryplaceholder , .form1 #form-selectlocationplaceholder');
  dropdowns.forEach((dropdown) => {
    const fieldsetWrapper = dropdown.closest('.form1').nextElementSibling.querySelector('fieldset');
    console.log(fieldsetWrapper)

    if (fieldsetWrapper) {
      fieldsetWrapper.classList.add('hide-options');

      dropdown.addEventListener('click', function () {
        this.classList.toggle('active-dropdown');
        fieldsetWrapper.classList.toggle('hide-options');
      });
    }
  })

}

function otpsEforcements(block) {
  const otpFieldsEls = block.querySelectorAll('#form-otpfieldset input[type="text"]');
  otpFieldsEls.forEach((otpFieldEl, index) => {

    otpFieldEl.addEventListener('input', function () {
      if (/^\d$/.test(otpFieldEl.value)) {
        otpFieldEl.parentNode.classList.add('filled');
        if (index < otpFieldsEls.length - 1) {
          otpFieldsEls[index + 1].focus();
        }
      } else {
        otpFieldEl.value = '';
      }
    });
    otpFieldEl.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && otpFieldEl.value === '' && index > 0) {
        otpFieldEl.parentNode.classList.remove('filled');
        otpFieldsEls[index - 1].focus();
      }
    });
  });

}

