function createTD(text, tableRow, hideIfSmall) {

  var td = document.createElement("td");
  if (hideIfSmall) {
    td.className = "small-screen";
  }
  var text = document.createTextNode(text);
  td.append(text);
  tableRow.append(td);
}

function buildLoan() {

  var loanAmount = document.getElementById("loanAmount");
  var interestRate = document.getElementById("interestRate");
  var numberOfPayments = document.getElementById("numberOfPayments");
  var startDate = document.getElementById("startDate");
  var loan = new Object();
  loan.amount = loanAmount.value;
  loan.interest = interestRate.value;
  loan.payments = numberOfPayments.value;
  loan.startDate = startDate.valueAsDate;
  if (loan.startDate == null) {
    loan.startDate = new Date();
    startDate.valueAsDate = loan.startDate;
  }
  loan.startDate = addMonthsUTC(loan.startDate, 1);
  return loan;
}

function buildTable(paymentData, tableBody){

  paymentData.payments.forEach(payment => {
    var tr = document.createElement("tr");
    createTD(payment.paymentNumber, tr, true);
    createTD(formatDollar(payment.beginningBalance), tr, false);
    createTD(formatDollar(payment.amount), tr, false);
    createTD(formatDollar(payment.principal), tr, false);
    createTD(formatDollar(payment.interest), tr, false);
    createTD(formatDollar(payment.totalInterest), tr, true);
    createTD(formatDollar(payment.balance), tr, true);
    createTD(payment.dueDate.toLocaleDateString(undefined), tr);
    tableBody.append(tr);
  });
}

function checkAndBuildAmortization() {

  var loanItem = document.getElementById("loanItem");
  var summaryElement = document.getElementById("summaryInfo");
  var amortDiv = document.getElementById("amortDiv");
  var tableBody = document.getElementById("tableBody");
  var loanAmount = document.getElementById("loanAmount");
  var interestRate = document.getElementById("interestRate");
  tableBody.innerHTML = "";
  if (loanAmount.checkValidity() && loanAmount.value.length > 0 && interestRate.checkValidity() &&
    interestRate.value.length > 0 && numberOfPayments.checkValidity() && numberOfPayments.value.length > 0) {

    amortDiv.style.visibility = "visible";
    var paymentData = calculate(buildLoan());
    buildTable(paymentData, tableBody);

    var summaryString = "";
    if (loanItem.value != null && loanItem.value.length > 0) {
      summaryString += loanItem.value + "<br\>";
    }

    summaryString += "Monthly Payment: " + formatDollar(paymentData.payment.amount) + ", Total Interest: " + formatDollar(paymentData.payment.interest) + ".";
    summaryString += "<br/><span class='print-only'>Loan Amount: " + formatDollar(parseInt(loanAmount.value, 10)) + ", Interest Rate: " + interestRate.value + "%.</span>";
    summaryElement.innerHTML = summaryString;
  } else {
    amortDiv.style.visiblity = "hidden";
    summaryElement.innerHTML = "";
  }
}
