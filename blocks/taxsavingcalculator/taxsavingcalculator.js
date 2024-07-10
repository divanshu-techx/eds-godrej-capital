function numberToWords(num) {
    if (num < 1000) {
        return num.toString();
    }

    const suffixes = [
        [1e7, 'Crores'],
        [1e5, 'Lakhs'],
        [1e3, 'Thousands']
    ];

    for (let i = 0; i < suffixes.length; i++) {
        const [divisor, suffix] = suffixes[i];
        if (num >= divisor) {
            return `${Math.floor(num / divisor)} ${suffix}`;
        }
    }
}
function formatNumberToIndianCommas(number) {
    // Convert the number to a string
    const numStr = number.toString();
    // Split the number into integer and decimal parts
    const [integerPart, decimalPart] = numStr.split('.');

    // Format the integer part with Indian commas
    const lastThreeDigits = integerPart.slice(-3);
    const otherDigits = integerPart.slice(0, -3);

    const formattedNumber = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + (otherDigits ? "," : "") + lastThreeDigits;

    // If there's a decimal part, add it back
    return decimalPart ? `${formattedNumber}.${decimalPart}` : formattedNumber;
}
function getDataAttributeValueByName(name) {
    const element = document.querySelector(`[data-${name}]`);
    return element ? element.getAttribute(`data-${name}`) : '';
}
function getMetaData(metadata) {
    // Extract the values using the function getDataAttributeValueByName
    metadata.ageTitle = getDataAttributeValueByName('age-title');
    metadata.ageMin = getDataAttributeValueByName('age-min');
    metadata.ageMax = getDataAttributeValueByName('age-max');
    metadata.totalTextTitle = getDataAttributeValueByName('total-text-title');
    metadata.totalTaxMin = getDataAttributeValueByName('total-tax-min');
    metadata.totalTaxMax = getDataAttributeValueByName('total-tax-max');
    metadata.principalTitleAnnual = getDataAttributeValueByName('principal-title-annual');
    metadata.principalMinAnnual = getDataAttributeValueByName('principal-min-annual');
    metadata.principalMaxAnnual = getDataAttributeValueByName('principal-max-annual');
    metadata.interestTitleAnnual = getDataAttributeValueByName('interest-title-annual');
    metadata.interestMinAnnual = getDataAttributeValueByName('interest-min-annual');
    metadata.interestMaxAnnual = getDataAttributeValueByName('interest-max-annual');
    metadata.yearSymbol =   getDataAttributeValueByName('year-symbol');
    metadata.rupeeSymbolHindi   =  getDataAttributeValueByName('rupee-symbol-hindi');
    metadata.rupeeSymbolEng =    getDataAttributeValueByName('rupee-symbol-eng');
    metadata.percentSymbol  =   getDataAttributeValueByName('percent-symbol');
    metadata.applyNowLabel  =   getDataAttributeValueByName('apply-now-label');
    metadata.incomeTaxBenifitLabel  =   getDataAttributeValueByName('income-tax-benefits-label');
    metadata.incomeTaxAfterLabel    =   getDataAttributeValueByName('income-tax-after-label');
    metadata.incomeTaxBeforeLabel   =   getDataAttributeValueByName('income-tax-before-label');
    metadata.cessTaxRate   =   getDataAttributeValueByName('cess-rate');
    metadata.redirectionPath    =   getDataAttributeValueByName('redirection-path-tax-saving');
    // Optionally, return the metadata object
    return metadata;
}
const validateAndShowError = (value, min, max, errorElement) => {
    if (value < min || value > max) {
        errorElement.style.display = 'block';
    } else {
        errorElement.style.display = 'none';
    }
};

function getHtmlData(newMetaData) {
    const htmlCode = `
    <div class="calculator-container-tax-saving">
        <div class="inputBox_tax_saving">
        <div class="inputs_tax_saving">
            <div class="input-details-tax-saving">
                <label for="age">${newMetaData.ageTitle}</label>
                <div class="tax_saving_input_label">
                <span id="inputLabel_tax_saving">${newMetaData.yearSymbol}</span>
                <span id="age"  class="inputSpan_tax_saving" contenteditable="true" data-min="${newMetaData.ageMin}" data-max="${newMetaData.ageMax}" onblur="updateDisplay()">${(newMetaData.ageMin)}</span>
                </div>
            </div>
            <input type="range" id="ageRange" min="${newMetaData.ageMin}" max="${newMetaData.ageMax}" value="${newMetaData.ageMin}" oninput="updateRange('age')">
            <div class="input-bottom-details-tax-saving">
                <span>${newMetaData.ageMin}Year</span>
                <span>${newMetaData.ageMax}Years</span>
            </div>
            <div class="errorMsg_tax_saving">
                <p id="ageError" class="error_text" style="display: none;">Value must be between ${newMetaData.ageMin} and ${newMetaData.ageMax}</p>
            </div>
         </div>

         <div class="input_tax_saving">
            <div class="input-details-tax-saving">
                <label for="income">${newMetaData.totalTextTitle}</label>
                <div class="tax_saving_input_label">
                <span id="total_tax_label">${newMetaData.rupeeSymbolEng}</span>
                <span id="income" class="inputSpan_tax_saving" contenteditable="true" data-min="${newMetaData.totalTaxMin}" data-max="${newMetaData.totalTaxMax}" onblur="updateDisplay()">${formatNumberToIndianCommas(newMetaData.totalTaxMin)}</span>
            </div>
            </div>
            <input type="range" id="incomeRange" min="${newMetaData.totalTaxMin}" max="${newMetaData.totalTaxMax}" value="${newMetaData.totalTaxMin}"  oninput="updateRange('income')">
            <div class="input-bottom-details-tax-saving">
                <span>${numberToWords(newMetaData.totalTaxMin)}</span>
                <span>${numberToWords(newMetaData.totalTaxMax)}</span>
            </div>
            <div class="errorMsg_tax_saving">
                <p id="incomeError" class="error_text" style="display: none;">Value must be between ${newMetaData.totalTaxMin} and ${newMetaData.totalTaxMax}</p>
            </div>
            </div>
            <div class="input_tax_saving">
            <div class="input-details-tax-saving">
                <label for="principal">${newMetaData.principalTitleAnnual}</label>
                <div class="tax_saving_input_label">
                <span id="tax_saving_principal_label">${newMetaData.rupeeSymbolEng}</span>
                <span id="principal" class="inputSpan_tax_saving" contenteditable="true" data-min="${newMetaData.principalMinAnnual}" data-max="${newMetaData.principalMaxAnnual}" onblur="updateDisplay()">${formatNumberToIndianCommas(newMetaData.principalMinAnnual)}</span>
                </div>
            </div>
            <input type="range" id="principalRange" min="${newMetaData.principalMinAnnual}" max="${newMetaData.principalMaxAnnual}" value="${newMetaData.principalMinAnnual}"  oninput="updateRange('principal')">
            <div class="input-bottom-details-tax-saving">
                <span>${numberToWords(newMetaData.principalMinAnnual)}</span>
                <span>${numberToWords(newMetaData.principalMaxAnnual)}</span>
            </div>
            <div class="errorMsg_tax_saving">
                <p id="principalError" class="error_text" style="display: none;">Value must be between ${newMetaData.principalMinAnnual} and ${newMetaData.principalMaxAnnual}</p>
            </div>

            </div>

            <div class="input_tax_saving">
            <div class="input-details-tax-saving">
                <label for="interest">${newMetaData.interestTitleAnnual}</label>
                <div class="tax_saving_input_label">
                 <span id="interest_tax_label">${newMetaData.yearSymbol}</span>
                <span id="interest" class="inputSpan_tax_saving" contenteditable="true" data-min="${newMetaData.interestMinAnnual}" data-max="${newMetaData.interestMaxAnnual}" onblur="updateDisplay()">${formatNumberToIndianCommas(newMetaData.interestMinAnnual)}</span>
            </div>
            </div>
            <input type="range" id="interestRange" min="${newMetaData.interestMinAnnual}" max="${newMetaData.interestMaxAnnual}" value="${newMetaData.interestMinAnnual}"  oninput="updateRange('interest')">
            <div class="input-bottom-details-tax-saving">
                <span>${numberToWords(newMetaData.interestMinAnnual)}</span>
                <span>${numberToWords(newMetaData.interestMaxAnnual)}</span>
            </div>
            <div class="errorMsg_tax_saving">
                <p id="interestError" class="error_text" style="display: none;">Value must be between ${newMetaData.interestMinAnnual} and ${newMetaData.interestMaxAnnual}</p>
            </div>

            </div>

            <div class="input_tax_saving">
            <div class="input-details-tax-saving">
                <label for="month">Loan Tenures (In Months)</label>
                <div class="tax_saving_input_label">
                 <span id="month_tax_label">Mos.</span>
                <span id="month" class="inputSpan_tax_saving" contenteditable="true" data-min="1" data-max="11" onblur="updateDisplay()">1</span>
            </div>
            </div>
            <input type="range" id="monthRange" min="1" max="11" value="1"  oninput="updateRange('month')">
            <div class="input-bottom-details-tax-saving">
                <span>1</span>
                <span>11</span>
            </div>
            <div class="errorMsg_tax_saving">
                <p id="monthError" class="error_text" style="display: none;">Value must be between 1 and 11</p>
            </div>

            </div>

        </div>

        <div class="outputs_tax_saving">
            <div class="result_tax_saving">
                <div>${newMetaData.incomeTaxBenifitLabel}</div>
                <div class="taxResult">
                <h2  id="taxBenefits">${newMetaData.rupeeSymbolHindi}
                </h2>
                </div> 
            </div>
            
            <div class="result_tax_cess_result">
                <p class="cessRate">Income Tax Payable Includes ${newMetaData.cessTaxRate}${newMetaData.percentSymbol} Cess.</p>
            </div>  
            <div class="result_tax_saving_next">
                <div class="result_tax_other_result">
                <div>${newMetaData.incomeTaxBeforeLabel}</div>
                <div class="taxResult">
                <h2 id="taxBefore">${newMetaData.rupeeSymbolHindi}
                </h2>
                </div>
                </div>
                <div class="result_tax_other_result">
                <div>${newMetaData.incomeTaxAfterLabel}</div>
                <div class="taxResult">
                <h2  id="taxAfter">${newMetaData.rupeeSymbolHindi}</h2>
                </div>
                </div>

                <div class="result_tax_other_result">
                <button id="apply-btn-tax">${newMetaData.applyNowLabel}</button>
                </div>
            </div>
        </div>
    </div>`;
    return htmlCode;
}
function initializeEventListeners(block) {
    // Add event listeners to text inputs to update corresponding range inputs
    block.querySelector('#age').addEventListener('blur', function () {
        const value = parseFloat(this.textContent);
        const ageRange = block.querySelector('#ageRange');
        ageRange.value = isNaN(value) ? ageRange.min : Math.min(Math.max(value, ageRange.min), ageRange.max);
        const percentage = ((ageRange.value - ageRange.min) / (ageRange.max - ageRange.min)) * 100;
        ageRange.style.setProperty('--value', `${percentage}%`);
        this.textContent = formatNumberToIndianCommas(ageRange.value);
        updateDisplay();

    });

    block.querySelector('#income').addEventListener('blur', function () {
        const value = parseFloat(this.textContent.replace(/\D/g, ''));
        const incomeRange = block.querySelector('#incomeRange');
        incomeRange.value = isNaN(value) ? incomeRange.min : Math.min(Math.max(value, incomeRange.min), incomeRange.max);
        const percentage = ((incomeRange.value - incomeRange.min) / (incomeRange.max - incomeRange.min)) * 100;
        incomeRange.style.setProperty('--value', `${percentage}%`);
        this.textContent = formatNumberToIndianCommas(incomeRange.value);
        updateDisplay();
    });

    block.querySelector('#principal').addEventListener('blur', function () {
        const value = parseFloat(this.textContent.replace(/\D/g, ''));
        const principalRange = block.querySelector('#principalRange');
        principalRange.value = isNaN(value) ? principalRange.min : Math.min(Math.max(value, principalRange.min), principalRange.max);
        const percentage = ((principalRange.value - principalRange.min) / (principalRange.max - principalRange.min)) * 100;
        principalRange.style.setProperty('--value', `${percentage}%`);
        this.textContent = formatNumberToIndianCommas(principalRange.value);
        updateDisplay()
    });

    block.querySelector('#interest').addEventListener('blur', function () {
        const value = parseFloat(this.textContent.replace(/\D/g, ''));
        const interestRange = block.querySelector('#interestRange');
        interestRange.value = isNaN(value) ? interestRange.min : Math.min(Math.max(value, interestRange.min), interestRange.max);
        const percentage = ((interestRange.value - interestRange.min) / (interestRange.max - interestRange.min)) * 100;
        this.textContent = formatNumberToIndianCommas(interestRange.value);
        interestRange.style.setProperty('--value', `${percentage}%`);
        updateDisplay();
    });

    block.querySelector('#month').addEventListener('blur', function () {
        const value = parseFloat(this.textContent);
        const monthRange = block.querySelector('#monthRange');
        monthRange.value = isNaN(value) ? monthRange.min : Math.min(Math.max(value, monthRange.min), monthRange.max);
        const percentage = ((monthRange.value - monthRange.min) / (monthRange.max - monthRange.min)) * 100;
        monthRange.style.setProperty('--value', `${percentage}%`);
        this.textContent = formatNumberToIndianCommas(monthRange.value);
        updateDisplay();

    });

    // Add event listeners to spans to enforce numeric input
    document.querySelectorAll('.input-details-tax-saving span').forEach(span => {
        span.addEventListener('input', function () {
            const value = this.textContent.trim(); // Get the text content and remove leading/trailing whitespace
            const numericValue = parseFloat(value.replace(/\D/g, '')); // Extract numeric value

            if (!isNaN(numericValue)) {
                const formattedValue = numericValue.toString(); // Format numeric value
                this.textContent = formattedValue; // Update span content with formatted numeric value
                // Set cursor position to the end of the span
                const range = document.createRange();
                const selection = window.getSelection();
                range.setStart(this.childNodes[0], formattedValue.length);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
            } else {
                this.textContent = ''; // Clear span content if input is not numeric
            }

            // Update the corresponding range input's value and background
            const id = span.id;
            // console.log(id);
            const rangeElement = document.getElementById(`${id}Range`);
            rangeElement.value = numericValue;
            const percentage = (rangeElement.value / rangeElement.max) * 100;
            rangeElement.style.setProperty('--value', `${percentage}%`);
            updateDisplay();
        });
    });

    // Add an event listener for the change event to each range input
    block.querySelectorAll('input[type="range"]').forEach(input => {
    input.addEventListener('change', function() {
        const id = this.id.replace('Range', ''); // Get the ID of the associated span
        document.getElementById(id).textContent = formatNumberToIndianCommas(this.value);
        updateDisplay(); // Call updateDisplay function after the value is changed
        
    });
});


}
function calculateTax(income, principal, interest, month) {
    const cessRate = parseFloat(getDataAttributeValueByName('cess-rate')) / 100;
    
    // Function to calculate tax based on income slabs
    function calculateBasicTax(income) {
        let tax = 0;
        if (income > 1000000) {
            tax += (income - 1000000) * 0.30;
            income = 1000000;
        }
        if (income > 500000) {
            tax += (income - 500000) * 0.20;
            income = 500000;
        }
        if (income > 250000) {
            tax += (income - 250000) * 0.05;
        }
        return tax;
    }
    
    // Calculate tax before loan deductions
    const basicTaxBefore = calculateBasicTax(income * month);
    const cessBefore = basicTaxBefore * cessRate;
    const taxBefore = Math.round(basicTaxBefore + cessBefore);
    
    // Calculate taxable income after loan deductions
    const taxableIncomeAfter = Math.max(0, (income - principal - interest) * month);
    
    // Calculate tax after loan deductions
    const basicTaxAfter = calculateBasicTax(taxableIncomeAfter);
    const cessAfter = basicTaxAfter * cessRate;
    const taxAfter = Math.round(basicTaxAfter + cessAfter);
    
    // Calculate tax benefits
    const taxBenefits = Math.round(taxBefore - taxAfter);
    
    return {
        taxBefore: taxBefore,
        taxAfter: taxAfter,
        taxBenefits: taxBenefits
    };
}

function updateDisplay() {
    const age = parseFloat(document.getElementById('age').textContent);
    const income = parseFloat(document.getElementById('income').textContent.replace(/\D/g, ''));
    const principal = parseFloat(document.getElementById('principal').textContent.replace(/\D/g, ''));
    const interest = parseFloat(document.getElementById('interest').textContent.replace(/\D/g, ''));

    const month = parseFloat(document.getElementById('month').textContent.replace(/\D/g, ''));

    // Validation
    const ageMin = parseFloat(document.getElementById('age').dataset.min);
    const ageMax = parseFloat(document.getElementById('age').dataset.max);
    const incomeMin = parseFloat(document.getElementById('income').dataset.min);
    const incomeMax = parseFloat(document.getElementById('income').dataset.max);
    const principalMin = parseFloat(document.getElementById('principal').dataset.min);
    const principalMax = parseFloat(document.getElementById('principal').dataset.max);
    const interestMin = parseFloat(document.getElementById('interest').dataset.min);
    const interestMax = parseFloat(document.getElementById('interest').dataset.max);

    const monthMin = parseFloat(document.getElementById('month').dataset.min);
    const monthMax = parseFloat(document.getElementById('month').dataset.max);


    validateAndShowError(age, ageMin, ageMax, document.getElementById('ageError'));
    validateAndShowError(income, incomeMin, incomeMax, document.getElementById('incomeError'));
    validateAndShowError(principal, principalMin, principalMax, document.getElementById('principalError'));
    validateAndShowError(interest, interestMin, interestMax, document.getElementById('interestError'));
    validateAndShowError(month, monthMin, monthMax, document.getElementById('monthError'));
 
    // Calculate taxes
    const { taxBefore, taxAfter, taxBenefits } = calculateTax(income, principal, interest,month);

    document.getElementById('taxBefore').textContent = `₹ ${formatNumberToIndianCommas(taxBefore)}`;
    document.getElementById('taxAfter').textContent = `₹ ${formatNumberToIndianCommas(taxAfter)}`;
    document.getElementById('taxBenefits').textContent = `₹ ${formatNumberToIndianCommas(taxBenefits)}`;
}

function setupApplyNowButton(newMetaData) {
    const applyBtn = document.getElementById('apply-btn-tax');
    applyBtn.addEventListener('click', () => {
        window.location.href = newMetaData.redirectionPath;
    })
}
// Function to update range input and corresponding span
function updateRange(id) {
    const element = document.getElementById(`${id}Range`);
    const { value, max, min } = element;
    const percentage = ((value - min) / (max - min)) * 100;
    element.style.setProperty('--value', `${percentage}%`);
    document.getElementById(id).textContent = formatNumberToIndianCommas(value);
    // updateDisplay();
}


export default async function decorate(block) {
    let metadata = {
        ageTitle: '',
        ageMin: '',
        ageMax: '',
        totalTextTitle: '',
        totalTaxMin: '',
        totalTaxMax: '',
        principalTitleAnnual: '',
        principalMinAnnual: '',
        principalMaxAnnual: '',
        interestTitleAnnual: '',
        interestMinAnnual: '',
        interestMaxAnnual: '',
    };
    let newMetaData = await getMetaData(metadata);
    let htmlCode = getHtmlData(newMetaData);
    block.innerHTML += htmlCode;

    initializeEventListeners(block);
    updateDisplay();
    setupApplyNowButton(newMetaData);
}

window.updateRange = updateRange;
window.updateDisplay = updateDisplay;



