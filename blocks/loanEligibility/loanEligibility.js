export default async function decorate(block) {
  const container = document.querySelector('.loaneligibility');
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
 
  // const header = createElement(
  //   'div',
  //   { class: 'header' },
  //   createElement('h1', {}, 'Loan Eligibility  Calculator'),
  //   createElement(
  //     'button',
  //     {},
  //     createElement('i', { class: 'bi bi-list' }),
  //   ),
  // );
 
  function getDataAttributeValueByName(name) {
    const element = document.querySelector(`[data-${name}]`);
    return element ? element.getAttribute(`data-${name}`) : null;
  }
 
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
 
  const selectProductPlaceHolder = getDataAttributeValueByName('select-product-place-holder');
 
  //  Create a select element
  const selectProduct = document.createElement('select');
 
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
 
  const amountDetail = createElement(
    'div',
    {},
    createElement(
      'div',
      { class: 'detail' },
      createElement('p', { style: 'color: #3b3b3b' }, laonamountTitle),
      createElement(
        'div',
        { class: 'inputDetail' },
        createElement('span', { class: 'rupeeSpan' }, '₹'),
        createElement('input', {
          id: 'loan-amount-text', type: 'number', min: loanAmountMinValue, max: loanAmountMaxValue, step: '50000', style: 'color: #b3b3b3',
        }),
      ),
    ),
    createElement('input', {
      type: 'range', id: 'loanAmount', min: loanAmountMinValue, max: loanAmountMaxValue, step: '50000',
    }),
    createElement(
      'div',
      { class: 'range-values' },
      createElement('p', { class: 'min-value' }, loanAmountMinValue),
      createElement('p', { class: 'max-value', style: 'float: right;' }, loanAmountMaxValue),
    ),
  );
 
  const existingEmi = createElement(
    'div',
    {},
    createElement(
      'div',
      { class: 'detail' },
      createElement('p', { style: 'color: #3b3b3b' }, existingEmiTitle),
      createElement(
        'div',
        { class: 'inputDetail' },
        createElement('span', { class: 'rupeeSpan' }, '₹'),
        createElement('input', {
          id: 'exisiting-emi-text', type: 'number', min: existingEmiMin, max: existingEmiMax, step: '5', style: 'color: #b3b3b3',
        }),
      ),
    ),
    createElement('input', {
      type: 'range', id: 'exisiting-emi-amount', min: existingEmiMin, max: existingEmiMax, step: '5',
    }),
    createElement(
      'div',
      { class: 'range-values' },
      createElement('p', { class: 'min-value' }, existingEmiMin),
      createElement('p', { class: 'max-value', style: 'float: right;' }, existingEmiMax),
    ),
  );
 
  const interestDetail = createElement(
    'div',
    {},
    createElement(
      'div',
      { class: 'detail' },
      createElement('p', { style: 'color: #3b3b3b' }, interestrateTitle),
      createElement(
        'div',
        { class: 'inputDetail' },
        createElement('span', { class: 'percentSpan' }, '%'),
        createElement('input', {
          id: 'linterest_Rate_Text', type: 'number', min: interestRateMinValue, max: interestRateMaxValue, step: '0.5', style: 'color: #b3b3b3',
        }),
      ),
    ),
    createElement('input', {
      type: 'range', id: 'interestRate', min: interestRateMinValue, max: interestRateMaxValue, step: '0.5',
    }),
    createElement(
      'div',
      { class: 'range-values' },
      createElement('p', { class: 'min-value' }, `${interestRateMinValue}%`),
      createElement('p', { class: 'max-value', style: 'float: right;' }, `${interestRateMaxValue}%`),
    ),
  );
 
  const tenureYearsDetail = createElement(
    'div',
    {},
    createElement(
      'div',
      { class: 'detail' },
      createElement('p', { style: 'color: #3b3b3b' }, tenureTitleYear),
      createElement(
        'div',
        { class: 'inputDetail' },
        createElement('span', { class: 'yearSpan' }, 'Yrs.'),
        createElement('input', {
          id: 'loanPeriodText', type: 'number', min: tenureMinYearValue, max: tenureMaxYearValue, step: '1', style: 'color: #b3b3b3',
        }),
      ),
    ),
    createElement('input', {
      type: 'range', id: 'loanPeriod', min: tenureMinYearValue, max: tenureMaxYearValue, step: '1',
    }),
    createElement(
      'div',
      { class: 'range-values' },
      createElement('p', { class: 'min-value' }, `${tenureMinYearValue} Year`),
      createElement('p', { class: 'max-value', style: 'float: right;' }, `${tenureMaxYearValue} Year`),
    ),
  );
 
  const tenureMonthsDetail = createElement(
    'div',
    {},
    createElement(
      'div',
      { class: 'detail' },
      createElement('p', { style: 'color: #3b3b3b' }, tenureTitleMonths),
      createElement(
        'div',
        { class: 'inputDetail' },
        createElement('span', { class: 'monthSpan' }, 'Mos.'),
        createElement('input', {
          id: 'loanPeriodMonthText', type: 'number', min: tenureMinMonthValue, max: tenureMaxMonthValue, step: '1', style: 'color: #b3b3b3',
        }),
      ),
    ),
    createElement('input', {
      type: 'range', id: 'loanPeriodMonth', min: tenureMinMonthValue, max: tenureMaxMonthValue, step: '1',
    }),
    createElement(
      'div',
      { class: 'range-values' },
      createElement('p', { class: 'min-value' }, `${tenureMinMonthValue} Month`),
      createElement('p', { class: 'max-value', style: 'float: right;' }, `${tenureMaxMonthValue} Month`),
    ),
  );
 
 
  const details = createElement(
    'div',
    { class: 'details' },
    selectProduct,
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
        'p',
        { id: 'price-container-emi' },
        'Your Monthly Emi',
        createElement('p', { id: 'MonthlyEmiPrice' }, '0'),
      ),
    ),
  );
 
  const view = createElement('div', { class: 'view' }, details, footer);
 
  const breakup = createElement('div', { class: 'breakup' },
    createElement('canvas',{id:"mypieChart"}),
    // <canvas id="pieChart"></canvas>,
    createElement('div', { class: "chartDetails" },
        createElement('canvas', { id: 'pieChart' }),
        createElement('div', { id: 'canvasItems' },
            createElement('div', { class: 'intrest' },
                createElement('div', { style: 'color: #3b3b3b' }, 'Intrest Rate'),
                createElement('div', { id: 'Rate' })
            ),
            createElement('div', { class: 'tenure' },
                createElement('div', { style: 'color: #3b3b3b' }, 'Total Tenure'),
                createElement('span', { id: 'year_tenure' }), 'Y', ' | ',
                createElement('span', { id: 'month_Tenure' }), 'M'
            ),
        )),
);
 
  const subContainer = createElement('div', { class: 'sub-container' }, view, breakup);
 
  const loanDetailsUpper=createElement('div',{class:'loan-details-upper'},
    createElement(
      'div',
      { class: 'chart-details' },
      createElement('p', { style: 'color: #3B3B3B' }, 'PrinCIpal'),
      createElement('p', { id: 'CP', style: 'color: #3B3B3B; font-size: 17px;' }),
    ),
    createElement(
      'div',
      { class: 'chart-details' },
      createElement('p', { style: 'color: #3B3B3B' }, 'Interest'),
      createElement('p', { id: 'CI', style: 'color: #3B3B3B; font-size: 17px;' }),
    ),
  )
 
  const loaneligibilityDetails=createElement('div',{class:'loan-eligiblity-details'},
    createElement(
      'div',
      { class: 'chart-details' },
      createElement('p', { style: 'color: #3B3B3B' }, 'Loan eligibility'),
      createElement('p', { id: 'le', style: 'color: #3B3B3B; font-size: 17px;' }),
    ),
  );
  const loanDetails = createElement(
    'div',
    { class: 'loan-details' },
    createElement(
      'div',
      { class: 'chart-details' },
      createElement('p', { style: 'color: #3B3B3B' }, 'Total Payable'),
      createElement('p', { id: 'CT', style: 'color: #3B3B3B; font-size: 17px;' }),
    ),footer,
    createElement('div', { class: 'chart-details' },
      createElement('button', { id: 'apply-btn-le' }, 'Apply Now'),
  ),
  createElement('div',{id:'mylineChart'}),
  // <canvas id="lineChart" height="200px" width="200px"></canvas>
  );
  container.append(subContainer);
  breakup.append(loanDetailsUpper,loaneligibilityDetails,loanDetails);
 
  const loanAmtSlider = document.getElementById('loanAmount');
  const loanAmtText = document.getElementById('loan-amount-text');
 
  const exisitingEmiText = document.getElementById('exisiting-emi-text');
  const exisitingEmiAmountSlider = document.getElementById('exisiting-emi-amount');
 
  const intRateSlider = document.getElementById('interestRate');
  const intRateText = document.getElementById('linterest_Rate_Text');
  const loanPeriodSlider = document.getElementById('loanPeriod');
  const loanPeriodText = document.getElementById('loanPeriodText');
  const loanPeriodSliderMonth = document.getElementById('loanPeriodMonth');
  const loanPeriodTextMonth = document.getElementById('loanPeriodMonthText');
 
  function calculateLoanDetails(p, r, n, m) {
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
 
  function displayDetails() {
    const r = parseFloat(R) / 1200;
    const n = parseFloat(N);
    const m = parseFloat(M);
    const totalMonths = n * 12 + m;
 
    const emi = (P * r * (1 + r) ** totalMonths) / ((1 + r) ** totalMonths - 1);
    const payableInterest = calculateLoanDetails(P, r, n, m);
 
    const opts = { style: 'currency', currency: 'INR' };
 
    document.querySelector('#CP').innerText = P.toLocaleString('en-IN', opts);
 
    document.querySelector('#CI').innerText = payableInterest.toLocaleString('en-IN', opts);
 
    document.querySelector('#CT').innerText = (P + payableInterest).toLocaleString('en-IN', opts);
 
    document.querySelector("#Rate").innerText =
          R.toLocaleString("en-IN", R) + "%";
 
      document.querySelector("#month_Tenure").innerText =
          M.toLocaleString("en-IN", M + 'M');
 
      document.querySelector("#year_tenure").innerText =
          N.toLocaleString("en-IN", N + 'Y');
 
    document.querySelector('#MonthlyEmiPrice').innerText = emi.toLocaleString('en-IN', opts);
 
    document.querySelector('#le').innerText = `₹ ${Math.max(0, P - E).toLocaleString()}`;
 
    pie.data.datasets[0].data[0] = P;
    pie.data.datasets[0].data[1] = payableInterest;
    pie.update();
    line.update();
  }
 
  loanAmtSlider.addEventListener('change', (self) => {
    loanAmtText.value = self.target.value;
    P = parseFloat(self.target.value);
    displayDetails();
  });
 
  loanAmtText.addEventListener('blur', (self) => {
    loanAmtSlider.value = self.target.value;
    P = parseFloat(self.target.value);
    displayDetails();
  });
 
  exisitingEmiAmountSlider.addEventListener('change', (self) => {
    exisitingEmiText.value = self.target.value;
    E = parseFloat(self.target.value);
    displayDetails();
  });
 
  exisitingEmiText.addEventListener('blur', (self) => {
    exisitingEmiAmountSlider.value = self.target.value;
    E = parseFloat(self.target.value);
    displayDetails();
  });
 
  intRateSlider.addEventListener('change', (self) => {
    intRateText.value = self.target.value;
    R = parseFloat(self.target.value);
    displayDetails();
  });
 
  intRateText.addEventListener('blur', (self) => {
    intRateSlider.value = self.target.value;
    R = parseFloat(self.target.value);
    displayDetails();
  });
 
  loanPeriodSlider.addEventListener('change', (self) => {
    loanPeriodText.value = self.target.value;
    N = parseFloat(self.target.value);
    displayDetails();
  });
 
  loanPeriodText.addEventListener('blur', (self) => {
    loanPeriodSlider.value = self.target.value;
    N = parseFloat(self.target.value);
    displayDetails();
  });
 
  loanPeriodSliderMonth.addEventListener('change', (self) => {
    loanPeriodTextMonth.value = self.target.value;
    M = parseFloat(self.target.value);
    displayDetails();
  });
 
  loanPeriodTextMonth.addEventListener('blur', (self) => {
    loanPeriodSliderMonth.value = self.target.value;
    M = parseFloat(self.target.value);
    displayDetails();
  });
 
  //  error message
  function createErrorSpan(message) {
    return createElement('span', { class: 'error-message', style: 'color: red; display: none;' }, message);
  }
 
  //   Error message spans
  const loanAmtError = createErrorSpan(`Value should be between ${loanAmountMinValue} and ${loanAmountMaxValue}`);
  const interestRateError = createErrorSpan(`Value should be between ${interestRateMinValue}% and ${interestRateMaxValue}%`);
  const exisitingEmiError = createErrorSpan(`Value should be between${existingEmiMin}and ${existingEmiMax}`);
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
    applyButton = document.getElementById('apply-btn-le');
    applyButton.setAttribute('data-product', selectedValue);
  });
 
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
 
  function initialize() {
    //  Set input values to their minimum values
    loanAmtSlider.value = loanAmountMinValue;
    loanAmtText.value = loanAmountMinValue;
    P = parseFloat(loanAmountMinValue);
 
    intRateSlider.value = interestRateMinValue;
    intRateText.value = interestRateMinValue;
    R = parseFloat(interestRateMinValue);
 
    loanPeriodSlider.value = tenureMinYearValue;
    loanPeriodText.value = tenureMinYearValue;
    N = parseFloat(tenureMinYearValue);
 
    loanPeriodSliderMonth.value = tenureMinMonthValue;
    loanPeriodTextMonth.value = tenureMinMonthValue;
    M = parseFloat(tenureMinMonthValue);
 
    exisitingEmiAmountSlider.value = existingEmiMin;
    exisitingEmiText.value = existingEmiMin;
    E = parseFloat(existingEmiMin);
 
    line = new Chart(document.getElementById('mylineChart'), {
      data: {
        labels: [],
        datasets: [
          {
            label: 'PrinCIpal',
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
          },
        ],
      },
    });
 
    displayDetails();
  }
 
  initialize();
}