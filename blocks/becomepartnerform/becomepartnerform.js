import { createForm, generatePayload } from '../../blocks/form/form.js';

const authKey = getDataAttributeValueByName('authkey');
const apiUrl = getDataAttributeValueByName('apiurl');

export default async function decorate(block) {

    const formLink = block.querySelector('a[href$=".json"]');
    if (!formLink) return;

    const form = await createForm(formLink.href);
    block.replaceChildren(form);

    const editNumberInputEle = block.querySelector('#form-mobilenumber');
    editNumberInputEle.setAttribute('readonly', true);

    addChangeEventOnCheckboxes(block);
    addChangeEventOnRadioButtons(block);

    handleSubmitBtn(block, form, editNumberInputEle);

    block.querySelector('#form-editmobilenumber').addEventListener('click', (e) => {
        toggleFormVisibility('.form2', '.form1', block);
    })

    console.log("apiUrl:", apiUrl);
    console.log("authKey:", authKey);
}

document.addEventListener('DOMContentLoaded', () => {
    const jsonUrl = 'https://main--eds-godrej-capital--divanshu-techx.hlx.page/become-a-partner/become-a-partner-form-sheet.json';
    console.log(jsonUrl);

    fetch(jsonUrl)
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
    block.querySelector('#submit-btn').addEventListener('click', (e) => {

        if (validateForm1(block)) {
            const form1Payload = generatePayload(form);
            const response = makeAjaxRequest('POST', apiUrl, generateRequestBodyy(form1Payload, true));
            console.log(response);

            editNumberInputEle.value = form1Payload.userMobileNumder;
            toggleFormVisibility('.form1', '.form2', block);
            handleVerifyBtn(block, form);
        } else {
            focusOnFirstInvalidElement(form);
        }
    });
}

function handleVerifyBtn(block, form) {
    block.querySelector('#verify-btn').addEventListener('click', (e) => {

        if (validateOtp(block)) {
            console.log("otp is verified");
            // Perform any specific action needed for the verify button
        } else {
            focusOnFirstInvalidElement(form);
        }
    });
}

// Function to validate form2 inputs
function validateOtp(block) {
    const otpFields = block.querySelectorAll('[id^="form-otpfield"]');

    let isValid = true;

    let otpValue = '';
    otpFields.forEach((otpField) => {
        if (otpField.value.trim() === "") {
            isValid = false;
        }
        otpValue += otpField.value;
    });

    if (isValid) {
        handleErrorMessages(false, otpFields, 'Please enter the valid OTP.');
    } else {
        handleErrorMessages(true, otpFields);
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

function addChangeEventOnRadioButtons(block) {
    const radioButtons = block.querySelectorAll('.form1.field-wrapper.radio-wrapper.selection-wrapper input[type="radio"]');

    radioButtons.forEach(radio => {
        radio.addEventListener('change', (e) => {
            // Remove the 'selected' class from all radio buttons in the group
            const name = radio.getAttribute('name');

            radioButtons.forEach(r => {
                if (r.getAttribute('name') === name) {
                    const parentWrapper = r.closest('.form1.field-wrapper.radio-wrapper.selection-wrapper');
                    parentWrapper.classList.remove('selected');
                }
            });

            // Add the 'selected' class to the checked radio button
            const parentWrapper = radio.closest('.form1.field-wrapper.radio-wrapper.selection-wrapper');
            // const label = parentWrapper.querySelector('label').textContent;
            parentWrapper.classList.add('selected');
            // radio.value = label;
        });
    });
}

// Function to validate form1 inputs
function validateForm1(block) {
    const nameField = block.querySelector('#form-username');
    const mobileField = block.querySelector('#form-usermobilenumder');
    const emailField = block.querySelector('#form-useremailid');
    const checkboxValidation = validateRadioBtnAndCheckbox(block, "#firstset", 'Please select at least one product.', 'checkbox');
    const radioButtonValidation = validateRadioBtnAndCheckbox(block, "#secondset", 'Please select a location.', 'radio');

    let isValid = true;
    if (!validateNameField(nameField)) {
        isValid = false;
    }
    if (!validateMobileNumber(mobileField)) {
        isValid = false;
    }
    if (!validateEmail(emailField)) {
        isValid = false;
    }

    return checkboxValidation && radioButtonValidation && isValid;
}

// Function to validate name
function validateNameField(nameField) {
    if (nameField.value.trim() === "") {
        handleErrorMessages(false, nameField, 'Please enter your name.');
        return false;
    } else {
        handleErrorMessages(true, nameField);
        return true;
    }
}

// Function to validate email
function validateEmail(emailField) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(emailField.value)) {
        handleErrorMessages(false, emailField, 'Please enter a valid email address.');
        return false;
    } else {
        handleErrorMessages(true, emailField);
        return true;
    }
}

// Function to validate mobile number
function validateMobileNumber(mobileField) {
    const mobilePattern = /^[0-9]{10}$/;
    if (!mobilePattern.test(mobileField.value)) {
        handleErrorMessages(false, mobileField, 'Please enter a valid 10-digit mobile number.');
        return false;
    } else {
        handleErrorMessages(true, mobileField);
        return true;
    }
}

// Consolidated validation function
function validateRadioBtnAndCheckbox(block, fieldsetId, errorMessageText, inputType) {
    const fieldset = block.querySelector(fieldsetId);
    const selectedInputs = fieldset.querySelectorAll(`.form1.field-wrapper.${inputType}-wrapper.selection-wrapper.selected, .form1.field-wrapper.${inputType}-wrapper.selection-wrapper.checked`);
    return handleErrorMessages(selectedInputs.length > 0, fieldset, errorMessageText);
}

function handleErrorMessages(condition, fieldset, errorMessageText) {
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

function toggleFormVisibility(hideSelector, showSelector, block) {
    const hideElements = block.querySelectorAll(hideSelector);
    console.log(hideElements);
    const showElements = block.querySelectorAll(showSelector);
    console.log(showElements);
    hideElements.forEach(el => el.style.display = 'none');
    showElements.forEach(el => el.style.display = 'block');
}

export function makeAjaxRequest(method, url, requestBody) {
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

export function generateRequestBodyy(formPayload, isOtpGeneration) {
    const customPayload = {
        fullname: formPayload.userName,
        emailId: formPayload.userEmailId,
        mobile: formPayload.userMobileNumder,
        location: 1,
        "products": [
            1
        ],
        eventType: isOtpGeneration ? "OTP_GENERATE" : "OTP_VERIFY",
        otp: ""
    };
    return customPayload;
}

export function generateVerifyOtpPayload(formPayload) {
    const customPayload = {
        product: 'HomeLoan',
        name: formPayload.userName,
        username: formPayload.userMobileNumder,
        email: formPayload.userEmailId,
        outSource: "GodrejCapitalWebsite",
        pageUrl: "https://www.godrejcapital.com/apply-now.html#HomeLoan",
        pageTitle: "Apply Now",
        mx_Refferral_URL: "",
        mx_Refferal_Type: "direct",
        utmSource: null,
        utmMedium: null,
        utmCampaign: null,
        utmTerm: null,
        utmContent: null
    };
    return customPayload;
}

// Function to start the timer and activate resend OTP option after 30 seconds
export function startTimer() {
    let seconds = 30;
    const otpConfirmationParagraph = document.getElementById('form-otpconfirmation');
    const resendOtpParagraph = document.getElementById('form-resendotp');
    // Function to toggle the active class for resend OTP
    function toggleResendOTPClass(active) {
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
    // Function to resend OTP
    function resendOTP() {
        // Code to resend OTP goes here
        console.log('Resending OTP...');
        // Reset the timer
        seconds = 30;
        otpConfirmationParagraph.textContent = `Didn't receive any OTP? ${seconds} Seconds`;
        toggleResendOTPClass(false); // Remove active class
        startTimer();
    }
    // Initially add inactive class
    toggleResendOTPClass(false);
    const intervalId = setInterval(() => {
        seconds--;
        otpConfirmationParagraph.textContent = `Didn't receive any OTP? ${seconds} Seconds`;
        if (seconds === 0) {
            clearInterval(intervalId);
            toggleResendOTPClass(true); // Add active class
        }
    }, 1000);
    // Event listener for the "Resend OTP" option
    resendOtpParagraph.addEventListener('click', resendOTP);
}
export function retrieveOTP() {
    var otp = "";
    // Loop through each input field
    $("fieldset#form-otpfieldset input[type='text']").each(function () {
        // Concatenate the value of each input field
        otp += $(this).val();
    });
    console.log(otp);
    // Return the concatenated OTP
    return otp;
}
export async function handleVerify(payload, userMobileNumber) {
    if (userMobileNumber) {
        try {
            const response = await makeAjaxRequest(
                "POST",
                `https://h9qipagt5.godrejfinance.com/v1/ehf/outsources/validateotp/${userMobileNumber}/${retrieveOTP()}`,
                payload
            );
            if (response.ok) {
                window.location.href = "https://your-redirect-url.com/success-page";
            } else {
                // Handle unsuccessful validation
                console.error("OTP validation failed:", response);
            }
        } catch (error) {
            console.error("Error during OTP validation:", error);
        }
    } else {
        console.error("Mobile number not found.");
    }
}

// Get data attribute value by name
function getDataAttributeValueByName(name) {
    const element = document.querySelector(`[data-${name}]`);
    return element ? element.getAttribute(`data-${name}`) : '';
}
