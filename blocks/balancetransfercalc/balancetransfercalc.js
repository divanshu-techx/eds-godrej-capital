
// Function to calculate EMI
function calculateEMI(principal, annualRate, tenureMonths) {
    const monthlyRate = annualRate / 12 / 100;
    return (principal * monthlyRate * Math.pow((1 + monthlyRate), tenureMonths)) /
           (Math.pow((1 + monthlyRate), tenureMonths) - 1);
}
// Function to update calculations
function updateCalculations() {
    const principalOutstanding = parseFloat(document.getElementById('principalOutstanding').value);
    const existingInterestRate = parseFloat(document.getElementById('existingInterestRate').value);
    const balanceTenureYears = parseFloat(document.getElementById('balanceTenureYears').value);
    const newInterestRate = parseFloat(document.getElementById('newInterestRate').value);
    const newLoanTenureYears = parseFloat(document.getElementById('newLoanTenure').value);
    const newLoanTenureMonths = parseFloat(document.getElementById('newLoanTenureMonths').value);
    const newLoanTenureTotalMonths = (newLoanTenureYears * 12) + newLoanTenureMonths;

    // Calculate existing EMI per month for remaining tenure
    const existingEMIMonthly = calculateEMI(principalOutstanding, existingInterestRate, balanceTenureYears * 12);

    // Calculate proposed EMI per month for new tenure
    const proposedEMIMonthly = calculateEMI(principalOutstanding, newInterestRate, newLoanTenureTotalMonths);

    // Savings in EMI per month
    const savingsInEMIMonthly = existingEMIMonthly - proposedEMIMonthly;

    // Total savings over the new loan tenure in months
    const totalSavingMonths = savingsInEMIMonthly * newLoanTenureTotalMonths;

    // Update the display values
    document.getElementById('principalOutstandingDisplay').textContent = `₹ ${principalOutstanding.toLocaleString()}`;
    document.getElementById('balanceTenureYearsDisplay').textContent = `${balanceTenureYears}`;
    document.getElementById('existingInterestRateDisplay').textContent = `${existingInterestRate.toFixed(2)}`;
    document.getElementById('newInterestRateDisplay').textContent = `${newInterestRate.toFixed(2)}`;
    document.getElementById('newLoanTenureDisplay').textContent = `${newLoanTenureYears}`;
    document.getElementById('newLoanTenureMonthsDisplay').textContent = `${newLoanTenureMonths}`;

    document.getElementById('totalSaving').textContent = `₹ ${totalSavingMonths.toLocaleString()}`;
    document.getElementById('savingsInEMI').textContent = `₹ ${savingsInEMIMonthly.toLocaleString()}`;
    document.getElementById('existingEMI').textContent = `₹ ${existingEMIMonthly.toLocaleString()}`;
    document.getElementById('proposedEMI').textContent = `₹ ${proposedEMIMonthly.toLocaleString()}`;
}
function getDataAttributeValueByName(name) {
    const element = document.querySelector(`[data-${name}]`);
    return element ? element.getAttribute(`data-${name}`) : null;
}
// Function to allow only numeric and decimal input
function allowOnlyNumericAndDecimal(input) {
    input.addEventListener('input', function () {
        const nonNumericPattern = /[^\d.]/g;
        if (nonNumericPattern.test(this.value)) {
            this.value = this.value.replace(nonNumericPattern, '');
        }
        
        const parts = this.value.split('.');
        if (parts.length > 2) {
            this.value = parts[0] + '.' + parts.slice(1).join('');
        }
    });
}
function getCalcAttribute(){
    const calculatorAttributes = {
        principalOutstanding: {
            label: getDataAttributeValueByName('principal-outstanding-label'),
            min: parseFloat(getDataAttributeValueByName('principal-outstanding-min')),
            max: parseFloat(getDataAttributeValueByName('principal-outstanding-max'))
        },
        balanceTenureYear: {
            label: getDataAttributeValueByName('balance-tenure-year-label'),
            min: parseFloat(getDataAttributeValueByName('balance-tenure-year-min')),
            max: parseFloat(getDataAttributeValueByName('balance-tenure-year-max'))
        },
        existingInterest: {
            label: getDataAttributeValueByName('existing-interest-label'),
            min: parseFloat(getDataAttributeValueByName('existing-interest-min')),
            max: parseFloat(getDataAttributeValueByName('existing-interest-max'))
        },
        proposedInterestRate: {
            label: getDataAttributeValueByName('proposed-interest-rate-label'),
            min: parseFloat(getDataAttributeValueByName('proposed-interest-rate-min')),
            max: parseFloat(getDataAttributeValueByName('proposed-interest-rate-max'))
        },
        proposedLoanTenureYear: {
            label: getDataAttributeValueByName('proposed-loan-tenure-year-label'),
            min: parseFloat(getDataAttributeValueByName('proposed-loan-tenure-year-min')),
            max: parseFloat(getDataAttributeValueByName('proposed-loan-tenure-year-max'))
        },
        proposedLoanTenureMonth: {
            label: getDataAttributeValueByName('proposed-loan-tenure-month-label'),
            min: parseFloat(getDataAttributeValueByName('proposed-loan-tenure-month-min')),
            max: parseFloat(getDataAttributeValueByName('proposed-loan-tenure-month-max'))
        },
        totalSavingCashOutflowOutput: getDataAttributeValueByName('total-saving-cash-outflow-output'),
        savingsInEmiOutput: getDataAttributeValueByName('savings-in-emi-output'),
        proposedEmiOutput: getDataAttributeValueByName('proposed-emi-output'),
        existingEmiOutput: getDataAttributeValueByName('existing-emi-output'),
        applyNowLabel: getDataAttributeValueByName('apply-now-label'),
        rupeeSymbols: {
            hindi: getDataAttributeValueByName('rupee-symbol-hindi'),
            english: getDataAttributeValueByName('rupee-symbol-en')
        },
        percentSymbol: getDataAttributeValueByName('percent-symbol'),
        monthSymbol: getDataAttributeValueByName('month-symbol'),
        yearSymbol: getDataAttributeValueByName('year-symbol'),
        redirectionPath : getDataAttributeValueByName('redirection-balance-path')
    };
return calculatorAttributes;    
}
function getHTML(calculatorAttributes) {
        const htmlCode = `
        <div class="calculator-container-balance-tansfer">
            <div class="inputsBoxBalance">
                <div class="inputBalance">
                    <div class="inputBoxBalanceLabel">
                        <label for="principalOutstanding">${calculatorAttributes.principalOutstanding.label}</label>
                        <div class="balanceSpanInput">
                            <span id="balanceprincipalLabel">${calculatorAttributes.rupeeSymbols.english}</span>
                            <input type="text" id="principalOutstandingDisplay" value="${calculatorAttributes.principalOutstanding.min}">
                        </div>
                    </div>
                    <input type="range" id="principalOutstanding" min="${calculatorAttributes.principalOutstanding.min}" max="${calculatorAttributes.principalOutstanding.max}" value="${calculatorAttributes.principalOutstanding.min}">
                    <div class="balance-bottom">
                        <span>${calculatorAttributes.principalOutstanding.min}</span>
                        <span>${calculatorAttributes.principalOutstanding.max}</span>
                    </div>
                    <span id="principalOutstandingError" class="error-span"></span>
                </div>
    
                <div class="inputBalance">
                    <div class="inputBoxBalanceLabel">
                        <label for="balanceTenureYears">${calculatorAttributes.balanceTenureYear.label}</label>
                        <div class="balanceSpanInput">
                            <span id="balanceTenureYearsLabel">${calculatorAttributes.yearSymbol}</span>
                            <input type="text" id="balanceTenureYearsDisplay" value="${calculatorAttributes.balanceTenureYear.min}">
                        </div>
                    </div>
                    <input type="range" id="balanceTenureYears" min="${calculatorAttributes.balanceTenureYear.min}" max="${calculatorAttributes.balanceTenureYear.max}" value="${calculatorAttributes.balanceTenureYear.min}">
                    <div class="balance-bottom">
                        <span>${calculatorAttributes.balanceTenureYear.min}</span>
                        <span>${calculatorAttributes.balanceTenureYear.max}</span>
                    </div>
                    <span id="balanceTenureYearsError" class="error-span"></span>
                </div>
    
                <div class="inputBalance">
                    <div class="inputBoxBalanceLabel">
                        <label for="existingInterestRate">${calculatorAttributes.existingInterest.label}</label>
                        <div class="balanceSpanInput">
                            <span id="balanceSpanInputLabel">${calculatorAttributes.percentSymbol}</span>
                            <input type="text" id="existingInterestRateDisplay" value="${calculatorAttributes.existingInterest.min}">
                        </div>
                    </div>
                    <input type="range" id="existingInterestRate" min="${calculatorAttributes.existingInterest.min}" max="${calculatorAttributes.existingInterest.max}" value="${calculatorAttributes.existingInterest.min}" step="0.1">
                    <div class="balance-bottom">
                        <span>${calculatorAttributes.existingInterest.min}</span>
                        <span>${calculatorAttributes.existingInterest.max}</span>
                    </div>
                    <span id="existingInterestRateError" class="error-span"></span>
                </div>
    
                <div class="inputBalance">
                    <div class="inputBoxBalanceLabel">
                        <label for="newInterestRate">${calculatorAttributes.proposedInterestRate.label}</label>
                        <div class="balanceSpanInput">
                            <span id="newInterestRateInputLabel">${calculatorAttributes.percentSymbol}</span>
                            <input type="text" id="newInterestRateDisplay" value="${calculatorAttributes.proposedInterestRate.min}">
                        </div>
                    </div>
                    <input type="range" id="newInterestRate" min="${calculatorAttributes.proposedInterestRate.min}" max="${calculatorAttributes.proposedInterestRate.max}" value="${calculatorAttributes.proposedInterestRate.min}">
                    <div class="balance-bottom">
                        <span>${calculatorAttributes.proposedInterestRate.min}</span>
                        <span>${calculatorAttributes.proposedInterestRate.max}</span>
                    </div>
                    <span id="newInterestRateError" class="error-span"></span>
                </div>
    
                <div class="inputBalance">
                    <div class="inputBoxBalanceLabel">
                        <label for="newLoanTenure">${calculatorAttributes.proposedLoanTenureYear.label}</label>
                        <div class="balanceSpanInput">
                            <span id="newLoanTenureInputLabel">${calculatorAttributes.yearSymbol}</span>
                            <input type="text" id="newLoanTenureDisplay" value="${calculatorAttributes.proposedLoanTenureYear.min}">
                        </div>
                    </div>
                    <input type="range" id="newLoanTenure" min="${calculatorAttributes.proposedLoanTenureYear.min}" max="${calculatorAttributes.proposedLoanTenureYear.max}" value="${calculatorAttributes.proposedLoanTenureYear.min}">
                    <div class="balance-bottom">
                        <span>${calculatorAttributes.proposedLoanTenureYear.min}</span>
                        <span>${calculatorAttributes.proposedLoanTenureYear.max}</span>
                    </div>
                    <span id="newLoanTenureError" class="error-span"></span>
                </div>
    
                <div class="inputBalance">
                    <div class="inputBoxBalanceLabel">
                        <label for="newLoanTenureMonths">${calculatorAttributes.proposedLoanTenureMonth.label}</label>
                        <div class="balanceSpanInput">
                            <span id="newLoanMonthsInputLabel">${calculatorAttributes.monthSymbol}</span>
                            <input type="text" id="newLoanTenureMonthsDisplay" value="${calculatorAttributes.proposedLoanTenureMonth.min}">
                        </div>
                    </div>
                    <input type="range" id="newLoanTenureMonths" min="${calculatorAttributes.proposedLoanTenureMonth.min}" max="${calculatorAttributes.proposedLoanTenureMonth.max}" value="${calculatorAttributes.proposedLoanTenureMonth.min}">
                    <div class="balance-bottom">
                        <span>${calculatorAttributes.proposedLoanTenureMonth.min}</span>
                        <span>${calculatorAttributes.proposedLoanTenureMonth.max}</span>
                    </div>
                    <span id="newLoanTenureMonthsError" class="error-span"></span>
                </div>
            </div>
    
            <div class="outputs">
                <div class="balance-output">
                    <p>${calculatorAttributes.totalSavingCashOutflowOutput}<span id="totalSaving">${calculatorAttributes.rupeeSymbols.hindi}0</span></p>
                    <p>${calculatorAttributes.savingsInEmiOutput} <span id="savingsInEMI">${calculatorAttributes.rupeeSymbols.hindi}0</span></p>
                    <p>${calculatorAttributes.existingEmiOutput} <span id="existingEMI">${calculatorAttributes.rupeeSymbols.hindi}0</span></p>
                    <p>${calculatorAttributes.proposedEmiOutput} <span id="proposedEMI">${calculatorAttributes.rupeeSymbols.hindi}0</span></p>
                </div>
                <div class="balance-output-apply">
                    <button id="balnance-apply-now">${calculatorAttributes.applyNowLabel}</button>
                </div>
            </div>
        </div>
        `;
    
        return htmlCode;
    }

// Wrap your main functionality in the decorate function
export default async function decorate(block) {
    
    const calculatorAttributes = getCalcAttribute();
    const htmlCode = getHTML(calculatorAttributes);
    block.innerHTML += htmlCode;

    // Function to update the range input colors
    function updateRangeColors() {
        const rangeInputs = block.querySelectorAll('input[type=range]');
        rangeInputs.forEach(input => {
            const min = parseFloat(input.min);
            const max = parseFloat(input.max);
            const val = parseFloat(input.value);

            const normalizedValue = (val - min) / (max - min) * 100;
            input.style.background = `linear-gradient(to right, #8CB133 ${normalizedValue}%, #ccc ${normalizedValue}%)`;
        });
    }

    // Attach event listeners to update calculations on input change
    const sliders = block.querySelectorAll('input[type=range]');
    sliders.forEach(slider => {
        slider.addEventListener('input', function () {
            const displayId = slider.id + 'Display';
            const displayInput = document.getElementById(displayId);
            const errorSpanId = slider.id + 'Error';
            const errorSpan = document.getElementById(errorSpanId);


            const min = parseFloat(slider.min);
            const max = parseFloat(slider.max);

            const value = parseFloat(slider.value);
            if (!isNaN(value) && value >= min && value <= max) {
                updateCalculations();
                updateRangeColors();
                displayInput.value = slider.value;
                errorSpan.textContent = '';
            } else {
                errorSpan.textContent = `Enter a value between ${min} and ${max}`;
            }
        });
    });

    // Attach event listeners to update calculations on text input change
    const textInputs = block.querySelectorAll('input[type=text]');
    textInputs.forEach(input => {
        // allowOnlyNumericAndDecimal(input);
        input.addEventListener('blur', function () {
            const rangeId = input.id.replace('Display', '');
            const rangeInput = document.getElementById(rangeId);
            const errorSpanId = rangeId + 'Error';
            const errorSpan = document.getElementById(errorSpanId);

            // Get min and max values of the range input
            const min = parseFloat(rangeInput.min);
            const max = parseFloat(rangeInput.max);

            // Validate input range and update if valid
            const value = parseFloat(input.value);
            if (!isNaN(value) && value >= min && value <= max) {
                rangeInput.value = input.value;
                updateCalculations();
                updateRangeColors();
                errorSpan.textContent = '';
            } else {
                errorSpan.textContent = `Enter a value between ${min} and ${max}`;
            }
        });
        // Add logic for newLoanTenureMonths
        // Special case for newLoanTenureMonthsDisplay
const newLoanTenureMonthsInput = document.getElementById('newLoanTenureMonths');
const newLoanTenureMonthsDisplay = document.getElementById('newLoanTenureMonthsDisplay');
newLoanTenureMonthsDisplay.addEventListener('blur', function () {
    const errorSpanId = 'newLoanTenureMonthsError';
    const errorSpan = document.getElementById(errorSpanId);

    const min = parseFloat(newLoanTenureMonthsInput.min);
    const max = parseFloat(newLoanTenureMonthsInput.max);
    const value = parseFloat(newLoanTenureMonthsDisplay.value);

    if (!isNaN(value) && value >= min && value <= max) {
        newLoanTenureMonthsInput.value = value;
        updateCalculations();
        updateRangeColors(); // Pass block to updateRangeColors
        errorSpan.textContent = '';
    } else {
        errorSpan.textContent = `Enter a value between ${min} and ${max}`;
    }
});

    });

    const applyNowButton=block.querySelector('#balnance-apply-now');
    applyNowButton.addEventListener('click',()=>{
        window.location.href=calculatorAttributes.redirectionPath;
    })

    updateCalculations();
    updateRangeColors();
}




