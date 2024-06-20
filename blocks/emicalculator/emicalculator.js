// export default async function decorate() {
//   const container = document.querySelector('.emicalculator-container');

//   function createElement(type, attributes = {}, ...children) {
//     const element = document.createElement(type);
//     Object.entries(attributes).forEach(([key, value]) => {
//       element.setAttribute(key, value);
//     });
//     children.forEach((child) => {
//       if (typeof child === 'string') {
//         element.appendChild(document.createTextNode(child));
//       } else {
//         element.appendChild(child);
//       }
//     });
//     return element;
//   }

//   const header = createElement(
//     'div',
//     { class: 'header' },
//     createElement(
//       'h1',
//       {},
//       'Loan Calculator',
//     ),
//     createElement(
//       'button',
//       {},
//       createElement(
//         'i',
//         { class: 'bi bi-list' },
//       ),
//     ),
//   );

//   // Get the meta value from the meta tag
//   // function getMetaContentByName(name) {
//   //     const metaTag = document.querySelector(`meta[name='${name}']`);
//   //     return metaTag ? metaTag.getAttribute('content') : null;
//   // }

//   function getDataAttributeValueByName(name) {
//     const element = document.querySelector(`[data-${name}]`);
//     return element ? element.getAttribute(`data-${name}`) : null;
//   }

//   const loanAmountMaxValue = getDataAttributeValueByName('laonamount-maxvalue');
//   const loanAmountMinValue = getDataAttributeValueByName('laonamount-minvalue');
//   const laonamountTitle = getDataAttributeValueByName('laonamount-title');
//   const interestrateMaxvalue = getDataAttributeValueByName('interestrate-maxvalue');
//   const interestrateMinvalue = getDataAttributeValueByName('interestrate-minvalue');
//   const interestrateTitle = getDataAttributeValueByName('interestrate-title');
//   const tenureTitleYear = getDataAttributeValueByName('tenure-title-year');
//   const tenureMinYearvalue = getDataAttributeValueByName('tenure-min-yearvalue');
//   const tenureMaxYearvalue = getDataAttributeValueByName('tenure-max-yearvalue');
//   const tenureTitleMonths = getDataAttributeValueByName('tenure-title-months');
//   const tenureMinMonthvalue = getDataAttributeValueByName('tenure-min-monthvalue');
//   const tenureMaxMonthvalue = getDataAttributeValueByName('tenure-max-monthvalue');

//   const amountDetail = createElement(
//     'div',
//     {},
//     createElement(
//       'div',
//       { class: 'detail' },
//       createElement(
//         'div',
//         { style: 'color: #3b3b3b' },
//         laonamountTitle,
//       ),
//       createElement(
//         'div',
//         { class: 'inputDetail' },
//         createElement(
//           'span',
//           { class: 'rupeeSpan' },
//           'Rs',
//         ),
//         createElement(
//           'input',
//           {
//             id: 'loan-amt-text',
//             type: 'number',
//             min: loanAmountMinValue,
//             max: loanAmountMaxValue,
//             step: '50000',
//             style: 'color:#b3b3b3',
//           },
//         ),
//       ),
//     ),
//     createElement(
//       'input',
//       {
//         type: 'range',
//         id: 'loan-amount',
//         min: loanAmountMinValue,
//         max: loanAmountMaxValue,
//         step: '50000',
//       },
//     ),
//     createElement(
//       'div',
//       { class: 'range-values' },
//       createElement(
//         'div',
//         { class: 'min-value' },
//         loanAmountMinValue,
//       ),
//       createElement(
//         'div',
//         {
//           class: 'max-value',
//           style: 'float: right;',
//         },
//         loanAmountMaxValue,
//       ),
//     ),
//   );

//   const interestDetail = createElement(
//     'div',
//     {},
//     createElement(
//       'div',
//       { class: 'detail' },
//       createElement(
//         'div',
//         { style: 'color: #3b3b3b' },
//         interestrateTitle,
//       ),
//       createElement(
//         'div',
//         { class: 'inputDetail' },
//         createElement(
//           'span',
//           { class: 'percentSpan' },
//           '%',
//         ),
//         createElement(
//           'input',
//           {
//             id: 'interest-rate-text',
//             type: 'number',
//             min: interestrateMinvalue,
//             max: interestrateMaxvalue,
//             step: '0.5',
//             style: 'color:#b3b3b3',
//           },
//         ),
//       ),
//     ),
//     createElement(
//       'input',
//       {
//         type: 'range',
//         id: 'interest-rate',
//         min: interestrateMinvalue,
//         max: interestrateMaxvalue,
//         step: '0.5',
//       },
//     ),
//     createElement(
//       'div',
//       { class: 'range-values' },
//       createElement(
//         'div',
//         { class: 'min-value' },
//         `${interestrateMinvalue}'%'`,
//       ),
//       createElement(
//         'div',
//         {
//           class: 'max-value',
//           style: 'float: right;',
//         },
//         `${interestrateMaxvalue}'%'`,
//       ),
//     ),
//   );

//   const tenureYearsDetail = createElement(
//     'div',
//     {},
//     createElement(
//       'div',
//       { class: 'detail' },
//       createElement(
//         'div',
//         { style: 'color:#b3b3b3' },
//         tenureTitleYear,
//       ),
//       createElement(
//         'div',
//         { class: 'inputDetail' },
//         createElement(
//           'span',
//           { class: 'yearSpan' },
//           'Yrs.',
//         ),
//         createElement(
//           'input',
//           {
//             id: 'loan-period-text',
//             type: 'number',
//             min: tenureMinYearvalue,
//             max: tenureMaxYearvalue,
//             step: '1',
//             style: 'color:#b3b3b3',
//           },
//         ),
//       ),
//     ),
//     createElement(
//       'input',
//       {
//         type: 'range',
//         id: 'loan-period',
//         min: tenureMinYearvalue,
//         max: tenureMaxYearvalue,
//         step: '1',
//       },
//     ),
//     createElement(
//       'div',
//       { class: 'range-values' },
//       createElement(
//         'div',
//         { class: 'min-value' },
//         `${tenureMinYearvalue} Year`,
//       ),
//       createElement(
//         'div',
//         {
//           class: 'max-value',
//           style: 'float: right;',
//         },
//         `${tenureMaxYearvalue} Year`,
//       ),
//     ),
//   );

//   const tenureMonthsDetail = createElement(
//     'div',
//     {},
//     createElement(
//       'div',
//       { class: 'detail' },
//       createElement(
//         'div',
//         { style: 'color:#b3b3b3' },
//         tenureTitleMonths,
//       ),
//       createElement(
//         'div',
//         { class: 'inputDetail' },
//         createElement(
//           'span',
//           {
//             class: 'monthSpan',
//           },
//           'Mos.',
//         ),
//         createElement(
//           'input',
//           {
//             id: 'loan-period-month-text',
//             type: 'number',
//             min: tenureMinMonthvalue,
//             max: tenureMaxMonthvalue,
//             step: '1',
//             style: 'color:#b3b3b3',
//           },
//         ),
//       ),
//     ),
//     createElement(
//       'input',
//       {
//         type: 'range',
//         id: 'loan-period-month',
//         min: tenureMinMonthvalue,
//         max: tenureMaxMonthvalue,
//         step: '1',
//       },
//     ),
//     createElement(
//       'div',
//       { class: 'range-values' },
//       createElement(
//         'div',
//         { class: 'min-value' },
//         `${tenureMinMonthvalue} Month`,
//       ),
//       createElement(
//         'div',
//         {
//           class: 'max-value', style: 'float: right;',
//         },
//         `${tenureMaxMonthvalue} Month`,
//       ),
//     ),
//   );

//   const details = createElement(
//     'div',
//     { class: 'details' },
//     amountDetail,
//     interestDetail,
//     tenureYearsDetail,
//     tenureMonthsDetail,
//   );

//   const footer = createElement(
//     'div',
//     { class: 'footer' },
//     createElement(
//       'div',
//       { style: 'chart-detail' },
//       createElement(
//         'div',
//         { id: 'price-container-emi' },
//         'Your Monthly Emi',
//         createElement('p', { id: 'price' }, '0'),
//       ),
//     ),
//   );

//   const view = createElement(
//     'div',
//     { class: 'view' },
//     details,
//     footer,
//   );

//   const breakup = createElement(
//     'div',
//     { class: 'breakup' },
//     createElement(
//       'canvas',
//       { id: 'pieChart' },
//     ),
//   );

//   const subContainer = createElement(
//     'div',
//     { class: 'sub-container' },
//     view,
//     breakup,
//   );

//   const loanDetails = createElement(
//     'div',
//     { class: 'loan-details' },
//     createElement(
//       'div',
//       { class: 'chart-details' },
//       createElement('p', { style: 'color: #9088D2' }, 'Principal'),
//       createElement('p', { id: 'cp', style: 'color: #130F31; font-size: 17px;' }),
//     ),
//     createElement(
//       'div',
//       { class: 'chart-details' },
//       createElement('p', { style: 'color: #9088D2' }, 'Interest'),
//       createElement('p', { id: 'ci', style: 'color: #130F31; font-size: 17px;' }),
//     ),
//     createElement(
//       'div',
//       { class: 'chart-details' },
//       createElement('p', { style: 'color: #9088D2' }, 'Total Payable'),
//       createElement('p', { id: 'ct', style: 'color: #130F31; font-size: 17px;' }),
//     ),
//   );
//   loanDetails.appendChild(footer);

//   container.append(header, subContainer, loanDetails);

//   let P;
//   let R;
//   let N;
//   let M;
//   let pie;
//   let line;

//   const loanAmtSlider = document.getElementById('loan-amount');
//   const loanAmtText = document.getElementById('loan-amt-text');
//   const intRateSlider = document.getElementById('interest-rate');
//   const intRateText = document.getElementById('interest-rate-text');
//   const loanPeriodSlider = document.getElementById('loan-period');
//   const loanPeriodText = document.getElementById('loan-period-text');
//   const loanPeriodSliderMonth = document.getElementById('loan-period-month');
//   const loanPeriodTextMonth = document.getElementById('loan-period-month-text');

//   function calculateLoanDetails(initialPrincipal, r, emi, n, m) {
//     let p = initialPrincipal;
//     let totalInterest = 0;
//     const yearlyInterest = [];
//     const yearPrincipal = [];
//     const years = [];
//     let year = 1;
//     let [counter, principal, interest] = [0, 0, 0];
//     const totalMonths = n * 12 + m;
//     for (let i = 0; i < totalMonths; i += 1) {
//       const monthlyInterest = p * r;
//       p -= (emi - monthlyInterest);
//       totalInterest += monthlyInterest;
//       principal += emi - monthlyInterest;
//       interest += monthlyInterest;
//       counter += 1;
//       if (counter === 12) {
//         years.push(year);
//         year += 1;
//         yearlyInterest.push(parseInt(interest, 10));
//         yearPrincipal.push(parseInt(principal, 10));
//         counter = 0;
//       }
//     }
//     line.data.datasets[0].data = yearPrincipal;
//     line.data.datasets[1].data = yearlyInterest;
//     line.data.labels = years;
//     return totalInterest;
//   }
//   function displayDetails() {
//     const r = parseFloat(R) / 1200;
//     const n = parseFloat(N);
//     const m = parseFloat(M);
//     const totalMonths = n * 12 + m;

//     const num = P * r * (1 + r) ** totalMonths;
//     const denom = (1 + r) ** totalMonths - 1;
//     const emi = num / denom;

//     const payableInterest = calculateLoanDetails(P, r, emi, n, m);

//     const opts = { style: 'currency', currency: 'INR' };

//     document.querySelector('#cp').innerText = P.toLocaleString('en-IN', opts);
//     document.querySelector('#ci').innerText = payableInterest.toLocaleString('en-IN', opts);
//     document.querySelector('#ct').innerText
//     = (P + payableInterest).toLocaleString('en-IN', opts);
//     document.querySelector('#price').innerText = emi.toLocaleString('en-IN', opts);

//     pie.data.datasets[0].data[0] = P;
//     pie.data.datasets[0].data[1] = payableInterest;
//     pie.update();
//     line.update();
//   }

//   loanAmtSlider.addEventListener('change', (self) => {
//     loanAmtText.value = self.target.value;
//     P = parseFloat(self.target.value);
//     displayDetails();
//   });

//   loanAmtText.addEventListener('blur', (self) => {
//     loanAmtSlider.value = self.target.value;
//     P = parseFloat(self.target.value);
//     displayDetails();
//   });

//   intRateSlider.addEventListener('change', (self) => {
//     intRateText.value = self.target.value;
//     R = parseFloat(self.target.value);
//     displayDetails();
//   });

//   intRateText.addEventListener('blur', (self) => {
//     intRateSlider.value = self.target.value;
//     R = parseFloat(self.target.value);
//     displayDetails();
//   });

//   loanPeriodSlider.addEventListener('change', (self) => {
//     loanPeriodText.value = self.target.value;
//     N = parseFloat(self.target.value);
//     displayDetails();
//   });

//   loanPeriodText.addEventListener('blur', (self) => {
//     loanPeriodSlider.value = self.target.value;
//     N = parseFloat(self.target.value);
//     displayDetails();
//   });

//   loanPeriodSliderMonth.addEventListener('change', (self) => {
//     loanPeriodTextMonth.value = self.target.value;
//     M = parseFloat(self.target.value);
//     displayDetails();
//   });

//   loanPeriodTextMonth.addEventListener('blur', (self) => {
//     loanPeriodSliderMonth.value = self.target.value;
//     M = parseFloat(self.target.value);
//     displayDetails();
//   });

//   //  error message
//   function createErrorSpan(message) {
//     return createElement('span', { class: 'error-message', style: 'color: red; display: none;' }, message);
//   }

//   // Error message spans
//   const loanAmtError = createErrorSpan(
//   `Value should be between ${loanAmountMinValue} and ${loanAmountMaxValue}`);
//   const interestRateError = createErrorSpan(
//   `Value should be between ${interestrateMinvalue} % and ${interestrateMaxvalue}%`);
//   const loanPeriodError = createErrorSpan(
//   `Value should be between ${tenureMinYearvalue} and ${tenureMaxYearvalue}`);
//   const loanPeriodMonthError = createErrorSpan(
//   `Value should be between ${tenureMinMonthvalue} and ${tenureMaxMonthvalue}`);

//   // Append error message spans to their respective input containers
//   amountDetail.appendChild(loanAmtError);
//   interestDetail.appendChild(interestRateError);
//   tenureYearsDetail.appendChild(loanPeriodError);
//   tenureMonthsDetail.appendChild(loanPeriodMonthError);

//   // Event listeners for input elements to validate input values

//   //  error for loan amount
//   loanAmtText.addEventListener('input', function handleLoanAmountInput() {
//     if (parseFloat(this.value) < parseFloat(loanAmountMinValue)
//       || parseFloat(this.value) > parseFloat(loanAmountMaxValue)) {
//       loanAmtError.style.display = 'block';
//     } else {
//       loanAmtError.style.display = 'none';
//     }
//   });

//   //  error for loan amount
//   intRateText.addEventListener('input', function handleInterestRateInput() {
//     if (parseFloat(this.value) < parseFloat(interestrateMinvalue)
//       || parseFloat(this.value) > parseFloat(interestrateMaxvalue)) {
//       interestRateError.style.display = 'block';
//     } else {
//       interestRateError.style.display = 'none';
//     }
//   });

//   //  error for year
//   loanPeriodText.addEventListener('input', function handleYearInput() {
//     if (parseFloat(this.value) < parseFloat(tenureMinYearvalue)
//       || parseFloat(this.value) > parseFloat(tenureMaxYearvalue)) {
//       loanPeriodError.style.display = 'block';
//     } else {
//       loanPeriodError.style.display = 'none';
//     }
//   });

//   //  error for month
//   loanPeriodTextMonth.addEventListener('input', function handleMonthInput() {
//     if (parseFloat(this.value) < parseFloat(tenureMinMonthvalue)
//       || parseFloat(this.value) > parseFloat(tenureMaxMonthvalue)) {
//       loanPeriodMonthError.style.display = 'block';
//     } else {
//       loanPeriodMonthError.style.display = 'none';
//     }
//   });

//   function initialize() {
//     loanAmtSlider.value = loanAmountMinValue;
//     loanAmtText.value = loanAmountMinValue;
//     P = parseFloat(loanAmountMinValue);

//     intRateSlider.value = interestrateMinvalue;
//     intRateText.value = interestrateMinvalue;
//     R = parseFloat(interestrateMinvalue);

//     loanPeriodSlider.value = tenureMinYearvalue;
//     loanPeriodText.value = tenureMinYearvalue;
//     N = parseFloat(tenureMinYearvalue);

//     loanPeriodSliderMonth.value = tenureMinMonthvalue;
//     loanPeriodTextMonth.value = tenureMinMonthvalue;
//     M = parseFloat(tenureMinMonthvalue);

//     line = new Chart(document.getElementById('lineChart'), {
//       data: {
//         labels: [],
//         datasets: [
//           {
//             label: 'Principal',
//             backgroundColor: 'rgba(140, 177, 51)',
//             borderColor: 'rgba(140, 177, 51)',
//             data: [],
//           },
//           {
//             label: 'Interest',
//             backgroundColor: 'rgb(54, 162, 235)',
//             borderColor: 'rgb(54, 162, 235)',
//             data: [],
//           },
//         ],
//       },
//       type: 'line',
//       options: {
//         scales: {
//           y: {
//             ticks: {
//               callback(val) {
//                 return val.toLocaleString('en-IN', {
//                   style: 'currency',
//                   currency: 'INR',
//                 });
//               },
//             },
//           },
//         },
//       },
//     });

//     pie = new Chart(document.getElementById('pieChart'), {
//       type: 'doughnut',
//       data: {
//         labels: ['Principal', 'Interest'],
//         datasets: [
//           {
//             data: [P, 0],
//             backgroundColor: ['rgba(140, 177, 51)', 'rgb(59, 59, 59)'],
//             hoverOffset: 4,
//           },
//         ],
//       },
//     });

//     displayDetails();
//   }

//   initialize();
// }

export default async function decorate() {
  const container = document.querySelector('.emicalculator-container');

  function createElement(type, attributes = {}, ...children) {
    const element = document.createElement(type);
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
    for (const child of children) {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    }
    return element;
  }

  // const header = createElement('div', { class: 'header' },
  //     createElement('h1', {}, 'Loan Calculator'),
  //     createElement('button', {},
  //         createElement('i', { class: 'bi bi-list' })
  //     )
  // );

  // Get the meta value from the meta tag
  // function getMetaContentByName(name) {
  //     const metaTag = document.querySelector(`meta[name="${name}"]`);
  //     return metaTag ? metaTag.getAttribute('content') : null;
  // }

  function getDataAttributeValueByName(name) {
    const element = document.querySelector(`[data-${name}]`);
    return element ? element.getAttribute(`data-${name}`) : null;
  }

  const loanAmountMaxValue = getDataAttributeValueByName('laonamount-maxvalue');
  const loanAmountMinValue = getDataAttributeValueByName('laonamount-minvalue');
  const laonamount_title = getDataAttributeValueByName('laonamount-title');
  const interestrate_maxvalue = getDataAttributeValueByName('interestrate-maxvalue');
  const interestrate_minvalue = getDataAttributeValueByName('interestrate-minvalue');
  const interestrate_title = getDataAttributeValueByName('interestrate-title');
  const tenure_title_year = getDataAttributeValueByName('tenure-title-year');
  const tenure_min_yearvalue = getDataAttributeValueByName('tenure-min-yearvalue');
  const tenure_max_yearvalue = getDataAttributeValueByName('tenure-max-yearvalue');
  const tenure_title_months = getDataAttributeValueByName('tenure-title-months');
  const tenure_min_monthvalue = getDataAttributeValueByName('tenure-min-monthvalue');
  const tenure_max_monthvalue = getDataAttributeValueByName('tenure-max-monthvalue');

  const amountDetail = createElement(
    'div',
    {},
    createElement(
      'div',
      { class: 'detail' },
      createElement('p', { style: 'color: #3b3b3b' }, laonamount_title),
      createElement(
        'div',
        { class: 'inputDetail' },
        createElement('span', { class: 'rupeeSpan' }, 'Rs'),
        createElement('input', {
          id: 'loan-amt-text', type: 'number', min: loanAmountMinValue, max: loanAmountMaxValue, step: '50000', style: 'color: #b3b3b3',
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

  const interestDetail = createElement(
    'div',
    {},
    createElement(
      'div',
      { class: 'detail' },
      createElement('p', { style: 'color: #3b3b3b' }, interestrate_title),
      createElement(
        'div',
        { class: 'inputDetail' },
        createElement('span', { class: 'percentSpan' }, '%'),
        createElement('input', {
          id: 'interest-rate-text', type: 'number', min: interestrate_minvalue, max: interestrate_maxvalue, step: '0.5', style: 'color: #b3b3b3',
        }),
      ),
    ),
    createElement('input', {
      type: 'range', id: 'interest-rate', min: interestrate_minvalue, max: interestrate_maxvalue, step: '0.5',
    }),
    createElement(
      'div',
      { class: 'range-values' },
      createElement('p', { class: 'min-value' }, `${interestrate_minvalue}%`),
      createElement('p', { class: 'max-value', style: 'float: right;' }, `${interestrate_maxvalue}%`),
    ),
  );

  const tenureYearsDetail = createElement(
    'div',
    {},
    createElement(
      'div',
      { class: 'detail' },
      createElement('p', { style: 'color: #3b3b3b' }, tenure_title_year),
      createElement(
        'div',
        { class: 'inputDetail' },
        createElement('span', { class: 'yearSpan' }, 'Yrs.'),
        createElement('input', {
          id: 'loan-period-text', type: 'number', min: tenure_min_yearvalue, max: tenure_max_yearvalue, step: '1', style: 'color: #b3b3b3',
        }),
      ),
    ),
    createElement('input', {
      type: 'range', id: 'loan-period', min: tenure_min_yearvalue, max: tenure_max_yearvalue, step: '1',
    }),
    createElement(
      'div',
      { class: 'range-values' },
      createElement('div', { class: 'min-value' }, `${tenure_min_yearvalue} Year`),
      createElement('div', { class: 'max-value', style: 'float: right;' }, `${tenure_max_yearvalue} Year`),
    ),
  );

  const tenureMonthsDetail = createElement(
    'div',
    {},
    createElement(
      'div',
      { class: 'detail' },
      createElement('div', { style: 'color: #3b3b3b' }, tenure_title_months),
      createElement(
        'div',
        { class: 'inputDetail' },
        createElement('span', { class: 'monthSpan' }, 'Mos.'),
        createElement('input', {
          id: 'loan-period-month-text', type: 'number', min: tenure_min_monthvalue, max: tenure_max_monthvalue, step: '1', style: 'color: #b3b3b3',
        }),
      ),
    ),
    createElement('input', {
      type: 'range', id: 'loan-period-month', min: tenure_min_monthvalue, max: tenure_max_monthvalue, step: '1',
    }),
    createElement(
      'div',
      { class: 'range-values' },
      createElement('div', { class: 'min-value' }, `${tenure_min_monthvalue} Month`),
      createElement('div', { class: 'max-value', style: 'float: right;' }, `${tenure_max_monthvalue} Month`),
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
      { style: 'chart-details' },
      createElement(
        'div',
        { id: 'price-container-emi', style: 'color:#3b3b3b' },
        'Your Monthly Emi',
        createElement('div', { id: 'price' }, '0'),
      ),
    ),
  );

  const view = createElement('div', { class: 'view' }, details);

  const breakup = createElement(
    'div',
    { class: 'breakup' },
    createElement(
      'div',
      { class: 'chartDetails' },
      createElement('canvas', { id: 'pieChart' }),
      createElement(
        'div',
        { id: 'canvasItems' },
        createElement(
          'div',
          { class: 'intrest' },
          createElement('div', { style: 'color: #3b3b3b' }, 'Intrest Rate'),
          createElement('div', { id: 'rate' }),
        ),
        createElement(
          'div',
          { class: 'tenure' },
          createElement('div', { style: 'color: #3b3b3b' }, 'Total Tenure'),
          createElement('span', { id: 'yearTenure' }),
          'Y',
          ' | ',
          createElement('span', { id: 'monthTenure' }),
          'M',
        ),
      ),
    ),
  );

  const loanDetailsUpper = createElement(
    'div',
    { class: 'loan-details-upper' },
    createElement(
      'div',
      { class: 'chart-details' },
      createElement('div', { style: 'color: #3b3b3b' }, 'Principal'),
      createElement('div', { id: 'cp', style: 'color: #3B3B3B; font-size: 17px;' }),
    ),
    createElement(
      'div',
      { class: 'chart-details' },
      createElement('div', { style: 'color: #3b3b3b' }, 'Interest'),
      createElement('div', { id: 'ci', style: 'color: #3B3B3B; font-size: 17px;' }),
    ),
  );

  const loanDetails = createElement(
    'div',
    { class: 'loan-details' },
    createElement(
      'div',
      { class: 'chart-details' },
      createElement('div', { style: 'color: #3b3b3b' }, 'Total Amount Payable'),
      createElement('div', { id: 'ct' }),
    ),
    footer,
    createElement(
      'div',
      { class: 'chart-details' },
      createElement('button', { id: 'apply-btn' }, 'Apply Now'),
    ),
  );

  const subContainer = createElement('div', { class: 'sub-container' }, view, breakup);
  breakup.append(loanDetailsUpper, loanDetails);

  container.append(subContainer);

  let P; let R; let N; let M; let pie; let
    line;
  const loan_amt_slider = document.getElementById('loan-amount');
  const loan_amt_text = document.getElementById('loan-amt-text');
  const int_rate_slider = document.getElementById('interest-rate');
  const int_rate_text = document.getElementById('interest-rate-text');
  const loan_period_slider = document.getElementById('loan-period');
  const loan_period_text = document.getElementById('loan-period-text');
  const loan_period_slider_month = document.getElementById('loan-period-month');
  const loan_period_text_month = document.getElementById('loan-period-month-text');

  loan_amt_slider.addEventListener('change', (self) => {
    loan_amt_text.value = self.target.value;
    P = parseFloat(self.target.value);
    displayDetails();
  });

  loan_amt_text.addEventListener('blur', (self) => {
    loan_amt_slider.value = self.target.value;
    P = parseFloat(self.target.value);
    displayDetails();
  });

  int_rate_slider.addEventListener('change', (self) => {
    int_rate_text.value = self.target.value;
    R = parseFloat(self.target.value);
    displayDetails();
  });

  int_rate_text.addEventListener('blur', (self) => {
    int_rate_slider.value = self.target.value;
    R = parseFloat(self.target.value);
    displayDetails();
  });

  loan_period_slider.addEventListener('change', (self) => {
    loan_period_text.value = self.target.value;
    N = parseFloat(self.target.value);
    displayDetails();
  });

  loan_period_text.addEventListener('blur', (self) => {
    loan_period_slider.value = self.target.value;
    N = parseFloat(self.target.value);
    displayDetails();
  });

  loan_period_slider_month.addEventListener('change', (self) => {
    loan_period_text_month.value = self.target.value;
    M = parseFloat(self.target.value);
    displayDetails();
  });

  loan_period_text_month.addEventListener('blur', (self) => {
    loan_period_slider_month.value = self.target.value;
    M = parseFloat(self.target.value);
    displayDetails();
  });

  // error message
  function createErrorSpan(message) {
    return createElement('span', { class: 'error-message', style: 'color: red; display: none;' }, message);
  }

  // Error message spans
  const loanAmtError = createErrorSpan(`Value should be between ${loanAmountMinValue} and ${loanAmountMaxValue}`);
  const interestRateError = createErrorSpan(`Value should be between ${interestrate_minvalue}% and ${interestrate_maxvalue}%`);
  const loanPeriodError = createErrorSpan(`Value should be between ${tenure_min_yearvalue} and ${tenure_max_yearvalue}`);
  const loanPeriodMonthError = createErrorSpan(`Value should be between ${tenure_min_monthvalue} and ${tenure_max_monthvalue}`);

  // Append error message spans to their respective input containers
  amountDetail.appendChild(loanAmtError);
  interestDetail.appendChild(interestRateError);
  tenureYearsDetail.appendChild(loanPeriodError);
  tenureMonthsDetail.appendChild(loanPeriodMonthError);

  // Event listeners for input elements to validate input values

  // error for loan amount
  loan_amt_text.addEventListener('input', function () {
    if (parseFloat(this.value) < parseFloat(loanAmountMinValue) || parseFloat(this.value) > parseFloat(loanAmountMaxValue)) {
      loanAmtError.style.display = 'block';
    } else {
      loanAmtError.style.display = 'none';
    }
  });

  // error for loan amount
  int_rate_text.addEventListener('input', function () {
    if (parseFloat(this.value) < parseFloat(interestrate_minvalue) || parseFloat(this.value) > parseFloat(interestrate_maxvalue)) {
      interestRateError.style.display = 'block';
    } else {
      interestRateError.style.display = 'none';
    }
  });

  // error for year
  loan_period_text.addEventListener('input', function () {
    if (parseFloat(this.value) < parseFloat(tenure_min_yearvalue) || parseFloat(this.value) > parseFloat(tenure_max_yearvalue)) {
      loanPeriodError.style.display = 'block';
    } else {
      loanPeriodError.style.display = 'none';
    }
  });

  // error for month
  loan_period_text_month.addEventListener('input', function () {
    if (parseFloat(this.value) < parseFloat(tenure_min_monthvalue) || parseFloat(this.value) > parseFloat(tenure_max_monthvalue)) {
      loanPeriodMonthError.style.display = 'block';
    } else {
      loanPeriodMonthError.style.display = 'none';
    }
  });

  function calculateLoanDetails(p, r, emi, n, m) {
    let totalInterest = 0;
    const yearlyInterest = [];
    const yearPrincipal = [];
    const years = [];
    let year = 1;
    let [counter, principal, interest] = [0, 0, 0];
    const totalMonths = n * 12 + m;
    for (let i = 0; i < totalMonths; i++) {
      const monthlyInterest = p * r;
      p -= (emi - monthlyInterest);
      totalInterest += monthlyInterest;
      principal += emi - monthlyInterest;
      interest += monthlyInterest;
      if (++counter == 12) {
        years.push(year++);
        yearlyInterest.push(parseInt(interest));
        yearPrincipal.push(parseInt(principal));
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

    document.querySelector('#rate').innerText = R.toLocaleString('en-IN', R);

    document.querySelector('#monthTenure').innerText = M.toLocaleString('en-IN', `${M}M`);

    document.querySelector('#yearTenure').innerText = N.toLocaleString('en-IN', `${N}Y`);

    pie.data.datasets[0].data[0] = P;
    pie.data.datasets[0].data[1] = payableInterest;
    pie.update();
    line.update();
  }

  function initialize() {
    loan_amt_slider.value = loanAmountMinValue;
    loan_amt_text.value = loanAmountMinValue;
    P = parseFloat(loanAmountMinValue);

    int_rate_slider.value = interestrate_minvalue;
    int_rate_text.value = interestrate_minvalue;
    R = parseFloat(interestrate_minvalue);

    loan_period_slider.value = tenure_min_yearvalue;
    loan_period_text.value = tenure_min_yearvalue;
    N = parseFloat(tenure_min_yearvalue);

    loan_period_slider_month.value = tenure_min_monthvalue;
    loan_period_text_month.value = tenure_min_monthvalue;
    M = parseFloat(tenure_min_monthvalue);

    line = new Chart(document.getElementById('lineChart'), {
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

    pie = new Chart(document.getElementById('pieChart'), {
      type: 'doughnut',
      data: {
        labels: ['Principal', 'Interest'],
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
