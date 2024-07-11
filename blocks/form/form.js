import createField from './form-fields.js';
import { sampleRUM } from '../../scripts/aem.js';
import { makeAjaxRequest, startTimer } from '../becomepartnerform/becomepartnerform.js';

export async function createForm(formHref) {
    const { pathname } = new URL(formHref);
    const resp = await fetch(pathname);
    const json = await resp.json();

    const form = document.createElement('form');
    // eslint-disable-next-line prefer-destructuring
    form.dataset.action = pathname.split('.json')[0];

    const fields = await Promise.all(json.data.map((fd) => createField(fd, form)));
    fields.forEach((field) => {
        if (field) {
            form.append(field);
        }
    });

    // group fields into fieldsets
    const fieldsets = form.querySelectorAll('fieldset');
    fieldsets.forEach((fieldset) => {
        form.querySelectorAll(`[data-fieldset="${fieldset.name}"`).forEach((field) => {
            fieldset.append(field);
        });
    });

    return form;
}

export function generatePayload(form) {
    const payload = {};

    [...form.elements].forEach((field) => {
        if (field.name && field.type !== 'submit' && !field.disabled) {
            if (field.type === 'radio') {
                if (field.checked) payload[field.name] = field.value;
            } else if (field.type === 'checkbox') {
                if (field.checked) payload[field.name] = payload[field.name] ? `${payload[field.name]},${field.value}` : field.value;
            } else {
                payload[field.name] = field.value;
            }
        }
    });
    return payload;
}

export function handleSubmitError(form, error) {
    // eslint-disable-next-line no-console
    console.error(error);
    form.querySelector('button[type="submit"]').disabled = false;
    sampleRUM('form:error', { source: '.form', target: error.stack || error.message || 'unknown error' });
}

let userMobileNumder = null;
async function handleSubmit(form) {
    if (form.getAttribute('data-submitting') === 'true') return;

    const submit = form.querySelector('button[type="submit"]');
    try {
        form.setAttribute('data-submitting', 'true');
        submit.disabled = true;

        // create payload
        const payload = generatePayload(form);
        userMobileNumder = payload.userMobileNumder;
        console.log(payload.userMobileNumder);

        // convert number to string 
        let mobileNumberStr = userMobileNumder.toString();
        // take last four digit 
        let lastFourDigits = mobileNumberStr.slice(-4);
        console.log(lastFourDigits);

        let otpMessageElement = document.getElementById('form-otpmessage');

        otpMessageElement.textContent += ' ' + lastFourDigits;

        console.log(otpMessageElement.textContent);

        const mobileNumberInput = document.querySelector('#form-mobilenumber');
        if (mobileNumberInput) {
            mobileNumberInput.value = payload.userMobileNumder;
            mobileNumberInput.readOnly = true;//to read only
        }

        // Function to ensure only one digit is entered
        function enforceSingleDigit(event) {
            const inputField = event.target;
            let value = inputField.value;
            // Allow only numeric input and truncate to one character
            if (!/^\d$/.test(value)) {
                value = value.replace(/[^\d]/g, '');
            }
            inputField.value = value.slice(0, 1);
        }
        const otpFields = document.querySelectorAll('#form-otpfieldset input[type="text"]');
        // Add event listener to each OTP input field
        otpFields.forEach(field => {
            field.addEventListener('input', enforceSingleDigit);
        });

        startTimer();

        // const response = await fetch(form.dataset.action, {
        //   method: 'POST',
        //   body: JSON.stringify({ data: payload }),
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        // });
        // if (response.ok) {
        makeAjaxRequest('POST', 'https://h9qipagt5.godrejfinance.com/v1/ehf/outsources/generateotp', '', '')
        sampleRUM('form:submit', { source: '.form', target: form.dataset.action });
        //   if (form.dataset.confirmation) {
        //     window.location.href = form.dataset.confirmation;
        //   }
        // } else {
        //   const error = await response.text();
        //   throw new Error(error);
        // }
    } catch (e) {
        handleSubmitError(form, e);
    } finally {
        form.setAttribute('data-submitting', 'false');
    }
}



