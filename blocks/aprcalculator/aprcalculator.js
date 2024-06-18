export default async function decorate() {
  const container = document.querySelector('.aprcalculator');

  function updateDisplay() {
    const loanAmount = parseFloat(document.getElementById('loanamount').textContent.replace(/\D/g, ''));
    const interestRate = parseFloat(document.getElementById('interest').textContent.replace(/\D/g, ''));
    const loanTenureYears = parseFloat(document.getElementById('year').textContent.replace(/\D/g, ''));
    const loanTenureMonths = parseFloat(document.getElementById('month').textContent.replace(/\D/g, ''));
    const originationCharges = parseFloat(document.getElementById('originationcharges').textContent.replace(/\D/g, ''));

    const loanAmountMin = parseFloat(document.getElementById('loanamount').dataset.min);
    const loanAmountMax = parseFloat(document.getElementById('loanamount').dataset.max);
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

    validateAndShowError(loanAmount, loanAmountMin, loanAmountMax, document.getElementById('loanamountError'));
    validateAndShowError(interestRate, interestMin, interestMax, document.getElementById('interestError'));
    validateAndShowError(loanTenureYears, yearMin, yearMax, document.getElementById('yearError'));
    validateAndShowError(loanTenureMonths, monthMin, monthMax, document.getElementById('monthError'));
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

  function getDataAttributeValueByName(name) {
    const element = document.querySelector(`[data-${name}]`);
    return element ? element.getAttribute(`data-${name}`) : null;
  }

  // Extract the value from the section metaData
  const loanAmountTitle = getDataAttributeValueByName('loan-amount-title');
  const loanAmountMin = getDataAttributeValueByName('loan-amount-min');
  const loanAmountMax = getDataAttributeValueByName('loan-amount-max');
  const interestTitle = getDataAttributeValueByName('interest-title');
  const interestMin = getDataAttributeValueByName('interest-min');
  const interestMax = getDataAttributeValueByName('interest-max');
  const yearTitle = getDataAttributeValueByName('year-title');
  const yearMin = getDataAttributeValueByName('year-min');
  const yearMax = getDataAttributeValueByName('year-max');
  const monthTitle = getDataAttributeValueByName('month-title');
  const monthMin = getDataAttributeValueByName('month-min');
  const monthMax = getDataAttributeValueByName('month-max');

  const originationChargesTitle = getDataAttributeValueByName('origination-charges-title');
  const originationChargesMin = getDataAttributeValueByName('origination-charges-min');
  const originationChargesMax = getDataAttributeValueByName('origination-charges-max');

  const textSize = getDataAttributeValueByName('font-size');

  const htmlCode = `
    <div class="calculator-container">
        <div class="inputs">
            <div class="inputBox">
            <div class="input-details">
                <label for="loanamount">${loanAmountTitle}</label>
                <span id="amountlabel">Rs</span>
                <span id="loanamount" class="inputspan" contenteditable="true" data-min="${loanAmountMin}" data-max="${loanAmountMax}" onblur="updateDisplay()">${loanAmountMin}</span>
            </div>
            <input type="range" id="loanamountRange" min=${loanAmountMin} max=${loanAmountMax} value=${loanAmountMin} step="5000" oninput="updateRange('loanamount')">
            <div class="input-bottom-details">
                <span>${loanAmountMin}</span>
                <span>${loanAmountMax}</span>
            </div>
<div class="errorMsg">
<p id="loanamountError" class="error" style="display: none;">Value must be between ${loanAmountMin} and ${loanAmountMax}</p>
</div>
            </div>

            <div class="inputBox">
            <div class="input-details">
                <label for="interest">${interestTitle}</label>
                <span id="interestlabel">%</span>
                <span id="interest"  class="inputspan" contenteditable="true" data-min="${interestMin}" data-max="${interestMax}" onblur="updateDisplay()">${interestMin}</span>
            </div>
            <input type="range" id="interestRange" min=${interestMin} max=${interestMax} value=${interestMin} step="2" oninput="updateRange('interest')">
            <div class="input-bottom-details">
                <span>${interestMin}%</span>
                <span>${interestMax}%</span>
            </div>
<div class="errorMsg">
<p id="interestError" class="error" style="display: none;">Value must be between ${interestMin} and ${interestMax}</p>
</div>
            </div>

            <div class="inputBox">
            <div class="input-details">
                <label for="year">${yearTitle}</label>
                <span id="yearlabel">Year</span>
                <span id="year" class="inputspan" contenteditable="true" data-min="${yearMin}" data-max="${yearMax}" onblur="updateDisplay()">${yearMin}</span>
            </div>
            <input type="range" id="yearRange" min=${yearMin} max=${yearMax} value=${yearMin} step="2" oninput="updateRange('year')">
            <div class="input-bottom-details">
                <span>${yearMin}</span>
                <span>${yearMax}Year</span>
            </div>
<div class="errorMsg">
<p id="yearError" class="error" style="display: none;">Value must be between ${yearMin} and ${yearMax}</p>
</div>
            </div>

            <div class="inputBox">
            <div class="input-details">
                <label for="month">${monthTitle}</label>
                <span id="monthlabel">Mos</span>
                <span id="month" class="inputspan" contenteditable="true" data-min="${monthMin}" data-max="${monthMax}" onblur="updateDisplay()">${monthMin}</span>
            </div>
            <input type="range" id="monthRange" min=${monthMin} max=${monthMax} value=${monthMin} step="1" oninput="updateRange('month')">
            <div class="input-bottom-details">
                <span>${monthMin}</span>
                <span>${monthMax}</span>
            </div>
<div class="errorMsg">
<p id="monthError" class="error" style="display: none;">Value must be between ${monthMin} and ${monthMax}</p>
</div>
            </div>

            <div class="inputBox">
            <div class="input-details">
                <label for="originationcharges">${originationChargesTitle}</label>
                <span id="originationchargeslabel">Rs</span>
                <span id="originationcharges" class="inputspan" contenteditable="true" data-min="${originationChargesMin}" data-max="${originationChargesMax}" onblur="updateDisplay()">${originationChargesMin}</span>
            </div>
            <input type="range" id="originationchargesRange" min=${originationChargesMin} max=${originationChargesMax} value=${originationChargesMin} step="10000" oninput="updateRange('originationcharges')">
            <div class="input-bottom-details">
                <span>${originationChargesMin}</span>
                <span>${originationChargesMax}</span>
            </div>
<div class="errorMsg">
<p id="originationchargesError" class="error" style="display: none;">Value must be between ${originationChargesMin} and ${originationChargesMax}</p>
</div>
            </div>

        </div>
        <div class="outputs">
            <div class="result">
                <div>Annual Percentage Rate (APR):</div>
                <div id="aprDisplay">%</div>
            </div>
            <button id="apply-btn">Apply Now</button>
        </div>
    </div>`;

  container.innerHTML += htmlCode;

  //  set the fontsize
  const allInput = document.querySelectorAll('.inputBox');
  allInput.forEach((element) => {
    element.style.fontSize = `${textSize}px`;
  });

  window.updateDisplay = updateDisplay;
  window.updateRange = function updateslide(id) {
    const { value } = document.getElementById(`${id}Range`).value;
    document.getElementById(id).textContent = value;
    updateDisplay();
  };
  document.getElementById('loanamount').addEventListener('input', function updateInput() {
    // const value = parseFloat(this.textContent.replace(/[^\d.]/g, ''));
    // const min = parseFloat(this.dataset.min);
    // const max = parseFloat(this.dataset.max);
    // const clampedValue = Math.min(Math.max(value, min), max);
    // this.textContent = clampedValue.toLocaleString();
    // document.getElementById('loanamountRange').value = clampedValue;
    // updateDisplay();
    const value = parseFloat(this.textContent.replace(/\D/g, ''));
    const loanAmountRangeElement = document.getElementById('loanamountRange');
    const numericValue = Number(value);
    loanAmountRangeElement.value = Number.isNaN(numericValue)
      ? loanAmountRangeElement.min : numericValue;

    updateDisplay();
  });

  // Add event listener to interest span to update corresponding range input
  document.getElementById('interest').addEventListener('input', function updateInput() {
    const value = parseFloat(this.textContent.replace(/\D/g, ''));
    const interestRangeElement = document.getElementById('interestRange');
    const numericValue = Number(value);
    interestRangeElement.value = Number.isNaN(numericValue)
      ? interestRangeElement.min : numericValue;
    updateDisplay();
  });

  // Add event listener to year span to update corresponding range input
  document.getElementById('year').addEventListener('input', function updateInput() {
    const value = parseFloat(this.textContent.replace(/\D/g, ''));
    const yearRangeElement = document.getElementById('yearRange');
    const numericValue = Number(value);
    yearRangeElement.value = Number.isNaN(numericValue) ? yearRangeElement.min : numericValue;
    updateDisplay();
  });

  // Add event listener to month span to update corresponding range input
  document.getElementById('month').addEventListener('input', function updateInput() {
    const value = parseFloat(this.textContent.replace(/\D/g, ''));
    const monthRangeElement = document.getElementById('monthRange');
    const numericValue = Number(value);
    monthRangeElement.value = Number.isNaN(numericValue) ? monthRangeElement.min : numericValue;
    updateDisplay();
  });

  // Add event listener to originationcharges span to update corresponding range input
  document.getElementById('originationcharges').addEventListener('input', function updateInput() {
    const value = parseFloat(this.textContent.replace(/\D/g, ''));
    const originationChargesRangeElement = document.getElementById('originationchargesRange');
    const numericValue = Number(value);
    originationChargesRangeElement.value = Number.isNaN(numericValue)
      ? originationChargesRangeElement.min : numericValue;
    updateDisplay();
  });

  updateDisplay();

  // Add event listeners to spans to enforce numeric input
  document.querySelectorAll('.input-details span').forEach((span) => {
    span.addEventListener('input', function updateSpan() {
      const value = this.textContent.trim();
      const numericValue = parseFloat(value.replace(/\D/g, ''));

      if (!Number.isNaN(Number(numericValue))) {
        const formattedValue = numericValue.toLocaleString(); // Format numeric value
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
    });
  });

  // Apply Now Button
  const applyBtn = document.getElementById('apply-btn');
  applyBtn.addEventListener('click', () => {
    window.location.href = '/applynow';
  });
}
