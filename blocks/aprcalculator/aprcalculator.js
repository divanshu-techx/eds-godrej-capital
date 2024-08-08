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
    [1e3, 'Thousands'],
  ];

  for (let i = 0; i < suffixes.length; i += 1) {
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
    redirectionPath: getDataAttributeValueByName('redirection-path-apr'),
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
                        <span id="loanAmountAprRangeError" class="error-span"></span>
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
                        <input type="range" id="interestRateAprRange" min="${attributes.interestMin}" max="${attributes.interestMax}" value="${attributes.interestMin}" step="0.01">
                        <div class="inputBoxAprBottom">
                            <span>${attributes.interestMin}${attributes.percentSymbol}</span>
                            <span>${attributes.interestMax}${attributes.percentSymbol}</span>
                        </div>
                        <span id="interestRateAprRangeError" class="error-span"></span>
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
                        <span id="loanTenureYearsAprRangeError" class="error-span"></span>
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
                        <span id="loanTenureMonthsAprRangeError" class="error-span"></span>
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
                        <span id="loanOriginationChargesAprRangeError" class="error-span"></span>
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
function updateRangeColors() {
  const isMobileView = window.matchMedia('(max-width: 767px)').matches;
  const mobileColor = '#f4f4f4'; //  color for mobile view
  const desktopColor = '#fff'; // White color for desktop view

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

function updateAPR(block) {
  // Extract values from the form fields
  const loanAmount = parseFloat(block.querySelector('#loanAmountAprRange').value);
  const interestRate = parseFloat(parseFloat(block.querySelector('#interestRateAprRange').value).toFixed(2));
  const loanTenureYears = parseFloat(block.querySelector('#loanTenureYearsAprRange').value);
  const loanTenureMonths = parseFloat(block.querySelector('#loanTenureMonthsAprRange').value);
  const originationCharges = parseFloat(block.querySelector('#loanOriginationChargesAprRange').value);

  block.querySelector('#loanAmountApr').value = loanAmount.toLocaleString('en-IN');
  block.querySelector('#interestRateApr').value = interestRate;
  block.querySelector('#loanTenureYearsApr').value = loanTenureYears;
  block.querySelector('#loanTenureMonthsApr').value = loanTenureMonths;
  block.querySelector('#loanOriginationChargesApr').value = originationCharges.toLocaleString('en-IN');

  // Convert tenure to months
  const totalTenureMonths = (loanTenureYears * 12) + loanTenureMonths;

  // Calculate APR
  const loanamt = loanAmount;
  const periods = totalTenureMonths;
  const ROI = interestRate;
  const loanOrigin = originationCharges; // Original charges as provided

  let charges = parseFloat(loanamt - loanOrigin);
  let pmt = formulajs.PMT(ROI / 1200, periods, loanamt);
  pmt *= -1;
  charges *= -1;
  let apr = formulajs.RATE(periods, pmt, charges) * 12;

  if (apr === 'Infinity' || Number.isNaN(apr) || apr === '-Infinity') {
    apr = ROI / 100;
  }
  if (!loanamt && !periods && !charges) {
    apr = 0;
  }
  apr *= 100;
  apr = Math.max(6, Math.min(apr, 24));
  apr = `${apr.toFixed(2)}%`;

  // Update the UI with the calculated APR
  block.querySelector('#aprDisplay').textContent = apr;
}

function addRangeInputListeners(block) {
  const rangeInputs = block.querySelectorAll('input[type=range]');
  rangeInputs.forEach((input) => {
    input.addEventListener('input', function () {
      const textInputId = this.id.replace('Range', '');
      const textInput = document.getElementById(textInputId);
      if (textInput) {
        textInput.value = this.value.toLocaleString();
        updateRangeColors();
      }
      updateAPR(block);
    });
  });
}

// Function to add event listeners to text inputs
function addTextInputListeners(block) {
  const textInputs = block.querySelectorAll('input[type=text]:not(#interestRateApr)');
  textInputs.forEach((input) => {
    const rangeId = `${input.id}Range`;
    const rangeInput = block.querySelector(`#${rangeId}`);
    const errorSpanId = `${rangeId}Error`;
    const errorSpan = block.querySelector(`#${errorSpanId}`);
  
    const min = parseFloat(rangeInput.min);
    const max = parseFloat(rangeInput.max);
  
    // Input event for live validation
    input.addEventListener('input', function () {
      const value = this.value.trim();
      let numericValue = parseFloat(value.replace(/[^\d.-]/g, ''));
      if (value === '') {
        if (rangeInput) {
          rangeInput.value = min;
        }
        this.value = '';
        errorSpan.textContent = '';
        errorSpan.style.display = 'none'; // Hide error span
      } else if (!Number.isNaN(numericValue) && numericValue >= min && numericValue <= max) {
        if (rangeInput) {
          rangeInput.value = numericValue;
        }
        errorSpan.textContent = '';
        errorSpan.style.display = 'none';
      } else {
        if (rangeInput) {
          rangeInput.value = numericValue < min ? min : max;
        }
        errorSpan.textContent = `Enter a value between ${min} and ${max}`;
        errorSpan.style.display = 'block';
      }
  
      updateAPR(block);
      updateRangeColors();
    });
  
    // Blur event for final validation and correction
    input.addEventListener('blur', function () {
      const value = this.value.trim();
      let numericValue = parseFloat(value.replace(/[^\d.-]/g, ''));
  
      // If the input is cleared, don't reset to min or max
      if (value === '') {
        return; // Simply return without modifying the value
      }
  
      if (Number.isNaN(numericValue) || numericValue < min) {
        numericValue = min; // Set to min if input is invalid or below min
      } else if (numericValue > max) {
        numericValue = max; // Set to max if input is above max
      }
  
      // Ensure the input field and range input are updated
      if (rangeInput) {
        rangeInput.value = numericValue;
      }
      this.value = numericValue;
      errorSpan.textContent = '';
      errorSpan.style.display = 'none';
  
      updateAPR(block);
      updateRangeColors();
    });
  });

  const interestRateInput = block.querySelector('#interestRateApr');
  const rangeInput = block.querySelector('#interestRateAprRange');
  const errorSpan = block.querySelector('#interestRateAprRangeError'); // Adjust as needed

  const min = parseFloat(rangeInput.min);
  const max = parseFloat(rangeInput.max);
  interestRateInput.addEventListener('input', () => {
    // Parse the input value, removing non-numeric characters except for the decimal point
    let value = parseFloat(interestRateInput.value.replace(/[^\d.]/g, ''));

    // Validate and handle errors
    if (Number.isNaN(value)) {
      errorSpan.textContent = `Please enter a valid number`;
      rangeInput.value = min; // Reset slider to min
    } else if (value < min) {
      errorSpan.textContent = `Enter a value between ${min} and ${max}`;
      rangeInput.value = min; // Reset slider to min
    } else if (value > max) {
      errorSpan.textContent = `Enter a value between ${min} and ${max}`;
      rangeInput.value = max; // Reset slider to max
    } else {
      errorSpan.textContent = '';
      rangeInput.value = value.toFixed(2);
    }
    updateRangeColors();
  });

  interestRateInput.addEventListener('blur', () => {
    // Parse the input value, removing non-numeric characters except for the decimal point
    let value = parseFloat(interestRateInput.value.replace(/[^\d.]/g, ''));

    // Validate and correct the value
    if (Number.isNaN(value) || value < min) {
      value = min;
    } else if (value > max) {
      value = max;
    }

    // Update the input field and slider
    interestRateInput.value = value.toFixed(2);
    rangeInput.value = value.toFixed(2);
    errorSpan.textContent = '';

    // Call update functions if necessary
    updateAPR(block);
    updateRangeColors();
  });

}

function setApplyNowButton(block, attribute) {
  const applyNow = block.querySelector('#apply-btn-apr');
  applyNow.addEventListener('click', () => {
    window.location.href = attribute.redirectionPath;
  });
}

function toggleInputBox(block) {
  const loanTenureYearsApr = block.querySelector('#loanTenureYearsApr');
  const loanTenureYearsAprRange = block.querySelector('#loanTenureYearsAprRange');
  const loanTenureMonthsAprRange = block.querySelector('#loanTenureMonthsAprRange');
  const loanTenureMonthsApr = block.querySelector('#loanTenureMonthsApr');

  loanTenureYearsApr.addEventListener('input', function () {
    const maxValue = loanTenureYearsAprRange.max;
    let { value } = this;

    if (maxValue === value) {
      loanTenureMonthsAprRange.disabled = true;
      loanTenureMonthsApr.disabled = true;
      loanTenureMonthsAprRange.value = loanTenureMonthsAprRange.min;
      loanTenureMonthsApr.value = loanTenureMonthsAprRange.min;
      value = loanTenureMonthsAprRange.min;
    } else {
      loanTenureMonthsAprRange.disabled = false;
      loanTenureMonthsApr.disabled = false;
    }
    updateRangeColors();
    updateAPR(block);
  });

  loanTenureYearsAprRange.addEventListener('change', function () {
    const maxValue = loanTenureYearsAprRange.max;
    let { value } = this;

    if (maxValue === value) {
      loanTenureMonthsAprRange.disabled = true;
      loanTenureMonthsApr.disabled = true;
      loanTenureMonthsAprRange.value = loanTenureMonthsAprRange.min;
      loanTenureMonthsApr.value = loanTenureMonthsAprRange.min;
      value = loanTenureMonthsAprRange.min;
    } else {
      loanTenureMonthsAprRange.disabled = false;
      loanTenureMonthsApr.disabled = false;
    }
    updateRangeColors();
    updateAPR(block);
  });
}

// Main function to decorate the block
export default async function decorate(block) {
  const attributes = fetchAttributes();
  block.innerHTML = renderHTML(attributes);
  updateRangeColors();
  updateAPR(block);
  addRangeInputListeners(block);
  addTextInputListeners(block);
  setApplyNowButton(block, attributes);
  toggleInputBox(block);
}
window.addEventListener('resize', updateRangeColors);
window.addEventListener('load', updateRangeColors);
