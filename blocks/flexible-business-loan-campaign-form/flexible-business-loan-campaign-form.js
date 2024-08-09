import { createForm, generatePayload } from '../form/form.js';

const defaultLoanAmount = getDataAttributeValueByName('defaultLoanAmount');
const minLoanAmount = getDataAttributeValueByName('minLoanAmount');
const maxLoanAmount = getDataAttributeValueByName('maxLoanAmount');


export default async function decorate(block) {

    const formLink = block.querySelector('a[href$=".json"]');
    if (!formLink) return;

    const form = await createForm(formLink.href);
    block.replaceChildren(form);

    const loanAmountSlider = block.querySelector('#loanAmountSlider');
    const loanAmountInputField = block.querySelector('#loanAmountInputField');
    loanAmountSlider.setAttribute('min', minLoanAmount);
    loanAmountSlider.setAttribute('max', maxLoanAmount);
    loanAmountSlider.setAttribute('value', defaultLoanAmount);

    // Function to format the number as per Indian format
    function formatAmount(amount) {
        return parseInt(amount).toLocaleString('en-IN');
    }

    // Update the number input field when the slider changes
    loanAmountSlider.addEventListener('input', function() {
        const value = loanAmountSlider.value;
        loanAmountInputField.value = value;
        loanAmountSlider.setAttribute('value', value);
    });

    // Update the slider when the number input field changes
    loanAmountInputField.addEventListener('input', function() {
        const value = loanAmountInputField.value;
        loanAmountSlider.setAttribute('value', value);
    });
}

// Get data attribute value by name
function getDataAttributeValueByName(name) {
    const element = document.querySelector(`[data-${name}]`);
    return element ? element.getAttribute(`data-${name}`) : '';
}