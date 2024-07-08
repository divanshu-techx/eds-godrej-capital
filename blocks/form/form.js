import createField from './form-fields.js';
import { sampleRUM } from '../../scripts/aem.js';
import { makeAjaxRequest, generateOtpPayload, generateVerifyOtpPayload, startTimer, handleVerify } from '../becomepartnerform/becomepartnerform.js';

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
        makeAjaxRequest('POST', 'https://h9qipagt5.godrejfinance.com/v1/ehf/outsources/generateotp', generateOtpPayload(payload))
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


export default async function decorate(block) {
    const formLink = block.querySelector('a[href$=".json"]');
    if (!formLink) return;

    const form = await createForm(formLink.href);
    block.replaceChildren(form);

    // Initially hide all elements with class form2
    const form2Elements = block.querySelectorAll('.form2');
    form2Elements.forEach(form2 => {
        form2.style.display = 'none';
    });

    let errorCount = 0; // Counter to track the number of errors

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Check for errors related to checkboxes
        const formerror = document.getElementById('firstset');
        const checkboxes = formerror.querySelectorAll('.form1.field-wrapper.checkbox-wrapper.selection-wrapper.checked');
        if (checkboxes.length === 0) {
            const errorMessage = document.createElement('div');
            errorMessage.textContent = 'Please select products.';
            errorMessage.classList.add('error-message');
            formerror.insertAdjacentElement('afterend', errorMessage);
            errorCount++; // Increment error count
        } else {
            const errorMessage = document.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
                errorCount--; // Decrement error count
            }
        }

        // Check for errors related to radio buttons
        const secondsetFieldset = document.getElementById('secondset');
        const selectedRadioButtons = secondsetFieldset.querySelectorAll('.form1.field-wrapper.radio-wrapper.selection-wrapper.selected');
        if (selectedRadioButtons.length === 0) {
            const errorMessage = document.createElement('div');
            errorMessage.textContent = 'Please select location.';
            errorMessage.classList.add('error-message');
            secondsetFieldset.insertAdjacentElement('afterend', errorMessage);
            errorCount++; // Increment error count
        } else {
            const errorMessage = document.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
                errorCount--; // Decrement error count
            }
        }

        // If any errors exist, prevent form submission
        if (errorCount > 0) {
            return;
        }

        // Proceed with form submission if there are no errors
        const valid = form.checkValidity();
        if (valid) {
            handleSubmit(form);
            // Hide form1 elements
            const form1Elements = block.querySelectorAll('.form1');
            form1Elements.forEach(form1 => {
                form1.style.display = 'none';
            });
            form2Elements.forEach(form2 => {
                form2.style.display = 'block';
            });
        } else {
            const firstInvalidEl = form.querySelector(':invalid:not(fieldset)');
            if (firstInvalidEl) {
                firstInvalidEl.focus();
                firstInvalidEl.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });

    // Listen for change event on checkboxes
    const firstFieldset = document.getElementById('firstset');
    firstFieldset.addEventListener('change', () => {
        // Remove error message if any checkbox is checked
        const errorMessage = document.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
            errorCount--; // Decrement error count
        }
    });

    // Listen for change event on radio buttons
    const secondFieldset = document.getElementById('secondset');
    secondFieldset.addEventListener('change', () => {
        // Remove error message if any radio button is selected
        const errorMessage = document.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
            errorCount--; // Decrement error count
        }
    });


    $('.form2.verify-btn .button').click(function (e) {
        console.log('btn-2')
        e.preventDefault();
        const payload = generatePayload(form);
        handleVerify(generateVerifyOtpPayload(payload), userMobileNumder);
    });

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

