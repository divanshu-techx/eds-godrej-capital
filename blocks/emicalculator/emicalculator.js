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


function removeCommaAndConvertToInt(numberString) {
    // Remove commas from the number string
    let cleanedString = numberString.replace(/,/g, '');

    // Convert the cleaned string to an integer
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
function getDataAttributeValueByName(name) {
    const element = document.querySelector(`[data-${name}]`);
    return element ? element.getAttribute(`data-${name}`) : null;
}
 
function createElement(type, attributes = {}, ...children) {
    const element = document.createElement(type);
    for (const [key, value] of Object.entries(attributes)) {
        element.setAttribute(key, value);
    }
    for (const child of children) {
        if (typeof child === "string") {
            element.appendChild(document.createTextNode(child));
        } else {
            element.appendChild(child);
        }
    }
    return element;
}
 
//error message
function createErrorSpan(message) {
    return createElement('span', { class: 'error-message', style: 'color: red; display: none;' }, message);
}
 
function calculateLoanDetails(p, r, emi, n, m,line) {
    let totalInterest = 0;
    let yearlyInterest = [];
    let yearPrincipal = [];
    let years = [];
    let year = 1;
    let [counter, principal, interest] = [0, 0, 0];
    let totalMonths = n * 12 + m;
    for (let i = 0; i < totalMonths; i++) {
        let monthlyInterest = p * r;
        p = p - (emi - monthlyInterest);
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
 
function displayDetails(P,R,N,M,line,pie,block) {
    let r = parseFloat(R) / 1200;
    let n = parseFloat(N);
    let m = parseFloat(M);
    let totalMonths = n * 12 + m;
 
    let num = P * r * Math.pow(1 + r, totalMonths);
    let denom = Math.pow(1 + r, totalMonths) - 1;
    let emi = num / denom;
 
    let payableInterest = calculateLoanDetails(P, r, emi, n, m,line);
 
    let opts = { style: "currency", currency: "INR", maximumFractionDigits: 0 };
 
    block.querySelector("#cp").innerText =
        P.toLocaleString("en-IN", opts);
 
    block.querySelector("#ci").innerText =
        payableInterest.toLocaleString("en-IN", opts);
 
    block.querySelector("#tenure-interest").innerText =
        payableInterest.toLocaleString("en-IN", opts);
 
    block.querySelector("#ct").innerText =
        (P + payableInterest).toLocaleString("en-IN", opts);
 
       
    block.querySelector("#tenure-amount").innerText =
    (P + payableInterest).toLocaleString("en-IN", opts);
 
    block.querySelector("#price").innerText =
        emi.toLocaleString("en-IN", opts);
 
    block.querySelector("#tenure-price").innerText =
        emi.toLocaleString("en-IN", opts);
 
    block.querySelector("#rate").innerText =
        R.toLocaleString("en-IN", R) + "%";
 
    block.querySelector("#tenure-rate").innerText =
        "@" + R.toLocaleString("en-IN", R) + "%";
 
    block.querySelector("#monthTenure").innerText =
        M.toLocaleString("en-IN", M + 'M');
   
    block.querySelector("#mobile-monthTenure").innerText =
        N.toLocaleString("en-IN", M + 'M');
 
    block.querySelector("#yearTenure").innerText =
        N.toLocaleString("en-IN", N + 'Y');
 
    block.querySelector("#mobile-yearTenure").innerText =
        N.toLocaleString("en-IN", N + 'Y');
 
    block.querySelector("#mobile-monthTenure").innerText =
        N.toLocaleString("en-IN", M + 'M');
 
    pie.data.datasets[0].data[0] = P;
    pie.data.datasets[0].data[1] = payableInterest;
    pie.update();
    // line.update();
}
 
function initialize(block) {
    const loanAmountMaxValue = getDataAttributeValueByName('loan-amount-max-value');
    const loanAmountMinValue = getDataAttributeValueByName('loan-amount-min-value');
    const laonamount_title = getDataAttributeValueByName('loan-amount-title');
    const interestrate_maxvalue = getDataAttributeValueByName('interest-rate-max-value');
    const interestrate_minvalue = getDataAttributeValueByName('interest-rate-min-value');
    const interestrate_title = getDataAttributeValueByName('Interest-rate-title');
    const tenure_title_year = getDataAttributeValueByName('tenure-title-year');
    const tenure_min_yearvalue = getDataAttributeValueByName('tenure-min-year-value');
    const tenure_max_yearvalue = getDataAttributeValueByName('tenure-max-year-value');
    const tenure_title_months = getDataAttributeValueByName('tenure-title-months');
    const tenure_min_monthvalue = getDataAttributeValueByName('tenure-min-month-value');
    const tenure_max_monthvalue = getDataAttributeValueByName('tenure-max-month-value');
    const principal_amount_label=  getDataAttributeValueByName('principal-amount-label');
    const interest_payable_label=  getDataAttributeValueByName('Interest-payable-label');
    const total_amount_payable_label =  getDataAttributeValueByName('total-amount-payable-label');
    const interest_rate_label  =  getDataAttributeValueByName('interest-rate-label');
    const total_tenure_label   =  getDataAttributeValueByName('total-tenure-label');
    const apply_now_label    =  getDataAttributeValueByName('apply-now-label');
    const monthly_emi_label     =  getDataAttributeValueByName('monthly-emi-label')
    const amountDetail = createElement('div', {},
        createElement('div', { class: 'detail' },
            //createElement('div', { style: 'color: #3b3b3b; font-size:16px;font-weight:400' }, laonamount_title),
            createElement('div', { class:'title' }, laonamount_title),
            createElement('div', { class: "inputDetail" },
                createElement('span', { class: "rupeeSpan" }, "Rs."),
                createElement('input', { id: 'loan-amt-text', type: 'text', min: loanAmountMinValue, max: loanAmountMaxValue,  style: 'color: #3b3b3b; font-size:14px;font-weight:400' })
            )
        ),
        createElement('input', { type: 'range', id: 'loan-amount', min: loanAmountMinValue, max: loanAmountMaxValue, }),
        createElement('div', { class: 'range-values' },
            createElement('div', { class: 'min-value' }, numberToWords(loanAmountMinValue)),
            createElement('div', { class: 'max-value', style: 'float: right;' }, numberToWords(loanAmountMaxValue))
          )
    );
 
    const interestDetail = createElement('div', {},
        createElement('div', { class: 'detail' },
            // createElement('div', { style: 'color: #3b3b3b; font-size:16px;font-weight:400' }, interestrate_title),
            createElement('div', { class:'title' }, interestrate_title),
            createElement('div', { class: "inputDetail" },
                createElement('span', { class: "percentSpan" }, "%"),
                createElement('input', { id: 'interest-rate-text', type: 'number', min: interestrate_minvalue, max: interestrate_maxvalue,  style: 'color: #3b3b3b; font-size:14px;font-weight:400' })
            )
        ),
        createElement('input', { type: 'range', id: 'interest-rate', min: interestrate_minvalue, max: interestrate_maxvalue}),
        createElement('div', { class: 'range-values' },
            createElement('div', { class: 'min-value' }, interestrate_minvalue + "%"),
            createElement('div', { class: 'max-value', style: 'float: right;' }, interestrate_maxvalue + "%"))
    );
 
    const tenureYearsDetail = createElement('div', {},
        createElement('div', { class: 'detail' },
            // createElement('div', { style: 'color: #3b3b3b; font-size:16px;font-weight:400' }, tenure_title_year),
            createElement('div', { class:'title' }, tenure_title_year),
            createElement('div', { class: "inputDetail" },
                createElement('span', { class: "yearSpan" }, "Yrs."),
                createElement('input', { id: 'loan-period-text', type: 'number', min: tenure_min_yearvalue, max: tenure_max_yearvalue, style: 'color: #3b3b3b; font-size:14px;font-weight:400' })
            )
        ),
        createElement('input', { type: 'range', id: 'loan-period', min: tenure_min_yearvalue, max: tenure_max_yearvalue}),
        createElement('div', { class: 'range-values' },
            createElement('div', { class: 'min-value' }, tenure_min_yearvalue + " Year"),
            createElement('div', { class: 'max-value', style: 'float: right;' }, tenure_max_yearvalue + " Years"))
    );
 
    const tenureMonthsDetail = createElement('div', {},
        createElement('div', { class: 'detail' },
            // createElement('div', { style: 'color: #3b3b3b; font-size:16px;font-weight:400' }, tenure_title_months),
            createElement('div', { class:'title' }, tenure_title_months),
            createElement('div', { class: "inputDetail" },
                createElement('span', { class: "monthSpan" }, "Mos."),
                createElement('input', { id: 'loan-period-month-text', type: 'number', min: tenure_min_monthvalue, max: tenure_max_monthvalue, style: 'color: #3b3b3b; font-size:14px;font-weight:400' })
            )
        ),
        createElement('input', { type: 'range', id: 'loan-period-month', min: tenure_min_monthvalue, max: tenure_max_monthvalue}),
        createElement('div', { class: 'range-values' },
            createElement('div', { class: 'min-value' }, tenure_min_monthvalue + " Month"),
            createElement('div', { class: 'max-value', style: 'float: right;' }, tenure_max_monthvalue + " Months"))
    );
 
    const details = createElement('div', { class: 'details' },
        amountDetail, interestDetail, tenureYearsDetail, tenureMonthsDetail
    );
 
    const footer = createElement('div', { class: 'footer' },
        createElement('div', { style: 'chart-details' },
            createElement('div', { id: 'price-container-emi', style: 'color:#3b3b3b' }, monthly_emi_label ,
                createElement('div', { id: 'price' }, '0'),
            )
        )
    );
 
    const view = createElement('div', { class: 'view' }, details);
 
    const loanDetailsUpper = createElement('div', { class: 'loan-details-upper' },
      createElement('div', { class: 'chart-details' },
        createElement('div', { class: 'chart-detail-adjust' },
            createElement('span',{ class:'details-span-principal'},' '),
            createElement('div', { class:'detailsloan', style: 'color: #000000; font-size: 16px; font-weight:400;margin-left:10px;' }, principal_amount_label),
        ),
         
          createElement('div', { id: 'cp', style: 'color: #3B3B3B; font-size: 24px; font-weight:400;' })
      ),
      createElement('div', { class: 'chart-details' },
        createElement('div', { class: 'chart-detail-adjust' },
            createElement('span',{ class:'details-span-interest'},''),
            createElement('div', { class:'detailsloan', style: 'color: #000000; font-size: 16px; font-weight:400;margin-left:10px;' }, interest_payable_label),
        ),
          createElement('div', { id: 'ci', style: 'color: #3B3B3B; font-size: 24px; font-weight:400;' })
      ),
  );
 
    const breakup = createElement('div', { class: 'breakupdesktop' },
        createElement('div', { class: "chartDetails" },
              createElement('div',{class:'canvasDetail'},
            createElement('canvas', { id: 'pieChart' }),
            createElement('div', { id: 'canvasItems' },
                createElement('div', { class: 'intrest' },
                    createElement('div', { style: 'color: #000;font-size:14px;font-weight:300;' }, interest_rate_label),
                    createElement('div', { id: 'rate' })
                ),
                createElement('div', { class: 'tenure' },
                    createElement('div', { style: 'color: #000;font-size:14px;font-weight:300;' }, total_tenure_label),
                    createElement('span', { id: 'yearTenure' }), 'Y', ' | ',
                    createElement('span', { id: 'monthTenure' }), 'M'
                ),
            )),
            loanDetailsUpper,
          ),
    );
 
 
 
    const loanDetails = createElement('div', { class: 'loan-details' },
        createElement('div', { class: 'chart-details' },
            createElement('div', { style: 'color: #000000; font-size:16px;font-weight:400' }, total_amount_payable_label),
            createElement('div', { id: 'ct' })
        ),
        footer,
        createElement('div', { class: 'chart-details' },
            createElement('button', { id: 'apply-btn' }, apply_now_label),
        ),
    );
 
    breakup.append(loanDetails);
 
 
    //mobile breakup
    const mobileBreakup = createElement('div', { class: 'mobile-breakup' },
        createElement('div',{class:'mobile-breakup-left'},
            createElement('div', { class: 'tenure' },
                createElement('div', { style: 'color: #111111;font-size:14px;font-weight:500;' }, total_tenure_label),
                createElement('div',{class:'mobile-tenure-monthYear'},
                createElement('span', { id: 'mobile-yearTenure' }), 'Years', ' ',
                createElement('span', { id: 'mobile-monthTenure' }), 'Months'
                ),
            ),
            createElement('div',{class:'mobile-tenure-amount'},
                createElement('div',{class:'mobile-tenure-amount-label'},total_amount_payable_label),
                createElement('div', { id: 'tenure-amount', class:'mobile-tenure-amount-detail' })
            ),
            createElement('div',{class:'mobile-tenure-interest'},
                createElement('div',{class:'mobile-tenure-interest-label'},interest_payable_label),
                createElement('div', { id: 'tenure-interest', style: 'color: #757575;font-size:12px;font-weight:400;' })
            ),
        ),
        createElement('div',{class:'mobile-breakup-right'},
            createElement('div',{class:'mobile-tenure-right'},
                createElement('div',{class:'mobile-tenure-emi'},
                createElement('div',{class:'mobile-tenure-emi-label'},monthly_emi_label),
                createElement('div', { id: 'tenure-rate',class:'mobile-tenure-interest-rate' }),
                ),
                createElement('div',{class:'mobile-tenure-emi-details'},
                    createElement('h2', { id: 'tenure-price',class:'mobile-tenure-emi-price' },),
                )
            ),
            createElement('div',{class:'mobile-tenure-apply'},
                createElement('button',{id:'apply-btn'},apply_now_label)
            )
        )
    );
 
 
    const subContainer = createElement('div', { class: 'sub-container' }, view, breakup,mobileBreakup);
   
    block.append(subContainer);
 
    var P, R, N, M, pie, line;
    var loan_amt_slider = block.querySelector("#loan-amount");
  //   console.log(loan_amt_slider);
    var loan_amt_text = block.querySelector("#loan-amt-text");
    console.log(loan_amt_text);
    var int_rate_slider = block.querySelector("#interest-rate");
    var int_rate_text = block.querySelector("#interest-rate-text");
    var loan_period_slider = block.querySelector("#loan-period");
    var loan_period_text = block.querySelector("#loan-period-text");
    var loan_period_slider_month = block.querySelector("#loan-period-month");
    var loan_period_text_month = block.querySelector("#loan-period-month-text");
 
 
    loan_amt_slider.addEventListener("change", (self) => {
       // loan_amt_text.value = formatNumberWithCommas(self.target.value);
        loan_amt_text.value = formatNumberToIndianCommas(self.target.value);
        P = removeCommaAndConvertToInt(self.target.value);
        displayDetails(P,R,N,M,line,pie,block);
    });
 
    loan_amt_text.addEventListener("blur", (self) => {
        // console.log(self.target.value);
        loan_amt_slider.value = removeCommaAndConvertToInt(self.target.value);
        loan_amt_text.value = formatNumberToIndianCommas(self.target.value);
        P = removeCommaAndConvertToInt(self.target.value);
        displayDetails(P,R,N,M,line,pie,block);
    });

        // Event listener to allow only numeric input
        loan_amt_text.addEventListener('input', function(event) {
            let value = this.value;
            value = value.replace(/[^\d.]/g, ''); // Remove non-numeric characters except '.'
            this.value = value;
        });

    int_rate_slider.addEventListener("change", (self) => {
        int_rate_text.value = self.target.value;
        R = parseFloat(self.target.value);
        displayDetails(P,R,N,M,line,pie,block);
    });
 
    int_rate_text.addEventListener("blur", (self) => {
        int_rate_slider.value = self.target.value;
        R = parseFloat(self.target.value);
        displayDetails(P,R,N,M,line,pie,block);
    });
 
    loan_period_slider.addEventListener("change", (self) => {
        loan_period_text.value = self.target.value;
        N = parseFloat(self.target.value);
        displayDetails(P,R,N,M,line,pie,block);
    });
 
    loan_period_text.addEventListener("blur", (self) => {
        loan_period_slider.value = self.target.value;
        N = parseFloat(self.target.value);
        displayDetails(P,R,N,M,line,pie,block);
    });
 
    loan_period_slider_month.addEventListener("change", (self) => {
        loan_period_text_month.value = self.target.value;
        M = parseFloat(self.target.value);
        displayDetails(P,R,N,M,line,pie,block);
    });
 
    loan_period_text_month.addEventListener("blur", (self) => {
        loan_period_slider_month.value = self.target.value;
        M = parseFloat(self.target.value);
        displayDetails(P,R,N,M,line,pie,block);
    });
 
        //for slider color event listener
 
        loan_amt_slider.addEventListener('input', function() {
            const value = this.value;
            const maxValue = this.max; // Get the maximum value of the range input
            const percentage = (value / maxValue) * 100;
            this.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, #fff ${percentage}%, white 100%)`
          })
     
          loan_amt_text.addEventListener('input', function() {
            const value = this.value;
            const maxValue = this.max; // Get the maximum value of the range input
            const percentage = (value / maxValue) * 100;
            // console.log(value);
            loan_amt_slider.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, #fff ${percentage}%, white 100%)`
          })
     
     
          int_rate_slider.addEventListener('input', function() {
            const value = this.value;
            const percentage = ((value - interestrate_minvalue) / (interestrate_maxvalue - interestrate_minvalue)) * 100;
             
            // Update the background gradient with the calculated percentage
            this.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, #fff ${percentage}%, white 100%)`
          });
         
          int_rate_text.addEventListener('input', function() {
            const value = this.value;
            const percentage = ((value - interestrate_minvalue) / (interestrate_maxvalue - interestrate_minvalue)) * 100;
            // Update the background gradient with the calculated percentage
            int_rate_slider.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, #fff ${percentage}%, white 100%)`
          });
     
          loan_period_slider.addEventListener("input", function() {
            const value = this.value;
            const percentage = ((value - tenure_min_yearvalue) / (tenure_max_yearvalue - tenure_min_yearvalue)) * 100;  
            // Update the background gradient with the calculated percentage
            this.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, #fff ${percentage}%, white 100%)`;
          });
     
          loan_period_text.addEventListener("input", function() {
            const value = this.value;
            const percentage = ((value - tenure_min_yearvalue) / (tenure_max_yearvalue - tenure_min_yearvalue)) * 100;
            // Update the background gradient with the calculated percentage
            loan_period_slider.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, #fff ${percentage}%, white 100%)`;
          });
     
          loan_period_slider_month.addEventListener("input", function() {
            const value = this.value;
            const percentage = ((value - tenure_min_monthvalue) / (tenure_max_monthvalue - tenure_min_monthvalue)) * 100;  
            // Update the background gradient with the calculated percentage
            this.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, #fff ${percentage}%, white 100%)`;
          });
     
          loan_period_text_month.addEventListener("input", function() {
            const value = this.value;
            const percentage = ((value - tenure_min_monthvalue) / (tenure_max_monthvalue - tenure_min_monthvalue)) * 100;
            // Update the background gradient with the calculated percentage
            loan_period_slider_month.style.background = `linear-gradient(to right, #8cb133 0%, #8cb133 ${percentage}%, #fff ${percentage}%, white 100%)`;
          });
     
    // Error message spans
    const loanAmtError = createErrorSpan("Value should be between " + formatNumberToIndianCommas(loanAmountMinValue) + " and " + formatNumberToIndianCommas(loanAmountMaxValue));
    const interestRateError = createErrorSpan("Value should be between " + interestrate_minvalue + "% and " + interestrate_maxvalue + "%");
    const loanPeriodError = createErrorSpan("Value should be between " + tenure_min_yearvalue + " and " + tenure_max_yearvalue);
    const loanPeriodMonthError = createErrorSpan("Value should be between " + tenure_min_monthvalue + " and " + tenure_max_monthvalue);
 
    // Append error message spans to their respective input containers
    amountDetail.appendChild(loanAmtError);
    interestDetail.appendChild(interestRateError);
    tenureYearsDetail.appendChild(loanPeriodError);
    tenureMonthsDetail.appendChild(loanPeriodMonthError);
 
    // Event listeners for input elements to validate input values
 
    //error for loan amount
    loan_amt_text.addEventListener("input", function () {
        if (removeCommaAndConvertToInt(this.value) < removeCommaAndConvertToInt(loanAmountMinValue) || removeCommaAndConvertToInt(this.value) > removeCommaAndConvertToInt(loanAmountMaxValue)) {
            loanAmtError.style.display = "block";
        } else {
            loanAmtError.style.display = "none";
        }
    });
   
 
    //error for loan amount
    int_rate_text.addEventListener("input", function () {
        if (parseFloat(this.value) < parseFloat(interestrate_minvalue) || parseFloat(this.value) > parseFloat(interestrate_maxvalue)) {
            interestRateError.style.display = "block";
        } else {
            interestRateError.style.display = "none";
        }
    });
 
    //error for year
    loan_period_text.addEventListener("input", function () {
        if (parseFloat(this.value) < parseFloat(tenure_min_yearvalue) || parseFloat(this.value) > parseFloat(tenure_max_yearvalue)) {
            loanPeriodError.style.display = "block";
        } else {
            loanPeriodError.style.display = "none";
        }
    });
 
    //error for month
    loan_period_text_month.addEventListener("input", function () {
        if (parseFloat(this.value) < parseFloat(tenure_min_monthvalue) || parseFloat(this.value) > parseFloat(tenure_max_monthvalue)) {
            loanPeriodMonthError.style.display = "block";
        } else {
            loanPeriodMonthError.style.display = "none";
        }
    });

    loan_amt_slider.value = removeCommaAndConvertToInt(loanAmountMinValue);
    // console.log(formatNumberToIndianCommas(loanAmountMinValue))
    loan_amt_text.value = formatNumberToIndianCommas(loanAmountMinValue);
    P = removeCommaAndConvertToInt(loanAmountMinValue);
 
    int_rate_slider.value = interestrate_minvalue;
    int_rate_text.value = interestrate_minvalue;
    R = parseFloat(interestrate_minvalue);
 
    loan_period_slider.value = tenure_min_yearvalue;
    loan_period_text.value = tenure_min_yearvalue;
    N = parseFloat(tenure_min_yearvalue);
 
    loan_period_slider_month.value = tenure_min_monthvalue;
    loan_period_text_month.value = tenure_min_monthvalue;
    M = parseFloat(tenure_min_monthvalue);
 
    line = new Chart(document.getElementById("lineChart"), {
        data: {
            labels: [],
            datasets: [
                {
                    label: "Principal",
                    backgroundColor: "rgba(140, 177, 51, 1)",
                    borderColor: "rgba(140, 177, 51, 1)",
                    data: [],
                },
                {
                    label: "Interest",
                    backgroundColor: "rgba(59, 59, 59, 1)",
                    borderColor: "rgba(59, 59, 59, 1)",
                    data: [],
                },
            ],
        },
        type: "line",
        options: {
            scales: {
                y: {
                    ticks: {
                        callback: function (val) {
                            return val.toLocaleString("en-IN", {
                                style: "currency",
                                currency: "INR",
                            });
                        },
                    },
                },
            },
        },
    });
 
    pie = new Chart(document.getElementById("pieChart"), {
        type: "doughnut",
        data: {
          //   labels: ["Principal", "Interest"],
            datasets: [
                {
                    data: [P, 0],
                    backgroundColor: ["rgba(140, 177, 51, 1)", "rgba(59, 59, 59, 1)"],
                    hoverOffset: 4,
                    borderWidth: 15,
                },
            ],
        },
        options: {
            cutoutPercentage: 30,
            responsive: true,
            maintainAspectRatio: false,
        }    
    });
 
    displayDetails(P,R,N,M,line,pie,block);
}
 
export default async function decorate(block) {
 
  initialize(block);
}