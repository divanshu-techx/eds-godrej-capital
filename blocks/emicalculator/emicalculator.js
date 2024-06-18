export default async function decorate() {
  const container = document.querySelector('.emicalculator-container');

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
    createElement(
      'h1',
      {},
      'Loan Calculator',
    ),
    createElement(
      'button',
      {},
      createElement(
        'i',
        { class: 'bi bi-list' },
      ),
    ),
  );

  // Get the meta value from the meta tag
  // function getMetaContentByName(name) {
  //     const metaTag = document.querySelector(`meta[name='${name}']`);
  //     return metaTag ? metaTag.getAttribute('content') : null;
  // }

  function getDataAttributeValueByName(name) {
    const element = document.querySelector(`[data-${name}]`);
    return element ? element.getAttribute(`data-${name}`) : null;
  }

  const loanAmountMaxValue = getDataAttributeValueByName('laonamount-maxvalue');
  const loanAmountMinValue = getDataAttributeValueByName('laonamount-minvalue');
  const laonamountTitle = getDataAttributeValueByName('laonamount-title');
  const interestrateMaxvalue = getDataAttributeValueByName('interestrate-maxvalue');
  const interestrateMinvalue = getDataAttributeValueByName('interestrate-minvalue');
  const interestrateTitle = getDataAttributeValueByName('interestrate-title');
  const tenureTitleYear = getDataAttributeValueByName('tenure-title-year');
  const tenureMinYearvalue = getDataAttributeValueByName('tenure-min-yearvalue');
  const tenureMaxYearvalue = getDataAttributeValueByName('tenure-max-yearvalue');
  const tenureTitleMonths = getDataAttributeValueByName('tenure-title-months');
  const tenureMinMonthvalue = getDataAttributeValueByName('tenure-min-monthvalue');
  const tenureMaxMonthvalue = getDataAttributeValueByName('tenure-max-monthvalue');

  const amountDetail = createElement(
    'div',
    {},
    createElement(
      'div',
      { class: 'detail' },
      createElement(
        'p',
        { style: 'color: #9088D2' },
        laonamountTitle,
      ),
      createElement(
        'div',
        { class: 'inputDetail' },
        createElement(
          'span',
          { class: 'rupeeSpan' },
          'Rs',
        ),
        createElement(
          'input',
          {
            id: 'loan-amt-text',
            type: 'number',
            min: loanAmountMinValue,
            max: loanAmountMaxValue,
            step: '50000',
            style: 'color: #6258A8',
          },
        ),
      ),
    ),
    createElement(
      'input',
      {
        type: 'range',
        id: 'loan-amount',
        min: loanAmountMinValue,
        max: loanAmountMaxValue,
        step: '50000',
      },
    ),
    createElement(
      'div',
      { class: 'range-values' },
      createElement(
        'p',
        { class: 'min-value' },
        loanAmountMinValue,
      ),
      createElement(
        'p',
        {
          class: 'max-value',
          style: 'float: right;',
        },
        loanAmountMaxValue,
      ),
    ),
  );

  const interestDetail = createElement(
    'div',
    {},
    createElement(
      'div',
      { class: 'detail' },
      createElement(
        'p',
        { style: 'color: #9088D2' },
        interestrateTitle,
      ),
      createElement(
        'div',
        { class: 'inputDetail' },
        createElement(
          'span',
          { class: 'percentSpan' },
          '%',
        ),
        createElement(
          'input',
          {
            id: 'interest-rate-text',
            type: 'number',
            min: interestrateMinvalue,
            max: interestrateMaxvalue,
            step: '0.5',
            style: 'color: #6258A8',
          },
        ),
      ),
    ),
    createElement(
      'input',
      {
        type: 'range',
        id: 'interest-rate',
        min: interestrateMinvalue,
        max: interestrateMaxvalue,
        step: '0.5',
      },
    ),
    createElement(
      'div',
      { class: 'range-values' },
      createElement(
        'p',
        { class: 'min-value' },
        `${interestrateMinvalue}'%'`,
      ),
      createElement(
        'p',
        {
          class: 'max-value',
          style: 'float: right;',
        },
        `${interestrateMaxvalue}'%'`,
      ),
    ),
  );

  const tenureYearsDetail = createElement(
    'div',
    {},
    createElement(
      'div',
      { class: 'detail' },
      createElement(
        'p',
        { style: 'color: #9088D2' },
        tenureTitleYear,
      ),
      createElement(
        'div',
        { class: 'inputDetail' },
        createElement(
          'span',
          { class: 'yearSpan' },
          'Yrs.',
        ),
        createElement(
          'input',
          {
            id: 'loan-period-text',
            type: 'number',
            min: tenureMinYearvalue,
            max: tenureMaxYearvalue,
            step: '1',
            style: 'color: #6258A8',
          },
        ),
      ),
    ),
    createElement(
      'input',
      {
        type: 'range',
        id: 'loan-period',
        min: tenureMinYearvalue,
        max: tenureMaxYearvalue,
        step: '1',
      },
    ),
    createElement(
      'div',
      { class: 'range-values' },
      createElement(
        'p',
        { class: 'min-value' },
        `${tenureMinYearvalue} Year`,
      ),
      createElement(
        'p',
        {
          class: 'max-value',
          style: 'float: right;',
        },
        `${tenureMaxYearvalue} Year`,
      ),
    ),
  );

  const tenureMonthsDetail = createElement(
    'div',
    {},
    createElement(
      'div',
      { class: 'detail' },
      createElement(
        'p',
        { style: 'color: #9088D2' },
        tenureTitleMonths,
      ),
      createElement(
        'div',
        { class: 'inputDetail' },
        createElement(
          'span',
          {
            class: 'monthSpan',
          },
          'Mos.',
        ),
        createElement(
          'input',
          {
            id: 'loan-period-month-text',
            type: 'number',
            min: tenureMinMonthvalue,
            max: tenureMaxMonthvalue,
            step: '1',
            style: 'color: #6258A8',
          },
        ),
      ),
    ),
    createElement(
      'input',
      {
        type: 'range',
        id: 'loan-period-month',
        min: tenureMinMonthvalue,
        max: tenureMaxMonthvalue,
        step: '1',
      },
    ),
    createElement(
      'div',
      { class: 'range-values' },
      createElement(
        'p',
        { class: 'min-value' },
        `${tenureMinMonthvalue} Month`,
      ),
      createElement(
        'p',
        {
          class: 'max-value', style: 'float: right;',
        },
        `${tenureMaxMonthvalue} Month`,
      ),
    ),
  );

  const details = createElement(
    'div',
    { class: 'details' },
    amountDetail,
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
        createElement('p', { id: 'price' }, '0'),
      ),
    ),
  );

  const view = createElement(
    'div',
    { class: 'view' },
    details,
    footer,
  );

  const breakup = createElement(
    'div',
    { class: 'breakup' },
    createElement(
      'canvas',
      { id: 'pieChart' },
    ),
  );

  const subContainer = createElement(
    'div',
    { class: 'sub-container' },
    view,
    breakup,
  );

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
  );
  loanDetails.appendChild(footer);

  container.append(header, subContainer, loanDetails);

  let P;
  let R;
  let N;
  let M;
  let pie;
  let line;

  const loanAmtSlider = document.getElementById('loan-amount');
  const loanAmtText = document.getElementById('loan-amt-text');
  const intRateSlider = document.getElementById('interest-rate');
  const intRateText = document.getElementById('interest-rate-text');
  const loanPeriodSlider = document.getElementById('loan-period');
  const loanPeriodText = document.getElementById('loan-period-text');
  const loanPeriodSliderMonth = document.getElementById('loan-period-month');
  const loanPeriodTextMonth = document.getElementById('loan-period-month-text');

  function calculateLoanDetails(initialPrincipal, r, emi, n, m) {
    let p = initialPrincipal;
    let totalInterest = 0;
    const yearlyInterest = [];
    const yearPrincipal = [];
    const years = [];
    let year = 1;
    let [counter, principal, interest] = [0, 0, 0];
    const totalMonths = n * 12 + m;
    for (let i = 0; i < totalMonths; i += 1) {
      const monthlyInterest = p * r;
      p -= (emi - monthlyInterest);
      totalInterest += monthlyInterest;
      principal += emi - monthlyInterest;
      interest += monthlyInterest;
      counter += 1;
      if (counter === 12) {
        years.push(year);
        year += 1;
        yearlyInterest.push(parseInt(interest, 10));
        yearPrincipal.push(parseInt(principal, 10));
        counter = 0;
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

    const num = P * r * (1 + r) ** totalMonths;
    const denom = (1 + r) ** totalMonths - 1;
    const emi = num / denom;

    const payableInterest = calculateLoanDetails(P, r, emi, n, m);

    const opts = { style: 'currency', currency: 'INR' };

    document.querySelector('#cp').innerText = P.toLocaleString('en-IN', opts);
    document.querySelector('#ci').innerText = payableInterest.toLocaleString('en-IN', opts);
    document.querySelector('#ct').innerText = (P + payableInterest).toLocaleString('en-IN', opts);
    document.querySelector('#price').innerText = emi.toLocaleString('en-IN', opts);

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

  // Error message spans
  const loanAmtError = createErrorSpan(`Value should be between ${loanAmountMinValue} and ${loanAmountMaxValue}`);
  const interestRateError = createErrorSpan(`Value should be between ${interestrateMinvalue} % and  ${interestrateMaxvalue}%`);
  const loanPeriodError = createErrorSpan(`Value should be between ${tenureMinYearvalue} and ${tenureMaxYearvalue}`);
  const loanPeriodMonthError = createErrorSpan(`Value should be between ${tenureMinMonthvalue} and ${tenureMaxMonthvalue}`);

  // Append error message spans to their respective input containers
  amountDetail.appendChild(loanAmtError);
  interestDetail.appendChild(interestRateError);
  tenureYearsDetail.appendChild(loanPeriodError);
  tenureMonthsDetail.appendChild(loanPeriodMonthError);

  // Event listeners for input elements to validate input values

  //  error for loan amount
  loanAmtText.addEventListener('input', function handleLoanAmountInput() {
    if (parseFloat(this.value) < parseFloat(loanAmountMinValue)
      || parseFloat(this.value) > parseFloat(loanAmountMaxValue)) {
      loanAmtError.style.display = 'block';
    } else {
      loanAmtError.style.display = 'none';
    }
  });

  //  error for loan amount
  intRateText.addEventListener('input', function handleInterestRateInput() {
    if (parseFloat(this.value) < parseFloat(interestrateMinvalue)
      || parseFloat(this.value) > parseFloat(interestrateMaxvalue)) {
      interestRateError.style.display = 'block';
    } else {
      interestRateError.style.display = 'none';
    }
  });

  //  error for year
  loanPeriodText.addEventListener('input', function handleYearInput() {
    if (parseFloat(this.value) < parseFloat(tenureMinYearvalue)
      || parseFloat(this.value) > parseFloat(tenureMaxYearvalue)) {
      loanPeriodError.style.display = 'block';
    } else {
      loanPeriodError.style.display = 'none';
    }
  });

  //  error for month
  loanPeriodTextMonth.addEventListener('input', function handleMonthInput() {
    if (parseFloat(this.value) < parseFloat(tenureMinMonthvalue)
      || parseFloat(this.value) > parseFloat(tenureMaxMonthvalue)) {
      loanPeriodMonthError.style.display = 'block';
    } else {
      loanPeriodMonthError.style.display = 'none';
    }
  });

  function initialize() {
    loanAmtSlider.value = loanAmountMinValue;
    loanAmtText.value = loanAmountMinValue;
    P = parseFloat(loanAmountMinValue);

    intRateSlider.value = interestrateMinvalue;
    intRateText.value = interestrateMinvalue;
    R = parseFloat(interestrateMinvalue);

    loanPeriodSlider.value = tenureMinYearvalue;
    loanPeriodText.value = tenureMinYearvalue;
    N = parseFloat(tenureMinYearvalue);

    loanPeriodSliderMonth.value = tenureMinMonthvalue;
    loanPeriodTextMonth.value = tenureMinMonthvalue;
    M = parseFloat(tenureMinMonthvalue);

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
