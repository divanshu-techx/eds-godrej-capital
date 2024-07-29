function numberToWords(num) {
  if (num < 1000) {
    return num.toString();
  }

  const suffixes = [
    [1e7, 'Crores'],
    [1e5, 'Lakhs'],
    [1e3, 'Thousands'],
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

  const formattedNumber = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ',')
    + (otherDigits ? ',' : '')
    + lastThreeDigits;

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
  metadata.principalTitleAnnual = getDataAttributeValueByName(
    'principal-title-annual',
  );
  metadata.principalMinAnnual = getDataAttributeValueByName(
    'principal-min-annual',
  );
  metadata.principalMaxAnnual = getDataAttributeValueByName(
    'principal-max-annual',
  );
  metadata.interestTitleAnnual = getDataAttributeValueByName(
    'interest-title-annual',
  );
  metadata.interestMinAnnual = getDataAttributeValueByName(
    'interest-min-annual',
  );
  metadata.interestMaxAnnual = getDataAttributeValueByName(
    'interest-max-annual',
  );
  metadata.yearSymbol = getDataAttributeValueByName('year-symbol');
  metadata.rupeeSymbolHindi = getDataAttributeValueByName('rupee-symbol-hindi');
  metadata.rupeeSymbolEng = getDataAttributeValueByName('rupee-symbol-eng');
  metadata.percentSymbol = getDataAttributeValueByName('percent-symbol');
  metadata.applyNowLabel = getDataAttributeValueByName('apply-now-label');
  metadata.incomeTaxBenifitLabel = getDataAttributeValueByName(
    'income-tax-benefits-label',
  );
  metadata.incomeTaxAfterLabel = getDataAttributeValueByName(
    'income-tax-after-label',
  );
  metadata.incomeTaxBeforeLabel = getDataAttributeValueByName(
    'income-tax-before-label',
  );
  metadata.cessTaxRate = getDataAttributeValueByName('cess-rate');
  metadata.redirectionPath = getDataAttributeValueByName(
    'redirection-path-tax-saving',
  );
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
        <div class="inputTaxSaving">
            <div class="inputBoxTaxSavingLabel">
                <label for="age">${newMetaData.ageTitle}</label>
                <div class="tax_saving_input_label">
                <span id="inputLabel_tax_saving">${newMetaData.yearSymbol}</span>
                <span id="age"  class="inputSpan_tax_saving" contenteditable="true" data-min="${newMetaData.ageMin}"
                data-max="${newMetaData.ageMax}" onblur="updateDisplay()">${newMetaData.ageMin}
                </span>
                </div>
            </div>
            <div class="inputBoxTaxSavingRange">
            <input type="range" id="ageRange" min="${newMetaData.ageMin}"
            max="${newMetaData.ageMax}" value="${newMetaData.ageMin}" oninput="updateRange('age')">
            <div class="inputBoxTaxSavingBottom">
                <span>${newMetaData.ageMin}Year</span>
                <span>${newMetaData.ageMax}Years</span>
            </div>
            </div>
            <div class="errorMsg_tax_saving">
                <p id="ageError" class="error_text" style="display: none;">Value must be between ${newMetaData.ageMin}
                 and ${newMetaData.ageMax}</p>
            </div>
         </div>

         <div class="inputTaxSaving">
            <div class="inputBoxTaxSavingLabel">
                <label for="income">${newMetaData.totalTextTitle}</label>
                <div class="tax_saving_input_label">
                <span id="total_tax_label">${newMetaData.rupeeSymbolEng}</span>
                <span id="income" class="inputSpan_tax_saving" contenteditable="true" data-min="${newMetaData.totalTaxMin}"
                data-max="${newMetaData.totalTaxMax}" onblur="updateDisplay()">
                ${formatNumberToIndianCommas(newMetaData.totalTaxMin)}
                </span>
            </div>
            </div>
            <div class="inputBoxTaxSavingRange">
            <input type="range" id="incomeRange" min="${newMetaData.totalTaxMin}"
            max="${newMetaData.totalTaxMax}" value="${newMetaData.totalTaxMin}"
              oninput="updateRange('income')">
            <div class="inputBoxTaxSavingBottom">
                <span>${numberToWords(newMetaData.totalTaxMin)}</span>
                <span>${numberToWords(newMetaData.totalTaxMax)}</span>
            </div>
            </div>
            <div class="errorMsg_tax_saving">
                <p id="incomeError" class="error_text" style="display: none;">Value must be between ${newMetaData.totalTaxMin} and ${newMetaData.totalTaxMax}</p>
            </div>
            </div>
            <div class="inputTaxSaving">
            <div class="inputBoxTaxSavingLabel">
                <label for="principal">${newMetaData.principalTitleAnnual}</label>
                <div class="tax_saving_input_label">
                <span id="tax_saving_principal_label">${newMetaData.rupeeSymbolEng}</span>
                <span id="principal" class="inputSpan_tax_saving" contenteditable="true" data-min="${newMetaData.principalMinAnnual}"
                 data-max="${newMetaData.principalMaxAnnual}" onblur="updateDisplay()">
                 ${formatNumberToIndianCommas(newMetaData.principalMinAnnual)}</span>
                </div>
            </div>
            <div class="inputBoxTaxSavingRange">
            <input type="range" id="principalRange" min="${newMetaData.principalMinAnnual}" max="${newMetaData.principalMaxAnnual}" value="${newMetaData.principalMinAnnual}"
              oninput="updateRange('principal')">
            <div class="inputBoxTaxSavingBottom">
                <span>${numberToWords(newMetaData.principalMinAnnual)}</span>
                <span>${numberToWords(newMetaData.principalMaxAnnual)}</span>
            </div>
            </div>
            <div class="errorMsg_tax_saving">
                <p id="principalError" class="error_text" style="display: none;">Value must be between ${newMetaData.principalMinAnnual}
     and ${newMetaData.principalMaxAnnual}</p>
            </div>

            </div>

            <div class="inputTaxSaving">
            <div class="inputBoxTaxSavingLabel">
                <label for="interest">${newMetaData.interestTitleAnnual}</label>
                <div class="tax_saving_input_label">
                 <span id="interest_tax_label">${newMetaData.yearSymbol}</span>
                <span id="interest" class="inputSpan_tax_saving" contenteditable="true" data-min="${newMetaData.interestMinAnnual}"
                 data-max="${newMetaData.interestMaxAnnual}"
                onblur="updateDisplay()">${formatNumberToIndianCommas(newMetaData.interestMinAnnual)}
                </span>
            </div>
            </div>
            <div class="inputBoxTaxSavingRange">
            <input type="range" id="interestRange" min="${newMetaData.interestMinAnnual}"
             max="${newMetaData.interestMaxAnnual}" value="${newMetaData.interestMinAnnual}"
               oninput="updateRange('interest')">
            <div class="inputBoxTaxSavingBottom">
                <span>${numberToWords(newMetaData.interestMinAnnual)}</span>
                <span>${numberToWords(newMetaData.interestMaxAnnual)}</span>
            </div>
            </div>
            <div class="errorMsg_tax_saving">
                <p id="interestError" class="error_text" style="display: none;">Value must be between ${newMetaData.interestMinAnnual}
     and ${newMetaData.interestMaxAnnual}</p>
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
                <div class="cessRate">Income Tax Payable Includes ${newMetaData.cessTaxRate}
    ${newMetaData.percentSymbol} Cess.</div>
            </div>  
            <div class="result_tax_saving_next">
                <div class="result_tax_other_result">
                    <div class="span-title">
                        <span class="black_result-span"></span>
                        <span class="black_result-title">${newMetaData.incomeTaxBeforeLabel}</span>
                    </div>
                        <div class="taxBefore" id="taxBefore">${newMetaData.rupeeSymbolHindi}
                        </div>
                    
                </div>
                <div class="result_tax_other_result">
                    <div class="span-title">
                        <span class="black_result-span"></span>
                        <span class="black_result-title">${newMetaData.incomeTaxAfterLabel}</span>
                    </div>   
                        <div class="taxBefore"  id="taxAfter">${newMetaData.rupeeSymbolHindi}</div>
                    
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
    ageRange.value = isNaN(value)
      ? ageRange.min
      : Math.min(Math.max(value, ageRange.min), ageRange.max);
    const percentage = ((ageRange.value - ageRange.min)
    / (ageRange.max - ageRange.min)) * 100;
    ageRange.style.setProperty('--value', `${percentage}%`);
    this.textContent = formatNumberToIndianCommas(ageRange.value);
    updateDisplay();
  });

  block.querySelector('#income').addEventListener('blur', function () {
    const value = parseFloat(this.textContent.replace(/\D/g, ''));
    const incomeRange = block.querySelector('#incomeRange');
    incomeRange.value = isNaN(value)
      ? incomeRange.min
      : Math.min(Math.max(value, incomeRange.min), incomeRange.max);
    const percentage = ((incomeRange.value - incomeRange.min) 
      / (incomeRange.max - incomeRange.min))
      * 100;
    incomeRange.style.setProperty('--value', `${percentage}%`);
    this.textContent = formatNumberToIndianCommas(incomeRange.value);
    updateDisplay();
  });

  block.querySelector('#principal').addEventListener('blur', function () {
    const value = parseFloat(this.textContent.replace(/\D/g, ''));
    const principalRange = block.querySelector('#principalRange');
    principalRange.value = isNaN(value)
      ? principalRange.min
      : Math.min(Math.max(value, principalRange.min), principalRange.max);
    const percentage = ((principalRange.value - principalRange.min)
        / (principalRange.max - principalRange.min))
      * 100;
    principalRange.style.setProperty('--value', `${percentage}%`);
    this.textContent = formatNumberToIndianCommas(principalRange.value);
    updateDisplay();
  });

  block.querySelector('#interest').addEventListener('blur', function () {
    const value = parseFloat(this.textContent.replace(/\D/g, ''));
    const interestRange = block.querySelector('#interestRange');
    interestRange.value = isNaN(value)
      ? interestRange.min
      : Math.min(Math.max(value, interestRange.min), interestRange.max);
    const percentage = ((interestRange.value - interestRange.min)
        / (interestRange.max - interestRange.min))
      * 100;
    this.textContent = formatNumberToIndianCommas(interestRange.value);
    interestRange.style.setProperty('--value', `${percentage}%`);
    updateDisplay();
  });

  // Add event listeners to spans to enforce numeric input
  document
    .querySelectorAll('.input-details-tax-saving span')
    .forEach((span) => {
      span.addEventListener('input', function () {
        // Get the text content and remove leading/trailing whitespace
        const value = this.textContent.trim();
        // Get the text content and remove leading/trailing whitespace
        const numericValue = parseFloat(value.replace(/\D/g, ''));

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
  block.querySelectorAll('input[type="range"]').forEach((input) => {
    input.addEventListener('change', function () {
      const id = this.id.replace('Range', ''); // Get the ID of the associated span
      document.getElementById(id).textContent = formatNumberToIndianCommas(
        this.value,
      );
      updateDisplay(); // Call updateDisplay function after the value is changed
    });
  });
}
// when needs logic of month also
// function calculateTax(income, principal, interest, month, age) {
//   const cessRate = parseFloat(getDataAttributeValueByName("cess-rate")) / 100;
//   const principalDeductionLimit = 150000;
//   const interestDeductionLimit = 200000;

//   // Function to calculate tax based on income slabs
//   function calculateBasicTax(income) {
//     let tax = 0;
//     if (income > 1000000) {
//       tax += (income - 1000000) * 0.3;
//       income = 1000000;
//     }
//     if (income > 500000) {
//       tax += (income - 500000) * 0.2;
//       income = 500000;
//     }
//     if (income > 250000) {
//       tax += (income - 250000) * 0.05;
//     }
//     return tax;
//   }

//   // Tax Slabs based on age
//   function getTaxSlabs(age) {
//     if (age > 80) {
//       return {
//         taxSlabs: [250000, 500000, 1000000],
//         rates: [0.05, 0.2, 0.3],
//       };
//     } else if (age > 60) {
//       return {
//         taxSlabs: [300000, 500000, 1000000],
//         rates: [0.05, 0.2, 0.3],
//       };
//     } else {
//       return {
//         taxSlabs: [250000, 500000, 1000000],
//         rates: [0.05, 0.2, 0.3],
//       };
//     }
//   }

//   const { taxSlabs, rates } = getTaxSlabs(age);

//   // Calculate tax before loan deductions
//   const basicTaxBefore = calculateBasicTax(income * month);
//   const cessBefore = basicTaxBefore * cessRate;
//   const taxBefore = Math.round(basicTaxBefore + cessBefore);

//   // Restrict principal and interest deductions to their respective limits
//   const annualPrincipal = Math.min(principal * month, principalDeductionLimit);
//   const annualInterest = Math.min(interest * month, interestDeductionLimit);

//   // Calculate taxable income after loan deductions
//   const taxableIncomeAfter = Math.max(
//     0,
//     (income - annualPrincipal - annualInterest) * month
//   );

//   // Calculate tax after loan deductions
//   const basicTaxAfter = calculateBasicTax(taxableIncomeAfter);
//   const cessAfter = basicTaxAfter * cessRate;
//   const taxAfter = Math.round(basicTaxAfter + cessAfter);

//   // Calculate tax benefits
//   const taxBenefits = Math.round(taxBefore - taxAfter);

//   return {
//     taxBefore: taxBefore,
//     taxAfter: taxAfter,
//     taxBenefits: taxBenefits,
//   };
// }

function calculateTax(income, principal, interest, age) {
  const cessRate = parseFloat(getDataAttributeValueByName('cess-rate')) / 100;
  const principalDeductionLimit = 150000;
  const interestDeductionLimit = 200000;

  // Function to calculate tax based on income slabs
  function calculateBasicTax(income) {
    let tax = 0;
    if (income > 1000000) {
      tax += (income - 1000000) * 0.3;
      income = 1000000;
    }
    if (income > 500000) {
      tax += (income - 500000) * 0.2;
      income = 500000;
    }
    if (income > 250000) {
      tax += (income - 250000) * 0.05;
    }
    return tax;
  }

  // Tax Slabs based on age
  function getTaxSlabs(age) {
    if (age > 80) {
      return {
        taxSlabs: [250000, 500000, 1000000],
        rates: [0.05, 0.2, 0.3],
      };
    } else if (age > 60) {
      return {
        taxSlabs: [300000, 500000, 1000000],
        rates: [0.05, 0.2, 0.3],
      };
    } else {
      return {
        taxSlabs: [250000, 500000, 1000000],
        rates: [0.05, 0.2, 0.3],
      };
    }
  }

  const { taxSlabs, rates } = getTaxSlabs(age);

  // Calculate tax before loan deductions
  const basicTaxBefore = calculateBasicTax(income);
  const cessBefore = basicTaxBefore * cessRate;
  const taxBefore = Math.round(basicTaxBefore + cessBefore);

  // Restrict principal and interest deductions to their respective limits
  const annualPrincipal = Math.min(principal, principalDeductionLimit);
  const annualInterest = Math.min(interest, interestDeductionLimit);

  // Calculate taxable income after loan deductions
  const taxableIncomeAfter = Math.max(
    0,
    income - annualPrincipal - annualInterest,
  );

  // Calculate tax after loan deductions
  const basicTaxAfter = calculateBasicTax(taxableIncomeAfter);
  const cessAfter = basicTaxAfter * cessRate;
  const taxAfter = Math.round(basicTaxAfter + cessAfter);

  // Calculate tax benefits
  const taxBenefits = Math.round(taxBefore - taxAfter);

  return {
    taxBefore: taxBefore,
    taxAfter: taxAfter,
    taxBenefits: taxBenefits,
  };
}

function updateDisplay() {
  const age = parseFloat(document.getElementById('age').textContent);
  const income = parseFloat(
    document.getElementById('income').textContent.replace(/\D/g, ''),
  );
  const principal = parseFloat(
    document.getElementById('principal').textContent.replace(/\D/g, ''),
  );
  const interest = parseFloat(
    document.getElementById('interest').textContent.replace(/\D/g, ''),
  );

  // Validation
  const ageMin = parseFloat(document.getElementById('age').dataset.min);
  const ageMax = parseFloat(document.getElementById('age').dataset.max);
  const incomeMin = parseFloat(document.getElementById('income').dataset.min);
  const incomeMax = parseFloat(document.getElementById('income').dataset.max);
  const principalMin = parseFloat(
    document.getElementById('principal').dataset.min,
  );
  const principalMax = parseFloat(
    document.getElementById('principal').dataset.max,
  );
  const interestMin = parseFloat(
    document.getElementById('interest').dataset.min,
  );
  const interestMax = parseFloat(
    document.getElementById('interest').dataset.max,
  );

  validateAndShowError(
    age,
    ageMin,
    ageMax,
    document.getElementById('ageError'),
  );
  validateAndShowError(
    income,
    incomeMin,
    incomeMax,
    document.getElementById('incomeError'),
  );
  validateAndShowError(
    principal,
    principalMin,
    principalMax,
    document.getElementById('principalError'),
  );
  validateAndShowError(
    interest,
    interestMin,
    interestMax,
    document.getElementById('interestError'),
  );
  // Calculate taxes
  const { taxBefore, taxAfter, taxBenefits } = calculateTax(
    income, principal, interest, age,
  );

  document.getElementById(
    'taxBefore',
  ).textContent = `₹ ${formatNumberToIndianCommas(taxBefore)}`;
  document.getElementById(
    'taxAfter',
  ).textContent = `₹ ${formatNumberToIndianCommas(taxAfter)}`;
  document.getElementById(
    'taxBenefits',
  ).textContent = `₹ ${formatNumberToIndianCommas(taxBenefits)}`;
}

function setupApplyNowButton(newMetaData) {
  const applyBtn = document.getElementById('apply-btn-tax');
  applyBtn.addEventListener('click', () => {
    window.location.href = newMetaData.redirectionPath;
  });
}
// Function to update range input and corresponding span
function updateRange(id) {
  const element = document.getElementById(`${id}Range`);
  const { value, max, min } = element;
  const percentage = ((value - min) / (max - min)) * 100;
  element.style.setProperty('--value', `${percentage}%`);
  document.getElementById(id).textContent = formatNumberToIndianCommas(value);
}
function updateRangeColor() {
  const rangeElements = document.querySelectorAll('input[type="range"]');
  const unselectedColor = window.innerWidth <= 768 ? '#f4f4f4' : '#fff';

  rangeElements.forEach((element) => {
    element.style.setProperty('--unselected-color', unselectedColor);
  });
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
  updateRangeColor();
}

window.updateRange = updateRange;
window.updateDisplay = updateDisplay;
window.addEventListener('resize', updateRangeColor);
