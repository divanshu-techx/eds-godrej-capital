import { createForm, generatePayload } from '../form/form.js';
import { validateMobileNumber, validateEmail, restrictPhoneNumberInputs } from '../form/inputFieldsValidation.js';

const formSheetUrl = getDataAttributeValueByName('sheeturl');

export default async function decorate(block) {

    const formLink = block.querySelector('a[href$=".json"]');
    if (!formLink) return;

    const form = await createForm(formLink.href);
    block.replaceChildren(form);

    const indianResidentRadio = block.querySelector('#indianResident');
    const nonResidentIndianRadio = block.querySelector('#nonResidentIndian');
    const indianMobileNumberDiv = block.querySelector('#indianMobileNumber');
    const nriMobileNumberDiv = block.querySelector('#nriMobileNumber');
    const indianOtpMessage = block.querySelector('#indianOtpMessage');
    const nriOtpMessage = block.querySelector('#nriOtpMessage');

    if (indianResidentRadio && nonResidentIndianRadio && indianMobileNumberDiv && nriMobileNumberDiv && indianOtpMessage && nriOtpMessage) {
        // Select the first radio button by default
        indianResidentRadio.checked = true;

        // Add checked class to the corresponding label
        addCheckedClass(indianResidentRadio);

        // Restrict the inputs
        restrictPhoneNumberInputs(block);

        toggleResidentDivVisibility();

        // Add event listeners to radio buttons to toggle div visibility on change
        indianResidentRadio.addEventListener('change', toggleResidentDivVisibility);
        nonResidentIndianRadio.addEventListener('change', toggleResidentDivVisibility);

        handleApplyNowBtn(block, form);

        // Function to show or hide divs based on resident type radio button selection
        function toggleResidentDivVisibility() {
            if (indianResidentRadio.checked) {
                indianMobileNumberDiv.parentNode.style.display = 'block';
                nriMobileNumberDiv.parentNode.style.display = 'none';
                addCheckedClass(indianResidentRadio);
            } else if (nonResidentIndianRadio.checked) {
                indianMobileNumberDiv.parentNode.style.display = 'none';
                nriMobileNumberDiv.parentNode.style.display = 'block';
                addCheckedClass(nonResidentIndianRadio);
            }
        }

        function toggleOtpMsgVisibility() {
            if (indianResidentRadio.checked) {
                nriOtpMessage.parentNode.style.display = 'none';
                indianOtpMessage.parentNode.style.display = 'block';
            } else if (nonResidentIndianRadio.checked) {
                indianOtpMessage.parentNode.style.display = 'none';
                nriOtpMessage.parentNode.style.display = 'block';
            }
        }

        function handleApplyNowBtn(block, form) {
            const residentMobileField = block.querySelector('#mobileNumber');
            const nriMobileField = block.querySelector('#nriMobileNumber');
            const applyNowBtn = block.querySelector('#apply-now-btn');

            if (applyNowBtn) {
                applyNowBtn.addEventListener('click', function () {
                    if (validateMobileNumber(residentMobileField, 'Please enter a valid mobile number.') ||
                        validateMobileNumber(nriMobileField, 'Please enter a valid mobile number.') || 
                        validateEmail(nriMobileField)) {
                        toggleFormVisibility('.form1', '.form2', block);
                        toggleOtpMsgVisibility();
                        console.log(generatePayload(form));
                    }
                });
            }
        }

        function addCheckedClass(radio) {
            block.querySelectorAll('.radio-wrapper label').forEach(label => label.classList.remove('checked'));
            const label = block.querySelector(`label[for="${radio.id}"]`);
            if (label) {
                label.classList.add('checked');
            }
        }
    }
}

function toggleFormVisibility(hideSelector, showSelector, block) {
    const hideElements = block.querySelectorAll(hideSelector);
    const showElements = block.querySelectorAll(showSelector);
    hideElements.forEach(el => el.style.display = 'none');
    showElements.forEach(el => el.style.display = 'block');
}

// Get data attribute value by name
function getDataAttributeValueByName(name) {
    const element = document.querySelector(`[data-${name}]`);
    return element ? element.getAttribute(`data-${name}`) : '';
}