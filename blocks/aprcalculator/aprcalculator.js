// Function to retrieve data attribute value by name
function getDataAttributeValueByName(name) {
  const element = document.querySelector(`[data-${name}]`);
  return element ? element.getAttribute(`data-${name}`) : null;
}

// Function to extract data attributes
function extractDataAttributes() {
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
    rupeeSymbol :getDataAttributeValueByName('rupee-symbol'),
    monthSymbol : getDataAttributeValueByName('month-symbol'),
    percentSymbol : getDataAttributeValueByName('percent-symbol'),
    yearSymbol  : getDataAttributeValueByName('year-symbol'),
    applyNowLabel : getDataAttributeValueByName('apply-now-label'),
    annualPercentLabel  : getDataAttributeValueByName('annual-percent-label'),
    redirectionPath : getDataAttributeValueByName('redirection-path-apr'),

  };
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

// Function to construct HTML code based on extracted data attributes
function constructHtmlCode({
  loanAmountTitle, loanAmountMin, loanAmountMax,
  interestTitle, interestMin, interestMax,
  yearTitle, yearMin, yearMax,
  monthTitle, monthMin, monthMax,
  originationChargesTitle, originationChargesMin, originationChargesMax,
  rupeeSymbol,monthSymbol,yearSymbol,percentSymbol,applyNowLabel,annualPercentLabel,
}) {
  return `
    <div class="calculator-container">
      <div class="inputs">
        <div class="inputBox">
          <div class="input_details_apr">
            <label for="loanamountApr">${loanAmountTitle}</label>
            <span id="amountlabel">${rupeeSymbol}</span>
            <span id="loanamountApr" class="inputspan" contenteditable="true" data-min="${loanAmountMin}" data-max="${loanAmountMax}" onblur="updateDisplay()">${formatNumberToIndianCommas(loanAmountMin)}</span>
          </div>
          <input type="range" id="loanamountAprRange" min=${loanAmountMin} max=${loanAmountMax} value=${loanAmountMin}  oninput="updateRange('loanamountApr')">
          <div class="input-bottom-details">
            <span>${numberToWords(loanAmountMin)}</span>
            <span>${numberToWords(loanAmountMax)}</span>
          </div>
          <div class="errorMsg">
            <p id="loanamountErrorApr" class="error" style="display: none;">Value must be between ${formatNumberToIndianCommas(loanAmountMin)} and ${formatNumberToIndianCommas(loanAmountMax)}</p>
          </div>
        </div>

        <div class="inputBox">
          <div class="input_details_apr">
            <label for="interest">${interestTitle}</label>
            <span id="interestlabel">${percentSymbol}</span>
            <span id="interest" class="inputspan" contenteditable="true" data-min="${interestMin}" data-max="${interestMax}" onblur="updateDisplay()">${interestMin}</span>
          </div>
          <input type="range" id="interestRange" min=${interestMin} max=${interestMax} value=${interestMin}  oninput="updateRange('interest')">
          <div class="input-bottom-details">
            <span>${interestMin}${percentSymbol}</span>
            <span>${interestMax}${percentSymbol}</span>
          </div>
          <div class="errorMsg">
            <p id="interestErrorApr" class="error" style="display: none;">Value must be between ${interestMin}${percentSymbol} and ${interestMax}${percentSymbol}</p>
          </div>
        </div>

        <div class="inputBox">
          <div class="input_details_apr">
            <label for="year">${yearTitle}</label>
            <span id="yearlabel">${yearSymbol}</span>
            <span id="year" class="inputspan" contenteditable="true" data-min="${yearMin}" data-max="${yearMax}" onblur="updateDisplay()">${yearMin}</span>
          </div>
          <input type="range" id="yearRange" min=${yearMin} max=${yearMax} value=${yearMin}  oninput="updateRange('year')">
          <div class="input-bottom-details">
            <span>${yearMin}</span>
            <span>${yearMax}Year</span>
          </div>
          <div class="errorMsg">
            <p id="yearErrorApr" class="error" style="display: none;">Value must be between ${yearMin}${yearSymbol} and ${yearMax}${yearSymbol}</p>
          </div>
        </div>

        <div class="inputBox">
          <div class="input_details_apr">
            <label for="month">${monthTitle}</label>
            <span id="monthlabel">${monthSymbol}</span>
            <span id="month" class="inputspan" contenteditable="true" data-min="${monthMin}" data-max="${monthMax}" onblur="updateDisplay()">${monthMin}</span>
          </div>
          <input type="range" id="monthRange" min=${monthMin} max=${monthMax} value=${monthMin}  oninput="updateRange('month')">
          <div class="input-bottom-details">
            <span>${monthMin}</span>
            <span>${monthMax}</span>
          </div>
          <div class="errorMsg">
            <p id="monthErrorApr" class="error" style="display: none;">Value must be between ${monthMin}${monthSymbol} and ${monthMax}${monthSymbol}</p>
          </div>
        </div>

        <div class="inputBox">
          <div class="input_details_apr">
            <label for="originationcharges">${originationChargesTitle}</label>
            <span id="originationchargeslabel">${rupeeSymbol}</span>
            <span id="originationcharges" class="inputspan" contenteditable="true" data-min="${originationChargesMin}" data-max="${originationChargesMax}" onblur="updateDisplay()">${originationChargesMin}</span>
          </div>
          <input type="range" id="originationchargesRange" min=${originationChargesMin} max=${originationChargesMax} value=${originationChargesMin}  oninput="updateRange('originationcharges')">
          <div class="input-bottom-details">
            <span>${numberToWords(originationChargesMin)}</span>
            <span>${numberToWords(originationChargesMax)}</span>
          </div>
          <div class="errorMsg">
            <p id="originationchargesError" class="error" style="display: none;">Value must be between ${formatNumberToIndianCommas(originationChargesMin)} and ${formatNumberToIndianCommas(originationChargesMax)}</p>
          </div>
        </div>

      </div>
      <div class="outputs">
        <div class="result">
          <div>${annualPercentLabel}</div>
          <div id="aprDisplay">${percentSymbol}</div>
        </div>
        <button id="apply-btn-apr">${applyNowLabel}</button>
      </div>
    </div>`;
}

// Function to append HTML to block
function appendHtmlToBlock(block, htmlCode) {
  block.innerHTML += htmlCode;
}

// Function to set font size for input boxes
function setFontSize(size) {
  const allInput = document.querySelectorAll('.inputBox');
  allInput.forEach((element) => {
    element.style.fontSize = `${size}px`;
  });
}

// Function to initialize event listeners
function initializeEventListeners(block) {
  // Add event listeners for input and range elements

  block.querySelector('#loanamountApr').addEventListener('blur', function updateLoanAmount() {
    const value = parseFloat(this.textContent.replace(/\D/g, ''));
    const loanAmountRangeElement = block.querySelector('#loanamountAprRange');
    loanAmountRangeElement.value = isNaN(value) ? loanAmountRangeElement.min : Math.min(Math.max(value, loanAmountRangeElement.min), loanAmountRangeElement.max);
    const percentage = ((loanAmountRangeElement.value - loanAmountRangeElement.min) / (loanAmountRangeElement.max - loanAmountRangeElement.min)) * 100;
    loanAmountRangeElement.style.setProperty('--value', `${percentage}%`);
    this.textContent=formatNumberToIndianCommas(loanAmountRangeElement.value);
    updateDisplay();
  });
  

  block.querySelector('#interest').addEventListener('blur', function updateInterest() {
    const value = parseFloat(this.textContent.replace(/[^\d.]/g, ''));
    const interestRangeElement = block.querySelector('#interestRange');
    interestRangeElement.value = isNaN(value) ? interestRangeElement.min : Math.min(Math.max(value, interestRangeElement.min), interestRangeElement.max);
    const percentage = ((interestRangeElement.value - interestRangeElement.min) / (interestRangeElement.max - interestRangeElement.min)) * 100;
    interestRangeElement.style.setProperty('--value', `${percentage}%`);
    this.textContent = formatNumberToIndianCommas(interestRangeElement.value);
    updateDisplay();
  });
  

  block.querySelector('#year').addEventListener('blur', function updateYear() {
    const value = parseFloat(this.textContent.replace(/\D/g, ''));
    const yearRangeElement = block.querySelector('#yearRange');
    yearRangeElement.value = isNaN(value) ? yearRangeElement.min : Math.min(Math.max(value, yearRangeElement.min), yearRangeElement.max);
    const percentage = ((yearRangeElement.value - yearRangeElement.min) / (yearRangeElement.max - yearRangeElement.min)) * 100;
    yearRangeElement.style.setProperty('--value', `${percentage}%`);
    this.textContent=formatNumberToIndianCommas(yearRangeElement.value);
    updateDisplay();
  });
  

  block.querySelector('#month').addEventListener('blur', function updateInput() {
    const value = parseFloat(this.textContent.replace(/\D/g, ''));
    const monthRangeElement = block.querySelector('#monthRange');
    const numericValue = Number(value);
    monthRangeElement.value = Number.isNaN(numericValue) ? monthRangeElement.min : numericValue;
    const percentage = (monthRangeElement.value / monthRangeElement.max) * 100;
    monthRangeElement.style.setProperty('--value', `${percentage}%`);
    updateDisplay();
  });

  block.querySelector('#originationcharges').addEventListener('blur', function updateOriginationCharges() {
    const value = parseFloat(this.textContent.replace(/\D/g, ''));
    const originationChargesRangeElement = block.querySelector('#originationchargesRange');
    originationChargesRangeElement.value = isNaN(value) ? originationChargesRangeElement.min : Math.min(Math.max(value, originationChargesRangeElement.min), originationChargesRangeElement.max);
    const percentage = ((originationChargesRangeElement.value - originationChargesRangeElement.min) / (originationChargesRangeElement.max - originationChargesRangeElement.min)) * 100;
    originationChargesRangeElement.style.setProperty('--value', `${percentage}%`);
    this.textContent=formatNumberToIndianCommas(originationChargesRangeElement.value);
    updateDisplay();
  });
  

  block.querySelector('#month').addEventListener('blur', function updateMonth() {
    const value = parseFloat(this.textContent.replace(/\D/g, ''));
    const monthRangeElement = block.querySelector('#monthRange');
    monthRangeElement.value = isNaN(value) ? monthRangeElement.min : Math.min(Math.max(value, monthRangeElement.min), monthRangeElement.max);
    const percentage = ((monthRangeElement.value - monthRangeElement.min) / (monthRangeElement.max - monthRangeElement.min)) * 100;
    monthRangeElement.style.setProperty('--value', `${percentage}%`);
    this.textContent=formatNumberToIndianCommas(monthRangeElement.value);
    updateDisplay();
  });
  

  // Add event listeners to enforce numeric input for spans
  block.querySelectorAll('.input_details_apr span').forEach((span) => {
    span.addEventListener('input', function updateSpan() {
      const value = this.textContent.trim();
      const numericValue = parseFloat(value.replace(/\D/g, ''));

      if (!Number.isNaN(Number(numericValue))) {
        const formattedValue = numericValue.toLocaleString(); // Format numeric value
        this.textContent = formattedValue; // Update span content with formatted numeric value

        // Set cursor position to the end of the span
        const range = block.createRange();
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
          block.querySelector(`#${id}`).textContent = formatNumberToIndianCommas(this.value);
          updateDisplay(); // Call updateDisplay function after the value is changed
          
      });
  });
}

// Function to update display
function updateDisplay() {
  const loanAmount = parseFloat(document.getElementById('loanamountApr').textContent.replace(/\D/g, ''));
  const interestRate = parseFloat(document.getElementById('interest').textContent.replace(/\D/g, ''));
  const loanTenureYears = parseFloat(document.getElementById('year').textContent.replace(/\D/g, ''));
  const loanTenureMonths = parseFloat(document.getElementById('month').textContent.replace(/\D/g, ''));
  const originationCharges = parseFloat(document.getElementById('originationcharges').textContent.replace(/\D/g, ''));

  const loanAmountMin = parseFloat(document.getElementById('loanamountApr').dataset.min);
  const loanAmountMax = parseFloat(document.getElementById('loanamountApr').dataset.max);
  const interestMin = parseFloat(document.getElementById('interest').dataset.min);
  const interestMax = parseFloat(document.getElementById('interest').dataset.max);
  const yearMin = parseFloat(document.getElementById('year').dataset.min);
  const yearMax = parseFloat(document.getElementById('year').dataset.max);
  const monthMin = parseFloat(document.getElementById('month').dataset.min);
  const monthMax = parseFloat(document.getElementById('month').dataset.max);
  const originationChargesMin = parseFloat(document.getElementById('originationcharges').dataset.min);
  const originationChargesMax = parseFloat(document.getElementById('originationcharges').dataset.max);

  const validateAndShowError = (value, min, max, errorElement) => {
    if (value < min || value > max) {
      errorElement.style.display = 'block';
    } else {
      errorElement.style.display = 'none';
    }
  };

  validateAndShowError(loanAmount, loanAmountMin, loanAmountMax, document.getElementById('loanamountErrorApr'));
  validateAndShowError(interestRate, interestMin, interestMax, document.getElementById('interestErrorApr'));
  validateAndShowError(loanTenureYears, yearMin, yearMax, document.getElementById('yearErrorApr'));
  validateAndShowError(loanTenureMonths, monthMin, monthMax, document.getElementById('monthErrorApr'));
  validateAndShowError(originationCharges, originationChargesMin, originationChargesMax, document.getElementById('originationchargesError'));

  const totalLoanTenure = loanTenureYears * 12 + loanTenureMonths;

  // Convert annual interest rate to monthly rate
  const monthlyInterestRate = interestRate / 100 / 12;

  // Calculate monthly EMI (Equated Monthly Installment)
  const monthlyEMI = (
    (loanAmount * monthlyInterestRate * ((1 + monthlyInterestRate) ** totalLoanTenure)) / (
      ((1 + monthlyInterestRate) ** totalLoanTenure) - 1)
  );

  // Calculate total payment over the loan tenure
  const totalPayment = monthlyEMI * totalLoanTenure;

  // Calculate total cost of the loan (including origination charges)
  const totalCost = totalPayment + originationCharges;

  // Calculate APR (Annual Percentage Rate)
  const apr = ((totalCost / loanAmount - 1) / (totalLoanTenure / 12)) * 100;

  document.getElementById('aprDisplay').textContent = `${apr.toFixed(2)}%`;
}

// Function to setup Apply Now button
function setupApplyNowButton(block,dataAttributes) {
  const applyBtn = block.querySelector('#apply-btn-apr');
  applyBtn.addEventListener('click', () => {
    window.location.href = dataAttributes.redirectionPath;
  });
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


// Initial setup
export default async function decorate(block) {
  const dataAttributes = extractDataAttributes();
  const htmlCode = constructHtmlCode(dataAttributes);
  appendHtmlToBlock(block, htmlCode);
  setFontSize(dataAttributes.textSize);
  initializeEventListeners(block);
  updateDisplay();
  setupApplyNowButton(block,dataAttributes);
}

// Make updateDisplay and updateRange functions globally accessible
window.updateDisplay = updateDisplay;
window.updateRange = updateRange;
