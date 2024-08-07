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
    [1e3, 'Thousands'],
  ];

  for (let i = 0; i < suffixes.length; i += 1) {
    const [divisor, suffix] = suffixes[i];
    if (num >= divisor) {
      return `${Math.floor(num / divisor)} ${suffix}`;
    }
  }
  return num;
}
function updateCalculations(block) {
  // Retrieve and parse input values
  const principal = parseFloat(block.querySelector('#principalOutstanding').value);
  const interestRate = parseFloat(block.querySelector('#existingInterestRate').value);
  const tenure = parseFloat(block.querySelector('#balanceTenureYears').value);
  const newInterestRate = parseFloat(block.querySelector('#newInterestRate').value);
  const newLoanTenureYears = parseFloat(block.querySelector('#newLoanTenure').value);
  const newLoanTenureMonths = parseFloat(block.querySelector('#newLoanTenureMonths').value);

  // Calculate the new loan tenure in months
  const newLoanTenureTotalMonths = (newLoanTenureYears * 12) + newLoanTenureMonths;

  // Variable assignments based on new logic
  const finalprincipal = principal;
  const finaltenure = tenure * 12;
  const finalELInterestRate = interestRate / 1200;

  const finalPLTenure = newLoanTenureTotalMonths;
  const finalPLInterestRate = newInterestRate / 1200;

  // Calculate existing EMI per month for remaining tenure
  const baseRate = 1 + finalELInterestRate;
  const compoundedRate = baseRate ** finaltenure;
  const existingEmi = (
    finalprincipal * finalELInterestRate * compoundedRate
  ) / (compoundedRate - 1);

  // Calculate proposed EMI per month for new tenure
  const rate = 1 + finalPLInterestRate;
  const ratePowerTenure = rate ** finalPLTenure;

  const proposedEmi = (
    finalprincipal * finalPLInterestRate * ratePowerTenure
  ) / (ratePowerTenure - 1);
  // Calculate total savings in cash outflow and savings in EMI
  let totalSavinginCashoutflow = (existingEmi * finaltenure) - (proposedEmi * finalPLTenure);
  totalSavinginCashoutflow = totalSavinginCashoutflow < 0 ? 0 : totalSavinginCashoutflow;

  let savinginEmi = existingEmi - proposedEmi;
  savinginEmi = savinginEmi < 0 ? 0 : savinginEmi;

  // Update the display values
  block.querySelector('#principalOutstandingDisplay').textContent = `₹ ${finalprincipal.toLocaleString('en-IN')}`;
  block.querySelector('#balanceTenureYearsDisplay').textContent = `${tenure.toFixed(2)}`;
  block.querySelector('#existingInterestRateDisplay').textContent = `${interestRate.toFixed(2)}`;
  block.querySelector('#newInterestRateDisplay').textContent = `${newInterestRate.toFixed(2)}`;
  block.querySelector('#newLoanTenureDisplay').textContent = `${newLoanTenureYears}`;
  block.querySelector('#newLoanTenureMonthsDisplay').textContent = `${newLoanTenureMonths}`;

  block.querySelector('#totalSaving').textContent = `₹ ${Math.round(totalSavinginCashoutflow).toLocaleString('en-IN')}`;
  block.querySelector('#savingsInEMI').textContent = `₹ ${Math.round(savinginEmi).toLocaleString('en-IN')}`;
  block.querySelector('#existingEMI').textContent = `₹ ${Math.round(existingEmi).toLocaleString('en-IN')}`;
  block.querySelector('#proposedEMI').textContent = `₹ ${Math.round(proposedEmi).toLocaleString('en-IN')}`;
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
      this.value = `${parts[0]}.${parts.slice(1).join('')}`;
    }
  });
}
function getCalcAttribute() {
  const calculatorAttributes = {
    principalOutstanding: {
      label: getDataAttributeValueByName('principal-outstanding-label'),
      min: parseFloat(getDataAttributeValueByName('principal-outstanding-min')),
      max: parseFloat(getDataAttributeValueByName('principal-outstanding-max')),
    },
    balanceTenureYear: {
      label: getDataAttributeValueByName('balance-tenure-year-label'),
      min: parseFloat(getDataAttributeValueByName('balance-tenure-year-min')),
      max: parseFloat(getDataAttributeValueByName('balance-tenure-year-max')),
    },
    existingInterest: {
      label: getDataAttributeValueByName('existing-interest-label'),
      min: parseFloat(getDataAttributeValueByName('existing-interest-min')),
      max: parseFloat(getDataAttributeValueByName('existing-interest-max')),
    },
    proposedInterestRate: {
      label: getDataAttributeValueByName('proposed-interest-rate-label'),
      min: parseFloat(getDataAttributeValueByName('proposed-interest-rate-min')),
      max: parseFloat(getDataAttributeValueByName('proposed-interest-rate-max')),
    },
    proposedLoanTenureYear: {
      label: getDataAttributeValueByName('proposed-loan-tenure-year-label'),
      min: parseFloat(getDataAttributeValueByName('proposed-loan-tenure-year-min')),
      max: parseFloat(getDataAttributeValueByName('proposed-loan-tenure-year-max')),
    },
    proposedLoanTenureMonth: {
      label: getDataAttributeValueByName('proposed-loan-tenure-month-label'),
      min: parseFloat(getDataAttributeValueByName('proposed-loan-tenure-month-min')),
      max: parseFloat(getDataAttributeValueByName('proposed-loan-tenure-month-max')),
    },
    totalSavingCashOutflowOutput: getDataAttributeValueByName('total-saving-cash-outflow-output'),
    savingsInEmiOutput: getDataAttributeValueByName('savings-in-emi-output'),
    proposedEmiOutput: getDataAttributeValueByName('proposed-emi-output'),
    existingEmiOutput: getDataAttributeValueByName('existing-emi-output'),
    applyNowLabel: getDataAttributeValueByName('apply-now-label'),
    rupeeSymbols: {
      hindi: getDataAttributeValueByName('rupee-symbol-hindi'),
      english: getDataAttributeValueByName('rupee-symbol-en'),
    },
    percentSymbol: getDataAttributeValueByName('percent-symbol'),
    monthSymbol: getDataAttributeValueByName('month-symbol'),
    yearSymbol: getDataAttributeValueByName('year-symbol'),
    redirectionPath: getDataAttributeValueByName('redirection-balance-path'),
    proposed_loan_label: getDataAttributeValueByName('proposed-loan-label'),
    existing_loan_label: getDataAttributeValueByName('existing-loan-label'),
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
                    <input type="range" id="balanceTenureYears" min="${calculatorAttributes.balanceTenureYear.min}" max="${calculatorAttributes.balanceTenureYear.max}" value="${calculatorAttributes.balanceTenureYear.min}" step="0.01">
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
                    <input type="range" id="existingInterestRate" min="${calculatorAttributes.existingInterest.min}" max="${calculatorAttributes.existingInterest.max}" value="${calculatorAttributes.existingInterest.min}" step="0.01">
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
                    <input type="range" id="newInterestRate" min="${calculatorAttributes.proposedInterestRate.min}" max="${calculatorAttributes.proposedInterestRate.max}" value="${calculatorAttributes.proposedInterestRate.min}" step="0.01">
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
function updateRangeColors() {
  const isMobileView = window.matchMedia('(max-width: 767px)').matches;
  const mobileColor = '#f4f4f4';
  const desktopColor = '#fff';

  const rangeInputs = document.querySelectorAll('input[type=range]');
  rangeInputs.forEach((input) => {
    const min = parseFloat(input.min);
    const max = parseFloat(input.max);
    const val = parseFloat(input.value);
    const normalizedValue = ((val - min) / (max - min)) * 100;
    const endColor = isMobileView ? mobileColor : desktopColor;
    input.style.background = `linear-gradient(to right, #8CB133 ${normalizedValue}%, ${endColor} ${normalizedValue}%)`;
  });
}
function toggleInputBox(block) {
  const loanTenureYearsApr = block.querySelector('#newLoanTenureDisplay');
  const loanTenureYearsAprRange = block.querySelector('#newLoanTenure');
  const loanTenureMonthsAprRange = block.querySelector('#newLoanTenureMonths');
  const loanTenureMonthsApr = block.querySelector('#newLoanTenureMonthsDisplay');

  loanTenureYearsApr.addEventListener('input', function () {
    const maxValue = loanTenureYearsAprRange.max;
    const { value } = this;

    if (maxValue <= value) {
      loanTenureMonthsAprRange.disabled = true;
      loanTenureMonthsApr.disabled = true;
      loanTenureMonthsAprRange.value = loanTenureMonthsAprRange.min;
      loanTenureMonthsApr.value = loanTenureMonthsAprRange.min;
      // value = loanTenureMonthsAprRange.min;
      updateCalculations(block);
      updateRangeColors();
    } else {
      loanTenureMonthsAprRange.disabled = false;
      loanTenureMonthsApr.disabled = false;
    }
  });

  loanTenureYearsAprRange.addEventListener('change', function () {
    const maxValue = loanTenureYearsAprRange.max;
    const { value } = this;

    if (maxValue <= value) {
      loanTenureMonthsAprRange.disabled = true;
      loanTenureMonthsApr.disabled = true;
      loanTenureMonthsAprRange.value = loanTenureMonthsAprRange.min;
      loanTenureMonthsApr.value = loanTenureMonthsAprRange.min;
      // value = loanTenureMonthsAprRange.min;
      console.log(value);
      updateCalculations(block);
      updateRangeColors();
    } else {
      loanTenureMonthsAprRange.disabled = false;
      loanTenureMonthsApr.disabled = false;
    }
  });
}

// Wrap your main functionality in the decorate function
export default async function decorate(block) {
  const calculatorAttributes = getCalcAttribute();
  const htmlCode = getHTML(calculatorAttributes);
  block.innerHTML += htmlCode;

  // Event listeners for range inputs (excluding principalOutstanding)
  const sliders = block.querySelectorAll('input[type=range]:not(#principalOutstanding)');
  sliders.forEach((slider) => {
    const displayId = `${slider.id}Display`;
    const displayInput = block.querySelector(`#${displayId}`);
    const errorSpanId = `${slider.id}Error`;
    const errorSpan = block.querySelector(`#${errorSpanId}`);

    const min = parseFloat(slider.min);
    const max = parseFloat(slider.max);

    slider.addEventListener('input', () => {
      const value = parseFloat(slider.value);
      if (!Number.isNaN(value) && value >= min && value <= max) {
        displayInput.value = slider.value;
        errorSpan.textContent = '';
      } else {
        errorSpan.textContent = `Enter a value between ${min} and ${max}`;
      }
      updateRangeColors();
    });

    slider.addEventListener('change', () => {
      updateCalculations(block);
    });
  });

  // Event listeners for text inputs (excluding principalOutstandingDisplay)
  const textInputs = block.querySelectorAll('input[type=text]:not(#principalOutstandingDisplay)');
  textInputs.forEach((input) => {
    const rangeId = input.id.replace('Display', '');
    const rangeInput = block.querySelector(`#${rangeId}`);
    const errorSpanId = `${rangeId}Error`;
    const errorSpan = block.querySelector(`#${errorSpanId}`);

    const min = parseFloat(rangeInput.min);
    const max = parseFloat(rangeInput.max);

    input.addEventListener('blur', () => {
      const value = parseFloat(input.value);
      if (Number.isNaN(value)) {
        input.value = min;
        rangeInput.value = min;
      } else if (value >= max) {
        input.value = max;
        rangeInput.value = max;
      } else if (value <= min) {
        input.value = min;
        rangeInput.value = min;
      } else {
        rangeInput.value = value;
      }
      errorSpan.textContent = '';
      updateCalculations(block);
      updateRangeColors();
    });

    input.addEventListener('input', () => {
      const value = parseFloat(input.value);
      if (Number.isNaN(value) || value < min || value > max) {
        errorSpan.textContent = `Enter a value between ${min} and ${max}`;
      } else {
        errorSpan.textContent = '';
      }
    });
  });

  // Event listener for principalOutstandingDisplay input
  const principalOutstandingDisplay = block.querySelector('#principalOutstandingDisplay');
  const principalOutstanding = block.querySelector('#principalOutstanding');
  const principalErrorSpan = block.querySelector('#principalOutstandingError');

  principalOutstandingDisplay.addEventListener('blur', () => {
    const min = parseFloat(principalOutstanding.min);
    const max = parseFloat(principalOutstanding.max);

    const rawValue = principalOutstandingDisplay.value.replace(/,/g, ''); // Remove existing commas
    const value = parseFloat(rawValue);

    if (!Number.isNaN(value) && value >= min && value <= max) {
      principalOutstanding.value = value;
      principalOutstandingDisplay.value = formatNumberToIndianCommas(rawValue);
      principalErrorSpan.textContent = '';
    } else if (value >= max) {
      principalOutstanding.value = max;
      principalOutstandingDisplay.value = formatNumberToIndianCommas(max.toString());
      principalErrorSpan.textContent = '';
    } else {
      principalOutstanding.value = min;
      principalOutstandingDisplay.value = formatNumberToIndianCommas(min.toString());
      principalErrorSpan.textContent = '';
    }
    updateCalculations(block);
    updateRangeColors();
  });

  principalOutstandingDisplay.addEventListener('input', () => {
    const min = parseFloat(principalOutstanding.min);
    const max = parseFloat(principalOutstanding.max);

    const rawValue = principalOutstandingDisplay.value.replace(/,/g, ''); // Remove existing commas
    const value = parseFloat(rawValue);

    if (Number.isNaN(value) || value < min || value > max) {
      principalErrorSpan.textContent = `Enter a value between ${formatNumberToIndianCommas(min)} and ${formatNumberToIndianCommas(max)}`;
    } else {
      principalErrorSpan.textContent = '';
    }
  });

  principalOutstanding.addEventListener('input', () => {
    const rawValue = principalOutstanding.value;
    principalOutstandingDisplay.value = formatNumberToIndianCommas(rawValue);
    updateRangeColors();
  });

  principalOutstanding.addEventListener('change', () => {
    updateCalculations(block);
  });

  const applyNowButton = block.querySelector('#balnance-apply-now');
  applyNowButton.addEventListener('click', () => {
    window.location.href = calculatorAttributes.redirectionPath;
  });

  // Allow only numeric and decimal input
  const inputs = block.querySelectorAll('input[type="text"]');
  inputs.forEach((input) => allowOnlyNumericAndDecimal(input));

  updateCalculations(block);
  updateRangeColors();
  toggleInputBox(block);
}

window.addEventListener('resize', updateRangeColors);
window.addEventListener('load', updateRangeColors);
