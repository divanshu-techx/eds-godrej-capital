
// Function to calculate EMI
function calculateEMI(principal, annualRate, tenureMonths) {
  const monthlyRate = annualRate / 12 / 100;
  return (principal * monthlyRate * Math.pow((1 + monthlyRate), tenureMonths)) /
    (Math.pow((1 + monthlyRate), tenureMonths) - 1);
}

function formatNumberToIndianCommas(number) {
  // Convert the number to a string
  const numStr = number.toString();
  // Split the number into integer and decimal parts
  const [integerPart, decimalPart] = numStr.split('.');

  // Format the integer part with Indian commas
  const lastThreeDigits = integerPart.slice(-3);
  const otherDigits = integerPart.slice(0, -3);

  const formattedNumber = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + (otherDigits ? ',' : '') + lastThreeDigits;

  // If there's a decimal part, add it back
  return decimalPart ? `${formattedNumber}.${decimalPart}` : formattedNumber;
}

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
// Function to update calculations
function updateCalculations(block) {
  const principalOutstanding = parseFloat(block.querySelector('#principalOutstanding').value);
  const existingInterestRate = parseFloat(block.querySelector('#existingInterestRate').value);
  const balanceTenureYears = parseFloat(block.querySelector('#balanceTenureYears').value);
  const newInterestRate = parseFloat(block.querySelector('#newInterestRate').value);
  const newLoanTenureYears = parseFloat(block.querySelector('#newLoanTenure').value);
  const newLoanTenureMonths = parseFloat(block.querySelector('#newLoanTenureMonths').value);
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
  block.querySelector('#principalOutstandingDisplay').textContent = `₹ ${principalOutstanding.toLocaleString('en-IN')}`;
  block.querySelector('#balanceTenureYearsDisplay').textContent = `${balanceTenureYears}`;
  block.querySelector('#existingInterestRateDisplay').textContent = `${existingInterestRate.toFixed(2)}`;
  block.querySelector('#newInterestRateDisplay').textContent = `${newInterestRate.toFixed(2)}`;
  block.querySelector('#newLoanTenureDisplay').textContent = `${newLoanTenureYears}`;
  block.querySelector('#newLoanTenureMonthsDisplay').textContent = `${newLoanTenureMonths}`;

  block.querySelector('#totalSaving').textContent = `₹ ${Math.floor(totalSavingMonths).toLocaleString('en-IN')}`;
  block.querySelector('#savingsInEMI').textContent = `₹ ${Math.floor(savingsInEMIMonthly).toLocaleString('en-IN')}`;
  block.querySelector('#existingEMI').textContent = `₹ ${Math.floor(existingEMIMonthly).toLocaleString('en-IN')}`;
  block.querySelector('#proposedEMI').textContent = `₹ ${Math.floor(proposedEMIMonthly).toLocaleString('en-IN')}`;
}
function getDataAttributeValueByName(name) {
  const element = document.querySelector(`[data-${name}]`);
  return element ? element.getAttribute(`data-${name}`) : '';
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
function getCalcAttribute() {
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
    redirectionPath: getDataAttributeValueByName('redirection-balance-path'),
    proposed_loan_label :getDataAttributeValueByName('proposed-loan-label'),
    existing_loan_label :getDataAttributeValueByName('existing-loan-label')
  };
  return calculatorAttributes;
}
function getHTML(calculatorAttributes) {
  const htmlCode = `
        <div class="calculator-container-balance-tansfer">
            <div class="inputsBoxBalance">
                <div class="inputBalance">
                <p class="existgingLoan-input-label">${calculatorAttributes.existing_loan_label}</p>
                    <div class="inputBoxBalanceLabel">
                        <label for="principalOutstanding">${calculatorAttributes.principalOutstanding.label}</label>
                        <div class="balanceSpanInput">
                            <span id="balanceprincipalLabel">${calculatorAttributes.rupeeSymbols.english}</span>
                            <input type="text" id="principalOutstandingDisplay" value="${calculatorAttributes.principalOutstanding.min}"/>
                        </div>
                    </div>
                    <div class="inputBoxBalanceRange">
                    <input type="range" id="principalOutstanding" min="${calculatorAttributes.principalOutstanding.min}" max="${calculatorAttributes.principalOutstanding.max}" value="${calculatorAttributes.principalOutstanding.min}">
                    <div class="inputBoxBalanceBottom">
                        <span>${numberToWords(calculatorAttributes.principalOutstanding.min)}</span>
                        <span>${numberToWords(calculatorAttributes.principalOutstanding.max)}</span>
                    </div>
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
                    <div class="inputBoxBalanceRange">
                    <input type="range" id="balanceTenureYears" min="${calculatorAttributes.balanceTenureYear.min}" max="${calculatorAttributes.balanceTenureYear.max}" value="${calculatorAttributes.balanceTenureYear.min}">
                    <div class="inputBoxBalanceBottom">
                        <span>${calculatorAttributes.balanceTenureYear.min} Year</span>
                        <span>${calculatorAttributes.balanceTenureYear.max} Years</span>
                    </div>
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
                     <div class="inputBoxBalanceRange">
                    <input type="range" id="existingInterestRate" min="${calculatorAttributes.existingInterest.min}" max="${calculatorAttributes.existingInterest.max}" value="${calculatorAttributes.existingInterest.min}" step="0.1">
                    <div class="inputBoxBalanceBottom">
                        <span>${calculatorAttributes.existingInterest.min}${calculatorAttributes.percentSymbol}</span>
                        <span>${calculatorAttributes.existingInterest.max}${calculatorAttributes.percentSymbol}</span>
                    </div>
                    </div>
                    <span id="existingInterestRateError" class="error-span"></span>
                </div>
   
                <div class="inputBalance">
                <p class="proposedLoan-input-label">${calculatorAttributes.proposed_loan_label}</p>
                    <div class="inputBoxBalanceLabel">
                        <label for="newInterestRate">${calculatorAttributes.proposedInterestRate.label}</label>
                        <div class="balanceSpanInput">
                            <span id="newInterestRateInputLabel">${calculatorAttributes.percentSymbol}</span>
                            <input type="text" id="newInterestRateDisplay" value="${calculatorAttributes.proposedInterestRate.min}">
                        </div>
                    </div>
                <div class="inputBoxBalanceRange">
                    <input type="range" id="newInterestRate" min="${calculatorAttributes.proposedInterestRate.min}" max="${calculatorAttributes.proposedInterestRate.max}" value="${calculatorAttributes.proposedInterestRate.min}">
                    <div class="inputBoxBalanceBottom">
                        <span>${calculatorAttributes.proposedInterestRate.min}${calculatorAttributes.percentSymbol}</span>
                        <span>${calculatorAttributes.proposedInterestRate.max}${calculatorAttributes.percentSymbol}</span>
                    </div>
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
                <div class="inputBoxBalanceRange">
                    <input type="range" id="newLoanTenure" min="${calculatorAttributes.proposedLoanTenureYear.min}" max="${calculatorAttributes.proposedLoanTenureYear.max}" value="${calculatorAttributes.proposedLoanTenureYear.min}">
                    <div class="inputBoxBalanceBottom">
                        <span>${calculatorAttributes.proposedLoanTenureYear.min} Year</span>
                        <span>${calculatorAttributes.proposedLoanTenureYear.max} Years</span>
                    </div>
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
                <div class="inputBoxBalanceRange">
                    <input type="range" id="newLoanTenureMonths" min="${calculatorAttributes.proposedLoanTenureMonth.min}" max="${calculatorAttributes.proposedLoanTenureMonth.max}" value="${calculatorAttributes.proposedLoanTenureMonth.min}">
                    <div class="inputBoxBalanceBottom">
                        <span>${calculatorAttributes.proposedLoanTenureMonth.min}</span>
                        <span>${calculatorAttributes.proposedLoanTenureMonth.max} Months</span>
                    </div>
                </div>
                    <span id="newLoanTenureMonthsError" class="error-span"></span>
                </div>
            </div>
   
            <div class="outputs-balance-result">
                <div class="balance-output">
                <div class="balance-output-taxoutflow">
                    <p>${calculatorAttributes.totalSavingCashOutflowOutput}</p>
                    <h2 id="totalSaving">${calculatorAttributes.rupeeSymbols.hindi}0</h2>
                </div>
                <div class="combined-tab-result-apply">
                <div class="balance-output-bottom-result">  
                <div class="balance-output-list">
                    <div class="balance-output-span-list">
                    <span class="savingEmiSpan"></span>
                    <span class="text-span-list">${calculatorAttributes.savingsInEmiOutput}</span>
                    </div>
                    <div class="text-span-list-rs" id="savingsInEMI">${calculatorAttributes.rupeeSymbols.hindi}0</div>
                </div>
               
                <div class="balance-output-list">
                <div class="balance-output-span-list">
                <span class="EMISpan"></span>
                <span class="text-span-list">${calculatorAttributes.existingEmiOutput}</span>
                </div>
                 <div class="text-span-list-rs" id="existingEMI">${calculatorAttributes.rupeeSymbols.hindi}0</div>
                </div>
               
                <div class="balance-output-list">
                <div class="balance-output-span-list">
                <span class="EMISpan"></span>
                <span class="text-span-list">${calculatorAttributes.proposedEmiOutput}</span>
                </div>
                 <div  class="text-span-list-rs" id="proposedEMI">${calculatorAttributes.rupeeSymbols.hindi}0</div>
                </div>
                </div> 
                <div class="balance-output-apply">
                    <button id="balnance-apply-now">${calculatorAttributes.applyNowLabel}</button>
                </div>
                </div>   
                </div>
            </div>
        </div>
        `;
  return htmlCode;
}
// Function to update the range input colors
function updateRangeColors(block) {
  const isMobileView = window.matchMedia('(max-width: 767px)').matches;
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



// Wrap your main functionality in the decorate function
export default async function decorate(block) {

  const calculatorAttributes = getCalcAttribute();
  const htmlCode = getHTML(calculatorAttributes);
  block.innerHTML += htmlCode;

  // Event listeners for range inputs (excluding principalOutstanding)
  const sliders = block.querySelectorAll('input[type=range]:not(#principalOutstanding)');
  sliders.forEach(slider => {
    slider.addEventListener('change', function () {
      const displayId = slider.id + 'Display';
      const displayInput = block.querySelector(`#${displayId}`);
      const errorSpanId = slider.id + 'Error';
      const errorSpan = block.querySelector(`#${errorSpanId}`);

      const min = parseFloat(slider.min);
      const max = parseFloat(slider.max);

      const value = parseFloat(slider.value);
      if (!isNaN(value) && value >= min && value <= max) {
        updateCalculations(block);
        // updateRangeColors(block); // Uncomment if needed
        displayInput.value = slider.value;
        errorSpan.textContent = '';
      } else {
        errorSpan.textContent = `Enter a value between ${min} and ${max}`;
      }
    });

    slider.addEventListener('input', function () {
      updateRangeColors(block);
    });
  });

  // Event listeners for text inputs (including principalOutstandingDisplay)
  const textInputs = block.querySelectorAll('input[type=text]');
  textInputs.forEach(input => {
    if (!input.id.includes('principalOutstandingDisplay')) {
      input.addEventListener('blur', function () {
        const rangeId = input.id.replace('Display', '');
        const rangeInput = block.querySelector(`#${rangeId}`);
        const errorSpanId = rangeId + 'Error';
        const errorSpan = block.querySelector(`#${errorSpanId}`);

        const min = parseFloat(rangeInput.min);
        const max = parseFloat(rangeInput.max);

        const value = parseFloat(input.value);
        if (!isNaN(value) && value >= min && value <= max) {
          rangeInput.value = input.value;
          updateCalculations(block);
          updateRangeColors(block);
          errorSpan.textContent = '';
        } else {
          errorSpan.textContent = `Enter a value between ${min} and ${max}`;
        }
      });
    }
  });

  // Event listener for principalOutstandingDisplay input
  const principalOutstandingDisplay = block.querySelector('#principalOutstandingDisplay');
  const principalOutstanding = block.querySelector('#principalOutstanding');
  const principalOutstandingError = block.querySelector('#principalOutstandingError');

  // Event listener for principalOutstandingDisplay input blur event
  principalOutstandingDisplay.addEventListener('blur', function () {
    const min = parseFloat(principalOutstanding.min);
    const max = parseFloat(principalOutstanding.max);

    const rawValue = principalOutstandingDisplay.value.replace(/,/g, ''); // Remove existing commas
    const value = parseFloat(rawValue);

    if (!isNaN(value) && value >= min && value <= max) {
      principalOutstanding.value = value;
      updateCalculations(block);
      principalOutstandingDisplay.value = formatNumberToIndianCommas(rawValue);
      principalOutstandingError.textContent = '';
      updateRangeColors(block);
    } else {
      principalOutstandingError.textContent = `Enter a value between ${min} and ${max}`;
    }
  });

  // Event listener for principalOutstanding range input change event
  principalOutstanding.addEventListener('change', function () {
    const rawValue = principalOutstanding.value;
    principalOutstandingDisplay.value = formatNumberToIndianCommas(rawValue);
    updateCalculations(block);
    // updateRangeColors(block);
  });
  principalOutstanding.addEventListener('input', () => {
    updateRangeColors(block);
  })



  const applyNowButton = block.querySelector('#balnance-apply-now');
  applyNowButton.addEventListener('click', () => {
    window.location.href = calculatorAttributes.redirectionPath;
  })

  // Allow only numeric and decimal input
  const inputs = block.querySelectorAll('input[type="text"]');
  inputs.forEach(input => allowOnlyNumericAndDecimal(input));

  updateCalculations(block);
  updateRangeColors(block);
}
window.addEventListener('resize', updateRangeColors);
window.addEventListener('load', updateRangeColors);



