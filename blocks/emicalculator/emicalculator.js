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

function removeCommaAndConvertToInt(numberString) {
  // Remove commas from the number string
  const cleanedString = numberString.replace(/,/g, '');

  // Convert the cleaned string to an integer
  const numberInt = parseInt(cleanedString, 10);

  return numberInt;
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
function getDataAttributeValueByName(name) {
  const element = document.querySelector(`[data-${name}]`);
  return element ? element.getAttribute(`data-${name}`) : '';
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

//  error message
function createErrorSpan(message) {
  return createElement('span', { class: 'error-message', style: 'color: red; display: none;' }, message);
}

function calculateLoanDetails(P, emi, n, m) {
  const totalMonths = n * 12 + m;
  const totalPayment = emi * totalMonths;
  const totalInterest = totalPayment - P;

  return totalInterest;
}

function displayDetails(P, R, N, M, pie, block) {
  const r = parseFloat(R) / 1200;
  const n = parseFloat(N);
  const m = parseFloat(M);
  const totalMonths = n * 12 + m;

  const num = P * r * (1 + r) ** totalMonths;
  const denom = (1 + r) ** totalMonths - 1;
  const emi = Math.round(num / denom);
  const payableInterest = Math.round(calculateLoanDetails(P, emi, n, m));

  const opts = { style: 'currency', currency: 'INR', maximumFractionDigits: 0 };

  block.querySelector('#cp').innerText = P.toLocaleString('en-IN', opts);
  block.querySelector('#ci').innerText = payableInterest.toLocaleString('en-IN', opts);
  block.querySelector('#tenure-interest').innerText = payableInterest.toLocaleString('en-IN', opts);
  block.querySelector('#ct').innerText = (P + payableInterest).toLocaleString('en-IN', opts);
  block.querySelector('#tenure-amount').innerText = (P + payableInterest).toLocaleString('en-IN', opts);
  block.querySelector('#price').innerText = emi.toLocaleString('en-IN', opts);
  block.querySelector('#tenure-price').innerText = emi.toLocaleString('en-IN', opts);
  block.querySelector('#rate').innerText = `${R.toLocaleString('en-IN', R)} %`;
  block.querySelector('#tenure-rate').innerText = `@ ${R.toLocaleString('en-IN', R)}%`;
  block.querySelector('#monthTenure').innerText = m.toLocaleString('en-IN', m);
  block.querySelector('#mobile-monthTenure').innerText = m.toLocaleString('en-IN', m);
  block.querySelector('#yearTenure').innerText = `${n.toLocaleString('en-IN', n)}`;
  block.querySelector('#mobile-yearTenure').innerText = n.toLocaleString('en-IN', n);

  pie.data.datasets[0].data[0] = P;
  pie.data.datasets[0].data[1] = payableInterest;
  pie.update();
  // line.update(); // Uncomment if you want to update the line chart
}

function initialize(block) {
  const loanAmountMaxValue = getDataAttributeValueByName('loan-amount-max-value');
  const loanAmountMinValue = getDataAttributeValueByName('loan-amount-min-value');
  const laonamountTitle = getDataAttributeValueByName('loan-amount-title');
  const interestrateMaxValue = getDataAttributeValueByName('interest-rate-max-value');
  const interestrateMinValue = getDataAttributeValueByName('interest-rate-min-value');
  const interestrateTitle = getDataAttributeValueByName('Interest-rate-title');
  const tenureTitleYear = getDataAttributeValueByName('tenure-title-year');
  const tenureMinYearvalue = getDataAttributeValueByName('tenure-min-year-value');
  const tenureMaxYearvalue = getDataAttributeValueByName('tenure-max-year-value');
  const tenureTitleMonths = getDataAttributeValueByName('tenure-title-months');
  const tenureMinMonthValue = getDataAttributeValueByName('tenure-min-month-value');
  const tenureMaxMonthValue = getDataAttributeValueByName('tenure-max-month-value');
  const principalAmountLabel = getDataAttributeValueByName('principal-amount-label');
  const interestPayableLabel = getDataAttributeValueByName('Interest-payable-label');
  const totalAmountPayableLabel = getDataAttributeValueByName('total-amount-payable-label');
  const interestRateLabel = getDataAttributeValueByName('interest-rate-label');
  const totalTenureLabel = getDataAttributeValueByName('total-tenure-label');
  const applyNowLabel = getDataAttributeValueByName('apply-now-label');
  const monthlyEmiLabel = getDataAttributeValueByName('monthly-emi-label');
  const redirectionApplyPath = getDataAttributeValueByName('redirection-path-emi');
  const applyRedirectionPath = redirectionApplyPath.split('?')[0];
  const amountDetail = createElement(
    'div',
    {},
    createElement(
      'div',
      { class: 'detail' },
      createElement(
        'div',
        { class: 'title' },
        laonamountTitle,
      ),
      createElement(
        'div',
        { class: 'inputDetail' },
        createElement(
          'span',
          { class: 'rupeeSpan' },
          'Rs.',
        ),
        createElement(
          'input',
          {
            id: 'loan-amt-text',
            type: 'text',
            min: loanAmountMinValue,
            max: loanAmountMaxValue,
            style: 'color: #3b3b3b; font-size:14px;font-weight:400',
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
      },
    ),
    createElement(
      'div',
      { class: 'range-values' },
      createElement(
        'div',
        { class: 'min-value' },
        numberToWords(loanAmountMinValue),
      ),
      createElement(
        'div',
        { class: 'max-value', style: 'float: right;' },
        numberToWords(loanAmountMaxValue),
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
        'div',
        { class: 'title' },
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
            min: interestrateMinValue,
            max: interestrateMaxValue,
            step: '0.5',
            style: 'color: #3b3b3b; font-size:14px;font-weight:400',
          },
        ),
      ),
    ),
    createElement(
      'input',
      {
        type: 'range',
        id: 'interest-rate',
        min: interestrateMinValue,
        max: interestrateMaxValue,
        step: '0.5',
      },
    ),
    createElement(
      'div',
      { class: 'range-values' },
      createElement(
        'div',
        { class: 'min-value' },
        `${interestrateMinValue} %`,
      ),
      createElement(
        'div',
        { class: 'max-value', style: 'float: right;' },
        `${interestrateMaxValue} %`,
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
        'div',
        { class: 'title' },
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
            style: 'color: #3b3b3b; font-size:14px;font-weight:400',
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
      },
    ),
    createElement(
      'div',
      { class: 'range-values' },
      createElement(
        'div',
        { class: 'min-value' },
        `${tenureMinYearvalue} Year`,
      ),
      createElement(
        'div',
        { class: 'max-value', style: 'float: right;' },
        `${tenureMaxYearvalue} Years`,
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
        'div',
        { class: 'title' },
        tenureTitleMonths,
      ),
      createElement(
        'div',
        { class: 'inputDetail' },
        createElement(
          'span',
          { class: 'monthSpan' },
          'Mos.',
        ),
        createElement(
          'input',
          {
            id: 'loan-period-month-text',
            type: 'number',
            min: tenureMinMonthValue,
            max: tenureMaxMonthValue,
            style: 'color: #3b3b3b; font-size:14px;font-weight:400',
          },
        ),
      ),
    ),
    createElement(
      'input',
      {
        type: 'range',
        id: 'loan-period-month',
        min: tenureMinMonthValue,
        max: tenureMaxMonthValue,
      },
    ),
    createElement(
      'div',
      { class: 'range-values' },
      createElement(
        'div',
        { class: 'min-value' },
        `${tenureMinMonthValue} Month`,
      ),
      createElement(
        'div',
        { class: 'max-value', style: 'float: right;' },
        `${tenureMaxMonthValue} Months`,
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
      { style: 'chart-details' },
      createElement(
        'div',
        { id: 'price-container-emi', style: 'color:#3b3b3b' },
        monthlyEmiLabel,
        createElement(
          'div',
          { id: 'price' },
          '0',
        ),
      ),
    ),
  );

  const view = createElement(
    'div',
    { class: 'view' },
    details,
  );

  const loanDetailsUpper = createElement(
    'div',
    { class: 'loan-details-upper' },
    createElement(
      'div',
      { class: 'chart-details' },
      createElement(
        'div',
        { class: 'chart-detail-adjust' },
        createElement(
          'span',
          { class: 'details-span-principal' },
          ' ',
        ),
        createElement(
          'div',
          { class: 'detailsloan', style: 'color: #000000; font-size: 16px; font-weight:400;margin-left:10px;' },
          principalAmountLabel,
        ),
      ),

      createElement(
        'div',
        { id: 'cp', style: 'color: #3B3B3B; font-size: 24px; font-weight:400;' },
      ),
    ),
    createElement(
      'div',
      { class: 'chart-details' },
      createElement(
        'div',
        { class: 'chart-detail-adjust' },
        createElement(
          'span',
          { class: 'details-span-interest' },
          '',
        ),
        createElement(
          'div',
          { class: 'detailsloan', style: 'color: #000000; font-size: 16px; font-weight:400;margin-left:10px;' },
          interestPayableLabel,
        ),
      ),
      createElement(
        'div',
        { id: 'ci', style: 'color: #3B3B3B; font-size: 24px; font-weight:400;' },
      ),
    ),
  );

  const breakup = createElement(
    'div',
    { class: 'breakupdesktop' },
    createElement(
      'div',
      { class: 'chartDetails' },
      createElement(
        'div',
        { class: 'canvasDetail' },
        createElement(
          'canvas',
          { id: 'pieChart' },
        ),
        createElement(
          'div',
          { id: 'canvasItems' },
          createElement(
            'div',
            { class: 'intrest' },
            createElement(
              'div',
              { style: 'color: #000;font-size:14px;font-weight:300;' },
              interestRateLabel,
            ),
            createElement(
              'div',
              { id: 'rate' },
            ),
          ),
          createElement(
            'div',
            { class: 'tenure' },
            createElement(
              'div',
              { style: 'color: #000;font-size:14px;font-weight:300;' },
              totalTenureLabel,
            ),
            createElement(
              'span',
              { id: 'yearTenure' },
            ),
            'Y',
            ' | ',
            createElement(
              'span',
              { id: 'monthTenure' },
            ),
            'M',
          ),
        ),
      ),
      loanDetailsUpper,
    ),
  );

  const loanDetails = createElement(
    'div',
    { class: 'loan-details' },
    createElement(
      'div',
      { class: 'chart-details' },
      createElement(
        'div',
        { style: 'color: #000000; font-size:16px;font-weight:400' },
        totalAmountPayableLabel,
      ),
      createElement(
        'div',
        { id: 'ct' },
      ),
    ),
    footer,
    createElement(
      'div',
      { class: 'chart-details' },
      createElement(
        'button',
        { id: 'apply-btn', 'data-path': redirectionApplyPath },
        applyNowLabel,
      ),
    ),

  );

  breakup.append(loanDetails);

  //  mobile breakup
  const mobileBreakup = createElement(
    'div',
    { class: 'mobile-breakup' },
    createElement(
      'div',
      { class: 'mobile-breakup-left' },
      createElement(
        'div',
        { class: 'tenure' },
        createElement(
          'div',
          { style: 'color: #111111;font-size:14px;font-weight:500;' },
          totalTenureLabel,
        ),
        createElement(
          'div',
          { class: 'mobile-tenure-monthYear' },
          createElement(
            'span',
            { id: 'mobile-yearTenure' },
          ),
          'Years',
          ' ',
          createElement(
            'span',
            { id: 'mobile-monthTenure' },
          ),
          'Months',
        ),
      ),
      createElement(
        'div',
        { class: 'mobile-tenure-amount' },
        createElement(
          'div',
          { class: 'mobile-tenure-amount-label' },
          totalAmountPayableLabel,
        ),
        createElement(
          'div',
          {
            id: 'tenure-amount',
            class: 'mobile-tenure-amount-detail',
          },
        ),
      ),
      createElement(
        'div',
        { class: 'mobile-tenure-interest' },
        createElement(
          'div',
          { class: 'mobile-tenure-interest-label' },
          interestPayableLabel,
        ),
        createElement(
          'div',
          {
            id: 'tenure-interest',
            style: 'color: #757575;font-size:12px;font-weight:400;',
          },
        ),
      ),
    ),
    createElement(
      'div',
      { class: 'mobile-breakup-right' },
      createElement(
        'div',
        { class: 'mobile-tenure-right' },
        createElement(
          'div',
          { class: 'mobile-tenure-emi' },
          createElement(
            'div',
            { class: 'mobile-tenure-emi-label' },
            monthlyEmiLabel,
          ),
          createElement(
            'div',
            { id: 'tenure-rate', class: 'mobile-tenure-interest-rate' },
          ),
        ),
        createElement(
          'div',
          { class: 'mobile-tenure-emi-details' },
          createElement(
            'h2',
            {
              id: 'tenure-price',
              class: 'mobile-tenure-emi-price',
            },
          ),
        ),
      ),
      createElement(
        'div',
        { class: 'mobile-tenure-apply' },
        createElement(
          'button',
          { id: 'apply-btn-mobile', 'data-path': redirectionApplyPath },
          applyNowLabel,
        ),
      ),
    ),
  );

  const subContainer = createElement('div', { class: 'sub-container' }, view, breakup, mobileBreakup);

  block.append(subContainer);
  let P;
  let R;
  let N;
  let M;
  let pie;
  // let line;

  const loanAmtSlider = block.querySelector('#loan-amount');
  const loanAmtText = block.querySelector('#loan-amt-text');
  const intRateSlider = block.querySelector('#interest-rate');
  const intRateText = block.querySelector('#interest-rate-text');
  const loanPeriodSlider = block.querySelector('#loan-period');
  const loanPeriodText = block.querySelector('#loan-period-text');
  const loanPeriodSliderMonth = block.querySelector('#loan-period-month');
  const loanPeriodTextMonth = block.querySelector('#loan-period-month-text');
  const desktopApplyButton = block.querySelector('#apply-btn');
  const mobileApplyButton = block.querySelector('#apply-btn-mobile');

  desktopApplyButton.addEventListener('click', () => {
    window.location.href = applyRedirectionPath;
  });
  mobileApplyButton.addEventListener('click', () => {
    window.location.href = applyRedirectionPath;
  });

  loanAmtSlider.addEventListener('change', function (self) {
    // loanAmtText.value = formatNumberWithCommas(self.target.value);
    loanAmtText.value = formatNumberToIndianCommas(self.target.value);
    P = removeCommaAndConvertToInt(self.target.value);
    const value = P;
    const maxValue = loanAmtSlider.max; // Get the maximum value of the range input
    const percentage = (value / maxValue) * 100;
    if (window.innerWidth <= 768) {
      this.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, #F4F4F4 ${percentage}%, #F4F4F4 100%)`;
    } else {
      this.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, white ${percentage}%, white 100%)`;
    }
    displayDetails(P, R, N, M, pie, block);
  });

  loanAmtText.addEventListener('blur', (self) => {
    if (self.target.value === '') {
      loanAmtSlider.value = loanAmtSlider.min;
      self.target.value = formatNumberToIndianCommas(loanAmtSlider.min);
    } else {
      loanAmtSlider.value = removeCommaAndConvertToInt(self.target.value);
      self.target.value = formatNumberToIndianCommas(self.target.value);
    }
    P = removeCommaAndConvertToInt(self.target.value);
    const value = P;
    const maxValue = loanAmtSlider.max; // Get the maximum value of the range input
    const percentage = (value / maxValue) * 100;
    // console.log(value);
    if (window.innerWidth <= 768) {
      loanAmtSlider.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, #F4F4F4 ${percentage}%, #F4F4F4 100%)`;
    } else {
      loanAmtSlider.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, white ${percentage}%, white 100%)`;
    }
    displayDetails(P, R, N, M, pie, block);
  });

  // Event listener to allow only numeric input
  loanAmtText.addEventListener('input', function () {
    let { value } = this;
    value = value.replace(/[^\d.]/g, ''); // Remove non-numeric characters except '.'
    this.value = value;
  });

  intRateSlider.addEventListener('change', function (self) {
    intRateText.value = self.target.value;
    R = parseFloat(self.target.value);
    const value = R;
    const percentage = (
      ((value - interestrateMinValue) / (interestrateMaxValue - interestrateMinValue))
      * 100
    );

    // Update the background gradient with the calculated percentage
    if (window.innerWidth <= 768) {
      this.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, #F4F4F4 ${percentage}%, #F4F4F4 100%)`;
    } else {
      this.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, white ${percentage}%, white 100%)`;
    }

    displayDetails(P, R, N, M, pie, block);
  });

  intRateText.addEventListener('blur', (self) => {
    if (self.target.value === '') {
      intRateSlider.value = intRateSlider.min;
      self.target.value = intRateSlider.min;
    } else {
      intRateSlider.value = self.target.value;
    }
    R = parseFloat(self.target.value);
    const value = R;
    const percentage = (
      ((value - interestrateMinValue) / (interestrateMaxValue - interestrateMinValue)) * 100
    );

    // Update the background gradient with the calculated percentage
    if (window.innerWidth <= 768) {
      intRateSlider.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, #F4F4F4 ${percentage}%, #F4F4F4 100%)`;
    } else {
      intRateSlider.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, white ${percentage}%, white 100%)`;
    }
    displayDetails(P, R, N, M, pie, block);
  });

  loanPeriodSlider.addEventListener('change', function (self) {
    loanPeriodText.value = self.target.value;
    N = parseFloat(self.target.value);
    if (N >= loanPeriodSlider.max) {
      loanPeriodTextMonth.disabled = true;
      loanPeriodSliderMonth.disabled = true;
      loanPeriodTextMonth.value = loanPeriodSliderMonth.min;
      loanPeriodSliderMonth.value = loanPeriodSliderMonth.min;

      const value = loanPeriodSliderMonth.min;
      const percentage = (
        ((value - tenureMinYearvalue) / (tenureMaxYearvalue - tenureMinYearvalue))
        * 100
      );

      // Update the background gradient with the calculated percentage
      if (window.innerWidth <= 768) {
        loanPeriodSliderMonth.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, #F4F4F4 ${percentage}%, #F4F4F4 100%)`;
      } else {
        loanPeriodSliderMonth.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, white ${percentage}%, white 100%)`;
      }
    } else {
      loanPeriodTextMonth.disabled = false;
      loanPeriodSliderMonth.disabled = false;
    }
    const value = N;
    const percentage = (
      ((value - tenureMinYearvalue) / (tenureMaxYearvalue - tenureMinYearvalue))
      * 100
    );

    // Update the background gradient with the calculated percentage
    if (window.innerWidth <= 768) {
      this.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, #F4F4F4 ${percentage}%, #F4F4F4 100%)`;
    } else {
      this.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, white ${percentage}%, white 100%)`;
    }
    displayDetails(P, R, N, M, pie, block);
  });

  loanPeriodText.addEventListener('blur', (self) => {
    if (self.target.value === '') {
      loanPeriodSlider.value = loanPeriodSlider.min;
      self.target.value = loanPeriodSlider.min;
    } else {
      loanPeriodSlider.value = self.target.value;
    }
    N = parseFloat(self.target.value);
    if (N >= loanPeriodSlider.max) {
      loanPeriodTextMonth.disabled = true;
      loanPeriodSliderMonth.disabled = true;
      loanPeriodTextMonth.value = loanPeriodSliderMonth.min;
      loanPeriodSliderMonth.value = loanPeriodSliderMonth.min;

      const value = loanPeriodSliderMonth.min;
      const percentage = (
        ((value - tenureMinYearvalue) / (tenureMaxYearvalue - tenureMinYearvalue))
        * 100
      );

      // Update the background gradient with the calculated percentage
      if (window.innerWidth <= 768) {
        loanPeriodSliderMonth.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, #F4F4F4 ${percentage}%, #F4F4F4 100%)`;
      } else {
        loanPeriodSliderMonth.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, white ${percentage}%, white 100%)`;
      }
    } else {
      loanPeriodTextMonth.disabled = false;
      loanPeriodSliderMonth.disabled = false;
    }
    const value = N;
    const percentage = (
      ((value - tenureMinYearvalue) / (tenureMaxYearvalue - tenureMinYearvalue))
      * 100
    );
    // Update the background gradient with the calculated percentage
    if (window.innerWidth <= 768) {
      loanPeriodSlider.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, #F4F4F4 ${percentage}%, #F4F4F4 100%)`;
    } else {
      loanPeriodSlider.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, white ${percentage}%, white 100%)`;
    }
    displayDetails(P, R, N, M, pie, block);
  });

  loanPeriodSliderMonth.addEventListener('change', function (self) {
    loanPeriodTextMonth.value = self.target.value;
    M = parseFloat(self.target.value);
    const value = M;
    const percentage = (
      ((value - tenureMinMonthValue) / (tenureMaxMonthValue - tenureMinMonthValue))
      * 100
    );

    // Update the background gradient with the calculated percentage
    if (window.innerWidth <= 768) {
      this.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, #F4F4F4 ${percentage}%, #F4F4F4 100%)`;
    } else {
      this.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, white ${percentage}%, white 100%)`;
    }
    displayDetails(P, R, N, M, pie, block);
  });

  loanPeriodTextMonth.addEventListener('blur', (self) => {
    if (self.target.value === '') {
      loanPeriodSliderMonth.value = loanPeriodSliderMonth.min;
      self.target.value = loanPeriodSliderMonth.min;
    } else {
      loanPeriodSliderMonth.value = self.target.value;
    }
    M = parseFloat(self.target.value);
    const value = M;
    const percentage = (
      ((value - tenureMinMonthValue) / (tenureMaxMonthValue - tenureMinMonthValue))
      * 100
    );
    // Update the background gradient with the calculated percentage
    if (window.innerWidth <= 768) {
      loanPeriodSliderMonth.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, #F4F4F4 ${percentage}%, #F4F4F4 100%)`;
    } else {
      loanPeriodSliderMonth.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, white ${percentage}%, white 100%)`;
    }
    displayDetails(P, R, N, M, pie, block);
  });

  // Error message spans
  const loanAmtError = createErrorSpan(`Value should be between ${formatNumberToIndianCommas(loanAmountMinValue)}  and  ${formatNumberToIndianCommas(loanAmountMaxValue)}`);
  const interestRateError = createErrorSpan(`Value should be between  ${interestrateMinValue} % and ${interestrateMaxValue} %`);
  const loanPeriodError = createErrorSpan(`Value should be between  ${tenureMinYearvalue} and  ${tenureMaxYearvalue}`);
  const loanPeriodMonthError = createErrorSpan(`Value should be between ${tenureMinMonthValue} and ${tenureMaxMonthValue}`);

  // Append error message spans to their respective input containers
  amountDetail.appendChild(loanAmtError);
  interestDetail.appendChild(interestRateError);
  tenureYearsDetail.appendChild(loanPeriodError);
  tenureMonthsDetail.appendChild(loanPeriodMonthError);

  // Event listeners for input elements to validate input values

  //  error for loan amount
  loanAmtText.addEventListener('input', function () {
    if (
      removeCommaAndConvertToInt(this.value) < removeCommaAndConvertToInt(loanAmountMinValue)
      || removeCommaAndConvertToInt(this.value) > removeCommaAndConvertToInt(loanAmountMaxValue)
    ) {
      loanAmtError.style.display = 'block';
    } else {
      loanAmtError.style.display = 'none';
    }
  });
  loanAmtSlider.addEventListener('input', function () {
    if (
      removeCommaAndConvertToInt(this.value) < removeCommaAndConvertToInt(loanAmountMinValue)
      || removeCommaAndConvertToInt(this.value) > removeCommaAndConvertToInt(loanAmountMaxValue)
    ) {
      loanAmtError.style.display = 'block';
    } else {
      loanAmtError.style.display = 'none';
    }
  });

  //  error for loan amount
  intRateText.addEventListener('input', function () {
    if (
      parseFloat(this.value) < parseFloat(interestrateMinValue)
      || parseFloat(this.value) > parseFloat(interestrateMaxValue)
    ) {
      interestRateError.style.display = 'block';
    } else {
      interestRateError.style.display = 'none';
    }
  });
  intRateSlider.addEventListener('input', function () {
    if (
      parseFloat(this.value) < parseFloat(interestrateMinValue)
      || parseFloat(this.value) > parseFloat(interestrateMaxValue)
    ) {
      interestRateError.style.display = 'block';
    } else {
      interestRateError.style.display = 'none';
    }
  });

  // error for year
  loanPeriodText.addEventListener('input', function () {
    if (
      parseFloat(this.value) < parseFloat(tenureMinYearvalue)
      || parseFloat(this.value) > parseFloat(tenureMaxYearvalue)
    ) {
      loanPeriodError.style.display = 'block';
    } else {
      loanPeriodError.style.display = 'none';
    }
  });

  loanPeriodSlider.addEventListener('input', function () {
    if (
      parseFloat(this.value) < parseFloat(tenureMinYearvalue)
      || parseFloat(this.value) > parseFloat(tenureMaxYearvalue)
    ) {
      loanPeriodError.style.display = 'block';
    } else {
      loanPeriodError.style.display = 'none';
    }
  });

  // error for month
  loanPeriodTextMonth.addEventListener('input', function () {
    if (
      parseFloat(this.value) < parseFloat(tenureMinMonthValue)
      || parseFloat(this.value) > parseFloat(tenureMaxMonthValue)
    ) {
      loanPeriodMonthError.style.display = 'block';
    } else {
      loanPeriodMonthError.style.display = 'none';
    }
  });

  loanPeriodSliderMonth.addEventListener('input', function () {
    if (
      parseFloat(this.value) < parseFloat(tenureMinMonthValue)
      || parseFloat(this.value) > parseFloat(tenureMaxMonthValue)
    ) {
      loanPeriodMonthError.style.display = 'block';
    } else {
      loanPeriodMonthError.style.display = 'none';
    }
  });

  loanAmtSlider.value = removeCommaAndConvertToInt(loanAmountMinValue);
  // console.log(formatNumberToIndianCommas(loanAmountMinValue))
  loanAmtText.value = formatNumberToIndianCommas(loanAmountMinValue);
  P = removeCommaAndConvertToInt(loanAmountMinValue);

  intRateSlider.value = interestrateMinValue;
  intRateText.value = interestrateMinValue;
  R = parseFloat(interestrateMinValue);

  loanPeriodSlider.value = tenureMinYearvalue;
  loanPeriodText.value = tenureMinYearvalue;
  N = parseFloat(tenureMinYearvalue);

  loanPeriodSliderMonth.value = tenureMinMonthValue;
  loanPeriodTextMonth.value = tenureMinMonthValue;
  M = parseFloat(tenureMinMonthValue);

  // line = new Chart(document.getElementById('lineChart'), {
  //   data: {
  //     labels: [],
  //     datasets: [
  //       {
  //         label: 'Principal',
  //         backgroundColor: 'rgba(140, 177, 51, 1)',
  //         borderColor: 'rgba(140, 177, 51, 1)',
  //         data: [],
  //       },
  //       {
  //         label: 'Interest',
  //         backgroundColor: 'rgba(59, 59, 59, 1)',
  //         borderColor: 'rgba(59, 59, 59, 1)',
  //         data: [],
  //       },
  //     ],
  //   },
  //   type: 'line',
  //   options: {
  //     scales: {
  //       y: {
  //         ticks: {
  //           callback(val) {
  //             return val.toLocaleString('en-IN', {
  //               style: 'currency',
  //               currency: 'INR',
  //             });
  //           },
  //         },
  //       },
  //     },
  //   },
  // });

  pie = new Chart(document.getElementById('pieChart'), {
    type: 'doughnut',
    data: {
      //   labels: ['Principal', 'Interest'],
      datasets: [
        {
          data: [P, 0],
          backgroundColor: ['rgba(140, 177, 51, 1)', 'rgba(59, 59, 59, 1)'],
          hoverOffset: 4,
          borderWidth: 15,
        },
      ],
    },
    options: {
      cutoutPercentage: 30,
      responsive: true,
      maintainAspectRatio: false,
    },
  });

  displayDetails(P, R, N, M, pie, block);
}

export default async function decorate(block) {
  initialize(block);
}
