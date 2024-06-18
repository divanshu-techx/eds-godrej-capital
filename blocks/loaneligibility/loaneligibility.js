export default async function decorate() {
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
  
    const header = createElement(
      'div',
      { class: 'header' },
      createElement('h1', {}, 'Loan Eligibility  Calculator'),
      createElement(
        'button',
        {},
        createElement('i', { class: 'bi bi-list' }),
      ),
    );
  
    function getDataAttributeValueByName(name) {
      const element = document.querySelector(`[data-${name}]`);
      return element ? element.getAttribute(`data-${name}`) : null;
    }
  
    const loanAmountMaxValue = getDataAttributeValueByName('income-maxvalue');
    const loanAmountMinValue = getDataAttributeValueByName('income-minvalue');
    const laonamountTitle = getDataAttributeValueByName('income-title');
  
    const existingEmiTitle = getDataAttributeValueByName('existing-emi-title');
    const existingEmiMin = getDataAttributeValueByName('existing-emi-min');
    const existingEmiMax = getDataAttributeValueByName('existing-emi-max');
  
    const interestRateMaxValue = getDataAttributeValueByName('interestrate-maxvalue');
    const interestRateMinValue = getDataAttributeValueByName('interestrate-minvalue');
    const interestrateTitle = getDataAttributeValueByName('interestrate-title');
    const tenureTitleYear = getDataAttributeValueByName('tenure-title-year');
    const tenureMinYearValue = getDataAttributeValueByName('tenure-min-yearvalue');
    const tenureMaxYearValue = getDataAttributeValueByName('tenure-max-yearvalue');
    const tenureTitleMonths = getDataAttributeValueByName('tenure-title-months');
    const tenureMinMonthValue = getDataAttributeValueByName('tenure-min-monthvalue');
    const tenureMaxMonthValue = getDataAttributeValueByName('tenure-max-monthvalue');
    const redirectionPath = getDataAttributeValueByName('redirectionPath');
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
        createElement('p', { style: 'color: #9088D2' }, laonamountTitle),
        createElement(
          'div',
          { class: 'inputDetail' },
          createElement('span', { class: 'rupeeSpan' }, '₹'),
          createElement('input', {
            id: 'loan-amt-text', type: 'number', min: loanAmountMinValue, max: loanAmountMaxValue, step: '50000', style: 'color: #6258A8',
          }),
        ),
      ),
      createElement('input', {
        type: 'range', id: 'loan-amount', min: loanAmountMinValue, max: loanAmountMaxValue, step: '50000',
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
        createElement('p', { style: 'color: #9088D2' }, existingEmiTitle),
        createElement(
          'div',
          { class: 'inputDetail' },
          createElement('span', { class: 'rupeeSpan' }, '₹'),
          createElement('input', {
            id: 'exisiting-emi-text', type: 'number', min: existingEmiMin, max: existingEmiMax, step: '5', style: 'color: #6258A8',
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
        createElement('p', { style: 'color: #9088D2' }, interestrateTitle),
        createElement(
          'div',
          { class: 'inputDetail' },
          createElement('span', { class: 'percentSpan' }, '%'),
          createElement('input', {
            id: 'interest-rate-text', type: 'number', min: interestRateMinValue, max: interestRateMaxValue, step: '0.5', style: 'color: #6258A8',
          }),
        ),
      ),
      createElement('input', {
        type: 'range', id: 'interest-rate', min: interestRateMinValue, max: interestRateMaxValue, step: '0.5',
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
        createElement('p', { style: 'color: #9088D2' }, tenureTitleYear),
        createElement(
          'div',
          { class: 'inputDetail' },
          createElement('span', { class: 'yearSpan' }, 'Yrs.'),
          createElement('input', {
            id: 'loan-period-text', type: 'number', min: tenureMinYearValue, max: tenureMaxYearValue, step: '1', style: 'color: #6258A8',
          }),
        ),
      ),
      createElement('input', {
        type: 'range', id: 'loan-period', min: tenureMinYearValue, max: tenureMaxYearValue, step: '1',
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
        createElement('p', { style: 'color: #9088D2' }, tenureTitleMonths),
        createElement(
          'div',
          { class: 'inputDetail' },
          createElement('span', { class: 'monthSpan' }, 'Mos.'),
          createElement('input', {
            id: 'loan-period-month-text', type: 'number', min: tenureMinMonthValue, max: tenureMaxMonthValue, step: '1', style: 'color: #6258A8',
          }),
        ),
      ),
      createElement('input', {
        type: 'range', id: 'loan-period-month', min: tenureMinMonthValue, max: tenureMaxMonthValue, step: '1',
      }),
      createElement(
        'div',
        { class: 'range-values' },
        createElement('p', { class: 'min-value' }, `${tenureMinMonthValue} Month`),
        createElement('p', { class: 'max-value', style: 'float: right;' }, `${tenureMaxMonthValue} Month`),
      ),
    );
  
    let applyButton = document.createElement('button');
    applyButton.textContent = 'Apply Now';
    applyButton.id = 'apply-btn';
  
    const details = createElement(
      'div',
      { class: 'details' },
      selectProduct,
      amountDetail,
      existingEmi,
      interestDetail,
      tenureYearsDetail,
      tenureMonthsDetail,
      applyButton,
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
          createElement('p', { id: 'price' }, '0'),
        ),
      ),
    );
  
    const view = createElement('div', { class: 'view' }, details, footer);
  
    const breakup = createElement(
      'div',
      { class: 'breakup' },
      createElement('canvas', { id: 'pieChart' }),
    );
  
    const subContainer = createElement('div', { class: 'sub-container' }, view, breakup);
  
    const loanDetails = createElement(
      'div',
      { class: 'loan-details' },
      createElement(
        'div',
        { class: 'chart-details' },
        createElement('p', { style: 'color: #9088D2' }, 'Principal'),
        createElement('p', { id: 'cp', style: 'color: #130F31; font-size: 17px;' }),
      ),
      createElement(
        'div',
        { class: 'chart-details' },
        createElement('p', { style: 'color: #9088D2' }, 'Interest'),
        createElement('p', { id: 'ci', style: 'color: #130F31; font-size: 17px;' }),
      ),
      createElement(
        'div',
        { class: 'chart-details' },
        createElement('p', { style: 'color: #9088D2' }, 'Total Payable'),
        createElement('p', { id: 'ct', style: 'color: #130F31; font-size: 17px;' }),
      ),
      createElement(
        'div',
        { class: 'chart-details' },
        createElement('p', { style: 'color: #9088D2' }, 'Loan eligibility'),
        createElement('p', { id: 'le', style: 'color: #130F31; font-size: 17px;' }),
      ),
    );
    loanDetails.appendChild(footer);
  
    container.append(header, subContainer, loanDetails);
  
    const loanAmtSlider = document.getElementById('loan-amount');
    const loanAmtText = document.getElementById('loan-amt-text');
  
    const exisitingEmiText = document.getElementById('exisiting-emi-text');
    const exisitingEmiAmountSlider = document.getElementById('exisiting-emi-amount');
  
    const intRateSlider = document.getElementById('interest-rate');
    const intRateText = document.getElementById('interest-rate-text');
    const loanPeriodSlider = document.getElementById('loan-period');
    const loanPeriodText = document.getElementById('loan-period-text');
    const loanPeriodSliderMonth = document.getElementById('loan-period-month');
    const loanPeriodTextMonth = document.getElementById('loan-period-month-text');
  
    function calculateLoanDetails(p, r, n, m) {
      let totalInterest = 0;
      const yearlyInterest = [];
      const yearPrincipal = [];
      const years = [];
      let year = 1; // Allow incrementing
      let counter = 0;
      let principalAccumulator = 0;
      let interestAccumulator = 0;
      const totalMonths = n * 12 + m;
  
      const emi = (p * r * (1 + r) ** totalMonths) / ((1 + r) ** totalMonths - 1);
      const totalPayment = emi * totalMonths;
      totalInterest = totalPayment - p;
  
      let currentPrincipal = p; // New variable to avoid modifying the parameter
  
      for (i = 0; i < totalMonths; i += 1) {
        const interest = currentPrincipal * r;
        currentPrincipal -= (emi - interest);
        principalAccumulator += emi - interest;
        interestAccumulator += interest;
        counter += 1; // Increment counter
        if (counter === 12) {
          years.push(year);
          yearlyInterest.push(parseInt(interestAccumulator, 10));
          yearPrincipal.push(parseInt(principalAccumulator, 10));
          counter = 0;
          year += 1; // Increment year
          interestAccumulator = 0; // Reset yearly interest accumulator
          principalAccumulator = 0; // Reset yearly principal accumulator
        }
      }
  
      line.data.datasets[0].data = yearPrincipal;
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
  
      document.querySelector('#cp').innerText = P.toLocaleString('en-IN', opts);
  
      document.querySelector('#ci').innerText = payableInterest.toLocaleString('en-IN', opts);
  
      document.querySelector('#ct').innerText = (P + payableInterest).toLocaleString('en-IN', opts);
  
      document.querySelector('#price').innerText = emi.toLocaleString('en-IN', opts);
  
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
      applyButton = document.getElementById('apply-btn');
      applyButton.setAttribute('data-product', selectedValue);
    });
  
    //  Handle button click event to redirect with query parameter
    document.getElementById('apply-btn').addEventListener('click', function () {
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
  
      line = new Chart(document.getElementById('lineChart'), {
        data: {
          labels: [],
          datasets: [
            {
              label: 'Principal',
              backgroundColor: 'rgb(255, 99, 132)',
              borderColor: 'rgb(255, 99, 132)',
              data: [],
            },
            {
              label: 'Interest',
              backgroundColor: 'rgb(54, 162, 235)',
              borderColor: 'rgb(54, 162, 235)',
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
  
      pie = new Chart(document.getElementById('pieChart'), {
        type: 'doughnut',
        data: {
          labels: ['Principal', 'Interest'],
          datasets: [
            {
              data: [P, 0],
              backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)'],
              hoverOffset: 4,
            },
          ],
        },
      });
  
      displayDetails();
    }
  
    initialize();
  }