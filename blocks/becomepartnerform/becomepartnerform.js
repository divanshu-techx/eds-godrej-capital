import { createForm } from '../../blocks/form/form.js';

// Retrieve configurable values from data attributes
const outSource = getDataAttributeValueByName('outsource');
const pageUrl = getDataAttributeValueByName('pageurl');
const pageTitle = getDataAttributeValueByName('pagetitle');
const mxRefferralUrl = getDataAttributeValueByName('mxrefferralurl');
const mxRefferalType = getDataAttributeValueByName('mxrefferaltype');
const authKey = getDataAttributeValueByName('authkey');

export default async function decorate(block) {

    const formLink = block.querySelector('a[href$=".json"]');
    if (!formLink) return;

    const form = await createForm(formLink.href);
    block.replaceChildren(form);

    addChangeEventOnCheckboxes(block);
    addChangeEventOnRadioButtons(block);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitTypeBtn = e.submitter; // Get the button that was clicked to submit the form

        // Determine which button was clicked
        if (submitTypeBtn.id === 'submit-btn') {
            // Handle submit action for first button
            const checkboxValidation = validateInputs(block, "#firstset", 'Please select at least one product.', 'checkbox');
            const radioButtonValidation = validateInputs(block, "#secondset", 'Please select a location.', 'radio');

            if (checkboxValidation && radioButtonValidation && form.checkValidity()) {
                console.log("Form is valid. Submitting...");
                // handleSubmit(form);
                toggleFormVisibility('.form1', '.form2', block);
            } else {
                focusOnFirstInvalidElement(form);
            }
        } else if (submitTypeBtn.id === 'verify-btn') {
            if (form.checkValidity()) {
                // Handle submit action for second button
                console.log("verify button clicked.");
            } else {
                focusOnFirstInvalidElement(form);
            }
        }
    });

    // Log the variables to verify
    console.log("outSource:", outSource);
    console.log("pageUrl:", pageUrl);
    console.log("pageTitle:", pageTitle);
    console.log("mxRefferralUrl:", mxRefferralUrl);
    console.log("mxRefferalType:", mxRefferalType);
    console.log("authKey:", authKey);
    // Prepare the data payload
    const data = {
        product: "HomeLoan",
        name: "jitender rawat",
        username: "9990909468",
        email: "j@gmail.com",
        outSource: outSource, // corrected variable name
        pageUrl: pageUrl,
        pageTitle: pageTitle,
        mx_Refferral_URL: mxRefferralUrl,
        mx_Refferal_Type: mxRefferalType,
    };
}

function handleSubmitBtn() {

}

function handleVerifyBtn() {

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

// Consolidated validation function
function validateInputs(block, fieldsetId, errorMessageText, inputType) {
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

export function makeAjaxRequest(method, url, data) {
    // Return a promise
    return new Promise((resolve, reject) => {
        $.ajax({
            type: method,
            url: url,
            headers: {
                "Content-Type": "application/json",
                "auth-key": "9K43LtTEGpqmhAYgN10MPzqASvRmUKLk",
            },
            data: JSON.stringify(data),
            success: function (response) {
                resolve(response);
            },
            error: function (error) {
                reject(error);
            },
        });
    });
}

export function generateOtpPayload(formPayload) {
    const customPayload = {
        product: formPayload.homeLoanLabel,
        name: formPayload.userName,
        username: formPayload.userMobileNumder,
        email: formPayload.userEmailId,
        outSource: "GodrejCapitalWebsite",
        pageUrl: "https://www.godrejcapital.com/apply-now.html",
        pageTitle: "Apply Now",
        mx_Refferral_URL: "",
        mx_Refferal_Type: "direct",
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
