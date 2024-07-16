function formatNumberToIndianCommas(number) {
  const numStr = number.toString();
  const [integerPart, decimalPart] = numStr.split('.');
  const lastThreeDigits = integerPart.slice(-3);
  const otherDigits = integerPart.slice(0, -3);
  const formattedNumber = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + (otherDigits ? "," : "") + lastThreeDigits;
  return decimalPart ? `${formattedNumber}.${decimalPart}` : formattedNumber;
}
function removeCommaAndConvertToInt(numberString) {
  let cleanedString = numberString.replace(/,/g, '');
  let numberInt = parseInt(cleanedString, 10);
  return numberInt;
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
//  error message
function createErrorSpan(message) {
  return createElement('span', { class: 'error-message', style: 'color: red; display: none;' }, message);
}
 
function createElement(type, attributes = {}, ...children) {
  const element = document.createElement(type);
 
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
 
  children.forEach((child) => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  });
 
  return element;
}
 
function getDataAttributeValueByName(name) {
  const element = document.querySelector(`[data-${name}]`);
  return element ? element.getAttribute(`data-${name}`) : '';
}
function calculateLoanDetails(p, r, n, m, pie, line) {
  let i;
  let totalInterest = 0;
  const yearlyInterest = [];
  const yearPrinCIpal = [];
  const years = [];
  let year = 1; // Allow incrementing
  let counter = 0;
  let prinCIpalAccumulator = 0;
  let interestAccumulator = 0;
  const totalMonths = n * 12 + m;
 
  const emi = (p * r * (1 + r) ** totalMonths) / ((1 + r) ** totalMonths - 1);
  const totalPayment = emi * totalMonths;
  totalInterest = totalPayment - p;
 
  let currentPrinCIpal = p; // New variable to avoid modifying the parameter
 
  for (i = 0; i < totalMonths; i += 1) {
    const interest = currentPrinCIpal * r;
    currentPrinCIpal -= (emi - interest);
    prinCIpalAccumulator += emi - interest;
    interestAccumulator += interest;
    counter += 1; // Increment counter
    if (counter === 12) {
      years.push(year);
      yearlyInterest.push(parseInt(interestAccumulator, 10));
      yearPrinCIpal.push(parseInt(prinCIpalAccumulator, 10));
      counter = 0;
      year += 1; // Increment year
      interestAccumulator = 0; // Reset yearly interest accumulator
      prinCIpalAccumulator = 0; // Reset yearly prinCIpal accumulator
    }
  }
 
  line.data.datasets[0].data = yearPrinCIpal;
  line.data.datasets[1].data = yearlyInterest;
  line.data.labels = years;
  return totalInterest;
}
 
function displayDetails(P, R, N, M, E, line, pie, block) {
  const r = parseFloat(R) / 1200;
  const n = parseFloat(N);
  const m = parseFloat(M);
  const totalMonths = n * 12 + m;
 
  const emi = (P * r * (1 + r) ** totalMonths) / ((1 + r) ** totalMonths - 1);
  const payableInterest = calculateLoanDetails(P, r, n, m, pie, line);
 
  const opts = { style: 'currency', currency: 'INR', maximumFractionDigits: 0 };
 
  block.querySelector('#CP').innerText = P.toLocaleString('en-IN', opts);
 
  block.querySelector('#CI').innerText = payableInterest.toLocaleString('en-IN', opts);
 
  block.querySelector('#mobile_CI').innerText = payableInterest.toLocaleString('en-IN', opts);
 
  block.querySelector('#CT').innerText = (P + payableInterest).toLocaleString('en-IN', opts);
 
  block.querySelector('#mobile_CT').innerText = (P + payableInterest).toLocaleString('en-IN', opts);
 
  block.querySelector("#Rate").innerText =
    R.toLocaleString("en-IN", R) + "%";
 
  block.querySelector("#mobile_interest_rate").innerText =
    "@" + R.toLocaleString("en-IN", R) + "%";
 
  block.querySelector("#month_Tenure").innerText =
    M.toLocaleString("en-IN", M + 'M');
 
  block.querySelector("#mobile_month_Tenure").innerText =
    M.toLocaleString("en-IN", M + 'M');
 
  block.querySelector("#year_tenure").innerText =
    N.toLocaleString("en-IN", N + 'Y');
 
  block.querySelector("#mobile_year_tenure").innerText =
    N.toLocaleString("en-IN", N + 'Y');
 
  block.querySelector('#MonthlyEmiPrice').innerText = emi.toLocaleString('en-IN', opts);
 
  block.querySelector('#mobile_monthly_emi_price').innerText = emi.toLocaleString('en-IN', opts);
 
  block.querySelector('#le').innerText = `₹ ${Math.max(0, P - E).toLocaleString()}`;
  block.querySelector('#mobile-le').innerText = `₹ ${Math.max(0, P - E).toLocaleString()}`;
 
  pie.data.datasets[0].data[0] = P;
  pie.data.datasets[0].data[1] = payableInterest;
  pie.update();
  // line.update();
}
 
// Decorate Function
export default async function decorate(block) {
  initialize(block);
}
 
 
function initialize(block) {
 
  ///
  // const container = document.querySelector('.loaneligibility');
  let i;
  let option;
  let P;
  let R;
  let N;
  let M;
  let E;
  let pie;
  let line;
  let url;
 
 
  const loanAmountMaxValue = getDataAttributeValueByName('income-max-value');
  const loanAmountMinValue = getDataAttributeValueByName('income-min-value');
  const laonamountTitle = getDataAttributeValueByName('income-title');
 
  const existingEmiTitle = getDataAttributeValueByName('existing-emi-title');
  const existingEmiMin = getDataAttributeValueByName('existing-emi-min');
  const existingEmiMax = getDataAttributeValueByName('existing-emi-max');
  const interestRateMaxValue = getDataAttributeValueByName('interest-rate-max-value');
  const interestRateMinValue = getDataAttributeValueByName('interest-rate-min-value');
  const interestrateTitle = getDataAttributeValueByName('interest-rate-title');
  const tenureTitleYear = getDataAttributeValueByName('tenure-title-year');
  const tenureMinYearValue = getDataAttributeValueByName('tenure-min-year-value');
  const tenureMaxYearValue = getDataAttributeValueByName('tenure-max-year-value');
  const tenureTitleMonths = getDataAttributeValueByName('tenure-title-months');
  const tenureMinMonthValue = getDataAttributeValueByName('tenure-min-month-value');
  const tenureMaxMonthValue = getDataAttributeValueByName('tenure-max-month-value');
  const redirectionPath = getDataAttributeValueByName('redirection-path');
  const productList = getDataAttributeValueByName('product-list');
  const mobileredirection =getDataAttributeValueByName('redirection-path-mobile');
  const selectProductLabel = getDataAttributeValueByName('Select-product-label');
  const interestratelabel = getDataAttributeValueByName('Interest-rate-label');
  const totaltenurelabel = getDataAttributeValueByName('Total-tenure-label');
  const yearlabel = getDataAttributeValueByName('Year-label');
  const monthlabel = getDataAttributeValueByName('Month-label');
  const tenureseparator = getDataAttributeValueByName('Tenure-separator');
  const principalamountlabel = getDataAttributeValueByName('Principal-amount-label');
  const interestpayablelabel = getDataAttributeValueByName('Interest-payable-label');
  const loaneligibilitylabel = getDataAttributeValueByName('Loan-eligibility-label');
  const totalamountlabel = getDataAttributeValueByName('Total-amount-label');
  const monthlyemilabel = getDataAttributeValueByName('Monthly-emi-label');
 
  const applynowbutton = getDataAttributeValueByName('Apply-now-button');
  const mobileyear = getDataAttributeValueByName('Mobile-year');
  const mobilemonths = getDataAttributeValueByName('Mobile-month');
  const selectProductPlaceHolder = getDataAttributeValueByName('select-product-place-holder');
 
  //  Create a select element
  const selectProduct = document.createElement('select');

  const mobileSelect=document.querySelector('.sec-tab-dropdown');
  //   Loop through the array and create option elements
  option = document.createElement('option');
  option.text = selectProductPlaceHolder;
  selectProduct.appendChild(option);
 
  //  Split the string into an array of loan options
  const optionsArray = productList.split(',');
 
  //   Loop through the array and create option elements
  for (i = 0; i < optionsArray.length; i += 1) {
    option = document.createElement('option');
    option.value = optionsArray[i].toLowerCase().replace(/ /g, '-');
    option.text = optionsArray[i];
    selectProduct.appendChild(option);
  }
 
  const product = createElement(
    'div',
    {},
    createElement(
      'div',
      { class: 'detail-select' },
      createElement('div', { class:"detail-select-child" ,style: 'color: #3b3b3b' }, selectProductLabel),
      selectProduct
 
    ),
  );
 
  const amountDetail = createElement(
    'div',
    {},
    createElement(
      'div',
      { class: 'detail' },
      createElement('div', { style: 'color: #3b3b3b; font-size:14px;font-weight:400' }, laonamountTitle),
      createElement(
        'div',
        { class: 'inputDetail' },
        createElement('span', { class: 'rupeeSpan' }, 'Rs.'),
        createElement('input', {
          id: 'loan-amount-text', type: 'text', min: loanAmountMinValue, max: loanAmountMaxValue, step: '50000', style: 'color: #3b3b3b; font-size:14px;font-weight:300',
        }),
      ),
    ),
    createElement('input', {
      type: 'range', id: 'loanAmount', min: loanAmountMinValue, max: loanAmountMaxValue, step: '50000',
    }),
    createElement(
      'div',
      { class: 'range-values' },
      createElement('div', { class: 'min-value' }, numberToWords(loanAmountMinValue)),
      createElement('div', { class: 'max-value', style: 'float: right;' }, numberToWords(loanAmountMaxValue)),
    ),
  );
 
  const existingEmi = createElement(
    'div',
    {},
    createElement(
      'div',
      { class: 'detail' },
      createElement('div', { style: 'color: #3b3b3b; font-size:14px;font-weight:400' }, existingEmiTitle),
      createElement(
        'div',
        { class: 'inputDetail' },
        createElement('span', { class: 'rupeeSpan' }, 'Rs.'),
        createElement('input', {
          id: 'exisiting-emi-text', type: 'text', min: existingEmiMin, max: existingEmiMax, step: '5', style: 'color: #3b3b3b; font-size:14px;font-weight:300',
        }),
      ),
    ),
    createElement('input', {
      type: 'range', id: 'exisiting-emi-amount', min: existingEmiMin, max: existingEmiMax, step: '5',
    }),
    createElement(
      'div',
      { class: 'range-values' },
      createElement('div', { class: 'min-value' }, numberToWords(existingEmiMin)),
      createElement('div', { class: 'max-value', style: 'float: right;' }, numberToWords(existingEmiMax)),
    ),
  );
 
  const interestDetail = createElement(
    'div',
    {},
    createElement(
      'div',
      { class: 'detail' },
      createElement('div', { style: 'color: #3b3b3b; font-size:14px;font-weight:400' }, interestrateTitle),
      createElement(
        'div',
        { class: 'inputDetail' },
        createElement('span', { class: 'percentSpan' }, '%'),
        createElement('input', {
          id: 'linterest_Rate_Text', type: 'number', min: interestRateMinValue, max: interestRateMaxValue, step: '0.5', style: 'color: #3b3b3b; font-size:14px;font-weight:300',
        }),
      ),
    ),
    createElement('input', {
      type: 'range', id: 'interestRate', min: interestRateMinValue, max: interestRateMaxValue, step: '0.5',
    }),
    createElement(
      'div',
      { class: 'range-values' },
      createElement('div', { class: 'min-value' }, `${interestRateMinValue}%`),
      createElement('div', { class: 'max-value', style: 'float: right;' }, `${interestRateMaxValue}%`),
    ),
  );
 
  const tenureYearsDetail = createElement(
    'div',
    {},
    createElement(
      'div',
      { class: 'detail' },
      createElement('div', { style: 'color: #3b3b3b; font-size:14px;font-weight:400' }, tenureTitleYear),
      createElement(
        'div',
        { class: 'inputDetail' },
        createElement('span', { class: 'yearSpan' }, 'Yrs.'),
        createElement('input', {
          id: 'loanPeriodText', type: 'number', min: tenureMinYearValue, max: tenureMaxYearValue, step: '1', style: 'color: #3b3b3b; font-size:14px;font-weight:300',
        }),
      ),
    ),
    createElement('input', {
      type: 'range', id: 'loanPeriod', min: tenureMinYearValue, max: tenureMaxYearValue, step: '1',
    }),
    createElement(
      'div',
      { class: 'range-values' },
      createElement('div', { class: 'min-value' }, `${tenureMinYearValue} Year`),
      createElement('div', { class: 'max-value', style: 'float: right;' }, `${tenureMaxYearValue} Years`),
    ),
  );
 
  const tenureMonthsDetail = createElement(
    'div',
    {},
    createElement(
      'div',
      { class: 'detail' },
      createElement('div', { style: 'color: #3b3b3b; font-size:14px;font-weight:400' }, tenureTitleMonths),
      createElement(
        'div',
        { class: 'inputDetail' },
        createElement('span', { class: 'monthSpan' }, 'Mos.'),
        createElement('input', {
          id: 'loanPeriodMonthText', type: 'number', min: tenureMinMonthValue, max: tenureMaxMonthValue, step: '1', style: 'color: #3b3b3b; font-size:14px;font-weight:300',
        }),
      ),
    ),
    createElement('input', {
      type: 'range', id: 'loanPeriodMonth', min: tenureMinMonthValue, max: tenureMaxMonthValue, step: '1',
    }),
    createElement(
      'div',
      { class: 'range-values' },
      createElement('div', { class: 'min-value' }, `${tenureMinMonthValue} Month`),
      createElement('div', { class: 'max-value', style: 'float: right;' }, `${tenureMaxMonthValue} Months`),
    ),
  );
 
 
  const details = createElement(
    'div',
    { class: 'details' },
    product,
    amountDetail,
    existingEmi,
    interestDetail,
    tenureYearsDetail,
    tenureMonthsDetail,
  );
 
  const footer = createElement(
    'div',
    { class: 'footer' },
    createElement(
      'div',
      { style: 'chart-detail' },
      createElement(
        'div',
        { id: 'price-container-emi', style: 'color:#3b3b3b;font-size:16px;font-weight:400;' },
        monthlyemilabel,
        createElement('div', { id: 'MonthlyEmiPrice', style: 'color: #8cb133;font-size:24px;font-weight:600' }, '0'),
      ),
    ),
  );
 
  const view = createElement('div', { class: 'view view-loaneli' }, details, footer);
 
  const loanDetailsUpper = createElement('div', { class: 'loan-details-upper' },
    createElement(
      'div',
      { class: 'chart-details chart-details-loaneli' },
      createElement('div', { class: 'chart-detail-adjust' },
      createElement('span', { class: 'details-span-principal' }, ' '),
      createElement('div', { class: 'detailsloan', style: 'color: #000000; font-size: 16px; font-weight:400;margin-left:10px;;' }, principalamountlabel),
      ),
      createElement('div', { id: 'CP', style: 'color: #3B3B3B; font-size: 24px; font-weight:400;' }),
    
    ),
    createElement(
      'div',
      { class: 'chart-details chart-details-loaneli' },
      createElement('div', { class: 'chart-detail-adjust' },
      createElement('span', { class: 'details-span-interest' }, ''),
      createElement('div', { class: 'detailsloan', style: 'color: #000000; font-size: 16px; font-weight:400;margin-left:10px;' }, interestpayablelabel),
      ),
      createElement('div', { id: 'CI', style: 'color: #3B3B3B; font-size: 24px; font-weight:400;' }),
    ),
  )
 
  const breakup = createElement('div', { class: 'breakup breadup-loaneli' },
    createElement('div', { class: "chartDetails" },
      createElement('canvas', { id: "mypieChart" }),
      createElement('div', { id: 'canvasItems-loanele' },
        createElement('div', { class: 'intrest' },
          createElement('div', { style: 'color: #000;font-size:14px;font-weight:300;' }, interestratelabel),
          createElement('div', { id: 'Rate' })
        ),
        createElement('div', { class: 'tenure' },
          createElement('div', { style: 'color: #000;font-size:14px;font-weight:300;' }, totaltenurelabel),
          createElement('span', { id: 'year_tenure' }), yearlabel, tenureseparator,
          createElement('span', { id: 'month_Tenure' }), monthlabel
        ),
      ), loanDetailsUpper),
  );
 
 
 
  const loaneligibilityDetails = createElement('div', { class: 'loan-eligiblity-details' },
    createElement(
      'div',
      { class: 'chart-details' },
      createElement('div', { style: 'color: #fff; margin-right:10px;font-size:16px;font-weight:400;' }, loaneligibilitylabel),
      createElement('div', { id: 'le', style: 'color: #fff; margin-left:10px;font-size:24px;font-weight:500;' }),
    ),
  );
  const loanDetails = createElement(
    'div',
    { class: 'loan-details' },
    createElement(
      'div',
      { class: 'chart-details' },
      createElement('div', { style: 'color: #000;font-weight:400;font-size:16px;' }, totalamountlabel),
      createElement('div', { id: 'CT', style: 'color: #3B3B3B; font-size: 24px;font-weight:500;' }),
    ), footer,
    createElement('div', { class: 'chart-details' },
      createElement('button', { id: 'apply-btn-le' }, applynowbutton),
    ),
    createElement('div', { id: 'mylineChart' }),
  );
 
  breakup.append(loaneligibilityDetails, loanDetails);
 
  //mobile breakup
  const mobileBreakup = createElement('div', { class: 'mobile-loaneligible' },
    createElement('div', { class: 'mobile-loaneligibale' },
      createElement('h3', { class: 'mobile-loan-eligible-label' }, loaneligibilitylabel),
      createElement('h2', { class: 'mobile-loan-eligible-details', id: 'mobile-le' }),
    ),
    createElement('div', { class: 'mobile-breakup' },
      createElement('div', { class: 'mobile-breakup-left' },
        createElement('div', { class: 'loaneligible-Totaltenure' },
          createElement('div', { style: 'color: #111111;font-size:14px;font-weight:500;' }, totaltenurelabel),
          createElement('div', { class: 'mobile-tenure-monthYear' },
            createElement('span', { id: 'mobile_year_tenure' }), mobileyear, ' ',
            createElement('span', { id: 'mobile_month_Tenure' }), mobilemonths
          ),
        ),
        createElement('div', { class: 'mobile-tenure-amount' },
          createElement('div', { class: 'mobile-tenure-amount-label' }, totalamountlabel),
          createElement('div', { id: 'mobile_CT', class: 'mobile-tenure-amount-detail' })
        ),
        createElement('div', { class: 'mobile-tenure-interest' },
          createElement('div', { class: 'mobile-tenure-interest-label' }, interestpayablelabel),
          createElement('div', { id: 'mobile_CI', style: 'color: #757575;font-size:12px;font-weight:400;' })
        ),
      ),
      createElement('div', { class: 'mobile-breakup-right' },
        createElement('div', { class: 'mobile-tenure-right' },
          createElement('div', { class: 'mobile-tenure-emi' },
            createElement('div', { class: 'mobile-tenure-emi-label' }, monthlyemilabel),
            createElement('span', { id: 'mobile_interest_rate', class: 'mobile-tenure-interest-rate' }),
          ),
          createElement('div', { class: 'mobile-tenure-emi-details' },
            createElement('h2', { id: 'mobile_monthly_emi_price', class: 'mobile-tenure-emi-price' },),
          )
        ),
        createElement('div', { class: 'mobile-tenure-apply' },
          createElement('button', { id: 'apply-btn-loan' }, applynowbutton)
        )
      )
    ),
  );
 
  const subContainer = createElement('div', { class: 'sub-container' }, view, breakup, mobileBreakup);
 
  block.append(subContainer);
 
  const loanAmtSlider = block.querySelector('#loanAmount');
  const loanAmtText = block.querySelector('#loan-amount-text');
 
  const exisitingEmiText = block.querySelector('#exisiting-emi-text');
  const exisitingEmiAmountSlider = block.querySelector('#exisiting-emi-amount');
 
  const intRateSlider = block.querySelector('#interestRate');
  const intRateText = block.querySelector('#linterest_Rate_Text');
  const loanPeriodSlider = block.querySelector('#loanPeriod');
  const loanPeriodText = block.querySelector('#loanPeriodText');
  const loanPeriodSliderMonth = block.querySelector('#loanPeriodMonth');
  const loanPeriodTextMonth = block.querySelector('#loanPeriodMonthText');
 
 
 
  loanAmtSlider.addEventListener("change", (self) => {
    // loan_amt_text.value = formatNumberWithCommas(self.target.value);
    loanAmtText.value = formatNumberToIndianCommas(self.target.value);
    P = removeCommaAndConvertToInt(self.target.value);
    displayDetails(P, R, N, M, E, line, pie, block);
  });
 
  loanAmtText.addEventListener("blur", (self) => {
    const valueWithoutCommas = removeCommaAndConvertToInt(self.target.value);
    loanAmtSlider.value = valueWithoutCommas;
    loanAmtText.value = formatNumberToIndianCommas(valueWithoutCommas);
    P = valueWithoutCommas;
    displayDetails(P, R, N, M, E, line, pie, block);
  });
 
  // Event listener to allow only numeric input
  loanAmtText.addEventListener('input', function (event) {
    let value = this.value;
    value = value.replace(/[^\d.]/g, ''); // Remove non-numeric characters except '.'
    this.value = value;
  });
 
 
  // Event listener to allow only numeric input
  loanAmtSlider.addEventListener('input', function (event) {
    let value = this.value;
    value = value.replace(/[^\d.]/g, ''); // Remove non-numeric characters except '.'
    this.value = value;
  });
  exisitingEmiAmountSlider.addEventListener('change', (self) => {
    exisitingEmiText.value = formatNumberToIndianCommas(self.target.value);
    E = removeCommaAndConvertToInt(self.target.value);
    displayDetails(P, R, N, M, E, line, pie, block);
  });
 
  exisitingEmiText.addEventListener('blur', (self) => {
    const valueWithoutCommas = removeCommaAndConvertToInt(self.target.value);
    exisitingEmiAmountSlider.value = valueWithoutCommas;
    exisitingEmiText.value = formatNumberToIndianCommas(valueWithoutCommas);
    E = valueWithoutCommas;
    displayDetails(P, R, N, M, E, line, pie, block);
  });
 
  intRateSlider.addEventListener('change', (self) => {
    intRateText.value = self.target.value;
    R = parseFloat(self.target.value);
    displayDetails(P, R, N, M, E, line, pie, block);
  });
 
  intRateText.addEventListener('blur', (self) => {
    intRateSlider.value = self.target.value;
    R = parseFloat(self.target.value);
    displayDetails(P, R, N, M, E, line, pie, block);
  });
 
  loanPeriodSlider.addEventListener('change', (self) => {
    loanPeriodText.value = self.target.value;
    N = parseFloat(self.target.value);
    displayDetails(P, R, N, M, E, line, pie, block);
  });
 
  loanPeriodText.addEventListener('blur', (self) => {
    loanPeriodSlider.value = self.target.value;
    N = parseFloat(self.target.value);
    displayDetails(P, R, N, M, E, line, pie, block);
  });
 
  loanPeriodSliderMonth.addEventListener('change', (self) => {
    loanPeriodTextMonth.value = self.target.value;
    M = parseFloat(self.target.value);
    displayDetails(P, R, N, M, E, line, pie, block);
  });
 
  loanPeriodTextMonth.addEventListener('blur', (self) => {
    loanPeriodSliderMonth.value = self.target.value;
    M = parseFloat(self.target.value);
    displayDetails(P, R, N, M, E, line, pie, block);
  });
 
  //for slider color event listener
 
  loanAmtSlider.addEventListener('input', function () {
    const value = this.value;
    const maxValue = this.max; // Get the maximum value of the range input
    const percentage = (value / maxValue) * 100;
    if (window.innerWidth <= 768) {
      this.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, #F4F4F4 ${percentage}%, #F4F4F4 100%)`;
    } else {
      this.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, white ${percentage}%, white 100%)`;
    }
  })
 
  loanAmtText.addEventListener('input', function () {
    const value = this.value;
    const maxValue = this.max; // Get the maximum value of the range input
    const percentage = (value / maxValue) * 100;
    // console.log(value);
    if (window.innerWidth <= 768) {
      loanAmtSlider.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, #F4F4F4 ${percentage}%, #F4F4F4 100%)`;
    } else {
      loanAmtSlider.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, white ${percentage}%, white 100%)`;
    }
  })
 
 
  intRateSlider.addEventListener('input', function () {
    const value = this.value;
    const percentage = ((value - interestRateMinValue) / (interestRateMaxValue - interestRateMinValue)) * 100;
 
    // Update the background gradient with the calculated percentage
    if (window.innerWidth <= 768) {
      this.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, #F4F4F4 ${percentage}%, #F4F4F4 100%)`;
    } else {
      this.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, white ${percentage}%, white 100%)`;
    }
  });
 
  intRateText.addEventListener('input', function () {
    const value = this.value;
    const percentage = ((value - interestRateMinValue) / (interestRateMaxValue - interestRateMinValue)) * 100;
    // Update the background gradient with the calculated percentage
    if (window.innerWidth <= 768) {
      intRateSlider.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, #F4F4F4 ${percentage}%, #F4F4F4 100%)`;
    } else {
      intRateSlider.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, white ${percentage}%, white 100%)`;
    }
  });
 
  loanPeriodSlider.addEventListener("input", function () {
    const value = this.value;
    const percentage = ((value - tenureMinYearValue) / (tenureMaxYearValue - tenureMinYearValue)) * 100;
    // Update the background gradient with the calculated percentage
    if (window.innerWidth <= 768) {
      this.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, #F4F4F4 ${percentage}%, #F4F4F4 100%)`;
    } else {
      this.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, white ${percentage}%, white 100%)`;
    }
  });
 
  loanPeriodText.addEventListener("input", function () {
    const value = this.value;
    const percentage = ((value - tenureMinYearValue) / (tenureMaxYearValue - tenureMinYearValue)) * 100;
    // Update the background gradient with the calculated percentage
    if (window.innerWidth <= 768) {
      loanPeriodSlider.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, #F4F4F4 ${percentage}%, #F4F4F4 100%)`;
    } else {
      loanPeriodSlider.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, white ${percentage}%, white 100%)`;
    }
  });
 
  loanPeriodSliderMonth.addEventListener("input", function () {
    const value = this.value;
    const percentage = ((value - tenureMinMonthValue) / (tenureMaxMonthValue - tenureMinMonthValue)) * 100;
    // Update the background gradient with the calculated percentage
    if (window.innerWidth <= 768) {
      this.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, #F4F4F4 ${percentage}%, #F4F4F4 100%)`;
    } else {
      this.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, white ${percentage}%, white 100%)`;
    }
  });
 
  loanPeriodTextMonth.addEventListener("input", function () {
    const value = this.value;
    const percentage = ((value - tenureMinMonthValue) / (tenureMaxMonthValue - tenureMinMonthValue)) * 100;
    // Update the background gradient with the calculated percentage
    if (window.innerWidth <= 768) {
      loanPeriodSliderMonth.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, #F4F4F4 ${percentage}%, #F4F4F4 100%)`;
    } else {
      loanPeriodSliderMonth.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, white ${percentage}%, white 100%)`;
    }
  });
 
 
  exisitingEmiAmountSlider.addEventListener("input", function () {
    const value = this.value;
    const percentage = ((value - existingEmiMin) / (existingEmiMax - existingEmiMin)) * 100;
    // Update the background gradient with the calculated percentage
    if (window.innerWidth <= 768) {
      this.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, #F4F4F4 ${percentage}%, #F4F4F4 100%)`;
    } else {
      this.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, white ${percentage}%, white 100%)`;
    }
  });
 
  exisitingEmiText.addEventListener("input", function () {
    const value = this.value;
    const percentage = ((value - existingEmiMin) / (existingEmiMax - existingEmiMin)) * 100;
    // Update the background gradient with the calculated percentage
    if (window.innerWidth <= 768) {
      exisitingEmiAmountSlider.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, #F4F4F4 ${percentage}%, #F4F4F4 100%)`;
    } else {
      exisitingEmiAmountSlider.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, white ${percentage}%, white 100%)`;
    }
  });
 
 
  // exisitingEmiAmountSlider.addEventListener("input", function () {
  //   const value = this.value;
  //   const percentage = ((value - existingEmiMin) / (existingEmiMax - existingEmiMin)) * 100;
  //   // Update the background gradient with the calculated percentage
  //   this.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, #fff ${percentage}%, white 100%)`;
  // });
 
  // exisitingEmiText.addEventListener("input", function () {
  //   const value = this.value;
  //   const percentage = ((value - existingEmiMin) / (existingEmiMax - existingEmiMin)) * 100;
  //   // Update the background gradient with the calculated percentage
  //   exisitingEmiAmountSlider.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, #fff ${percentage}%, white 100%)`;
  // });
 
 
 
 
 
  //   Error message spans
  const loanAmtError = createErrorSpan(`Value should be between ${formatNumberToIndianCommas(loanAmountMinValue)} and ${formatNumberToIndianCommas(loanAmountMaxValue)}`);
  const interestRateError = createErrorSpan(`Value should be between ${interestRateMinValue}% and ${interestRateMaxValue}%`);
  const exisitingEmiError = createErrorSpan(`Value should be between ${formatNumberToIndianCommas(existingEmiMin)} and ${formatNumberToIndianCommas(existingEmiMax)}`);
  const loanPeriodError = createErrorSpan(`Value should be between ${tenureMinYearValue} and ${tenureMaxYearValue}`);
  const loanPeriodMonthError = createErrorSpan(`Value should be between ${tenureMinMonthValue} and ${tenureMaxMonthValue}`);
 
  //   Append error message spans to their respective input containers
  amountDetail.appendChild(loanAmtError);
  interestDetail.appendChild(interestRateError);
  tenureYearsDetail.appendChild(loanPeriodError);
  tenureMonthsDetail.appendChild(loanPeriodMonthError);
  existingEmi.appendChild(exisitingEmiError);
 
  //   Event listeners for input elements to validate input values
 
  //  error for loan amount
  loanAmtText.addEventListener('input', function () {
    if (parseFloat(this.value) < parseFloat(loanAmountMinValue)
      || parseFloat(this.value) > parseFloat(loanAmountMaxValue)) {
      loanAmtError.style.display = 'block';
    } else {
      loanAmtError.style.display = 'none';
    }
  });
 
  //  error for existing emi
  exisitingEmiText.addEventListener('input', function () {
    if (parseFloat(this.value) < parseFloat(existingEmiMin)
      || parseFloat(this.value) > parseFloat(existingEmiMax)) {
      exisitingEmiError.style.display = 'block';
    } else {
      exisitingEmiError.style.display = 'none';
    }
  });
 
  //  error for interest amount
  intRateText.addEventListener('input', function () {
    if (parseFloat(this.value) < parseFloat(interestRateMinValue)
      || parseFloat(this.value) > parseFloat(interestRateMaxValue)) {
      interestRateError.style.display = 'block';
    } else {
      interestRateError.style.display = 'none';
    }
  });
 
  //  error for year
  loanPeriodText.addEventListener('input', function () {
    if (parseFloat(this.value) < parseFloat(tenureMinYearValue)
      || parseFloat(this.value) > parseFloat(tenureMaxYearValue)) {
      loanPeriodError.style.display = 'block';
    } else {
      loanPeriodError.style.display = 'none';
    }
  });
 
  // error for month
  loanPeriodTextMonth.addEventListener('input', function () {
    if (parseFloat(this.value) < parseFloat(tenureMinMonthValue)
      || parseFloat(this.value) > parseFloat(tenureMaxMonthValue)) {
      loanPeriodMonthError.style.display = 'block';
    } else {
      loanPeriodMonthError.style.display = 'none';
    }
  });
 
  // Set the product type in the apply button data attributes.
  selectProduct.addEventListener('input', function () {
    const selectedValue = this.value;
    const applyButton = document.getElementById('apply-btn-le');
    applyButton.setAttribute('data-product', selectedValue);
  });

  if(mobileSelect){
  mobileSelect.addEventListener('input',function(){
    const selectedText = mobileSelect.options[mobileSelect.selectedIndex].text;

    const applyMobile=document.getElementById('apply-btn-loan');
    applyMobile.setAttribute('data-product',selectedText);
  });}
 
  //  Handle button click event to redirect with query parameter
  document.getElementById('apply-btn-le').addEventListener('click', function () {
    const productValue = this.getAttribute('data-product');
    if (productValue) {
      url = `${redirectionPath}?product=${encodeURIComponent(productValue)}`;
      window.location.href = url;
    } else {
      url = redirectionPath;
      window.location.href = url;
    }
  });

    //  Handle button click event to redirect with query parameter for mobile apply now
    document.getElementById('apply-btn-loan').addEventListener('click', function () {
      const productValue = this.getAttribute('data-product');
      if (productValue) {
        const formattedProductValue = productValue.toLowerCase().replace(/\s+/g, '-');
        url = `${mobileredirection}?product=${encodeURIComponent(formattedProductValue)}`;
        window.location.href = url;
      } else {
        url = mobileredirection;
        window.location.href = url;
      }
    });
 
  //  Set input values to their minimum values
  loanAmtSlider.value = removeCommaAndConvertToInt(loanAmountMinValue);
  loanAmtText.value = formatNumberToIndianCommas(loanAmountMinValue);
  P = removeCommaAndConvertToInt(loanAmountMinValue);
 
  intRateSlider.value = interestRateMinValue;
  intRateText.value = interestRateMinValue;
  R = parseFloat(interestRateMinValue);
 
  loanPeriodSlider.value = tenureMinYearValue;
  loanPeriodText.value = tenureMinYearValue;
  N = parseFloat(tenureMinYearValue);
 
  loanPeriodSliderMonth.value = tenureMinMonthValue;
  loanPeriodTextMonth.value = tenureMinMonthValue;
  M = parseFloat(tenureMinMonthValue);
 
  exisitingEmiAmountSlider.value = removeCommaAndConvertToInt(existingEmiMin);
  exisitingEmiText.value = formatNumberToIndianCommas(existingEmiMin);
  E = removeCommaAndConvertToInt(existingEmiMin);
 
  line = new Chart(document.getElementById('mylineChart'), {
    data: {
      labels: [],
      datasets: [
        {
          label: 'Principal',
          backgroundColor: 'rgba(140, 177, 51, 1)',
          borderColor: 'rgba(140, 177, 51, 1)',
          data: [],
        },
        {
          label: 'Interest',
          backgroundColor: 'rgba(59, 59, 59, 1)',
          borderColor: 'rgba(59, 59, 59, 1)',
          data: [],
        },
      ],
    },
    type: 'line',
    options: {
      scales: {
        y: {
          ticks: {
            callback(val) {
              return val.toLocaleString('en-IN', {
                style: 'currency',
                currency: 'INR',
              });
            },
          },
        },
      },
    },
  });
 
  pie = new Chart(document.getElementById('mypieChart'), {
    type: 'doughnut',
    data: {
      // labels: ['PrinCIpal', 'Interest'],
      datasets: [
        {
          data: [P, 0],
          backgroundColor: ['rgba(140, 177, 51, 1)', 'rgba(59, 59, 59, 1)'],
          hoverOffset: 4,
          borderWidth: 15,
        },
      ],
      options: {
        cutoutPercentage: 30,
        responsive: true,
        maintainAspectRatio: false,
      }
    },
  });
 
  displayDetails(P, R, N, M, E, line, pie, block);
}