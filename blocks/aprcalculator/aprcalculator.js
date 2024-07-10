// Function to get data attribute value by name
function getDataAttributeValueByName(name) {
    const element = document.querySelector(`[data-${name}]`);
    return element ? element.getAttribute(`data-${name}`) : '';
}

// Function to convert numbers to words
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
    return num.toString();
}

// Function to fetch all data attributes
function fetchAttributes() {
    return {
        loanAmountTitle: getDataAttributeValueByName('loan-amount-title'),
        loanAmountMin: parseFloat(getDataAttributeValueByName('loan-amount-min')),
        loanAmountMax: parseFloat(getDataAttributeValueByName('loan-amount-max')),
        interestTitle: getDataAttributeValueByName('interest-title'),
        interestMin: parseFloat(getDataAttributeValueByName('interest-min')),
        interestMax: parseFloat(getDataAttributeValueByName('interest-max')),
        yearTitle: getDataAttributeValueByName('year-title'),
        yearMin: parseFloat(getDataAttributeValueByName('year-min')),
        yearMax: parseFloat(getDataAttributeValueByName('year-max')),
        monthTitle: getDataAttributeValueByName('month-title'),
        monthMin: parseFloat(getDataAttributeValueByName('month-min')),
        monthMax: parseFloat(getDataAttributeValueByName('month-max')),
        originationChargesTitle: getDataAttributeValueByName('origination-charges-title'),
        originationChargesMin: parseFloat(getDataAttributeValueByName('origination-charges-min')),
        originationChargesMax: parseFloat(getDataAttributeValueByName('origination-charges-max')),
        textSize: parseFloat(getDataAttributeValueByName('font-size')),
        rupeeSymbol: getDataAttributeValueByName('rupee-symbol'),
        monthSymbol: getDataAttributeValueByName('month-symbol'),
        percentSymbol: getDataAttributeValueByName('percent-symbol'),
        yearSymbol: getDataAttributeValueByName('year-symbol'),
        applyNowLabel: getDataAttributeValueByName('apply-now-label'),
        annualPercentLabel: getDataAttributeValueByName('annual-percent-label'),
        redirectionPath: getDataAttributeValueByName('redirection-path-apr')
    };
}

// Function to render HTML content
function renderHTML(attributes) {
    return `
        <div class="calculator-container">
            <div class="inputs">
                <div class="inputBoxApr">
                    <div class="inputBoxAprLabel">
                        <label for="loanAmountApr">${attributes.loanAmountTitle}</label>
                        <div class="inputAprLabelInput">
                        <span id="loanAmountAprspan">${attributes.rupeeSymbol}</span>
                        <input type="text" id="loanAmountApr" value="${attributes.loanAmountMin}">
                        </div>
                    </div>
                    <div class="inputBoxAprRange">
                        <input type="range" id="loanAmountAprRange" min="${attributes.loanAmountMin}" max="${attributes.loanAmountMax}" value="${attributes.loanAmountMin}">
                        <div class="inputBoxAprBottom">
                            <span>${attributes.loanAmountMin}</span>
                            <span>${numberToWords(attributes.loanAmountMax)}</span>
                        </div>
                    </div>
                </div>
                <div class="inputBoxApr">
                    <div class="inputBoxAprLabel">
                        <label for="interestRateApr">${attributes.interestTitle}</label>
                        <div class="inputAprLabelInput">
                        <span id="interestRateAprspan">${attributes.percentSymbol}</span>
                        <input type="text" id="interestRateApr" value="${attributes.interestMin}">
                        </div>
                    </div>
                    <div class="inputBoxAprRange">
                        <input type="range" id="interestRateAprRange" min="${attributes.interestMin}" max="${attributes.interestMax}" value="${attributes.interestMin}" step="0.1">
                        <div class="inputBoxAprBottom">
                            <span>${attributes.interestMin}${attributes.percentSymbol}</span>
                            <span>${attributes.interestMax}${attributes.percentSymbol}</span>
                        </div>
                    </div>
                </div>
                <div class="inputBoxApr">
                    <div class="inputBoxAprLabel">
                        <label for="loanTenureYearsApr">${attributes.yearTitle}</label>
                        <div class="inputAprLabelInput">
                        <span id="loanTenureYearsAprspan">${attributes.yearSymbol}</span>
                        <input type="text" id="loanTenureYearsApr" value="${attributes.yearMin}">
                        </div>
                    </div>
                    <div class="inputBoxAprRange">
                        <input type="range" id="loanTenureYearsAprRange" min="${attributes.yearMin}" max="${attributes.yearMax}" value="${attributes.yearMin}">
                        <div class="inputBoxAprBottom">
                            <span>${attributes.yearMin}</span>
                            <span>${attributes.yearMax} Years</span>
                        </div>
                    </div>
                </div>
                <div class="inputBoxApr">
                    <div class="inputBoxAprLabel">
                        <label for="loanTenureMonthsApr">${attributes.monthTitle}</label>
                        <div class="inputAprLabelInput">
                        <span id="loanTenureMonthsAprspan">${attributes.monthSymbol}</span>
                        <input type="text" id="loanTenureMonthsApr" value="${attributes.monthMin}">
                        </div>
                    </div>
                    <div class="inputBoxAprRange">
                        <input type="range" id="loanTenureMonthsAprRange" min="${attributes.monthMin}" max="${attributes.monthMax}" value="${attributes.monthMin}">
                        <div class="inputBoxAprBottom">
                            <span>${attributes.monthMin}</span>
                            <span>${attributes.monthMax} Months</span>
                        </div>
                    </div>
                </div>
                <div class="inputBoxApr">
                    <div class="inputBoxAprLabel">
                        <label for="loanOriginationChargesApr">${attributes.originationChargesTitle}</label>
                        <div class="inputAprLabelInput">
                        <span id="loanOriginationChargesAprspan">${attributes.rupeeSymbol}</span>
                        <input type="text" id="loanOriginationChargesApr" value="${attributes.originationChargesMin}">
                        </div>
                    </div>
                    <div class="inputBoxAprRange">
                        <input type="range" id="loanOriginationChargesAprRange" min="${attributes.originationChargesMin}" max="${attributes.originationChargesMax}" value="${attributes.originationChargesMin}">
                        <div class="inputBoxAprBottom">
                            <span>${numberToWords(attributes.originationChargesMin)}</span>
                            <span>${numberToWords(attributes.originationChargesMax)}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="outputs">
                <div class="result">
                    <div>${attributes.annualPercentLabel}</div>
                    <div id="aprDisplay">${attributes.percentSymbol}</div>
                </div>
                <div class="apply-btn-apr-result">
                    <button id="apply-btn-apr">${attributes.applyNowLabel}</button>
                </div>
            </div>
        </div>`;
}

// Function to update range input colors
function updateRangeColors(block) {
    const isMobileView = window.matchMedia("(max-width: 767px)").matches;
    const mobileColor = '#f4f4f4';  //  color for mobile view
    const desktopColor = '#fff'; // White color for desktop view
 
    const rangeInputs = document.querySelectorAll('input[type=range]');
    rangeInputs.forEach(input => {
        const min = parseFloat(input.min);
        const max = parseFloat(input.max);
        const val = parseFloat(input.value);
        const normalizedValue = (val - min) / (max - min) * 100;
        const endColor = isMobileView ? mobileColor : desktopColor;
        input.style.background = `linear-gradient(to right, #8CB133 ${normalizedValue}%, ${endColor} ${normalizedValue}%)`;
    });
}
 

// Function to update APR calculations and display
function updateAPR(block) {
    const loanAmount = parseFloat(block.querySelector('#loanAmountAprRange').value);
    const interestRate = parseFloat(parseFloat(block.querySelector('#interestRateAprRange').value).toFixed(1));
    const loanTenureYears = parseFloat(block.querySelector('#loanTenureYearsAprRange').value);
    const loanTenureMonths = parseFloat(block.querySelector('#loanTenureMonthsAprRange').value);
    const originationCharges = parseFloat(block.querySelector('#loanOriginationChargesAprRange').value);

    block.querySelector('#loanAmountApr').value = loanAmount.toLocaleString();
    block.querySelector('#interestRateApr').value = interestRate;
    block.querySelector('#loanTenureYearsApr').value = loanTenureYears;
    block.querySelector('#loanTenureMonthsApr').value = loanTenureMonths;
    block.querySelector('#loanOriginationChargesApr').value = originationCharges.toLocaleString();

    const totalLoanTenure = loanTenureYears * 12 + loanTenureMonths;
    const monthlyInterestRate = interestRate / 100 / 12;
    const monthlyEMI = loanAmount * monthlyInterestRate * Math.pow((1 + monthlyInterestRate), totalLoanTenure) /
        (Math.pow((1 + monthlyInterestRate), totalLoanTenure) - 1);
    const totalPayment = monthlyEMI * totalLoanTenure;
    const totalCost = totalPayment + originationCharges;
    const apr = (totalCost / loanAmount - 1) / (totalLoanTenure / 12) * 100;

    block.querySelector('#aprDisplay').textContent = `${apr.toFixed(2)}%`;
}

// Function to add event listeners to range inputs
function addRangeInputListeners(block) {
    const rangeInputs = block.querySelectorAll('input[type=range]');
    rangeInputs.forEach(input => {
        input.addEventListener('input', function () {
            const textInputId = this.id.replace('Range', '');
            const textInput = document.getElementById(textInputId);
            if (textInput) {
                textInput.value = this.value.toLocaleString();
                updateRangeColors(block);
            }
            updateAPR(block);
        });
    });
}

// Function to add event listeners to text inputs
function addTextInputListeners(block) {
    const textInputs = block.querySelectorAll('input[type=text]:not(#interestRateApr)');
    textInputs.forEach(input => {
        input.addEventListener('input', function () {
            const numericValue = parseFloat(this.value.replace(/[^\d.-]/g, ''));
            if (!isNaN(numericValue)) {
                const rangeId = `${this.id}Range`;
                const rangeInput = block.querySelector(`#${rangeId}`);
                if (rangeInput) {
                    rangeInput.value = numericValue;
                    updateAPR(block);
                    updateRangeColors(block);
                }
            }
        });
    });

    const interestRateInput = block.querySelector('#interestRateApr');
    interestRateInput.addEventListener('change', function () {
        let numericValue = parseFloat(this.value.replace(/[^\d.]/g, ''));
        if (!isNaN(numericValue)) {
            numericValue = Math.min(Math.max(numericValue, 0), 20);
            const rangeInput = block.querySelector('#interestRateAprRange');
            if (rangeInput) {
                rangeInput.value = numericValue.toFixed(1);
                updateAPR(block);
                updateRangeColors(block);
            }
        }else{
            this.value=" ";
        }
    });
}

function setApplyNowButton(block,attribute){
    const applyNow=block.querySelector('#apply-btn-apr');
    applyNow.addEventListener('click',()=>{
        window.location.href=attribute.redirectionPath;
    })
}
// Main function to decorate the block
export default async function decorate(block) {
    const attributes = fetchAttributes();
    block.innerHTML = renderHTML(attributes);
    updateRangeColors(block);
    updateAPR(block);
    addRangeInputListeners(block);
    addTextInputListeners(block);
    setApplyNowButton(block,attributes);
}
window.addEventListener('resize',updateRangeColors);
window.addEventListener('load',updateRangeColors);